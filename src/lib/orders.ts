import "server-only";
import type Stripe from "stripe";
import { getBundle, getProduct } from "./catalog";
import { stripe } from "./stripe";
import { supabaseAdmin, supabaseConfigured } from "./supabase";
import { sendOrderConfirmation } from "./email";
import { issueGiftCard } from "./giftcards";
import { markRecovered } from "./abandoned";
import { AFFILIATE_SOURCE, enqueuePostback, type AffiliateOrder } from "./affiliate";
import { rateToSek } from "./exchange";
import { sendMetaEvents } from "./meta";
import { metaContentId } from "./consent";
import { pushOrderToPlocky } from "./plocky";

export type OrderRecord = {
  id: string;
  order_number: string;
  email: string | null;
  status: string;
  currency: string;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  has_subscription: boolean;
  shipping_name: string | null;
  shipping_address: string | null;
  shipping_postal_code: string | null;
  shipping_city: string | null;
  shipping_country: string | null;
  shipping_method: string | null;
  kind: string;
  created_at: string;
  phone?: string | null;
  /** Planerad leverans och när en planerad förnyelseorder släpps till packning. */
  deliver_at?: string | null;
  release_at?: string | null;
  /** Affiliate: klicket som ledde till köpet, fryst i kassan. */
  affiliate_source?: string | null;
  affiliate_click_id?: string | null;
  affiliate_click_ref?: string | null;
};

/** Dagar från att Stripe bekräftat förnyelsebetalningen till planerad leverans, och hur många dagar före leverans ordern släpps. */
export const RENEWAL_DELIVERY_LEAD_DAYS = 8;
export const RENEWAL_RELEASE_DAYS_BEFORE = 4;
export const intervalDaysOf = (plan: string | null | undefined): number | null => {
  const m = String(plan ?? "").match(/^sub:(\d+)/);
  return m ? Number(m[1]) : null;
};

export type OrderItemRecord = {
  product_slug: string;
  name: string;
  qty: number;
  plan: string;
  unit_price: number;
  line_total: number;
};

type CartMeta = { k: "product" | "bundle"; s: string; q: number; p: "once" | "sub"; i: number | null };

/** Meta-katalogens id per korgrad (artikelnummer i första hand). */
export const metaIdsFor = (meta: Pick<CartMeta, "k" | "s">[]): Promise<string[]> =>
  Promise.all(meta.map(async (m) => (m.k === "bundle" ? metaContentId("bundle", m.s, (await getBundle(m.s))?.sku) : metaContentId("product", m.s, (await getProduct(m.s))?.sku))));

// Både vanliga (sk_live_) och begränsade (rk_live_) nycklar räknas som live
const environment = () => (process.env.STRIPE_SECRET_KEY?.includes("_live_") ? "live" : "sandbox");
const kr = (öre: number | null | undefined) => Math.round(öre ?? 0) / 100;

const parseCart = (raw: string | undefined): CartMeta[] => {
  try {
    const v = raw ? (JSON.parse(raw) as unknown) : [];
    return Array.isArray(v) ? (v as CartMeta[]) : [];
  } catch {
    return [];
  }
};

/** Minskar lagersaldot för produkter och paketens ingående produkter. */
async function decrementStock(items: OrderItemRecord[], meta: CartMeta[]) {
  const db = supabaseAdmin();
  for (const item of items) {
    const m = meta.find((x) => x.s === item.product_slug);
    if (m?.k === "bundle") {
      const bundle = await getBundle(item.product_slug);
      for (const c of bundle?.items ?? []) {
        await db.rpc("decrement_stock", { _slug: c.product.slug, _qty: c.qty * item.qty });
      }
    } else if (await getProduct(item.product_slug)) {
      await db.rpc("decrement_stock", { _slug: item.product_slug, _qty: item.qty });
    }
  }
}

/**
 * Sparar en betald Checkout-session som order. Idempotent: samma session ger samma order.
 * Anropas både från webhooken och från tacksidan, så att ordern finns även om webhooken dröjer.
 */
export async function saveOrderFromSession(sessionId: string): Promise<{ order: OrderRecord; items: OrderItemRecord[]; created: boolean } | null> {
  if (!supabaseConfigured()) return null;
  const db = supabaseAdmin();

  const existing = await db.from("orders").select("*").eq("stripe_session_id", sessionId).maybeSingle();
  if (existing.data) {
    const items = await db.from("order_items").select("product_slug,name,qty,plan,unit_price,line_total").eq("order_id", existing.data.id);
    return { order: existing.data as OrderRecord, items: (items.data ?? []) as OrderItemRecord[], created: false };
  }

  const session = await stripe().checkout.sessions.retrieve(sessionId, { expand: ["line_items", "subscription", "payment_intent", "shipping_cost.shipping_rate"] });
  const paid = session.payment_status === "paid" || session.status === "complete";
  if (!paid) return null;

  const isGiftCard = session.metadata?.kind === "giftcard";
  const meta = isGiftCard
    ? [{ k: "product" as const, s: "presentkort", q: 1, p: "once" as const, i: null }]
    : parseCart(session.metadata?.cart);
  const lines = session.line_items?.data ?? [];
  const isSub = session.mode === "subscription";
  const customer = session.customer_details;
  const shippingDetails = session.collected_information?.shipping_details ?? null;
  const addr = shippingDetails?.address ?? customer?.address ?? null;

  const items: OrderItemRecord[] = [];
  let shippingLine = 0;
  lines.forEach((li, idx) => {
    const m = meta[idx];
    const name = li.description ?? "";
    if (!m) {
      // Fraktraden i subscription-läget ligger sist utan motsvarighet i korgen
      if (name.startsWith("Frakt")) shippingLine += kr(li.amount_total);
      return;
    }
    const qty = li.quantity ?? m.q;
    items.push({
      product_slug: m.s,
      name: name.replace(/ – prenumeration var \d+:e dag$/, ""),
      qty,
      plan: m.p === "sub" ? `sub:${m.i ?? 30}` : "once",
      unit_price: kr(li.amount_subtotal) / qty,
      line_total: kr(li.amount_total),
    });
  });

  const shipping = session.shipping_cost ? kr(session.shipping_cost.amount_total) : shippingLine;
  const subtotal = items.reduce((s, i) => s + i.line_total, 0);
  const discount = kr(session.total_details?.amount_discount);
  const subscription = typeof session.subscription === "object" ? session.subscription : null;
  const paymentIntent = typeof session.payment_intent === "object" ? session.payment_intent : null;
  const shippingRate = session.shipping_cost?.shipping_rate;
  const shippingMethod =
    (typeof shippingRate === "object" && shippingRate ? shippingRate.display_name : null) ?? (isSub ? "Fri frakt – spårbart brev" : null);

  const inserted = await db
    .from("orders")
    .insert({
      email: customer?.email ?? null,
      phone: customer?.phone ?? null,
      status: "paid",
      currency: (session.currency ?? "sek").toUpperCase(),
      subtotal,
      discount,
      shipping,
      total: kr(session.amount_total),
      has_subscription: isSub,
      shipping_name: shippingDetails?.name ?? customer?.name ?? null,
      shipping_address: [addr?.line1, addr?.line2].filter(Boolean).join(", ") || null,
      shipping_postal_code: addr?.postal_code ?? null,
      shipping_city: addr?.city ?? null,
      shipping_country: addr?.country ?? null,
      shipping_method: shippingMethod,
      stripe_session_id: session.id,
      stripe_payment_intent: paymentIntent?.id ?? (typeof session.payment_intent === "string" ? session.payment_intent : null),
      stripe_customer_id: typeof session.customer === "string" ? session.customer : (session.customer?.id ?? null),
      stripe_subscription_id: subscription?.id ?? null,
      environment: environment(),
      kind: isGiftCard ? "giftcard" : "checkout",
      locale: "sv",
      discount_code: session.discounts?.[0]?.promotion_code ? String(session.discounts[0].promotion_code) : null,
      // Affiliateklicket frystes i kassan; kursen sparas så att provisionen kan räknas om senare
      affiliate_source: session.metadata?.aff_click ? (session.metadata?.aff_src || AFFILIATE_SOURCE) : null,
      affiliate_click_id: session.metadata?.aff_click || null,
      affiliate_click_ref: session.metadata?.aff_ref || null,
      exchange_rate_to_sek: await rateToSek(session.currency ?? "sek"),
    })
    .select("*")
    .single();

  if (inserted.error) {
    // Kapplöpning: webhook och tacksida samtidigt – den andra hittar ordern nu
    if (inserted.error.code === "23505") return saveOrderFromSession(sessionId);
    throw new Error(inserted.error.message);
  }
  const order = inserted.data as OrderRecord;

  if (items.length) {
    const rows = items.map((i) => ({ ...i, order_id: order.id }));
    const res = await db.from("order_items").insert(rows);
    if (res.error) throw new Error(res.error.message);
  }

  if (subscription) {
    const firstSub = items.find((i) => i.plan.startsWith("sub"));
    await db.from("subscriptions").upsert(
      {
        stripe_subscription_id: subscription.id,
        stripe_customer_id: typeof subscription.customer === "string" ? subscription.customer : subscription.customer.id,
        product_slug: firstSub?.product_slug ?? null,
        status: subscription.status,
        quantity: firstSub?.qty ?? 1,
        amount: firstSub ? firstSub.unit_price : null,
        currency: (subscription.currency ?? "sek").toUpperCase(),
        current_period_start: periodStart(subscription),
        current_period_end: periodEnd(subscription),
        next_shipment_at: periodEnd(subscription),
        interval_days: intervalDaysOf(firstSub?.plan) ?? subscription.items.data[0]?.price.recurring?.interval_count ?? null,
        cancel_at_period_end: subscription.cancel_at_period_end,
        environment: environment(),
        email: customer?.email ?? null,
      },
      { onConflict: "stripe_subscription_id" },
    );
  }

  await decrementStock(items, meta);
  await markRecovered(order.email, order.id).catch(() => undefined);
  // Till lagret (Plocky) – köas och skickas direkt; misslyckas det tar cron-jobbet vid
  await pushOrderToPlocky(order);
  // Affiliatekonvertering: köas här, skickas av cron-jobbet
  await enqueuePostback(order as unknown as AffiliateOrder).catch((e: unknown) => console.error("[affiliate]", e instanceof Error ? e.message : e));
  if (session.metadata?.consent === "all") {
    const [firstName, ...rest] = (shippingDetails?.name ?? customer?.name ?? "").split(" ");
    const subInterval = items.find((i) => i.plan.startsWith("sub"))?.plan.split(":")[1] ?? null;
    const url = `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://metilde.com"}/sv/tack`;
    const user = {
      email: customer?.email,
      phone: customer?.phone,
      firstName,
      lastName: rest.join(" ") || null,
      zip: addr?.postal_code,
      city: addr?.city,
      country: addr?.country,
      fbp: session.metadata?.fbp || null,
      fbc: session.metadata?.fbc || null,
      externalId: typeof session.customer === "string" ? session.customer : (session.customer?.id ?? null),
    };
    const ids = await metaIdsFor(meta);
    const custom = {
      value: kr(session.amount_total),
      currency: "SEK",
      content_type: "product",
      content_ids: ids,
      contents: items.map((i, idx) => ({ id: ids[idx] ?? i.product_slug, quantity: i.qty, item_price: i.unit_price })),
      num_items: items.reduce((s, i) => s + i.qty, 0),
      order_id: order.order_number,
    };
    // Subscribe skickas utöver Purchase vid prenumeration. predicted_ltv = sex leveranser är ett försiktigt antagande tills vi har egen data.
    await sendMetaEvents([
      { name: "Purchase", eventId: session.id, url, user, custom },
      ...(isSub
        ? [{ name: "Subscribe" as const, eventId: `${session.id}_sub`, url, user, custom: { ...custom, subscription_interval: subInterval ? `${subInterval}d` : undefined, predicted_ltv: Math.round(custom.value * 6) } }]
        : []),
    ]).catch((e: unknown) => console.error("[meta]", e instanceof Error ? e.message : e));
  }
  if (isGiftCard) {
    await issueGiftCard(session).catch((e: unknown) => console.error("[presentkort]", e instanceof Error ? e.message : e));
  } else {
    await sendOrderConfirmation(order, items).catch((e: unknown) => console.error("[email]", e instanceof Error ? e.message : e));
  }
  return { order, items, created: true };
}

const periodStart = (s: Stripe.Subscription) => {
  const item = s.items.data[0];
  return item ? new Date(item.current_period_start * 1000).toISOString() : null;
};
const periodEnd = (s: Stripe.Subscription) => {
  const item = s.items.data[0];
  return item ? new Date(item.current_period_end * 1000).toISOString() : null;
};

/**
 * Förnyelse av prenumeration (invoice.paid med billing_reason subscription_cycle).
 * Stripe drar betalningen vid periodens slut; leveransen planeras RENEWAL_DELIVERY_LEAD_DAYS
 * senare och ordern ligger som "scheduled" tills RENEWAL_RELEASE_DAYS_BEFORE dagar före
 * leverans, då releaseScheduledOrders() släpper den till packning (status paid, senare Plocky).
 */
export async function saveRenewalFromInvoice(invoice: Stripe.Invoice): Promise<OrderRecord | null> {
  if (!supabaseConfigured()) return null;
  if (invoice.billing_reason !== "subscription_cycle") return null;
  const db = supabaseAdmin();

  const dup = await db.from("orders").select("*").eq("stripe_invoice_id", invoice.id).maybeSingle();
  if (dup.data) return dup.data as OrderRecord;

  const subId =
    typeof invoice.parent?.subscription_details?.subscription === "string"
      ? invoice.parent.subscription_details.subscription
      : (invoice.parent?.subscription_details?.subscription?.id ?? null);
  const sub = subId ? await db.from("subscriptions").select("*").eq("stripe_subscription_id", subId).maybeSingle() : null;
  const previous = subId
    ? await db.from("orders").select("*").eq("stripe_subscription_id", subId).order("created_at", { ascending: true }).limit(1).maybeSingle()
    : null;
  const prev = previous?.data as OrderRecord | undefined;
  const paidAt = new Date((invoice.status_transitions?.paid_at ?? invoice.created) * 1000);
  const deliverAt = new Date(paidAt.getTime() + RENEWAL_DELIVERY_LEAD_DAYS * 864e5);
  const releaseAt = new Date(deliverAt.getTime() - RENEWAL_RELEASE_DAYS_BEFORE * 864e5);
  const intervalDays = (sub?.data?.interval_days as number | null) ?? null;

  const items: OrderItemRecord[] = [];
  for (const li of invoice.lines.data) {
    const slug = li.pricing?.price_details?.product ? await productSlugFromStripeProduct(li.pricing.price_details.product) : (sub?.data?.product_slug ?? null);
    if (!slug) continue;
    const qty = li.quantity ?? 1;
    items.push({
      product_slug: slug,
      name: (li.description ?? slug).replace(/^\d+ × /, "").replace(/ – prenumeration var \d+:e dag.*$/, ""),
      qty,
      plan: intervalDays ? `sub:${intervalDays}` : "sub",
      unit_price: kr(li.amount) / qty,
      line_total: kr(li.amount),
    });
  }

  const inserted = await db
    .from("orders")
    .insert({
      email: invoice.customer_email ?? prev?.email ?? null,
      phone: invoice.customer_phone ?? prev?.phone ?? null,
      status: "scheduled",
      deliver_at: deliverAt.toISOString(),
      release_at: releaseAt.toISOString(),
      currency: invoice.currency.toUpperCase(),
      subtotal: items.reduce((s, i) => s + i.line_total, 0),
      discount: 0,
      shipping: 0,
      total: kr(invoice.amount_paid),
      has_subscription: true,
      shipping_name: prev?.shipping_name ?? invoice.customer_name ?? null,
      shipping_address: prev?.shipping_address ?? null,
      shipping_postal_code: prev?.shipping_postal_code ?? null,
      shipping_city: prev?.shipping_city ?? null,
      shipping_country: prev?.shipping_country ?? null,
      shipping_method: "Fri frakt – spårbart brev",
      stripe_invoice_id: invoice.id,
      stripe_subscription_id: subId,
      stripe_customer_id: typeof invoice.customer === "string" ? invoice.customer : (invoice.customer?.id ?? null),
      environment: environment(),
      kind: "renewal",
      locale: "sv",
      exchange_rate_to_sek: await rateToSek(invoice.currency),
    })
    .select("*")
    .single();
  if (inserted.error) throw new Error(inserted.error.message);
  const order = inserted.data as OrderRecord;
  if (items.length) await db.from("order_items").insert(items.map((i) => ({ ...i, order_id: order.id })));
  await decrementStock(items, items.map((i) => ({ k: "product", s: i.product_slug, q: i.qty, p: "sub", i: null })));
  if (subId) {
    // Håll prenumerationsraden i synk med Stripes nya period och nästa planerade leverans
    const fresh = await stripe().subscriptions.retrieve(subId).catch(() => null);
    await db
      .from("subscriptions")
      .update({
        status: fresh?.status ?? "active",
        current_period_start: fresh ? periodStart(fresh) : null,
        current_period_end: fresh ? periodEnd(fresh) : null,
        cancel_at_period_end: fresh?.cancel_at_period_end ?? false,
        next_shipment_at: deliverAt.toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("stripe_subscription_id", subId);
  }
  await sendOrderConfirmation(order, items).catch((e: unknown) => console.error("[email]", e instanceof Error ? e.message : e));
  return order;
}

/**
 * Släpper planerade förnyelseordrar vars release_at passerats: status paid så att de
 * dyker upp bland ordrar att packa och skickas till Plocky.
 */
export async function releaseScheduledOrders(now = new Date()): Promise<OrderRecord[]> {
  if (!supabaseConfigured()) return [];
  const db = supabaseAdmin();
  const due = await db.from("orders").select("*").eq("status", "scheduled").lte("release_at", now.toISOString());
  const released: OrderRecord[] = [];
  for (const o of (due.data ?? []) as OrderRecord[]) {
    const res = await db.from("orders").update({ status: "paid" }).eq("id", o.id).eq("status", "scheduled").select("*").maybeSingle();
    if (res.data) {
      released.push(res.data as OrderRecord);
      await pushOrderToPlocky(res.data as OrderRecord);
    }
  }
  return released;
}

async function productSlugFromStripeProduct(productId: string): Promise<string | null> {
  try {
    const p = await stripe().products.retrieve(productId);
    return p.metadata?.slug ?? null;
  } catch {
    return null;
  }
}

/** Hämtar en order med rader – används av tacksidan. */
export async function getOrderBySession(sessionId: string) {
  if (!supabaseConfigured()) return null;
  const db = supabaseAdmin();
  const o = await db.from("orders").select("*").eq("stripe_session_id", sessionId).maybeSingle();
  if (!o.data) return null;
  const items = await db.from("order_items").select("product_slug,name,qty,plan,unit_price,line_total").eq("order_id", o.data.id);
  return { order: o.data as OrderRecord, items: (items.data ?? []) as OrderItemRecord[] };
}
