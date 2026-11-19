// Kampanjannonser (Black Week) på Meta per marknad: renderar kampanjbilderna på varje språk,
// lägger dem i lagringen och skapar en PAUSAD kampanj per marknad via annonsmotorn.
//
// Användning:
//   npx tsx --env-file=.env.local --import ./scripts/server-shim.mjs scripts/meta-sale.mts [språk,...] [--budget=10] [--products=a,b] [--images-only]
// Utan språk: alla marknader utom sv. Kräver Chrome (CHROME_PATH) för bilderna.
import puppeteer from "puppeteer-core";
import { saleImageHtml, saleImageSize, type SaleImageFormat } from "@/lib/ad-sale-image";
import { buildSaleCampaign } from "@/lib/ads-engine";
import { activeCampaign } from "@/lib/campaign";
import { getCatalog } from "@/lib/catalog";
import { locales, type Locale } from "@/lib/i18n";
import { primaryImage } from "@/lib/products";
import { supabaseAdmin } from "@/lib/supabase";

const args = process.argv.slice(2);
const flag = (name: string) => args.find((a) => a.startsWith(`--${name}=`))?.split("=")[1];
const targets = (args.find((a) => !a.startsWith("--"))?.split(",") ?? locales.filter((l) => l !== "sv")) as Locale[];
const budget = Number(flag("budget") ?? 10);
const slugs = (flag("products") ?? "ashwagandha,pine-pollen").split(",");
const imagesOnly = args.includes("--images-only");

const sale = activeCampaign();
if (!sale) throw new Error("Ingen kampanj pågår.");
for (const l of targets) if (!locales.includes(l) || l === "sv") throw new Error(`Okänd eller otillåten marknad: ${l}`);

const browser = await puppeteer.launch({ executablePath: process.env.CHROME_PATH ?? "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true });
const db = supabaseAdmin();

async function render(locale: Locale, packshotUrl: string, format: SaleImageFormat, path: string) {
  const page = await browser.newPage();
  await page.setViewport({ ...saleImageSize[format], deviceScaleFactor: 1 });
  await page.setContent(saleImageHtml({ locale, campaign: sale!, packshotUrl, format }), { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);
  const buf = Buffer.from(await page.screenshot({ type: "jpeg", quality: 92 }));
  await page.close();
  const up = await db.storage.from("product-media").upload(path, buf, { contentType: "image/jpeg", upsert: true });
  if (up.error) throw new Error(`Uppladdning ${path}: ${up.error.message}`);
  // Ny fråga-parameter per körning så att Meta och granskaren aldrig får en cachad äldre version
  return `${db.storage.from("product-media").getPublicUrl(path).data.publicUrl}?v=${Date.now()}`;
}

try {
  for (const locale of targets) {
    const catalog = await getCatalog(locale);
    const images: Record<string, { feed: string; story: string }> = {};
    for (const slug of slugs) {
      const p = catalog.products.find((x) => x.slug === slug);
      if (!p) throw new Error(`${slug} saknas på ${locale}`);
      const src = primaryImage(p);
      const packshot = src.startsWith("http") ? src : `https://metilde.com${src}`;
      const dir = `ads/${sale.id}/${locale}/${slug}`;
      images[slug] = { feed: await render(locale, packshot, "feed", `${dir}-feed.jpg`), story: await render(locale, packshot, "story", `${dir}-story.jpg`) };
    }
    console.log(`\n== ${locale}: bilder`);
    for (const [slug, i] of Object.entries(images)) console.log(`  ${slug}\n    ${i.feed}\n    ${i.story}`);
    if (imagesOnly) continue;
    const res = await buildSaleCampaign({ locale, dailyBudget: budget, images, source: "script" });
    console.log(`== ${locale}: kampanj ${res.campaignId}, annonsgrupp ${res.adsetId}, ${res.ads.length} annonser`);
    for (const a of res.ads) console.log(`  ${a.id} ${a.name} (poäng ${a.score ?? "–"})`);
    for (const n of res.notes) console.log(`  ! ${n}`);
  }
} finally {
  await browser.close();
}
