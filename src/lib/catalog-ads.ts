import "server-only";
import sharp from "sharp";
import { writeCatalogText } from "./ad-writer";
import { getCatalog } from "./catalog";
import { isInStock, type Product } from "./products";
import { supabaseAdmin } from "./supabase";

/**
 * Katalogannons (karusell i Meta).
 *
 * Bilderna görs utanför systemet och laddas upp hit: antingen ett kort i taget, eller en
 * bred bild som delas i lika stora kvadrater så att en genomgående bakgrund hamnar rätt.
 * Ordningen bestämmer var i karusellen varje kort hamnar, och därmed hur bakgrunden möts.
 *
 * Titel, beskrivning och länk per kort hämtas från produkten. Annonstexten föreslås av AI
 * och godkänns innan kampanjen startas.
 */

const CARD = 1080;
export const MAX_CARDS = 10;
export const MIN_CARDS = 2;

export type CatalogCard = {
  id: string;
  position: number;
  slug: string;
  headline: string;
  description: string | null;
  url: string;
  storagePath: string;
};

export type CatalogRecord = {
  id: string;
  label: string;
  primaryText: string | null;
  headline: string | null;
  status: string;
  adId: string | null;
  campaignId: string | null;
  createdAt: string;
  cards: CatalogCard[];
};

/** Produkter som får annonseras: aktiva och i lager. Slutsålda kommer aldrig med. */
export async function catalogCandidates(): Promise<{ inStock: Product[]; outOfStock: Product[] }> {
  const catalog = await getCatalog();
  const active = catalog.products.filter((p) => p.isActive);
  return { inStock: active.filter(isInStock), outOfStock: active.filter((p) => !isInStock(p)) };
}

/** Kortets rubrik och beskrivning hämtas ur produkten. */
const cardHeadline = (p: Product) => p.name.replace(/ \|.*$/, "").slice(0, 40);
const cardDescription = (p: Product) => (p.bullets.filter((b) => b.length <= 40)[0] ?? p.short).slice(0, 60);

/* --------------------------------- katalogen -------------------------------- */

/** Skapar en tom katalog att fylla med bilder. */
export async function createCatalog(label: string): Promise<string> {
  const res = await supabaseAdmin()
    .from("ad_catalogs")
    .insert({
      variant_id: "upload",
      label: label.trim().slice(0, 120) || `Katalog ${new Date().toISOString().slice(0, 10)}`,
      provider: "upload",
      status: "draft",
      environment: process.env.STRIPE_SECRET_KEY?.includes("_live_") ? "live" : "sandbox",
    })
    .select("id")
    .single();
  if (res.error) throw new Error(res.error.message);
  return res.data.id as string;
}

/** Signerad adress dit webbläsaren lägger bilden direkt, förbi serveraktionernas storleksgräns. */
export async function signCatalogUpload(catalogId: string, ext: string): Promise<{ signedUrl: string; path: string }> {
  const safe = /^[a-z0-9]{1,5}$/.test(ext) ? ext : "jpg";
  const path = `ads/kataloger/${catalogId}/raw-${Date.now().toString(36)}.${safe}`;
  const { data, error } = await supabaseAdmin().storage.from("product-media").createSignedUploadUrl(path);
  if (error || !data) throw new Error(error?.message ?? "Kunde inte skapa uppladdningsadress.");
  return { signedUrl: data.signedUrl, path: data.path ?? path };
}

const publicUrl = (path: string) => supabaseAdmin().storage.from("product-media").getPublicUrl(path).data.publicUrl;

async function bytesOf(path: string): Promise<Buffer> {
  const res = await fetch(publicUrl(path));
  if (!res.ok) throw new Error(`Kunde inte läsa den uppladdade bilden (${res.status}).`);
  return Buffer.from(await res.arrayBuffer());
}

async function saveCard(o: { catalogId: string; position: number; product: Product; url: string; storagePath: string }): Promise<CatalogCard> {
  const res = await supabaseAdmin()
    .from("ad_catalog_cards")
    .upsert(
      {
        catalog_id: o.catalogId,
        position: o.position,
        product_slug: o.product.slug,
        headline: cardHeadline(o.product),
        description: cardDescription(o.product),
        url: o.url,
        storage_path: o.storagePath,
      },
      { onConflict: "catalog_id,position" },
    )
    .select("id")
    .single();
  if (res.error) throw new Error(res.error.message);
  return {
    id: res.data.id as string,
    position: o.position,
    slug: o.product.slug,
    headline: cardHeadline(o.product),
    description: cardDescription(o.product),
    url: o.url,
    storagePath: o.storagePath,
  };
}

/** Lägger ett kort på en plats i katalogen. Bilden blir 1080×1080, som Meta vill ha den. */
export async function attachCard(o: { catalogId: string; position: number; slug: string; path: string }): Promise<CatalogCard> {
  const { inStock } = await catalogCandidates();
  const product = inStock.find((p) => p.slug === o.slug);
  if (!product) throw new Error("Produkten finns inte eller är slut i lager.");
  const square = await sharp(await bytesOf(o.path)).resize(CARD, CARD, { fit: "cover", position: "centre" }).jpeg({ quality: 92 }).toBuffer();
  const storagePath = `ads/kataloger/${o.catalogId}/${o.position}-${o.slug}.jpg`;
  const up = await supabaseAdmin().storage.from("product-media").upload(storagePath, square, { contentType: "image/jpeg", upsert: true });
  if (up.error) throw new Error(up.error.message);
  await supabaseAdmin().storage.from("product-media").remove([o.path]);
  return saveCard({ catalogId: o.catalogId, position: o.position, product, url: publicUrl(storagePath), storagePath });
}

/**
 * Delar en bred bild i lika stora kvadrater, ett kort per produkt i vald ordning.
 * Så hamnar en genomgående bakgrund rätt när man swipar.
 */
export async function sliceWideImage(o: { catalogId: string; path: string; slugs: string[] }): Promise<CatalogCard[]> {
  const { inStock } = await catalogCandidates();
  const products = o.slugs.map((s) => inStock.find((p) => p.slug === s)).filter((p): p is Product => Boolean(p));
  if (products.length < MIN_CARDS) throw new Error(`Välj minst ${MIN_CARDS} produkter som finns i lager.`);
  // Hela bredden måste med: beskärning skulle flytta en bakgrund som är uppriktad mot
  // kortgränserna. Stämmer inte proportionen sträcks bilden i stället för att klippas.
  const wide = await sharp(await bytesOf(o.path))
    .resize(CARD * products.length, CARD, { fit: "fill" })
    .png()
    .toBuffer();

  const cards: CatalogCard[] = [];
  for (const [i, product] of products.entries()) {
    const tile = await sharp(wide).extract({ left: i * CARD, top: 0, width: CARD, height: CARD }).jpeg({ quality: 92 }).toBuffer();
    const storagePath = `ads/kataloger/${o.catalogId}/${i + 1}-${product.slug}.jpg`;
    const up = await supabaseAdmin().storage.from("product-media").upload(storagePath, tile, { contentType: "image/jpeg", upsert: true });
    if (up.error) throw new Error(up.error.message);
    cards.push(await saveCard({ catalogId: o.catalogId, position: i + 1, product, url: publicUrl(storagePath), storagePath }));
  }
  await supabaseAdmin().storage.from("product-media").remove([o.path]);
  return cards;
}

/** Byter ordning på korten. Positionerna är unika, så bytet görs i två steg. */
export async function reorderCards(catalogId: string, orderedCardIds: string[]): Promise<void> {
  const db = supabaseAdmin();
  for (const [i, id] of orderedCardIds.entries()) {
    const res = await db.from("ad_catalog_cards").update({ position: -(i + 1) }).eq("id", id).eq("catalog_id", catalogId);
    if (res.error) throw new Error(res.error.message);
  }
  for (const [i, id] of orderedCardIds.entries()) {
    const res = await db.from("ad_catalog_cards").update({ position: i + 1 }).eq("id", id).eq("catalog_id", catalogId);
    if (res.error) throw new Error(res.error.message);
  }
}

/** Tar bort ett kort och dess bild. */
export async function removeCard(cardId: string): Promise<void> {
  const db = supabaseAdmin();
  const row = (await db.from("ad_catalog_cards").select("storage_path").eq("id", cardId).maybeSingle()).data as { storage_path: string | null } | null;
  if (row?.storage_path) await db.storage.from("product-media").remove([row.storage_path]);
  const del = await db.from("ad_catalog_cards").delete().eq("id", cardId);
  if (del.error) throw new Error(del.error.message);
}

/* ---------------------------------- texten ---------------------------------- */

/** Föreslår annonstext utifrån produkterna i katalogen. Texten godkänns innan start. */
export async function suggestCopy(catalogId: string): Promise<{ primaryText: string; headline: string; source: string }> {
  const catalog = await getOne(catalogId);
  if (!catalog) throw new Error("Katalogen finns inte.");
  const { inStock } = await catalogCandidates();
  const products = catalog.cards.map((c) => inStock.find((p) => p.slug === c.slug)).filter((p): p is Product => Boolean(p));
  if (!products.length) throw new Error("Lägg till kort innan texten skrivs.");
  const copy = await writeCatalogText({
    products,
    angle:
      "Presentera sortimentet som en samling att välja ur. Lyft att extraktstyrka och dos står öppet på varje burk, att de tillverkas i Sverige och analyseras batch för batch. Uppmana att svepa och välja sin.",
  });
  return { primaryText: copy.primaryText, headline: copy.headline, source: copy.source };
}

/** Sparar den godkända texten. */
export async function saveCopy(o: { catalogId: string; primaryText: string; headline: string; source?: string }): Promise<void> {
  const res = await supabaseAdmin()
    .from("ad_catalogs")
    .update({
      primary_text: o.primaryText.trim().slice(0, 2000),
      headline: o.headline.trim().slice(0, 40),
      copy_source: o.source ?? "godkänd",
    })
    .eq("id", o.catalogId);
  if (res.error) throw new Error(res.error.message);
}

/* --------------------------------- läsning ---------------------------------- */

const toRecord = (row: Record<string, unknown>, cards: CatalogCard[]): CatalogRecord => ({
  id: row.id as string,
  label: row.label as string,
  primaryText: (row.primary_text as string) ?? null,
  headline: (row.headline as string) ?? null,
  status: row.status as string,
  adId: (row.ad_id as string) ?? null,
  campaignId: (row.campaign_id as string) ?? null,
  createdAt: row.created_at as string,
  cards,
});

async function cardsFor(ids: string[]): Promise<Map<string, CatalogCard[]>> {
  const out = new Map<string, CatalogCard[]>();
  if (!ids.length) return out;
  const res = await supabaseAdmin().from("ad_catalog_cards").select("*").in("catalog_id", ids).order("position", { ascending: true });
  for (const c of (res.data ?? []) as Record<string, unknown>[]) {
    const list = out.get(c.catalog_id as string) ?? [];
    list.push({
      id: c.id as string,
      position: c.position as number,
      slug: c.product_slug as string,
      headline: c.headline as string,
      description: (c.description as string) ?? null,
      url: c.url as string,
      storagePath: (c.storage_path as string) ?? "",
    });
    out.set(c.catalog_id as string, list);
  }
  return out;
}

export async function getOne(id: string): Promise<CatalogRecord | null> {
  const res = await supabaseAdmin().from("ad_catalogs").select("*").eq("id", id).maybeSingle();
  if (!res.data) return null;
  const cards = (await cardsFor([id])).get(id) ?? [];
  return toRecord(res.data as Record<string, unknown>, cards);
}

/** Alla kataloger, nyast först. */
export async function listCatalogs(limit = 20): Promise<CatalogRecord[]> {
  const res = await supabaseAdmin().from("ad_catalogs").select("*").order("created_at", { ascending: false }).limit(limit);
  const rows = (res.data ?? []) as Record<string, unknown>[];
  const byCatalog = await cardsFor(rows.map((r) => r.id as string));
  return rows.map((r) => toRecord(r, byCatalog.get(r.id as string) ?? []));
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
 * Startar katalogen som en pausad karusellannons. Varje kort länkar till sin produktsida,
 * med produktens titel som rubrik och en verifierad faktamening som beskrivning.
 */
export async function publishCatalog(o: {
  id: string;
  dailyBudget: number;
  campaignId?: string;
  adsetId?: string;
  linkBase?: string;
}): Promise<{ adId: string; campaignId: string; adsetId: string }> {
  const meta = await import("./meta-ads");
  const { META_PIXEL_ID } = await import("./meta");
  const { TEST_PREFIX } = await import("./ads-engine");
  const { routes } = await import("./routes");
  const { site } = await import("./site");
  if (!meta.adsConfigured()) throw new Error("META_ADS_TOKEN eller META_AD_ACCOUNT_ID saknas.");
  const pageId = process.env.META_PAGE_ID;
  if (!pageId) throw new Error("META_PAGE_ID saknas.");

  const catalog = await getOne(o.id);
  if (!catalog) throw new Error("Katalogen finns inte.");
  if (catalog.adId) throw new Error("Katalogen är redan publicerad.");
  if (catalog.cards.length < MIN_CARDS) throw new Error(`Katalogen behöver minst ${MIN_CARDS} kort.`);
  if (!catalog.primaryText?.trim()) throw new Error("Godkänn annonstexten innan kampanjen startas.");

  const base = (o.linkBase ?? (site.indexable ? site.url : "https://metilde.com")).replace(/\/$/, "");
  const campaignId = o.campaignId ?? (await meta.createCampaign(`${TEST_PREFIX}Katalog · ${new Date().toISOString().slice(0, 10)}`)).id;
  const adsetId = o.adsetId ?? (await meta.createAdSet({ name: `${TEST_PREFIX}${catalog.label}`, campaignId, dailyBudget: o.dailyBudget, pixelId: META_PIXEL_ID })).id;

  const cards: { imageHash: string; headline: string; description?: string; link: string }[] = [];
  for (const c of catalog.cards) {
    const hash = await meta.uploadImage(c.url, `katalog-${o.id}-${c.position}`);
    cards.push({ imageHash: hash, headline: c.headline, description: c.description ?? undefined, link: `${base}${routes.product(c.slug)}` });
  }

  const creative = await meta.createCarouselCreative({
    name: `Katalog · ${catalog.label}`,
    pageId,
    instagramActorId: process.env.META_INSTAGRAM_ACTOR_ID || undefined,
    primaryText: catalog.primaryText,
    link: `${base}${routes.products}`,
    cards,
  });
  const ad = await meta.createAd(`Katalog · ${catalog.label}`, adsetId, creative.id, "PAUSED");
  await supabaseAdmin().from("ad_catalogs").update({ status: "published", ad_id: ad.id, campaign_id: campaignId, adset_id: adsetId }).eq("id", o.id);
  return { adId: ad.id, campaignId, adsetId };
}
