import { revalidatePath } from "next/cache";
import { runSubscriptionCommand, type SubscriptionCommand } from "@/lib/subscriptions";
import { authenticateAgent, isEmail, logSupport, subscriptionBelongsTo } from "@/lib/support-agent";

/**
 * Matilda pausar, återupptar eller avslutar en prenumeration (vid periodens slut). Avsluta direkt
 * och återbetalningar får hon inte göra – sådant eskaleras till en människa.
 */
const allowed: SubscriptionCommand[] = ["pause", "resume", "cancel_period_end"];

type Body = { email?: string; subscription_id?: string; command?: string; reason?: string };

export async function POST(request: Request) {
  const auth = await authenticateAgent(request);
  if (!auth.ok) return Response.json({ error: auth.error }, { status: auth.status });
  if (!auth.agent.allow_subscriptions) return Response.json({ error: "Prenumerationsändringar är avstängda för Matilda. Eskalera ärendet." }, { status: 403 });

  let b: Body;
  try {
    b = (await request.json()) as Body;
  } catch {
    return Response.json({ error: "Ogiltig JSON." }, { status: 400 });
  }
  const email = String(b.email ?? "").trim().toLowerCase();
  const id = String(b.subscription_id ?? "").trim();
  const command = String(b.command ?? "") as SubscriptionCommand;
  const reason = String(b.reason ?? "").trim().slice(0, 1000);
  if (!isEmail(email) || !id.startsWith("sub_")) return Response.json({ error: "Ange email och subscription_id (sub_…)." }, { status: 400 });
  if (!allowed.includes(command)) return Response.json({ error: `command måste vara ${allowed.join(", ")}.` }, { status: 400 });
  if (!reason) return Response.json({ error: "Ange reason: vad kunden bad om, gärna med citat ur mejlet." }, { status: 400 });

  if (!(await subscriptionBelongsTo(id, email))) {
    await logSupport({ actor: auth.agent.id, action: `subscription.${command}`, customerEmail: email, target: id, summary: "Nekad: prenumerationen tillhör inte adressen", details: { reason }, ok: false });
    return Response.json({ error: "Prenumerationen tillhör inte den adressen. Ändra ingenting; be kunden skriva från adressen som användes vid köpet." }, { status: 403 });
  }

  try {
    const message = await runSubscriptionCommand(id, command);
    await logSupport({ actor: auth.agent.id, action: `subscription.${command}`, customerEmail: email, target: id, summary: message, details: { reason } });
    revalidatePath("/admin", "layout");
    revalidatePath("/sv/mitt-konto");
    return Response.json({ ok: true, message });
  } catch (e) {
    const error = e instanceof Error ? e.message : "Stripe svarade med ett fel.";
    await logSupport({ actor: auth.agent.id, action: `subscription.${command}`, customerEmail: email, target: id, summary: error, details: { reason }, ok: false });
    return Response.json({ error, hint: "Lova inte kunden att det är gjort. Eskalera ärendet." }, { status: 502 });
  }
}
