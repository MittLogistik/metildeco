import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";

/**
 * Tar emot händelser från Stripe. Signaturen verifieras med STRIPE_WEBHOOK_SECRET.
 * Just nu loggas bara händelserna – ordersparning i databasen kopplas på i nästa steg.
 */
export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret || secret.endsWith("...")) {
    return Response.json({ error: "Webhook är inte konfigurerad." }, { status: 503 });
  }
  const signature = request.headers.get("stripe-signature");
  if (!signature) return Response.json({ error: "Signatur saknas." }, { status: 400 });

  let event: Stripe.Event;
  try {
    event = stripe().webhooks.constructEvent(await request.text(), signature, secret);
  } catch (e) {
    return Response.json({ error: e instanceof Error ? e.message : "Ogiltig signatur." }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      console.log("[stripe] betalning klar", session.id, session.customer_details?.email, session.amount_total);
      break;
    }
    case "invoice.paid": {
      const invoice = event.data.object;
      console.log("[stripe] prenumeration förnyad", invoice.id, invoice.customer_email);
      break;
    }
    default:
      break;
  }
  return Response.json({ received: true });
}
