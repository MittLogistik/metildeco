"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { CATALOG_TAG } from "@/lib/catalog";
import { saveExperimentSettings, type ExperimentMode } from "@/lib/experiments";
import type { ActionResult } from "../../actions";

/** Läge och andel för A/B-testet av köprutan. Produktsidorna byggs om direkt. */
export async function saveExperimentAction(formData: FormData): Promise<ActionResult> {
  await requireAdmin();
  const raw = String(formData.get("mode") ?? "off");
  const mode: ExperimentMode = raw === "ab" || raw === "on" ? raw : "off";
  const split = Math.min(100, Math.max(0, Math.round(Number(formData.get("split") ?? 50) || 0)));
  try {
    await saveExperimentSettings({ mode, split });
    revalidateTag(CATALOG_TAG, "max");
    revalidatePath("/sv", "layout");
    revalidatePath("/admin/annonser/abtest");
    return { ok: true, message: mode === "off" ? "Testet är av: alla ser nuvarande köpruta." : mode === "on" ? "Erbjudandet visas för alla." : `Testet är på: ${split} % ser erbjudandet.` };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Kunde inte spara." };
  }
}
