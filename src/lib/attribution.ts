/**
 * Varifrån kom ordern? Besöket klassas vid landning utifrån adressens parametrar och
 * referensen, sparas i webbläsaren (localStorage, ingen cookie) och följer med till kassan.
 * Modell: senaste källan som inte är direkt, inom ATTRIBUTION_DAYS. Första besöket sparas också.
 * Gemensam för webbläsare och server.
 */

export const CHANNELS = [
  "affiliate",
  "google_ads",
  "meta_ads",
  "microsoft_ads",
  "tiktok_ads",
  "other_paid",
  "email",
  "organic_search",
  "organic_social",
  "referral",
  "direct",
  "renewal",
  "unknown",
] as const;
export type Channel = (typeof CHANNELS)[number];

export const channelLabel: Record<Channel, string> = {
  affiliate: "Affiliate (AddRevenue)",
  google_ads: "Google Ads",
  meta_ads: "Meta Ads",
  microsoft_ads: "Microsoft Ads",
  tiktok_ads: "TikTok Ads",
  other_paid: "Annan betald annons",
  email: "E-post",
  organic_search: "Organisk sökning",
  organic_social: "Organiskt socialt",
  referral: "Hänvisning",
  direct: "Direkt",
  renewal: "Prenumeration (förnyelse)",
  unknown: "Okänd",
};

export const isChannel = (v: unknown): v is Channel => typeof v === "string" && (CHANNELS as readonly string[]).includes(v);
export const sourceLabel = (v: string | null | undefined) => (isChannel(v) ? channelLabel[v] : v ? v : channelLabel.unknown);

/** En klassad landning: kanal, detalj (kampanj, källa eller domän) och tidpunkt. */
export type Touch = { ch: Channel; d: string | null; t: number };

export const ATTRIBUTION_DAYS = 30;

const SEARCH = /(^|\.)(google|bing|duckduckgo|yahoo|ecosia|startpage|qwant|yandex|baidu|brave)\./;
const SOCIAL = /(^|\.)(facebook|fb|instagram|messenger|tiktok|linkedin|pinterest|youtube|reddit|threads|snapchat)\.|^t\.co$|^x\.com$|^lnkd\.in$/;
/** Betalningar och egna adresser räknas inte som källa (återkomst från Stripe m.m.). */
const IGNORE = /(^|\.)(stripe\.com|klarna\.com|paypal\.com|metilde\.com|metilde\.se|vercel\.app)$|^localhost$/;
const PAID_MEDIUM = /^(cpc|ppc|paid|paid[_-]?social|paidsocial|display|cpm|cpv|ads?)$/;

const clean = (v: string | null | undefined, max = 120) => (v ?? "").trim().slice(0, max) || null;

/**
 * Klassar en landning. Returnerar null när besöket är direkt eller internt
 * (ingen parameter och ingen extern referens) – då behålls tidigare källa.
 */
export function classifyLanding(url: URL, referrer: string, now = Date.now()): Touch | null {
  const p = new Map<string, string>();
  for (const [k, v] of url.searchParams.entries()) if (v.trim()) p.set(k.toLowerCase(), v.trim());
  const touch = (ch: Channel, d: string | null): Touch => ({ ch, d: clean(d), t: now });

  const src = p.get("utm_source")?.toLowerCase() ?? null;
  const med = p.get("utm_medium")?.toLowerCase() ?? null;
  const cmp = p.get("utm_campaign") ?? null;
  const withCampaign = (fallback: string | null) => (cmp ? (src ? `${src} · ${cmp}` : cmp) : fallback);

  if (["clickid", "adt_id", "adt_ei", "arid", "click_id"].some((k) => p.has(k)) || med === "affiliate") return touch("affiliate", p.get("utm_content") ?? p.get("channelid") ?? src);
  if (p.has("korg")) return touch("email", "Påminnelse om varukorg");
  if (p.has("gclid") || p.has("gbraid") || p.has("wbraid")) return touch("google_ads", withCampaign(null));
  if (p.has("msclkid")) return touch("microsoft_ads", withCampaign(null));
  if (p.has("ttclid")) return touch("tiktok_ads", withCampaign(null));
  if (med && PAID_MEDIUM.test(med)) {
    if (src && /google|youtube/.test(src)) return touch("google_ads", withCampaign(src));
    if (src && /facebook|^fb$|instagram|^ig$|meta/.test(src)) return touch("meta_ads", withCampaign(src));
    if (src && /bing|microsoft/.test(src)) return touch("microsoft_ads", withCampaign(src));
    if (src && /tiktok/.test(src)) return touch("tiktok_ads", withCampaign(src));
    return touch("other_paid", withCampaign(src));
  }
  if (med && /e-?mail|newsletter|nyhetsbrev/.test(med)) return touch("email", withCampaign(src));
  // fbclid läggs på av Meta både på annonser och på vanliga inlägg; våra annonser har dessutom utm_medium=paid
  if (p.has("fbclid")) return touch("meta_ads", withCampaign("fbclid utan UTM"));
  if (med && /social/.test(med)) return touch("organic_social", withCampaign(src));
  if (src) return touch("referral", withCampaign(src));

  let host = "";
  try {
    host = referrer ? new URL(referrer).hostname.toLowerCase().replace(/^www\./, "") : "";
  } catch {
    host = "";
  }
  if (host && host !== url.hostname.replace(/^www\./, "") && !IGNORE.test(host)) {
    if (SEARCH.test(host)) return touch("organic_search", p.has("srsltid") ? `${host} (produktlistning)` : host);
    if (SOCIAL.test(host)) return touch("organic_social", host);
    return touch("referral", host);
  }
  // Googles gratis produktlistningar lägger på srsltid även när referensen saknas
  if (p.has("srsltid")) return touch("organic_search", "google (produktlistning)");
  return null;
}

/** Sparat i webbläsaren: första landningen och senaste icke-direkta. */
export type SourceState = { first: Touch | null; last: Touch | null };

/** Vad som skickas med till kassan: senaste källan inom fönstret, annars direkt. */
export function checkoutSource(state: SourceState | null, now = Date.now()): { ch: Channel; d: string | null; first: Channel | null } {
  if (!state) return { ch: "unknown", d: null, first: null };
  const fresh = state.last && now - state.last.t <= ATTRIBUTION_DAYS * 864e5 ? state.last : null;
  return { ch: fresh?.ch ?? "direct", d: fresh?.d ?? null, first: state.first?.ch ?? null };
}
