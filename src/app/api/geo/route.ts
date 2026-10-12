/**
 * Besökarens land (Vercels geo-header) till marknadsraden i butiken. Inga personuppgifter sparas;
 * svaret cachas inte så att varje besökare får sitt eget land.
 */
export const dynamic = "force-dynamic";

export function GET(request: Request) {
  const country = request.headers.get("x-vercel-ip-country")?.toUpperCase() ?? null;
  return Response.json({ country }, { headers: { "Cache-Control": "private, no-store" } });
}
