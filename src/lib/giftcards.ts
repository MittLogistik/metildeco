import "server-only";
import type Stripe from "stripe";
import { sendGiftCardEmail } from "./email";
import { stripe } from "./stripe";
import { supabaseAdmin } from "./supabase";

export const GIFT_CARD_AMOUNTS = [200, 300, 500, 750, 1000, 1500] as const;

const randomCode = () => {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const part = () => Array.from({ length: 4 }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join("");
  return `GIFT-${part()}-${part()}`;
};

/**
 * Skapar presentkortet efter betald Checkout-session: en Stripe-kupong med
 * fast belopp och en kampanjkod som kunden skriver in i betalsteget.
 * Koden sparas även i discount_codes så att den syns i admin.
 * Idempotent: körs den igen för samma session återanvänds koden.
 */
export async function issueGiftCard(session: Stripe.Checkout.Session): Promise<string | null> {
  const amount = Number(session.metadata?.gift_amount ?? 0);
  if (!amount) return null;
  const db = supabaseAdmin();
  const existing = await db.from("discount_codes").select("code").eq("description", `Presentkort ${session.id}`).maybeSingle();
  if (existing.data) return existing.data.code as string;

  const s = stripe();
  const expires = new Date();
  expires.setFullYear(expires.getFullYear() + 1);
  const coupon = await s.coupons.create({
    amount_off: Math.round(amount * 100),
    currency: "sek",
    duration: "once",
    max_redemptions: 1,
    name: `Presentkort ${amount} kr`,
    redeem_by: Math.floor(expires.getTime() / 1000),
  });
  let code = randomCode();
  for (let i = 0; i < 3; i++) {
    try {
      await s.promotionCodes.create({ promotion: { type: "coupon", coupon: coupon.id }, code, max_redemptions: 1, expires_at: Math.floor(expires.getTime() / 1000) });
      break;
    } catch {
      code = randomCode();
    }
  }
  await db.from("discount_codes").insert({
    code,
    description: `Presentkort ${session.id}`,
    kind: "fixed",
    value: amount,
    currency: "SEK",
    max_redemptions: 1,
    expires_at: expires.toISOString(),
    active: true,
  });

  const buyer = session.customer_details?.email ?? null;
  const recipient = session.metadata?.gift_recipient || null;
  const message = session.metadata?.gift_message || null;
  const fromName = session.metadata?.gift_from || session.customer_details?.name || null;
  if (buyer) await sendGiftCardEmail(buyer, code, amount, expires, { recipientCopy: false, fromName, message }).catch((e: unknown) => console.error("[email]", e));
  if (recipient && recipient !== buyer) {
    await sendGiftCardEmail(recipient, code, amount, expires, { recipientCopy: true, fromName, message }).catch((e: unknown) => console.error("[email]", e));
  }
  return code;
}
