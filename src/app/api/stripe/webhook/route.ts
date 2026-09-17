import type Stripe from "stripe";
import { saveOrderFromSession, saveRenewalFromInvoice } from "@/lib/orders";
import { stripe } from "@/lib/stripe";

/**
 * Tar emot händelser från Stripe. Signaturen verifieras med STRIPE_WEBHOOK_SECRET.
 * checkout.session.completed → order sparas i databasen och kunden får bekräftelse.
 * invoice.paid (förnyelse)   → ny order för prenumerationsleveransen.
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

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const result = await saveOrderFromSession(event.data.object.id);
        console.log("[stripe] order", result?.order.order_number ?? "(ej sparad)", result?.created ? "skapad" : "fanns redan");
        break;
      }
      case "invoice.paid": {
        const order = await saveRenewalFromInvoice(event.data.object);
        if (order) console.log("[stripe] förnyelse", order.order_number);
        break;
      }
      default:
        break;
    }
  } catch (e) {
    // 500 gör att Stripe försöker igen senare
    console.error("[stripe webhook]", e instanceof Error ? e.message : e);
    return Response.json({ error: "Kunde inte behandla händelsen." }, { status: 500 });
  }
  return Response.json({ received: true });
}
