/**
 * Central konfiguration för butiken.
 * Allt som är "påståenden" (betyg, antal kunder, kampanjer) styrs härifrån,
 * så att sajten aldrig visar något som inte går att belägga.
 */
export const site = {
  name: "Metilde",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://metilde.com",
  locale: "sv",
  currency: "SEK",
  /** Gräns för fri frakt i Sverige (SEK). Samma värde som shipping_rates för zon "se". */
  freeShippingOver: 499,
  /** Rabatt på prenumeration i procent. */
  subscriptionDiscount: 15,
  /** Rabatt i nyhetsbrevet – sätt till null för att dölja blocket. */
  newsletterDiscount: 15 as number | null,
  social: {
    facebook: "https://www.facebook.com/metilde",
  },
  /**
   * Kampanjbadge i hero. Lämna null när ingen kampanj pågår –
   * Google Merchant Center avvisar sajter med kampanjer som inte går att lösa in.
   */
  campaign: null as { label: string; href: string } | null,
  /** Kundantal visas inte förrän det går att styrka. */
  showCustomerCount: false,
  /**
   * Betyg och stjärnor. Exportens betyg (5,0 med 3 omdömen per produkt) kom från
   * genererade testomdömen i gamla butiken, inte från riktiga kunder. Stjärnor
   * visas först när riktiga omdömen finns i tabellen product_reviews.
   */
  showRatings: false,
};

/** Företagsuppgifter – visas i sidfot, kontakt, villkor och structured data. */
export const company = {
  legalName: "Swedish Treats AB",
  orgNumber: "559506-5359",
  street: "Plåtslagarvägen 19",
  postalCode: "861 36",
  city: "Timrå",
  country: "Sverige",
  countryCode: "SE",
  email: "support@metilde.com",
  phone: "+46 76 251 77 53",
  phoneHref: "tel:+46762517753",
  hours: "Mån–fre 09:00–17:00",
  address: "Plåtslagarvägen 19, 861 36 Timrå, Sverige",
} as const;
