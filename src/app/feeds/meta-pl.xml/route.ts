import { buildMetaFeed } from "@/lib/feeds";

/** Feeden för marknaden "pl": /feeds/meta-pl.xml */
export async function GET() {
  const xml = await buildMetaFeed("pl");
  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=900, s-maxage=900, stale-while-revalidate=3600",
    },
  });
}
