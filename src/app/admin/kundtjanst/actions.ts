"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { logSupport, MATILDA_ID, revokeAgentKey, rotateAgentKey, updateAgentSettings } from "@/lib/support-agent";
import type { ActionResult } from "../actions";

/** Skapar Matildas inlogg (eller byter nyckel). Nyckeln visas bara i svaret. */
export async function createMatildaKey(): Promise<ActionResult> {
  const admin = await requireAdmin();
  try {
    const key = await rotateAgentKey(MATILDA_ID);
    await logSupport({ actor: admin.email, action: "agent.key_created", target: MATILDA_ID, summary: `Ny API-nyckel för Matilda (${key.slice(0, 8)}…). Den gamla slutade gälla.` });
    revalidatePath("/admin/kundtjanst");
    return { ok: true, message: `Ny nyckel – kopiera den nu, den visas inte igen: ${key}` };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Kunde inte skapa nyckeln. Är migrationen körd?" };
  }
}

export async function revokeMatildaKey(): Promise<ActionResult> {
  const admin = await requireAdmin();
  await revokeAgentKey(MATILDA_ID);
  await logSupport({ actor: admin.email, action: "agent.key_revoked", target: MATILDA_ID, summary: "Matildas API-nyckel är spärrad." });
  revalidatePath("/admin/kundtjanst");
  return { ok: true, message: "Nyckeln är spärrad. Matilda kommer inte åt något förrän en ny skapas." };
}

export async function saveMatildaSettings(formData: FormData): Promise<ActionResult> {
  const admin = await requireAdmin();
  const patch = {
    enabled: formData.get("enabled") === "on",
    allow_subscriptions: formData.get("allow_subscriptions") === "on",
    allow_email: formData.get("allow_email") === "on",
  };
  await updateAgentSettings(MATILDA_ID, patch);
  await logSupport({ actor: admin.email, action: "agent.settings", target: MATILDA_ID, summary: `På: ${patch.enabled ? "ja" : "nej"}, prenumerationer: ${patch.allow_subscriptions ? "ja" : "nej"}, mejl: ${patch.allow_email ? "ja" : "nej"}`, details: patch });
  revalidatePath("/admin/kundtjanst");
  return { ok: true, message: "Sparat." };
}
