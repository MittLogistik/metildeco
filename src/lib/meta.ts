import "server-only";
import { createHash } from "node:crypto";

/**
 * Meta Conversions API. Händelser skickas från servern med samma event_id som
 * pixeln använder i webbläsaren, så att Meta räknar dem en gång.
 */
export const metaConfigured = () => Boolean(process.env.NEXT_PUBLIC_META_PIXEL_ID && process.env.META_CAPI_TOKEN && !process.env.META_CAPI_TOKEN.endsWith("..."));

const sha = (v: string | null | undefined) => (v ? createHash("sha256").update(v.trim().toLowerCase()).digest("hex") : undefined);

export type MetaUser = {
  email?: string | null;
  phone?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  zip?: string | null;
  city?: string | null;
  country?: string | null;
  ip?: string | null;
  userAgent?: string | null;
  fbp?: string | null;
  fbc?: string | null;
  externalId?: string | null;
};

export type MetaEvent = {
  name: "PageView" | "ViewContent" | "AddToCart" | "InitiateCheckout" | "Purchase" | "Lead";
  eventId: string;
  url?: string | null;
  time?: number;
  user: MetaUser;
  custom?: Record<string, unknown>;
};

const normalizePhone = (p: string) => {
  const digits = p.replace(/[^\d+]/g, "");
  if (digits.startsWith("+")) return digits.slice(1);
  if (digits.startsWith("00")) return digits.slice(2);
  if (digits.startsWith("0")) return `46${digits.slice(1)}`;
  return digits;
};

export async function sendMetaEvents(events: MetaEvent[]): Promise<void> {
  if (!metaConfigured() || events.length === 0) return;
  const pixel = process.env.NEXT_PUBLIC_META_PIXEL_ID!;
  const token = process.env.META_CAPI_TOKEN!;
  const body = {
    data: events.map((e) => ({
      event_name: e.name,
      event_time: e.time ?? Math.floor(Date.now() / 1000),
      event_id: e.eventId,
      event_source_url: e.url ?? undefined,
      action_source: "website",
      user_data: {
        em: sha(e.user.email) ? [sha(e.user.email)] : undefined,
        ph: e.user.phone ? [sha(normalizePhone(e.user.phone))] : undefined,
        fn: sha(e.user.firstName) ? [sha(e.user.firstName)] : undefined,
        ln: sha(e.user.lastName) ? [sha(e.user.lastName)] : undefined,
        zp: sha(e.user.zip?.replace(/\s/g, "")) ? [sha(e.user.zip?.replace(/\s/g, ""))] : undefined,
        ct: sha(e.user.city) ? [sha(e.user.city)] : undefined,
        country: sha(e.user.country) ? [sha(e.user.country)] : undefined,
        external_id: sha(e.user.externalId) ? [sha(e.user.externalId)] : undefined,
        client_ip_address: e.user.ip ?? undefined,
        client_user_agent: e.user.userAgent ?? undefined,
        fbp: e.user.fbp ?? undefined,
        fbc: e.user.fbc ?? undefined,
      },
      custom_data: e.custom,
    })),
    ...(process.env.META_TEST_EVENT_CODE ? { test_event_code: process.env.META_TEST_EVENT_CODE } : {}),
  };
  const res = await fetch(`https://graph.facebook.com/v21.0/${pixel}/events?access_token=${encodeURIComponent(token)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Meta CAPI ${res.status}: ${(await res.text()).slice(0, 300)}`);
}
