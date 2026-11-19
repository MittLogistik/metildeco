// Lägger en videoannons i varje marknads Black Week-annonsgrupp (skapade av meta-sale.mts).
// Videon laddas upp till lagringen och till Meta en gång; texten skrivs på varje marknads språk.
//
// Användning:
//   npx tsx --env-file=.env.local --import ./scripts/server-shim.mjs scripts/meta-sale-video.mts <produkt-slug> "<sökväg till mp4>" [språk,...] [--thumb=sekunder]
import fs from "node:fs";
import puppeteer from "puppeteer-core";
import { addSaleVideoAd } from "@/lib/ads-engine";
import { activeCampaign } from "@/lib/campaign";
import { locales, type Locale } from "@/lib/i18n";
import * as meta from "@/lib/meta-ads";
import { supabaseAdmin } from "@/lib/supabase";

const args = process.argv.slice(2);
const [slug, file, list] = args.filter((a) => !a.startsWith("--"));
if (!slug || !file) throw new Error("Ange produkt-slug och sökväg till videon.");
const thumbAt = Number(args.find((a) => a.startsWith("--thumb="))?.split("=")[1] ?? 1);
const targets = (list?.split(",") ?? locales.filter((l) => l !== "sv")) as Locale[];
const sale = activeCampaign();
if (!sale) throw new Error("Ingen kampanj pågår.");

const db = supabaseAdmin();
const base = `ads/${sale.id}/video/${slug}-${Date.now()}`;

// Omslagsbild ur videon (Chrome), i videons egna mått
const html = `${process.cwd()}/.video-thumb.html`;
fs.writeFileSync(html, `<body style="margin:0;background:#000"><video src="file:///${encodeURI(file.replace(/\\/g, "/"))}" style="display:block"></video></body>`);
const browser = await puppeteer.launch({ executablePath: process.env.CHROME_PATH ?? "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true, args: ["--allow-file-access-from-files"] });
let thumb: Buffer;
try {
  const page = await browser.newPage();
  await page.goto(`file:///${html.replace(/\\/g, "/")}`);
  const size = await page.evaluate(async (t) => {
    const v = document.querySelector("video")!;
    if (v.readyState < 1) await new Promise((r) => (v.onloadedmetadata = r));
    await new Promise((r) => { v.onseeked = r; v.currentTime = t; });
    return { width: v.videoWidth, height: v.videoHeight };
  }, thumbAt);
  await page.setViewport(size);
  await new Promise((r) => setTimeout(r, 500));
  thumb = Buffer.from(await page.screenshot({ type: "jpeg", quality: 90 }));
} finally {
  await browser.close();
  fs.rmSync(html, { force: true });
}

const put = async (path: string, body: Buffer, contentType: string) => {
  const up = await db.storage.from("product-media").upload(path, body, { contentType, upsert: true });
  if (up.error) throw new Error(`Uppladdning ${path}: ${up.error.message}`);
  return db.storage.from("product-media").getPublicUrl(path).data.publicUrl;
};
// Omslaget i lagringen (granskaren och admin behöver en adress); videon går direkt till Meta,
// eftersom bucketen inte tar så stora filer.
const thumbnailUrl = await put(`${base}-thumb.jpg`, thumb, "image/jpeg");
console.log("Omslag:", thumbnailUrl);

const { id: videoId } = await meta.uploadVideoFile(fs.readFileSync(file), `${slug}.mp4`, `${sale.id}-${slug}`);
console.log("Meta-video", videoId, "– väntar på bearbetning…");
await meta.waitForVideo(videoId);
const thumbHash = await meta.uploadImage(thumbnailUrl, `${sale.id}-${slug}-video-thumb`);

for (const locale of targets) {
  try {
    const { ad, notes } = await addSaleVideoAd({ locale, slug, videoId, thumbHash, thumbnailUrl, source: "script" });
    console.log(`${locale}: ${ad ? `${ad.id} (poäng ${ad.score ?? "–"})` : "ingen annons"}`);
    for (const n of notes) console.log(`  ! ${n}`);
  } catch (e) {
    console.log(`${locale}: FEL ${e instanceof Error ? e.message : e}`);
  }
}
