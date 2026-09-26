"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { runSubscriptionCommand, type SubscriptionCommand } from "@/lib/subscriptions";
import { supabaseAdmin } from "@/lib/supabase";
import type { ActionResult } from "../actions";

const commands: SubscriptionCommand[] = ["pause", "resume", "cancel_period_end", "cancel_now"];

/**
 * Admin ändrar en kunds prenumeration i Stripe (pausa, återuppta, avsluta vid periodens
 * slut eller avsluta direkt). Används när kunden själv inte kommer in på Mitt konto.
 */
export async function adminSubscriptionCommand(formData: FormData): Promise<ActionResult> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const command = String(formData.get("command") ?? "") as SubscriptionCommand;
  if (!id.startsWith("sub_") || !commands.includes(command)) return { ok: false, error: "Ogiltig begäran." };
  const known = await supabaseAdmin().from("subscriptions").select("id").eq("stripe_subscription_id", id).maybeSingle();
  if (!known.data) return { ok: false, error: "Prenumerationen finns inte i databasen." };
  try {
    const message = await runSubscriptionCommand(id, command);
    revalidatePath("/admin", "layout");
    revalidatePath("/sv/mitt-konto");
    return { ok: true, message };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Stripe svarade med ett fel." };
  }
}
