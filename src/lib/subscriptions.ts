import "server-only";
import type Stripe from "stripe";
import { stripe } from "./stripe";
import { supabaseAdmin, supabaseConfigured } from "./supabase";

/**
 * Håller tabellen subscriptions i synk med Stripe. Anropas från kundsidan (Mitt konto),
 * adminpanelen och webhooken (customer.subscription.updated/deleted), så att status,
 * paus och "avslutas vid periodens slut" alltid visar samma sak som Stripe.
 */
export async function syncSubscriptionFromStripe(s: Stripe.Subscription) {
  if (!supabaseConfigured()) return;
  const item = s.items.data[0];
  const periodEnd = item ? new Date(item.current_period_end * 1000).toISOString() : null;
  const patch: Record<string, unknown> = {
    status: s.status,
    cancel_at_period_end: s.cancel_at_period_end,
    paused_at: s.pause_collection ? new Date().toISOString() : null,
    current_period_start: item ? new Date(item.current_period_start * 1000).toISOString() : null,
    current_period_end: periodEnd,
    updated_at: new Date().toISOString(),
  };
  // En avslutad prenumeration har ingen nästa leverans
  if (s.status === "canceled") patch.next_shipment_at = null;
  await supabaseAdmin().from("subscriptions").update(patch).eq("stripe_subscription_id", s.id);
}

export async function syncSubscription(id: string) {
  const s = await stripe().subscriptions.retrieve(id);
  await syncSubscriptionFromStripe(s);
  return s;
}

export type SubscriptionCommand = "pause" | "resume" | "cancel_period_end" | "cancel_now";

/**
 * Utför en åtgärd på prenumerationen i Stripe och speglar resultatet i databasen.
 * "cancel_now" avslutar direkt utan återbetalning av innevarande period; pengarna
 * betalas i så fall tillbaka manuellt i Stripe.
 */
export async function runSubscriptionCommand(id: string, command: SubscriptionCommand): Promise<string> {
  const api = stripe();
  switch (command) {
    case "pause":
      await api.subscriptions.update(id, { pause_collection: { behavior: "void" } });
      await syncSubscription(id);
      return "Prenumerationen är pausad. Inga pengar dras förrän den återupptas.";
    case "resume":
      await api.subscriptions.update(id, { pause_collection: null, cancel_at_period_end: false });
      await syncSubscription(id);
      return "Prenumerationen är återupptagen.";
    case "cancel_period_end":
      await api.subscriptions.update(id, { cancel_at_period_end: true, pause_collection: null });
      await syncSubscription(id);
      return "Prenumerationen avslutas efter innevarande period. Inga fler dragningar görs.";
    case "cancel_now": {
      const s = await api.subscriptions.cancel(id, { invoice_now: false, prorate: false });
      await syncSubscriptionFromStripe(s);
      return "Prenumerationen är avslutad med omedelbar verkan. Inga fler dragningar görs.";
    }
  }
}
