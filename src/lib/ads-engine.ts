import "server-only";
import { angles, productHooks, type AdAngle } from "@/content/ad-copy";
import { templateCopy, writeAdCopy } from "./ad-writer";
import { generateScenes, groupScore, listCreativeGroups, type CreativeGroup } from "./ad-images";
import { minImageScore, qaConfigured, reviewAd } from "./ad-qa";
import { getProduct } from "./catalog";
import { META_PIXEL_ID } from "./meta";
import * as meta from "./meta-ads";
import { primaryImage, type Product } from "./products";
import { routes } from "./routes";
import { site } from "./site";
import { supabaseAdmin, supabaseConfigured } from "./supabase";

/**
 * Annonsmotorn: skapar testkampanjer (bild × textvinkel, upp till 10 annonser per produkt),
 * granskar dem enligt fasta regler och itererar nya annonser från vinnare.
 * Allt skapas pausat om inget annat anges. Beloppen är i annonskontots valuta (USD).
 */

export const rules = {
  /** Dagar som en testkampanj får samla data innan vinnare väljs. */
  testDays: 6,
  /** Antal annonser som behålls efter testperioden. */
  keepWinners: 3,
  /** Under testet: så mycket måste en annons kostat innan den kan pausas i förtid. */
  killMinSpend: 8,
  /** … och pausas då om CTR (%) är under detta och den inte gett någon "lägg i varukorg". */
  killMaxCtr: 1.0,
  /** Målkostnad per köp. Annons som kostat 2× detta utan köp pausas. */
  targetCpa: 25,
  /** ROAS som krävs (senaste 3 dagarna) för att höja budgeten. */
  targetRoas: 2.0,
  /** Budgethöjning per granskning. */
  scaleStep: 0.2,
  /** Tak för daglig budget per annonsgrupp. */
  scaleMaxDaily: 50,
  /** Sänkning när en skalad annonsgrupp slutar leverera. */
  shrinkStep: 0.3,
  minDaily: 5,
  /** Nya annonser per vinnare vid iteration: hälften ny text på samma bild, hälften ny bild på samma text. */
  iterationsPerWinner: 4,
};

export const TEST_PREFIX = "Test · ";

const today = () => new Date().toISOString().slice(0, 10);
const daysAgo = (n: number) => new Date(Date.now() - n * 864e5).toISOString().slice(0, 10);
const ageDays = (iso: string) => (Date.now() - new Date(iso).getTime()) / 864e5;

export type Decision = {
  level: "campaign" | "adset" | "ad";
  id: string;
  name: string;
  action: "pause" | "activate" | "budget" | "keep" | "iterate" | "note";
  reason: string;
  metrics?: Record<string, number | null>;
  budget?: number;
  campaignId?: string;
  adsetId?: string;
};

async function log(rows: { decision: Decision; applied: boolean; source: string }[]) {
  if (!supabaseConfigured() || rows.length === 0) return;
  await supabaseAdmin()
    .from("ad_log")
    .insert(
      rows.map(({ decision: d, applied, source }) => ({
        campaign_id: d.campaignId ?? (d.level === "campaign" ? d.id : null),
        adset_id: d.adsetId ?? (d.level === "adset" ? d.id : null),
        ad_id: d.level === "ad" ? d.id : null,
        name: d.name,
        action: d.action,
        reason: d.reason,
        metrics: d.metrics ?? null,
        applied,
        source,
      })),
    );
}

/* ---------------------------------- Media ---------------------------------- */

/** En bilduppsättning för en annons: flödesbild + ev. storybild, redan uppladdade till Meta. */
type Media = { label: string; groupId: string | null; feedHash: string; storyHash?: string; feedUrl: string };

const hashCache = new Map<string, string>();
async function hashFor(url: string, name: string) {
  const cached = hashCache.get(url);
  if (cached) return cached;
  const hash = await meta.uploadImage(url, name);
  hashCache.set(url, hash);
  return hash;
}

/**
 * Samlar produktens annonsbilder: genererade/uppladdade grupper först, sedan packshots.
 * mediaBase används för packshots (relativa sökvägar), grupperna har redan publika URL:er.
 */
async function collectMedia(product: Product, mediaBase: string, notes: string[], onlyGroups?: string[]): Promise<Media[]> {
  const media: Media[] = [];
  const groups = (await listCreativeGroups(product.slug)).filter((g) => g.feed || g.story).filter((g) => !onlyGroups || onlyGroups.includes(g.groupId));
  for (const g of groups) {
    // Bara bilder som klarat AI-granskningen (eller inte granskats alls) får användas
    const score = groupScore(g);
    if (score !== null && score < minImageScore()) {
      notes.push(`${g.label} hoppas över (bildpoäng ${score})`);
      continue;
    }
    try {
      const feedSrc = g.feed ?? g.story!;
      const feedHash = await hashFor(feedSrc.url, `${product.slug}-${g.groupId}-feed`);
      const storyHash = g.story && g.feed ? await hashFor(g.story.url, `${product.slug}-${g.groupId}-story`) : undefined;
      media.push({ label: g.label, groupId: g.groupId, feedHash, storyHash, feedUrl: feedSrc.url });
    } catch (e) {
      notes.push(`${g.label}: ${e instanceof Error ? e.message : e}`);
    }
  }
  if (!onlyGroups) {
    // Endast framsidan som packshot – aldrig baksidan
    const path = primaryImage(product);
    if (!path.endsWith(".svg")) {
      const url = path.startsWith("http") ? path : `${mediaBase}${path}`;
      try {
        media.push({ label: "packshot", groupId: null, feedHash: await hashFor(url, `${product.slug}-packshot`), feedUrl: url });
      } catch (e) {
        notes.push(`Packshot: ${e instanceof Error ? e.message : e}`);
      }
    }
  }
  return media;
}

async function makeAd(o: { product: Product; angle: AdAngle; media: Media; hook: string; adsetId: string; campaignId: string; link: string; status: "ACTIVE" | "PAUSED"; parentAdId?: string; notes?: string[] }) {
  const pageId = process.env.META_PAGE_ID!;
  const name = `${o.angle.id} · ${o.media.label}`;
  // Texten skrivs av AI i vinkelns anda, med mallen som reserv
  let copy = await writeAdCopy({ product: o.product, angle: o.angle, hook: o.hook, notes: o.notes });
  const { primaryText, headline, description } = copy;
  // AI-granskning av hela annonsen innan den skapas. Underkänns en AI-skriven text får
  // skrivaren en chans till med granskarens synpunkter, och sedan används mallen.
  let review: Awaited<ReturnType<typeof reviewAd>> | null = null;
  let text = { primaryText, headline, description };
  if (qaConfigured()) {
    review = await reviewAd({ ...text, imageUrl: o.media.feedUrl, product: o.product });
    for (let retry = 0; review.verdict === "reject" && retry < 2 && copy.source === "ai"; retry++) {
      const why = review.issues.join("; ") || review.notes;
      o.notes?.push(`${o.angle.id} · ${o.media.label}: texten underkändes (${review.score}) – ${retry === 0 ? "skrivs om" : "mallen används"}: ${why}`);
      const next =
        retry === 0
          ? await writeAdCopy({ product: o.product, angle: o.angle, hook: o.hook, notes: o.notes, avoid: why })
          : templateCopy(o.product, o.angle, o.hook);
      text = { primaryText: next.primaryText, headline: next.headline, description: next.description };
      copy = next;
      review = await reviewAd({ ...text, imageUrl: o.media.feedUrl, product: o.product });
    }
    if (review.verdict === "reject") throw new Error(`underkänd av granskningen (${review.score}): ${review.issues.join("; ") || review.notes}`);
  }
  const { primaryText: finalText, headline: finalHeadline, description: finalDescription } = text;
  const creative = await meta.createPlacementCreative({
    name: `${o.product.slug} · ${name}`,
    pageId,
    instagramActorId: process.env.META_INSTAGRAM_ACTOR_ID || undefined,
    feedHash: o.media.feedHash,
    storyHash: o.media.storyHash,
    primaryText: finalText,
    headline: finalHeadline,
    description: finalDescription,
    link: o.link,
  });
  const ad = await meta.createAd(name, o.adsetId, creative.id, o.status);
  if (supabaseConfigured())
    await supabaseAdmin().from("ad_variants").insert({ ad_id: ad.id, campaign_id: o.campaignId, adset_id: o.adsetId, product_slug: o.product.slug, angle_id: o.angle.id, group_id: o.media.groupId, media_label: o.media.label, parent_ad_id: o.parentAdId ?? null, ad_score: review?.score ?? null, ad_review: review, primary_text: finalText, headline: finalHeadline, description: finalDescription ?? null, image_url: o.media.feedUrl, copy_source: copy.source });
  return { id: ad.id, name, score: review?.score ?? null };
}

const productLink = (product: Product, linkBase?: string) => `${(linkBase ?? (site.indexable ? site.url : "https://metilde.com")).replace(/\/$/, "")}${routes.product(product.slug)}`;

/* ------------------------------ Skapa testkampanj ------------------------------ */

export type BuildOptions = {
  slug: string;
  /** Daglig budget i kontots valuta (USD). */
  dailyBudget: number;
  /** Antal annonser (max 10). */
  adsCount?: number;
  /** Publik bas-URL där packshots kan hämtas (måste vara nåbar utifrån). */
  mediaBase?: string;
  /** Domän som annonserna länkar till. */
  linkBase?: string;
  source?: string;
};

export type BuildResult = { campaignId: string; adsetId: string; ads: { id: string; name: string; score: number | null }[]; notes: string[] };

export async function buildTestCampaign(o: BuildOptions): Promise<BuildResult> {
  if (!meta.adsConfigured()) throw new Error("META_ADS_TOKEN eller META_AD_ACCOUNT_ID saknas.");
  if (!process.env.META_PAGE_ID) throw new Error("META_PAGE_ID saknas.");
  const product = await getProduct(o.slug);
  if (!product) throw new Error(`Produkten ${o.slug} finns inte.`);

  const mediaBase = (o.mediaBase ?? site.url).replace(/\/$/, "");
  const link = productLink(product, o.linkBase);
  const adsCount = Math.min(Math.max(o.adsCount ?? 10, 1), 10);
  const notes: string[] = [];
  const media = await collectMedia(product, mediaBase, notes);
  if (media.length === 0) throw new Error("Inga bilder att annonsera med – generera scener eller kontrollera mediaBase.");

  const hooks = productHooks[product.slug] ?? [product.short];
  const campaign = await meta.createCampaign(`${TEST_PREFIX}${product.name} · ${today()}`);
  const adset = await meta.createAdSet({ name: `${TEST_PREFIX}${product.name}`, campaignId: campaign.id, dailyBudget: o.dailyBudget, pixelId: META_PIXEL_ID });

  const ads: { id: string; name: string; score: number | null }[] = [];
  const decisions: Decision[] = [{ level: "campaign", id: campaign.id, name: `${TEST_PREFIX}${product.name}`, action: "note", reason: `Testkampanj skapad (pausad), budget ${o.dailyBudget}/dag, ${media.length} bilder`, campaignId: campaign.id }];
  // Varje annons = unik kombination av bild och vinkel. Bilderna roteras så att alla används innan någon upprepas.
  let n = 0;
  let sameErrors = 0;
  let lastError = "";
  // Bilden först: varje uppsättning får en annons innan någon används igen. Vinkeln
  // förskjuts ett steg per varv, så samma par kan aldrig dyka upp två gånger.
  const combos: { angle: AdAngle; m: Media }[] = [];
  for (let round = 0; round < angles.length && combos.length < adsCount + media.length; round++)
    for (const [mi, m] of media.entries()) combos.push({ angle: angles[(mi + round) % angles.length]!, m });
  const seen = new Set<string>();
  for (const { angle, m } of combos) {
    if (n >= adsCount) break;
    // Bildgruppens id avgör vad som är samma bild – två uppsättningar kan heta lika
    const key = `${angle.id}·${m.groupId ?? m.label}`;
    if (seen.has(key)) continue;
    seen.add(key);
    try {
      const ad = await makeAd({ product, angle, media: m, hook: hooks[n % hooks.length]!, adsetId: adset.id, campaignId: campaign.id, link, status: "PAUSED", notes });
      ads.push(ad);
      decisions.push({ level: "ad", id: ad.id, name: ad.name, action: "note", reason: ad.score === null ? "Skapad (pausad)" : `Skapad (pausad), granskningspoäng ${ad.score}`, campaignId: campaign.id, adsetId: adset.id });
      n++;
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      sameErrors = msg === lastError ? sameErrors + 1 : 1;
      lastError = msg;
      notes.push(`${angle.id} · ${m.label}: ${msg}`);
      decisions.push({ level: "ad", id: `${campaign.id}-${key}`, name: `${angle.id} · ${m.label}`, action: "note", reason: `Annonsen skapades inte: ${msg}`.slice(0, 500), campaignId: campaign.id, adsetId: adset.id });
      if (sameErrors >= 3) {
        notes.push("Avbröt efter tre likadana fel.");
        decisions.push({ level: "campaign", id: campaign.id, name: `${TEST_PREFIX}${product.name}`, action: "note", reason: "Avbröt efter tre likadana fel i rad.", campaignId: campaign.id });
        break;
      }
    }
  }
  if (ads.length < adsCount) notes.push(`${ads.length} av ${adsCount} annonser skapades. ${media.length} bilduppsättningar och ${angles.length} textvinklar fanns att kombinera.`);
  await log(decisions.map((decision) => ({ decision, applied: true, source: o.source ?? "admin" })));
  return { campaignId: campaign.id, adsetId: adset.id, ads, notes };
}

/** Granskar en befintlig annons på nytt utifrån sparad text och bild. Pausar den om den underkänns. */
export async function rereviewAd(adId: string): Promise<{ score: number; verdict: string; issues: string[] }> {
  const db = supabaseAdmin();
  const v = (await db.from("ad_variants").select("product_slug,primary_text,headline,description,image_url").eq("ad_id", adId).maybeSingle()).data as { product_slug: string; primary_text: string | null; headline: string | null; description: string | null; image_url: string | null } | null;
  if (!v?.primary_text || !v.image_url) throw new Error("Annonsen saknar sparad text eller bild att granska.");
  const product = await getProduct(v.product_slug);
  if (!product) throw new Error("Produkten finns inte längre.");
  const r = await reviewAd({ primaryText: v.primary_text, headline: v.headline ?? "", description: v.description ?? undefined, imageUrl: v.image_url, product });
  await db.from("ad_variants").update({ ad_score: r.score, ad_review: r }).eq("ad_id", adId);
  if (r.verdict === "reject") await meta.setStatus(adId, "PAUSED").catch(() => undefined);
  return r;
}

/* --------------------------------- Iteration --------------------------------- */

type Variant = { ad_id: string; campaign_id: string; adset_id: string; product_slug: string; angle_id: string; group_id: string | null; media_label: string; iterated_at: string | null };

/**
 * Bygger nya annonser från en vinnare: samma bild med nya textvinklar, och samma text med nya bilder.
 * Nya bilder genereras via Higgsfield om produkten saknar oanvända scener.
 */
export async function iterateFromAd(o: { adId: string; mediaBase: string; linkBase?: string; status?: "ACTIVE" | "PAUSED"; source?: string }): Promise<{ ads: { id: string; name: string; score: number | null }[]; notes: string[] }> {
  const db = supabaseAdmin();
  const v = (await db.from("ad_variants").select("*").eq("ad_id", o.adId).maybeSingle()).data as Variant | null;
  if (!v) throw new Error("Annonsen är inte skapad av motorn, så den kan inte itereras.");
  const product = await getProduct(v.product_slug);
  if (!product) throw new Error("Produkten finns inte längre.");
  const notes: string[] = [];
  const link = productLink(product, o.linkBase);
  const hooks = productHooks[product.slug] ?? [product.short];
  const status = o.status ?? "PAUSED";
  const half = Math.ceil(rules.iterationsPerWinner / 2);
  const siblings = ((await db.from("ad_variants").select("*").eq("adset_id", v.adset_id)).data ?? []) as Variant[];
  const usedKeys = new Set(siblings.map((s) => `${s.angle_id}·${s.group_id ?? s.media_label}`));
  const ads: { id: string; name: string; score: number | null }[] = [];

  // 1) Samma bild, nya vinklar
  const allMedia = await collectMedia(product, o.mediaBase, notes);
  const winnerMedia = allMedia.find((m) => (v.group_id ? m.groupId === v.group_id : m.label === v.media_label));
  const winnerAngle = angles.find((a) => a.id === v.angle_id);
  if (winnerMedia) {
    for (const angle of angles.filter((a) => a.id !== v.angle_id && !usedKeys.has(`${a.id}·${v.group_id ?? v.media_label}`)).slice(0, half)) {
      try {
        ads.push(await makeAd({ product, angle, media: winnerMedia, hook: hooks[ads.length % hooks.length]!, adsetId: v.adset_id, campaignId: v.campaign_id, link, status, parentAdId: v.ad_id, notes }));
      } catch (e) {
        notes.push(`${angle.id}: ${e instanceof Error ? e.message : e}`);
      }
    }
  }

  // 2) Samma vinkel, nya bilder – oanvända grupper först, annars nya scener
  if (winnerAngle) {
    let fresh = allMedia.filter((m) => m.groupId && !usedKeys.has(`${v.angle_id}·${m.groupId}`));
    if (fresh.length < half) {
      try {
        const gen = await generateScenes({ slug: product.slug, count: half - fresh.length, mediaBase: o.mediaBase, parentGroupId: v.group_id ?? undefined });
        notes.push(...gen.notes);
        const extra = await collectMedia(product, o.mediaBase, notes, gen.groups.map((g: CreativeGroup) => g.groupId));
        fresh = fresh.concat(extra);
      } catch (e) {
        notes.push(`Nya scener: ${e instanceof Error ? e.message : e}`);
      }
    }
    for (const m of fresh.slice(0, half)) {
      try {
        ads.push(await makeAd({ product, angle: winnerAngle, media: m, hook: hooks[ads.length % hooks.length]!, adsetId: v.adset_id, campaignId: v.campaign_id, link, status, parentAdId: v.ad_id, notes }));
      } catch (e) {
        notes.push(`${m.label}: ${e instanceof Error ? e.message : e}`);
      }
    }
  }

  await db.from("ad_variants").update({ iterated_at: new Date().toISOString() }).eq("ad_id", v.ad_id);
  await log([
    { decision: { level: "ad", id: v.ad_id, name: `${v.angle_id} · ${v.media_label}`, action: "iterate", reason: `${ads.length} nya annonser (${status === "ACTIVE" ? "aktiva" : "pausade"}): ${ads.map((a) => a.name).join(", ") || "inga"}`, campaignId: v.campaign_id, adsetId: v.adset_id }, applied: true, source: o.source ?? "admin" },
  ]);
  return { ads, notes };
}

/* --------------------------------- Granskning --------------------------------- */

const metricsOf = (i: meta.Insight | undefined) => {
  const s = i ? meta.summarize(i) : null;
  return {
    spend: s?.spend ?? 0,
    impressions: s?.impressions ?? 0,
    clicks: s?.clicks ?? 0,
    ctr: s?.ctr ?? 0,
    addToCart: s?.addToCart ?? 0,
    purchases: s?.purchases ?? 0,
    revenue: s?.revenue ?? 0,
    roas: s?.roas ?? 0,
    cpa: s?.cpa ?? null,
  };
};

/**
 * Går igenom alla aktiva testkampanjer och föreslår (eller utför) paus, urval av vinnare,
 * iteration från vinnare och budgetändringar enligt `rules`. Returnerar besluten.
 */
export async function reviewAds(o: { apply: boolean; source: string; mediaBase?: string }): Promise<Decision[]> {
  if (!meta.adsConfigured()) throw new Error("META_ADS_TOKEN eller META_AD_ACCOUNT_ID saknas.");
  const decisions: Decision[] = [];
  const campaigns = (await meta.listCampaigns()).filter((c) => c.name.startsWith(TEST_PREFIX) && c.effective_status === "ACTIVE");
  const variants = supabaseConfigured() ? (((await supabaseAdmin().from("ad_variants").select("ad_id,iterated_at")).data ?? []) as Pick<Variant, "ad_id" | "iterated_at">[]) : [];
  const variantById = new Map(variants.map((v) => [v.ad_id, v]));

  for (const c of campaigns) {
    const age = ageDays(c.created_time);
    const since = c.created_time.slice(0, 10);
    for (const adset of await meta.listAdSets(c.id)) {
      if (adset.effective_status !== "ACTIVE") continue;
      const ads = (await meta.listAds(adset.id)).filter((a) => a.effective_status === "ACTIVE");
      const byAd = new Map((await meta.insightsRange(adset.id, since, today(), "ad")).map((i) => [i.ad_id, i]));
      const daily = Number(adset.daily_budget ?? 0) / 100;

      if (age < rules.testDays) {
        for (const ad of ads) {
          const m = metricsOf(byAd.get(ad.id));
          if (m.spend >= rules.killMinSpend && m.purchases === 0 && m.ctr < rules.killMaxCtr && m.addToCart === 0)
            decisions.push({ level: "ad", id: ad.id, name: ad.name, action: "pause", reason: `Testfas: ${m.spend.toFixed(2)} spenderat, CTR ${m.ctr.toFixed(2)} %, inga varukorgar`, metrics: m, campaignId: c.id, adsetId: adset.id });
          else if (m.spend >= rules.targetCpa * 2 && m.purchases === 0)
            decisions.push({ level: "ad", id: ad.id, name: ad.name, action: "pause", reason: `Testfas: ${m.spend.toFixed(2)} spenderat utan köp (2× mål-CPA)`, metrics: m, campaignId: c.id, adsetId: adset.id });
        }
        continue;
      }

      // Testperiod slut: behåll de bästa, pausa resten, iterera vinnarna en gång
      const ranked = ads.map((ad) => ({ ad, m: metricsOf(byAd.get(ad.id)) })).sort((a, b) => b.m.purchases - a.m.purchases || b.m.addToCart - a.m.addToCart || b.m.ctr - a.m.ctr);
      if (ads.length > rules.keepWinners) {
        ranked.forEach(({ ad, m }, idx) => {
          const keep = idx < rules.keepWinners;
          decisions.push({
            level: "ad",
            id: ad.id,
            name: ad.name,
            action: keep ? "keep" : "pause",
            reason: keep ? `Vinnare #${idx + 1}: ${m.purchases} köp, ${m.addToCart} varukorgar, CTR ${m.ctr.toFixed(2)} %` : `Testperiod slut: ${m.purchases} köp, ${m.addToCart} varukorgar, CTR ${m.ctr.toFixed(2)} %`,
            metrics: m,
            campaignId: c.id,
            adsetId: adset.id,
          });
        });
      }
      for (const { ad, m } of ranked.slice(0, rules.keepWinners)) {
        const v = variantById.get(ad.id);
        if (v && !v.iterated_at && (m.purchases > 0 || m.addToCart > 0))
          decisions.push({ level: "ad", id: ad.id, name: ad.name, action: "iterate", reason: `Vinnare med ${m.purchases} köp och ${m.addToCart} varukorgar → ${rules.iterationsPerWinner} nya varianter`, metrics: m, campaignId: c.id, adsetId: adset.id });
      }

      // Skalning på annonsgruppsnivå utifrån de senaste 3 dagarna
      const recent = metricsOf((await meta.insightsRange(adset.id, daysAgo(3), today(), "adset"))[0]);
      const week = metricsOf((await meta.insightsRange(adset.id, daysAgo(7), today(), "adset"))[0]);
      if (daily > 0 && recent.spend >= daily * 3 * 0.8 && recent.roas >= rules.targetRoas && daily < rules.scaleMaxDaily) {
        const next = Math.min(rules.scaleMaxDaily, Math.round(daily * (1 + rules.scaleStep) * 100) / 100);
        decisions.push({ level: "adset", id: adset.id, name: adset.name, action: "budget", budget: next, reason: `ROAS ${recent.roas.toFixed(2)} senaste 3 dagarna → höj budget ${daily} → ${next}`, metrics: recent, campaignId: c.id });
      } else if (daily > rules.minDaily && week.spend >= rules.targetCpa * 3 && week.purchases === 0) {
        const next = Math.max(rules.minDaily, Math.round(daily * (1 - rules.shrinkStep) * 100) / 100);
        decisions.push({ level: "adset", id: adset.id, name: adset.name, action: "budget", budget: next, reason: `${week.spend.toFixed(2)} senaste 7 dagarna utan köp → sänk budget ${daily} → ${next}`, metrics: week, campaignId: c.id });
      }
    }
  }

  if (o.apply) {
    for (const d of decisions) {
      try {
        if (d.action === "pause") await meta.setStatus(d.id, "PAUSED");
        else if (d.action === "activate") await meta.setStatus(d.id, "ACTIVE");
        else if (d.action === "budget" && d.budget) await meta.setDailyBudget(d.id, d.budget);
        else if (d.action === "iterate") {
          const r = await iterateFromAd({ adId: d.id, mediaBase: o.mediaBase ?? site.url, status: "ACTIVE", source: o.source });
          d.reason += ` → skapade ${r.ads.length}`;
        }
      } catch (e) {
        d.reason += ` (misslyckades: ${e instanceof Error ? e.message : e})`;
      }
    }
  }
  await log(decisions.filter((d) => d.action !== "keep" && !(d.action === "iterate" && o.apply)).map((decision) => ({ decision, applied: o.apply, source: o.source })));
  return decisions;
}
