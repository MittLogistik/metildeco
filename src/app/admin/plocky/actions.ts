"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { retryPlockyOrder, sendPlockyQueue, testPlockyConnection } from "@/lib/plocky";
import type { ActionResult } from "../actions";

/** Provar kopplingen mot Plocky (hälsokontrollen på orderadressen). */
export async function testPlocky(): Promise<ActionResult> {
  await requireAdmin();
  const r = await testPlockyConnection();
  return r.ok ? { ok: true, message: r.message } : { ok: false, error: r.message };
}

/** Skickar (om) en order till Plocky. Används från orderkortet och kön. */
export async function resendToPlocky(formData: FormData): Promise<ActionResult> {
  await requireAdmin();
  const id = String(formData.get("order_id") ?? "");
  if (!id) return { ok: false, error: "Order saknas." };
  const r = await retryPlockyOrder(id);
  revalidatePath("/admin", "layout");
  return r.ok ? { ok: true, message: r.message } : { ok: false, error: r.message };
}

/** Kör kön nu i stället för att vänta på cron-jobbet. */
export async function runPlockyQueue(): Promise<ActionResult> {
  await requireAdmin();
  const r = await sendPlockyQueue({ limit: 50 });
  revalidatePath("/admin", "layout");
  return { ok: true, message: `${r.sent} skickade, ${r.retrying} försöks igen, ${r.failed} misslyckade.` };
}
