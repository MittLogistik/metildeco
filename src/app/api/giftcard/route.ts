import { GIFT_CARD_AMOUNTS } from "@/lib/giftcards";
import { routes } from "@/lib/routes";
import { stripe, stripeConfigured } from "@/lib/stripe";

/** Startar betalning av ett digitalt presentkort. Koden skapas när betalningen är klar. */
export async function POST(request: Request) {
  if (!stripeConfigured()) return Response.json({ error: "Betalning är inte aktiverad ännu." }, { status: 503 });
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return Response.json({ error: "Ogiltig begäran." }, { status: 400 });
  }
  const amount = Number(body.amount);
  if (!(GIFT_CARD_AMOUNTS as readonly number[]).includes(amount)) return Response.json({ error: "Välj ett belopp." }, { status: 400 });
  const clean = (v: unknown, max: number) => String(v ?? "").trim().slice(0, max);
  const recipient = clean(body.recipient, 200).toLowerCase();
  if (recipient && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(recipient)) return Response.json({ error: "Mottagarens e-postadress ser inte rätt ut." }, { status: 400 });
  const origin = request.headers.get("origin") ?? process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const session = await stripe().checkout.sessions.create({
    mode: "payment",
    locale: "sv",
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "sek",
          unit_amount: amount * 100,
          tax_behavior: "inclusive",
          product_data: { name: `Metilde presentkort ${amount} kr`, description: "Digitalt presentkort som skickas via e-post. Giltigt i ett år." },
        },
      },
    ],
    customer_creation: "always",
    success_url: `${origin}${routes.home}/tack?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}${routes.giftCard}`,
    metadata: {
      kind: "giftcard",
      gift_amount: String(amount),
      gift_recipient: recipient,
      gift_from: clean(body.from, 80),
      gift_message: clean(body.message, 300),
    },
    payment_intent_data: { description: `Metilde presentkort ${amount} kr`, metadata: { kind: "giftcard" } },
  });
  if (!session.url) return Response.json({ error: "Stripe returnerade ingen betalningslänk." }, { status: 500 });
  return Response.json({ url: session.url });
}
