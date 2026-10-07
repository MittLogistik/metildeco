"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { PAGES_TAG, resetPage, savePage } from "@/lib/pages";
import type { ActionResult } from "../actions";

const refresh = (slug: string) => {
  revalidateTag(PAGES_TAG, "max");
  revalidatePath(`/sv/${slug}`);
  revalidatePath("/admin/sidor", "layout");
};

/** Sparar sidan från editorn. Innehållet kommer som JSON i fältet "page". */
export async function savePageAction(formData: FormData): Promise<ActionResult> {
  await requireAdmin();
  const slug = String(formData.get("slug") ?? "");
  try {
    const doc = JSON.parse(String(formData.get("page") ?? "{}"));
    await savePage(slug, doc);
    refresh(slug);
    return { ok: true, message: "Sparat. Sidan är uppdaterad på metilde.com." };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Kunde inte spara." };
  }
}

export async function resetPageAction(formData: FormData): Promise<ActionResult> {
  await requireAdmin();
  const slug = String(formData.get("slug") ?? "");
  try {
    await resetPage(slug);
    refresh(slug);
    return { ok: true, message: "Standardtexten visas igen. Ladda om sidan för att se den i editorn." };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Kunde inte återställa." };
  }
}
