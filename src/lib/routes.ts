import { defaultLocale, isLocale, locales, type Locale } from "./i18n";

/**
 * Sökvägar per språk. Mapparna i src/app/[lang] har de svenska namnen; övriga språk har egna
 * slugar (samma som gamla butiken) som skrivs om till de svenska mapparna i next.config.
 * Nyckeln är sidans id i koden – slugarna är det som syns i URL:en.
 */
export const routeSlugs = {
  products: { sv: "produkter", fi: "tuotteet", da: "produkter" },
  product: { sv: "produkt", fi: "tuote", da: "produkt" },
  bundle: { sv: "paket", fi: "paketti", da: "pakke" },
  goals: { sv: "mal", fi: "tavoitteet", da: "maal" },
  articles: { sv: "artiklar", fi: "artikkelit", da: "artikler" },
  subscription: { sv: "prenumeration", fi: "tilaus", da: "abonnement" },
  story: { sv: "var-historia", fi: "tarinamme", da: "vores-historie" },
  faq: { sv: "faq", fi: "faq", da: "faq" },
  contact: { sv: "kontakt", fi: "yhteystiedot", da: "kontakt" },
  checkout: { sv: "kassa", fi: "kassa", da: "kasse" },
  thanks: { sv: "tack", fi: "kiitos", da: "tak" },
  trackOrder: { sv: "spara-order", fi: "seuraa-tilausta", da: "spor-ordre" },
  account: { sv: "mitt-konto", fi: "oma-tili", da: "min-konto" },
  giftCard: { sv: "presentkort", fi: "lahjakortti", da: "gavekort" },
  quiz: { sv: "quiz", fi: "quiz", da: "quiz" },
  partners: { sv: "samarbeten", fi: "yhteistyot", da: "samarbejde" },
  careers: { sv: "jobba-hos-oss", fi: "toihin-meille", da: "job-hos-os" },
  tongkat: { sv: "tongkat-ali", fi: "tongkat-ali", da: "tongkat-ali" },
  // Informationssidor (app/[lang]/[doc]) – nyckeln i content/legal är den svenska slugen
  privacy: { sv: "integritetspolicy", fi: "tietosuojakaytanto", da: "privatlivspolitik" },
  terms: { sv: "kopvillkor", fi: "ostoehdot", da: "kobsbetingelser" },
  cookies: { sv: "cookies", fi: "evasteet", da: "cookies" },
  shipping: { sv: "frakt-och-leverans", fi: "toimitus", da: "fragt-og-levering" },
  returns: { sv: "returer-och-byten", fi: "palautukset", da: "returnering-og-bytte" },
  quality: { sv: "kvalitetsgaranti", fi: "laatutakuu", da: "kvalitetsgaranti" },
  sustainability: { sv: "hallbarhet", fi: "vastuullisuus", da: "baeredygtighed" },
} as const satisfies Record<string, Record<Locale, string>>;

export type RouteKey = keyof typeof routeSlugs;

/**
 * Sidor som bara finns på svenska än så länge. På andra språk ger de 404 och länkarna döljs.
 * (Presentkort, konto m.m. är skrivna för den svenska marknaden.)
 */
const svOnly = new Set<RouteKey>(["quiz", "giftCard", "partners", "careers", "account", "trackOrder", "goals", "tongkat"]);

export const hasPage = (key: RouteKey, locale: Locale): boolean => locale === "sv" || !svOnly.has(key);

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
  for (const l of locales) {
    if (l === defaultLocale) continue;
    const localSlugs = new Set(Object.values(routeSlugs).map((m) => m[l]));
    for (const key of Object.keys(routeSlugs) as RouteKey[]) {
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
