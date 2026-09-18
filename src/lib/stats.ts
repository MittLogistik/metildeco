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

export type Granularity = "day" | "hour";
/** `date` är YYYY-MM-DD per dag, eller ISO-tidpunkt (UTC) för timmens start per timme. */
export type DayPoint = { date: string; value: number };
export type Series = { id: string; label: string; unit: "count" | "sek" | "percent"; total: number; points: DayPoint[] };

export type Stats = {
  from: string;
  to: string;
  /** Idag och Igår visas timma för timma (svensk tid), övriga perioder per dag. */
  granularity: Granularity;
  buckets: string[];
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
const TZ = "Europe/Stockholm";

const dayKey = (d: Date) => d.toISOString().slice(0, 10);
const addDays = (d: Date, n: number) => new Date(d.getTime() + n * 864e5);
const hourStart = (d: Date) => new Date(Math.floor(d.getTime() / 36e5) * 36e5);
const hourKey = (d: Date) => hourStart(d).toISOString();

/** Midnatt svensk tid för ett datum (YYYY-MM-DD) som UTC-tidpunkt, oberoende av serverns tidszon. */
const stockholmMidnight = (day: string) => {
  const guess = new Date(day + "T00:00:00Z");
  const h = Number(new Intl.DateTimeFormat("sv-SE", { timeZone: TZ, hour: "numeric", hourCycle: "h23" }).format(guess));
  return new Date(guess.getTime() - h * 36e5);
};

/** Intervallet [from, to) samt upplösning. Timperioder följer svensk tid, dagperioder UTC-datum som tabellerna. */
const range = (period: Period) => {
  if (period === "idag" || period === "igar") {
    const now = new Date();
    const start = stockholmMidnight(new Intl.DateTimeFormat("sv-SE", { timeZone: TZ }).format(now));
    if (period === "idag") return { from: start, to: new Date(hourStart(now).getTime() + 36e5), granularity: "hour" as const };
    return { from: addDays(start, -1), to: start, granularity: "hour" as const };
  }
  const today = new Date(new Date().toISOString().slice(0, 10) + "T00:00:00Z");
  return { from: addDays(today, -(Number(period) - 1)), to: addDays(today, 1), granularity: "day" as const };
};

/** Nycklar för alla dagar (YYYY-MM-DD) eller timmar (ISO) i [from, to). */
const listBuckets = (from: Date, to: Date, granularity: Granularity) => {
  const out: string[] = [];
  const step = granularity === "day" ? 864e5 : 36e5;
  for (let t = from.getTime(); t < to.getTime(); t += step) out.push(granularity === "day" ? dayKey(new Date(t)) : hourKey(new Date(t)));
  return out;
};

const series = (id: string, label: string, unit: Series["unit"], buckets: string[], byBucket: Map<string, number>): Series => {
  const points = buckets.map((date) => ({ date, value: byBucket.get(date) ?? 0 }));
  return { id, label, unit, total: points.reduce((s, p) => s + p.value, 0), points };
};

const bump = (map: Map<string, number>, key: string, n: number) => map.set(key, (map.get(key) ?? 0) + n);

/** Statistik för adminöversikten. Alla mått per dag, eller per timme för Idag/Igår. */
export async function getStats(period: Period, env: Env): Promise<Stats> {
  const { from, to, granularity } = range(period);
  const hourly = granularity === "hour";
  const buckets = listBuckets(from, to, granularity);
  const fromIso = from.toISOString();
  const toIso = to.toISOString();
  const lastDay = dayKey(addDays(to, -1));
  const db = supabaseAdmin();

  const [views, visitors, cartEvents, orders, abandoned, catalog] = await Promise.all([
    hourly
      ? db.from("page_views_hourly").select("view_hour,views").gte("view_hour", fromIso).lt("view_hour", toIso)
      : db.from("page_views_daily").select("view_date,views").gte("view_date", dayKey(from)).lte("view_date", lastDay),
    hourly
      ? db.from("visitors_hourly").select("view_hour,visitors").gte("view_hour", fromIso).lt("view_hour", toIso)
      : db.from("visitors_daily").select("view_date,visitors").gte("view_date", dayKey(from)).lte("view_date", lastDay),
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

  // Nyckel för en rad: dag (YYYY-MM-DD) eller timme (ISO i UTC)
  const keyOf = (v: string) => (hourly ? hourKey(new Date(v)) : v.slice(0, 10));
  type StampRow = { view_date?: string; view_hour?: string };
  const stampOf = (r: StampRow) => keyOf(String(r.view_hour ?? r.view_date));

  // Besökare: unika per dag/timme (hashade IP-adresser). Sidvisningar används bara som reserv för intervall utan unika.
  const visitorByDay = new Map<string, number>();
  for (const r of (visitors.data ?? []) as (StampRow & { visitors: number })[]) bump(visitorByDay, stampOf(r), r.visitors);
  // Per timme blandas inte unika och sidvisningar: reserven används bara om timtabellen är helt tom.
  for (const r of (views.data ?? []) as (StampRow & { views: number })[]) {
    if (hourly ? visitors.data?.length : visitorByDay.has(stampOf(r))) continue;
    bump(visitorByDay, stampOf(r), r.views);
  }

  const addByDay = new Map<string, number>();
  const checkoutByDay = new Map<string, number>();
  for (const r of cartEvents.data ?? []) {
    const day = keyOf(String(r.event_hour));
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
    const day = keyOf(o.created_at);
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

  const visitorsS = series("visitors", "Besökare", "count", buckets, visitorByDay);
  const ordersS = series("orders", "Ordrar", "count", buckets, ordersByDay);
  const abandonedRows = abandoned.data ?? [];

  return {
    from: dayKey(from),
    to: lastDay,
    granularity,
    buckets,
    visitors: visitorsS,
    addToCart: series("addToCart", "Lägg i varukorg", "count", buckets, addByDay),
    beginCheckout: series("beginCheckout", "Påbörjad kassa", "count", buckets, checkoutByDay),
    orders: ordersS,
    revenue: series("revenue", "Intäkt", "sek", buckets, revenueByDay),
    netProfit: series("netProfit", "Nettovinst", "sek", buckets, profitByDay),
    conversion: visitorsS.total > 0 ? (ordersS.total / visitorsS.total) * 100 : 0,
    abandonedOpen: abandonedRows.length,
    abandonedWithEmail: abandonedRows.filter((a) => a.email).length,
    missingPurchasePrice: missing.size,
    handlingFee: HANDLING_FEE,
  };
}
