import { localeForCurrency, markets, type Locale } from "./i18n";

/**
 * Prisformat per valuta: "1 099 kr" (SEK), "21,95 €" (EUR), "149 kr" (DKK), "99 zł" (PLN).
 * Formatet följer valutans marknad. Undantag: på engelska (`locale` "en", Irland) skrivs euro
 * som "€21.95" – det är så irländska kunder läser priser. Skicka med sidans språk där det finns.
 */
export const formatPrice = (amount: number, currency = "SEK", locale?: Locale): string => {
  const rounded = Math.round(amount * 100) / 100;
  const hasDecimals = Math.abs(rounded - Math.round(rounded)) > 0.004;
  const code = currency.toUpperCase();
  const english = locale === "en" && code === "EUR";
  const formatted = new Intl.NumberFormat(english ? markets.en.intl : markets[localeForCurrency(code)].intl, {
    minimumFractionDigits: hasDecimals ? 2 : 0,
    maximumFractionDigits: hasDecimals ? 2 : 0,
  }).format(rounded);
  if (english) return `€${formatted}`;
  if (code === "SEK") return `${formatted} kr`;
  if (code === "EUR") return `${formatted} €`;
  // Utan punkt ("469 kr"): beloppet avslutar ofta en mening, och "kr.." blir fel
  if (code === "DKK") return `${formatted} kr`;
  if (code === "PLN") return `${formatted} zł`;
  return `${formatted} ${code}`;
};

export const formatDate = (iso: string | null | undefined, locale: Locale = "sv"): string => {
  if (!iso) return "";
  return new Intl.DateTimeFormat(markets[locale].intl, { dateStyle: "long" }).format(new Date(iso));
};

export const percentOff = (price: number, oldPrice?: number | null): number | null => {
  if (!oldPrice || oldPrice <= price) return null;
  return Math.round((1 - price / oldPrice) * 100);
};
