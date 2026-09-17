/**
 * Svenska sökvägar. När fler språk aktiveras flyttas detta till en
 * tabell per språk (samma struktur som gamla butiken använde).
 */
const L = "/sv";

export const routes = {
  home: L,
  products: `${L}/produkter`,
  product: (slug: string) => `${L}/produkt/${slug}`,
  bundle: (slug: string) => `${L}/paket/${slug}`,
  category: (category: string) => `${L}/produkter?kategori=${encodeURIComponent(category)}`,
  goals: `${L}/mal`,
  articles: `${L}/artiklar`,
  article: (slug: string) => `${L}/artiklar/${slug}`,
  subscription: `${L}/prenumeration`,
  story: `${L}/var-historia`,
  quality: `${L}/kvalitetsgaranti`,
  shipping: `${L}/frakt-och-leverans`,
  returns: `${L}/returer-och-byten`,
  sustainability: `${L}/hallbarhet`,
  faq: `${L}/faq`,
  contact: `${L}/kontakt`,
  privacy: `${L}/integritetspolicy`,
  terms: `${L}/kopvillkor`,
  cookies: `${L}/cookies`,
  checkout: `${L}/kassa`,
  trackOrder: `${L}/spara-order`,
  account: `${L}/mitt-konto`,
  giftCard: `${L}/presentkort`,
  quiz: `${L}/quiz`,
  partners: `${L}/samarbeten`,
  careers: `${L}/jobba-hos-oss`,
  tongkat: `${L}/tongkat-ali`,
} as const;
