// Fjärrstyr det öppna Chrome-fönstret. Användning: node b.mjs <kommando> [arg]
import puppeteer from "puppeteer-core";
import fs from "node:fs";
const S = process.env.S;
const [cmd, ...args] = process.argv.slice(2);
const browser = await puppeteer.connect({ browserURL: "http://127.0.0.1:9222", defaultViewport: null });
const pages = await browser.pages();
let page = pages.find((p) => /facebook|vercel/.test(p.url())) ?? pages[0];
const shot = async (name = "shot") => { await page.screenshot({ path: `${S}/${name}.png` }); console.log("url:", page.url()); };
const txt = async () => {
  const t = await page.evaluate(() => document.body.innerText);
  fs.writeFileSync(`${S}/page.txt`, t);
  console.log(t.slice(0, 4000));
};
try {
  if (cmd === "shot") await shot(args[0]);
  else if (cmd === "goto") { await page.goto(args[0], { waitUntil: "domcontentloaded", timeout: 60000 }); await new Promise((r) => setTimeout(r, 5000)); await shot(); }
  else if (cmd === "text") await txt();
  else if (cmd === "click") {
    // Klicka på första element vars synliga text matchar regex
    const ok = await page.evaluate((re) => {
      const rx = new RegExp(re, "i");
      const els = [...document.querySelectorAll('div[role="button"],a,button,span,div,[role="tab"],[role="menuitem"]')].filter((e) => e.children.length < 6 && rx.test(e.innerText?.trim() ?? "") && e.getBoundingClientRect().width > 0);
      const e = els.sort((a, b) => a.innerText.length - b.innerText.length)[0];
      if (!e) return false;
      e.scrollIntoView({ block: "center" });
      e.click();
      return e.innerText.trim().slice(0, 60);
    }, args[0]);
    console.log("clicked:", ok);
    await new Promise((r) => setTimeout(r, 3000));
    await shot();
  }
  else if (cmd === "type") { await page.keyboard.type(args[0], { delay: 30 }); await new Promise((r) => setTimeout(r, 800)); await shot(); }
  else if (cmd === "key") { await page.keyboard.press(args[0]); await new Promise((r) => setTimeout(r, 2000)); await shot(); }
  else if (cmd === "eval") { console.log(await page.evaluate(args[0])); }
  else if (cmd === "clickxy") { await page.mouse.click(Number(args[0]), Number(args[1])); await new Promise((r) => setTimeout(r, 3000)); await shot(); }
} finally {
  browser.disconnect();
}
