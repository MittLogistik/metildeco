import { emailConfigured, sendEmail } from "@/lib/email";
import { company } from "@/lib/site";
import { authenticateAgent, isEmail, logSupport } from "@/lib/support-agent";

/**
 * Ärenden Matilda inte får eller kan lösa (återbetalning, reklamation, skadat paket, adressbyte,
 * hot, osäkerhet) skickas till SUPPORT_ESCALATION_EMAIL (annars kundtjänstens adress) med kunden som
 * reply-to och loggas. Läser Matilda samma inkorg ska hon hoppa över mejl med ämnet "Matilda: …".
 */
type Body = { email?: string; subject?: string; summary?: string; customer_message?: string; urgency?: string };

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export async function POST(request: Request) {
  const auth = await authenticateAgent(request);
  if (!auth.ok) return Response.json({ error: auth.error }, { status: auth.status });
  let b: Body;
  try {
    b = (await request.json()) as Body;
  } catch {
    return Response.json({ error: "Ogiltig JSON." }, { status: 400 });
  }
  const email = String(b.email ?? "").trim().toLowerCase();
  const subject = String(b.subject ?? "").trim().slice(0, 200);
  const summary = String(b.summary ?? "").trim().slice(0, 4000);
  const original = String(b.customer_message ?? "").trim().slice(0, 10000);
  const urgent = b.urgency === "high";
  if (!subject || summary.length < 10) return Response.json({ error: "Ange subject och summary." }, { status: 400 });

  const text = [`Matilda lämnar över ett ärende${urgent ? " (BRÅDSKANDE)" : ""}.`, "", `Kund: ${email || "-"}`, "", summary, "", "--- Kundens mejl ---", original || "-"].join("\n");
  const html = `<div style="font-family:Arial,sans-serif;font-size:15px;line-height:1.5;color:#1f2a26"><pre style="white-space:pre-wrap;font-family:inherit">${esc(text)}</pre></div>`;
  try {
    if (emailConfigured()) await sendEmail(process.env.SUPPORT_ESCALATION_EMAIL || company.email, `${urgent ? "[Brådskande] " : ""}Matilda: ${subject}`, html, text, isEmail(email) ? { replyTo: email } : {});
    await logSupport({ actor: auth.agent.id, action: "escalate", customerEmail: isEmail(email) ? email : null, target: subject, summary, details: { urgency: urgent ? "high" : "normal", customer_message: original } });
    return Response.json({ ok: true, message: "Ärendet är skickat till kundtjänsten." });
  } catch (e) {
    const error = e instanceof Error ? e.message : "Kunde inte eskalera.";
    await logSupport({ actor: auth.agent.id, action: "escalate", customerEmail: isEmail(email) ? email : null, target: subject, summary: error, ok: false });
    return Response.json({ error }, { status: 502 });
  }
}
