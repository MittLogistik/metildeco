import { releaseScheduledOrders } from "@/lib/orders";

/**
 * Släpper planerade prenumerationsleveranser till packning (status paid) när
 * release_at passerats, dvs. fyra dagar före planerad leverans. Anropas av Vercel Cron.
 */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) return new Response("Unauthorized", { status: 401 });
  try {
    const released = await releaseScheduledOrders();
    return Response.json({ ok: true, released: released.map((o) => o.order_number) });
  } catch (e) {
    return Response.json({ ok: false, error: e instanceof Error ? e.message : String(e) }, { status: 500 });
  }
}
