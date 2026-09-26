"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSessionClient } from "@/lib/auth";
import { emailConfigured, sendLoginCodeEmail } from "@/lib/email";
import { runSubscriptionCommand } from "@/lib/subscriptions";
import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase";

export type AccountResult = { ok: true; message?: string } | { ok: false; error: string };

/**
 * Skickar en engångskod till kundens e-post. Kontot skapas automatiskt första gången.
 * Koden hämtas från Supabase (generateLink) och skickas med vår egen Resend-avsändare,
 * så att inloggningen inte beror på Supabases inbyggda e-postutskick (som är hårt
 * begränsat och ofta fastnar i skräpposten). Saknas Resend används Supabases utskick.
 */
export async function sendLoginCode(formData: FormData): Promise<AccountResult> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return { ok: false, error: "Ange en giltig e-postadress." };
  if (emailConfigured()) {
    const { data, error } = await supabaseAdmin().auth.admin.generateLink({ type: "magiclink", email });
    const code = data?.properties?.email_otp;
    if (error || !code) {
      console.error("[login] generateLink", error?.message ?? "ingen kod");
      return { ok: false, error: "Kunde inte skapa en kod just nu. Försök igen om en stund." };
    }
    try {
      await sendLoginCodeEmail(email, code);
    } catch (e) {
      console.error("[login] e-post", e instanceof Error ? e.message : e);
      return { ok: false, error: "Kunde inte skicka koden just nu. Försök igen om en stund." };
    }
    return { ok: true, message: email };
  }
  const client = await createSessionClient();
  const { error } = await client.auth.signInWithOtp({ email, options: { shouldCreateUser: true } });
  if (error) return { ok: false, error: "Kunde inte skicka koden just nu. Försök igen om en stund." };
  return { ok: true, message: email };
}

/** Verifierar engångskoden och loggar in. */
export async function verifyLoginCode(formData: FormData): Promise<AccountResult> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const token = String(formData.get("code") ?? "").replace(/\s/g, "");
  if (!/^\d{6,8}$/.test(token)) return { ok: false, error: "Koden består av siffrorna i mejlet." };
  const client = await createSessionClient();
  const { error } = await client.auth.verifyOtp({ email, token, type: "email" });
  if (error) return { ok: false, error: "Fel kod eller så har den gått ut. Begär en ny kod." };
  redirect("/sv/mitt-konto");
}

export async function signOutCustomer() {
  const client = await createSessionClient();
  await client.auth.signOut();
  redirect("/sv/mitt-konto");
}

/** Hämtar inloggad kund. */
async function currentEmail(): Promise<string | null> {
  const client = await createSessionClient();
  const { data } = await client.auth.getUser();
  return data.user?.email?.toLowerCase() ?? null;
}

/** Säkerställer att prenumerationen tillhör den inloggade kunden innan Stripe anropas. */
async function ownedSubscription(stripeSubscriptionId: string) {
  const email = await currentEmail();
  if (!email) return null;
  const { data } = await supabaseAdmin().from("subscriptions").select("*").eq("stripe_subscription_id", stripeSubscriptionId).maybeSingle();
  if (!data || String(data.email ?? "").toLowerCase() !== email) return null;
  return data;
}

const runOwned = async (formData: FormData, command: "pause" | "resume" | "cancel_period_end"): Promise<AccountResult> => {
  const id = String(formData.get("id") ?? "");
  if (!(await ownedSubscription(id))) return { ok: false, error: "Prenumerationen hittades inte." };
  try {
    const message = await runSubscriptionCommand(id, command);
    revalidatePath("/sv/mitt-konto");
    return { ok: true, message };
  } catch (e) {
    console.error("[prenumeration]", e instanceof Error ? e.message : e);
    return { ok: false, error: "Det gick inte att ändra prenumerationen just nu. Mejla oss så hjälper vi dig." };
  }
};

export async function pauseSubscription(formData: FormData): Promise<AccountResult> {
  return runOwned(formData, "pause");
}
export async function resumeSubscription(formData: FormData): Promise<AccountResult> {
  return runOwned(formData, "resume");
}
export async function cancelSubscription(formData: FormData): Promise<AccountResult> {
  return runOwned(formData, "cancel_period_end");
}

/** Öppnar Stripes kundportal för betalsätt, adress och kvitton. */
export async function openBillingPortal(): Promise<never> {
  const email = await currentEmail();
  if (!email) redirect("/sv/mitt-konto");
  const { data: sub } = await supabaseAdmin().from("subscriptions").select("stripe_customer_id").eq("email", email).limit(1).maybeSingle();
  const { data: order } = await supabaseAdmin().from("orders").select("stripe_customer_id").eq("email", email).not("stripe_customer_id", "is", null).order("created_at", { ascending: false }).limit(1).maybeSingle();
  const customer = sub?.stripe_customer_id ?? order?.stripe_customer_id;
  if (!customer) redirect("/sv/mitt-konto?portal=saknas");
  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? "https://metilde.com";
  const session = await stripe().billingPortal.sessions.create({ customer, return_url: `${origin}/sv/mitt-konto`, locale: "sv" });
  redirect(session.url);
}
