import { sendDueReminders } from "@/lib/abandoned";
import { withJobLock } from "@/lib/job-lock";

/** Skickar påminnelser om övergivna korgar vars tid är inne. Vercel Cron var 15:e minut. */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) return new Response("Unauthorized", { status: 401 });
  try {
    const result = await withJobLock("abandoned", 10, () => sendDueReminders(50));
    return Response.json({ ok: true, ...result });
  } catch (e) {
    return Response.json({ ok: false, error: e instanceof Error ? e.message : String(e) }, { status: 500 });
  }
}
