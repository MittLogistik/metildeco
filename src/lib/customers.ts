import "server-only";
import type { OrderItemRecord, OrderRecord } from "./orders";
import { supabaseAdmin } from "./supabase";

/** Kund i admin = e-postadress (gästkassa, inget konto krävs). Nyckeln är adressen i gemener. */
export const customerKey = (email: string | null | undefined) => (email ?? "").trim().toLowerCase();
export const customerHref = (email: string | null | undefined) => (email ? `/admin/kunder/${encodeURIComponent(customerKey(email))}` : null);

/** Ordrar som räknas som intäkt: allt utom avbrutna och återbetalda. */
export const countsAsRevenue = (status: string) => status !== "cancelled" && status !== "refunded";

export type CustomerSummary = {
  email: string;
  name: string | null;
  city: string | null;
  orders: number;
  revenue: number;
  firstOrderAt: string;
  lastOrderAt: string;
  hasSubscription: boolean;
  sandboxOnly: boolean;
};

export type SubscriptionRecord = {
  id: string;
  stripe_subscription_id: string;
  stripe_customer_id: string | null;
  product_slug: string | null;
  status: string;
  quantity: number;
  amount: number | null;
  currency: string;
  interval_days: number | null;
  current_period_start: string | null;
  current_period_end: string | null;
  next_shipment_at: string | null;
  cancel_at_period_end: boolean;
  paused_at: string | null;
  environment: string;
  email: string | null;
  created_at: string;
};

export type AdminOrder = OrderRecord & {
  environment: string;
  phone: string | null;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  tracking_number: string | null;
  discount_code: string | null;
};

type OrderLite = Pick<AdminOrder, "email" | "shipping_name" | "shipping_city" | "total" | "status" | "created_at" | "has_subscription" | "environment">;

/** Alla kunder med ordrar, senaste order först. */
export async function listCustomers(): Promise<CustomerSummary[]> {
  const db = supabaseAdmin();
  const res = await db
    .from("orders")
    .select("email,shipping_name,shipping_city,total,status,created_at,has_subscription,environment")
    .not("email", "is", null)
    .order("created_at", { ascending: false })
    .limit(5000);
  const map = new Map<string, CustomerSummary>();
  for (const o of (res.data ?? []) as OrderLite[]) {
    const key = customerKey(o.email);
    if (!key) continue;
    const live = o.environment !== "sandbox";
    const counts = countsAsRevenue(o.status);
    const cur = map.get(key);
    if (!cur) {
      map.set(key, {
        email: key,
        name: o.shipping_name,
        city: o.shipping_city,
        orders: counts ? 1 : 0,
        revenue: counts && live ? Number(o.total) : 0,
        firstOrderAt: o.created_at,
        lastOrderAt: o.created_at,
        hasSubscription: o.has_subscription,
        sandboxOnly: !live,
      });
      continue;
    }
    if (counts) cur.orders += 1;
    if (counts && live) cur.revenue += Number(o.total);
    cur.firstOrderAt = o.created_at; // listan är sorterad nyast först
    cur.hasSubscription ||= o.has_subscription;
    cur.sandboxOnly &&= !live;
    cur.name ??= o.shipping_name;
    cur.city ??= o.shipping_city;
  }
  return [...map.values()].sort((a, b) => b.lastOrderAt.localeCompare(a.lastOrderAt));
}

export type CustomerDetail = {
  email: string;
  name: string | null;
  phone: string | null;
  address: { name: string | null; line: string | null; postalCode: string | null; city: string | null; country: string | null } | null;
  orders: AdminOrder[];
  itemsByOrder: Map<string, OrderItemRecord[]>;
  subscriptions: SubscriptionRecord[];
  stats: { orders: number; revenue: number; average: number; firstOrderAt: string | null; lastOrderAt: string | null; scheduled: number };
};

/** En kund med alla ordrar, rader och prenumerationer. */
export async function getCustomer(email: string): Promise<CustomerDetail | null> {
  const key = customerKey(email);
  if (!key) return null;
  const db = supabaseAdmin();
  const res = await db.from("orders").select("*").ilike("email", key).order("created_at", { ascending: false });
  const orders = (res.data ?? []) as AdminOrder[];
  if (orders.length === 0) return null;

  const ids = orders.map((o) => o.id);
  const customerIds = [...new Set(orders.map((o) => o.stripe_customer_id).filter((v): v is string => Boolean(v)))];
  const [items, subsByEmail, subsByCustomer] = await Promise.all([
    db.from("order_items").select("order_id,product_slug,name,qty,plan,unit_price,line_total").in("order_id", ids),
    db.from("subscriptions").select("*").ilike("email", key),
    customerIds.length ? db.from("subscriptions").select("*").in("stripe_customer_id", customerIds) : Promise.resolve({ data: [] as SubscriptionRecord[] }),
  ]);

  const itemsByOrder = new Map<string, OrderItemRecord[]>();
  for (const it of (items.data ?? []) as (OrderItemRecord & { order_id: string })[]) {
    const list = itemsByOrder.get(it.order_id) ?? [];
    list.push(it);
    itemsByOrder.set(it.order_id, list);
  }
  const subMap = new Map<string, SubscriptionRecord>();
  for (const s of [...((subsByEmail.data ?? []) as SubscriptionRecord[]), ...((subsByCustomer.data ?? []) as SubscriptionRecord[])]) subMap.set(s.stripe_subscription_id, s);
  const subscriptions = [...subMap.values()].sort((a, b) => b.created_at.localeCompare(a.created_at));

  const counted = orders.filter((o) => countsAsRevenue(o.status));
  const live = counted.filter((o) => o.environment !== "sandbox");
  const revenue = live.reduce((s, o) => s + Number(o.total), 0);
  const withAddress = orders.find((o) => o.shipping_address);
  const latest = orders[0]!;
  return {
    email: key,
    name: latest.shipping_name ?? withAddress?.shipping_name ?? null,
    phone: orders.find((o) => o.phone)?.phone ?? null,
    address: withAddress
      ? { name: withAddress.shipping_name, line: withAddress.shipping_address, postalCode: withAddress.shipping_postal_code, city: withAddress.shipping_city, country: withAddress.shipping_country }
      : null,
    orders,
    itemsByOrder,
    subscriptions,
    stats: {
      orders: counted.length,
      revenue,
      average: live.length ? revenue / live.length : 0,
      firstOrderAt: orders.at(-1)?.created_at ?? null,
      lastOrderAt: latest.created_at,
      scheduled: orders.filter((o) => o.status === "scheduled").length,
    },
  };
}

export const intervalLabel = (days: number | null | undefined) => (days ? `var ${days}:e dag` : "prenumeration");

export const subscriptionStatusLabel: Record<string, string> = {
  active: "Aktiv",
  trialing: "Provperiod",
  past_due: "Betalning misslyckades",
  paused: "Pausad",
  canceled: "Avslutad",
  unpaid: "Obetald",
  incomplete: "Ofullständig",
  incomplete_expired: "Ej genomförd",
};
