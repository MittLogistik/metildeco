import "server-only";
import { channelLabel, isChannel, type Channel } from "./attribution";
import { getCatalog } from "./catalog";
import * as meta from "./meta-ads";
import { countryLabel, countsAsSale } from "./reports";
import { statsRange, type Env, type Period } from "./stats";
import { supabaseAdmin } from "./supabase";

/**
 * Adminöversiktens fördelningar: ordrar och besökare per källa och land, Meta-annonser
 * (kostnad, länk-CTR, köp) och lagervarningar med hur länge lagret räcker.
 * Diagrammen per dag/timme ligger kvar i lib/stats. Belopp i SEK (orderns sparade kurs).
 */

const TZ = "Europe/Stockholm";
const stockholmDay = (d: Date) => new Intl.DateTimeFormat("sv-SE", { timeZone: TZ }).format(d);
const utcDay = (d: Date) => d.toISOString().slice(0, 10);

export type Breakdown = { key: string; label: string; visitors: number; orders: number; revenue: number };

export type StockWarning = {
  slug: string;
  name: string;
  stock: number;
  /** Sålda burkar senaste 30 dagarna, paketens innehåll inräknat. */
  sold30: number;
  /** Dagar kvar i nuvarande takt, null om inget sålts. */
  daysLeft: number | null;
  level: "out" | "critical" | "low";
};

export type MetaCampaignRow = { id: string; name: string; spend: number; impressions: number; clicks: number; ctr: number; purchases: number; revenue: number };
export type MetaSummary = { currency: string; spend: number; impressions: number; clicks: number; ctr: number; purchases: number; revenue: number; campaigns: MetaCampaignRow[] };

export type Dashboard = {
  sources: Breakdown[];
  /** Saknas tabellen (migreringen inte körd) eller finns ingen data är detta false. */
  hasVisitorSources: boolean;
  countries: Breakdown[];
  checkoutOrders: number;
  stock: StockWarning[];
  meta: MetaSummary | null;
  metaError: string | null;
};

type OrderRow = { status: string; kind: string; source: string | null; shipping_country: string | null; currency: string | null; exchange_rate_to_sek: number | string | null; total: number | string };

const sek = (o: OrderRow) => {
  const cur = (o.currency || "SEK").toUpperCase();
  const rate = cur === "SEK" ? 1 : Number(o.exchange_rate_to_sek) || 1;
  return Number(o.total) * rate;
};

const add = (map: Map<string, Breakdown>, key: string, label: string, d: Partial<Omit<Breakdown, "key" | "label">>) => {
  const cur = map.get(key) ?? { key, label, visitors: 0, orders: 0, revenue: 0 };
  cur.visitors += d.visitors ?? 0;
  cur.orders += d.orders ?? 0;
  cur.revenue += d.revenue ?? 0;
  map.set(key, cur);
};

const sourceKey = (s: string | null): Channel => (isChannel(s) ? s : "unknown");

async function metaSummary(fromDay: string, toDay: string): Promise<MetaSummary | null> {
  if (!meta.adsConfigured()) return null;
  const [rows, currency] = await Promise.all([meta.accountCampaignInsights(fromDay, toDay), meta.accountCurrency()]);
  const n = (list: meta.CampaignInsight["actions"], type: string) => Number(list?.find((a) => a.action_type === type)?.value ?? 0);
  const campaigns = rows
    .map((r) => {
      const impressions = Number(r.impressions ?? 0);
      const clicks = Number(r.inline_link_clicks ?? 0);
      return {
        id: r.campaign_id,
        name: r.campaign_name,
        spend: Number(r.spend ?? 0),
        impressions,
        clicks,
        ctr: impressions ? (clicks / impressions) * 100 : 0,
        purchases: n(r.actions, "purchase") || n(r.actions, "omni_purchase"),
        revenue: n(r.action_values, "purchase") || n(r.action_values, "omni_purchase"),
      };
    })
    .sort((a, b) => b.spend - a.spend);
  const sum = (k: "spend" | "impressions" | "clicks" | "purchases" | "revenue") => campaigns.reduce((s, c) => s + c[k], 0);
  const impressions = sum("impressions");
  const clicks = sum("clicks");
  return { currency, spend: sum("spend"), impressions, clicks, ctr: impressions ? (clicks / impressions) * 100 : 0, purchases: sum("purchases"), revenue: sum("revenue"), campaigns };
}

export async function getDashboard(period: Period, env: Env): Promise<Dashboard> {
  const { from, to, granularity } = statsRange(period);
  // Besökstabellerna är per UTC-dag; Idag/Igår räknas som den svenska dagen
  const fromDay = granularity === "hour" ? stockholmDay(from) : utcDay(from);
  const toDay = granularity === "hour" ? stockholmDay(new Date(to.getTime() - 1)) : utcDay(new Date(to.getTime() - 1));
  const since30 = new Date(Date.now() - 30 * 864e5).toISOString();
  const db = supabaseAdmin();

  const [orders, visitorCountries, visitorSources, recent, catalog, metaResult] = await Promise.all([
    db
      .from("orders")
      .select("status,kind,source,shipping_country,currency,exchange_rate_to_sek,total")
      .eq("environment", env)
      .gte("created_at", from.toISOString())
      .lt("created_at", to.toISOString()),
    db.from("visitors_daily").select("country,visitors").gte("view_date", fromDay).lte("view_date", toDay),
    db.from("visitor_sources_daily").select("source,visitors").gte("view_date", fromDay).lte("view_date", toDay),
    db.from("orders").select("status,order_items(product_slug,qty)").eq("environment", "live").gte("created_at", since30),
    getCatalog(undefined, true),
    // Meta får aldrig fälla översikten: fel visas i kortet i stället
    metaSummary(fromDay, toDay).then(
      (m) => ({ m, error: null as string | null }),
      (e: unknown) => ({ m: null, error: e instanceof Error ? e.message : String(e) }),
    ),
  ]);

  const sale = ((orders.data ?? []) as OrderRow[]).filter((o) => countsAsSale(o.status));

  // Källor: besökare (landningens källa) och ordrar (senaste källan inom 30 dagar)
  const sources = new Map<string, Breakdown>();
  for (const r of (visitorSources.data ?? []) as { source: string; visitors: number }[]) {
    const k = sourceKey(r.source);
    add(sources, k, channelLabel[k], { visitors: r.visitors });
  }
  for (const o of sale) {
    const k = o.kind === "renewal" ? "renewal" : sourceKey(o.source);
    add(sources, k, isChannel(k) ? channelLabel[k] : k, { orders: 1, revenue: sek(o) });
  }

  // Länder: besökare (IP-land) och ordrar (leveransland)
  const countries = new Map<string, Breakdown>();
  for (const r of (visitorCountries.data ?? []) as { country: string; visitors: number }[]) {
    const k = (r.country || "unknown").toUpperCase();
    add(countries, k, k === "UNKNOWN" ? "Okänt" : countryLabel(k), { visitors: r.visitors });
  }
  for (const o of sale) {
    const k = (o.shipping_country || "unknown").toUpperCase();
    add(countries, k, k === "UNKNOWN" ? "Okänt" : countryLabel(k), { orders: 1, revenue: sek(o) });
  }

  // Lager: sålt senaste 30 dagarna per produkt, paketens innehåll upplöst
  const bundleItems = new Map(catalog.allBundles.map((b) => [b.slug, b.items.map((i) => ({ slug: i.product.slug, qty: i.qty }))]));
  const sold = new Map<string, number>();
  for (const o of (recent.data ?? []) as { status: string; order_items: { product_slug: string | null; qty: number }[] }[]) {
    if (!countsAsSale(o.status)) continue;
    for (const i of o.order_items ?? []) {
      if (!i.product_slug) continue;
      const parts = bundleItems.get(i.product_slug) ?? [{ slug: i.product_slug, qty: 1 }];
      for (const p of parts) sold.set(p.slug, (sold.get(p.slug) ?? 0) + p.qty * i.qty);
    }
  }
  const stock: StockWarning[] = catalog.allProducts
    .filter((p) => p.isActive && p.trackStock)
    .map((p) => {
      const sold30 = sold.get(p.slug) ?? 0;
      const daysLeft = sold30 > 0 ? Math.floor(p.stock / (sold30 / 30)) : null;
      const level: StockWarning["level"] = p.stock <= 0 ? "out" : p.stock <= 5 || (daysLeft !== null && daysLeft <= 14) ? "critical" : "low";
      return { slug: p.slug, name: p.name.split("|")[0]!.trim(), stock: p.stock, sold30, daysLeft, level };
    })
    .filter((s) => s.level !== "low" || s.stock <= 10 || (s.daysLeft !== null && s.daysLeft <= 30))
    .sort((a, b) => a.stock - b.stock);

  const sortRows = (m: Map<string, Breakdown>) => [...m.values()].sort((a, b) => b.orders - a.orders || b.visitors - a.visitors);
  return {
    sources: sortRows(sources),
    hasVisitorSources: !visitorSources.error,
    countries: sortRows(countries),
    checkoutOrders: sale.filter((o) => o.kind !== "renewal").length,
    stock,
    meta: metaResult.m,
    metaError: metaResult.error,
  };
}
