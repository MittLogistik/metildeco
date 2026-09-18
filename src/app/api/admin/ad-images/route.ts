import { generateOne } from "@/lib/ad-images";
import { getAdminUser } from "@/lib/auth";

/** Genererar en annonsbild åt gången åt adminpanelen. Får ta upp till fem minuter (Higgsfield + granskning). */
export const maxDuration = 300;

export async function POST(request: Request) {
  if (!(await getAdminUser())) return Response.json({ error: "Inte inloggad." }, { status: 401 });
  let b: { slug?: string; sceneId?: string; format?: string; groupId?: string; presetId?: string; styleId?: string; quality?: string; mediaBase?: string };
  try {
    b = (await request.json()) as typeof b;
  } catch {
    return Response.json({ error: "Ogiltig begäran." }, { status: 400 });
  }
  if (!b.slug || !b.sceneId || !b.format || !b.mediaBase) return Response.json({ error: "slug, sceneId, format och mediaBase krävs." }, { status: 400 });
  const quality = b.quality === "low" || b.quality === "medium" || b.quality === "high" ? b.quality : undefined;
  try {
    const r = await generateOne({ slug: b.slug, sceneId: b.sceneId, format: b.format, mediaBase: b.mediaBase, groupId: b.groupId || undefined, presetId: b.presetId || undefined, styleId: b.styleId || undefined, quality });
    return Response.json({ ok: true, label: r.label, url: r.creative.url, score: r.creative.image_score, rejected: r.rejected, note: r.note });
  } catch (e) {
    return Response.json({ error: e instanceof Error ? e.message : "Genereringen misslyckades." }, { status: 502 });
  }
}
