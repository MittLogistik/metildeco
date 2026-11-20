import "server-only";
import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { customerKey, getCustomer } from "./customers";
import { supabaseAdmin } from "./supabase";

/**
 * Kundtjänstboten Matilda (Grok). Inlogget är en personlig API-nyckel (Bearer) som skapas och
 * byts på /admin/kundtjanst; bara hashen sparas. Allt hon gör loggas i support_log, där även
 * adminens egna prenumerationsändringar hamnar, så att det syns vem som ändrade vad.
 */

export const MATILDA_ID = "matilda";

export type SupportAgent = {
  id: string;
  name: string;
  key_prefix: string | null;
  enabled: boolean;
  allow_subscriptions: boolean;
  allow_email: boolean;
  last_used_at: string | null;
  updated_at: string;
  key_hash?: string | null;
};

export type SupportLogEntry = {
  id: string;
  actor: string;
  action: string;
  customer_email: string | null;
  target: string | null;
  summary: string | null;
  details: Record<string, unknown> | null;
  ok: boolean;
  created_at: string;
};

const hashKey = (key: string) => createHash("sha256").update(key).digest("hex");

export async function getAgent(id = MATILDA_ID): Promise<SupportAgent | null> {
  const res = await supabaseAdmin().from("support_agents").select("id,name,key_prefix,enabled,allow_subscriptions,allow_email,last_used_at,updated_at").eq("id", id).maybeSingle();
  return (res.data as SupportAgent | null) ?? null;
}

/** Ny nyckel – den gamla slutar gälla direkt. Nyckeln visas bara en gång. */
export async function rotateAgentKey(id = MATILDA_ID): Promise<string> {
  const key = `mtl_${randomBytes(24).toString("base64url")}`;
  const res = await supabaseAdmin()
    .from("support_agents")
    .upsert({ id, name: id === MATILDA_ID ? "Matilda" : id, key_hash: hashKey(key), key_prefix: key.slice(0, 8), updated_at: new Date().toISOString() });
  if (res.error) throw new Error(res.error.message);
  return key;
}

export async function revokeAgentKey(id = MATILDA_ID) {
  await supabaseAdmin().from("support_agents").update({ key_hash: null, key_prefix: null, updated_at: new Date().toISOString() }).eq("id", id);
}

export async function updateAgentSettings(id: string, patch: Partial<Pick<SupportAgent, "enabled" | "allow_subscriptions" | "allow_email">>) {
  await supabaseAdmin().from("support_agents").update({ ...patch, updated_at: new Date().toISOString() }).eq("id", id);
}

export type AgentAuth = { ok: true; agent: SupportAgent } | { ok: false; status: number; error: string };

/** Kontrollerar Authorization: Bearer <nyckel> mot Matildas hash. */
export async function authenticateAgent(request: Request): Promise<AgentAuth> {
  const header = request.headers.get("authorization") ?? "";
  const key = header.replace(/^Bearer\s+/i, "").trim();
  if (!key.startsWith("mtl_")) return { ok: false, status: 401, error: "Saknar eller fel API-nyckel." };
  const res = await supabaseAdmin().from("support_agents").select("*").eq("id", MATILDA_ID).maybeSingle();
  const agent = res.data as SupportAgent | null;
  if (!agent?.key_hash) return { ok: false, status: 401, error: "Inget inlogg är skapat." };
  const a = Buffer.from(hashKey(key));
  const b = Buffer.from(agent.key_hash);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return { ok: false, status: 401, error: "Fel API-nyckel." };
  if (!agent.enabled) return { ok: false, status: 403, error: "Matilda är avstängd i admin. Lämna ärendet till en människa." };
  // Senast använd – får inte fälla anropet
  void supabaseAdmin().from("support_agents").update({ last_used_at: new Date().toISOString() }).eq("id", agent.id).then(() => undefined);
  delete agent.key_hash;
  return { ok: true, agent };
}

export async function logSupport(entry: { actor: string; action: string; customerEmail?: string | null; target?: string | null; summary?: string | null; details?: Record<string, unknown> | null; ok?: boolean }) {
  const res = await supabaseAdmin()
    .from("support_log")
    .insert({
      actor: entry.actor,
      action: entry.action,
      customer_email: entry.customerEmail ? customerKey(entry.customerEmail) : null,
      target: entry.target ?? null,
      summary: entry.summary?.slice(0, 2000) ?? null,
      details: entry.details ?? null,
      ok: entry.ok ?? true,
    });
  if (res.error) console.error("[support_log]", res.error.message);
}

export async function listSupportLog(o: { actor?: string; customer?: string; limit?: number } = {}): Promise<SupportLogEntry[]> {
  let q = supabaseAdmin().from("support_log").select("*").order("created_at", { ascending: false }).limit(o.limit ?? 200);
  if (o.actor) q = q.eq("actor", o.actor);
  if (o.customer) q = q.eq("customer_email", customerKey(o.customer));
  const res = await q;
  return (res.data ?? []) as SupportLogEntry[];
}

export const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

/**
 * Det Matilda får se om en kund: bara kundens egna ordrar och prenumerationer, utan interna
 * fält (källa, affiliate, Stripe-kund-id). Hon slår alltid upp med avsändarens adress.
 */
export async function customerForAgent(email: string) {
  const c = await getCustomer(email);
  if (!c) return null;
  return {
    email: c.email,
    name: c.name,
    orders: c.orders
      .filter((o) => o.environment !== "sandbox")
      .slice(0, 25)
      .map((o) => ({
        order_number: o.order_number,
        created_at: o.created_at,
        status: o.status,
        kind: o.kind,
        total: Number(o.total),
        shipping: Number(o.shipping),
        discount: Number(o.discount),
        currency: o.currency,
        shipping_method: o.shipping_method,
        shipping_country: o.shipping_country,
        deliver_at: o.deliver_at ?? null,
        tracking_number: o.tracking_number,
        tracking_url: (o as { tracking_url?: string | null }).tracking_url ?? null,
        locale: o.locale ?? null,
        items: (c.itemsByOrder.get(o.id) ?? []).map((i) => ({ name: i.name, qty: i.qty, plan: i.plan, line_total: Number(i.line_total) })),
      })),
    subscriptions: c.subscriptions
      .filter((s) => s.environment !== "sandbox")
      .map((s) => ({
        subscription_id: s.stripe_subscription_id,
        product_slug: s.product_slug,
        status: s.status,
        quantity: s.quantity,
        amount: s.amount,
        currency: s.currency,
        interval_days: s.interval_days,
        current_period_end: s.current_period_end,
        next_shipment_at: s.next_shipment_at,
        cancel_at_period_end: s.cancel_at_period_end,
        paused: Boolean(s.paused_at),
      })),
  };
}

/** Prenumerationen måste tillhöra kunden (e-post eller samma Stripe-kund som någon av kundens ordrar). */
export async function subscriptionBelongsTo(subscriptionId: string, email: string) {
  const c = await getCustomer(email);
  return Boolean(c?.subscriptions.some((s) => s.stripe_subscription_id === subscriptionId));
}
