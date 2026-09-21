import { registerUploadedCreative, signAdUpload, uploadFormats } from "@/lib/ad-images";
import { getAdminUser } from "@/lib/auth";
import { getProduct } from "@/lib/catalog";
import { primaryImage } from "@/lib/products";

/**
 * Egna annonsbilder laddas upp direkt från webbläsaren till lagringen: först "sign"
 * som ger en signerad adress, sedan "commit" som registrerar och granskar bilden.
 * Filen passerar aldrig en serveraktion, som bara tar emot någon megabyte.
 */
export const maxDuration = 120;

const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type Body = { step?: string; slug?: string; format?: string; groupId?: string; ext?: string; path?: string; mediaBase?: string };

export async function POST(request: Request) {
  if (!(await getAdminUser())) return Response.json({ error: "Inte inloggad." }, { status: 401 });
  let b: Body;
  try {
    b = (await request.json()) as Body;
  } catch {
    return Response.json({ error: "Ogiltig begäran." }, { status: 400 });
  }

  const slug = String(b.slug ?? "");
  const format = String(b.format ?? "");
  const groupId = String(b.groupId ?? "");
  if (!(uploadFormats as readonly string[]).includes(format)) return Response.json({ error: "Okänt format." }, { status: 400 });
  if (!uuid.test(groupId)) return Response.json({ error: "Ogiltigt grupp-id." }, { status: 400 });
  const product = await getProduct(slug);
  if (!product) return Response.json({ error: "Okänd produkt." }, { status: 400 });

  try {
    if (b.step === "sign") {
      const { signedUrl, path } = await signAdUpload({ slug, groupId, format, ext: String(b.ext ?? "jpg").toLowerCase() });
      return Response.json({ ok: true, signedUrl, path });
    }
    if (b.step === "commit") {
      const path = String(b.path ?? "");
      // Bara sökvägar vi själva signerat får registreras
      if (!path.startsWith(`ads/${slug}/${groupId}-`)) return Response.json({ error: "Ogiltig sökväg." }, { status: 400 });
      const mediaBase = String(b.mediaBase ?? "").trim().replace(/\/$/, "");
      const referenceUrl = mediaBase ? `${mediaBase}${primaryImage(product)}` : undefined;
      const r = await registerUploadedCreative({ slug, groupId, format, path, referenceUrl });
      return Response.json({ ok: true, url: r.creative.url, score: r.creative.image_score, rejected: r.rejected, note: r.note });
    }
    return Response.json({ error: "Okänt steg." }, { status: 400 });
  } catch (e) {
    return Response.json({ error: e instanceof Error ? e.message : "Uppladdningen misslyckades." }, { status: 500 });
  }
}
