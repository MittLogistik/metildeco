import { defaultLocale, isLocale, locales, type Locale } from "./i18n";

/**
 * Sökvägar per språk. Mapparna i src/app/[lang] har de svenska namnen; övriga språk har egna
 * slugar (samma som gamla butiken) som skrivs om till de svenska mapparna i next.config.
 * Nyckeln är sidans id i koden – slugarna är det som syns i URL:en.
 */
export const routeSlugs = {
  products: { sv: "produkter", fi: "tuotteet", da: "produkter", nl: "producten", de: "produkte", fr: "produits", en: "products", pl: "produkty" },
  product: { sv: "produkt", fi: "tuote", da: "produkt", nl: "product", de: "produkt", fr: "produit", en: "product", pl: "produkt" },
  bundle: { sv: "paket", fi: "paketti", da: "pakke", nl: "pakket", de: "paket", fr: "coffret", en: "bundle", pl: "zestaw" },
  goals: { sv: "mal", fi: "tavoitteet", da: "maal", nl: "doelen", de: "ziele", fr: "objectifs", en: "goals", pl: "cele" },
  articles: { sv: "artiklar", fi: "artikkelit", da: "artikler", nl: "artikelen", de: "artikel", fr: "articles", en: "articles", pl: "artykuly" },
  subscription: { sv: "prenumeration", fi: "tilaus", da: "abonnement", nl: "abonnement", de: "abonnement", fr: "abonnement", en: "subscription", pl: "subskrypcja" },
  story: { sv: "var-historia", fi: "tarinamme", da: "vores-historie", nl: "ons-verhaal", de: "unsere-geschichte", fr: "notre-histoire", en: "our-story", pl: "nasza-historia" },
  faq: { sv: "faq", fi: "faq", da: "faq", nl: "faq", de: "faq", fr: "faq", en: "faq", pl: "faq" },
  contact: { sv: "kontakt", fi: "yhteystiedot", da: "kontakt", nl: "contact", de: "kontakt", fr: "contact", en: "contact", pl: "kontakt" },
  checkout: { sv: "kassa", fi: "kassa", da: "kasse", nl: "afrekenen", de: "kasse", fr: "paiement", en: "checkout", pl: "kasa" },
  thanks: { sv: "tack", fi: "kiitos", da: "tak", nl: "bedankt", de: "danke", fr: "merci", en: "thank-you", pl: "dziekujemy" },
  trackOrder: { sv: "spara-order", fi: "seuraa-tilausta", da: "spor-ordre", nl: "bestelling-volgen", de: "bestellung-verfolgen", fr: "suivi-de-commande", en: "track-order", pl: "sledzenie-zamowienia" },
  account: { sv: "mitt-konto", fi: "oma-tili", da: "min-konto", nl: "mijn-account", de: "mein-konto", fr: "mon-compte", en: "my-account", pl: "moje-konto" },
  giftCard: { sv: "presentkort", fi: "lahjakortti", da: "gavekort", nl: "cadeaubon", de: "gutschein", fr: "carte-cadeau", en: "gift-card", pl: "karta-podarunkowa" },
  quiz: { sv: "quiz", fi: "quiz", da: "quiz", nl: "quiz", de: "quiz", fr: "quiz", en: "quiz", pl: "quiz" },
  partners: { sv: "samarbeten", fi: "yhteistyot", da: "samarbejde", nl: "samenwerkingen", de: "kooperationen", fr: "partenariats", en: "partnerships", pl: "wspolpraca" },
  careers: { sv: "jobba-hos-oss", fi: "toihin-meille", da: "job-hos-os", nl: "werken-bij-ons", de: "karriere", fr: "carrieres", en: "careers", pl: "kariera" },
  tongkat: { sv: "tongkat-ali", fi: "tongkat-ali", da: "tongkat-ali", nl: "tongkat-ali", de: "tongkat-ali", fr: "tongkat-ali", en: "tongkat-ali", pl: "tongkat-ali" },
  // Kampanjsidan för Google Ads – egen rotlayout i app/kampanj/[lang], se localizedRewrites
  campaign: { sv: "kampanj", fi: "kampanja", da: "kampagne", nl: "actie", de: "aktion", fr: "offre", en: "offer", pl: "promocja" },
  // Informationssidor (app/[lang]/[doc]) – nyckeln i content/legal är den svenska slugen
  privacy: { sv: "integritetspolicy", fi: "tietosuojakaytanto", da: "privatlivspolitik", nl: "privacybeleid", de: "datenschutz", fr: "politique-de-confidentialite", en: "privacy-policy", pl: "polityka-prywatnosci" },
  terms: { sv: "kopvillkor", fi: "ostoehdot", da: "kobsbetingelser", nl: "koopvoorwaarden", de: "agb", fr: "conditions-generales-de-vente", en: "terms-and-conditions", pl: "regulamin" },
  cookies: { sv: "cookies", fi: "evasteet", da: "cookies", nl: "cookies", de: "cookies", fr: "cookies", en: "cookies", pl: "cookies" },
  shipping: { sv: "frakt-och-leverans", fi: "toimitus", da: "fragt-og-levering", nl: "verzending-en-levering", de: "versand-und-lieferung", fr: "livraison", en: "shipping-and-delivery", pl: "wysylka-i-dostawa" },
  returns: { sv: "returer-och-byten", fi: "palautukset", da: "returnering-og-bytte", nl: "retouren-en-ruilen", de: "ruecksendungen-und-umtausch", fr: "retours-et-echanges", en: "returns-and-exchanges", pl: "zwroty-i-wymiany" },
  quality: { sv: "kvalitetsgaranti", fi: "laatutakuu", da: "kvalitetsgaranti", nl: "kwaliteitsgarantie", de: "qualitaetsgarantie", fr: "garantie-qualite", en: "quality-guarantee", pl: "gwarancja-jakosci" },
  sustainability: { sv: "hallbarhet", fi: "vastuullisuus", da: "baeredygtighed", nl: "duurzaamheid", de: "nachhaltigkeit", fr: "durabilite", en: "sustainability", pl: "zrownowazony-rozwoj" },
} as const satisfies Record<string, Record<Locale, string>>;

export type RouteKey = keyof typeof routeSlugs;

/**
 * Sidor som bara finns på svenska än så länge. På andra språk ger de 404 och länkarna döljs.
 * (Presentkort, konto m.m. är skrivna för den svenska marknaden.)
 */
const svOnly = new Set<RouteKey>(["quiz", "giftCard", "partners", "careers", "account", "trackOrder", "goals", "tongkat"]);

/** Sidor som är stängda på en marknad. Tongkat Ali-sidan: novel food är stängt i Sverige (lib/novel-foods). */
const closed: Partial<Record<Locale, Set<RouteKey>>> = { sv: new Set<RouteKey>(["tongkat"]) };

export const hasPage = (key: RouteKey, locale: Locale): boolean =>
  !closed[locale]?.has(key) && (locale === "sv" || !svOnly.has(key));

const slug = (key: RouteKey, l: Locale) => routeSlugs[key][l];

export function routesFor(l: Locale) {
  const L = `/${l}`;
  const p = (key: RouteKey) => `${L}/${slug(key, l)}`;
  return {
    locale: l,
    home: L,
    products: p("products"),
    product: (s: string) => `${p("product")}/${s}`,
    bundle: (s: string) => `${p("bundle")}/${s}`,
    category: (category: string) => `${p("products")}?kategori=${encodeURIComponent(category)}`,
    goals: p("goals"),
    articles: p("articles"),
    article: (s: string) => `${p("articles")}/${s}`,
    subscription: p("subscription"),
    story: p("story"),
    quality: p("quality"),
    shipping: p("shipping"),
    returns: p("returns"),
    sustainability: p("sustainability"),
    faq: p("faq"),
    contact: p("contact"),
    privacy: p("privacy"),
    terms: p("terms"),
    cookies: p("cookies"),
    checkout: p("checkout"),
    thanks: p("thanks"),
    trackOrder: p("trackOrder"),
    account: p("account"),
    giftCard: p("giftCard"),
    quiz: p("quiz"),
    partners: p("partners"),
    careers: p("careers"),
    tongkat: p("tongkat"),
    campaign: p("campaign"),
  };
}

export type Routes = ReturnType<typeof routesFor>;

const cache = Object.fromEntries(locales.map((l) => [l, routesFor(l)])) as Record<Locale, Routes>;
export const routesOf = (l: Locale): Routes => cache[l];

/** Svenska sökvägar (admin, mejl och allt som saknar språk). */
export const routes = cache[defaultLocale];

/** Informationssidornas nycklar i content/legal (= svenska slugar). */
const docKeys = ["privacy", "terms", "cookies", "shipping", "returns", "quality", "sustainability"] as const satisfies RouteKey[];

/** Översätter en dokument-slug på ett språk till den interna (svenska) nyckeln. */
export const docKeyForSlug = (s: string, l: Locale): string | null => {
  const key = docKeys.find((k) => slug(k, l) === s);
  return key ? slug(key, "sv") : null;
};

/** Dokumentets slug på ett språk, utifrån den svenska nyckeln. */
export const docSlugFor = (svSlug: string, l: Locale): string => {
  const key = docKeys.find((k) => slug(k, "sv") === svSlug);
  return key ? slug(key, l) : svSlug;
};

/**
 * Samma sida på ett annat språk, t.ex. "/sv/produkt/maca" → "/fi/tuote/maca".
 * Okända segment behålls som de är.
 */
export function translatePath(pathname: string, target: Locale): string {
  const parts = pathname.split("/").filter(Boolean);
  const from = isLocale(parts[0]) ? parts[0] : defaultLocale;
  const rest = isLocale(parts[0]) ? parts.slice(1) : parts;
  if (rest.length === 0) return `/${target}`;
  const key = (Object.keys(routeSlugs) as RouteKey[]).find((k) => slug(k, from) === rest[0]);
  if (key && !hasPage(key, target)) return `/${target}`;
  const head = key ? slug(key, target) : rest[0];
  return `/${[target, head, ...rest.slice(1)].join("/")}`;
}

/**
 * Omskrivningar (lokal slug → svensk mapp) och omdirigeringar (svensk slug på fel språk →
 * lokal slug) till next.config. Bara där slugen skiljer sig.
 */
export function localizedRewrites() {
  const rewrites: { source: string; destination: string }[] = [];
  const redirects: { source: string; destination: string; permanent: boolean }[] = [];
  // Kampanjsidan ligger utanför app/[lang] (egen layout utan Tongkat Ali i sidfot och korgdata)
  for (const l of locales) rewrites.push({ source: `/${l}/${slug("campaign", l)}`, destination: `/kampanj/${l}` });
  for (const l of locales) {
    if (l === defaultLocale) continue;
    const localSlugs = new Set(Object.values(routeSlugs).map((m) => m[l]));
    for (const key of Object.keys(routeSlugs) as RouteKey[]) {
      if (key === "campaign") continue;
      const local = slug(key, l);
      const internal = slug(key, "sv");
      if (local === internal) continue;
      rewrites.push({ source: `/${l}/${local}`, destination: `/${l}/${internal}` });
      rewrites.push({ source: `/${l}/${local}/:path*`, destination: `/${l}/${internal}/:path*` });
      // Den svenska slugen på fel språk skickas till rätt adress – om den inte råkar vara en annan sidas lokala slug
      if (!localSlugs.has(internal)) {
        redirects.push({ source: `/${l}/${internal}`, destination: `/${l}/${local}`, permanent: true });
        redirects.push({ source: `/${l}/${internal}/:path*`, destination: `/${l}/${local}/:path*`, permanent: true });
      }
    }
  }
  return { rewrites, redirects };
}
