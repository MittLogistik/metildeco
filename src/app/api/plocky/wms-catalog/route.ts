import { plockyCatalog, plockyInboundKey, verifyInboundKey } from "@/lib/plocky";

/** Artikelkatalog till Plockys "Synka artiklar": GET /api/plocky/wms-catalog?resource=products med X-Wms-Key. */
export async function GET(request: Request) {
  if (!plockyInboundKey()) return Response.json({ success: false, message: "PLOCKY_INBOUND_KEY är inte satt." }, { status: 503 });
  if (!verifyInboundKey(request.headers.get("x-wms-key"))) return Response.json({ success: false, message: "Fel nyckel." }, { status: 401 });
  const resource = new URL(request.url).searchParams.get("resource") ?? "products";
  if (resource !== "products") return Response.json({ success: false, message: `Okänd resurs: ${resource}` }, { status: 404 });
  return Response.json(await plockyCatalog());
}
