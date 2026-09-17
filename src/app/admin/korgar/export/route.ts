import { getAdminUser } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

/** CSV med e-postadresser från övergivna korgar, för import i nyhetsbrevsverktyg. */
export async function GET(request: Request) {
  if (!(await getAdminUser())) return new Response("Inte inloggad", { status: 401 });
  const status = new URL(request.url).searchParams.get("status") ?? "open";
  let q = supabaseAdmin().from("abandoned_carts").select("email,first_name,subtotal,status,created_at,recovery_url").order("created_at", { ascending: false });
  if (status !== "alla") q = q.eq("status", status);
  const { data } = await q;
  const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const rows = [["email", "first_name", "subtotal_sek", "status", "created_at", "recovery_url"].join(";")];
  const seen = new Set<string>();
  for (const r of data ?? []) {
    if (seen.has(r.email)) continue;
    seen.add(r.email);
    rows.push([r.email, r.first_name, r.subtotal, r.status, r.created_at, r.recovery_url].map(esc).join(";"));
  }
  return new Response("﻿" + rows.join("\r\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="metilde-korgar-${status}.csv"`,
    },
  });
}
