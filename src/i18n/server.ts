import "server-only";
import { lang } from "next/root-params";
import type { Metadata } from "next";
import { defaultLocale, isLocale, locales, markets, type Locale } from "@/lib/i18n";
import { hasPage, routesOf, translatePath, type RouteKey } from "@/lib/routes";
import { site } from "@/lib/site";

/**
 * Språket för aktuell sida i serverkomponenter, utan att skicka det som prop.
 * Läser rotparametern [lang]. Fungerar inte i route handlers eller serveraktioner – där skickas språket med.
 */
export async function getLocale(): Promise<Locale> {
  const l = await lang();
  return isLocale(l) ? l : defaultLocale;
}

/** Språk, marknad och sökvägar för aktuell sida. */
export async function getI18n() {
  const locale = await getLocale();
  return { locale, market: markets[locale], r: routesOf(locale) };
}

/**
 * canonical + hreflang för en sida. `path` är sidans sökväg på aktuellt språk.
 * `key` anges för sidor som bara finns på vissa språk (då utelämnas de andra i hreflang).
 * `only` begränsar språken, t.ex. för en produkt som inte säljs överallt.
 */
export function alternates(path: string, opts: { key?: RouteKey; only?: Locale[] } = {}): Metadata["alternates"] {
  const langs = locales.filter((l) => (!opts.key || hasPage(opts.key, l)) && (!opts.only || opts.only.includes(l)));
  const languages: Record<string, string> = {};
  for (const l of langs) languages[markets[l].hreflang] = `${site.url}${translatePath(path, l)}`;
  if (langs.includes(defaultLocale)) languages["x-default"] = `${site.url}${translatePath(path, defaultLocale)}`;
  return { canonical: `${site.url}${path}`, languages };
}
