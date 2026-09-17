// Rapporterar horisontellt överflöd i mobilvy och listar de element som orsakar det.
// Användning: node scripts/overflow.mjs <url> [bredd]
import puppeteer from "puppeteer-core";
const [url = "http://localhost:3000/sv", width = "390"] = process.argv.slice(2);
const browser = await puppeteer.launch({ executablePath: process.env.CHROME_PATH ?? "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true });
const page = await browser.newPage();
await page.setViewport({ width: Number(width), height: 844, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
await page.goto(url, { waitUntil: "load", timeout: 60000 });
await new Promise((r) => setTimeout(r, 500));
const result = await page.evaluate((w) => {
  const doc = document.documentElement;
  const out = [];
  const inScroller = (el) => {
    for (let p = el.parentElement; p; p = p.parentElement) {
      const cs = getComputedStyle(p);
      if (cs.position === "fixed") return true;
      if (/(auto|scroll|hidden)/.test(cs.overflowX)) return true;
    }
    return false;
  };
  if (doc.scrollWidth > doc.clientWidth) {
    for (const el of document.querySelectorAll("body *")) {
      const r = el.getBoundingClientRect();
      if (r.right > w + 1 && r.width > 0 && getComputedStyle(el).position !== "fixed" && !inScroller(el)) {
        out.push(`${el.tagName.toLowerCase()}.${(el.className?.toString() ?? "").slice(0, 60)} right=${Math.round(r.right)}`);
      }
    }
  }
  return { scrollWidth: doc.scrollWidth, clientWidth: doc.clientWidth, offenders: out.slice(0, 8) };
}, Number(width));
console.log(result.scrollWidth > result.clientWidth ? `ÖVERFLÖD ${result.scrollWidth}/${result.clientWidth}` : "ok", result.offenders.join(" | "));
await browser.close();
