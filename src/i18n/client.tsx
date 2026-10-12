"use client";

import { createContext, useContext } from "react";
import { defaultLocale, markets, type Locale } from "@/lib/i18n";
import { routesOf } from "@/lib/routes";

/** Språket i klientkomponenter. Sätts av app/[lang]/layout. */
const LocaleContext = createContext<Locale>(defaultLocale);

export function LocaleProvider({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>;
}

export const useLocale = (): Locale => useContext(LocaleContext);

/** Språk, marknad (valuta, land) och sökvägar – samma form som getI18n() på servern. */
export function useI18n() {
  const locale = useLocale();
  return { locale, market: markets[locale], r: routesOf(locale) };
}
