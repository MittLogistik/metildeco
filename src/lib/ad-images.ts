import "server-only";
import { randomUUID } from "node:crypto";
import { getProduct } from "./catalog";
import { generateImage, higgsfieldConfigured, type HfAspect } from "./higgsfield";
import { primaryImage, type Product } from "./products";
import { supabaseAdmin } from "./supabase";

/**
 * Annonsbilder: scener genererade runt produktens riktiga packshot, i formaten
 * 1:1 (flöde) och 9:16 (stories/reels). Sparas i Supabase Storage och tabellen ad_creatives.
 */

export type Scene = { id: string; label: string; prompt: string };

/** Scener i Metildes ton: nordiskt, lugnt, naturligt ljus. Inga ansikten, ingen text, inga påståenden. */
export const scenes: Scene[] = [
  { id: "studio", label: "Studio", prompt: "minimal studio set, sand-colored seamless backdrop, soft diffused daylight, subtle shadow, product centered" },
  { id: "kok", label: "Kök på morgonen", prompt: "Scandinavian kitchen counter in the morning, light oak wood, a glass of water, linen towel, soft window light" },
  { id: "skog", label: "Svensk skog", prompt: "Swedish forest floor with moss, stone and pine needles, soft overcast light, shallow depth of field" },
  { id: "traning", label: "Efter träning", prompt: "gym bench with a folded grey towel and a steel water bottle, muted tones, natural light from a window" },
  { id: "skrivbord", label: "Skrivbord", prompt: "calm desk with an open notebook, ceramic coffee cup and a green plant, morning light, tidy" },
  { id: "badrum", label: "Badrumshylla", prompt: "bathroom shelf with stone tiles, linen, a small ceramic dish and eucalyptus, soft light" },
  { id: "hand", label: "I handen", prompt: "held in a hand close-up, blurred outdoor Scandinavian background, warm evening light, no face visible" },
  { id: "flatlay", label: "Ovanifrån", prompt: "top-down flat lay on a sand-colored linen cloth with dried herbs, a wooden spoon and a small glass jar" },
  { id: "kvall", label: "Kvällslugn", prompt: "bedside table at dusk with a warm lamp, a book and a glass of water, calm and quiet mood" },
  { id: "fjall", label: "Fjäll", prompt: "outdoor rock surface in Swedish mountains, morning mist, wide sky, cool light" },
];

export const buildPrompt = (p: Product, scene: Scene) =>
  [
    "Commercial product photo for a Swedish botanical supplement brand.",
    "Keep the product exactly as in the reference image: same bottle shape, label, text, logo and colors, unchanged and sharp.",
    `Scene: ${scene.prompt}.`,
    "Palette: deep forest green, sand, off-white. Photorealistic, premium, editorial, soft natural light.",
    "No text overlays, no extra bottles, no hands with faces, no people, no logos other than the product's own.",
    `Product: ${p.name}.`,
  ].join(" ");

export type Creative = {
  id: string;
  created_at: string;
  product_slug: string;
  kind: string;
  scene_id: string | null;
  prompt: string | null;
  group_id: string;
  format: string;
  url: string;
  storage_path: string | null;
  parent_group_id: string | null;
  active: boolean;
};

export type CreativeGroup = { groupId: string; label: string; kind: string; feed: Creative | null; story: Creative | null; sceneId: string | null; createdAt: string };

/** Grupperar bilderna per scen: en flödesbild (1:1 eller 3:4) och ev. en storybild (9:16). */
export async function listCreativeGroups(slug: string, onlyActive = true): Promise<CreativeGroup[]> {
  let q = supabaseAdmin().from("ad_creatives").select("*").eq("product_slug", slug).order("created_at", { ascending: false });
  if (onlyActive) q = q.eq("active", true);
  const { data, error } = await q;
  if (error) throw new Error(error.message);
  const groups = new Map<string, CreativeGroup>();
  for (const c of (data ?? []) as Creative[]) {
    const g = groups.get(c.group_id) ?? { groupId: c.group_id, label: scenes.find((s) => s.id === c.scene_id)?.label ?? (c.kind === "upload" ? "Egen bild" : c.scene_id ?? "Scen"), kind: c.kind, feed: null, story: null, sceneId: c.scene_id, createdAt: c.created_at };
    if (c.format === "9:16") g.story = g.story ?? c;
    else g.feed = g.feed ?? c;
    groups.set(c.group_id, g);
  }
  return [...groups.values()];
}

/** Laddar ner en bild från en URL och lägger den i vår lagring. Returnerar publik URL + sökväg. */
export async function storeImage(sourceUrl: string, path: string): Promise<{ url: string; path: string }> {
  const res = await fetch(sourceUrl);
  if (!res.ok) throw new Error(`Kunde inte hämta bilden (${res.status}).`);
  const contentType = res.headers.get("content-type")?.split(";")[0] || "image/jpeg";
  const ext = contentType.includes("png") ? "png" : contentType.includes("webp") ? "webp" : "jpg";
  const full = `${path}.${ext}`;
  const buf = Buffer.from(await res.arrayBuffer());
  const db = supabaseAdmin();
  const up = await db.storage.from("product-media").upload(full, buf, { contentType, upsert: true });
  if (up.error) throw new Error(up.error.message);
  return { url: db.storage.from("product-media").getPublicUrl(full).data.publicUrl, path: full };
}

const formatAspect: Record<string, HfAspect> = { "1:1": "1:1", "9:16": "9:16", "3:4": "3:4" };

/**
 * Genererar scener för en produkt. Varje scen ger en bild per format (1:1 och 9:16 som standard).
 * mediaBase måste vara publikt nåbar så att Higgsfield kan hämta packshoten.
 */
export async function generateScenes(o: { slug: string; sceneIds?: string[]; count?: number; formats?: string[]; mediaBase: string; parentGroupId?: string; presetId?: string }): Promise<{ groups: CreativeGroup[]; notes: string[] }> {
  if (!higgsfieldConfigured()) throw new Error("HF_CREDENTIALS saknas.");
  const product = await getProduct(o.slug);
  if (!product) throw new Error(`Produkten ${o.slug} finns inte.`);
  const packshot = `${o.mediaBase.replace(/\/$/, "")}${primaryImage(product)}`;
  const formats = o.formats?.length ? o.formats : ["1:1", "9:16"];
  const existing = await listCreativeGroups(o.slug, false);
  const used = new Set(existing.map((g) => g.sceneId));
  const pick = o.sceneIds?.length ? scenes.filter((s) => o.sceneIds!.includes(s.id)) : scenes.filter((s) => !used.has(s.id)).slice(0, o.count ?? 3);
  if (pick.length === 0) throw new Error("Alla scener är redan genererade för produkten. Välj scener att göra om.");
  const notes: string[] = [];
  const db = supabaseAdmin();
  const groups: CreativeGroup[] = [];
  for (const scene of pick) {
    const groupId = randomUUID();
    const prompt = buildPrompt(product, scene);
    const g: CreativeGroup = { groupId, label: scene.label, kind: "scene", feed: null, story: null, sceneId: scene.id, createdAt: new Date().toISOString() };
    for (const format of formats) {
      try {
        const hfUrl = await generateImage({ prompt, imageUrls: [packshot], aspectRatio: formatAspect[format] ?? "1:1", resolution: "1k", presetId: o.presetId });
        const stored = await storeImage(hfUrl, `ads/${o.slug}/${groupId}-${format.replace(":", "x")}`);
        const row = { product_slug: o.slug, kind: "scene", scene_id: scene.id, prompt, group_id: groupId, format, url: stored.url, storage_path: stored.path, parent_group_id: o.parentGroupId ?? null, active: true };
        const ins = await db.from("ad_creatives").insert(row).select("*").single();
        if (ins.error) throw new Error(ins.error.message);
        const c = ins.data as Creative;
        if (format === "9:16") g.story = c;
        else g.feed = c;
      } catch (e) {
        notes.push(`${scene.label} ${format}: ${e instanceof Error ? e.message : e}`);
      }
    }
    if (g.feed || g.story) groups.push(g);
  }
  return { groups, notes };
}

/** Egen uppladdad bild som en egen grupp (ett format). */
export async function addUploadedCreative(slug: string, file: File, format: string): Promise<Creative> {
  const db = supabaseAdmin();
  const groupId = randomUUID();
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `ads/${slug}/${groupId}-${format.replace(":", "x")}.${ext}`;
  const up = await db.storage.from("product-media").upload(path, file, { contentType: file.type, upsert: false });
  if (up.error) throw new Error(up.error.message);
  const url = db.storage.from("product-media").getPublicUrl(path).data.publicUrl;
  const ins = await db.from("ad_creatives").insert({ product_slug: slug, kind: "upload", group_id: groupId, format, url, storage_path: path, active: true }).select("*").single();
  if (ins.error) throw new Error(ins.error.message);
  return ins.data as Creative;
}

export async function setCreativeGroupActive(groupId: string, active: boolean) {
  const res = await supabaseAdmin().from("ad_creatives").update({ active }).eq("group_id", groupId);
  if (res.error) throw new Error(res.error.message);
}
