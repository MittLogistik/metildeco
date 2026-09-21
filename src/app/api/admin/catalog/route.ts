import { getAdminUser } from "@/lib/auth";
import { buildCatalog, deleteCatalog, publishCatalog } from "@/lib/catalog-ads";

/** En variant i taget: bakgrund, kort och text tar ungefär en minut. */
export const maxDuration = 300;

type Body = { action?: string; slugs?: unknown; variantId?: string; customInstructions?: string; id?: string; dailyBudget?: number; campaignId?: string; adsetId?: string };

export async function POST(request: Request) {
  if (!(await getAdminUser())) return Response.json({ error: "Inte inloggad." }, { status: 401 });
  let b: Body;
  try {
    b = (await request.json()) as Body;
  } catch {
    return Response.json({ error: "Ogiltig begäran." }, { status: 400 });
  }

  try {
    if (b.action === "delete") {
      if (!b.id) return Response.json({ error: "id krävs." }, { status: 400 });
      const removed = await deleteCatalog(b.id);
      return Response.json({ ok: true, removed });
    }
    if (b.action === "publish") {
      if (!b.id) return Response.json({ error: "id krävs." }, { status: 400 });
      const budget = Number(b.dailyBudget);
      if (!Number.isFinite(budget) || budget < 1) return Response.json({ error: "Ange en daglig budget på minst 1." }, { status: 400 });
      const r = await publishCatalog({ id: b.id, dailyBudget: budget, campaignId: b.campaignId, adsetId: b.adsetId });
      return Response.json({ ok: true, ...r });
    }

    const slugs = Array.isArray(b.slugs) ? b.slugs.map(String) : [];
    if (!b.variantId || slugs.length === 0) return Response.json({ error: "variantId och slugs krävs." }, { status: 400 });
    const catalog = await buildCatalog({ slugs, variantId: b.variantId, customInstructions: b.customInstructions });
    return Response.json({ ok: true, catalog });
  } catch (e) {
    return Response.json({ error: e instanceof Error ? e.message : "Katalogen kunde inte skapas." }, { status: 500 });
  }
}
