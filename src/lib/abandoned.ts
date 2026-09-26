import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import type Stripe from "stripe";
import type { PricedLine } from "./checkout";
import { sendAbandonedCartEmail } from "./email";
import { publicBase } from "./media";
import { routes } from "./routes";
import { stripe, stripeConfigured } from "./stripe";
import { supabaseAdmin, supabaseConfigured } from "./supabase";

/**
 * Övergivna korgar och påminnelser.
 *
 * Korgen sparas i samma stund som kunden trycker "Till betalning" i vår kassa (då har vi
 * e-posten), inte först när Stripes betalsida gått ut. Fyra påminnelser skickas räknat från
 * det ögonblicket: 3 h, 24 h, 3 dagar och 10 dagar. Serien stoppas när kunden köper
 * (markRecovered), när admin stoppar den, eller när kunden avregistrerar sig.
 * Från och med andra mejlet följer en rabattkod med, som läggs på automatiskt via länken.
 */

type CartMeta = { k: "product" | "bundle"; s: string; q: number; p: "once" | "sub"; i: number | null };

export type CartItem = { kind: "product" | "bundle"; slug: string; qty: number; plan: "once" | "sub"; intervalDays: number | null; name: string; lineTotal: number };

export type AbandonedCart = {
  id: string;
  cart_token: string;
  email: string;
  first_name: string | null;
  items: CartItem[];
  subtotal: number;
  status: string;
  recovery_url: string | null;
  source: string;
  reminders_sent: number;
  next_reminder_at: string | null;
  reminder_1_sent_at: string | null;
  reminder_2_sent_at: string | null;
  reminder_3_sent_at: string | null;
  reminder_4_sent_at: string | null;
  discount_code: string | null;
  last_error: string | null;
  recovered_at: string | null;
  recovered_order_id: string | null;
  created_at: string;
};

/** Timmar efter att korgen övergavs som respektive påminnelse går ut. */
export const REMINDER_HOURS = [3, 24, 72, 240] as const;
export const REMINDER_COUNT = REMINDER_HOURS.length;
/** Från och med det här steget följer rabattkoden med. */
export const DISCOUNT_FROM_STEP = 2;

export const discountCode = () => (process.env.ABANDONED_DISCOUNT_CODE ?? "KORG10").trim().toUpperCase();
export const discountPercent = () => Math.min(50, Math.max(1, Math.round(Number(process.env.ABANDONED_DISCOUNT_PERCENT ?? 10) || 10)));

const reminderAt = (createdAt: string, step: number) => new Date(new Date(createdAt).getTime() + REMINDER_HOURS[step - 1]! * 3600_000).toISOString();

/** Återställningslänk till vår egen kassa: korgen fylls på igen, och rabattkoden läggs på från steg två. */
export const recoveryUrl = (cartId: string, withCode: boolean) =>
  `${publicBase()}${routes.checkout}?korg=${cartId}${withCode ? `&kod=${encodeURIComponent(discountCode())}` : ""}`;

/* ------------------------------------------------------------------------------------------ */
/* Avregistrering                                                                             */
/* ------------------------------------------------------------------------------------------ */

const secret = () => process.env.CRON_SECRET || process.env.STRIPE_WEBHOOK_SECRET || process.env.SUPABASE_SECRET_KEY || "metilde";
export const unsubscribeToken = (cartId: string) => createHmac("sha256", secret()).update(`unsub:${cartId}`).digest("hex").slice(0, 32);
export const unsubscribeUrl = (cartId: string) => `${publicBase()}/api/unsubscribe?c=${cartId}&t=${unsubscribeToken(cartId)}`;

export async function unsubscribeFromCart(cartId: string, token: string): Promise<boolean> {
  const expected = Buffer.from(unsubscribeToken(cartId));
  const given = Buffer.from(token);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return false;
  if (!supabaseConfigured()) return false;
  const db = supabaseAdmin();
  const cart = (await db.from("abandoned_carts").select("email").eq("id", cartId).maybeSingle()).data as { email: string } | null;
  if (!cart) return false;
  await db.from("email_optouts").upsert({ email: cart.email.toLowerCase(), reason: "abandoned_cart" }, { onConflict: "email" });
  await db.from("abandoned_carts").update({ status: "unsubscribed", unsubscribed_at: new Date().toISOString(), next_reminder_at: null }).eq("email", cart.email).eq("status", "open");
  return true;
}

async function isOptedOut(email: string): Promise<boolean> {
  const r = await supabaseAdmin().from("email_optouts").select("email").eq("email", email.toLowerCase()).maybeSingle();
  return Boolean(r.data);
}

/* ------------------------------------------------------------------------------------------ */
/* Spara korgen                                                                               */
/* ------------------------------------------------------------------------------------------ */

const itemsFromPriced = (priced: PricedLine[]): CartItem[] =>
  priced.map((l) => ({ kind: l.kind, slug: l.slug, qty: l.qty, plan: l.plan, intervalDays: l.plan === "sub" ? (l.intervalDays ?? 30) : null, name: l.name, lineTotal: l.unitPrice * l.qty }));

/**
 * Sparas när kunden trycker "Till betalning". Äldre öppna korgar för samma adress ersätts,
 * så att bara en påminnelseserie pågår per kund. Returnerar korgens id.
 */
export async function recordCheckoutStart(o: { sessionId: string; email: string; priced: PricedLine[]; subtotal: number; kind?: "cart" | "giftcard" }): Promise<string | null> {
  if (!supabaseConfigured()) return null;
  const db = supabaseAdmin();
  const email = o.email.toLowerCase();
  await db.from("abandoned_carts").update({ status: "superseded", next_reminder_at: null }).eq("email", email).eq("status", "open");
  const createdAt = new Date().toISOString();
  const optedOut = await isOptedOut(email);
  const res = await db
    .from("abandoned_carts")
    .upsert(
      {
        cart_token: o.sessionId,
        email,
        locale: "sv",
        currency: "SEK",
        items: itemsFromPriced(o.priced),
        subtotal: o.subtotal,
        status: optedOut ? "unsubscribed" : "open",
        source: o.kind === "giftcard" ? "giftcard" : "checkout",
        discount_code: discountCode(),
        reminders_sent: 0,
        next_reminder_at: optedOut ? null : reminderAt(createdAt, 1),
        last_activity_at: createdAt,
      },
      { onConflict: "cart_token" },
    )
    .select("id")
    .single();
  if (res.error) {
    console.error("[korg]", res.error.message);
    return null;
  }
  const id = res.data.id as string;
  await db.from("abandoned_carts").update({ recovery_url: recoveryUrl(id, false) }).eq("id", id);
  return id;
}

/**
 * Stripes checkout.session.expired: korgen finns oftast redan (sparad i vår kassa). Annars
 * skapas den nu, med e-posten kunden skrev hos Stripe, och första påminnelsen går direkt
 * eftersom sessionen redan är ett dygn gammal.
 */
export async function saveAbandonedCart(session: Stripe.Checkout.Session): Promise<boolean> {
  if (!supabaseConfigured()) return false;
  const db = supabaseAdmin();
  const existing = (await db.from("abandoned_carts").select("id,status,email").eq("cart_token", session.id).maybeSingle()).data as { id: string; status: string; email: string } | null;
  if (existing) {
    await db.from("abandoned_carts").update({ last_activity_at: new Date().toISOString() }).eq("id", existing.id);
    return true;
  }
  const email = session.customer_details?.email?.toLowerCase() ?? session.customer_email?.toLowerCase() ?? null;
  if (!email) return false; // utan e-post finns inget att följa upp

  let meta: CartMeta[] = [];
  try {
    meta = JSON.parse(session.metadata?.cart ?? "[]") as CartMeta[];
  } catch {
    meta = [];
  }
  const lines = session.line_items?.data ?? [];
  const items: CartItem[] = meta.map((m, i) => ({
    kind: m.k,
    slug: m.s,
    qty: m.q,
    plan: m.p,
    intervalDays: m.i,
    name: lines[i]?.description ?? m.s,
    lineTotal: (lines[i]?.amount_total ?? 0) / 100,
  }));
  // Köpte kunden efter att sessionen skapades (i en annan session) finns inget att påminna om
  const bought = await db.from("orders").select("id").ilike("email", email).gte("created_at", new Date(session.created * 1000).toISOString()).limit(1).maybeSingle();
  const optedOut = await isOptedOut(email);
  const createdAt = new Date(session.created * 1000).toISOString();
  await db.from("abandoned_carts").update({ status: "superseded", next_reminder_at: null }).eq("email", email).eq("status", "open");
  const res = await db
    .from("abandoned_carts")
    .insert({
      cart_token: session.id,
      email,
      first_name: session.customer_details?.name?.split(" ")[0] ?? null,
      locale: "sv",
      currency: (session.currency ?? "sek").toUpperCase(),
      items,
      subtotal: (session.amount_subtotal ?? 0) / 100,
      status: bought.data ? "recovered" : optedOut ? "unsubscribed" : "open",
      recovered_order_id: bought.data?.id ?? null,
      recovered_at: bought.data ? new Date().toISOString() : null,
      source: session.metadata?.kind === "giftcard" ? "giftcard" : "stripe",
      discount_code: discountCode(),
      reminders_sent: 0,
      next_reminder_at: bought.data || optedOut ? null : new Date().toISOString(),
      created_at: createdAt,
      last_activity_at: new Date((session.expires_at ?? Math.floor(Date.now() / 1000)) * 1000).toISOString(),
    })
    .select("id")
    .single();
  if (res.error) throw new Error(res.error.message);
  await db.from("abandoned_carts").update({ recovery_url: recoveryUrl(res.data.id as string, false) }).eq("id", res.data.id as string);
  return true;
}

/** När en kund med öppen övergiven korg handlar markeras korgen som återvunnen och serien stoppas. */
export async function markRecovered(email: string | null, orderId: string) {
  if (!email || !supabaseConfigured()) return;
  await supabaseAdmin()
    .from("abandoned_carts")
    .update({ status: "recovered", recovered_at: new Date().toISOString(), recovered_order_id: orderId, next_reminder_at: null })
    .eq("email", email.toLowerCase())
    .eq("status", "open");
}

/** Korgens rader för återställning i kassan. Id:t är en uuid och fungerar som nyckel. */
export async function getCartLines(cartId: string): Promise<{ lines: { kind: "product" | "bundle"; slug: string; qty: number; plan: "once" | "sub"; intervalDays: number | null }[]; email: string } | null> {
  if (!supabaseConfigured() || !/^[0-9a-f-]{36}$/i.test(cartId)) return null;
  const r = (await supabaseAdmin().from("abandoned_carts").select("items,email,source").eq("id", cartId).maybeSingle()).data as { items: CartItem[]; email: string; source: string } | null;
  if (!r || r.source === "giftcard") return null;
  return { email: r.email, lines: (r.items ?? []).map((i) => ({ kind: i.kind, slug: i.slug, qty: i.qty, plan: i.plan, intervalDays: i.intervalDays })) };
}

/* ------------------------------------------------------------------------------------------ */
/* Påminnelser                                                                                */
/* ------------------------------------------------------------------------------------------ */

async function boughtSince(email: string, sinceIso: string): Promise<string | null> {
  const r = await supabaseAdmin().from("orders").select("id,status").ilike("email", email).gte("created_at", sinceIso).not("status", "in", "(cancelled,refunded)").order("created_at", { ascending: false }).limit(1).maybeSingle();
  return (r.data?.id as string | undefined) ?? null;
}

/** Skickar nästa påminnelse för en korg. Kontrollerar först att kunden inte köpt eller avsagt sig. */
export async function sendReminder(cart: AbandonedCart, o: { force?: boolean } = {}): Promise<{ sent: boolean; reason?: string }> {
  const db = supabaseAdmin();
  const step = cart.reminders_sent + 1;
  if (cart.status !== "open") return { sent: false, reason: `Korgen är ${cart.status}.` };
  if (step > REMINDER_COUNT) return { sent: false, reason: "Alla påminnelser är skickade." };
  const orderId = await boughtSince(cart.email, cart.created_at);
  if (orderId) {
    await db.from("abandoned_carts").update({ status: "recovered", recovered_at: new Date().toISOString(), recovered_order_id: orderId, next_reminder_at: null }).eq("id", cart.id);
    return { sent: false, reason: "Kunden har redan köpt – korgen markerad som återvunnen." };
  }
  if (await isOptedOut(cart.email)) {
    await db.from("abandoned_carts").update({ status: "unsubscribed", next_reminder_at: null }).eq("id", cart.id);
    return { sent: false, reason: "Adressen har avsagt sig påminnelser." };
  }
  const withCode = step >= DISCOUNT_FROM_STEP;
  try {
    await sendAbandonedCartEmail({
      to: cart.email,
      firstName: cart.first_name,
      step,
      items: cart.items,
      subtotal: Number(cart.subtotal),
      recoveryUrl: recoveryUrl(cart.id, withCode),
      unsubscribeUrl: unsubscribeUrl(cart.id),
      code: withCode ? cart.discount_code ?? discountCode() : null,
      percent: discountPercent(),
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    // Försök igen om en timme, men räkna inte upp steget
    await db.from("abandoned_carts").update({ last_error: msg, next_reminder_at: new Date(Date.now() + 3600_000).toISOString() }).eq("id", cart.id);
    return { sent: false, reason: `Mejlet kunde inte skickas: ${msg}` };
  }
  const now = new Date().toISOString();
  const nextStep = step + 1;
  // Nästa tid räknas från när korgen övergavs; har den redan passerat (t.ex. manuellt utskick) blir det om en timme
  const scheduled = nextStep <= REMINDER_COUNT ? reminderAt(cart.created_at, nextStep) : null;
  const next = scheduled && new Date(scheduled) < new Date() ? new Date(Date.now() + 3600_000).toISOString() : scheduled;
  await db
    .from("abandoned_carts")
    .update({ reminders_sent: step, [`reminder_${step}_sent_at`]: now, next_reminder_at: o.force ? next : next, last_error: null, last_activity_at: now })
    .eq("id", cart.id);
  return { sent: true };
}

/** Cron: skickar alla påminnelser vars tid är inne. */
export async function sendDueReminders(limit = 50): Promise<{ sent: number; skipped: number; failed: number }> {
  const result = { sent: 0, skipped: 0, failed: 0 };
  if (!supabaseConfigured()) return result;
  const due = ((await supabaseAdmin().from("abandoned_carts").select("*").eq("status", "open").lte("next_reminder_at", new Date().toISOString()).lt("reminders_sent", REMINDER_COUNT).order("next_reminder_at", { ascending: true }).limit(limit)).data ?? []) as AbandonedCart[];
  for (const cart of due) {
    const r = await sendReminder(cart);
    if (r.sent) result.sent++;
    else if (r.reason?.startsWith("Mejlet kunde inte")) result.failed++;
    else result.skipped++;
  }
  return result;
}

export async function sendReminderNow(cartId: string): Promise<{ ok: boolean; message: string }> {
  const cart = (await supabaseAdmin().from("abandoned_carts").select("*").eq("id", cartId).maybeSingle()).data as AbandonedCart | null;
  if (!cart) return { ok: false, message: "Korgen finns inte." };
  const r = await sendReminder(cart, { force: true });
  return r.sent ? { ok: true, message: `Påminnelse ${cart.reminders_sent + 1} skickad till ${cart.email}.` } : { ok: false, message: r.reason ?? "Skickades inte." };
}

export async function stopReminders(cartId: string): Promise<void> {
  await supabaseAdmin().from("abandoned_carts").update({ status: "handled", next_reminder_at: null }).eq("id", cartId).eq("status", "open");
}

/* ------------------------------------------------------------------------------------------ */
/* Rabattkoden i Stripe                                                                       */
/* ------------------------------------------------------------------------------------------ */

export type DiscountStatus = { code: string; percent: number; exists: boolean; active: boolean; promotionCodeId: string | null; timesRedeemed: number };

/** Letar upp rabattkoden i Stripe (aktiv promotion code med exakt den koden). */
export async function findDiscount(): Promise<DiscountStatus> {
  const code = discountCode();
  const base: DiscountStatus = { code, percent: discountPercent(), exists: false, active: false, promotionCodeId: null, timesRedeemed: 0 };
  if (!stripeConfigured()) return base;
  const list = await stripe().promotionCodes.list({ code, limit: 5, expand: ["data.promotion.coupon"] });
  const pc = list.data.find((p) => p.active) ?? list.data[0];
  if (!pc) return base;
  const raw = pc.promotion?.coupon;
  const coupon = raw && typeof raw === "object" ? raw : null;
  return { ...base, exists: true, active: pc.active && Boolean(coupon?.valid), promotionCodeId: pc.id, timesRedeemed: pc.times_redeemed, percent: coupon?.percent_off ?? base.percent };
}

/** Skapar kupongen och koden i Stripe om de saknas: procent på hela ordern, en gång per kund. */
export async function ensureDiscount(): Promise<DiscountStatus> {
  const found = await findDiscount();
  if (found.exists && found.active) return found;
  const code = discountCode();
  const coupon = await stripe().coupons.create({ name: `Övergiven korg ${discountPercent()} %`, percent_off: discountPercent(), duration: "once" });
  await stripe().promotionCodes.create({ promotion: { type: "coupon", coupon: coupon.id }, code, active: true, metadata: { purpose: "abandoned_cart" } });
  return findDiscount();
}

/**
 * Provar koden på riktigt: skapar en Checkout-session med rabatten på den billigaste
 * aktiva produkten, läser av avdraget och låter sessionen gå ut direkt. Ingen betalning sker.
 */
export async function testDiscount(): Promise<{ ok: boolean; message: string }> {
  const d = await findDiscount();
  if (!d.exists || !d.promotionCodeId) return { ok: false, message: `Koden ${d.code} finns inte i Stripe. Tryck "Skapa koden i Stripe" först.` };
  if (!d.active) return { ok: false, message: `Koden ${d.code} finns men är inaktiv i Stripe.` };
  const { getCatalog } = await import("./catalog");
  const product = (await getCatalog()).products.filter((p) => p.isActive && p.price > 0).sort((a, b) => a.price - b.price)[0];
  if (!product) return { ok: false, message: "Ingen aktiv produkt att prova på." };
  const origin = publicBase();
  const session = await stripe().checkout.sessions.create({
    mode: "payment",
    locale: "sv",
    line_items: [{ quantity: 1, price_data: { currency: "sek", unit_amount: Math.round(product.price * 100), tax_behavior: "inclusive", product_data: { name: `Test av rabattkod – ${product.name}` } } }],
    discounts: [{ promotion_code: d.promotionCodeId }],
    success_url: `${origin}/sv/tack?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}${routes.checkout}`,
    metadata: { kind: "discount_test" },
  });
  const discount = (session.total_details?.amount_discount ?? 0) / 100;
  const expected = Math.round(product.price * d.percent) / 100;
  await stripe().checkout.sessions.expire(session.id).catch(() => undefined);
  if (discount <= 0) return { ok: false, message: `Sessionen skapades men avdraget blev 0 kr. Kontrollera kupongen i Stripe.` };
  return { ok: true, message: `Koden fungerar: ${product.name} ${product.price} kr → ${discount} kr avdrag (${d.percent} %, väntat ${expected} kr). Testsessionen är stängd.` };
}

/** Slår upp en kod som kunden kommit med via länk, så att den kan läggas på i kassan. Okänd kod ignoreras tyst. */
export async function promotionCodeId(code: string | null | undefined): Promise<string | null> {
  const c = (code ?? "").trim().toUpperCase();
  if (!c || !stripeConfigured()) return null;
  const list = await stripe().promotionCodes.list({ code: c, active: true, limit: 1 }).catch(() => null);
  return list?.data[0]?.id ?? null;
}
