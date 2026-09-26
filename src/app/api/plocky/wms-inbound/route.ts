import { handleInbound, plockyInboundKey, verifyInboundKey } from "@/lib/plocky";

/**
 * Tar emot händelser från Plocky (WMS): ping, stock.update och shipment.created.
 * Nyckeln i headern X-Wms-Key måste vara PLOCKY_INBOUND_KEY – samma nyckel som skrivits in på
 * Plockys Webshop-API-kort för butiken.
 */
export async function POST(request: Request) {
  if (!plockyInboundKey()) return Response.json({ success: false, message: "PLOCKY_INBOUND_KEY är inte satt." }, { status: 503 });
  if (!verifyInboundKey(request.headers.get("x-wms-key"))) return Response.json({ success: false, message: "Fel nyckel." }, { status: 401 });
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ success: false, message: "Ogiltig JSON." }, { status: 400 });
  }
  try {
    const r = await handleInbound(body);
    return Response.json(r.body, { status: r.status });
  } catch (e) {
    console.error("[plocky inbound]", e instanceof Error ? e.message : e);
    return Response.json({ success: false, message: "Internt fel." }, { status: 500 });
  }
}
