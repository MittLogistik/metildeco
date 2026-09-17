import { buildMetaFeed } from "@/lib/feeds";

/** Meta Commerce Manager hämtar produktkatalogen här: /feeds/meta.xml */
export async function GET() {
  const xml = await buildMetaFeed();
  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=900, s-maxage=900, stale-while-revalidate=3600",
    },
  });
}
