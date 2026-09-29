import "server-only";
import { supabaseAdmin, supabaseConfigured } from "./supabase";

/**
 * A/B-test av köprutan på produktsidan. Inställningen ligger i integration_settings
 * (nyckel experiment_buybox): off = alla ser nuvarande ruta, ab = lottning enligt andelen,
 * on = alla ser erbjudandet. Utfallet mäts i experiment_events (visningar, varukorg,
 * kassa) och på ordrarna (orders.experiment_variant).
 */

export type ExperimentMode = "off" | "ab" | "on";
export type ExperimentSettings = { mode: ExperimentMode; split: number };

const KEY = "experiment_buybox";
export const defaultExperiment: ExperimentSettings = { mode: "off", split: 50 };

export async function getExperimentSettings(): Promise<ExperimentSettings> {
  if (!supabaseConfigured()) return defaultExperiment;
  const res = await supabaseAdmin().from("integration_settings").select("value").eq("key", KEY).maybeSingle();
  const stored = (res.data?.value ?? {}) as Partial<ExperimentSettings>;
  const mode = stored.mode === "ab" || stored.mode === "on" ? stored.mode : "off";
  const split = Math.min(100, Math.max(0, Math.round(Number(stored.split ?? 50) || 50)));
  return { mode, split };
}

export async function saveExperimentSettings(next: ExperimentSettings): Promise<void> {
  const res = await supabaseAdmin().from("integration_settings").upsert({ key: KEY, value: next, updated_at: new Date().toISOString() }, { onConflict: "key" });
  if (res.error) throw new Error(res.error.message);
}

export type VariantStats = {
  variant: "a" | "b";
  views: number;
  visitors: number;
  addToCart: number;
  beginCheckout: number;
  orders: number;
  revenue: number;
  averageOrder: number;
  /** Ordrar per unik besökare som sett köprutan, i procent. */
  conversion: number;
  /** Andel av ordrarna som innehåller prenumeration. */
  subscriptionShare: number;
};

/** Utfallet per variant för de senaste dagarna. */
export async function experimentReport(days = 30): Promise<{ since: string; variants: VariantStats[] }> {
  const since = new Date(Date.now() - days * 864e5).toISOString();
  const empty = (variant: "a" | "b"): VariantStats => ({ variant, views: 0, visitors: 0, addToCart: 0, beginCheckout: 0, orders: 0, revenue: 0, averageOrder: 0, conversion: 0, subscriptionShare: 0 });
  const stats: Record<"a" | "b", VariantStats> = { a: empty("a"), b: empty("b") };
  if (!supabaseConfigured()) return { since, variants: [stats.a, stats.b] };
  const db = supabaseAdmin();
  const [events, orders] = await Promise.all([
    db.from("experiment_events").select("variant,event,visitor_hash").eq("experiment", "buybox").gte("created_at", since).limit(50000),
    db.from("orders").select("experiment_variant,total,has_subscription,status,environment").not("experiment_variant", "is", null).gte("created_at", since).neq("environment", "sandbox"),
  ]);
  const visitors: Record<"a" | "b", Set<string>> = { a: new Set(), b: new Set() };
  for (const e of (events.data ?? []) as { variant: string; event: string; visitor_hash: string | null }[]) {
    const v = e.variant === "b" ? "b" : "a";
    if (e.event === "ab_view") {
      stats[v].views++;
      if (e.visitor_hash) visitors[v].add(e.visitor_hash);
    } else if (e.event === "add_to_cart") stats[v].addToCart++;
    else if (e.event === "begin_checkout") stats[v].beginCheckout++;
  }
  for (const o of (orders.data ?? []) as { experiment_variant: string; total: number; has_subscription: boolean; status: string }[]) {
    if (o.status === "cancelled" || o.status === "refunded" || o.status === "pending") continue;
    const v = o.experiment_variant === "b" ? "b" : "a";
    stats[v].orders++;
    stats[v].revenue += Number(o.total);
    if (o.has_subscription) stats[v].subscriptionShare++;
  }
  for (const v of ["a", "b"] as const) {
    const s = stats[v];
    s.visitors = visitors[v].size;
    s.averageOrder = s.orders ? s.revenue / s.orders : 0;
    s.conversion = s.visitors ? (s.orders / s.visitors) * 100 : 0;
    s.subscriptionShare = s.orders ? (s.subscriptionShare / s.orders) * 100 : 0;
  }
  return { since, variants: [stats.a, stats.b] };
}
