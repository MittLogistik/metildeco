import { emailConfigured, sendEmail } from "@/lib/email";
import { company } from "@/lib/site";
import { authenticateAgent, isEmail, logSupport } from "@/lib/support-agent";
import { supabaseAdmin } from "@/lib/supabase";

/**
 * Matilda svarar kunden. Mejlet går från kundtjänstens adress med svar till samma adress,
 * och hela texten sparas i loggen. Högst fyra mejl per adress och timme – skydd mot att hon
 * hamnar i en loop med ett autosvar.
 */
const MAX_PER_HOUR = 4;

type Body = { to?: string; subject?: string; text?: string; in_reply_to?: string };

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export async function POST(request: Request) {
  const auth = await authenticateAgent(request);
  if (!auth.ok) return Response.json({ error: auth.error }, { status: auth.status });
  if (!auth.agent.allow_email) return Response.json({ error: "Utskick är avstängt för Matilda." }, { status: 403 });
  if (!emailConfigured()) return Response.json({ error: "Mejlfunktionen är inte aktiverad (RESEND_API_KEY)." }, { status: 503 });

  let b: Body;
  try {
    b = (await request.json()) as Body;
  } catch {
    return Response.json({ error: "Ogiltig JSON." }, { status: 400 });
  }
  const to = String(b.to ?? "").trim().toLowerCase();
  const subject = String(b.subject ?? "").trim().slice(0, 200);
  const text = String(b.text ?? "").trim().slice(0, 10000);
  const inReplyTo = String(b.in_reply_to ?? "").trim().slice(0, 500);
  if (!isEmail(to) || !subject || text.length < 10) return Response.json({ error: "Ange to, subject och text." }, { status: 400 });
  if (to === company.email.toLowerCase() || to.endsWith("@metilde.com")) return Response.json({ error: "Mejla inte butikens egna adresser – använd escalate." }, { status: 400 });

  const since = new Date(Date.now() - 3600_000).toISOString();
  const recent = await supabaseAdmin().from("support_log").select("id", { count: "exact", head: true }).eq("action", "email.sent").eq("customer_email", to).gte("created_at", since);
  if ((recent.count ?? 0) >= MAX_PER_HOUR) return Response.json({ error: `Redan ${MAX_PER_HOUR} mejl till ${to} senaste timmen. Vänta eller eskalera.` }, { status: 429 });

  const html = `<div style="font-family:Arial,sans-serif;font-size:15px;line-height:1.55;color:#1f2a26">${text
    .split(/\n{2,}/)
    .map((p) => `<p style="margin:0 0 14px">${esc(p).replace(/\n/g, "<br>")}</p>`)
    .join("")}</div>`;
  const headers = inReplyTo ? { "In-Reply-To": inReplyTo, References: inReplyTo } : undefined;

  try {
    await sendEmail(to, subject, html, text, { replyTo: company.email, headers });
    await logSupport({ actor: auth.agent.id, action: "email.sent", customerEmail: to, target: subject, summary: text.slice(0, 300), details: { subject, text, in_reply_to: inReplyTo || null } });
    return Response.json({ ok: true });
  } catch (e) {
    const error = e instanceof Error ? e.message : "Mejlet kunde inte skickas.";
    await logSupport({ actor: auth.agent.id, action: "email.sent", customerEmail: to, target: subject, summary: error, details: { subject, text }, ok: false });
    return Response.json({ error }, { status: 502 });
  }
}
