/**
 * Googles annonsklick-parametrar som `url_passthrough` för vidare i adressen när besökaren inte
 * har godkänt cookies. Utan samtycke sparas de aldrig i cookie eller localStorage – bara i adressen
 * (och i minnet medan sidan är öppen), så att Google kan koppla ett senare samtycke eller köp till klicket.
 * Gemensam för webbläsare och server.
 */
export const CLICK_PARAMS = ["gclid", "gclsrc", "dclid", "gbraid", "wbraid", "gad_source", "gad_campaignid", "gcl_aw", "_gl"] as const;

/** Klickparametrarna i en söksträng (med eller utan "?"), högst 300 tecken per värde. */
export function pickClickParams(search: string | Record<string, unknown> | null | undefined): [string, string][] {
  if (!search) return [];
  const params = typeof search === "string" ? new URLSearchParams(search) : null;
  const get = (k: string) => (params ? params.get(k) : typeof search === "object" && typeof search[k] === "string" ? search[k] : null);
  const out: [string, string][] = [];
  for (const k of CLICK_PARAMS) {
    const v = get(k)?.trim();
    if (v && v.length <= 300 && /^[\w.~*-]+$/.test(v)) out.push([k, v]);
  }
  return out;
}

/** Lägger till de klickparametrar som saknas i `url`. Returnerar null om inget behövde ändras. */
export function withClickParams(url: URL, params: [string, string][]): URL | null {
  const missing = params.filter(([k]) => !url.searchParams.has(k));
  if (missing.length === 0) return null;
  const next = new URL(url.href);
  for (const [k, v] of missing) next.searchParams.set(k, v);
  return next;
}
