import { parseClickParams, storeClick } from "@/lib/affiliate";

/**
 * Tar emot ett affiliateklick från webbläsaren och sparar det på besökaren.
 * Svarar alltid 204: spårning får aldrig störa besöket.
 */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { visitorId?: unknown; search?: unknown; landingUrl?: unknown; referrer?: unknown };
    const visitor = String(body.visitorId ?? "").trim();
    const search = String(body.search ?? "");
    if (!visitor || visitor.length > 100 || !search) return new Response(null, { status: 204 });
    const click = parseClickParams(search);
    if (!click.clickId) return new Response(null, { status: 204 });
    await storeClick({
      visitorId: visitor,
      click,
      landingUrl: typeof body.landingUrl === "string" ? body.landingUrl : null,
      referrer: typeof body.referrer === "string" ? body.referrer : null,
    });
  } catch (e) {
    console.error("[affiliate/click]", e instanceof Error ? e.message : e);
  }
  return new Response(null, { status: 204 });
}
