import { authenticateAgent, customerForAgent, isEmail, logSupport } from "@/lib/support-agent";

/**
 * Matilda slår upp en kund på e-postadressen som mejlet kom från: ordrar, leveransstatus,
 * spårning och prenumerationer. Andra kunders uppgifter kan inte hämtas utan deras adress.
 */
export async function GET(request: Request) {
  const auth = await authenticateAgent(request);
  if (!auth.ok) return Response.json({ error: auth.error }, { status: auth.status });
  const email = new URL(request.url).searchParams.get("email")?.trim().toLowerCase() ?? "";
  if (!isEmail(email)) return Response.json({ error: "Ange kundens e-postadress (?email=)." }, { status: 400 });

  const customer = await customerForAgent(email);
  await logSupport({ actor: auth.agent.id, action: "lookup", customerEmail: email, summary: customer ? `${customer.orders.length} ordrar, ${customer.subscriptions.length} prenumerationer` : "Ingen kund med adressen" });
  if (!customer) return Response.json({ found: false, message: "Ingen order med den adressen. Be kunden om ordernumret eller adressen som användes vid köpet." });
  return Response.json({ found: true, customer });
}
