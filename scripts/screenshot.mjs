// Tar skärmdumpar av sajten i desktop- och mobilvy och rapporterar horisontellt överflöd.
// Användning: node scripts/screenshot.mjs <url> <utfil-prefix> [mobile|desktop|both]
import puppeteer from "puppeteer-core";

const [url = "http://localhost:3000/sv", prefix = "shot", mode = "both"] = process.argv.slice(2);
const chrome = process.env.CHROME_PATH ?? "C:/Program Files/Google/Chrome/Application/chrome.exe";

const browser = await puppeteer.launch({ executablePath: chrome, headless: true });
const views = {
  desktop: { width: 1400, height: 900, deviceScaleFactor: 1 },
  mobile: { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
};
for (const [name, viewport] of Object.entries(views)) {
  if (mode !== "both" && mode !== name) continue;
  const page = await browser.newPage();
  await page.setViewport(viewport);
  await page.goto(url, { waitUntil: "load", timeout: 60000 });
  await new Promise((r) => setTimeout(r, 800));
  const overflow = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));
  const file = `${prefix}-${name}.png`;
  await page.screenshot({ path: file, fullPage: true });
  console.log(`${name}: ${file} (scrollWidth ${overflow.scrollWidth} / viewport ${overflow.clientWidth}${overflow.scrollWidth > overflow.clientWidth ? " – ÖVERFLÖD!" : ""})`);
  await page.close();
}
await browser.close();
