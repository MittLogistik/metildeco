import type Stripe from "stripe";
import { buildLineItems, computeTotals, parseCheckoutRequest, priceLines } from "@/lib/checkout";
import { routes } from "@/lib/routes";
import { stripe, stripeConfigured } from "@/lib/stripe";

/**
 * Skapar en Stripe Checkout-session. Priser och lagerstatus kontrolleras på servern.
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
    const priced = priceLines(payload.lines);
    const totals = computeTotals(priced, payload.shippingMethod);
    const hasSub = priced.some((l) => l.plan === "sub");
    const { customer } = payload;
    const name = `${customer.firstName} ${customer.lastName}`;
    const address = {
      line1: customer.address,
      postal_code: customer.zip,
      city: customer.city,
      country: customer.country,
    };

    const s = stripe();
    const stripeCustomer = await s.customers.create({
      email: customer.email,
      name,
      phone: customer.phone || undefined,
      address,
      shipping: { name, phone: customer.phone || undefined, address },
      preferred_locales: ["sv"],
    });

    const lineItems = buildLineItems(priced, origin);
    const metadata = {
      shipping_method: payload.shippingMethod,
      shipping_amount: String(totals.shipping),
      cart: JSON.stringify(priced.map((l) => ({ k: l.kind, s: l.slug, q: l.qty, p: l.plan, i: l.intervalDays ?? null }))).slice(0, 500),
    };

    const params: Stripe.Checkout.SessionCreateParams = {
      mode: hasSub ? "subscription" : "payment",
      customer: stripeCustomer.id,
      locale: "sv",
      line_items: lineItems,
      success_url: `${origin}${routes.home}/tack?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}${routes.checkout}`,
      allow_promotion_codes: true,
      metadata,
    };

    if (hasSub) {
      // Frakt på blandade korgar läggs som en engångsrad – shipping_options stöds inte i subscription-läget.
      if (totals.shipping > 0) {
        lineItems.push({
          quantity: 1,
          price_data: {
            currency: "sek",
            unit_amount: Math.round(totals.shipping * 100),
            tax_behavior: "inclusive",
            product_data: { name: `Frakt – ${totals.shippingLabel}` },
          },
        });
      }
      params.subscription_data = { metadata };
    } else {
      params.shipping_options = [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            display_name: totals.shipping === 0 ? `${totals.shippingLabel} – fri frakt` : totals.shippingLabel,
            fixed_amount: { amount: Math.round(totals.shipping * 100), currency: "sek" },
            delivery_estimate: {
              minimum: { unit: "business_day", value: 1 },
              maximum: { unit: "business_day", value: 3 },
            },
          },
        },
      ];
      params.payment_intent_data = {
        description: `Metilde order – ${priced.map((l) => `${l.qty}× ${l.name}`).join(", ")}`.slice(0, 900),
        metadata,
      };
    }

    const session = await s.checkout.sessions.create(params);
    if (!session.url) throw new Error("Stripe returnerade ingen betalningslänk.");
    return Response.json({ url: session.url });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Kunde inte starta betalningen.";
    console.error("[checkout]", message);
    return Response.json({ error: message }, { status: 400 });
  }
}
