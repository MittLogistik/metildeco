import "server-only";
import { angles, fillCopy, productHooks } from "@/content/ad-copy";
import { getProduct } from "./catalog";
import { META_PIXEL_ID } from "./meta";
import * as meta from "./meta-ads";
import { imagesFor } from "./products";
import { routes } from "./routes";
import { site } from "./site";
import { supabaseAdmin, supabaseConfigured } from "./supabase";

/**
 * Annonsmotorn: skapar testkampanjer (10 annonser per produkt) och granskar dem
 * enligt fasta regler. Allt skapas pausat. Beloppen är i annonskontots valuta (USD).
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
};

export const TEST_PREFIX = "Test · ";

const today = () => new Date().toISOString().slice(0, 10);
const daysAgo = (n: number) => new Date(Date.now() - n * 864e5).toISOString().slice(0, 10);
const ageDays = (iso: string) => (Date.now() - new Date(iso).getTime()) / 864e5;

export type Decision = {
  level: "campaign" | "adset" | "ad";
  id: string;
  name: string;
  action: "pause" | "activate" | "budget" | "keep" | "note";
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

/* ------------------------------ Skapa testkampanj ------------------------------ */

export type BuildOptions = {
  slug: string;
  /** Daglig budget i kontots valuta (USD). */
  dailyBudget: number;
  /** Antal annonser (max 10). */
  adsCount?: number;
  /** Publik bas-URL där bilder/video kan hämtas av Meta (måste vara nåbar utifrån). */
  mediaBase?: string;
  /** Domän som annonserna länkar till. */
  linkBase?: string;
  source?: string;
};

export type BuildResult = { campaignId: string; adsetId: string; ads: { id: string; name: string }[]; notes: string[] };

export async function buildTestCampaign(o: BuildOptions): Promise<BuildResult> {
  if (!meta.adsConfigured()) throw new Error("META_ADS_TOKEN eller META_AD_ACCOUNT_ID saknas.");
  const pageId = process.env.META_PAGE_ID;
  if (!pageId) throw new Error("META_PAGE_ID saknas.");
  const product = await getProduct(o.slug);
  if (!product) throw new Error(`Produkten ${o.slug} finns inte.`);

  const mediaBase = (o.mediaBase ?? site.url).replace(/\/$/, "");
  const linkBase = (o.linkBase ?? (site.indexable ? site.url : "https://metilde.com")).replace(/\/$/, "");
  const link = `${linkBase}${routes.product(product.slug)}`;
  const adsCount = Math.min(Math.max(o.adsCount ?? 10, 1), 10);
  const notes: string[] = [];

  // Media: video först (om den finns), sedan produktbilder. Bilder laddas upp en gång och återanvänds.
  type Media = { label: string; imageHash?: string; videoId?: string };
  const media: Media[] = [];
  const images = imagesFor(product).filter((p) => !p.endsWith(".svg")).slice(0, 4);
  const hashes: string[] = [];
  for (const [i, path] of images.entries()) {
    try {
      hashes.push(await meta.uploadImage(`${mediaBase}${path}`, `${product.slug}-${i + 1}`));
    } catch (e) {
      notes.push(`Bild ${i + 1} kunde inte laddas upp: ${e instanceof Error ? e.message : e}`);
    }
  }
  if (product.videoUrl) {
    try {
      const video = await meta.uploadVideo(`${mediaBase}${product.videoUrl}`, `${product.slug}-video`);
      let poster = hashes[0];
      if (product.videoPosterUrl) {
        try {
          poster = await meta.uploadImage(`${mediaBase}${product.videoPosterUrl}`, `${product.slug}-poster`);
        } catch {
          /* använd första bilden som poster */
        }
      }
      media.push({ label: "video", videoId: video.id, imageHash: poster });
    } catch (e) {
      notes.push(`Videon kunde inte laddas upp: ${e instanceof Error ? e.message : e}`);
    }
  }
  hashes.forEach((h, i) => media.push({ label: `bild${i + 1}`, imageHash: h }));
  if (media.length === 0) throw new Error("Ingen bild eller video kunde laddas upp – kontrollera mediaBase.");

  const hooks = productHooks[product.slug] ?? [product.short];
  const campaign = await meta.createCampaign(`${TEST_PREFIX}${product.name} · ${today()}`);
  const adset = await meta.createAdSet({ name: `${TEST_PREFIX}${product.name}`, campaignId: campaign.id, dailyBudget: o.dailyBudget, pixelId: META_PIXEL_ID });

  const ads: { id: string; name: string }[] = [];
  const decisions: Decision[] = [{ level: "campaign", id: campaign.id, name: `${TEST_PREFIX}${product.name}`, action: "note", reason: `Testkampanj skapad (pausad), budget ${o.dailyBudget}/dag`, campaignId: campaign.id }];
  // Kombinera vinkel × media tills vi har adsCount annonser. Varje kombination får en egen hook.
  let n = 0;
  let sameErrors = 0;
  let lastError = "";
  outer: for (let round = 0; round < media.length; round++) {
    for (const angle of angles) {
      if (n >= adsCount) break outer;
      const m = media[(round + angles.indexOf(angle)) % media.length]!;
      const hook = hooks[n % hooks.length]!;
      const name = `${angle.id} · ${m.label}`;
      // Samma vinkel+media får inte upprepas
      if (ads.some((a) => a.name === name)) continue;
      try {
        const creative = await meta.createCreative({
          name: `${product.slug} · ${name}`,
          pageId,
          instagramActorId: process.env.META_INSTAGRAM_ACTOR_ID || undefined,
          imageHash: m.imageHash,
          videoId: m.videoId,
          primaryText: fillCopy(angle.text, { name: product.name, hook }),
          headline: fillCopy(angle.headline, { name: product.name, hook }),
          description: angle.description ? fillCopy(angle.description, { name: product.name, hook }) : undefined,
          link,
        });
        const ad = await meta.createAd(name, adset.id, creative.id);
        ads.push({ id: ad.id, name });
        decisions.push({ level: "ad", id: ad.id, name, action: "note", reason: "Skapad (pausad)", campaignId: campaign.id, adsetId: adset.id });
        n++;
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        sameErrors = msg === lastError ? sameErrors + 1 : 1;
        lastError = msg;
        notes.push(`${name}: ${msg}`);
        // Samma fel tre gånger i rad betyder att inget kommer lyckas – avbryt i stället för att spamma
        if (sameErrors >= 3) {
          notes.push("Avbröt efter tre likadana fel.");
          break outer;
        }
      }
    }
  }
  await log(decisions.map((decision) => ({ decision, applied: true, source: o.source ?? "admin" })));
  return { campaignId: campaign.id, adsetId: adset.id, ads, notes };
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
 * Går igenom alla aktiva testkampanjer och föreslår (eller utför) paus, urval av vinnare
 * och budgetändringar enligt `rules`. Returnerar besluten.
 */
export async function reviewAds(o: { apply: boolean; source: string }): Promise<Decision[]> {
  if (!meta.adsConfigured()) throw new Error("META_ADS_TOKEN eller META_AD_ACCOUNT_ID saknas.");
  const decisions: Decision[] = [];
  const campaigns = (await meta.listCampaigns()).filter((c) => c.name.startsWith(TEST_PREFIX) && c.effective_status === "ACTIVE");

  for (const c of campaigns) {
    const age = ageDays(c.created_time);
    const since = c.created_time.slice(0, 10);
    for (const adset of await meta.listAdSets(c.id)) {
      if (adset.effective_status !== "ACTIVE") continue;
      const ads = (await meta.listAds(adset.id)).filter((a) => a.effective_status === "ACTIVE");
      const byAd = new Map((await meta.insightsRange(adset.id, since, today(), "ad")).map((i) => [i.ad_id, i]));
      const daily = Number(adset.daily_budget ?? 0) / 100;

      if (age < rules.testDays) {
        // Testfas: pausa bara tydliga förlorare i förtid
        for (const ad of ads) {
          const m = metricsOf(byAd.get(ad.id));
          if (m.spend >= rules.killMinSpend && m.purchases === 0 && m.ctr < rules.killMaxCtr && m.addToCart === 0)
            decisions.push({ level: "ad", id: ad.id, name: ad.name, action: "pause", reason: `Testfas: ${m.spend.toFixed(2)} spenderat, CTR ${m.ctr.toFixed(2)} %, inga varukorgar`, metrics: m, campaignId: c.id, adsetId: adset.id });
          else if (m.spend >= rules.targetCpa * 2 && m.purchases === 0)
            decisions.push({ level: "ad", id: ad.id, name: ad.name, action: "pause", reason: `Testfas: ${m.spend.toFixed(2)} spenderat utan köp (2× mål-CPA)`, metrics: m, campaignId: c.id, adsetId: adset.id });
        }
        continue;
      }

      // Testperiod slut: behåll de bästa, pausa resten
      if (ads.length > rules.keepWinners) {
        const ranked = ads
          .map((ad) => ({ ad, m: metricsOf(byAd.get(ad.id)) }))
          .sort((a, b) => b.m.purchases - a.m.purchases || b.m.addToCart - a.m.addToCart || b.m.ctr - a.m.ctr);
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
      } catch (e) {
        d.reason += ` (misslyckades: ${e instanceof Error ? e.message : e})`;
      }
    }
  }
  await log(decisions.filter((d) => d.action !== "keep").map((decision) => ({ decision, applied: o.apply, source: o.source })));
  return decisions;
}
