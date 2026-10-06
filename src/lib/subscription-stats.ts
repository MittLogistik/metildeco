import "server-only";
import type { SubscriptionRecord } from "./customers";
import { RENEWAL_DELIVERY_LEAD_DAYS } from "./orders";
import type { Env } from "./stats";
import { supabaseAdmin } from "./supabase";

const DAY = 864e5;
/** Hur långt fram översikten visar kommande utskick. */
export const UPCOMING_DAYS = 45;
/** Period för sammanställningen av genomförda dragningar. */
export const CHARGE_WINDOW_DAYS = 90;

/**
 * Ett kommande utskick. "paid" = Stripe har dragit pengarna och förnyelseordern ligger planerad,
 * "to_charge" = dragningen görs vid periodens slut och leveransen planeras RENEWAL_DELIVERY_LEAD_DAYS senare,
 * "failed" = senaste dragningen gick inte igenom (Stripe försöker igen), inget skickas förrän den är betald.
 */
export type UpcomingShipment = {
  key: string;
  state: "paid" | "to_charge" | "failed";
  deliverAt: string;
  chargeAt: string;
  email: string | null;
  name: string | null;
  productSlug: string | null;
  qty: number;
  amount: number;
  currency: string;
  orderId: string | null;
};

export type SubscriptionOverview = {
  active: number;
  paused: number;
  ending: number;
  failed: number;
  /** Återkommande värde omräknat till 30 dagar, aktiva prenumerationer (inkl. moms). */
  recurring30: number;
  upcoming: UpcomingShipment[];
  charges: { count: number; sum: number };
  /** Förnyade i Stripe men utan förnyelseorder här – webhooken har missat dem. */
  missingRenewals: { email: string | null; periodStart: string; stripeSubscriptionId: string }[];
};

export type OrderLite = {
  id: string;
  email: string | null;
  shipping_name: string | null;
  total: number;
  currency: string;
  created_at: string;
  deliver_at: string | null;
  stripe_subscription_id: string | null;
  status: string;
  kind: string;
  exchange_rate_to_sek: number | null;
};

const isLive = (s: SubscriptionRecord) => (s.status === "active" || s.status === "trialing") && !s.paused_at;
const isFailed = (s: SubscriptionRecord) => s.status === "past_due" || s.status === "unpaid";

export async function getSubscriptionOverview(env: Env, now = new Date()): Promise<SubscriptionOverview> {
  const db = supabaseAdmin();
  const [subsRes, ordersRes] = await Promise.all([
    db.from("subscriptions").select("*").eq("environment", env),
    db
      .from("orders")
      .select("id,email,shipping_name,total,currency,created_at,deliver_at,stripe_subscription_id,status,kind,exchange_rate_to_sek")
      .eq("environment", env)
      .not("stripe_subscription_id", "is", null)
      .order("created_at", { ascending: false }),
  ]);
  return buildSubscriptionOverview((subsRes.data ?? []) as SubscriptionRecord[], (ordersRes.data ?? []) as OrderLite[], now);
}

/** Beräkningen utan databas. orders = prenumerationsordrar, senaste först. */
export function buildSubscriptionOverview(subs: SubscriptionRecord[], orders: OrderLite[], now: Date): SubscriptionOverview {
  const horizon = new Date(now.getTime() + UPCOMING_DAYS * DAY);

  // Senaste kända namn per prenumeration (förnyelser ärver adressen från första ordern)
  const nameBySub = new Map<string, string>();
  for (const o of orders) if (o.stripe_subscription_id && o.shipping_name && !nameBySub.has(o.stripe_subscription_id)) nameBySub.set(o.stripe_subscription_id, o.shipping_name);

  const subById = new Map(subs.map((s) => [s.stripe_subscription_id, s]));
  const upcoming: UpcomingShipment[] = [];
  for (const o of orders) {
    if (o.status !== "scheduled" || !o.deliver_at) continue;
    const sub = o.stripe_subscription_id ? subById.get(o.stripe_subscription_id) : undefined;
    upcoming.push({
      key: `o-${o.id}`,
      state: "paid",
      deliverAt: o.deliver_at,
      chargeAt: o.created_at,
      email: o.email,
      name: o.shipping_name,
      productSlug: sub?.product_slug ?? null,
      qty: sub?.quantity ?? 1,
      amount: Number(o.total),
      currency: o.currency,
      orderId: o.id,
    });
  }
  for (const s of subs) {
    if (!s.current_period_end || !(isLive(s) || isFailed(s))) continue;
    if (s.cancel_at_period_end && !isFailed(s)) continue;
    // Misslyckad: dragningen vid periodstarten gick inte igenom, leveransen väntar på den. Annars nästa dragning vid periodens slut.
    const chargeAt = new Date(isFailed(s) && s.current_period_start ? s.current_period_start : s.current_period_end);
    const deliverAt = new Date(chargeAt.getTime() + RENEWAL_DELIVERY_LEAD_DAYS * DAY);
    if (!isFailed(s) && (chargeAt < now || chargeAt > horizon)) continue;
    upcoming.push({
      key: `s-${s.id}`,
      state: isFailed(s) ? "failed" : "to_charge",
      deliverAt: deliverAt.toISOString(),
      chargeAt: chargeAt.toISOString(),
      email: s.email,
      name: nameBySub.get(s.stripe_subscription_id) ?? null,
      productSlug: s.product_slug,
      qty: s.quantity,
      amount: Number(s.amount ?? 0) * s.quantity,
      currency: s.currency,
      orderId: null,
    });
  }
  // Misslyckade först, sedan i datumordning
  upcoming.sort((a, b) => (a.state === "failed") === (b.state === "failed") ? a.deliverAt.localeCompare(b.deliverAt) : a.state === "failed" ? -1 : 1);

  const since = new Date(now.getTime() - CHARGE_WINDOW_DAYS * DAY).toISOString();
  const renewals = orders.filter((o) => o.kind === "renewal" && o.created_at >= since && o.status !== "cancelled" && o.status !== "refunded");

  // Avstämning: en aktiv prenumeration som Stripe har förnyat minst en gång ska ha en förnyelseorder för innevarande period
  const missingRenewals: SubscriptionOverview["missingRenewals"] = [];
  for (const s of subs) {
    if (!isLive(s) || !s.current_period_start) continue;
    const periodStart = new Date(s.current_period_start).getTime();
    if (periodStart - new Date(s.created_at).getTime() < 2 * DAY) continue;
    const covered = orders.some((o) => o.stripe_subscription_id === s.stripe_subscription_id && o.kind === "renewal" && new Date(o.created_at).getTime() >= periodStart - 2 * DAY);
    if (!covered) missingRenewals.push({ email: s.email, periodStart: s.current_period_start, stripeSubscriptionId: s.stripe_subscription_id });
  }

  const live = subs.filter(isLive);
  return {
    active: live.filter((s) => !s.cancel_at_period_end).length,
    paused: subs.filter((s) => (s.status === "active" || s.status === "trialing") && s.paused_at).length,
    ending: live.filter((s) => s.cancel_at_period_end).length,
    failed: subs.filter(isFailed).length,
    recurring30: live
      .filter((s) => !s.cancel_at_period_end)
      .reduce((sum, s) => sum + (Number(s.amount ?? 0) * s.quantity * 30) / (s.interval_days || 30), 0),
    upcoming,
    charges: { count: renewals.length, sum: renewals.reduce((sum, o) => sum + Number(o.total) * (o.currency === "SEK" ? 1 : Number(o.exchange_rate_to_sek ?? 1)), 0) },
    missingRenewals,
  };
}
