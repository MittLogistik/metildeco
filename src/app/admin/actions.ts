"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { createSessionClient, requireAdmin } from "@/lib/auth";
import { CATALOG_TAG } from "@/lib/catalog";
import { pushOrderToPlocky } from "@/lib/plocky";
import { supabaseAdmin } from "@/lib/supabase";
import { orderStatuses } from "./_components/fields";

export type ActionResult = { ok: true; message?: string } | { ok: false; error: string };

/** Tömmer katalogcachen så att butiken visar ändringen direkt. */
const refreshShop = () => {
  revalidateTag(CATALOG_TAG, "max");
  revalidatePath("/sv", "layout");
  revalidatePath("/admin", "layout");
};

export async function signOut() {
  const client = await createSessionClient();
  await client.auth.signOut();
  redirect("/admin/login");
}

/* ---------------------------------- Ordrar --------------------------------- */


export async function updateOrder(formData: FormData): Promise<ActionResult> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!id || !(orderStatuses as readonly string[]).includes(status)) return { ok: false, error: "Ogiltig status." };
  const db = supabaseAdmin();
  const before = (await db.from("orders").select("id,order_number,kind,status").eq("id", id).maybeSingle()).data as { id: string; order_number: string; kind: string; status: string } | null;
  if (!before) return { ok: false, error: "Ordern finns inte." };
  const res = await db
    .from("orders")
    .update({
      status,
      tracking_number: String(formData.get("tracking_number") ?? "").trim() || null,
      tracking_url: String(formData.get("tracking_url") ?? "").trim() || null,
    })
    .eq("id", id);
  if (res.error) return { ok: false, error: res.error.message };
  // En planerad prenumerationsleverans som släpps i förtid ska också till lagret
  if (status === "paid" && before.status === "scheduled") await pushOrderToPlocky(before);
  revalidatePath("/admin", "layout");
  return { ok: true, message: "Ordern är uppdaterad." };
}

/* --------------------------------- Produkter -------------------------------- */

const str = (fd: FormData, k: string, max = 2000) => String(fd.get(k) ?? "").trim().slice(0, max);
const num = (fd: FormData, k: string) => {
  const v = str(fd, k).replace(",", ".");
  return v === "" ? null : Number(v);
};
const lines = (fd: FormData, k: string) =>
  str(fd, k, 20000)
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean);
const list = (fd: FormData, k: string) =>
  str(fd, k)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
const bool = (fd: FormData, k: string) => fd.get(k) === "on" || fd.get(k) === "true";

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export async function saveProduct(formData: FormData): Promise<ActionResult> {
  await requireAdmin();
  const db = supabaseAdmin();
  const slug = str(formData, "slug", 120);
  const isNew = bool(formData, "isNew");
  if (!slugPattern.test(slug)) return { ok: false, error: "Slug får bara innehålla små bokstäver, siffror och bindestreck." };
  const price = num(formData, "price");
  if (price === null || price < 0) return { ok: false, error: "Ange ett pris." };
  const name = str(formData, "name", 200);
  if (!name) return { ok: false, error: "Ange ett namn." };

  const row = {
    slug,
    name,
    category: str(formData, "category", 80) || "Övrigt",
    price,
    old_price: num(formData, "old_price"),
    purchase_price: num(formData, "purchase_price"),
    short: str(formData, "short", 300),
    bullets: lines(formData, "bullets"),
    description: lines(formData, "description"),
    tags: list(formData, "tags"),
    bg: str(formData, "bg", 20) || "#f2efe8",
    is_active: bool(formData, "is_active"),
    sort_order: num(formData, "sort_order") ?? 0,
    sku: str(formData, "sku", 60) || null,
    stock: Math.max(0, Math.floor(num(formData, "stock") ?? 0)),
    track_stock: bool(formData, "track_stock"),
    tiered_pricing: bool(formData, "tiered_pricing"),
    tier_2_discount: Math.min(90, Math.max(0, Math.floor(num(formData, "tier_2_discount") ?? 10))),
    tier_3_discount: Math.min(90, Math.max(0, Math.floor(num(formData, "tier_3_discount") ?? 15))),
    gtin: str(formData, "gtin", 20) || null,
    mpn: str(formData, "mpn", 60) || null,
    google_product_category: str(formData, "google_product_category", 200) || null,
    brand: str(formData, "brand", 60) || "Metilde",
    customs_description: str(formData, "customs_description", 200) || null,
    customs_code: str(formData, "customs_code", 20) || null,
    country_of_origin: str(formData, "country_of_origin", 2).toUpperCase() || null,
    weight_grams: num(formData, "weight_grams"),
    video_url: str(formData, "video_url", 500) || null,
    video_poster_url: str(formData, "video_poster_url", 500) || null,
    countries: list(formData, "countries").map((c) => c.toUpperCase()),
  };

  if (isNew) {
    const exists = await db.from("products").select("slug").eq("slug", slug).maybeSingle();
    if (exists.data) return { ok: false, error: "Det finns redan en produkt med den slugen." };
    const ins = await db.from("products").insert({ ...row, images: [], story_images: [] });
    if (ins.error) return { ok: false, error: ins.error.message };
  } else {
    const upd = await db.from("products").update(row).eq("slug", slug);
    if (upd.error) return { ok: false, error: upd.error.message };
  }

  // SEK-priset i product_prices är det butiken visar – håll det i synk
  const existingPrice = await db.from("product_prices").select("id").eq("product_slug", slug).eq("currency", "SEK").maybeSingle();
  const priceRow = { product_slug: slug, currency: "SEK", price, old_price: row.old_price };
  const priceRes = existingPrice.data
    ? await db.from("product_prices").update(priceRow).eq("id", existingPrice.data.id)
    : await db.from("product_prices").insert(priceRow);
  if (priceRes.error) return { ok: false, error: priceRes.error.message };

  refreshShop();
  if (isNew) redirect(`/admin/produkter/${slug}`);
  return { ok: true, message: "Produkten är sparad." };
}

export async function setProductActive(slug: string, active: boolean): Promise<ActionResult> {
  await requireAdmin();
  const res = await supabaseAdmin().from("products").update({ is_active: active }).eq("slug", slug);
  if (res.error) return { ok: false, error: res.error.message };
  refreshShop();
  return { ok: true };
}

type ImageField = "images" | "story_images" | "story_hero_image";
const imageFields: ImageField[] = ["images", "story_images", "story_hero_image"];

const safeName = (name: string) =>
  name
    .toLowerCase()
    .replace(/[åä]/g, "a")
    .replace(/ö/g, "o")
    .replace(/[^a-z0-9.]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

/** Laddar upp en bild till Supabase Storage och kopplar den till produkten. */
export async function uploadProductImage(formData: FormData): Promise<ActionResult> {
  await requireAdmin();
  const slug = str(formData, "slug", 120);
  const field = str(formData, "field", 30) as ImageField;
  const file = formData.get("file");
  if (!slugPattern.test(slug) || !imageFields.includes(field)) return { ok: false, error: "Ogiltig begäran." };
  if (!(file instanceof File) || file.size === 0) return { ok: false, error: "Välj en fil." };
  if (file.size > 15 * 1024 * 1024) return { ok: false, error: "Filen är större än 15 MB." };

  const db = supabaseAdmin();
  const path = `${slug}/${Date.now()}-${safeName(file.name)}`;
  const up = await db.storage.from("product-media").upload(path, file, { contentType: file.type, upsert: false });
  if (up.error) return { ok: false, error: up.error.message };
  const url = db.storage.from("product-media").getPublicUrl(path).data.publicUrl;

  if (field === "story_hero_image") {
    const res = await db.from("products").update({ story_hero_image: url }).eq("slug", slug);
    if (res.error) return { ok: false, error: res.error.message };
  } else {
    const cur = await db.from("products").select(field).eq("slug", slug).single();
    if (cur.error) return { ok: false, error: cur.error.message };
    const arr = ((cur.data as Record<string, string[] | null>)[field] ?? []).concat(url);
    const res = await db.from("products").update({ [field]: arr }).eq("slug", slug);
    if (res.error) return { ok: false, error: res.error.message };
  }
  refreshShop();
  return { ok: true, message: "Bilden är uppladdad." };
}

/** Tar bort eller flyttar en bild i produktens bildlista. */
export async function editProductImage(formData: FormData): Promise<ActionResult> {
  await requireAdmin();
  const slug = str(formData, "slug", 120);
  const field = str(formData, "field", 30) as ImageField;
  const url = str(formData, "url", 1000);
  const op = str(formData, "op", 10);
  if (!slugPattern.test(slug) || !imageFields.includes(field)) return { ok: false, error: "Ogiltig begäran." };
  const db = supabaseAdmin();

  if (field === "story_hero_image") {
    const res = await db.from("products").update({ story_hero_image: null }).eq("slug", slug);
    if (res.error) return { ok: false, error: res.error.message };
  } else {
    const cur = await db.from("products").select(field).eq("slug", slug).single();
    if (cur.error) return { ok: false, error: cur.error.message };
    const arr = [...(((cur.data as Record<string, string[] | null>)[field] ?? []) as string[])];
    const i = arr.indexOf(url);
    if (i === -1) return { ok: false, error: "Bilden finns inte längre." };
    if (op === "remove") arr.splice(i, 1);
    else if (op === "up" && i > 0) [arr[i - 1], arr[i]] = [arr[i]!, arr[i - 1]!];
    else if (op === "down" && i < arr.length - 1) [arr[i + 1], arr[i]] = [arr[i]!, arr[i + 1]!];
    const res = await db.from("products").update({ [field]: arr }).eq("slug", slug);
    if (res.error) return { ok: false, error: res.error.message };
  }
  refreshShop();
  return { ok: true };
}

/* ----------------------------------- Paket ---------------------------------- */

export async function saveBundle(formData: FormData): Promise<ActionResult> {
  await requireAdmin();
  const db = supabaseAdmin();
  const slug = str(formData, "slug", 120);
  const isNew = bool(formData, "isNew");
  if (!slugPattern.test(slug)) return { ok: false, error: "Slug får bara innehålla små bokstäver, siffror och bindestreck." };
  const price = num(formData, "price");
  if (price === null || price < 0) return { ok: false, error: "Ange ett pris." };
  const name = str(formData, "name", 200);
  if (!name) return { ok: false, error: "Ange ett namn." };

  // Ingående produkter: en rad per produkt, "slug" eller "slug x 2"
  const components = lines(formData, "components").map((line, i) => {
    const m = line.match(/^([a-z0-9-]+)\s*(?:[x×]\s*(\d+))?$/i);
    return m ? { product_slug: m[1]!.toLowerCase(), qty: Math.max(1, Number(m[2] ?? 1)), sort_order: i } : null;
  });
  if (components.some((c) => c === null) || components.length === 0) {
    return { ok: false, error: "Ingående produkter: skriv en produkt-slug per rad, t.ex. tongkat-ali-elite x 2." };
  }
  const known = await db.from("products").select("slug").in("slug", components.map((c) => c!.product_slug));
  const knownSlugs = new Set((known.data ?? []).map((r) => r.slug as string));
  const unknown = components.filter((c) => !knownSlugs.has(c!.product_slug));
  if (unknown.length) return { ok: false, error: `Okänd produkt: ${unknown.map((c) => c!.product_slug).join(", ")}` };

  const row = {
    slug,
    name,
    short: str(formData, "short", 400),
    description: lines(formData, "description"),
    price,
    bg: str(formData, "bg", 20) || "#f2efe8",
    free_shipping: bool(formData, "free_shipping"),
    is_active: bool(formData, "is_active"),
    sort_order: num(formData, "sort_order") ?? 0,
    sku: str(formData, "sku", 60) || null,
    seo_title: str(formData, "seo_title", 200) || null,
    seo_description: str(formData, "seo_description", 400) || null,
  };
  const saved = isNew
    ? await db.from("bundles").insert({ ...row, images: [] })
    : await db.from("bundles").update(row).eq("slug", slug);
  if (saved.error) return { ok: false, error: saved.error.message };

  const del = await db.from("bundle_components").delete().eq("bundle_slug", slug);
  if (del.error) return { ok: false, error: del.error.message };
  const ins = await db.from("bundle_components").insert(components.map((c) => ({ bundle_slug: slug, ...c! })));
  if (ins.error) return { ok: false, error: ins.error.message };

  const existingPrice = await db.from("bundle_prices").select("id").eq("bundle_slug", slug).eq("currency", "SEK").maybeSingle();
  const priceRow = { bundle_slug: slug, currency: "SEK", price, old_price: num(formData, "old_price") };
  const priceRes = existingPrice.data
    ? await db.from("bundle_prices").update(priceRow).eq("id", existingPrice.data.id)
    : await db.from("bundle_prices").insert(priceRow);
  if (priceRes.error) return { ok: false, error: priceRes.error.message };

  refreshShop();
  if (isNew) redirect(`/admin/paket/${slug}`);
  return { ok: true, message: "Paketet är sparat." };
}

export async function uploadBundleImage(formData: FormData): Promise<ActionResult> {
  await requireAdmin();
  const slug = str(formData, "slug", 120);
  const file = formData.get("file");
  if (!slugPattern.test(slug)) return { ok: false, error: "Ogiltig begäran." };
  if (!(file instanceof File) || file.size === 0) return { ok: false, error: "Välj en fil." };
  const db = supabaseAdmin();
  const path = `paket-${slug}/${Date.now()}-${safeName(file.name)}`;
  const up = await db.storage.from("product-media").upload(path, file, { contentType: file.type });
  if (up.error) return { ok: false, error: up.error.message };
  const url = db.storage.from("product-media").getPublicUrl(path).data.publicUrl;
  const cur = await db.from("bundles").select("images").eq("slug", slug).single();
  if (cur.error) return { ok: false, error: cur.error.message };
  const res = await db.from("bundles").update({ images: [...((cur.data.images as string[] | null) ?? []), url] }).eq("slug", slug);
  if (res.error) return { ok: false, error: res.error.message };
  refreshShop();
  return { ok: true, message: "Bilden är uppladdad." };
}

export async function editBundleImage(formData: FormData): Promise<ActionResult> {
  await requireAdmin();
  const slug = str(formData, "slug", 120);
  const url = str(formData, "url", 1000);
  const op = str(formData, "op", 10);
  const db = supabaseAdmin();
  const cur = await db.from("bundles").select("images").eq("slug", slug).single();
  if (cur.error) return { ok: false, error: cur.error.message };
  const arr = [...((cur.data.images as string[] | null) ?? [])];
  const i = arr.indexOf(url);
  if (i === -1) return { ok: false, error: "Bilden finns inte längre." };
  if (op === "remove") arr.splice(i, 1);
  else if (op === "up" && i > 0) [arr[i - 1], arr[i]] = [arr[i]!, arr[i - 1]!];
  else if (op === "down" && i < arr.length - 1) [arr[i + 1], arr[i]] = [arr[i]!, arr[i + 1]!];
  const res = await db.from("bundles").update({ images: arr }).eq("slug", slug);
  if (res.error) return { ok: false, error: res.error.message };
  refreshShop();
  return { ok: true };
}

/** Formulärvariant av setProductActive (knapp i produktlistan). */
export async function toggleProductActive(formData: FormData): Promise<ActionResult> {
  return setProductActive(str(formData, "slug", 120), formData.get("active") === "true");
}

/** Byter lösenord för den inloggade adminanvändaren. */
export async function changePassword(formData: FormData): Promise<ActionResult> {
  await requireAdmin();
  const password = String(formData.get("password") ?? "");
  const password2 = String(formData.get("password2") ?? "");
  if (password.length < 10) return { ok: false, error: "Lösenordet måste vara minst 10 tecken." };
  if (password !== password2) return { ok: false, error: "Lösenorden stämmer inte överens." };
  const client = await createSessionClient();
  const { error } = await client.auth.updateUser({ password });
  if (error) return { ok: false, error: error.message };
  return { ok: true, message: "Lösenordet är bytt." };
}

/** Markerar en övergiven korg som hanterad (t.ex. efter manuellt mejl). */
export async function markCartHandled(formData: FormData): Promise<ActionResult> {
  await requireAdmin();
  const id = str(formData, "id", 60);
  const res = await supabaseAdmin().from("abandoned_carts").update({ status: "handled" }).eq("id", id);
  if (res.error) return { ok: false, error: res.error.message };
  revalidatePath("/admin", "layout");
  return { ok: true };
}
