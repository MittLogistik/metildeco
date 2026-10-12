import { localeForCurrency, markets, type Locale } from "./i18n";

/**
 * Prisformat per valuta: "1 099 kr" (SEK), "21,95 €" (EUR), "149 kr" (DKK).
 * Formatet följer valutans marknad, inte sidans språk, så att samma belopp alltid ser likadant ut.
 */
export const formatPrice = (amount: number, currency = "SEK"): string => {
  const rounded = Math.round(amount * 100) / 100;
  const hasDecimals = Math.abs(rounded - Math.round(rounded)) > 0.004;
  const code = currency.toUpperCase();
  const formatted = new Intl.NumberFormat(markets[localeForCurrency(code)].intl, {
    minimumFractionDigits: hasDecimals ? 2 : 0,
    maximumFractionDigits: hasDecimals ? 2 : 0,
  }).format(rounded);
  if (code === "SEK") return `${formatted} kr`;
  if (code === "EUR") return `${formatted} €`;
  // Utan punkt ("469 kr"): beloppet avslutar ofta en mening, och "kr.." blir fel
  if (code === "DKK") return `${formatted} kr`;
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
