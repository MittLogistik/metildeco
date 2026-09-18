import { emailConfigured, sendEmail } from "@/lib/email";
import { company } from "@/lib/site";

/**
 * Kontakt- och samarbetsformulären. Skickar ett mejl till kundservice via Resend
 * med avsändaren som reply-to, så att svaret går direkt till kunden.
 */

type Body = {
  kind?: "contact" | "partner";
  name?: string;
  email?: string;
  message?: string;
  /** Kontakt */
  topic?: string;
  order?: string;
  /** Samarbete */
  channels?: string[];
  tier?: string;
  handle?: string;
  /** Honungsfälla – ska vara tom */
  website?: string;
};

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const clean = (v: unknown, max: number) => String(v ?? "").trim().slice(0, max);

export async function POST(request: Request) {
  let b: Body;
  try {
    b = (await request.json()) as Body;
  } catch {
    return Response.json({ error: "Ogiltig begäran." }, { status: 400 });
  }
  // Robotar fyller i det dolda fältet; låtsas att det gick bra
  if (clean(b.website, 10)) return Response.json({ ok: true });

  const name = clean(b.name, 120);
  const email = clean(b.email, 200);
  const message = clean(b.message, 5000);
  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || message.length < 10) return Response.json({ error: "Fyll i namn, en giltig e-postadress och ett meddelande." }, { status: 400 });
  if (!emailConfigured()) return Response.json({ error: "Mejlfunktionen är inte aktiverad. Mejla oss direkt på " + company.email + "." }, { status: 503 });

  const isPartner = b.kind === "partner";
  const topic = clean(b.topic, 80);
  const order = clean(b.order, 40);
  const channels = Array.isArray(b.channels) ? b.channels.map((c) => clean(c, 40)).filter(Boolean).slice(0, 10) : [];
  const tier = clean(b.tier, 60);
  const handle = clean(b.handle, 200);

  const subject = isPartner ? `Samarbete: ${channels.join(", ") || "förfrågan"} – ${name}` : `${topic || "Kontakt"}${order ? ` – ${order}` : ""} – ${name}`;
  const lines = isPartner
    ? [`Namn: ${name}`, `E-post: ${email}`, `Kanaler: ${channels.join(", ") || "-"}`, `Följare: ${tier || "-"}`, `Länk/användarnamn: ${handle || "-"}`, "", message]
    : [`Namn: ${name}`, `E-post: ${email}`, `Ärende: ${topic || "-"}`, `Ordernummer: ${order || "-"}`, "", message];
  const text = lines.join("\n");
  const html = `<div style="font-family:Arial,sans-serif;font-size:15px;line-height:1.5;color:#1f2a26"><p><strong>${isPartner ? "Ny samarbetsförfrågan" : "Nytt meddelande från kontaktformuläret"}</strong></p><pre style="white-space:pre-wrap;font-family:inherit">${esc(text)}</pre><p style="color:#6b7772;font-size:13px">Svara på det här mejlet så går svaret till ${esc(email)}.</p></div>`;

  try {
    await sendEmail(company.email, subject, html, text, { replyTo: email });
    return Response.json({ ok: true });
  } catch (e) {
    console.error("[kontakt]", e instanceof Error ? e.message : e);
    return Response.json({ error: "Meddelandet kunde inte skickas just nu. Mejla oss direkt på " + company.email + "." }, { status: 502 });
  }
}
