import "server-only";
import { unstable_cache } from "next/cache";
import { cache } from "react";
import productsJson from "../../data/products.json";
import pricesJson from "../../data/product_prices.json";
import bundlesJson from "../../data/bundles.json";
import componentsJson from "../../data/bundle_components.json";
import bundlePricesJson from "../../data/bundle_prices.json";
import { catalogText } from "@/content/i18n";
import { buildBundles, slimBundle, type Bundle, type BundleComponentRow, type BundleRow, type SlimBundle } from "./bundles";
import { defaultLocale, markets, type Currency, type Locale } from "./i18n";
import { productFromRow, slimProduct, type Product, type ProductRow, type SlimProduct } from "./products";
import { supabaseAdmin, supabaseConfigured } from "./supabase";

/**
 * Katalogen: produkter och paket. Hämtas från Supabase och cachas tills admin
 * sparar något (revalidateTag(CATALOG_TAG)) eller som längst en timme.
 * Saknas databaskoppling (t.ex. lokalt utan nycklar) används exporten i data/.
 *
 * Per språk: priser i marknadens valuta (product_prices/bundle_prices) och texter från
 * content/i18n. Produkter och paket som saknar pris eller översättning visas inte på det språket.
 */
export const CATALOG_TAG = "catalog";

type PriceRow = { product_slug?: string; bundle_slug?: string; currency: string; price: number | string; old_price: number | string | null };

type RawCatalog = {
  products: ProductRow[];
  productPrices: PriceRow[];
  bundles: BundleRow[];
  components: BundleComponentRow[];
  bundlePrices: PriceRow[];
};

const CURRENCIES = Array.from(new Set(Object.values(markets).map((m) => m.currency)));

const fromJson = (): RawCatalog => ({
  products: productsJson as unknown as ProductRow[],
  productPrices: (pricesJson as PriceRow[]).filter((r) => CURRENCIES.includes(r.currency as Currency)),
  bundles: bundlesJson as unknown as BundleRow[],
  components: componentsJson as BundleComponentRow[],
  bundlePrices: (bundlePricesJson as PriceRow[]).filter((r) => CURRENCIES.includes(r.currency as Currency)),
});

const fromDb = async (): Promise<RawCatalog> => {
  const db = supabaseAdmin();
  const [p, pp, b, bc, bp] = await Promise.all([
    db.from("products").select("*").order("sort_order"),
    db.from("product_prices").select("product_slug,currency,price,old_price").in("currency", CURRENCIES),
    db.from("bundles").select("*").order("sort_order"),
    db.from("bundle_components").select("bundle_slug,product_slug,qty,sort_order,blurb"),
    db.from("bundle_prices").select("bundle_slug,currency,price,old_price").in("currency", CURRENCIES),
  ]);
  for (const r of [p, pp, b, bc, bp]) if (r.error) throw new Error(r.error.message);
  return {
    products: (p.data ?? []) as ProductRow[],
    productPrices: (pp.data ?? []) as PriceRow[],
    bundles: (b.data ?? []) as BundleRow[],
    components: (bc.data ?? []) as BundleComponentRow[],
    bundlePrices: (bp.data ?? []) as PriceRow[],
  };
};

const loadRaw = unstable_cache(async () => (supabaseConfigured() ? fromDb() : fromJson()), ["catalog-raw-20261012a"], {
  tags: [CATALOG_TAG],
  revalidate: 3600,
});

export type Catalog = {
  locale: Locale;
  currency: Currency;
  /** Alla produkter inkl. inaktiva (admin, feeds). */
  allProducts: Product[];
  /** Produkter som säljs just nu. */
  products: Product[];
  bundles: Bundle[];
  /** Alla paket inkl. dolda (admin). */
  allBundles: Bundle[];
};

/** Lägger språkets texter på en svensk databasrad. Null = saknar översättning. */
function localizeProductRow(r: ProductRow, locale: Locale): ProductRow | null {
  if (locale === defaultLocale) return r;
  const t = catalogText[locale]?.products[r.slug];
  if (!t) return null;
  const category = catalogText[locale]?.categories[r.category] ?? r.category;
  return { ...r, name: t.name, short: t.short, bullets: t.bullets, description: t.description, category };
}

function localizeBundleRows(rows: BundleRow[], components: BundleComponentRow[], locale: Locale) {
  if (locale === defaultLocale) return { rows, components };
  const text = catalogText[locale];
  return {
    rows: rows.flatMap((r) => {
      const t = text?.bundles[r.slug];
      return t ? [{ ...r, name: t.name, short: t.short, description: t.description, seo_title: t.seoTitle, seo_description: t.seoDescription }] : [];
    }),
    components: components.map((c) => ({ ...c, blurb: text?.blurbs[`${c.bundle_slug}/${c.product_slug}`] ?? null })),
  };
}

/** Katalogen för ett språk (dedupliceras per request med React cache). */
export const getCatalog = cache(async (locale: Locale = defaultLocale): Promise<Catalog> => {
  const raw = await loadRaw();
  const currency = markets[locale].currency;
  const prices = new Map<string, PriceRow>();
  for (const r of raw.productPrices) if (r.product_slug && r.currency === currency) prices.set(r.product_slug, r);
  const allProducts = raw.products
    .flatMap((r) => {
      const row = localizeProductRow(r, locale);
      const price = prices.get(r.slug);
      // Utanför Sverige säljs bara det som har pris i valutan – products.price är i SEK
      if (!row || (locale !== defaultLocale && !price)) return [];
      return [productFromRow(row, price)];
    })
    .sort((a, b) => a.sortOrder - b.sortOrder);
  const products = allProducts.filter((p) => p.isActive);
  const bundlePrices = new Map<string, PriceRow>();
  for (const r of raw.bundlePrices) if (r.bundle_slug && r.currency === currency) bundlePrices.set(r.bundle_slug, r);
  const { rows, components } = localizeBundleRows(
    locale === defaultLocale ? raw.bundles : raw.bundles.filter((b) => bundlePrices.has(b.slug)),
    raw.components,
    locale,
  );
  const bundles = buildBundles(rows, components, products, bundlePrices, { currency });
  const allBundles = buildBundles(rows, components, allProducts, bundlePrices, { includeHidden: true, currency });
  return { locale, currency, allProducts, products, bundles, allBundles };
});

export const getProducts = async (locale: Locale = defaultLocale) => (await getCatalog(locale)).products;
export const getProduct = async (slug: string, locale: Locale = defaultLocale) => (await getCatalog(locale)).products.find((p) => p.slug === slug);
export const getBundles = async (locale: Locale = defaultLocale) => (await getCatalog(locale)).bundles;
export const getBundle = async (slug: string, locale: Locale = defaultLocale) => (await getCatalog(locale)).bundles.find((b) => b.slug === slug);

export type CatalogSnapshot = { currency: Currency; products: SlimProduct[]; bundles: SlimBundle[] };

/** Liten variant av katalogen som skickas till klienten för varukorgen. */
export const getCatalogSnapshot = async (locale: Locale = defaultLocale): Promise<CatalogSnapshot> => {
  const c = await getCatalog(locale);
  return { currency: c.currency, products: c.products.map(slimProduct), bundles: c.bundles.map(slimBundle) };
};
