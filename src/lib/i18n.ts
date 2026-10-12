/**
 * Språk och marknader. Ett språk = en marknad: land, valuta, fraktzon och Stripe-språk.
 * Kassan levererar bara till marknadens land, så att valuta, frakt och villkor alltid stämmer.
 *
 * Används av både server- och klientkomponenter (inget server-only här).
 */
export const locales = ["sv", "fi", "da"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "sv";

export const isLocale = (v: unknown): v is Locale => typeof v === "string" && (locales as readonly string[]).includes(v);

export type Currency = "SEK" | "EUR" | "DKK";

export type Market = {
  locale: Locale;
  /** Landet kassan levererar till (ISO 3166-1 alpha-2). */
  country: "SE" | "FI" | "DK";
  currency: Currency;
  /** Zon i data/shipping_rates.json. */
  shippingZone: string;
  /** Intl-format för datum och tal. */
  intl: string;
  /** hreflang och og:locale. */
  hreflang: string;
  ogLocale: string;
  stripeLocale: "sv" | "fi" | "da";
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
};

export const marketFor = (locale: Locale): Market => markets[locale];

/** Marknaden för ett leveransland (feeds, ordrar). */
export const localeForCountry = (country: string | null | undefined): Locale =>
  locales.find((l) => markets[l].country === (country ?? "").toUpperCase()) ?? defaultLocale;

/** Marknaden för en valuta. */
export const localeForCurrency = (currency: string | null | undefined): Locale =>
  locales.find((l) => markets[l].currency === (currency ?? "").toUpperCase()) ?? defaultLocale;

/**
 * Avrundning av räknade priser (mängdrabatt, prenumeration). Kronor till hela kronor,
 * euro till hela cent. Samma funktion i korg, kassa och på servern så att summorna stämmer.
 */
export const roundPrice = (amount: number, currency: string): number =>
  currency === "EUR" ? Math.round(amount * 100) / 100 : Math.round(amount);
