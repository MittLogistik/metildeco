import "server-only";
import { readFile } from "node:fs/promises";
import path from "node:path";
import satori from "satori";
import sharp from "sharp";
import { cardDescription, catalogVariantById, type CatalogVariant } from "@/content/ad-catalog";
import { getCatalog } from "./catalog";
import { imageProvider } from "./image-provider";
import { mediaUrl, publicBase } from "./media";
import { isInStock, primaryImage, type Product } from "./products";
import { qaConfigured, reviewImage } from "./ad-qa";
import { writeCatalogText } from "./ad-writer";
import { supabaseAdmin } from "./supabase";

/**
 * Katalogannons (karusell): en bred bakgrund genereras en gång och skärs i kvadratiska kort,
 * så att miljön löper sömlöst när man swipar. Produktens riktiga packshot läggs in i sitt kort
 * och en kort rad text ritas av oss – aldrig av bildmodellen.
 *
 * Bara produkter som finns i lager får vara med.
 */

const CARD = 1080;
export const MAX_CARDS = 5;
export const MIN_CARDS = 2;

export type CatalogCard = { position: number; slug: string; headline: string; description: string | null; url: string; storagePath: string; score: number | null };
export type CatalogRecord = {
  id: string;
  variantId: string;
  label: string;
  primaryText: string | null;
  headline: string | null;
  status: string;
  adId: string | null;
  createdAt: string;
  cards: CatalogCard[];
};

/** Produkter som får annonseras: aktiva och i lager. Slutsålda kommer aldrig med. */
export async function catalogCandidates(): Promise<{ inStock: Product[]; outOfStock: Product[] }> {
  const catalog = await getCatalog();
  const active = catalog.products.filter((p) => p.isActive);
  return { inStock: active.filter(isInStock), outOfStock: active.filter((p) => !isInStock(p)) };
}

/* --------------------------------- bakgrund -------------------------------- */

/**
 * En bred banner i N:1 som sedan skärs i N kort. Modellerna ritar inte så breda bilder,
 * så vi tar ett liggande original, beskär mittbandet till rätt proportion och skalar upp.
 * Bakgrunden är mjuk, så uppskalningen syns inte i praktiken.
 */
async function wideBackground(variant: CatalogVariant, cards: number, custom?: string): Promise<Buffer> {
  const provider = imageProvider();
  const prompt = [variant.background({ cards }), custom?.trim() ? `Extra direction from the art director: ${custom.trim()}` : ""].filter(Boolean).join("\n");
  const raw = await provider.generate({ prompt, size: { width: 1536, height: 1024 } });
  const meta = await sharp(raw).metadata();
  const w = meta.width ?? 1536;
  const h = meta.height ?? 1024;
  const bandHeight = Math.max(1, Math.round(w / cards));
  // Mittbandet, men något ovanför mitten så att hyllan eller marken hamnar rätt i kortet
  const top = Math.max(0, Math.min(h - bandHeight, Math.round((h - bandHeight) * 0.62)));
  return sharp(raw)
    .extract({ left: 0, top, width: w, height: Math.min(bandHeight, h) })
    .resize(CARD * cards, CARD, { fit: "fill", kernel: "lanczos3" })
    .png()
    .toBuffer();
}

/* ----------------------------------- kort ---------------------------------- */

type Font = { name: string; data: ArrayBuffer; weight: 500 | 600; style: "normal" };
let fontCache: Font[] | null = null;
async function fonts(): Promise<Font[]> {
  if (fontCache) return fontCache;
  const dir = path.join(process.cwd(), "src", "assets", "fonts");
  const load = async (file: string, name: string, weight: Font["weight"]): Promise<Font> => {
    const buf = await readFile(path.join(dir, file));
    return { name, data: buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer, weight, style: "normal" };
  };
  fontCache = await Promise.all([load("Outfit-SemiBold.ttf", "Outfit", 600), load("Figtree-Medium.ttf", "Figtree", 500)]);
  return fontCache;
}

/** En rad text och en liten ordbild. Mer än så gör karusellen plottrig. */
async function cardText(line: string, theme: "light" | "dark"): Promise<Buffer> {
  const ink = theme === "dark" ? "#f6f1e8" : "#1f3d33";
  const plate = theme === "dark" ? "rgba(23,38,32,0.55)" : "rgba(253,251,247,0.9)";
  const s = Math.round(CARD * 0.036);
  const el = (style: Record<string, unknown>, children?: unknown) => ({ type: "div", props: { style: { display: "flex", ...style }, children } });
  const root = el({ width: CARD, height: CARD, flexDirection: "column", justifyContent: "space-between", padding: Math.round(CARD * 0.06) }, [
    el({ justifyContent: "flex-end" }, [
      el({ fontFamily: "Outfit", fontWeight: 600, fontSize: Math.round(s * 0.8), color: ink, letterSpacing: s * 0.2, textTransform: "uppercase", opacity: 0.85 }, "Metilde"),
    ]),
    el({}, [
      el({ backgroundColor: plate, borderRadius: s, padding: `${Math.round(s * 0.5)}px ${Math.round(s * 0.9)}px`, maxWidth: Math.round(CARD * 0.8) }, [
        el({ fontFamily: "Figtree", fontWeight: 500, fontSize: s, color: ink, lineHeight: 1.25 }, line),
      ]),
    ]),
  ]);
  const svg = await satori(root as unknown as Parameters<typeof satori>[0], { width: CARD, height: CARD, fonts: await fonts() });
  return sharp(Buffer.from(svg)).png().toBuffer();
}

/**
 * Provar textmotorn en gång per process. Satori laddar sin wasm vid första anropet, och
 * misslyckas det vill vi veta det innan vi betalar för bilder – inte efteråt.
 */
let warmed: Promise<void> | null = null;
function warmupTextEngine(): Promise<void> {
  warmed ??= (async () => {
    const probe = { type: "div", props: { style: { display: "flex", fontFamily: "Figtree", fontSize: 8 }, children: "M" } };
    await satori(probe as unknown as Parameters<typeof satori>[0], { width: 8, height: 8, fonts: await fonts() });
  })().catch((e: unknown) => {
    warmed = null;
    throw new Error(`Textmotorn kunde inte starta: ${e instanceof Error ? e.message : e}`);
  });
  return warmed;
}

async function packshotBuffer(product: Product): Promise<Buffer> {
  const rel = mediaUrl(primaryImage(product));
  const url = rel.startsWith("http") ? rel : `${publicBase()}${rel}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Kunde inte hämta packshoten för ${product.slug} (${res.status}).`);
  return Buffer.from(await res.arrayBuffer());
}

/** Skär ut ett kort ur bannern, lägger in burken med skugga och en rad text. */
async function buildCard(banner: Buffer, index: number, product: Product, variant: CatalogVariant): Promise<Buffer> {
  const tile = await sharp(banner).extract({ left: index * CARD, top: 0, width: CARD, height: CARD }).png().toBuffer();
  const h = Math.round(CARD * variant.placement.height);
  let bottle = await sharp(await packshotBuffer(product)).resize({ height: h, fit: "inside" }).png().toBuffer();
  if (variant.theme === "dark") {
    // Packshoten har en ljus skugga inbakad i alfakanalen. Mot en mörk bakgrund syns den
    // som en ljus fläck, så svaga alfavärden tonas bort.
    const m = await sharp(bottle).metadata();
    const mw = m.width ?? h;
    const mh = m.height ?? h;
    const cleaned = await sharp(bottle).extractChannel("alpha").linear(2.2, -210).raw().toBuffer();
    const maskRgba = await sharp({ create: { width: mw, height: mh, channels: 3, background: { r: 255, g: 255, b: 255 } } })
      .joinChannel(cleaned, { raw: { width: mw, height: mh, channels: 1 } })
      .png()
      .toBuffer();
    bottle = await sharp(bottle).composite([{ input: maskRgba, blend: "dest-in" }]).png().toBuffer();
  }
  const meta = await sharp(bottle).metadata();
  const w = meta.width ?? h;
  const left = Math.round(CARD / 2 - w / 2);
  const top = Math.max(0, Math.round(CARD * variant.placement.baseY - h));

  const mask = await sharp(bottle).extractChannel("alpha").blur(Math.max(6, Math.round(h * 0.025))).linear(0.45, 0).raw().toBuffer();
  const shadow = await sharp({ create: { width: w, height: h, channels: 3, background: { r: 46, g: 44, b: 34 } } })
    .joinChannel(mask, { raw: { width: w, height: h, channels: 1 } })
    .png()
    .toBuffer();

  const withProduct = await sharp(tile)
    .composite([
      { input: shadow, left: Math.min(CARD - w, left + Math.round(h * 0.03)), top: Math.min(CARD - h, top + Math.round(h * 0.022)) },
      { input: bottle, left, top },
    ])
    .png()
    .toBuffer();
  const text = await cardText(variant.cardLine(product), variant.theme);
  return sharp(withProduct).composite([{ input: text }]).jpeg({ quality: 92 }).toBuffer();
}

/** Renderar korten: en bakgrund, ett kort per produkt. Separerad så att den går att testa. */
export async function renderCatalogCards(products: Product[], variant: CatalogVariant, custom?: string): Promise<Buffer[]> {
  await warmupTextEngine();
  const banner = await wideBackground(variant, products.length, custom);
  const out: Buffer[] = [];
  for (const [i, product] of products.entries()) out.push(await buildCard(banner, i, product, variant));
  return out;
}

/* --------------------------------- bygget ---------------------------------- */

export type BuildCatalogInput = { slugs: string[]; variantId: string; customInstructions?: string };

/** Bygger en katalogannons: bakgrund, kort per produkt, text. Sparas som utkast. */
export async function buildCatalog(o: BuildCatalogInput): Promise<CatalogRecord> {
  const variant = catalogVariantById(o.variantId);
  if (!variant) throw new Error(`Okänd variant: ${o.variantId}`);
  const { inStock } = await catalogCandidates();
  const chosen = o.slugs.map((s) => inStock.find((p) => p.slug === s)).filter((p): p is Product => Boolean(p));
  if (chosen.length < MIN_CARDS) throw new Error(`Välj minst ${MIN_CARDS} produkter som finns i lager.`);
  const products = chosen.slice(0, MAX_CARDS);

  const images = await renderCatalogCards(products, variant, o.customInstructions);
  const db = supabaseAdmin();
  const inserted = await db
    .from("ad_catalogs")
    .insert({
      variant_id: variant.id,
      label: variant.label,
      prompt: variant.background({ cards: products.length }),
      custom_instructions: o.customInstructions ?? null,
      provider: imageProvider().id,
      status: "draft",
      environment: process.env.STRIPE_SECRET_KEY?.includes("_live_") ? "live" : "sandbox",
    })
    .select("id,created_at")
    .single();
  if (inserted.error) throw new Error(inserted.error.message);
  const catalogId = inserted.data.id as string;

  const cards: CatalogCard[] = [];
  for (const [i, product] of products.entries()) {
    const image = images[i]!;
    const storagePath = `ads/kataloger/${catalogId}-${i + 1}-${product.slug}.jpg`;
    const up = await db.storage.from("product-media").upload(storagePath, image, { contentType: "image/jpeg", upsert: true });
    if (up.error) throw new Error(up.error.message);
    const url = db.storage.from("product-media").getPublicUrl(storagePath).data.publicUrl;

    let score: number | null = null;
    let review: unknown = null;
    if (qaConfigured()) {
      const rel = mediaUrl(primaryImage(product));
      const referenceUrl = rel.startsWith("http") ? rel : `${publicBase()}${rel}`;
      const r = await reviewImage({ referenceUrl, imageUrl: url, product, allowedText: [variant.cardLine(product), "Metilde"] }).catch(() => null);
      score = r?.score ?? null;
      review = r;
    }
    const headline = variant.cardHeadline(product).slice(0, 40);
    const description = cardDescription(product).slice(0, 60);
    const ins = await db
      .from("ad_catalog_cards")
      .insert({ catalog_id: catalogId, position: i + 1, product_slug: product.slug, headline, description, url, storage_path: storagePath, image_score: score, image_review: review })
      .select("*")
      .single();
    if (ins.error) throw new Error(ins.error.message);
    cards.push({ position: i + 1, slug: product.slug, headline, description, url, storagePath, score });
  }

  // Texten skrivs sist, när vi vet exakt vilka produkter som kom med
  const copy = await writeCatalogText({ products, angle: variant.copyAngle });
  await db.from("ad_catalogs").update({ primary_text: copy.primaryText, headline: copy.headline, description: copy.description ?? null, copy_source: copy.source }).eq("id", catalogId);

  return {
    id: catalogId,
    variantId: variant.id,
    label: variant.label,
    primaryText: copy.primaryText,
    headline: copy.headline,
    status: "draft",
    adId: null,
    createdAt: inserted.data.created_at as string,
    cards,
  };
}

/** Alla kataloger, nyast först. */
export async function listCatalogs(limit = 20): Promise<CatalogRecord[]> {
  const db = supabaseAdmin();
  const res = await db.from("ad_catalogs").select("*").order("created_at", { ascending: false }).limit(limit);
  const rows = (res.data ?? []) as Record<string, unknown>[];
  if (!rows.length) return [];
  const ids = rows.map((r) => r.id as string);
  const cardRes = await db.from("ad_catalog_cards").select("*").in("catalog_id", ids).order("position", { ascending: true });
  const byCatalog = new Map<string, CatalogCard[]>();
  for (const c of (cardRes.data ?? []) as Record<string, unknown>[]) {
    const list = byCatalog.get(c.catalog_id as string) ?? [];
    list.push({ position: c.position as number, slug: c.product_slug as string, headline: c.headline as string, description: (c.description as string) ?? null, url: c.url as string, storagePath: (c.storage_path as string) ?? "", score: (c.image_score as number) ?? null });
    byCatalog.set(c.catalog_id as string, list);
  }
  return rows.map((r) => ({
    id: r.id as string,
    variantId: r.variant_id as string,
    label: r.label as string,
    primaryText: (r.primary_text as string) ?? null,
    headline: (r.headline as string) ?? null,
    status: r.status as string,
    adId: (r.ad_id as string) ?? null,
    createdAt: r.created_at as string,
    cards: byCatalog.get(r.id as string) ?? [],
  }));
}

/** Tar bort en katalog och dess bilder. Går inte att ångra. */
export async function deleteCatalog(id: string): Promise<number> {
  const db = supabaseAdmin();
  const cards = (await db.from("ad_catalog_cards").select("storage_path").eq("catalog_id", id)).data ?? [];
  const paths = cards.map((c) => c.storage_path as string).filter(Boolean);
  if (paths.length) await db.storage.from("product-media").remove(paths);
  const del = await db.from("ad_catalogs").delete().eq("id", id);
  if (del.error) throw new Error(del.error.message);
  return paths.length;
}

/* ------------------------------- publicering ------------------------------- */

/**
 * Skapar en pausad karusellannons av katalogen. Två varianter i samma annonsgrupp
 * jämförs rakt av – samma publik, samma budget, olika bild och text.
 * Kampanj och annonsgrupp skapas bara om de inte skickas med.
 */
export async function publishCatalog(o: { id: string; dailyBudget: number; campaignId?: string; adsetId?: string; linkBase?: string }): Promise<{ adId: string; campaignId: string; adsetId: string }> {
  const meta = await import("./meta-ads");
  const { META_PIXEL_ID } = await import("./meta");
  const { TEST_PREFIX } = await import("./ads-engine");
  const { routes } = await import("./routes");
  const { site } = await import("./site");
  if (!meta.adsConfigured()) throw new Error("META_ADS_TOKEN eller META_AD_ACCOUNT_ID saknas.");
  const pageId = process.env.META_PAGE_ID;
  if (!pageId) throw new Error("META_PAGE_ID saknas.");

  const db = supabaseAdmin();
  const row = (await db.from("ad_catalogs").select("*").eq("id", o.id).maybeSingle()).data as Record<string, unknown> | null;
  if (!row) throw new Error("Katalogen finns inte.");
  if (row.ad_id) throw new Error("Katalogen är redan publicerad.");
  const cards = ((await db.from("ad_catalog_cards").select("*").eq("catalog_id", o.id).order("position", { ascending: true })).data ?? []) as Record<string, unknown>[];
  if (cards.length < MIN_CARDS) throw new Error("Katalogen har för få kort.");

  const base = (o.linkBase ?? (site.indexable ? site.url : "https://metilde.com")).replace(/\/$/, "");
  const campaignId = o.campaignId ?? (await meta.createCampaign(`${TEST_PREFIX}Katalog · ${new Date().toISOString().slice(0, 10)}`)).id;
  const adsetId = o.adsetId ?? (await meta.createAdSet({ name: `${TEST_PREFIX}Katalog`, campaignId, dailyBudget: o.dailyBudget, pixelId: META_PIXEL_ID })).id;

  const childCards: { imageHash: string; headline: string; description?: string; link: string }[] = [];
  for (const c of cards) {
    const hash = await meta.uploadImage(c.url as string, `katalog-${o.id}-${c.position}`);
    childCards.push({ imageHash: hash, headline: c.headline as string, description: (c.description as string) ?? undefined, link: `${base}${routes.product(c.product_slug as string)}` });
  }

  const creative = await meta.createCarouselCreative({
    name: `Katalog · ${row.label as string}`,
    pageId,
    instagramActorId: process.env.META_INSTAGRAM_ACTOR_ID || undefined,
    primaryText: (row.primary_text as string) ?? "",
    link: `${base}${routes.products}`,
    cards: childCards,
  });
  const ad = await meta.createAd(`Katalog · ${row.variant_id as string}`, adsetId, creative.id, "PAUSED");
  await db.from("ad_catalogs").update({ status: "published", ad_id: ad.id, campaign_id: campaignId, adset_id: adsetId }).eq("id", o.id);
  return { adId: ad.id, campaignId, adsetId };
}
