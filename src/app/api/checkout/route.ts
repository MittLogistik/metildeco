import type Stripe from "stripe";
import { buildLineItems, buildShippingOptions, parseCheckoutRequest, priceLines, subtotalOf } from "@/lib/checkout";
import { routes } from "@/lib/routes";
import { cheapestSwedenRate, shippingCost } from "@/lib/shipping";
import { stripe, stripeConfigured } from "@/lib/stripe";
import { latestClick } from "@/lib/affiliate";
import { promotionCodeId, recordCheckoutStart } from "@/lib/abandoned";
import { CONSENT_COOKIE } from "@/lib/consent";

/**
 * Skapar en Stripe Checkout-session. Priser och lagerstatus kontrolleras på servern.
 * Stripe samlar in e-post, leveransadress, telefon och fraktval.
 * Innehåller korgen prenumerationer används subscription-läget, annars payment.
 */
export async function POST(request: Request) {
  if (!stripeConfigured()) {
    return Response.json({ error: "Betalning är inte aktiverad ännu." }, { status: 503 });
  }

  let payload;
  try {
    payload = parseCheckoutRequest(await request.json());
  } catch (e) {
    return Response.json({ error: e instanceof Error ? e.message : "Ogiltig begäran." }, { status: 400 });
  }

  const origin = request.headers.get("origin") ?? process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  try {
    const priced = await priceLines(payload.lines);
    const hasSub = priced.some((l) => l.plan === "sub");
    const lineItems = buildLineItems(priced, origin);
    const consent = request.headers.get("cookie")?.match(new RegExp(`(?:^|; )${CONSENT_COOKIE}=(necessary|all)`))?.[1] ?? "necessary";
    const fbp = request.headers.get("cookie")?.match(/(?:^|; )_fbp=([^;]+)/)?.[1] ?? "";
    const fbc = request.headers.get("cookie")?.match(/(?:^|; )_fbc=([^;]+)/)?.[1] ?? "";
    // Affiliateklicket fryses här, vid köpögonblicket, i stället för vid betalningen
    const click = payload.visitorId ? await latestClick(payload.visitorId).catch(() => null) : null;
    const metadata = {
      consent,
      ...(payload.variant ? { ab: payload.variant } : {}),
      fbp: fbp.slice(0, 100),
      fbc: fbc.slice(0, 200),
      cart: JSON.stringify(priced.map((l) => ({ k: l.kind, s: l.slug, q: l.qty, p: l.plan, i: l.intervalDays ?? null }))).slice(0, 500),
      ...(click ? { aff_src: click.source, aff_click: click.clickId ?? "", aff_ref: click.clickRef ?? "" } : {}),
      // Källa: ett giltigt affiliateklick vinner, annars senaste källan från webbläsaren
      src: click ? "affiliate" : payload.source.ch,
      src_d: (click ? (click.clickRef ?? payload.source.d ?? "") : (payload.source.d ?? "")).slice(0, 150),
      src_f: payload.source.first ?? "",
    };

    const params: Stripe.Checkout.SessionCreateParams = {
      mode: hasSub ? "subscription" : "payment",
      locale: "sv",
      line_items: lineItems,
      customer_email: payload.email ?? undefined,
      shipping_address_collection: { allowed_countries: ["SE"] },
      phone_number_collection: { enabled: true },
      billing_address_collection: "auto",
      expires_at: Math.floor(Date.now() / 1000) + 24 * 3600,
      after_expiration: { recovery: { enabled: true, allow_promotion_codes: true } },
      success_url: `${origin}${routes.home}/tack?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}${routes.checkout}`,
      metadata,
    };
    // En kod från en påminnelselänk läggs på direkt; annars får kunden skriva in en kod hos Stripe.
    // Stripe tillåter inte båda samtidigt.
    const promo = await promotionCodeId(payload.code);
    if (promo) params.discounts = [{ promotion_code: promo }];
    else params.allow_promotion_codes = true;

    if (hasSub) {
      // Stripe stöder inte fraktalternativ i subscription-läget. Prenumerationer är fraktfria;
      // engångsvaror i samma korg får billigaste frakten som en engångsrad.
      const onceLines = priced.filter((l) => !l.freeShipping);
      const shipping = onceLines.length ? shippingCost(cheapestSwedenRate, subtotalOf(priced)) : 0;
      if (shipping > 0) {
        lineItems.push({
          quantity: 1,
          price_data: {
            currency: "sek",
            unit_amount: Math.round(shipping * 100),
            tax_behavior: "inclusive",
            product_data: { name: `Frakt – ${cheapestSwedenRate.label}` },
          },
        });
      }
      params.subscription_data = { metadata };
    } else {
      params.shipping_options = buildShippingOptions(priced);
      params.customer_creation = "always";
      params.payment_intent_data = {
        description: `Metilde – ${priced.map((l) => `${l.qty}× ${l.name}`).join(", ")}`.slice(0, 900),
        metadata,
      };
    }

    const session = await stripe().checkout.sessions.create(params);
    if (!session.url) throw new Error("Stripe returnerade ingen betalningslänk.");
    // Korgen sparas nu, med e-posten från vår kassa, så att påminnelser kan gå redan efter tre timmar
    if (payload.email) await recordCheckoutStart({ sessionId: session.id, email: payload.email, priced, subtotal: subtotalOf(priced) }).catch((e: unknown) => console.error("[korg]", e instanceof Error ? e.message : e));
    return Response.json({ url: session.url });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Kunde inte starta betalningen.";
    console.error("[checkout]", message);
    return Response.json({ error: message }, { status: 400 });
  }
}
