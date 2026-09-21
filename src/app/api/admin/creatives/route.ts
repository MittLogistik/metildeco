import type { Format } from "@/content/ad-concepts";
import { conceptById, formatById } from "@/content/ad-concepts";
import { getAdminUser } from "@/lib/auth";
import { generateCreative, realReview, regenerateCreative } from "@/lib/creative-studio";

/**
 * Creative Studio: en bild i taget, så att varje anrop håller sig under serverns tidsgräns.
 * Webbläsaren kör igenom listan och visar förloppet per bild.
 */
export const maxDuration = 300;

type Body = { action?: string; slug?: string; conceptId?: string; format?: string; groupId?: string; customInstructions?: string; review?: string; id?: string };

export async function POST(request: Request) {
  if (!(await getAdminUser())) return Response.json({ error: "Inte inloggad." }, { status: 401 });
  let b: Body;
  try {
    b = (await request.json()) as Body;
  } catch {
    return Response.json({ error: "Ogiltig begäran." }, { status: 400 });
  }

  try {
    if (b.action === "regenerate") {
      if (!b.id) return Response.json({ error: "id krävs." }, { status: 400 });
      const r = await regenerateCreative(b.id, b.customInstructions);
      return Response.json({ ok: true, id: r.creative.id, name: r.name, url: r.creative.url, score: r.score, rejected: r.rejected, note: r.note });
    }

    const slug = String(b.slug ?? "");
    const concept = conceptById(String(b.conceptId ?? ""));
    const format = formatById(String(b.format ?? ""));
    if (!slug || !concept || !format) return Response.json({ error: "slug, conceptId och format krävs." }, { status: 400 });

    // Omdömeskonceptet får bara använda en äkta recension: från produktdatan eller inskriven av oss
    const review = concept.wantsReview ? (b.review?.trim() || (await realReview(slug))?.body) : undefined;
    const r = await generateCreative({
      slug,
      conceptId: concept.id,
      format: format.id as Format,
      groupId: b.groupId || undefined,
      customInstructions: b.customInstructions,
      review,
    });
    return Response.json({ ok: true, id: r.creative.id, name: r.name, url: r.creative.url, score: r.score, rejected: r.rejected, note: r.note });
  } catch (e) {
    return Response.json({ error: e instanceof Error ? e.message : "Bilden kunde inte skapas." }, { status: 500 });
  }
}
