import "server-only";
import { supabaseAdmin, supabaseConfigured } from "./supabase";

/**
 * Enkelt lås så att två cron-körningar inte överlappar. Låset har en livstid: kraschar
 * en körning släpps det av sig självt när tiden gått ut.
 */
export async function withJobLock<T>(name: string, minutes: number, fn: () => Promise<T>): Promise<T | { skipped: true; reason: string }> {
  if (!supabaseConfigured()) return fn();
  const db = supabaseAdmin();
  const now = new Date();
  const row = (await db.from("job_locks").select("name,leased_until,paused,paused_reason").eq("name", name).maybeSingle()).data as
    | { leased_until: string | null; paused: boolean; paused_reason: string | null }
    | null;
  if (row?.paused) return { skipped: true, reason: row.paused_reason ?? "Jobbet är pausat." };
  if (row?.leased_until && new Date(row.leased_until) > now) return { skipped: true, reason: "En körning pågår redan." };

  const leasedUntil = new Date(now.getTime() + minutes * 60_000).toISOString();
  const res = await db.from("job_locks").upsert({ name, leased_until: leasedUntil, last_run_at: now.toISOString(), updated_at: now.toISOString() }, { onConflict: "name" });
  if (res.error) throw new Error(res.error.message);
  try {
    return await fn();
  } finally {
    await db.from("job_locks").update({ leased_until: null, updated_at: new Date().toISOString() }).eq("name", name);
  }
}
