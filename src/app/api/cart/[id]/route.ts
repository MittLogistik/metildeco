import { getCartLines } from "@/lib/abandoned";

/** Raderna i en sparad korg, för återställningslänken i påminnelsemejlen. Id:t är en uuid. */
export async function GET(_request: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const cart = await getCartLines(id).catch(() => null);
  if (!cart) return Response.json({ error: "Korgen finns inte." }, { status: 404 });
  return Response.json(cart, { headers: { "cache-control": "no-store" } });
}
