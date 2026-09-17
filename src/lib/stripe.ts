import "server-only";
import Stripe from "stripe";

let client: Stripe | null = null;

/** Stripe-klient för serverkod. Nyckeln ligger i STRIPE_SECRET_KEY (.env.local). */
export function stripe(): Stripe {
  if (client) return client;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY saknas i miljön");
  client = new Stripe(key, { appInfo: { name: "Metilde", url: "https://metilde.com" } });
  return client;
}

export const stripeConfigured = () => Boolean(process.env.STRIPE_SECRET_KEY);
