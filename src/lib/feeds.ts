import "server-only";
import { productContentFor } from "@/content/i18n";
import { bundleInStock, type Bundle } from "./bundles";
import { getCatalog } from "./catalog";
import { defaultLocale, markets, type Locale } from "./i18n";
import { imagesFor, isInStock, unitCount, type Product } from "./products";
import { routesOf } from "./routes";
import { cheapestRate, shippingCost } from "./shipping";
import { site } from "./site";
import { metaContentId } from "./consent";

/**
 * Produktfeed för Google Merchant Center (RSS 2.0 med g:-attribut).
 * Slutsålda produkter skickas med availability out_of_stock, aldrig utelämnade,
 * så att Google inte får 404 på annonserade sidor.
 *
 * En feed per marknad (språk): länkar, texter, priser och valuta för det landet.
 * /feeds/google.xml = Sverige, /feeds/google-fi.xml = Finland, /feeds/google-dk.xml = Danmark, /feeds/google-nl.xml = Nederländerna.
 */

/** Feedtexter per språk. */
const feedText: Record<Locale, { channel: string; contains: string; bundleType: string }> = {
  sv: { channel: "Botaniska extrakt och svampextrakt i kapselform, utvecklade i Sverige.", contains: "Innehåller", bundleType: "Paket" },
  fi: { channel: "Kasvi- ja sieniuutteita kapselimuodossa, kehitetty Ruotsissa.", contains: "Sisältää", bundleType: "Paketti" },
  da: { channel: "Botaniske ekstrakter og svampeekstrakter i kapselform, udviklet i Sverige.", contains: "Indeholder", bundleType: "Pakke" },
  nl: { channel: "Plantenextracten en paddenstoelextracten in capsulevorm, ontwikkeld in Zweden.", contains: "Bevat", bundleType: "Pakket" },
};

type Ctx = { locale: Locale; currency: string };

const GOOGLE_CATEGORY = "Health & Beauty > Health Care > Fitness & Nutrition > Vitamins & Supplements";

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const abs = (path: string) => (path.startsWith("http") ? path : `${site.url}${path}`);

const money = (n: number, c: Ctx) => `${n.toFixed(2)} ${c.currency}`;

const clip = (s: string, max: number) => (s.length > max ? `${s.slice(0, max - 1).trimEnd()}…` : s);

/** Beskrivning utan hälsopåståenden: produktens intro + beskrivning + punkter. */
const describe = (p: Product, c: Ctx): string => {
  const content = productContentFor(p.slug, c.locale);
  const parts = [content?.intro ?? p.short, ...p.description, p.bullets.length ? `• ${p.bullets.join(" • ")}` : ""].filter(Boolean);
  return clip(parts.join("\n\n"), 5000);
};

const tag = (name: string, value: string | number | null | undefined) =>
  value === null || value === undefined || value === "" ? "" : `<${name}>${esc(String(value))}</${name}>`;

/**
 * Jämförpris (krav enligt prisinformationslagen): antal kapslar/tabletter i förpackningen
 * och basmåttet 1 st, så att Google visar pris per kapsel. Utan känt antal utelämnas
 * attributen hellre än att gissa.
 */
const unitPricing = (count: number | null): string =>
  count && count > 0 ? [tag("g:unit_pricing_measure", `${count} ct`), tag("g:unit_pricing_base_measure", "1 ct")].join("\n") : "";

/** Antal kapslar i ett paket = summan av innehållet; null om någon vara saknar antal. */
const bundleCount = (b: Bundle): number | null => {
  let total = 0;
  for (const item of b.items) {
    const n = unitCount(item.product);
    if (!n) return null;
    total += n * item.qty;
  }
  return total;
};

/**
 * Frakt per vara för marknader utanför Sverige (feeden är enda fraktuppgiften Google har via CSS:erna).
 * Billigaste fraktsättet; 0 om varan själv når gränsen för fri frakt eller alltid skickas fritt.
 * Sveriges feed lämnas som den är.
 */
const shipping = (price: number, alwaysFree: boolean, c: Ctx): string => {
  if (c.locale === defaultLocale) return "";
  const rate = cheapestRate(c.locale);
  const cost = alwaysFree ? 0 : shippingCost(rate, price);
  return `<g:shipping>${tag("g:country", markets[c.locale].country)}${tag("g:service", rate.label)}${tag("g:price", money(cost, c))}</g:shipping>`;
};

const productItem = (p: Product, c: Ctx): string => {
  const images = imagesFor(p).map(abs);
  const onSale = p.oldPrice !== null && p.oldPrice > p.price;
  const identifiers = p.gtin || p.mpn;
  return `<item>
${tag("g:id", p.sku ?? p.slug)}
${tag("title", clip(p.name, 150))}
${tag("description", describe(p, c))}
${tag("link", abs(routesOf(c.locale).product(p.slug)))}
${tag("g:image_link", images[0])}
${images.slice(1, 11).map((src) => tag("g:additional_image_link", src)).join("\n")}
${tag("g:availability", isInStock(p) ? "in_stock" : "out_of_stock")}
${tag("g:price", money(onSale ? p.oldPrice! : p.price, c))}
${onSale ? tag("g:sale_price", money(p.price, c)) : ""}
${shipping(p.price, false, c)}
${tag("g:brand", p.brand)}
${tag("g:gtin", p.gtin)}
${tag("g:mpn", p.mpn)}
${identifiers ? "" : tag("g:identifier_exists", "no")}
${tag("g:condition", "new")}
${tag("g:google_product_category", p.googleProductCategory ?? GOOGLE_CATEGORY)}
${tag("g:product_type", p.category)}
${p.variant ? tag("g:item_group_id", p.variant.group) : ""}
${p.weightGrams ? tag("g:shipping_weight", `${p.weightGrams} g`) : ""}
${unitPricing(unitCount(p))}
${tag("g:adult", "no")}
</item>`;
};

const bundleItem = (b: Bundle, c: Ctx): string => {
  const images = b.images.map(abs);
  return `<item>
${tag("g:id", b.sku ?? `paket-${b.slug}`)}
${tag("title", clip(b.name, 150))}
${tag("description", clip([b.short, ...b.description, `${feedText[c.locale].contains}: ${b.items.map((i) => `${i.qty} × ${i.product.name}`).join(", ")}.`].join("\n\n"), 5000))}
${tag("link", abs(routesOf(c.locale).bundle(b.slug)))}
${tag("g:image_link", images[0])}
${images.slice(1, 11).map((src) => tag("g:additional_image_link", src)).join("\n")}
${tag("g:availability", bundleInStock(b) ? "in_stock" : "out_of_stock")}
${tag("g:price", money(b.price, c))}
${shipping(b.price, b.freeShipping, c)}
${tag("g:brand", "Metilde")}
${tag("g:identifier_exists", "no")}
${tag("g:condition", "new")}
${tag("g:google_product_category", GOOGLE_CATEGORY)}
${tag("g:product_type", feedText[c.locale].bundleType)}
${tag("g:is_bundle", "yes")}
${b.freeShipping ? tag("g:shipping_label", "paket") : ""}
${unitPricing(bundleCount(b))}
${tag("g:adult", "no")}
</item>`;
};

export async function buildGoogleFeed(locale: Locale = defaultLocale): Promise<string> {
  const { products, bundles, currency } = await getCatalog(locale);
  const c: Ctx = { locale, currency };
  const items = [
    ...products.filter((p) => !p.feedExclusions.includes("google")).map((p) => productItem(p, c)),
    ...bundles.map((b) => bundleItem(b, c)),
  ];
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
<channel>
<title>Metilde</title>
<link>${esc(site.url)}</link>
<description>${esc(feedText[locale].channel)}</description>
${items.join("\n")}
</channel>
</rss>
`;
}

/**
 * Produktfeed för Meta (Facebook/Instagram-katalog). Samma RSS-format med g:-attribut
 * som Google, men Meta kräver in stock/out of stock och egen kategori-taxonomi.
 * g:id måste matcha content_ids i pixel-händelserna (metaContentId): artikelnummer,
 * annars slug. Samma id som i Google-feeden.
 */
const META_CATEGORY = "health & beauty > health care > vitamins & supplements";

const metaProductItem = (p: Product, c: Ctx): string => {
  const images = imagesFor(p).map(abs);
  const onSale = p.oldPrice !== null && p.oldPrice > p.price;
  return `<item>
${tag("g:id", metaContentId("product", p.slug, p.sku))}
${tag("title", clip(p.name, 150))}
${tag("description", clip(describe(p, c), 9999))}
${tag("link", abs(routesOf(c.locale).product(p.slug)))}
${tag("g:image_link", images[0])}
${images.slice(1, 11).map((src) => tag("g:additional_image_link", src)).join("\n")}
${tag("g:availability", isInStock(p) ? "in stock" : "out of stock")}
${tag("g:price", money(onSale ? p.oldPrice! : p.price, c))}
${onSale ? tag("g:sale_price", money(p.price, c)) : ""}
${tag("g:brand", p.brand)}
${tag("g:gtin", p.gtin)}
${tag("g:mpn", p.mpn)}
${tag("g:condition", "new")}
${tag("g:fb_product_category", META_CATEGORY)}
${tag("g:google_product_category", p.googleProductCategory ?? GOOGLE_CATEGORY)}
${tag("g:product_type", p.category)}
${p.variant ? tag("g:item_group_id", p.variant.group) : ""}
</item>`;
};

const metaBundleItem = (b: Bundle, c: Ctx): string => {
  const images = b.images.map(abs);
  return `<item>
${tag("g:id", metaContentId("bundle", b.slug, b.sku))}
${tag("title", clip(b.name, 150))}
${tag("description", clip([b.short, ...b.description, `${feedText[c.locale].contains}: ${b.items.map((i) => `${i.qty} × ${i.product.name}`).join(", ")}.`].join("\n\n"), 9999))}
${tag("link", abs(routesOf(c.locale).bundle(b.slug)))}
${tag("g:image_link", images[0])}
${images.slice(1, 11).map((src) => tag("g:additional_image_link", src)).join("\n")}
${tag("g:availability", bundleInStock(b) ? "in stock" : "out of stock")}
${tag("g:price", money(b.price, c))}
${tag("g:brand", "Metilde")}
${tag("g:condition", "new")}
${tag("g:fb_product_category", META_CATEGORY)}
${tag("g:google_product_category", GOOGLE_CATEGORY)}
${tag("g:product_type", feedText[c.locale].bundleType)}
</item>`;
};

export async function buildMetaFeed(locale: Locale = defaultLocale): Promise<string> {
  const { products, bundles, currency } = await getCatalog(locale);
  const c: Ctx = { locale, currency };
  const items = [
    ...products.filter((p) => !p.feedExclusions.includes("meta") && !p.feedExclusions.includes("facebook")).map((p) => metaProductItem(p, c)),
    ...bundles.map((b) => metaBundleItem(b, c)),
  ];
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
<channel>
<title>Metilde</title>
<link>${esc(site.url)}</link>
<description>${esc(feedText[locale].channel)}</description>
${items.join("\n")}
</channel>
</rss>
`;
}
