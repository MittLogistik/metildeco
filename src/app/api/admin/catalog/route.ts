import { getAdminUser } from "@/lib/auth";
import {
  attachCard,
  createCatalog,
  deleteCatalog,
  getOne,
  MAX_CARDS,
  publishCatalog,
  removeCard,
  reorderCards,
  saveCopy,
  signCatalogUpload,
  sliceWideImage,
  suggestCopy,
} from "@/lib/catalog-ads";

/** Bilderna laddas upp direkt till lagringen; servern beskär, delar och sparar. */
export const maxDuration = 300;

type Body = {
  action?: string;
  id?: string;
  label?: string;
  ext?: string;
  path?: string;
  position?: number;
  slug?: string;
  slugs?: unknown;
  cardIds?: unknown;
  cardId?: string;
  primaryText?: string;
  headline?: string;
  dailyBudget?: number;
};

export async function POST(request: Request) {
  if (!(await getAdminUser())) return Response.json({ error: "Inte inloggad." }, { status: 401 });
  let b: Body;
  try {
    b = (await request.json()) as Body;
  } catch {
    return Response.json({ error: "Ogiltig begäran." }, { status: 400 });
  }
  const id = String(b.id ?? "");

  try {
    switch (b.action) {
      case "create":
        return Response.json({ ok: true, id: await createCatalog(String(b.label ?? "")) });

      case "sign": {
        if (!id) return Response.json({ error: "id krävs." }, { status: 400 });
        return Response.json({ ok: true, ...(await signCatalogUpload(id, String(b.ext ?? "jpg").toLowerCase())) });
      }

      case "attach": {
        const position = Math.max(1, Math.min(MAX_CARDS, Math.round(Number(b.position) || 1)));
        if (!id || !b.path || !b.slug) return Response.json({ error: "id, path, position och slug krävs." }, { status: 400 });
        return Response.json({ ok: true, card: await attachCard({ catalogId: id, position, slug: String(b.slug), path: String(b.path) }) });
      }

      case "slice": {
        const slugs = Array.isArray(b.slugs) ? b.slugs.map(String) : [];
        if (!id || !b.path || !slugs.length) return Response.json({ error: "id, path och slugs krävs." }, { status: 400 });
        return Response.json({ ok: true, cards: await sliceWideImage({ catalogId: id, path: String(b.path), slugs }) });
      }

      case "reorder": {
        const cardIds = Array.isArray(b.cardIds) ? b.cardIds.map(String) : [];
        if (!id || !cardIds.length) return Response.json({ error: "id och cardIds krävs." }, { status: 400 });
        await reorderCards(id, cardIds);
        return Response.json({ ok: true, catalog: await getOne(id) });
      }

      case "removeCard": {
        if (!b.cardId) return Response.json({ error: "cardId krävs." }, { status: 400 });
        await removeCard(String(b.cardId));
        return Response.json({ ok: true, catalog: id ? await getOne(id) : null });
      }

      case "suggest": {
        if (!id) return Response.json({ error: "id krävs." }, { status: 400 });
        return Response.json({ ok: true, ...(await suggestCopy(id)) });
      }

      case "saveCopy": {
        if (!id) return Response.json({ error: "id krävs." }, { status: 400 });
        const primaryText = String(b.primaryText ?? "").trim();
        if (primaryText.length < 20) return Response.json({ error: "Annonstexten är för kort." }, { status: 400 });
        await saveCopy({ catalogId: id, primaryText, headline: String(b.headline ?? "") });
        return Response.json({ ok: true, catalog: await getOne(id) });
      }

      case "publish": {
        const budget = Number(b.dailyBudget);
        if (!id) return Response.json({ error: "id krävs." }, { status: 400 });
        if (!Number.isFinite(budget) || budget < 1) return Response.json({ error: "Ange en daglig budget på minst 1." }, { status: 400 });
        return Response.json({ ok: true, ...(await publishCatalog({ id, dailyBudget: budget })) });
      }

      case "delete": {
        if (!id) return Response.json({ error: "id krävs." }, { status: 400 });
        return Response.json({ ok: true, removed: await deleteCatalog(id) });
      }

      default:
        return Response.json({ error: "Okänd åtgärd." }, { status: 400 });
    }
  } catch (e) {
    return Response.json({ error: e instanceof Error ? e.message : "Något gick fel." }, { status: 500 });
  }
}
