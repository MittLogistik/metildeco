import { revalidatePath, revalidateTag } from "next/cache";
import { campaignBoundaryNear } from "@/lib/campaign";
import { CATALOG_TAG } from "@/lib/catalog";

/**
 * Kampanjens start och slut: sidorna är statiska och cachas upp till en timme, så katalogen
 * förnyas direkt när en kampanj börjar eller slutar. Annars kan en sida visa kampanjpris efter
 * slutet medan kassan tar ordinarie pris. Anropas av Vercel Cron var tionde minut; gör bara
 * något inom 30 minuter efter en gräns.
 */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) return new Response("Unauthorized", { status: 401 });
  const boundary = campaignBoundaryNear(Date.now(), 30 * 60 * 1000);
  if (!boundary) return Response.json({ ok: true, revalidated: false });
  revalidateTag(CATALOG_TAG, "max");
  revalidatePath("/", "layout");
  return Response.json({ ok: true, revalidated: true, boundary });
}
