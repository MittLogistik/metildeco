"use server";

import { revalidatePath } from "next/cache";
import { getSettings, retryPostback, saveSettings, syncCommissions } from "@/lib/affiliate";
import { requireAdmin } from "@/lib/auth";
import type { ActionResult } from "../actions";

const str = (fd: FormData, k: string, max = 300) => String(fd.get(k) ?? "").trim().slice(0, max);

/** Sparar inställningarna för AddRevenue. Token ligger i miljön, aldrig här. */
export async function saveAffiliateSettings(formData: FormData): Promise<ActionResult> {
  await requireAdmin();
  const days = Number(str(formData, "attributionDays", 6));
  if (!Number.isFinite(days) || days < 1 || days > 365) return { ok: false, error: "Attributionsdagar måste vara mellan 1 och 365." };
  const endpointUrl = str(formData, "endpointUrl", 300);
  const apiBaseUrl = str(formData, "apiBaseUrl", 300);
  if (!/^https:\/\//.test(endpointUrl) || !/^https:\/\//.test(apiBaseUrl)) return { ok: false, error: "Adresserna måste börja med https://." };
  const advertiserId = str(formData, "advertiserId", 40);
  if (!advertiserId) return { ok: false, error: "Ange annonsör-ID." };

  // Momssatserna skrivs som "SE=0.12, DE=0.19" och sparas per land
  const vatRates: Record<string, number> = {};
  for (const part of str(formData, "vatRates", 600).split(/[,\n]/)) {
    const m = part.trim().match(/^([A-Za-z]{2}|default)\s*[=:]\s*([\d.,]+)$/);
    if (!m) continue;
    const rate = Number(m[2]!.replace(",", "."));
    if (!Number.isFinite(rate) || rate < 0 || rate > 1) return { ok: false, error: `Ogiltig momssats: ${part.trim()}. Skriv den som andel, t.ex. SE=0.12.` };
    vatRates[m[1] === "default" ? "default" : m[1]!.toUpperCase()] = rate;
  }

  try {
    await saveSettings({
      enabled: formData.get("enabled") === "on",
      advertiserId,
      endpointUrl,
      apiBaseUrl,
      attributionDays: Math.round(days),
      ...(Object.keys(vatRates).length ? { vatRates } : {}),
    });
    revalidatePath("/admin/affiliate");
    return { ok: true, message: "Inställningarna är sparade." };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Kunde inte spara." };
  }
}

/** Skickar om en konvertering manuellt. */
export async function resendPostback(formData: FormData): Promise<ActionResult> {
  await requireAdmin();
  const id = str(formData, "id", 60);
  if (!id) return { ok: false, error: "Ogiltigt." };
  const r = await retryPostback(id);
  revalidatePath("/admin/affiliate");
  return r.ok ? { ok: true, message: "Konverteringen är skickad." } : { ok: false, error: r.error ?? "Kunde inte skicka." };
}

/** Hämtar provisionerna direkt i stället för att vänta på cron. */
export async function syncAffiliateCommissions(): Promise<ActionResult> {
  await requireAdmin();
  try {
    const r = await syncCommissions();
    revalidatePath("/admin/affiliate");
    if (r.error) return { ok: false, error: r.error };
    return { ok: true, message: `${r.updated} av ${r.checked} ordrar uppdaterade.` };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Kunde inte hämta provisioner." };
  }
}

/** Formulärvariant, för knappen i adminpanelen. */
export async function syncCommissionsAction(): Promise<ActionResult> {
  return syncAffiliateCommissions();
}

export { getSettings };
