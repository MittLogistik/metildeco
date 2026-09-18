import "server-only";

/**
 * Meta Marketing API – ett tunt lager för att läsa och styra annonser.
 * Kräver META_ADS_TOKEN (systemanvändare med ads_management + ads_read)
 * och META_AD_ACCOUNT_ID (siffrorna, utan "act_").
 *
 * OBS: annonskontot Metilde är i USD. Alla budgetar och belopp från API:t är i
 * kontots valuta (minsta enhet, dvs. cent). Använd accountCurrency() och
 * budgetUnits() i stället för att anta SEK.
 */

const API = "https://graph.facebook.com/v21.0";

export const adsConfigured = () => Boolean(process.env.META_ADS_TOKEN && process.env.META_AD_ACCOUNT_ID);

const token = () => process.env.META_ADS_TOKEN ?? "";
export const adAccount = () => `act_${process.env.META_AD_ACCOUNT_ID ?? ""}`;

type Json = Record<string, unknown>;

async function call<T = Json>(method: "GET" | "POST" | "DELETE", path: string, params: Json = {}): Promise<T> {
  const url = new URL(`${API}/${path}`);
  const body = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null) continue;
    const val = typeof v === "string" ? v : JSON.stringify(v);
    if (method === "GET") url.searchParams.set(k, val);
    else body.set(k, val);
  }
  if (method === "GET") url.searchParams.set("access_token", token());
  else body.set("access_token", token());
  const res = await fetch(url, method === "GET" ? undefined : { method, body });
  const text = await res.text();
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error(`Meta ${method} ${path}: ${res.status} ${text.slice(0, 200)}`);
  }
  if (!res.ok) {
    const err = (data as { error?: { message?: string; error_user_msg?: string } }).error;
    throw new Error(`Meta ${method} ${path}: ${err?.error_user_msg ?? err?.message ?? res.status}`);
  }
  return data as T;
}

export type Campaign = { id: string; name: string; status: string; effective_status: string; objective: string; daily_budget?: string; created_time: string };
export type AdSet = { id: string; name: string; status: string; effective_status: string; daily_budget?: string; campaign_id: string; created_time: string };
export type Ad = { id: string; name: string; status: string; effective_status: string; adset_id: string; created_time: string; creative?: { id: string; thumbnail_url?: string } };
export type Insight = {
  campaign_id?: string;
  adset_id?: string;
  ad_id?: string;
  ad_name?: string;
  impressions: string;
  clicks: string;
  spend: string;
  ctr?: string;
  cpc?: string;
  actions?: { action_type: string; value: string }[];
  action_values?: { action_type: string; value: string }[];
  purchase_roas?: { action_type: string; value: string }[];
};

type Paged<T> = { data: T[]; paging?: { next?: string } };

export const listCampaigns = () =>
  call<Paged<Campaign>>("GET", `${adAccount()}/campaigns`, { fields: "id,name,status,effective_status,objective,daily_budget,created_time", limit: 100 }).then((r) => r.data);

export const listAdSets = (campaignId: string) =>
  call<Paged<AdSet>>("GET", `${campaignId}/adsets`, { fields: "id,name,status,effective_status,daily_budget,campaign_id,created_time", limit: 100 }).then((r) => r.data);

export const listAds = (adsetId: string) =>
  call<Paged<Ad>>("GET", `${adsetId}/ads`, { fields: "id,name,status,effective_status,adset_id,created_time,creative{id,thumbnail_url}", limit: 100 }).then((r) => r.data);

/** Hela trädet kampanj → annonsgrupper → annonser i ett enda anrop (sparar Metas anropskvot). */
export type AdTreeNode = Campaign & { adsets?: { data: (AdSet & { ads?: { data: Ad[] } })[] } };
export const listTree = () =>
  call<Paged<AdTreeNode>>("GET", `${adAccount()}/campaigns`, {
    fields:
      "id,name,status,effective_status,objective,daily_budget,created_time,adsets.limit(50){id,name,status,effective_status,daily_budget,campaign_id,created_time,ads.limit(50){id,name,status,effective_status,adset_id,created_time,creative{id,thumbnail_url}}}",
    limit: 50,
  }).then((r) => r.data.filter((c) => c.effective_status !== "DELETED" && c.effective_status !== "ARCHIVED").sort((a, b) => b.created_time.localeCompare(a.created_time)));

/** Resultat per annons för de senaste N dagarna. */
export const adInsights = (objectId: string, days = 7, level: "campaign" | "adset" | "ad" = "ad") =>
  call<Paged<Insight>>("GET", `${objectId}/insights`, {
    level,
    date_preset: days <= 7 ? "last_7d" : days <= 14 ? "last_14d" : "last_30d",
    fields: "campaign_id,adset_id,ad_id,ad_name,impressions,clicks,spend,ctr,cpc,actions,action_values,purchase_roas",
    limit: 500,
  }).then((r) => r.data);

/** Resultat för ett datumintervall (YYYY-MM-DD), t.ex. sedan kampanjen skapades. */
export const insightsRange = (objectId: string, since: string, until: string, level: "campaign" | "adset" | "ad" = "ad") =>
  call<Paged<Insight>>("GET", `${objectId}/insights`, {
    level,
    time_range: { since, until },
    fields: "campaign_id,adset_id,ad_id,ad_name,impressions,clicks,spend,ctr,cpc,actions,action_values,purchase_roas",
    limit: 500,
  }).then((r) => r.data);

/** Summerar köp, intäkt och kostnad per rad till något läsbart. */
export const summarize = (i: Insight) => {
  const n = (list: Insight["actions"], type: string) => Number(list?.find((a) => a.action_type === type)?.value ?? 0);
  const spend = Number(i.spend ?? 0);
  const purchases = n(i.actions, "purchase") || n(i.actions, "omni_purchase");
  const revenue = n(i.action_values, "purchase") || n(i.action_values, "omni_purchase");
  const addToCart = n(i.actions, "add_to_cart");
  return {
    impressions: Number(i.impressions ?? 0),
    clicks: Number(i.clicks ?? 0),
    ctr: Number(i.ctr ?? 0),
    cpc: Number(i.cpc ?? 0),
    spend,
    addToCart,
    purchases,
    revenue,
    roas: spend > 0 ? revenue / spend : 0,
    cpa: purchases > 0 ? spend / purchases : null,
  };
};

export const setStatus = (objectId: string, status: "ACTIVE" | "PAUSED") => call("POST", objectId, { status });

/** Kontots valuta (t.ex. USD) – cachas per process. */
let currencyCache: string | null = null;
export const accountCurrency = async () => {
  if (!currencyCache) currencyCache = (await call<{ currency: string }>("GET", adAccount(), { fields: "currency" })).currency;
  return currencyCache;
};

/** Belopp i kontots valuta → API:ts minsta enhet (cent). */
export const budgetUnits = (amount: number) => Math.round(amount * 100);

/** Daglig budget i kontots valuta (USD för Metilde). */
export const setDailyBudget = (adsetId: string, amount: number) => call("POST", adsetId, { daily_budget: budgetUnits(amount) });

/** Kampanj med budget på annonsgruppsnivå, skapas pausad. */
export const createCampaign = (name: string, objective: "OUTCOME_SALES" | "OUTCOME_TRAFFIC" = "OUTCOME_SALES") =>
  call<{ id: string }>("POST", `${adAccount()}/campaigns`, {
    name,
    objective,
    status: "PAUSED",
    special_ad_categories: [],
    buying_type: "AUCTION",
    // Budget ligger på annonsgruppen; Meta kräver att delning anges uttryckligen
    is_adset_budget_sharing_enabled: false,
  });

export type AdSetSpec = {
  name: string;
  campaignId: string;
  /** Daglig budget i kontots valuta (USD). */
  dailyBudget: number;
  pixelId: string;
  /** Ålder och land; Sverige som standard. */
  countries?: string[];
  ageMin?: number;
  ageMax?: number;
  productUrl?: string;
};

/**
 * Placeringar vi annonserar i. Annonsgruppen begränsas till exakt dessa, och reglerna för
 * bild per placering täcker exakt samma lista – annars vägrar Meta skapa annonsen.
 */
export const placements = {
  feed: {
    facebook_positions: ["feed", "marketplace", "search", "profile_feed"],
    instagram_positions: ["stream", "explore_home", "profile_feed", "ig_search"],
  },
  story: {
    facebook_positions: ["story", "facebook_reels"],
    instagram_positions: ["story", "reels"],
  },
};

/** Annonsgrupp som optimerar mot köp via pixeln, bred målgrupp (Advantage+ audience). */
export const createAdSet = (s: AdSetSpec) =>
  call<{ id: string }>("POST", `${adAccount()}/adsets`, {
    name: s.name,
    campaign_id: s.campaignId,
    status: "PAUSED",
    daily_budget: budgetUnits(s.dailyBudget),
    billing_event: "IMPRESSIONS",
    optimization_goal: "OFFSITE_CONVERSIONS",
    bid_strategy: "LOWEST_COST_WITHOUT_CAP",
    promoted_object: { pixel_id: s.pixelId, custom_event_type: "PURCHASE" },
    targeting: {
      geo_locations: { countries: s.countries ?? ["SE"] },
      age_min: s.ageMin ?? 25,
      age_max: s.ageMax ?? 65,
      targeting_automation: { advantage_audience: 1 },
      publisher_platforms: ["facebook", "instagram"],
      facebook_positions: [...placements.feed.facebook_positions, ...placements.story.facebook_positions],
      instagram_positions: [...placements.feed.instagram_positions, ...placements.story.instagram_positions],
    },
  });

export type CreativeSpec = {
  name: string;
  pageId: string;
  /** Instagram-konto (instagram_user_id). Page-backed konto: GET {page}/page_backed_instagram_accounts med sidtoken. */
  instagramActorId?: string;
  imageHash?: string;
  videoId?: string;
  primaryText: string;
  headline: string;
  description?: string;
  link: string;
  callToAction?: "SHOP_NOW" | "LEARN_MORE";
};

/** Bild- eller videoannons med länk till produktsidan. */
export const createCreative = (c: CreativeSpec) => {
  const cta = { type: c.callToAction ?? "SHOP_NOW", value: { link: c.link } };
  const base = { message: c.primaryText, link: c.link, name: c.headline, description: c.description, call_to_action: cta };
  const object_story_spec = c.videoId
    ? { page_id: c.pageId, instagram_user_id: c.instagramActorId, video_data: { video_id: c.videoId, image_hash: c.imageHash, title: c.headline, message: c.primaryText, link_description: c.description, call_to_action: cta } }
    : { page_id: c.pageId, instagram_user_id: c.instagramActorId, link_data: { ...base, image_hash: c.imageHash } };
  return call<{ id: string }>("POST", `${adAccount()}/adcreatives`, {
    name: c.name,
    object_story_spec,
  });
};

export const createAd = (name: string, adsetId: string, creativeId: string, status: "ACTIVE" | "PAUSED" = "PAUSED") =>
  call<{ id: string }>("POST", `${adAccount()}/ads`, { name, adset_id: adsetId, creative: { creative_id: creativeId }, status });

export type PlacementCreativeSpec = {
  name: string;
  pageId: string;
  instagramActorId?: string;
  /** Bild för flöden (1:1 eller 4:5). */
  feedHash: string;
  /** Bild för stories/reels (9:16). Saknas den används flödesbilden överallt. */
  storyHash?: string;
  primaryText: string;
  headline: string;
  description?: string;
  link: string;
};

/**
 * Bildannons med olika bild per placering: flödesbilden i feeds, storybilden i stories och reels.
 * Bygger på asset_feed_spec med asset_customization_rules. Utan storybild blir det en vanlig bildannons.
 */
export const createPlacementCreative = (c: PlacementCreativeSpec) => {
  const feedLabel = { name: "feed" };
  const storyLabel = { name: "story" };
  const withStory = Boolean(c.storyHash);
  // Utan storybild: vanlig bildannons (asset_feed_spec med en bild räknas som dynamiskt innehåll)
  if (!withStory)
    return createCreative({ name: c.name, pageId: c.pageId, instagramActorId: c.instagramActorId, imageHash: c.feedHash, primaryText: c.primaryText, headline: c.headline, description: c.description, link: c.link });
  return call<{ id: string }>("POST", `${adAccount()}/adcreatives`, {
    name: c.name,
    // instagram_user_id krävs för bild per placering; sidans page-backed Instagram-konto duger
    object_story_spec: { page_id: c.pageId, instagram_user_id: c.instagramActorId },
    asset_feed_spec: {
      images: withStory ? [{ hash: c.feedHash, adlabels: [feedLabel] }, { hash: c.storyHash, adlabels: [storyLabel] }] : [{ hash: c.feedHash }],
      bodies: [{ text: c.primaryText }],
      titles: [{ text: c.headline }],
      descriptions: c.description ? [{ text: c.description }] : undefined,
      link_urls: [{ website_url: c.link }],
      call_to_action_types: ["SHOP_NOW"],
      ad_formats: ["SINGLE_IMAGE"],
      ...(withStory
        ? {
            // PLACEMENT = "en bild per placering", inte dynamiskt innehåll
            optimization_type: "PLACEMENT",
            asset_customization_rules: [
              { customization_spec: { publisher_platforms: ["facebook", "instagram"], ...placements.feed }, image_label: feedLabel },
              { customization_spec: { publisher_platforms: ["facebook", "instagram"], ...placements.story }, image_label: storyLabel },
            ],
          }
        : {}),
    },
  });
};

/**
 * Laddar upp en bild och returnerar image_hash. Bilden hämtas av oss och skickas som
 * bytes: uppladdning via url-parametern kräver en app-behörighet vi inte har.
 */
export const uploadImage = async (url: string, name: string) => {
  const img = await fetch(url);
  if (!img.ok) throw new Error(`Kunde inte hämta bilden ${url} (${img.status})`);
  const bytes = Buffer.from(await img.arrayBuffer()).toString("base64");
  const res = await call<{ images: Record<string, { hash: string }> }>("POST", `${adAccount()}/adimages`, { bytes, name });
  const first = Object.values(res.images)[0];
  if (!first) throw new Error("Meta gav ingen image_hash tillbaka.");
  return first.hash;
};

export const uploadVideo = (fileUrl: string, name: string) => call<{ id: string }>("POST", `${adAccount()}/advideos`, { file_url: fileUrl, name });

/** Vad token får göra – används av adminpanelen för att visa status. */
export const tokenInfo = () =>
  call<{ data: { scopes: string[]; type: string; is_valid: boolean; expires_at: number } }>("GET", "debug_token", { input_token: token() }).then((r) => r.data);
