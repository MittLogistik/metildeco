import "server-only";
import { getCatalog } from "./catalog";
import { countsAsRevenue } from "./customers";
import type { Env } from "./stats";
import { supabaseAdmin } from "./supabase";

/**
 * Försäljningsrapporter för admin: vad som sålts totalt under en period,
 * per produkt, land, fraktsätt, ordertyp och rabattkod. Bygger på samma
 * regel som kundsidorna – allt utom avbrutna, återbetalda och obetalda ordrar räknas.
 */

export type ReportPeriod = "manad" | "forra-manaden" | "ar" | "forra-aret" | "allt" | "egen";
export const reportPeriods: { id: Exclude<ReportPeriod, "egen">; label: string }[] = [
  { id: "manad", label: "Denna månad" },
  { id: "forra-manaden", label: "Förra månaden" },
  { id: "ar", label: "I år" },
  { id: "forra-aret", label: "Förra året" },
  { id: "allt", label: "Allt" },
];

export type ReportRange = {
  period: ReportPeriod;
  /** Första och sista dagen (YYYY-MM-DD, svensk tid). `from` är null för "Allt". */
  from: string | null;
  to: string;
};

const TZ = "Europe/Stockholm";
const dayInStockholm = (d: Date) => new Intl.DateTimeFormat("sv-SE", { timeZone: TZ }).format(d);

/** Midnatt svensk tid för ett datum (YYYY-MM-DD) som UTC-tidpunkt. */
const stockholmMidnight = (day: string) => {
  const guess = new Date(day + "T00:00:00Z");
  const h = Number(new Intl.DateTimeFormat("sv-SE", { timeZone: TZ, hour: "numeric", hourCycle: "h23" }).format(guess));
  return new Date(guess.getTime() - h * 36e5);
};
const nextDay = (day: string) => new Date(new Date(day + "T12:00:00Z").getTime() + 864e5).toISOString().slice(0, 10);
const isDay = (v: unknown): v is string => typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(Date.parse(v));
const lastDayOfMonth = (y: number, m: number) => new Date(Date.UTC(y, m, 0)).toISOString().slice(0, 10);
const pad = (n: number) => String(n).padStart(2, "0");

/** Tolkar period/from/to från adressen. Egna datum vinner om båda är giltiga. */
export function resolveRange(sp: { period?: unknown; from?: unknown; to?: unknown }): ReportRange {
  const today = dayInStockholm(new Date());
  const [y, m] = today.split("-").map(Number) as [number, number];
  if (isDay(sp.from) && isDay(sp.to)) {
    const [from, to] = sp.from <= sp.to ? [sp.from, sp.to] : [sp.to, sp.from];
    return { period: "egen", from, to };
  }
  const period = (reportPeriods.find((p) => p.id === sp.period)?.id ?? "manad") as ReportPeriod;
  switch (period) {
    case "forra-manaden": {
      const py = m === 1 ? y - 1 : y;
      const pm = m === 1 ? 12 : m - 1;
      return { period, from: `${py}-${pad(pm)}-01`, to: lastDayOfMonth(py, pm) };
    }
    case "ar":
      return { period, from: `${y}-01-01`, to: today };
    case "forra-aret":
      return { period, from: `${y - 1}-01-01`, to: `${y - 1}-12-31` };
    case "allt":
      return { period, from: null, to: today };
    default:
      return { period: "manad", from: `${y}-${pad(m)}-01`, to: today };
  }
}

export type ReportOrder = {
  id: string;
  order_number: string;
  created_at: string;
  email: string | null;
  status: string;
  kind: string;
  currency: string;
  subtotal: number;
  discount: number;
  discount_code: string | null;
  shipping: number;
  shipping_method: string | null;
  shipping_country: string | null;
  total: number;
  has_subscription: boolean;
  affiliate_source: string | null;
  order_items: { product_slug: string; name: string; qty: number; plan: string; unit_price: number; line_total: number }[];
};

export type Row = { key: string; label: string; orders: number; units: number; revenue: number; share: number };
export type ProductRow = Row & { slug: string; isBundle: boolean; sku: string | null };
export type Point = { date: string; value: number };

export type SalesReport = {
  range: ReportRange;
  env: Env;
  granularity: "day" | "month";
  totals: {
    orders: number;
    units: number;
    revenue: number;
    goods: number;
    shipping: number;
    discount: number;
    average: number;
    newCustomers: number;
    returningCustomers: number;
    subscriptionOrders: number;
    cancelled: { orders: number; amount: number };
  };
  revenueByBucket: Point[];
  ordersByBucket: Point[];
  products: ProductRow[];
  /** Burkar som lämnat lagret: paketens innehåll räknas som egna produkter. */
  shipped: Row[];
  countries: Row[];
  shippingMethods: Row[];
  kinds: Row[];
  discountCodes: Row[];
  orders: ReportOrder[];
};

export const kindLabel: Record<string, string> = { checkout: "Kassa", renewal: "Förnyelse", giftcard: "Presentkort" };

const regionNames = new Intl.DisplayNames(["sv"], { type: "region" });
export const countryLabel = (code: string | null) => {
  if (!code) return "Okänt land";
  try {
    return regionNames.of(code.toUpperCase()) ?? code;
  } catch {
    return code;
  }
};

const bump = (map: Map<string, Row>, key: string, label: string, orders: number, units: number, revenue: number) => {
  const cur = map.get(key) ?? { key, label, orders: 0, units: 0, revenue: 0, share: 0 };
  cur.orders += orders;
  cur.units += units;
  cur.revenue += revenue;
  map.set(key, cur);
};
const finish = (map: Map<string, Row>, total: number): Row[] =>
  [...map.values()].map((r) => ({ ...r, share: total > 0 ? (r.revenue / total) * 100 : 0 })).sort((a, b) => b.revenue - a.revenue || b.units - a.units);

/** Räknas ordern som försäljning? Obetalda, avbrutna och återbetalda räknas inte. */
export const countsAsSale = (status: string) => status !== "pending" && countsAsRevenue(status);

/** Hämtar alla ordrar i intervallet, 1000 åt gången (Supabase svarar aldrig med fler per anrop). */
async function fetchOrders(range: ReportRange, env: Env): Promise<ReportOrder[]> {
  const db = supabaseAdmin();
  const toIso = stockholmMidnight(nextDay(range.to)).toISOString();
  const fromIso = range.from ? stockholmMidnight(range.from).toISOString() : null;
  const out: ReportOrder[] = [];
  const page = 1000;
  for (let offset = 0; ; offset += page) {
    let q = db
      .from("orders")
      .select(
        "id,order_number,created_at,email,status,kind,currency,subtotal,discount,discount_code,shipping,shipping_method,shipping_country,total,has_subscription,affiliate_source,order_items(product_slug,name,qty,plan,unit_price,line_total)",
      )
      .eq("environment", env)
      .lt("created_at", toIso)
      .order("created_at", { ascending: true })
      .range(offset, offset + page - 1);
    if (fromIso) q = q.gte("created_at", fromIso);
    const { data, error } = await q;
    if (error) throw new Error(error.message);
    const rows = (data ?? []) as unknown as ReportOrder[];
    out.push(...rows);
    if (rows.length < page) break;
  }
  return out;
}

/** E-postadresser (gemener) som handlat före intervallets början – för nya kontra återkommande kunder. */
async function fetchEarlierCustomers(range: ReportRange, env: Env): Promise<Set<string>> {
  if (!range.from) return new Set();
  const db = supabaseAdmin();
  const fromIso = stockholmMidnight(range.from).toISOString();
  const seen = new Set<string>();
  const page = 1000;
  for (let offset = 0; ; offset += page) {
    const { data } = await db
      .from("orders")
      .select("email,status")
      .eq("environment", env)
      .lt("created_at", fromIso)
      .not("email", "is", null)
      .order("created_at", { ascending: true })
      .range(offset, offset + page - 1);
    const rows = data ?? [];
    for (const r of rows) if (r.email && countsAsSale(r.status)) seen.add(r.email.trim().toLowerCase());
    if (rows.length < page) break;
  }
  return seen;
}

const daysBetween = (from: string, to: string) => Math.round((Date.parse(to) - Date.parse(from)) / 864e5) + 1;

export async function getSalesReport(range: ReportRange, env: Env): Promise<SalesReport> {
  const [all, earlier, catalog] = await Promise.all([fetchOrders(range, env), fetchEarlierCustomers(range, env), getCatalog()]);
  const orders = all.filter((o) => countsAsSale(o.status));
  const cancelledRows = all.filter((o) => o.status === "cancelled" || o.status === "refunded");

  const firstDay = range.from ?? (orders[0] ? dayInStockholm(new Date(orders[0].created_at)) : range.to);
  const granularity: "day" | "month" = daysBetween(firstDay, range.to) <= 62 ? "day" : "month";
  const bucketOf = (iso: string) => {
    const day = dayInStockholm(new Date(iso));
    return granularity === "day" ? day : day.slice(0, 7);
  };
  const buckets: string[] = [];
  if (granularity === "day") {
    for (let d = firstDay; d <= range.to; d = nextDay(d)) buckets.push(d);
  } else {
    let [y, m] = firstDay.split("-").map(Number) as [number, number];
    const end = range.to.slice(0, 7);
    for (let key = `${y}-${pad(m)}`; key <= end; key = `${y}-${pad(m)}`) {
      buckets.push(key);
      if (m === 12) {
        y += 1;
        m = 1;
      } else m += 1;
    }
  }

  const revenueByBucket = new Map<string, number>();
  const ordersByBucket = new Map<string, number>();
  const products = new Map<string, Row>();
  const shipped = new Map<string, Row>();
  const countries = new Map<string, Row>();
  const methods = new Map<string, Row>();
  const kinds = new Map<string, Row>();
  const codes = new Map<string, Row>();
  const bundleParts = new Map(
    catalog.allBundles.map((b) => [b.slug, { name: b.name, sku: b.sku, items: b.items.map((i) => ({ slug: i.product.slug, name: i.product.name, qty: i.qty })) }]),
  );
  const productInfo = new Map(catalog.allProducts.map((p) => [p.slug, { name: p.name, sku: p.sku }]));

  let revenue = 0;
  let goods = 0;
  let shipping = 0;
  let discount = 0;
  let units = 0;
  let subscriptionOrders = 0;
  const customers = new Set<string>();
  const newCustomers = new Set<string>();

  for (const o of orders) {
    const total = Number(o.total);
    const bucket = bucketOf(o.created_at);
    revenueByBucket.set(bucket, (revenueByBucket.get(bucket) ?? 0) + total);
    ordersByBucket.set(bucket, (ordersByBucket.get(bucket) ?? 0) + 1);
    revenue += total;
    goods += Number(o.subtotal);
    shipping += Number(o.shipping);
    discount += Number(o.discount);
    if (o.has_subscription || o.kind === "renewal") subscriptionOrders += 1;
    const email = o.email?.trim().toLowerCase();
    if (email) {
      if (!earlier.has(email) && !customers.has(email)) newCustomers.add(email);
      customers.add(email);
    }

    let orderUnits = 0;
    const seenProducts = new Set<string>();
    for (const it of o.order_items ?? []) {
      const qty = Number(it.qty);
      const line = Number(it.line_total);
      orderUnits += qty;
      const bundle = bundleParts.get(it.product_slug);
      const name = bundle?.name ?? productInfo.get(it.product_slug)?.name ?? it.name;
      bump(products, it.product_slug, name, seenProducts.has(it.product_slug) ? 0 : 1, qty, line);
      seenProducts.add(it.product_slug);
      // Vad som faktiskt lämnar lagret: paketens innehåll som egna produkter (omsättningen delas inte upp)
      const parts = bundle ? bundle.items : [{ slug: it.product_slug, name, qty: 1 }];
      for (const part of parts) bump(shipped, part.slug, productInfo.get(part.slug)?.name ?? part.name, 0, part.qty * qty, 0);
    }
    units += orderUnits;
    bump(countries, o.shipping_country ?? "?", countryLabel(o.shipping_country), 1, orderUnits, total);
    bump(methods, o.shipping_method ?? "?", o.shipping_method ?? "Okänt", 1, orderUnits, total);
    bump(kinds, o.kind, kindLabel[o.kind] ?? o.kind, 1, orderUnits, total);
    if (o.discount_code) bump(codes, o.discount_code.toUpperCase(), o.discount_code.toUpperCase(), 1, orderUnits, total);
  }

  const points = (map: Map<string, number>): Point[] => buckets.map((date) => ({ date, value: map.get(date) ?? 0 }));

  return {
    range,
    env,
    granularity,
    totals: {
      orders: orders.length,
      units,
      revenue,
      goods,
      shipping,
      discount,
      average: orders.length ? revenue / orders.length : 0,
      newCustomers: newCustomers.size,
      returningCustomers: customers.size - newCustomers.size,
      subscriptionOrders,
      cancelled: { orders: cancelledRows.length, amount: cancelledRows.reduce((s, o) => s + Number(o.total), 0) },
    },
    revenueByBucket: points(revenueByBucket),
    ordersByBucket: points(ordersByBucket),
    products: finish(products, goods).map((r) => ({
      ...r,
      slug: r.key,
      isBundle: bundleParts.has(r.key),
      sku: bundleParts.get(r.key)?.sku ?? productInfo.get(r.key)?.sku ?? null,
    })),
    shipped: [...shipped.values()].sort((a, b) => b.units - a.units),
    countries: finish(countries, revenue),
    shippingMethods: finish(methods, revenue),
    kinds: finish(kinds, revenue),
    discountCodes: finish(codes, revenue),
    orders,
  };
}
