/**
 * Central konfiguration för butiken.
 * Allt som är "påståenden" (betyg, antal kunder, kampanjer) styrs härifrån,
 * så att sajten aldrig visar något som inte går att belägga.
 */
/**
 * Sajtens publika adress. NEXT_PUBLIC_SITE_URL i första hand; på Vercel används
 * annars projektets egen adress, och lokalt/produktion faller vi tillbaka på metilde.com.
 */
const resolveSiteUrl = (): string => {
  const candidates = [
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL && `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`,
    process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`,
    "https://metilde.com",
  ];
  for (const c of candidates) {
    if (!c) continue;
    try {
      return new URL(c).origin;
    } catch {
      /* ogiltigt värde – prova nästa */
    }
  }
  return "https://metilde.com";
};

export const site = {
  name: "Metilde",
  url: resolveSiteUrl(),
  /** Bara den riktiga domänen får indexeras – testadresser på vercel.app ska inte hamna i Google. */
  get indexable() {
    const host = new URL(this.url).hostname;
    return host === "metilde.com" || host.endsWith(".metilde.com");
  },
  locale: "sv",
  currency: "SEK",
  /** Gräns för fri frakt i Sverige (SEK). Samma värde som shipping_rates för zon "se". */
  freeShippingOver: 499,
  /** Rabatt på prenumeration i procent. */
  subscriptionDiscount: 15,
  /** Rabatt i nyhetsbrevet – sätt till null för att dölja blocket. */
  // Av tills formuläret faktiskt sparar adressen och skickar koden (Merchant Center: löfte som inte hålls)
  newsletterDiscount: null as number | null,
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

type Seller = {
  legalName: string;
  /** "Org.nr" för svenska bolag, "EIN" för amerikanska. */
  idLabel: string;
  orgNumber: string;
  /** EU-momsnummer, om bolaget har ett. */
  vatId: string | null;
  street: string;
  postalCode: string;
  city: string;
  country: string;
  countryCode: string;
  address: string;
  phone: string;
  phoneHref: string;
  /** Adressen i sidfoten. Säljarens adress finns alltid på kontaktsidan och i villkoren. */
  addressInFooter: boolean;
};

/** Lager, packning, leveranser och returer – alltid i Sverige. */
export const logistics = {
  legalName: "Swedish Treats AB",
  orgNumber: "559506-5359",
  address: "Plåtslagarvägen 19, 861 36 Timrå, Sverige",
} as const;

const sellers = {
  "swedish-treats": {
    legalName: "Swedish Treats AB",
    idLabel: "Org.nr",
    orgNumber: "559506-5359",
    vatId: "SE559506535901",
    street: "Plåtslagarvägen 19",
    postalCode: "861 36",
    city: "Timrå",
    country: "Sverige",
    countryCode: "SE",
    address: "Plåtslagarvägen 19, 861 36 Timrå, Sverige",
    phone: "+46 76 251 77 53",
    phoneHref: "tel:+46762517753",
    addressInFooter: true,
  },
  "nordic-wave": {
    legalName: "Nordic Wave LLC",
    idLabel: "EIN",
    orgNumber: "41-4990099",
    vatId: null,
    street: "1209 Mountain Road Pl NE Ste R",
    postalCode: "NM 87110",
    city: "Albuquerque",
    country: "USA",
    countryCode: "US",
    address: "1209 Mountain Road Pl NE Ste R, Albuquerque, NM 87110, USA",
    phone: "+1 505 523 0600",
    phoneHref: "tel:+15055230600",
    addressInFooter: false,
  },
} satisfies Record<string, Seller>;

/**
 * Vilket bolag som är säljare. Byts till "nordic-wave" FÖRST när Stripe-kontot, momsen och
 * logistikavtalet är flyttade till Nordic Wave LLC – sajten ska alltid visa det bolag som
 * faktiskt tar betalt (konsumentlagen och Merchant Center). Samma dag ändras företagsuppgifterna
 * i Merchant Center, Google Ads och Stripes kvitton.
 */
export const ACTIVE_SELLER: keyof typeof sellers = "nordic-wave";

/** Företagsuppgifter (säljaren) – visas i sidfot, kontakt, villkor, mejl och structured data. */
export const company = {
  ...(sellers[ACTIVE_SELLER] as Seller),
  email: "support@metilde.com",
  hours: "Mån–fre 09:00–17:00",
  /** Sköts logistiken av ett annat bolag än säljaren? Då nämns det i villkoren. */
  separateLogistics: sellers[ACTIVE_SELLER].legalName !== logistics.legalName,
};
