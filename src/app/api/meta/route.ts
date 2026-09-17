import { CONSENT_COOKIE } from "@/lib/consent";
import { metaConfigured, sendMetaEvents, type MetaEvent } from "@/lib/meta";

const NAMES = new Set(["PageView", "ViewContent", "AddToCart", "InitiateCheckout"]);

const cookie = (header: string | null, name: string) => header?.match(new RegExp(`(?:^|; )${name}=([^;]+)`))?.[1] ?? null;

/** Tar emot en händelse från webbläsaren och skickar den vidare till Meta Conversions API. */
export async function POST(request: Request) {
  if (!metaConfigured()) return new Response(null, { status: 204 });
  const cookies = request.headers.get("cookie");
  if (cookie(cookies, CONSENT_COOKIE) !== "all") return new Response(null, { status: 204 });

  let body: { name?: string; params?: Record<string, unknown>; eventId?: string; url?: string };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return new Response(null, { status: 204 });
  }
  if (!body.name || !NAMES.has(body.name) || !body.eventId) return new Response(null, { status: 204 });

  const event: MetaEvent = {
    name: body.name as MetaEvent["name"],
    eventId: String(body.eventId).slice(0, 80),
    url: body.url?.slice(0, 500),
    user: {
      ip: request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null,
      userAgent: request.headers.get("user-agent"),
      fbp: cookie(cookies, "_fbp"),
      fbc: cookie(cookies, "_fbc"),
    },
    custom: body.params && typeof body.params === "object" ? body.params : undefined,
  };
  try {
    await sendMetaEvents([event]);
  } catch (e) {
    console.error("[meta]", e instanceof Error ? e.message : e);
  }
  return new Response(null, { status: 204 });
}
