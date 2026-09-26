import "server-only";
import { timingSafeEqual } from "node:crypto";
import { revalidatePath, revalidateTag } from "next/cache";
import { CATALOG_TAG, getCatalog } from "./catalog";
import { sendShippingConfirmation } from "./email";
import { PLACEHOLDER, publicBase } from "./media";
import type { OrderItemRecord, OrderRecord } from "./orders";
import { supabaseAdmin, supabaseConfigured } from "./supabase";

/**
 * Koppling till Plocky (MittLogistik WMS) via dess Webshop-API.
 *
 * Utåt: betalda ordrar POSTas till `${PLOCKY_URL}/orders` med nyckeln PLOCKY_API_KEY
 * (skapas på Plockys kundkort, visas en gång). Kön wms_queue gör om misslyckade försök.
 *
 * Inåt: Plocky anropar `${NEXT_PUBLIC_SITE_URL}/api/plocky/wms-inbound` med headern
 * X-Wms-Key = PLOCKY_INBOUND_KEY (vår nyckel, läggs in på kortet) för lagersaldo
 * (stock.update, absolut säljbart saldo, Plocky är master), leveransbesked
 * (shipment.created) och ping. Artiklar hämtas från /api/plocky/wms-catalog.
 */

export type PlockyConfig = { url: string; apiKey: string };

export function plockyConfig(): PlockyConfig | null {
  const url = (process.env.PLOCKY_URL ?? "").trim().replace(/\/+$/, "");
  const apiKey = (process.env.PLOCKY_API_KEY ?? "").trim();
  if (!url || !apiKey || apiKey.endsWith("...")) return null;
  return { url, apiKey };
}
export const plockyConfigured = () => Boolean(plockyConfig());
export const plockyInboundKey = () => (process.env.PLOCKY_INBOUND_KEY ?? "").trim() || null;
/** Bas-URL som skrivs in på Plockys kort: Plocky lägger själv till /wms-inbound och /wms-catalog. */
export const plockyShopBaseUrl = () => `${(process.env.NEXT_PUBLIC_SITE_URL ?? "https://metilde.com").replace(/\/+$/, "")}/api/plocky`;
/** Bara artikelnummer med detta prefix rapporteras som okända – Plocky skickar alla kundens artiklar, även andra varumärkens. */
const skuPrefix = () => (process.env.PLOCKY_SKU_PREFIX ?? "MET-").trim();

export function verifyInboundKey(header: string | null): boolean {
  const key = plockyInboundKey();
  if (!key || !header) return false;
  const a = Buffer.from(header.trim());
  const b = Buffer.from(key);
  return a.length === b.length && timingSafeEqual(a, b);
}

/* ------------------------------------------------------------------------------------------ */
/* Utgående: ordrar                                                                           */
/* ------------------------------------------------------------------------------------------ */

export type PlockyLine = {
  sku: string;
  name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  is_bundle?: boolean;
  weight_grams?: number | null;
  commodity_code?: string | null;
};

export type PlockyOrderPayload = {
  order: {
    external_id: string;
    order_number: string;
    created_at: string;
    status: "paid";
    payment_status: "paid";
    currency: string;
    subtotal: number;
    shipping_price: number;
    discount_amount: number;
    total: number;
    payment_reference: string | null;
    notes: string | null;
    priority_shipping: boolean;
  };
  customer: { name: string | null; email: string | null; phone: string | null };
  shipping: { address: string; postal_code: string; city: string; country_code: string; method: string | null };
  lines: PlockyLine[];
};

type OrderRow = OrderRecord & { stripe_payment_intent?: string | null; stripe_invoice_id?: string | null; wms_order_id?: string | null };

const round2 = (n: number) => Math.round(n * 100) / 100;
const fmtDate = (iso: string) => new Date(iso).toLocaleDateString("sv-SE", { day: "numeric", month: "long" });

/**
 * Bygger Plockys orderformat. Paket skickas som en paketrad (is_bundle) plus innehållet som
 * egna rader – Plocky plockar bara innehållet. Saknar en produkt artikelnummer används slugen,
 * och ordern hamnar då på "on hold" i Plocky tills artikeln finns; det rapporteras som varning.
 */
export async function buildPlockyPayload(order: OrderRow, items: OrderItemRecord[]): Promise<{ payload: PlockyOrderPayload; missingSkus: string[] }> {
  const catalog = await getCatalog();
  const lines: PlockyLine[] = [];
  const missing = new Set<string>();
  for (const it of items) {
    const bundle = catalog.allBundles.find((b) => b.slug === it.product_slug);
    if (bundle) {
      lines.push({ sku: bundle.sku ?? bundle.slug, name: it.name, quantity: it.qty, unit_price: round2(it.unit_price), total_price: round2(it.line_total), is_bundle: true });
      for (const c of bundle.items) {
        if (!c.product.sku) missing.add(c.product.slug);
        lines.push({
          sku: c.product.sku ?? c.product.slug,
          name: c.product.name,
          quantity: c.qty * it.qty,
          unit_price: 0,
          total_price: 0,
          weight_grams: c.product.weightGrams,
          commodity_code: c.product.customsCode,
        });
      }
      continue;
    }
    const p = catalog.allProducts.find((x) => x.slug === it.product_slug);
    if (!p?.sku) missing.add(it.product_slug);
    lines.push({
      sku: p?.sku ?? it.product_slug,
      name: it.name,
      quantity: it.qty,
      unit_price: round2(it.unit_price),
      total_price: round2(it.line_total),
      weight_grams: p?.weightGrams ?? null,
      commodity_code: p?.customsCode ?? null,
    });
  }
  const notes = [
    order.kind === "renewal" ? `Prenumerationsleverans${order.deliver_at ? `, planerad leverans ${fmtDate(order.deliver_at)}` : ""}` : null,
    order.kind === "checkout" && order.has_subscription ? "Första leveransen i en prenumeration" : null,
  ]
    .filter(Boolean)
    .join(". ");
  const payload: PlockyOrderPayload = {
    order: {
      external_id: order.id,
      order_number: order.order_number,
      created_at: order.created_at,
      status: "paid",
      payment_status: "paid",
      currency: order.currency || "SEK",
      subtotal: round2(Number(order.subtotal)),
      shipping_price: round2(Number(order.shipping)),
      discount_amount: round2(Number(order.discount)),
      total: round2(Number(order.total)),
      payment_reference: order.stripe_payment_intent ?? order.stripe_invoice_id ?? null,
      notes: notes || null,
      priority_shipping: false,
    },
    customer: { name: order.shipping_name, email: order.email, phone: order.phone ?? null },
    shipping: {
      address: order.shipping_address ?? "",
      postal_code: order.shipping_postal_code ?? "",
      city: order.shipping_city ?? "",
      country_code: (order.shipping_country ?? "SE").toUpperCase(),
      method: order.shipping_method,
    },
    lines,
  };
  return { payload, missingSkus: [...missing] };
}

export const PLOCKY_BACKOFF_MINUTES = [1, 5, 15, 60, 180, 720];

type QueueRow = { id: string; order_id: string; order_number: string | null; status: string; attempts: number };

/** Lägger ordern i kön till Plocky. Presentkort är inget att plocka. Returnerar false om Plocky inte är påkopplat. */
export async function enqueuePlockyOrder(order: Pick<OrderRecord, "id" | "order_number" | "kind">): Promise<boolean> {
  if (!supabaseConfigured() || !plockyConfigured()) return false;
  if (order.kind === "giftcard") return false;
  const res = await supabaseAdmin()
    .from("wms_queue")
    .upsert({ order_id: order.id, order_number: order.order_number, status: "pending", next_attempt_at: new Date().toISOString() }, { onConflict: "order_id", ignoreDuplicates: true });
  if (res.error) {
    console.error("[plocky] kö", res.error.message);
    return false;
  }
  return true;
}

/** Köar ordern och försöker skicka direkt; misslyckas det tar cron-jobbet vid. Kastar aldrig. */
export async function pushOrderToPlocky(order: Pick<OrderRecord, "id" | "order_number" | "kind">): Promise<void> {
  try {
    if (await enqueuePlockyOrder(order)) await sendPlockyQueue({ orderId: order.id });
  } catch (e) {
    console.error("[plocky]", e instanceof Error ? e.message : e);
  }
}

/** Nollställer en order i kön (efter t.ex. rättat artikelnummer) och skickar igen. */
export async function retryPlockyOrder(orderId: string): Promise<{ ok: boolean; message: string }> {
  if (!plockyConfigured()) return { ok: false, message: "Plocky är inte konfigurerat (PLOCKY_URL och PLOCKY_API_KEY saknas)." };
  const db = supabaseAdmin();
  const order = (await db.from("orders").select("id,order_number,kind").eq("id", orderId).maybeSingle()).data as Pick<OrderRecord, "id" | "order_number" | "kind"> | null;
  if (!order) return { ok: false, message: "Ordern finns inte." };
  if (order.kind === "giftcard") return { ok: false, message: "Presentkort skickas inte till lagret." };
  const up = await db
    .from("wms_queue")
    .upsert({ order_id: order.id, order_number: order.order_number, status: "pending", attempts: 0, next_attempt_at: new Date().toISOString(), last_error: null }, { onConflict: "order_id" });
  if (up.error) return { ok: false, message: up.error.message };
  const r = await sendPlockyQueue({ orderId });
  const row = (await db.from("wms_queue").select("status,last_error,wms_order_id").eq("order_id", orderId).maybeSingle()).data as { status: string; last_error: string | null; wms_order_id: string | null } | null;
  if (row?.status === "sent") return { ok: true, message: `Ordern finns i Plocky som ${row.wms_order_id ?? "(okänt nummer)"}.` };
  return { ok: false, message: row?.last_error ?? (r.failed ? "Plocky svarade med ett fel." : "Ordern ligger i kön och skickas av nästa körning.") };
}

type SendResult = { sent: number; failed: number; retrying: number };

/** Skickar köade ordrar till Plocky. Anropas direkt efter köläggning och av cron var tionde minut. */
export async function sendPlockyQueue(o: { limit?: number; orderId?: string } = {}): Promise<SendResult> {
  const result: SendResult = { sent: 0, failed: 0, retrying: 0 };
  const cfg = plockyConfig();
  if (!supabaseConfigured() || !cfg) return result;
  const db = supabaseAdmin();
  let q = db
    .from("wms_queue")
    .select("id,order_id,order_number,status,attempts")
    .in("status", ["pending", "retrying"])
    .lte("next_attempt_at", new Date().toISOString())
    .order("next_attempt_at", { ascending: true })
    .limit(o.limit ?? 25);
  if (o.orderId) q = q.eq("order_id", o.orderId);
  const rows = ((await q).data ?? []) as QueueRow[];

  for (const row of rows) {
    const attempts = row.attempts + 1;
    const now = new Date().toISOString();
    const outcome: PushOutcome = await pushOne(cfg, row.order_id).catch((e: unknown) => ({ kind: "retry" as const, error: e instanceof Error ? e.message : String(e), body: null, payload: null, warning: null }));
    if (outcome.kind === "sent") {
      await db
        .from("wms_queue")
        .update({ status: "sent", attempts, sent_at: now, wms_order_id: outcome.wmsId, response_body: outcome.body, payload: outcome.payload, warning: outcome.warning, last_error: null })
        .eq("id", row.id);
      await db.from("orders").update({ wms_order_id: outcome.wmsId, wms_sent_at: now }).eq("id", row.order_id);
      result.sent++;
      continue;
    }
    if (outcome.kind === "fail") {
      await db.from("wms_queue").update({ status: "failed", attempts, last_error: outcome.error, response_body: outcome.body, payload: outcome.payload, warning: outcome.warning }).eq("id", row.id);
      result.failed++;
      continue;
    }
    const wait = outcome.retryAfterSeconds ? Math.ceil(outcome.retryAfterSeconds / 60) : PLOCKY_BACKOFF_MINUTES[attempts - 1];
    const giveUp = wait === undefined;
    await db
      .from("wms_queue")
      .update({
        status: giveUp ? "failed" : "retrying",
        attempts,
        last_error: giveUp ? `${outcome.error} (gav upp efter ${attempts} försök)` : outcome.error,
        response_body: outcome.body,
        payload: outcome.payload,
        warning: outcome.warning,
        next_attempt_at: giveUp ? now : new Date(Date.now() + wait * 60_000).toISOString(),
      })
      .eq("id", row.id);
    if (giveUp) result.failed++;
    else result.retrying++;
  }
  return result;
}

type PushOutcome =
  | { kind: "sent"; wmsId: string | null; body: string | null; payload: PlockyOrderPayload | null; warning: string | null }
  | { kind: "fail"; error: string; body: string | null; payload: PlockyOrderPayload | null; warning: string | null }
  | { kind: "retry"; error: string; body: string | null; payload: PlockyOrderPayload | null; warning: string | null; retryAfterSeconds?: number };

async function pushOne(cfg: PlockyConfig, orderId: string): Promise<PushOutcome> {
  const db = supabaseAdmin();
  const order = (await db.from("orders").select("*").eq("id", orderId).maybeSingle()).data as OrderRow | null;
  if (!order) return { kind: "fail", error: "Ordern finns inte längre.", body: null, payload: null, warning: null };
  if (order.status === "cancelled" || order.status === "refunded") return { kind: "fail", error: `Ordern är ${order.status === "cancelled" ? "avbruten" : "återbetald"} och skickas inte.`, body: null, payload: null, warning: null };
  const items = ((await db.from("order_items").select("product_slug,name,qty,plan,unit_price,line_total").eq("order_id", orderId)).data ?? []) as OrderItemRecord[];
  if (items.length === 0) return { kind: "fail", error: "Ordern har inga rader.", body: null, payload: null, warning: null };
  const { payload, missingSkus } = await buildPlockyPayload(order, items);
  const warning = missingSkus.length ? `Saknar artikelnummer (slug skickades i stället): ${missingSkus.join(", ")}` : null;

  let res: Response;
  try {
    res = await fetch(`${cfg.url}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Api-Key": cfg.apiKey, Accept: "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(20_000),
    });
  } catch (e) {
    return { kind: "retry", error: `Kunde inte nå Plocky: ${e instanceof Error ? e.message : String(e)}`, body: null, payload, warning };
  }
  const text = await res.text();
  const body = text.slice(0, 2000) || null;
  let json: { id?: string; duplicate?: boolean; error?: string; message?: string } = {};
  try {
    json = text ? JSON.parse(text) : {};
  } catch {
    /* svaret var inte JSON */
  }
  if (res.status === 201 || res.status === 409) return { kind: "sent", wmsId: json.id ?? null, body, payload, warning };
  const detail = json.error ?? json.message ?? body ?? "";
  if (res.status === 401 || res.status === 403) return { kind: "fail", error: "Plocky avvisade nyckeln (PLOCKY_API_KEY). Skapa en ny nyckel på Plockys kort och lägg in den.", body, payload, warning };
  if (res.status === 404) return { kind: "fail", error: "Adressen finns inte – kontrollera PLOCKY_URL (ska sluta med /api/shop/<id>).", body, payload, warning };
  if (res.status === 422) return { kind: "fail", error: `Plocky kunde inte använda ordern: ${detail}`, body, payload, warning };
  if (res.status === 503) {
    const ra = Number(res.headers.get("retry-after"));
    return { kind: "retry", error: "Kopplingen är pausad i Plocky.", body, payload, warning, retryAfterSeconds: Number.isFinite(ra) && ra > 0 ? ra : undefined };
  }
  return { kind: "retry", error: `Plocky svarade ${res.status}: ${detail}`, body, payload, warning };
}

/** Hälsokontroll: GET {PLOCKY_URL}/orders med nyckeln ska ge { ok: true }. */
export async function testPlockyConnection(): Promise<{ ok: boolean; message: string }> {
  const cfg = plockyConfig();
  if (!cfg) return { ok: false, message: "PLOCKY_URL och PLOCKY_API_KEY saknas i miljön." };
  try {
    const res = await fetch(`${cfg.url}/orders`, { headers: { "X-Api-Key": cfg.apiKey, Accept: "application/json" }, signal: AbortSignal.timeout(15_000) });
    const text = await res.text();
    if (res.status === 401 || res.status === 403) return { ok: false, message: "Plocky avvisade nyckeln. Skapa en ny nyckel på Plockys kort och uppdatera PLOCKY_API_KEY." };
    if (res.status === 404) return { ok: false, message: "Adressen finns inte. PLOCKY_URL ska vara den URL som visas på kortet, t.ex. https://…/api/shop/<id>." };
    if (!res.ok) return { ok: false, message: `Plocky svarade ${res.status}: ${text.slice(0, 200)}` };
    let json: { ok?: boolean; shop?: string; wms_integration?: string } = {};
    try {
      json = JSON.parse(text);
    } catch {
      /* ignoreras */
    }
    if (!json.ok) return { ok: false, message: `Oväntat svar: ${text.slice(0, 200)}` };
    return { ok: true, message: `Kopplingen fungerar${json.shop ? ` (butik: ${json.shop})` : ""}. Nyckeln godkänns och ordrar kan skickas.` };
  } catch (e) {
    return { ok: false, message: `Kunde inte nå Plocky: ${e instanceof Error ? e.message : String(e)}` };
  }
}

/* ------------------------------------------------------------------------------------------ */
/* Inkommande: ping, lagersaldo, leveransbesked                                               */
/* ------------------------------------------------------------------------------------------ */

async function logEvent(event: string, ok: boolean, message: string | null, orderNumber: string | null = null, payload: unknown = null) {
  if (!supabaseConfigured()) return;
  await supabaseAdmin()
    .from("wms_events")
    .insert({ event, ok, message, order_number: orderNumber, payload: payload as never })
    .then((r) => {
      if (r.error) console.error("[plocky] logg", r.error.message);
    });
}

type InboundResponse = { status: number; body: Record<string, unknown> };

export async function handleInbound(raw: unknown): Promise<InboundResponse> {
  const body = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const event = String(body.event ?? "");
  switch (event) {
    case "ping":
      await logEvent("ping", true, "Plocky testade kopplingen.");
      return { status: 200, body: { success: true } };
    case "stock.update":
      return handleStockUpdate(body);
    case "shipment.created":
      return handleShipment(body);
    default:
      await logEvent(event || "(saknas)", false, "Okänd händelse.", null, body);
      return { status: 400, body: { success: false, message: `Okänd händelse: ${event || "(saknas)"}` } };
  }
}

type StockItem = { sku: string; quantity: number };

/** Plocky skickar hela det säljbara saldot per artikel. Vi skriver över products.stock för de artiklar vi känner. */
async function handleStockUpdate(body: Record<string, unknown>): Promise<InboundResponse> {
  const items = (Array.isArray(body.items) ? body.items : [])
    .map((x) => {
      const it = (x ?? {}) as Record<string, unknown>;
      return { sku: String(it.sku ?? "").trim(), quantity: Math.max(0, Math.round(Number(it.quantity ?? 0) || 0)) };
    })
    .filter((x): x is StockItem => Boolean(x.sku));
  if (!supabaseConfigured()) return { status: 503, body: { success: false, message: "Databasen är inte konfigurerad." } };
  const db = supabaseAdmin();
  const products = ((await db.from("products").select("slug,sku,stock,track_stock").not("sku", "is", null)).data ?? []) as { slug: string; sku: string; stock: number; track_stock: boolean }[];
  const bySku = new Map(products.map((p) => [p.sku, p]));
  const prefix = skuPrefix().toLowerCase();
  const unknown: string[] = [];
  let ignored = 0;
  const updated: string[] = [];
  for (const it of items) {
    const p = bySku.get(it.sku);
    if (!p) {
      // Plocky skickar alla kundens artiklar (även andra varumärken) – bara våra rapporteras som okända
      if (prefix === "*" || !prefix || it.sku.toLowerCase().startsWith(prefix)) unknown.push(it.sku);
      else ignored++;
      continue;
    }
    if (Number(p.stock) !== it.quantity) {
      const res = await db.from("products").update({ stock: it.quantity }).eq("slug", p.slug);
      if (res.error) {
        await logEvent("stock.update", false, `Kunde inte uppdatera ${p.slug}: ${res.error.message}`);
        return { status: 500, body: { success: false, message: res.error.message } };
      }
      updated.push(`${p.sku} → ${it.quantity}`);
    }
  }
  if (updated.length) {
    revalidateTag(CATALOG_TAG, "max");
    revalidatePath("/sv", "layout");
    revalidatePath("/admin", "layout");
  }
  await logEvent(
    "stock.update",
    true,
    `${items.length} artiklar från Plocky, ${updated.length} saldon ändrade${unknown.length ? `, ${unknown.length} okända` : ""}${ignored ? `, ${ignored} andra varumärken ignorerade` : ""}.`,
    null,
    { updated: updated.slice(0, 50), unknown_skus: unknown.slice(0, 50) },
  );
  return { status: 200, body: { success: true, updated: updated.length, unknown_skus: unknown } };
}

/** Plocky har bokat frakten: ordern blir Skickad, får kolli-id och spårningslänk, och kunden får leveransbesked. */
async function handleShipment(body: Record<string, unknown>): Promise<InboundResponse> {
  const orderNumber = String(body.order_number ?? "").trim();
  const tracking = {
    number: String(body.tracking_number ?? "").trim() || null,
    url: String(body.tracking_link ?? body.tracking_url ?? "").trim() || null,
    carrier: String(body.carrier ?? "").trim().toLowerCase() || null,
  };
  const wmsOrderId = String(body.wms_order_id ?? "").trim() || null;
  if (!orderNumber) {
    await logEvent("shipment.created", false, "Ordernummer saknas i leveransbeskedet.", null, body);
    return { status: 422, body: { success: false, message: "order_number saknas" } };
  }
  if (!supabaseConfigured()) return { status: 503, body: { success: false, message: "Databasen är inte konfigurerad." } };
  const db = supabaseAdmin();
  let order = (await db.from("orders").select("*").eq("order_number", orderNumber).maybeSingle()).data as OrderRow | null;
  // Plocky skickar butikens ordernummer; som reserv slår vi upp på vårt id (external_id) och Plockys nummer
  if (!order && /^[0-9a-f-]{36}$/i.test(orderNumber)) order = (await db.from("orders").select("*").eq("id", orderNumber).maybeSingle()).data as OrderRow | null;
  if (!order && wmsOrderId) order = (await db.from("orders").select("*").eq("wms_order_id", wmsOrderId).maybeSingle()).data as OrderRow | null;
  if (!order) {
    await logEvent("shipment.created", false, `Ordern ${orderNumber} finns inte hos oss.`, orderNumber, body);
    return { status: 404, body: { success: false, message: `Ordern ${orderNumber} finns inte` } };
  }
  const alreadyShipped = order.status === "shipped" || order.status === "delivered";
  const keepStatus = order.status === "cancelled" || order.status === "refunded" || order.status === "delivered";
  const patch: Record<string, unknown> = {
    tracking_number: tracking.number,
    tracking_url: tracking.url,
    wms_order_id: wmsOrderId ?? order.wms_order_id ?? null,
  };
  if (!keepStatus) patch.status = "shipped";
  const res = await db.from("orders").update(patch).eq("id", order.id);
  if (res.error) {
    await logEvent("shipment.created", false, res.error.message, order.order_number, body);
    return { status: 500, body: { success: false, message: res.error.message } };
  }
  if (!alreadyShipped && !keepStatus) {
    await sendShippingConfirmation({ ...order, status: "shipped" }, tracking).catch((e: unknown) => console.error("[plocky] leveransbesked", e instanceof Error ? e.message : e));
  }
  revalidatePath("/admin", "layout");
  await logEvent(
    "shipment.created",
    true,
    `${order.order_number} skickad${tracking.carrier ? ` med ${tracking.carrier}` : ""}${tracking.number ? `, kolli ${tracking.number}` : ""}${alreadyShipped ? " (var redan skickad – spårningen uppdaterad)" : ""}.`,
    order.order_number,
    { tracking, wms_order_id: wmsOrderId },
  );
  return { status: 200, body: { success: true } };
}

/* ------------------------------------------------------------------------------------------ */
/* Artikelkatalog till Plocky                                                                 */
/* ------------------------------------------------------------------------------------------ */

/** Bildadresser måste gå att nå från Plocky: lokala /media-sökvägar får domänen framför, platshållaren skickas inte. */
const absoluteImages = (images: string[]) =>
  images
    .filter((src) => src && src !== PLACEHOLDER)
    .slice(0, 1)
    .map((src) => (/^https?:\/\//.test(src) ? src : `${publicBase()}${src.startsWith("/") ? "" : "/"}${src}`));

/** Artiklar i det format Plockys "Synka artiklar" läser. Paket flaggas is_bundle så att paketraden inte plockas. */
export async function plockyCatalog() {
  const c = await getCatalog();
  const products = c.allProducts.map((p) => ({
    sku: p.sku ?? p.slug,
    name: p.name,
    name_sv: p.name,
    is_active: p.isActive,
    weight_grams: p.weightGrams,
    commodity_code: p.customsCode,
    country_of_origin: p.countryOfOrigin,
    gtin: p.gtin,
    stock_quantity: p.stock,
    is_bundle: false,
    images: absoluteImages(p.images),
    url: `${publicBase()}/sv/produkter/${p.slug}`,
  }));
  const bundles = c.allBundles.map((b) => ({
    sku: b.sku ?? b.slug,
    name: b.name,
    name_sv: b.name,
    is_active: b.isActive,
    weight_grams: b.items.reduce((s, i) => s + (i.product.weightGrams ?? 0) * i.qty, 0) || null,
    commodity_code: null,
    stock_quantity: b.items.length ? Math.min(...b.items.map((i) => (i.product.trackStock ? Math.floor(i.product.stock / i.qty) : 9999))) : 0,
    is_bundle: true,
    images: absoluteImages(b.images),
    components: b.items.map((i) => ({ sku: i.product.sku ?? i.product.slug, quantity: i.qty })),
  }));
  return { products: [...products, ...bundles] };
}

/** Produkter utan artikelnummer – de matchar inte Plocky och ger ordrar på "on hold". */
export async function productsWithoutSku(): Promise<{ slug: string; name: string }[]> {
  const c = await getCatalog();
  return c.allProducts.filter((p) => p.isActive && !p.sku).map((p) => ({ slug: p.slug, name: p.name }));
}
