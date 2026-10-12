/**
 * Översatta katalogtexter. Svenska kommer från databasen (products/bundles); övriga språk
 * ligger här per språk. En produkt eller ett paket utan översättning visas inte på det språket.
 */
export type ProductText = {
  name: string;
  short: string;
  bullets: string[];
  description: string[];
};

export type BundleText = {
  name: string;
  short: string;
  description: string[];
  seoTitle: string | null;
  seoDescription: string | null;
};

export type CatalogText = {
  products: Record<string, ProductText>;
  bundles: Record<string, BundleText>;
  /** Nyckel "<paket-slug>/<produkt-slug>". */
  blurbs: Record<string, string>;
  /** Svensk kategori → översatt kategori. */
  categories: Record<string, string>;
};

/**
 * Översatt artikel (Journalen). Samma slug som den svenska. Blocken har samma ordning och
 * typer som originalet (data/articles.json); bilder och produktslugar är oförändrade.
 * Produktlänkar i texten skrivs [text](product:slug) och leder till produkten på artikelns språk.
 */
export type ArticleText = {
  title: string;
  excerpt: string;
  category: string;
  lead: string;
  seoTitle: string | null;
  seoDescription: string | null;
  blocks: Record<string, unknown>[];
};
