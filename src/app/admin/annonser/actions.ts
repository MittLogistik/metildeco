"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { buildTestCampaign, reviewAds } from "@/lib/ads-engine";
import * as meta from "@/lib/meta-ads";
import { supabaseAdmin, supabaseConfigured } from "@/lib/supabase";
import type { ActionResult } from "../actions";

const refresh = () => revalidatePath("/admin/annonser");

const fail = (e: unknown): ActionResult => ({ ok: false, error: e instanceof Error ? e.message : "Något gick fel." });

export async function createTestCampaign(formData: FormData): Promise<ActionResult> {
  await requireAdmin();
  const slug = String(formData.get("slug") ?? "");
  const dailyBudget = Number(formData.get("daily_budget") ?? 0);
  const adsCount = Number(formData.get("ads_count") ?? 10);
  const mediaBase = String(formData.get("media_base") ?? "").trim() || undefined;
  const linkBase = String(formData.get("link_base") ?? "").trim() || undefined;
  if (!slug || !(dailyBudget >= 1)) return { ok: false, error: "Välj produkt och en daglig budget på minst 1." };
  try {
    const r = await buildTestCampaign({ slug, dailyBudget, adsCount, mediaBase, linkBase, source: "admin" });
    refresh();
    const notes = r.notes.length ? ` Anmärkningar: ${r.notes.join(" · ")}` : "";
    return { ok: true, message: `Skapade kampanj ${r.campaignId} med ${r.ads.length} annonser (pausade).${notes}` };
  } catch (e) {
    return fail(e);
  }
}

export async function setObjectStatus(formData: FormData): Promise<ActionResult> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  const name = String(formData.get("name") ?? id);
  if (!id || (status !== "ACTIVE" && status !== "PAUSED")) return { ok: false, error: "Ogiltigt." };
  try {
    await meta.setStatus(id, status);
    if (supabaseConfigured())
      await supabaseAdmin().from("ad_log").insert({ name, action: status === "ACTIVE" ? "activate" : "pause", reason: "Manuellt i admin", applied: true, source: "admin", ...(String(formData.get("level")) === "ad" ? { ad_id: id } : String(formData.get("level")) === "adset" ? { adset_id: id } : { campaign_id: id }) });
    refresh();
    return { ok: true, message: status === "ACTIVE" ? "Aktiverad." : "Pausad." };
  } catch (e) {
    return fail(e);
  }
}

export async function setAdSetBudget(formData: FormData): Promise<ActionResult> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const budget = Number(formData.get("budget") ?? 0);
  if (!id || !(budget >= 1)) return { ok: false, error: "Budget måste vara minst 1." };
  try {
    await meta.setDailyBudget(id, budget);
    if (supabaseConfigured()) await supabaseAdmin().from("ad_log").insert({ adset_id: id, name: String(formData.get("name") ?? id), action: "budget", reason: `Manuellt i admin: ${budget}/dag`, applied: true, source: "admin" });
    refresh();
    return { ok: true, message: `Budget satt till ${budget}/dag.` };
  } catch (e) {
    return fail(e);
  }
}

export async function runReview(formData: FormData): Promise<ActionResult> {
  await requireAdmin();
  const apply = String(formData.get("apply")) === "1";
  try {
    const decisions = await reviewAds({ apply, source: "admin" });
    refresh();
    const acted = decisions.filter((d) => d.action !== "keep");
    if (acted.length === 0) return { ok: true, message: "Inga åtgärder behövs just nu." };
    return { ok: true, message: `${apply ? "Utförde" : "Föreslår"} ${acted.length} åtgärder – se loggen nedan.` };
  } catch (e) {
    return fail(e);
  }
}

/* --------------------------------- Bilder --------------------------------- */

export async function generateAdImages(formData: FormData): Promise<ActionResult> {
  await requireAdmin();
  const slug = String(formData.get("slug") ?? "");
  const sceneIds = formData.getAll("scene").map(String).filter(Boolean);
  const formats = String(formData.get("formats") ?? "1:1,9:16").split(",").filter(Boolean);
  const mediaBase = String(formData.get("media_base") ?? "").trim();
  if (!slug || !mediaBase) return { ok: false, error: "Produkt och bas-URL krävs." };
  try {
    const { generateScenes } = await import("@/lib/ad-images");
    const q = String(formData.get("quality") ?? "");
    const quality = q === "low" || q === "medium" || q === "high" ? q : undefined;
    const stil = String(formData.get("preset_id") ?? "").trim();
    const styleId = stil.startsWith("style:") ? stil.slice(6) : undefined;
    const presetId = !styleId && stil ? stil : undefined;
    const r = await generateScenes({ slug, sceneIds, formats, mediaBase, count: 3, quality, presetId, styleId });
    revalidatePath("/admin/annonser/bilder");
    const notes = r.notes.length ? ` Anmärkningar: ${r.notes.join(" · ")}` : "";
    return { ok: true, message: `Genererade ${r.groups.length} scener (${r.groups.map((g) => g.label).join(", ")}).${notes}` };
  } catch (e) {
    return fail(e);
  }
}

export async function uploadAdImage(formData: FormData): Promise<ActionResult> {
  await requireAdmin();
  const slug = String(formData.get("slug") ?? "");
  const format = String(formData.get("format") ?? "1:1");
  const file = formData.get("file");
  if (!slug || !(file instanceof File) || file.size === 0) return { ok: false, error: "Välj en fil." };
  if (file.size > 15 * 1024 * 1024) return { ok: false, error: "Filen är större än 15 MB." };
  try {
    const { addUploadedCreative } = await import("@/lib/ad-images");
    const { getProduct } = await import("@/lib/catalog");
    const { primaryImage } = await import("@/lib/products");
    const mediaBase = String(formData.get("media_base") ?? "").trim() || "https://metildeco.vercel.app";
    const product = await getProduct(slug);
    const ref = product ? `${mediaBase.replace(/\/$/, "")}${primaryImage(product)}` : undefined;
    await addUploadedCreative(slug, file, format, ref);
    revalidatePath("/admin/annonser/bilder");
    return { ok: true, message: "Bilden är uppladdad." };
  } catch (e) {
    return fail(e);
  }
}

export async function addTextVariantAction(formData: FormData): Promise<ActionResult> {
  await requireAdmin();
  const slug = String(formData.get("slug") ?? "");
  const groupId = String(formData.get("group_id") ?? "");
  const headline = String(formData.get("headline") ?? "").trim();
  const subline = String(formData.get("subline") ?? "").trim() || undefined;
  const theme = String(formData.get("theme")) === "green" ? "green" : "sand";
  const pos = String(formData.get("position"));
  const position = pos === "bottom" ? "bottom" : pos === "top" ? "top" : "auto";
  const mediaBase = String(formData.get("media_base") ?? "").trim() || "https://metildeco.vercel.app";
  if (!slug || !groupId || !headline) return { ok: false, error: "Rubrik krävs." };
  try {
    const { addTextVariant } = await import("@/lib/ad-images");
    const g = await addTextVariant({ slug, groupId, overlay: { headline, subline, eyebrow: "Metilde", theme, position }, mediaBase });
    revalidatePath("/admin/annonser/bilder");
    const score = [g.feed?.image_score, g.story?.image_score].filter((s) => typeof s === "number");
    return { ok: true, message: `Textvariant skapad${score.length ? `, poäng ${score.join("/")}` : ""}.` };
  } catch (e) {
    return fail(e);
  }
}

export async function setGroupActive(formData: FormData): Promise<ActionResult> {
  await requireAdmin();
  const groupId = String(formData.get("group_id") ?? "");
  const active = String(formData.get("active")) === "1";
  if (!groupId) return { ok: false, error: "Ogiltigt." };
  try {
    const { setCreativeGroupActive } = await import("@/lib/ad-images");
    await setCreativeGroupActive(groupId, active);
    revalidatePath("/admin/annonser/bilder");
    return { ok: true, message: active ? "Bilden används igen." : "Bilden är dold för motorn." };
  } catch (e) {
    return fail(e);
  }
}

export async function rereview(formData: FormData): Promise<ActionResult> {
  await requireAdmin();
  const adId = String(formData.get("ad_id") ?? "");
  if (!adId) return { ok: false, error: "Ogiltigt." };
  try {
    const { rereviewAd } = await import("@/lib/ads-engine");
    const r = await rereviewAd(adId);
    refresh();
    return { ok: true, message: `Poäng ${r.score} (${r.verdict === "ok" ? "godkänd" : r.verdict === "reject" ? "underkänd, pausad" : "granska manuellt"})${r.issues.length ? `: ${r.issues.join("; ")}` : ""}` };
  } catch (e) {
    return fail(e);
  }
}

export async function iterateAd(formData: FormData): Promise<ActionResult> {
  await requireAdmin();
  const adId = String(formData.get("ad_id") ?? "");
  const mediaBase = String(formData.get("media_base") ?? "").trim() || "https://metildeco.vercel.app";
  const status = String(formData.get("status")) === "ACTIVE" ? "ACTIVE" : "PAUSED";
  if (!adId) return { ok: false, error: "Ogiltigt." };
  try {
    const { iterateFromAd } = await import("@/lib/ads-engine");
    const r = await iterateFromAd({ adId, mediaBase, status, source: "admin" });
    refresh();
    const notes = r.notes.length ? ` Anmärkningar: ${r.notes.join(" · ")}` : "";
    return { ok: true, message: `Skapade ${r.ads.length} nya annonser (${status === "ACTIVE" ? "aktiva" : "pausade"}).${notes}` };
  } catch (e) {
    return fail(e);
  }
}
