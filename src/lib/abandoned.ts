import "server-only";
import type Stripe from "stripe";
import { supabaseAdmin, supabaseConfigured } from "./supabase";

type CartMeta = { k: "product" | "bundle"; s: string; q: number; p: "once" | "sub"; i: number | null };

/**
 * Sparar en övergiven Checkout-session (checkout.session.expired) med kundens
 * e-post, om kunden hann skriva in den, samt Stripes återställningslänk.
 */
export async function saveAbandonedCart(session: Stripe.Checkout.Session): Promise<boolean> {
  if (!supabaseConfigured()) return false;
  const email = session.customer_details?.email?.toLowerCase() ?? session.customer_email?.toLowerCase() ?? null;
  if (!email) return false; // utan e-post finns inget att följa upp

  let items: CartMeta[] = [];
  try {
    items = JSON.parse(session.metadata?.cart ?? "[]") as CartMeta[];
  } catch {
    items = [];
  }
  const lines = session.line_items?.data ?? [];
  const enriched = items.map((m, i) => ({
    kind: m.k,
    slug: m.s,
    qty: m.q,
    plan: m.p,
    intervalDays: m.i,
    name: lines[i]?.description ?? m.s,
    lineTotal: (lines[i]?.amount_total ?? 0) / 100,
  }));

  const db = supabaseAdmin();
  const res = await db.from("abandoned_carts").upsert(
    {
      cart_token: session.id,
      email,
      first_name: session.customer_details?.name?.split(" ")[0] ?? null,
      locale: "sv",
      currency: (session.currency ?? "sek").toUpperCase(),
      items: enriched,
      subtotal: (session.amount_subtotal ?? 0) / 100,
      status: "open",
      recovery_url: session.after_expiration?.recovery?.url ?? null,
      source: session.metadata?.kind === "giftcard" ? "giftcard" : "stripe",
      last_activity_at: new Date((session.expires_at ?? Math.floor(Date.now() / 1000)) * 1000).toISOString(),
    },
    { onConflict: "cart_token" },
  );
  if (res.error) throw new Error(res.error.message);
  return true;
}

/** När en kund med öppen övergiven korg handlar markeras korgen som återvunnen. */
export async function markRecovered(email: string | null, orderId: string) {
  if (!email || !supabaseConfigured()) return;
  await supabaseAdmin()
    .from("abandoned_carts")
    .update({ status: "recovered", recovered_at: new Date().toISOString(), recovered_order_id: orderId })
    .eq("email", email.toLowerCase())
    .eq("status", "open");
}
