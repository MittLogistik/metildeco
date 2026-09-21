import "server-only";
import { randomUUID } from "node:crypto";
import { conceptById, copyLines, creativeName, formatById, type Format } from "@/content/ad-concepts";

import { directArt } from "./ad-art-director";
import { buildCreativePrompt, randomVariation } from "./ad-prompt";
import { qaConfigured, reviewImage, type Review } from "./ad-qa";
import type { Creative } from "./ad-images";
import { getProduct } from "./catalog";
import { imageProvider } from "./image-provider";
import { mediaUrl, publicBase } from "./media";
import { primaryImage } from "./products";
import { supabaseAdmin } from "./supabase";

/**
 * Creative Studio: skapar annonsbilder för en produkt, ett koncept i taget.
 *
 * Miljön genereras av bildleverantören (ChatGPT som standard), produktens riktiga
 * packshot läggs in ovanpå och texten ritas ur verifierade fakta. Bilden granskas sedan
 * mot packshoten och sparas i ad_creatives. Formaten i samma koncept delar group_id, så
 * att de visas som en grupp precis som tidigare.
 */

export type GenerateInput = {
  slug: string;
  conceptId: string;
  format: Format;
  /** Format i samma omgång delar grupp. Utelämnas skapas en ny. */
  groupId?: string;
  customInstructions?: string;
  /** Äkta recension till omdömeskonceptet. Hittas aldrig på. */
  review?: string;
  /** Ny visuell tolkning i stället för samma bild igen. */
  regenerate?: boolean;
  /** Noteringar från art directorn, om något gick fel. */
  notes?: string[];
  providerId?: string;
};

export type GenerateResult = { creative: Creative; name: string; rejected: boolean; note: string | null; score: number | null };

/** Packshoten som fil – både som referens och som det lager som läggs i bilden. */
async function packshotBuffer(path: string, mediaBase: string): Promise<Buffer> {
  const rel = mediaUrl(path);
  const url = rel.startsWith("http") ? rel : `${mediaBase.replace(/\/$/, "")}${rel}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Kunde inte hämta packshoten (${res.status}) från ${url}`);
  return Buffer.from(await res.arrayBuffer());
}

/** Senaste publicerade omdömet för produkten, eller null. Vi hittar aldrig på ett. */
export async function realReview(slug: string): Promise<{ body: string; author: string | null } | null> {
  const res = await supabaseAdmin()
    .from("product_reviews")
    .select("body,author_name,rating,status")
    .eq("product_slug", slug)
    .eq("status", "published")
    .gte("rating", 4)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  const row = res.data as { body: string | null; author_name: string | null } | null;
  return row?.body ? { body: row.body, author: row.author_name } : null;
}

/** Genererar och sparar en bild: ett koncept i ett format. */
export async function generateCreative(o: GenerateInput): Promise<GenerateResult> {
  const product = await getProduct(o.slug);
  if (!product) throw new Error(`Produkten ${o.slug} finns inte.`);
  const concept = conceptById(o.conceptId);
  if (!concept) throw new Error(`Okänt koncept: ${o.conceptId}`);
  const size = formatById(o.format);
  if (!size) throw new Error(`Okänt format: ${o.format}`);

  const mediaBase = publicBase();
  const packshotPath = primaryImage(product);
  if (!packshotPath || packshotPath.endsWith(".svg")) throw new Error("Produkten saknar en packshot att bygga annonsen runt.");
  const packshot = await packshotBuffer(packshotPath, mediaBase);

  const groupId = o.groupId ?? randomUUID();
  const provider = imageProvider(o.providerId);
  const copy = concept.copy({ product, review: o.review?.trim() || undefined });
  const variation = o.regenerate ? randomVariation() : undefined;
  // Art directorn ser packshoten och skriver regin, som i ChatGPT-chatten
  const packshotUrl = mediaUrl(packshotPath).startsWith("http") ? mediaUrl(packshotPath) : `${mediaBase}${mediaUrl(packshotPath)}`;
  const direction = await directArt({ product, concept, format: o.format, copy, packshotUrl, customInstructions: o.customInstructions, variation, notes: o.notes });
  const prompt = buildCreativePrompt({
    product,
    concept,
    format: o.format,
    copy,
    art: direction.art,
    customInstructions: o.customInstructions,
    variation,
  });

  // Modellen ritar hela annonsen, med packshoten som referens för produkten
  const image = await provider.generate({ prompt, size: { width: size.width, height: size.height }, reference: packshot });

  const db = supabaseAdmin();
  const name = creativeName(o.slug, concept.id, o.format);
  const storagePath = `ads/${o.slug}/${groupId}-${o.format.replace(":", "x")}-${Date.now().toString(36)}.jpg`;
  const jpeg = await (await import("sharp")).default(image).jpeg({ quality: 92 }).toBuffer();
  const up = await db.storage.from("product-media").upload(storagePath, jpeg, { contentType: "image/jpeg", upsert: false });
  if (up.error) throw new Error(up.error.message);
  const url = db.storage.from("product-media").getPublicUrl(storagePath).data.publicUrl;

  // Granskning mot packshoten. Texten vi själva ritat anges som tillåten.
  let review: Review | null = null;
  if (qaConfigured()) {
    const referenceUrl = mediaUrl(packshotPath).startsWith("http") ? mediaUrl(packshotPath) : `${mediaBase.replace(/\/$/, "")}${mediaUrl(packshotPath)}`;
    review = await reviewImage({ referenceUrl, imageUrl: url, product, allowedText: copyLines(copy) }).catch(() => null);
  }
  const rejected = review?.verdict === "reject";

  const ins = await db
    .from("ad_creatives")
    .insert({
      product_slug: o.slug,
      kind: "concept",
      concept_id: concept.id,
      name,
      scene_id: concept.id,
      prompt,
      custom_instructions: o.customInstructions ?? null,
      provider: provider.id,
      group_id: groupId,
      format: o.format,
      url,
      storage_path: storagePath,
      active: !rejected,
      image_score: review?.score ?? null,
      image_review: review,
      reviewed_at: review ? new Date().toISOString() : null,
    })
    .select("*")
    .single();
  if (ins.error) throw new Error(ins.error.message);

  return { creative: ins.data as Creative, name, rejected, note: review?.issues.join("; ") || review?.notes || null, score: review?.score ?? null };
}

/** Ersätter en bild med en ny tolkning och tar bort den gamla filen. Behåller koncept, format och grupp. */
export async function regenerateCreative(id: string, customInstructions?: string): Promise<GenerateResult> {
  const db = supabaseAdmin();
  const row = (await db.from("ad_creatives").select("*").eq("id", id).maybeSingle()).data as Creative | null;
  if (!row) throw new Error("Bilden finns inte längre.");
  if (!row.concept_id) throw new Error("Bilden kommer inte från Creative Studio och kan inte göras om.");
  const review = row.concept_id === "social-proof" ? (await realReview(row.product_slug))?.body : undefined;
  const result = await generateCreative({
    slug: row.product_slug,
    conceptId: row.concept_id,
    format: row.format as Format,
    groupId: row.group_id,
    customInstructions: customInstructions ?? row.custom_instructions ?? undefined,
    review,
    regenerate: true,
  });
  if (row.storage_path) await db.storage.from("product-media").remove([row.storage_path]);
  await db.from("ad_creatives").delete().eq("id", row.id);
  return result;
}

/** Godkänner eller ångrar en bild. Godkända bilder är de kampanjbyggaren använder. */
export async function setApproved(groupId: string, approved: boolean) {
  const res = await supabaseAdmin()
    .from("ad_creatives")
    .update({ active: approved, approved_at: approved ? new Date().toISOString() : null })
    .eq("group_id", groupId);
  if (res.error) throw new Error(res.error.message);
}

export type ApprovedCreative = { groupId: string; conceptId: string | null; name: string | null; format: string; url: string; score: number | null };

/**
 * Godkända bilder för en produkt, redo för kampanjbyggaren.
 * Grupperas av anroparen om den vill ha flöde och story tillsammans.
 */
export async function getApprovedCreatives(slug: string): Promise<ApprovedCreative[]> {
  const res = await supabaseAdmin()
    .from("ad_creatives")
    .select("group_id,concept_id,name,format,url,image_score")
    .eq("product_slug", slug)
    .eq("active", true)
    .order("created_at", { ascending: false });
  if (res.error) throw new Error(res.error.message);
  return (res.data ?? []).map((r) => ({ groupId: r.group_id as string, conceptId: r.concept_id as string | null, name: r.name as string | null, format: r.format as string, url: r.url as string, score: r.image_score as number | null }));
}
