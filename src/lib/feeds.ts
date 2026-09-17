import "server-only";
import { getProductContent } from "@/content/product-content";
import { bundleInStock, type Bundle } from "./bundles";
import { getCatalog } from "./catalog";
import { imagesFor, isInStock, type Product } from "./products";
import { routes } from "./routes";
import { site } from "./site";
import { metaContentId } from "./consent";

/**
 * Produktfeed för Google Merchant Center (RSS 2.0 med g:-attribut).
 * Slutsålda produkter skickas med availability out_of_stock, aldrig utelämnade,
 * så att Google inte får 404 på annonserade sidor.
 */

const GOOGLE_CATEGORY = "Health & Beauty > Health Care > Fitness & Nutrition > Vitamins & Supplements";

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const abs = (path: string) => (path.startsWith("http") ? path : `${site.url}${path}`);

const money = (n: number) => `${n.toFixed(2)} ${site.currency}`;

const clip = (s: string, max: number) => (s.length > max ? `${s.slice(0, max - 1).trimEnd()}…` : s);

/** Beskrivning utan hälsopåståenden: produktens intro + beskrivning + punkter. */
const describe = (p: Product): string => {
  const content = getProductContent(p.slug);
  const parts = [content?.intro ?? p.short, ...p.description, p.bullets.length ? `• ${p.bullets.join(" • ")}` : ""].filter(Boolean);
  return clip(parts.join("\n\n"), 5000);
};

const tag = (name: string, value: string | number | null | undefined) =>
  value === null || value === undefined || value === "" ? "" : `<${name}>${esc(String(value))}</${name}>`;

const productItem = (p: Product): string => {
  const images = imagesFor(p).map(abs);
  const onSale = p.oldPrice !== null && p.oldPrice > p.price;
  const identifiers = p.gtin || p.mpn;
  return `<item>
${tag("g:id", p.sku ?? p.slug)}
${tag("title", clip(p.name, 150))}
${tag("description", describe(p))}
${tag("link", abs(routes.product(p.slug)))}
${tag("g:image_link", images[0])}
${images.slice(1, 11).map((src) => tag("g:additional_image_link", src)).join("\n")}
${tag("g:availability", isInStock(p) ? "in_stock" : "out_of_stock")}
${tag("g:price", money(onSale ? p.oldPrice! : p.price))}
${onSale ? tag("g:sale_price", money(p.price)) : ""}
${tag("g:brand", p.brand)}
${tag("g:gtin", p.gtin)}
${tag("g:mpn", p.mpn)}
${identifiers ? "" : tag("g:identifier_exists", "no")}
${tag("g:condition", "new")}
${tag("g:google_product_category", p.googleProductCategory ?? GOOGLE_CATEGORY)}
${tag("g:product_type", p.category)}
${p.variant ? tag("g:item_group_id", p.variant.group) : ""}
${p.weightGrams ? tag("g:shipping_weight", `${p.weightGrams} g`) : ""}
${tag("g:adult", "no")}
</item>`;
};

const bundleItem = (b: Bundle): string => {
  const images = b.images.map(abs);
  return `<item>
${tag("g:id", b.sku ?? `paket-${b.slug}`)}
${tag("title", clip(b.name, 150))}
${tag("description", clip([b.short, ...b.description, `Innehåller: ${b.items.map((i) => `${i.qty} × ${i.product.name}`).join(", ")}.`].join("\n\n"), 5000))}
${tag("link", abs(routes.bundle(b.slug)))}
${tag("g:image_link", images[0])}
${images.slice(1, 11).map((src) => tag("g:additional_image_link", src)).join("\n")}
${tag("g:availability", bundleInStock(b) ? "in_stock" : "out_of_stock")}
${tag("g:price", money(b.value))}
${tag("g:sale_price", money(b.price))}
${tag("g:brand", "Metilde")}
${tag("g:identifier_exists", "no")}
${tag("g:condition", "new")}
${tag("g:google_product_category", GOOGLE_CATEGORY)}
${tag("g:product_type", "Paket")}
${tag("g:is_bundle", "yes")}
${tag("g:adult", "no")}
</item>`;
};

export async function buildGoogleFeed(): Promise<string> {
  const { products, bundles } = await getCatalog();
  const items = [
    ...products.filter((p) => !p.feedExclusions.includes("google")).map(productItem),
    ...bundles.map(bundleItem),
  ];
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
<channel>
<title>Metilde</title>
<link>${esc(site.url)}</link>
<description>Botaniska extrakt och svampextrakt i kapselform, tillverkade i Sverige.</description>
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

const metaProductItem = (p: Product): string => {
  const images = imagesFor(p).map(abs);
  const onSale = p.oldPrice !== null && p.oldPrice > p.price;
  return `<item>
${tag("g:id", metaContentId("product", p.slug, p.sku))}
${tag("title", clip(p.name, 150))}
${tag("description", clip(describe(p), 9999))}
${tag("link", abs(routes.product(p.slug)))}
${tag("g:image_link", images[0])}
${images.slice(1, 11).map((src) => tag("g:additional_image_link", src)).join("\n")}
${tag("g:availability", isInStock(p) ? "in stock" : "out of stock")}
${tag("g:price", money(onSale ? p.oldPrice! : p.price))}
${onSale ? tag("g:sale_price", money(p.price)) : ""}
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

const metaBundleItem = (b: Bundle): string => {
  const images = b.images.map(abs);
  return `<item>
${tag("g:id", metaContentId("bundle", b.slug, b.sku))}
${tag("title", clip(b.name, 150))}
${tag("description", clip([b.short, ...b.description, `Innehåller: ${b.items.map((i) => `${i.qty} × ${i.product.name}`).join(", ")}.`].join("\n\n"), 9999))}
${tag("link", abs(routes.bundle(b.slug)))}
${tag("g:image_link", images[0])}
${images.slice(1, 11).map((src) => tag("g:additional_image_link", src)).join("\n")}
${tag("g:availability", bundleInStock(b) ? "in stock" : "out of stock")}
${tag("g:price", money(b.value))}
${tag("g:sale_price", money(b.price))}
${tag("g:brand", "Metilde")}
${tag("g:condition", "new")}
${tag("g:fb_product_category", META_CATEGORY)}
${tag("g:google_product_category", GOOGLE_CATEGORY)}
${tag("g:product_type", "Paket")}
</item>`;
};

export async function buildMetaFeed(): Promise<string> {
  const { products, bundles } = await getCatalog();
  const items = [
    ...products.filter((p) => !p.feedExclusions.includes("meta") && !p.feedExclusions.includes("facebook")).map(metaProductItem),
    ...bundles.map(metaBundleItem),
  ];
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
<channel>
<title>Metilde</title>
<link>${esc(site.url)}</link>
<description>Botaniska extrakt och svampextrakt i kapselform, tillverkade i Sverige.</description>
${items.join("\n")}
</channel>
</rss>
`;
}
