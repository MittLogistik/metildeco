import "server-only";
import { randomUUID } from "node:crypto";
import { scriptLines, styleById } from "@/content/ad-styles";
import { getProduct } from "./catalog";
import { generateImage, higgsfieldConfigured, listPresets, type HfAspect, type HfQuality } from "./higgsfield";
import { qaConfigured, reviewImage, type Review } from "./ad-qa";
import { overlayText, type OverlaySpec } from "./ad-overlay";
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
  image_score: number | null;
  image_review: Review | null;
  reviewed_at: string | null;
};

export type CreativeGroup = { groupId: string; label: string; kind: string; feed: Creative | null; story: Creative | null; sceneId: string | null; createdAt: string };

/** Lägsta poängen i gruppen – motorn använder bara grupper där alla bilder är godkända. */
export const groupScore = (g: CreativeGroup): number | null => {
  const scores = [g.feed?.image_score, g.story?.image_score].filter((s): s is number => typeof s === "number");
  return scores.length ? Math.min(...scores) : null;
};

/** Grupperar bilderna per scen: en flödesbild (1:1 eller 3:4) och ev. en storybild (9:16). */
export async function listCreativeGroups(slug: string, onlyActive = true): Promise<CreativeGroup[]> {
  // Alla rader hämtas alltid, även dolda: numreringen av egna bilder ska bli densamma
  // i admin och i annonsmotorn, oavsett om något är dolt.
  const { data, error } = await supabaseAdmin().from("ad_creatives").select("*").eq("product_slug", slug).order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  const rows = (data ?? []) as Creative[];

  const sceneLabel = (id: string | null) =>
    id?.includes(" · ") ? `${id.split(" · ")[0]} · ${scenes.find((s) => s.id === id.split(" · ")[1])?.label ?? id.split(" · ")[1]}` : (scenes.find((s) => s.id === id)?.label ?? id);
  const labelFor = (c: Creative) =>
    c.kind === "upload" ? "Egen bild" : c.kind === "graphic" ? `Text · ${(c.prompt ?? "").replace(/^\[text\] /, "").split(" / ")[0]}` : (sceneLabel(c.scene_id) ?? "Scen");

  // Gruppens tid = den första bilden i den. Används både för ordningen och för datumet i admin.
  const created = new Map<string, string>();
  const baseLabel = new Map<string, string>();
  for (const c of rows) {
    const earlier = created.get(c.group_id);
    created.set(c.group_id, earlier && earlier < c.created_at ? earlier : c.created_at);
    baseLabel.set(c.group_id, labelFor(c));
  }

  // Namn som flera grupper delar numreras i den ordning de skapades, så att varje
  // bilduppsättning går att skilja åt här och i Meta. Numret räknas över alla grupper,
  // även dolda, så att det är detsamma i admin som i annonsmotorn.
  const label = new Map<string, string>();
  const byLabel = new Map<string, string[]>();
  for (const [gid, l] of baseLabel) byLabel.set(l, (byLabel.get(l) ?? []).concat(gid));
  for (const [l, ids] of byLabel) {
    if (ids.length === 1) label.set(ids[0]!, l);
    else ids.sort((x, y) => created.get(x)!.localeCompare(created.get(y)!)).forEach((gid, i) => label.set(gid, `${l} ${i + 1}`));
  }

  const groups = new Map<string, CreativeGroup>();
  for (const c of rows) {
    if (onlyActive && !c.active) continue;
    const g = groups.get(c.group_id) ?? {
      groupId: c.group_id,
      label: label.get(c.group_id) ?? labelFor(c),
      kind: c.kind,
      feed: null,
      story: null,
      sceneId: c.scene_id,
      createdAt: created.get(c.group_id) ?? c.created_at,
    };
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

/** Väljer scener: de angivna, annars nästa `count` som inte redan finns som egen scen. */
export async function pickScenes(slug: string, sceneIds?: string[], count = 3): Promise<Scene[]> {
  if (sceneIds?.length) return scenes.filter((s) => sceneIds.includes(s.id));
  const existing = await listCreativeGroups(slug, false);
  // Mallbilder räknas inte som "använd scen": samma scen kan göras i flera mallar
  const used = new Set(existing.filter((g) => g.kind === "scene").map((g) => g.sceneId));
  return scenes.filter((s) => !used.has(s.id)).slice(0, count);
}

export type GenerateOneOptions = {
  slug: string;
  sceneId: string;
  format: string;
  /** Publik bas-URL för packshoten. */
  mediaBase: string;
  /** Bilder i samma scen delar grupp; utelämnas skapas en ny. */
  groupId?: string;
  presetId?: string;
  styleId?: string;
  quality?: HfQuality;
  parentGroupId?: string;
};

/**
 * Genererar EN bild (en scen i ett format), granskar den och sparar den. Anropas bild för bild
 * från webbläsaren så att varje anrop håller sig under serverns tidsgräns.
 */
export async function generateOne(o: GenerateOneOptions): Promise<{ creative: Creative; label: string; rejected: boolean; note: string | null }> {
  if (!higgsfieldConfigured()) throw new Error("HF_CREDENTIALS saknas.");
  const product = await getProduct(o.slug);
  if (!product) throw new Error(`Produkten ${o.slug} finns inte.`);
  const scene = scenes.find((s) => s.id === o.sceneId);
  if (!scene) throw new Error("Okänd scen.");
  const packshot = `${o.mediaBase.replace(/\/$/, "")}${primaryImage(product)}`;
  const groupId = o.groupId ?? randomUUID();

  // Med en Higgsfield-mall styr mallen kompositionen; vår scen blir budskapet.
  const allPresets = o.presetId || o.styleId ? await listPresets() : [];
  const style = o.styleId ? styleById(o.styleId) : undefined;
  const script = style ? style.script(product) : null;
  const allowed = script ? scriptLines(script) : [];
  let preset = o.presetId ? allPresets.find((p) => p.id === o.presetId) : undefined;
  if (style) {
    // Stil = mall + manus. Mallen väljs per format: första av stilens mallar i rätt format, annars första som finns.
    const want = o.format === "9:16" ? "9:16" : o.format === "3:4" ? "3:4" : "1:1";
    const candidates = style.presets.map((n) => allPresets.find((p) => p.name === n)).filter((p): p is NonNullable<typeof p> => Boolean(p));
    preset = candidates.find((p) => p.metadata?.aspect_ratio === want) ?? candidates[0];
  }

  // Mallarna lägger gärna till egen text och rekvisita: begränsa dem hårt, granskaren fångar resten
  const prompt = style && script
    ? `${buildPrompt(product, scene)} Layout: ${style.layout} The ONLY text allowed in the image, written exactly and in Swedish: headline "${script.headline}"${script.sub ? `, subline "${script.sub}"` : ""}, items: ${script.bullets.map((b) => `"${b}"`).join(", ")}${script.extra?.length ? `, additional: ${script.extra.map((b) => `"${b}"`).join(", ")}` : ""}. Write each line exactly once, never repeat the product name. No other words, no English, no claims about effects, no stars or review counts, no fruits or ingredients, no people.`
    : preset
      ? `${buildPrompt(product, scene)} Any text in the image must be in Swedish and limited to the product name "${product.name.replace(/ \|.*$/, "")}" and the facts "${product.short}". No benefit or effect claims, no English words, no fruits or ingredients, no badges with claims.`
      : buildPrompt(product, scene);
  const label = style ? `${style.label} · ${scene.label}` : preset ? `${preset.name} · ${scene.label}` : scene.label;
  const kind = style ? "style" : preset ? "preset" : "scene";
  const sceneKey = style ? `${style.label} · ${scene.id}` : preset ? `${preset.name} · ${scene.id}` : scene.id;

  const hfUrl = await generateImage({ prompt, imageUrls: [packshot], aspectRatio: formatAspect[o.format] ?? "1:1", resolution: "1k", quality: o.quality, presetId: preset?.id });
  const stored = await storeImage(hfUrl, `ads/${o.slug}/${groupId}-${o.format.replace(":", "x")}`);
  // AI-granskning mot referensen: underkända bilder sparas men döljs för motorn
  let review: Review | null = null;
  let note: string | null = null;
  if (qaConfigured()) {
    try {
      review = await reviewImage({ referenceUrl: packshot, imageUrl: stored.url, product, allowedText: allowed.length ? allowed : undefined });
    } catch (e) {
      note = `Granskning: ${e instanceof Error ? e.message : e}`;
    }
  }
  const rejected = review?.verdict === "reject";
  if (rejected) note = `Underkänd (${review!.score}): ${review!.issues.join("; ") || review!.notes}`;
  const row = { product_slug: o.slug, kind, scene_id: sceneKey, prompt: kind === "scene" ? prompt : `[${style?.id ?? preset?.name}] ${prompt}`, group_id: groupId, format: o.format, url: stored.url, storage_path: stored.path, parent_group_id: o.parentGroupId ?? null, active: !rejected, image_score: review?.score ?? null, image_review: review, reviewed_at: review ? new Date().toISOString() : null };
  const ins = await supabaseAdmin().from("ad_creatives").insert(row).select("*").single();
  if (ins.error) throw new Error(ins.error.message);
  return { creative: ins.data as Creative, label, rejected, note };
}

/**
 * Kompletterar en bildgrupp med ett format som saknas (t.ex. 9:16 när bara 1:1 finns),
 * med samma scen, stil eller mall som gruppen gjordes med.
 */
export async function completeGroup(o: { groupId: string; format: string; mediaBase: string }): Promise<{ creative: Creative; rejected: boolean; note: string | null }> {
  const rows = (await supabaseAdmin().from("ad_creatives").select("*").eq("group_id", o.groupId)).data as Creative[] | null;
  const base = rows?.[0];
  if (!base) throw new Error("Bildgruppen finns inte.");
  if (rows!.some((r) => r.format === o.format)) throw new Error("Formatet finns redan i gruppen.");
  if (base.kind === "upload" || base.kind === "graphic") throw new Error("Bara genererade bilder kan kompletteras.");
  const sceneId = base.scene_id?.includes(" · ") ? base.scene_id.split(" · ").pop()! : (base.scene_id ?? "studio");
  const tag = base.prompt?.match(/^\[([^\]]+)\] /)?.[1];
  const style = tag ? styleById(tag) : undefined;
  let presetId: string | undefined;
  if (tag && !style) presetId = (await listPresets()).find((p) => p.name === tag)?.id;
  const r = await generateOne({ slug: base.product_slug, sceneId, format: o.format, mediaBase: o.mediaBase, groupId: o.groupId, styleId: style?.id, presetId, quality: style || presetId ? "high" : undefined, parentGroupId: base.parent_group_id ?? undefined });
  return { creative: r.creative, rejected: r.rejected, note: r.note };
}

/**
 * Genererar flera scener i följd (används av motorn vid iteration). Från admin körs i stället
 * generateOne bild för bild via /api/admin/ad-images, så att varje anrop är kort.
 */
export async function generateScenes(o: { slug: string; sceneIds?: string[]; count?: number; formats?: string[]; mediaBase: string; parentGroupId?: string; presetId?: string; quality?: HfQuality; styleId?: string }): Promise<{ groups: CreativeGroup[]; notes: string[] }> {
  const formats = o.formats?.length ? o.formats : ["1:1", "9:16"];
  const pick = await pickScenes(o.slug, o.sceneIds, o.count ?? 3);
  if (pick.length === 0) throw new Error("Alla scener är redan genererade för produkten. Välj scener att göra om.");
  const notes: string[] = [];
  const groups: CreativeGroup[] = [];
  for (const scene of pick) {
    const groupId = randomUUID();
    const g: CreativeGroup = { groupId, label: scene.label, kind: "scene", feed: null, story: null, sceneId: scene.id, createdAt: new Date().toISOString() };
    for (const format of formats) {
      try {
        const r = await generateOne({ slug: o.slug, sceneId: scene.id, format, mediaBase: o.mediaBase, groupId, presetId: o.presetId, styleId: o.styleId, quality: o.quality, parentGroupId: o.parentGroupId });
        g.label = r.label;
        g.kind = r.creative.kind;
        if (r.note) notes.push(`${r.label} ${format}: ${r.note}`);
        if (format === "9:16") g.story = r.creative;
        else g.feed = r.creative;
      } catch (e) {
        notes.push(`${scene.label} ${format}: ${e instanceof Error ? e.message : e}`);
      }
    }
    if (g.feed || g.story) groups.push(g);
  }
  return { groups, notes };
}

/**
 * Skapar en grafisk variant av en bildgrupp: samma bilder med text pålagd i kod.
 * Blir en egen grupp (kind "graphic") så att motorn testar den som en egen bild.
 */
export async function addTextVariant(o: { slug: string; groupId: string; overlay: OverlaySpec; mediaBase: string }): Promise<CreativeGroup> {
  const db = supabaseAdmin();
  const product = await getProduct(o.slug);
  if (!product) throw new Error("Produkten finns inte.");
  const src = (await db.from("ad_creatives").select("*").eq("group_id", o.groupId)).data as Creative[] | null;
  if (!src?.length) throw new Error("Bildgruppen finns inte.");
  const packshot = `${o.mediaBase.replace(/\/$/, "")}${primaryImage(product)}`;
  const newGroup = randomUUID();
  const base = src[0]!;
  const g: CreativeGroup = { groupId: newGroup, label: `Text · ${o.overlay.headline}`, kind: "graphic", feed: null, story: null, sceneId: base.scene_id, createdAt: new Date().toISOString() };
  for (const c of src) {
    const img = await fetch(c.url);
    if (!img.ok) throw new Error(`Kunde inte hämta bilden (${img.status}).`);
    const out = await overlayText(Buffer.from(await img.arrayBuffer()), o.overlay);
    const pathName = `ads/${o.slug}/${newGroup}-${c.format.replace(":", "x")}.jpg`;
    const up = await db.storage.from("product-media").upload(pathName, out, { contentType: "image/jpeg", upsert: true });
    if (up.error) throw new Error(up.error.message);
    const url = db.storage.from("product-media").getPublicUrl(pathName).data.publicUrl;
    let review: Review | null = null;
    if (qaConfigured()) review = await reviewImage({ referenceUrl: packshot, imageUrl: url, product, allowedText: [o.overlay.eyebrow, o.overlay.headline, o.overlay.subline].filter((t): t is string => Boolean(t)) }).catch(() => null);
    const ins = await db
      .from("ad_creatives")
      .insert({ product_slug: o.slug, kind: "graphic", scene_id: c.scene_id, prompt: `[text] ${o.overlay.headline}${o.overlay.subline ? ` / ${o.overlay.subline}` : ""}`, group_id: newGroup, format: c.format, url, storage_path: pathName, parent_group_id: o.groupId, active: review?.verdict !== "reject", image_score: review?.score ?? null, image_review: review, reviewed_at: review ? new Date().toISOString() : null })
      .select("*")
      .single();
    if (ins.error) throw new Error(ins.error.message);
    const row = ins.data as Creative;
    if (row.format === "9:16") g.story = row;
    else g.feed = row;
  }
  return g;
}

export const uploadFormats = ["1:1", "3:4", "9:16"] as const;

/**
 * Signerad adress dit webbläsaren lägger filen direkt. Serveraktioner tar bara emot
 * någon megabyte, så egna annonsbilder går utanför dem – hit och sedan registerUploadedCreative.
 */
export async function signAdUpload(o: { slug: string; groupId: string; format: string; ext: string }): Promise<{ signedUrl: string; path: string }> {
  const ext = /^[a-z0-9]{1,5}$/.test(o.ext) ? o.ext : "jpg";
  const path = `ads/${o.slug}/${o.groupId}-${o.format.replace(":", "x")}-${Date.now().toString(36)}.${ext}`;
  const { data, error } = await supabaseAdmin().storage.from("product-media").createSignedUploadUrl(path);
  if (error || !data) throw new Error(error?.message ?? "Kunde inte skapa uppladdningsadress.");
  return { signedUrl: data.signedUrl, path: data.path ?? path };
}

/**
 * Registrerar en redan uppladdad fil som annonsbild och granskar den mot packshoten.
 * Samma group_id betyder samma grupp, så en 1:1 och en 9:16 hör ihop som flöde + story.
 */
export async function registerUploadedCreative(o: { slug: string; groupId: string; format: string; path: string; referenceUrl?: string }): Promise<{ creative: Creative; rejected: boolean; note: string | null }> {
  const db = supabaseAdmin();
  const url = db.storage.from("product-media").getPublicUrl(o.path).data.publicUrl;
  const head = await fetch(url, { method: "HEAD" }).catch(() => null);
  if (!head?.ok) throw new Error("Filen kom aldrig fram till lagringen.");
  let review: Review | null = null;
  if (qaConfigured() && o.referenceUrl) {
    const product = await getProduct(o.slug);
    if (product) review = await reviewImage({ referenceUrl: o.referenceUrl, imageUrl: url, product }).catch(() => null);
  }
  const rejected = review?.verdict === "reject";
  const ins = await db
    .from("ad_creatives")
    .insert({ product_slug: o.slug, kind: "upload", group_id: o.groupId, format: o.format, url, storage_path: o.path, active: !rejected, image_score: review?.score ?? null, image_review: review, reviewed_at: review ? new Date().toISOString() : null })
    .select("*")
    .single();
  if (ins.error) throw new Error(ins.error.message);
  return { creative: ins.data as Creative, rejected, note: review?.issues.join("; ") || review?.notes || null };
}

export async function setCreativeGroupActive(groupId: string, active: boolean) {
  const res = await supabaseAdmin().from("ad_creatives").update({ active }).eq("group_id", groupId);
  if (res.error) throw new Error(res.error.message);
}

/** Antal annonser som byggts av varje bildgrupp. Bilden ligger kvar hos Meta även om gruppen tas bort. */
export async function adsPerGroup(slug: string): Promise<Map<string, number>> {
  const res = await supabaseAdmin().from("ad_variants").select("group_id").eq("product_slug", slug).not("group_id", "is", null);
  const counts = new Map<string, number>();
  for (const r of (res.data ?? []) as { group_id: string }[]) counts.set(r.group_id, (counts.get(r.group_id) ?? 0) + 1);
  return counts;
}

/**
 * Tar bort en bildgrupp: filerna ur lagringen och raderna ur ad_creatives. Går inte att ångra.
 * Annonser som redan byggts av gruppen påverkas inte – Meta har en egen kopia av bilden –
 * men motorn kan inte längre iterera vidare på just den bilden.
 */
export async function deleteCreativeGroup(groupId: string): Promise<{ removed: number; slug: string | null }> {
  const db = supabaseAdmin();
  const rows = (await db.from("ad_creatives").select("id,product_slug,storage_path").eq("group_id", groupId)).data as
    | { id: string; product_slug: string; storage_path: string | null }[]
    | null;
  if (!rows?.length) throw new Error("Bildgruppen finns inte längre.");
  const paths = rows.map((r) => r.storage_path).filter((p): p is string => Boolean(p));
  if (paths.length) {
    const rm = await db.storage.from("product-media").remove(paths);
    // Saknad fil ska inte hindra att raden städas bort
    if (rm.error) console.error("[ad-images] kunde inte ta bort filer:", rm.error.message);
  }
  const del = await db.from("ad_creatives").delete().eq("group_id", groupId);
  if (del.error) throw new Error(del.error.message);
  return { removed: rows.length, slug: rows[0]?.product_slug ?? null };
}
