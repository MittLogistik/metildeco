import { blackWeek, campaignEndLabel } from "@/i18n/messages/blackweek";
import type { Campaign } from "./campaign";
import { markets, type Locale } from "./i18n";

/**
 * Kampanjbild för annonser (Black Week): produktens framsida på svart botten med rabatten och
 * slutdatumet på marknadens språk. Ingen genererad scen – bara packshoten, så etiketten är
 * alltid oförändrad. Texten ligger bredvid (flöde) eller ovanför (story) burken, aldrig på den.
 *
 * Returnerar HTML som renderas till bild med Chrome (scripts/meta-blackweek.mts), så att
 * typsnittet blir sajtens eget (Outfit) och åäöłż ritas rätt.
 */

export type SaleImageFormat = "feed" | "story";

export const saleImageSize: Record<SaleImageFormat, { width: number; height: number }> = {
  feed: { width: 1080, height: 1080 },
  story: { width: 1080, height: 1920 },
};

/** "Gäller till och med 30 november" på varje språk. */
const until: Record<Locale, (date: string) => string> = {
  sv: (d) => `Till och med ${d}`,
  fi: (d) => `Voimassa ${d} asti`,
  da: (d) => `Til og med ${d}`,
  nl: (d) => `T/m ${d}`,
  de: (d) => `Bis ${d}`,
  fr: (d) => `Jusqu'au ${d}`,
  en: (d) => `Until ${d}`,
  pl: (d) => `Do ${d}`,
};

export const saleUntil = (locale: Locale, c: Pick<Campaign, "end">) => until[locale](campaignEndLabel(c.end, markets[locale].intl));

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export function saleImageHtml(o: { locale: Locale; campaign: Pick<Campaign, "percent" | "end">; packshotUrl: string; format: SaleImageFormat }): string {
  const t = blackWeek[o.locale];
  const { width, height } = saleImageSize[o.format];
  const story = o.format === "story";
  const title = esc(t.heroTitle(o.campaign.percent));
  const sub = esc(saleUntil(o.locale, o.campaign));
  // Story: text inom säkra ytan (topp 14 %, botten 19 % hålls fria). Flöde: text vänster, burk höger.
  const layout = story
    ? `.text{position:absolute;left:90px;right:90px;top:300px;text-align:center}
       .title{font-size:132px}
       .jar{position:absolute;left:50%;top:800px;height:740px;transform:translateX(-50%)}
       .glow{left:50%;top:1170px}`
    : `.text{position:absolute;left:80px;width:450px;top:50%;transform:translateY(-50%)}
       .title{font-size:96px}
       .sub{font-size:34px}
       .jar{position:absolute;right:30px;top:50%;height:780px;transform:translateY(-50%)}
       .glow{left:790px;top:540px}`;
  return `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@500;600;700&display=block" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:${width}px;height:${height}px;background:#000;overflow:hidden}
body{position:relative;font-family:Outfit,system-ui,sans-serif;color:#fff}
.glow{position:absolute;width:900px;height:900px;transform:translate(-50%,-50%);border-radius:50%;background:radial-gradient(closest-side,rgba(255,255,255,.16),transparent)}
.pill{display:inline-flex;align-items:center;gap:14px;border:2px solid rgba(255,255,255,.3);border-radius:999px;padding:12px 26px;font-size:28px;font-weight:600;letter-spacing:.22em;text-transform:uppercase}
.dot{width:12px;height:12px;border-radius:50%;background:oklch(63% 0.22 27)}
.title{margin-top:34px;font-weight:600;line-height:.95;letter-spacing:-.02em}
.sub{margin-top:30px;font-size:${story ? 44 : 38}px;font-weight:500;color:rgba(255,255,255,.72)}
.jar{filter:drop-shadow(0 30px 60px rgba(0,0,0,.6))}
${layout}
</style></head><body>
<div class="glow"></div>
<img class="jar" src="${esc(o.packshotUrl)}" alt="">
<div class="text"><span class="pill"><span class="dot"></span>${esc(t.name)}</span><h1 class="title">${title}</h1><p class="sub">${sub}</p></div>
</body></html>`;
}
