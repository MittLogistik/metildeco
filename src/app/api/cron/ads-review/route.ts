import { reviewAds } from "@/lib/ads-engine";
import { adsConfigured } from "@/lib/meta-ads";

/**
 * Daglig annonsgranskning, anropas av Vercel Cron (se vercel.json).
 * Utför åtgärderna bara om ADS_AUTOPILOT=true, annars loggas de som förslag.
 */
/** Kampanjbygge och iteration anropar Meta och Higgsfield många gånger. */
export const maxDuration = 300;

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) return new Response("Unauthorized", { status: 401 });
  if (!adsConfigured()) return Response.json({ ok: false, error: "Meta ads är inte konfigurerat." }, { status: 200 });
  const apply = process.env.ADS_AUTOPILOT === "true";
  try {
    const decisions = await reviewAds({ apply, source: "cron" });
    return Response.json({ ok: true, apply, decisions: decisions.map((d) => ({ level: d.level, name: d.name, action: d.action, reason: d.reason })) });
  } catch (e) {
    return Response.json({ ok: false, error: e instanceof Error ? e.message : String(e) }, { status: 500 });
  }
}
