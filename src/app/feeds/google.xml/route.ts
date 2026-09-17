import { buildGoogleFeed } from "@/lib/feeds";

/** Google Merchant Center hämtar feeden här: /feeds/google.xml */
export async function GET() {
  const xml = await buildGoogleFeed();
  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=900, s-maxage=900, stale-while-revalidate=3600",
    },
  });
}
