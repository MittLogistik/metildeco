import { withJobLock } from "@/lib/job-lock";
import { plockyConfigured, sendPlockyQueue } from "@/lib/plocky";

/** Skickar ordrar som ligger kvar i kön till Plocky (misslyckade försök, driftstopp). Vercel Cron var tionde minut. */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) return new Response("Unauthorized", { status: 401 });
  if (!plockyConfigured()) return Response.json({ ok: true, skipped: "Plocky är inte konfigurerat." });
  try {
    const result = await withJobLock("plocky", 9, () => sendPlockyQueue({ limit: 50 }));
    return Response.json({ ok: true, ...result });
  } catch (e) {
    return Response.json({ ok: false, error: e instanceof Error ? e.message : String(e) }, { status: 500 });
  }
}
