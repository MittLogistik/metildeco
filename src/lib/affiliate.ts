import "server-only";
import { supabaseAdmin, supabaseConfigured } from "./supabase";

/**
 * AddRevenue-affiliate.
 *
 * Flödet: en publisher länkar hit med ett klick-ID i adressen. Klicket sparas per besökare
 * i 30 dagar. Vid kassan knyts det senaste giltiga klicket till ordern, och när ordern är
 * betald läggs en konvertering i kö och skickas till AddRevenues tracker.
 *
 * Två endpoints med olika regler, och det är lätt att blanda ihop dem:
 *  - trackern /t tar EMOT konverteringen och får INTE ha någon Authorization-header,
 *  - api/v2 används för att hämta provision och kräver Bearer-token.
 *
 * All kommunikation sker från servern. Webbläsaren skickar bara klickparametrarna hit.
 */

export const AFFILIATE_SOURCE = "addrevenue";
/** Nyckeln i localStorage som håller besökarens id. */
export const VISITOR_KEY = "metilde_vid";

export type AffiliateSettings = {
  enabled: boolean;
  advertiserId: string;
  endpointUrl: string;
  apiBaseUrl: string;
  attributionDays: number;
  /**
   * Momssats per leveransland (ISO2) för det provisionsgrundande värdet, plus "default"
   * för länder som inte står med. Kosttillskott momssätts olika i olika länder, så den här
   * tabellen ska stämmas av mot bokföringen innan nya marknader öppnas.
   */
  vatRates: Record<string, number>;
};

const SETTINGS_KEY = "affiliate_addrevenue";

export const defaultSettings: AffiliateSettings = {
  enabled: true,
  advertiserId: "988234",
  endpointUrl: "https://addrevenue.io/t",
  apiBaseUrl: "https://addrevenue.io/api/v2",
  attributionDays: 30,
  vatRates: { SE: 0.12, default: 0.25 },
};

/** Inställningarna från databasen, med koden som reserv. */
export async function getSettings(): Promise<AffiliateSettings> {
  if (!supabaseConfigured()) return defaultSettings;
  const res = await supabaseAdmin().from("integration_settings").select("value").eq("key", SETTINGS_KEY).maybeSingle();
  const stored = (res.data?.value ?? {}) as Partial<AffiliateSettings>;
  return {
    ...defaultSettings,
    ...stored,
    vatRates: { ...defaultSettings.vatRates, ...(stored.vatRates ?? {}) },
  };
}

export async function saveSettings(patch: Partial<AffiliateSettings>): Promise<AffiliateSettings> {
  const current = await getSettings();
  const next: AffiliateSettings = { ...current, ...patch, vatRates: { ...current.vatRates, ...(patch.vatRates ?? {}) } };
  const res = await supabaseAdmin().from("integration_settings").upsert({ key: SETTINGS_KEY, value: next, updated_at: new Date().toISOString() }, { onConflict: "key" });
  if (res.error) throw new Error(res.error.message);
  return next;
}

/* --------------------------------- klicket --------------------------------- */

/** Parametrar som kan bära klick-ID. adt_id är den vanliga, övriga förekommer. */
const CLICK_KEYS = ["adt_id", "adt_ei", "arid", "clickid", "click_id"];
/** Parametrar som bär kanalen (publisher). */
const CHANNEL_KEYS = ["channelId", "channelid", "channel_id", "adt_ch", "adt_channel"];
/** Sparas som spår, även när de inte används i postbacken. */
const KEEP_PREFIXES = ["adt", "utm_", "gclid", "fbclid", "ref"];

export type ClickParams = { clickId: string | null; clickRef: string | null; raw: Record<string, string> };

/** Plockar ut klick-ID, kanal och övriga spårparametrar ur en adress. */
export function parseClickParams(search: URLSearchParams | string): ClickParams {
  const params = typeof search === "string" ? new URLSearchParams(search.startsWith("?") ? search.slice(1) : search) : search;
  const get = (keys: string[]) => {
    for (const k of keys) {
      const v = params.get(k);
      if (v && v.trim()) return v.trim().slice(0, 200);
    }
    // Skiftlägesokänsligt som reserv – publishers skriver channelid på olika sätt
    for (const [key, value] of params.entries()) {
      if (keys.some((k) => k.toLowerCase() === key.toLowerCase()) && value.trim()) return value.trim().slice(0, 200);
    }
    return null;
  };
  const raw: Record<string, string> = {};
  for (const [key, value] of params.entries()) {
    if (KEEP_PREFIXES.some((p) => key.toLowerCase().startsWith(p)) || CLICK_KEYS.includes(key) || CHANNEL_KEYS.includes(key)) {
      raw[key.slice(0, 60)] = value.slice(0, 300);
    }
  }
  return { clickId: get(CLICK_KEYS), clickRef: get(CHANNEL_KEYS), raw };
}

export type StoredClick = { clickId: string | null; clickRef: string | null; source: string; expiresAt: string };

/** Sparar ett klick för besökaren. Utan klick-ID sparas ingenting. */
export async function storeClick(o: {
  visitorId: string;
  click: ClickParams;
  landingUrl?: string | null;
  referrer?: string | null;
}): Promise<StoredClick | null> {
  if (!supabaseConfigured() || !o.click.clickId) return null;
  const settings = await getSettings();
  if (!settings.enabled) return null;
  const expiresAt = new Date(Date.now() + settings.attributionDays * 864e5).toISOString();
  const res = await supabaseAdmin()
    .from("visitor_tracking")
    .insert({
      visitor_id: o.visitorId.slice(0, 100),
      source: AFFILIATE_SOURCE,
      click_id: o.click.clickId,
      click_ref: o.click.clickRef,
      raw_params: o.click.raw,
      landing_url: o.landingUrl?.slice(0, 1000) ?? null,
      referrer: o.referrer?.slice(0, 1000) ?? null,
      expires_at: expiresAt,
    })
    .select("click_id,click_ref,source,expires_at")
    .single();
  if (res.error) throw new Error(res.error.message);
  return { clickId: res.data.click_id, clickRef: res.data.click_ref, source: res.data.source, expiresAt: res.data.expires_at };
}

/** Senaste klicket för besökaren som fortfarande ligger inom attributionsfönstret. */
export async function latestClick(visitorId: string): Promise<StoredClick | null> {
  if (!supabaseConfigured() || !visitorId) return null;
  const res = await supabaseAdmin()
    .from("visitor_tracking")
    .select("click_id,click_ref,source,expires_at")
    .eq("visitor_id", visitorId)
    .gt("expires_at", new Date().toISOString())
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  const row = res.data as { click_id: string | null; click_ref: string | null; source: string; expires_at: string } | null;
  return row?.click_id ? { clickId: row.click_id, clickRef: row.click_ref, source: row.source, expiresAt: row.expires_at } : null;
}

/* --------------------------------- beloppet -------------------------------- */

/**
 * Provisionsgrundande värde: varornas summa efter rabatt, exklusive moms och frakt.
 *
 * `orders.subtotal` är redan summan av orderraderna efter rabatt (Stripes amount_total per rad)
 * och innehåller inte frakten, så rabatten ska inte dras av en gång till här.
 */
export function commissionValue(o: { subtotal: number; country: string | null; vatRates: Record<string, number> }): number {
  const vat = o.vatRates[(o.country ?? "").toUpperCase()] ?? o.vatRates.default ?? 0;
  const value = Number(o.subtotal) / (1 + vat);
  return Math.round(value * 100) / 100;
}

/* -------------------------------- postbacken ------------------------------- */

export type AffiliateOrder = {
  id: string;
  order_number: string;
  currency: string;
  subtotal: number;
  shipping_country: string | null;
  affiliate_source: string | null;
  affiliate_click_id: string | null;
  affiliate_click_ref: string | null;
};

export async function buildPayload(order: AffiliateOrder, settings?: AffiliateSettings) {
  const s = settings ?? (await getSettings());
  return {
    type: "Purchase",
    advertiserId: s.advertiserId,
    channelId: order.affiliate_click_ref ?? undefined,
    orderId: order.order_number,
    clickId: order.affiliate_click_id,
    // Alltid i ordervalutan – beloppet får aldrig räknas om innan det skickas
    value: commissionValue({ subtotal: Number(order.subtotal), country: order.shipping_country, vatRates: s.vatRates }),
    currency: (order.currency || "SEK").toUpperCase(),
    market: (order.shipping_country ?? "SE").toUpperCase(),
  };
}

/** Lägger konverteringen i kön. Samma order och källa köas bara en gång. */
export async function enqueuePostback(order: AffiliateOrder): Promise<boolean> {
  if (!supabaseConfigured() || !order.affiliate_click_id) return false;
  const settings = await getSettings();
  if (!settings.enabled) return false;
  const payload = await buildPayload(order, settings);
  const res = await supabaseAdmin()
    .from("postback_queue")
    .upsert(
      {
        order_id: order.id,
        order_number: order.order_number,
        source: order.affiliate_source ?? AFFILIATE_SOURCE,
        endpoint_url: settings.endpointUrl,
        payload,
        status: "pending",
        next_attempt_at: new Date().toISOString(),
      },
      { onConflict: "order_id,source", ignoreDuplicates: true },
    )
    .select("id");
  if (res.error) throw new Error(res.error.message);
  return (res.data?.length ?? 0) > 0;
}

/** Väntetid mellan försöken, i minuter. Efter sista försöket ges det upp. */
export const BACKOFF_MINUTES = [1, 5, 15, 60, 180, 720];

type QueueRow = { id: string; order_id: string | null; order_number: string | null; source: string; endpoint_url: string; payload: Record<string, unknown>; attempts: number };

/**
 * Skickar konverteringen till trackern. Ingen Authorization-header här:
 * /t avvisar anrop som bär token.
 */
async function postConversion(url: string, payload: Record<string, unknown>): Promise<{ ok: boolean; status: number; body: string }> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify(payload),
  });
  const body = (await res.text()).slice(0, 2000);
  return { ok: res.ok, status: res.status, body };
}

/** Kör kön: skickar det som är moget och skjuter fram det som misslyckas. */
export async function sendQueued(limit = 25): Promise<{ sent: number; failed: number; retrying: number }> {
  if (!supabaseConfigured()) return { sent: 0, failed: 0, retrying: 0 };
  const db = supabaseAdmin();
  const due = await db
    .from("postback_queue")
    .select("id,order_id,order_number,source,endpoint_url,payload,attempts")
    .in("status", ["pending", "retrying"])
    .lte("next_attempt_at", new Date().toISOString())
    .order("next_attempt_at", { ascending: true })
    .limit(limit);
  if (due.error) throw new Error(due.error.message);

  let sent = 0;
  let failed = 0;
  let retrying = 0;
  for (const row of (due.data ?? []) as QueueRow[]) {
    const attempts = row.attempts + 1;
    let result: { ok: boolean; status: number; body: string };
    try {
      result = await postConversion(row.endpoint_url, row.payload);
    } catch (e) {
      result = { ok: false, status: 0, body: e instanceof Error ? e.message : String(e) };
    }
    if (result.ok) {
      sent++;
      await db.from("postback_queue").update({ status: "sent", attempts, sent_at: new Date().toISOString(), response_body: result.body, last_error: null, updated_at: new Date().toISOString() }).eq("id", row.id);
      continue;
    }
    const wait = BACKOFF_MINUTES[attempts - 1];
    const giveUp = wait === undefined;
    if (giveUp) failed++;
    else retrying++;
    await db
      .from("postback_queue")
      .update({
        status: giveUp ? "failed" : "retrying",
        attempts,
        next_attempt_at: giveUp ? new Date().toISOString() : new Date(Date.now() + wait * 60_000).toISOString(),
        last_error: `HTTP ${result.status}: ${result.body.slice(0, 400)}`,
        response_body: result.body,
        updated_at: new Date().toISOString(),
      })
      .eq("id", row.id);
  }
  return { sent, failed, retrying };
}

/** Skickar om en konvertering manuellt: nollställer försöken och kör den direkt. */
export async function retryPostback(id: string): Promise<{ ok: boolean; error?: string }> {
  const db = supabaseAdmin();
  const row = (await db.from("postback_queue").select("id,order_id,order_number,source,endpoint_url,payload,attempts").eq("id", id).maybeSingle()).data as QueueRow | null;
  if (!row) return { ok: false, error: "Konverteringen finns inte." };
  try {
    const result = await postConversion(row.endpoint_url, row.payload);
    await db
      .from("postback_queue")
      .update({
        status: result.ok ? "sent" : "retrying",
        attempts: row.attempts + 1,
        sent_at: result.ok ? new Date().toISOString() : null,
        next_attempt_at: result.ok ? new Date().toISOString() : new Date(Date.now() + 60_000).toISOString(),
        last_error: result.ok ? null : `HTTP ${result.status}: ${result.body.slice(0, 400)}`,
        response_body: result.body,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);
    return result.ok ? { ok: true } : { ok: false, error: `HTTP ${result.status}: ${result.body.slice(0, 200)}` };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Kunde inte skicka." };
  }
}

/* ------------------------------- provisionen ------------------------------- */

/** En transaktion som AddRevenue returnerar. Fältnamnen följer deras API-dokumentation. */
type Transaction = {
  id?: string | number;
  orderId?: string;
  orderNumber?: string;
  reference?: string;
  eventId?: string;
  commissionAmount?: number | string;
  commission?: number | string;
  brokerageFee?: number | string;
  originalBrokerageFee?: number | string;
  currency?: string;
  status?: string;
  channelId?: string | number;
};

/** Ordernumret kan ligga i olika fält beroende på hur konverteringen skapades. */
const orderRef = (t: Transaction): string => String(t.orderId ?? t.orderNumber ?? t.reference ?? t.eventId ?? "").trim();

const num = (v: unknown): number | null => {
  if (v === null || v === undefined || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

/**
 * Hämtar provision och förmedlingsavgift per order från AddRevenues API och skriver in
 * dem på ordern, både i ordervalutan och omräknat till SEK med orderns sparade kurs.
 * Här krävs Bearer-token, till skillnad från trackern.
 */
export async function syncCommissions(o: { days?: number } = {}): Promise<{ checked: number; updated: number; error?: string }> {
  if (!supabaseConfigured()) return { checked: 0, updated: 0 };
  const token = process.env.ADDREVENUE_API_TOKEN;
  if (!token) return { checked: 0, updated: 0, error: "ADDREVENUE_API_TOKEN saknas." };
  const settings = await getSettings();
  if (!settings.enabled) return { checked: 0, updated: 0 };
  const db = supabaseAdmin();

  const since = new Date(Date.now() - (o.days ?? 45) * 864e5);
  const orders = await db
    .from("orders")
    .select("id,order_number,currency,exchange_rate_to_sek,affiliate_commission_synced_at")
    .not("affiliate_click_id", "is", null)
    .gte("created_at", since.toISOString());
  if (orders.error) throw new Error(orders.error.message);
  const rows = (orders.data ?? []) as { id: string; order_number: string; currency: string; exchange_rate_to_sek: number | null }[];
  if (!rows.length) return { checked: 0, updated: 0 };

  const url = new URL(`${settings.apiBaseUrl.replace(/\/$/, "")}/transactions`);
  url.searchParams.set("advertiserId", settings.advertiserId);
  url.searchParams.set("fromDate", since.toISOString().slice(0, 10));
  url.searchParams.set("toDate", new Date(Date.now() + 864e5).toISOString().slice(0, 10));
  let list: Transaction[] = [];
  try {
    const res = await fetch(url.toString(), { headers: { authorization: `Bearer ${token}`, accept: "application/json" } });
    const text = await res.text();
    if (!res.ok) return { checked: rows.length, updated: 0, error: `AddRevenue: HTTP ${res.status} ${text.slice(0, 200)}` };
    const parsed = JSON.parse(text) as unknown;
    list = Array.isArray(parsed)
      ? (parsed as Transaction[])
      : (((parsed as { results?: Transaction[]; data?: Transaction[] }).results ?? (parsed as { data?: Transaction[] }).data ?? []) as Transaction[]);
  } catch (e) {
    return { checked: rows.length, updated: 0, error: e instanceof Error ? e.message : "Kunde inte läsa provisioner." };
  }

  const byOrder = new Map<string, Transaction>();
  for (const t of list) {
    const key = orderRef(t);
    // Nekade transaktioner ska inte skrivas in som provision
    if (key && t.status !== "denied") byOrder.set(key, t);
  }

  let updated = 0;
  for (const order of rows) {
    const c = byOrder.get(order.order_number);
    if (!c) continue;
    const commission = num(c.commissionAmount ?? c.commission);
    const brokerage = num(c.brokerageFee ?? c.originalBrokerageFee);
    if (commission === null && brokerage === null) continue;
    const rate = Number(order.exchange_rate_to_sek ?? 1) || 1;
    const res = await db
      .from("orders")
      .update({
        affiliate_commission: commission,
        affiliate_commission_currency: (c.currency ?? order.currency ?? "SEK").toUpperCase(),
        affiliate_commission_sek: commission === null ? null : Math.round(commission * rate * 100) / 100,
        affiliate_brokerage_fee: brokerage,
        affiliate_brokerage_fee_sek: brokerage === null ? null : Math.round(brokerage * rate * 100) / 100,
        affiliate_commission_synced_at: new Date().toISOString(),
      })
      .eq("id", order.id);
    if (!res.error) updated++;
  }
  return { checked: rows.length, updated };
}

/* --------------------------------- städning -------------------------------- */

/** Tar bort klickspårning som passerat attributionsfönstret. */
export async function purgeExpiredClicks(): Promise<number> {
  if (!supabaseConfigured()) return 0;
  const res = await supabaseAdmin().from("visitor_tracking").delete().lt("expires_at", new Date().toISOString()).select("id");
  if (res.error) throw new Error(res.error.message);
  return res.data?.length ?? 0;
}

/**
 * Testar kopplingen mot AddRevenues API och rapporterar hur svaret ser ut.
 * Fältnamnen i konverteringssvaret avgör hur provisionen läses in, så det här är
 * sättet att se att vi läser rätt fält innan den första riktiga ordern kommer.
 */
export async function testConnection(path = "transactions"): Promise<{
  ok: boolean;
  status: number;
  count: number;
  fields: string[];
  matchesExpected: boolean;
  sample: Record<string, unknown> | null;
  url?: string;
  error?: string;
}> {
  const token = process.env.ADDREVENUE_API_TOKEN;
  if (!token) return { ok: false, status: 0, count: 0, fields: [], matchesExpected: false, sample: null, error: "ADDREVENUE_API_TOKEN saknas." };
  const settings = await getSettings();
  const url = new URL(`${settings.apiBaseUrl.replace(/\/$/, "")}/${path.replace(/^\//, "")}`);
  url.searchParams.set("advertiserId", settings.advertiserId);
  url.searchParams.set("fromDate", new Date(Date.now() - 90 * 864e5).toISOString().slice(0, 10));
  url.searchParams.set("toDate", new Date(Date.now() + 864e5).toISOString().slice(0, 10));
  try {
    const res = await fetch(url.toString(), { headers: { authorization: `Bearer ${token}`, accept: "application/json" } });
    const text = await res.text();
    if (!res.ok) return { ok: false, status: res.status, count: 0, fields: [], matchesExpected: false, sample: null, url: url.toString(), error: text.slice(0, 300) };
    const parsed = JSON.parse(text) as unknown;
    const list = Array.isArray(parsed)
      ? (parsed as Record<string, unknown>[])
      : (((parsed as { results?: unknown[]; data?: unknown[] }).results ?? (parsed as { data?: unknown[] }).data ?? []) as Record<string, unknown>[]);
    const first = list[0] ?? null;
    const fields = first ? Object.keys(first) : Object.keys((parsed ?? {}) as Record<string, unknown>);
    // Hittar vi ordernumret och provisionen med våra namn läser vi rätt fält
    const has = (names: string[]) => names.some((n) => fields.includes(n));
    const matchesExpected = Boolean(first) && has(["orderId", "orderNumber", "reference", "eventId"]) && has(["commissionAmount", "commission"]);
    return { ok: true, status: res.status, count: list.length, fields, matchesExpected, sample: first, url: url.toString() };
  } catch (e) {
    return { ok: false, status: 0, count: 0, fields: [], matchesExpected: false, sample: null, error: e instanceof Error ? e.message : String(e) };
  }
}
