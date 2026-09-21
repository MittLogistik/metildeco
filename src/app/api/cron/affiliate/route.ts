import { purgeExpiredClicks, sendQueued, syncCommissions, testConnection } from "@/lib/affiliate";
import { withJobLock } from "@/lib/job-lock";
import { supabaseAdmin, supabaseConfigured } from "@/lib/supabase";

/**
 * Affiliatejobbet, var tionde minut: skickar köade konverteringar med exponentiell backoff,
 * hämtar provision från AddRevenue och rensar utgången klickspårning.
 *
 * Skyddat med en hemlig header. CRON_SECRET i miljön gäller, och som reserv den token som
 * ligger i integration_settings.cron_secret.
 */
export const maxDuration = 300;

async function authorized(request: Request): Promise<boolean> {
  const header = request.headers.get("authorization") ?? "";
  const provided = header.replace(/^Bearer\s+/i, "").trim() || request.headers.get("x-cron-secret")?.trim() || "";
  if (!provided) return false;
  if (process.env.CRON_SECRET && provided === process.env.CRON_SECRET) return true;
  if (!supabaseConfigured()) return false;
  const row = (await supabaseAdmin().from("integration_settings").select("value").eq("key", "cron_secret").maybeSingle()).data as { value?: { token?: string } } | null;
  return Boolean(row?.value?.token && provided === row.value.token);
}

export async function GET(request: Request) {
  if (!(await authorized(request))) return new Response("Unauthorized", { status: 401 });
  // ?test=1 kör bara kopplingstestet, utan att röra kön
  if (new URL(request.url).searchParams.get("test")) return Response.json(await testConnection());
  try {
    const result = await withJobLock("affiliate", 9, async () => {
      const queue = await sendQueued();
      const commissions = await syncCommissions();
      const purged = await purgeExpiredClicks();
      return { queue, commissions, purged };
    });
    return Response.json({ ok: true, ...result });
  } catch (e) {
    return Response.json({ ok: false, error: e instanceof Error ? e.message : String(e) }, { status: 500 });
  }
}
