/**
 * Språk och marknader. Ett språk = en marknad: land, valuta, fraktzon och Stripe-språk.
 * Kassan levererar bara till marknadens land, så att valuta, frakt och villkor alltid stämmer.
 *
 * Används av både server- och klientkomponenter (inget server-only här).
 */
export const locales = ["sv", "fi", "da", "nl", "de", "fr", "en", "pl"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "sv";

export const isLocale = (v: unknown): v is Locale => typeof v === "string" && (locales as readonly string[]).includes(v);

export type Currency = "SEK" | "EUR" | "DKK" | "PLN";

export type Market = {
  locale: Locale;
  /** Huvudlandet (ISO 3166-1 alpha-2): geo, feeds, ordrar. */
  country: string;
  /**
   * Fler länder som marknaden levererar till, med samma språk, valuta och fraktzon
   * (t.ex. Österrike och Luxemburg på tyska). Kassan tar emot alla; geo väljer huvudmarknaden först.
   */
  extraCountries?: string[];
  currency: Currency;
  /** Zon i data/shipping_rates.json. */
  shippingZone: string;
  /** Intl-format för datum och tal. */
  intl: string;
  /** hreflang och og:locale. */
  hreflang: string;
  /** hreflang för övriga länder på samma språk, t.ex. de-AT. */
  extraHreflangs?: string[];
  ogLocale: string;
  stripeLocale: "sv" | "fi" | "da" | "nl" | "de" | "fr" | "en" | "pl";
  /** Avdrag för returfrakt vid ångrat köp (i marknadens valuta). Samma siffra som i villkoren. */
  returnFee: number;
  /** Leveranstid i arbetsdagar efter att paketet lämnat lagret. */
  deliveryDays: [number, number];
  /** Språkets namn på språket självt (språkväljaren). */
  languageName: string;
  countryName: string;
};

export const markets: Record<Locale, Market> = {
  sv: {
    locale: "sv",
    country: "SE",
    currency: "SEK",
    shippingZone: "se",
    intl: "sv-SE",
    hreflang: "sv-SE",
    ogLocale: "sv_SE",
    stripeLocale: "sv",
    returnFee: 79,
    deliveryDays: [1, 3],
    languageName: "Svenska",
    countryName: "Sverige",
  },
  fi: {
    locale: "fi",
    country: "FI",
    currency: "EUR",
    shippingZone: "nordic",
    intl: "fi-FI",
    hreflang: "fi-FI",
    ogLocale: "fi_FI",
    stripeLocale: "fi",
    returnFee: 8,
    deliveryDays: [2, 5],
    languageName: "Suomi",
    countryName: "Suomi",
  },
  da: {
    locale: "da",
    country: "DK",
    currency: "DKK",
    shippingZone: "nordic",
    intl: "da-DK",
    hreflang: "da-DK",
    ogLocale: "da_DK",
    stripeLocale: "da",
    returnFee: 59,
    deliveryDays: [2, 5],
    languageName: "Dansk",
    countryName: "Danmark",
  },
  nl: {
    locale: "nl",
    country: "NL",
    currency: "EUR",
    // EU-zonen i data/shipping_rates.json (spårbart brev 8 €, fri frakt över 79 €)
    shippingZone: "eu",
    intl: "nl-NL",
    hreflang: "nl-NL",
    extraHreflangs: ["nl-BE"],
    ogLocale: "nl_NL",
    stripeLocale: "nl",
    returnFee: 8,
    deliveryDays: [3, 6],
    languageName: "Nederlands",
    countryName: "Nederland",
    extraCountries: ["BE"],
  },
  de: {
    locale: "de",
    country: "DE",
    extraCountries: ["AT", "LU"],
    currency: "EUR",
    shippingZone: "eu",
    intl: "de-DE",
    hreflang: "de-DE",
    extraHreflangs: ["de-AT", "de-LU"],
    ogLocale: "de_DE",
    stripeLocale: "de",
    returnFee: 8,
    deliveryDays: [3, 6],
    languageName: "Deutsch",
    countryName: "Deutschland",
  },
  fr: {
    locale: "fr",
    country: "FR",
    extraCountries: ["BE", "LU"],
    currency: "EUR",
    shippingZone: "eu",
    intl: "fr-FR",
    hreflang: "fr-FR",
    extraHreflangs: ["fr-BE", "fr-LU"],
    ogLocale: "fr_FR",
    stripeLocale: "fr",
    returnFee: 8,
    deliveryDays: [3, 6],
    languageName: "Français",
    countryName: "France",
  },
  en: {
    locale: "en",
    country: "IE",
    currency: "EUR",
    shippingZone: "eu",
    intl: "en-IE",
    hreflang: "en-IE",
    ogLocale: "en_IE",
    stripeLocale: "en",
    returnFee: 8,
    deliveryDays: [3, 6],
    languageName: "English",
    countryName: "Ireland",
  },
  pl: {
    locale: "pl",
    country: "PL",
    currency: "PLN",
    shippingZone: "eu",
    intl: "pl-PL",
    hreflang: "pl-PL",
    ogLocale: "pl_PL",
    stripeLocale: "pl",
    returnFee: 34,
    deliveryDays: [3, 6],
    languageName: "Polski",
    countryName: "Polska",
  },
};

export const marketFor = (locale: Locale): Market => markets[locale];

/** Alla länder en marknad levererar till (huvudlandet först). */
export const countriesOf = (locale: Locale): string[] => [markets[locale].country, ...(markets[locale].extraCountries ?? [])];

/** Marknaden för ett leveransland (feeds, ordrar, geo). Huvudland går före; annars första marknaden som levererar dit. */
export const localeForCountry = (country: string | null | undefined): Locale => {
  const c = (country ?? "").toUpperCase();
  return locales.find((l) => markets[l].country === c) ?? locales.find((l) => markets[l].extraCountries?.includes(c)) ?? defaultLocale;
};

/** Alla hreflang-koder för ett språk (huvudland + övriga länder). */
export const hreflangsOf = (locale: Locale): string[] => [markets[locale].hreflang, ...(markets[locale].extraHreflangs ?? [])];

/** Marknaden för en valuta. */
export const localeForCurrency = (currency: string | null | undefined): Locale =>
  locales.find((l) => markets[l].currency === (currency ?? "").toUpperCase()) ?? defaultLocale;

/**
 * Avrundning av räknade priser (mängdrabatt, prenumeration). Kronor till hela kronor,
 * euro till hela cent. Samma funktion i korg, kassa och på servern så att summorna stämmer.
 */
export const roundPrice = (amount: number, currency: string): number =>
  currency === "EUR" ? Math.round(amount * 100) / 100 : Math.round(amount);
