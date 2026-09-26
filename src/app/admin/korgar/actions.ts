"use server";

import { revalidatePath } from "next/cache";
import { ensureDiscount, sendReminderNow, stopReminders, testDiscount } from "@/lib/abandoned";
import { requireAdmin } from "@/lib/auth";
import type { ActionResult } from "../actions";

const refresh = () => revalidatePath("/admin/korgar");
const fail = (e: unknown): ActionResult => ({ ok: false, error: e instanceof Error ? e.message : "Något gick fel." });

/** Skickar nästa påminnelse direkt, i stället för att vänta på schemat. */
export async function sendReminderAction(formData: FormData): Promise<ActionResult> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return { ok: false, error: "Ogiltigt." };
  try {
    const r = await sendReminderNow(id);
    refresh();
    return r.ok ? { ok: true, message: r.message } : { ok: false, error: r.message };
  } catch (e) {
    return fail(e);
  }
}

/** Stoppar serien för en korg (status Hanterad). */
export async function stopRemindersAction(formData: FormData): Promise<ActionResult> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return { ok: false, error: "Ogiltigt." };
  try {
    await stopReminders(id);
    refresh();
    return { ok: true, message: "Inga fler påminnelser skickas för den här korgen." };
  } catch (e) {
    return fail(e);
  }
}

/** Skapar rabattkoden i Stripe om den saknas. */
export async function ensureDiscountAction(): Promise<ActionResult> {
  await requireAdmin();
  try {
    const d = await ensureDiscount();
    refresh();
    return d.active ? { ok: true, message: `Koden ${d.code} (${d.percent} %) finns och är aktiv i Stripe.` } : { ok: false, error: `Koden ${d.code} kunde inte aktiveras. Kontrollera i Stripe.` };
  } catch (e) {
    return fail(e);
  }
}

/** Provar koden skarpt mot Stripe utan att någon betalning sker. */
export async function testDiscountAction(): Promise<ActionResult> {
  await requireAdmin();
  try {
    const r = await testDiscount();
    return r.ok ? { ok: true, message: r.message } : { ok: false, error: r.message };
  } catch (e) {
    return fail(e);
  }
}
