import "server-only";
import { getCatalog } from "./catalog";
import { supabaseAdmin } from "./supabase";

export type Period = "idag" | "igar" | "7" | "30" | "90";
export const periods: { id: Period; label: string }[] = [
  { id: "idag", label: "Idag" },
  { id: "igar", label: "Igår" },
  { id: "7", label: "7 dagar" },
  { id: "30", label: "30 dagar" },
  { id: "90", label: "90 dagar" },
];

export type Env = "live" | "sandbox";

export type DayPoint = { date: string; value: number };
export type Series = { id: string; label: string; unit: "count" | "sek" | "percent"; total: number; points: DayPoint[] };

export type Stats = {
  from: string;
  to: string;
  days: string[];
  visitors: Series;
  addToCart: Series;
  beginCheckout: Series;
  orders: Series;
  revenue: Series;
  netProfit: Series;
  conversion: number;
  abandonedOpen: number;
  abandonedWithEmail: number;
  missingPurchasePrice: number;
  handlingFee: number;
};

const HANDLING_FEE = 22;

const dayKey = (d: Date) => d.toISOString().slice(0, 10);
const addDays = (d: Date, n: number) => new Date(d.getTime() + n * 864e5);

const range = (period: Period) => {
  const today = new Date(new Date().toISOString().slice(0, 10) + "T00:00:00Z");
  if (period === "idag") return { from: today, to: today };
  if (period === "igar") return { from: addDays(today, -1), to: addDays(today, -1) };
  return { from: addDays(today, -(Number(period) - 1)), to: today };
};

const listDays = (from: Date, to: Date) => {
  const out: string[] = [];
  for (let d = from; d <= to; d = addDays(d, 1)) out.push(dayKey(d));
  return out;
};

const series = (id: string, label: string, unit: Series["unit"], days: string[], byDay: Map<string, number>): Series => {
  const points = days.map((date) => ({ date, value: byDay.get(date) ?? 0 }));
  return { id, label, unit, total: points.reduce((s, p) => s + p.value, 0), points };
};

const bump = (map: Map<string, number>, key: string, n: number) => map.set(key, (map.get(key) ?? 0) + n);

/** Statistik för adminöversikten. Alla mått per dag i perioden. */
export async function getStats(period: Period, env: Env): Promise<Stats> {
  const { from, to } = range(period);
  const days = listDays(from, to);
  const fromIso = from.toISOString();
  const toIso = addDays(to, 1).toISOString();
  const db = supabaseAdmin();

  const [views, visitors, cartEvents, orders, abandoned, catalog] = await Promise.all([
    db.from("page_views_daily").select("view_date,views").gte("view_date", dayKey(from)).lte("view_date", dayKey(to)),
    db.from("visitors_daily").select("view_date,visitors").gte("view_date", dayKey(from)).lte("view_date", dayKey(to)),
    db.from("cart_events_hourly").select("event_hour,event,events").gte("event_hour", fromIso).lt("event_hour", toIso),
    db
      .from("orders")
      .select("id,created_at,total,shipping,shipping_method,status,kind,order_items(product_slug,qty)")
      .eq("environment", env)
      .gte("created_at", fromIso)
      .lt("created_at", toIso)
      .not("status", "in", "(cancelled,refunded)"),
    db.from("abandoned_carts").select("email,status").eq("status", "open"),
    getCatalog(),
  ]);

  // Besökare: unika per dag (hashade IP-adresser). Sidvisningar används bara som reserv för dagar utan unika.
  const visitorByDay = new Map<string, number>();
  for (const r of visitors.data ?? []) bump(visitorByDay, r.view_date, r.visitors);
  for (const r of views.data ?? []) if (!visitorByDay.has(r.view_date)) bump(visitorByDay, r.view_date, r.views);

  const addByDay = new Map<string, number>();
  const checkoutByDay = new Map<string, number>();
  for (const r of cartEvents.data ?? []) {
    const day = String(r.event_hour).slice(0, 10);
    if (r.event === "add_to_cart") bump(addByDay, day, r.events);
    if (r.event === "begin_checkout") bump(checkoutByDay, day, r.events);
  }

  const purchasePrice = new Map<string, number | null>();
  const rates = await db.from("shipping_rates").select("method,cost").eq("currency", "SEK");
  const shippingCostByLabel = new Map<string, number>();
  const labels: Record<string, string> = { varubrev: "Varubrev", "tracked-letter": "Spårbart brev", ombud: "Paket till ombud" };
  for (const r of rates.data ?? []) shippingCostByLabel.set(labels[r.method] ?? r.method, Number(r.cost ?? 0));

  const rawProducts = await db.from("products").select("slug,purchase_price");
  for (const p of rawProducts.data ?? []) purchasePrice.set(p.slug, p.purchase_price === null ? null : Number(p.purchase_price));
  const bundleParts = new Map(catalog.allBundles.map((b) => [b.slug, b.items.map((i) => ({ slug: i.product.slug, qty: i.qty }))]));

  const ordersByDay = new Map<string, number>();
  const revenueByDay = new Map<string, number>();
  const profitByDay = new Map<string, number>();
  const missing = new Set<string>();
  type OrderRow = { id: string; created_at: string; total: number; shipping: number; shipping_method: string | null; kind: string; order_items: { product_slug: string; qty: number }[] };
  for (const o of (orders.data ?? []) as unknown as OrderRow[]) {
    const day = o.created_at.slice(0, 10);
    bump(ordersByDay, day, 1);
    const total = Number(o.total);
    bump(revenueByDay, day, total);
    let cost = HANDLING_FEE + (shippingCostByLabel.get(o.shipping_method ?? "") ?? 0);
    for (const it of o.order_items ?? []) {
      const parts = bundleParts.get(it.product_slug) ?? [{ slug: it.product_slug, qty: 1 }];
      for (const part of parts) {
        const pp = purchasePrice.get(part.slug);
        if (pp === null || pp === undefined) {
          if (o.kind !== "giftcard") missing.add(part.slug);
          continue;
        }
        cost += pp * part.qty * it.qty;
      }
    }
    // Moms 12 % på kosttillskott ingår i priset – nettot räknas exkl. moms
    const exVat = o.kind === "giftcard" ? total : total / 1.12;
    bump(profitByDay, day, exVat - cost);
  }

  const visitorsS = series("visitors", "Besökare", "count", days, visitorByDay);
  const ordersS = series("orders", "Ordrar", "count", days, ordersByDay);
  const abandonedRows = abandoned.data ?? [];

  return {
    from: dayKey(from),
    to: dayKey(to),
    days,
    visitors: visitorsS,
    addToCart: series("addToCart", "Lägg i varukorg", "count", days, addByDay),
    beginCheckout: series("beginCheckout", "Påbörjad kassa", "count", days, checkoutByDay),
    orders: ordersS,
    revenue: series("revenue", "Intäkt", "sek", days, revenueByDay),
    netProfit: series("netProfit", "Nettovinst", "sek", days, profitByDay),
    conversion: visitorsS.total > 0 ? (ordersS.total / visitorsS.total) * 100 : 0,
    abandonedOpen: abandonedRows.length,
    abandonedWithEmail: abandonedRows.filter((a) => a.email).length,
    missingPurchasePrice: missing.size,
    handlingFee: HANDLING_FEE,
  };
}
