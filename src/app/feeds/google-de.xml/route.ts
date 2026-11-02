import { buildGoogleFeed } from "@/lib/feeds";

/** Feeden för marknaden "de": /feeds/google-de.xml */
export async function GET() {
  const xml = await buildGoogleFeed("de");
  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=900, s-maxage=900, stale-while-revalidate=3600",
    },
  });
}
