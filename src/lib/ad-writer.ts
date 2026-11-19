import "server-only";
import { fillCopy, type AdAngle } from "@/content/ad-copy";
import type { Product } from "./products";
import { site } from "./site";

/**
 * Skriver annonstexten till Meta med AI (ChatGPT i första hand, Claude som reserv).
 * Tonen är säljande och använder emojis – men inom det som går att styrka: botanik,
 * extraktstyrka, dos, tillverkning, tester, pris, frakt, prenumeration och ångerrätt.
 *
 * Hälsopåståenden är inte en risk vi kan ta: de är förbjudna för kosttillskott enligt
 * EU:s förordning 1924/2006 och Meta avvisar annonserna. Texten granskas dessutom av
 * `reviewAd` innan annonsen skapas, och faller tillbaka på mallen i ad-copy.ts om den
 * inte håller.
 */

export type AdCopy = { primaryText: string; headline: string; description?: string; source: "ai" | "mall" };

export const copyAiConfigured = () => process.env.AD_COPY_AI !== "false" && Boolean(process.env.OPENAI_API_KEY || process.env.ANTHROPIC_API_KEY);

/** Meta klipper texten i flödet; det här är gränserna vi håller oss inom. */
const LIMITS = { primaryMin: 90, primaryMax: 600, headlineMax: 40, descriptionMax: 40 };

/**
 * Ord och vändningar som gör texten till ett hälsopåstående. Sista nätet före
 * AI-granskningen – modellen instrueras redan att undvika dem.
 */
const bannedPatterns: { re: RegExp; why: string }[] = [
  { re: /\b(energi|energin|energinivå\w*)\b/i, why: "energi" },
  { re: /\b(testosteron\w*|hormon\w*)\b/i, why: "hormoner" },
  { re: /\b(libido|potens|sexlust|lust)\b/i, why: "libido" },
  { re: /\b(sömn|sover|sova|insomn\w*)\b/i, why: "sömn" },
  { re: /\b(stress\w*|lugn\w*|ångest|nedstämd\w*)\b/i, why: "stress och humör" },
  { re: /\b(fokus|koncentration\w*|minne|klarhet|hjärn\w*)\b/i, why: "fokus" },
  { re: /\b(immunförsvar\w*|infektion\w*)\b/i, why: "immunförsvar" },
  { re: /\b(prestation\w*|prestera\w*|återhämtning\w*|uthållighet\w*|muskel\w*|träningsresultat)\b/i, why: "prestation" },
  { re: /\b(viktnedgång|gå ner i vikt|fettförbränning\w*)\b/i, why: "vikt" },
  { re: /\b(boost\w*|kickstart\w*|peppar|laddar dig)\b/i, why: "boost" },
  { re: /\b(botar|läker|lindrar|motverkar|förebygger|hjälper mot|bra för)\b/i, why: "medicinsk effekt" },
  { re: /\b(ökar|förbättrar|stärker|höjer)\s+(din|ditt|dina)?\s*\w*/i, why: "påstådd effekt" },
  { re: /\b(du som är över \d+|män med|kvinnor med|känner du dig)\b/i, why: "personlig egenskap" },
  { re: /\b(garanterar|garanterat resultat|bevisat effektiv\w*)\b/i, why: "garanti om effekt" },
  { re: /naturlig lösning|lösningen på|svaret på|hjälpen du|mot trötthet/i, why: "att produkten löser ett problem" },
  // Ångerrätten gäller bara oöppnade produkter, så "öppet köp" vore fel om villkoren
  { re: /öppet köp|prova på oss|prova riskfritt/i, why: "öppet köp (vi har ångerrätt på oöppnade produkter)" },
];

const emojiCount = (s: string) => (s.match(/\p{Extended_Pictographic}/gu) ?? []).length;

type Raw = { primaryText?: unknown; headline?: unknown; description?: unknown };

async function askText(system: string, user: string): Promise<string> {
  const model = process.env.AD_COPY_MODEL;
  if (process.env.OPENAI_API_KEY) {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
      body: JSON.stringify({
        model: model ?? "gpt-4o",
        temperature: 0.9,
        max_tokens: 700,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
      }),
    });
    const data = (await res.json()) as { choices?: { message?: { content?: string | null; refusal?: string | null } }[]; error?: { message?: string } };
    if (!res.ok) throw new Error(`OpenAI: ${data.error?.message ?? res.status}`);
    const msg = data.choices?.[0]?.message;
    if (!msg?.content && msg?.refusal) throw new Error(`OpenAI vägrade: ${msg.refusal.slice(0, 200)}`);
    return msg?.content ?? "";
  }
  if (process.env.ANTHROPIC_API_KEY) {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "content-type": "application/json", "x-api-key": process.env.ANTHROPIC_API_KEY, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({ model: model ?? "claude-sonnet-5", max_tokens: 700, temperature: 1, system, messages: [{ role: "user", content: user }] }),
    });
    const data = (await res.json()) as { content?: { text?: string }[]; error?: { message?: string } };
    if (!res.ok) throw new Error(`Anthropic: ${data.error?.message ?? res.status}`);
    return data.content?.map((c) => c.text ?? "").join("") ?? "";
  }
  throw new Error("Ingen AI-nyckel för annonstexter.");
}

/** Som askText, men modellen får också se en bild. Samma leverantörsordning: OpenAI först, annars Anthropic. */
async function askVision(system: string, user: string, imageUrl: string): Promise<string> {
  const model = process.env.AD_COPY_MODEL;
  if (process.env.OPENAI_API_KEY) {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
      body: JSON.stringify({
        model: model ?? "gpt-4o",
        temperature: 0.9,
        max_tokens: 700,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: system },
          { role: "user", content: [{ type: "text", text: user }, { type: "image_url", image_url: { url: imageUrl, detail: "low" } }] },
        ],
      }),
    });
    const data = (await res.json()) as { choices?: { message?: { content?: string | null; refusal?: string | null } }[]; error?: { message?: string } };
    if (!res.ok) throw new Error(`OpenAI: ${data.error?.message ?? res.status}`);
    const msg = data.choices?.[0]?.message;
    if (!msg?.content && msg?.refusal) throw new Error(`OpenAI vägrade: ${msg.refusal.slice(0, 200)}`);
    return msg?.content ?? "";
  }
  if (process.env.ANTHROPIC_API_KEY) {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "content-type": "application/json", "x-api-key": process.env.ANTHROPIC_API_KEY, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({
        model: model ?? "claude-sonnet-5",
        max_tokens: 700,
        temperature: 1,
        system,
        messages: [{ role: "user", content: [{ type: "image", source: { type: "url", url: imageUrl } }, { type: "text", text: user }] }],
      }),
    });
    const data = (await res.json()) as { content?: { text?: string }[]; error?: { message?: string } };
    if (!res.ok) throw new Error(`Anthropic: ${data.error?.message ?? res.status}`);
    return data.content?.map((c) => c.text ?? "").join("") ?? "";
  }
  throw new Error("Ingen AI-nyckel för annonstexter.");
}

const systemPrompt = `Du är copywriter för Metilde, ett svenskt märke som säljer botaniska kosttillskott i kapselform.
Du skriver Meta-annonser (Facebook och Instagram) på svenska som ska stoppa scrollen och sälja.

TONEN: direkt, självsäker och personlig. Korta meningar. Tilltala läsaren med du. Börja med en krok som
får någon att stanna. Avsluta alltid med en tydlig uppmaning att handla. Använd 2–5 emojis i primärtexten,
placerade naturligt (gärna som punktlista) och högst en i rubriken. Inga hashtaggar. Inga versaler i rad.

DET HÄR ÄR FÖRBJUDET, och annonsen stoppas om du bryter mot det:
- Allt som antyder att produkten gör något med kroppen eller sinnet: energi, testosteron, hormoner, libido,
  sömn, stress, humör, fokus, minne, immunförsvar, prestation, återhämtning, muskler, vikt, "boost".
- Medicinska ord, före och efter, jämförelser med läkemedel, löften om resultat.
- Att tilltala personliga egenskaper ("du som är över 40", "känner du dig trött").
- Siffror, halter, certifieringar eller erbjudanden som inte står i de uppgifter du får.

DET DU SÄLJER PÅ I STÄLLET, och det räcker långt:
- Råvaran och botaniken: vilken växt, vilken del, var den kommer ifrån.
- Extraktstyrkan och dosen per kapsel, öppet redovisad. Att kunna jämföra innehåll mot innehåll.
- Renheten: inga fyllnadsmedel, bindemedel eller färgämnen. Vegansk kapsel.
- Vegansk kapsel utan fyllnadsmedel. Skriv ALDRIG att produkterna är utvecklade, tillverkade, producerade, kapslade eller packade i Sverige, och kalla inte Metilde ett svenskt varumärke. Skriv ALDRIG att produkterna är tredjepartstestade, labbtestade eller certifierade.
- Rutinen: en kapsel om dagen.
- Villkoren: pris, fri frakt, ångerrätt på oöppnade produkter, prenumeration med rabatt, pausa när du vill.
- Nyfikenhet och hantverk: att det här är för den som läser innehållsförteckningen.

Svara bara med JSON: {"primaryText": "...", "headline": "...", "description": "..."}
primaryText: 90–600 tecken, gärna radbrytningar. headline: högst 40 tecken. description: högst 40 tecken.`;

const productBrief = (product: Product, hook: string, angle: AdAngle) =>
  [
    `Produkt: ${product.name}`,
    `Pris: ${product.regularPrice} kr för ${[product.variant?.size, product.variant?.format].filter(Boolean).join(" ") || "en burk"}`,
    `Kort beskrivning: ${product.short}`,
    product.bullets.length ? `Verifierade fakta (bara dessa får användas):\n- ${product.bullets.join("\n- ")}` : "",
    `Faktamening att bygga på: ${hook}`,
    // Ångerrätten är 30 dagar och gäller oöppnade produkter (se src/content/legal.ts) – skriv aldrig "öppet köp" på bruten förpackning
    `Villkor som alltid gäller: fri frakt över ${site.freeShippingOver} kr, 30 dagars ångerrätt på oöppnade produkter, prenumeration ger ${site.subscriptionDiscount} % rabatt och kan pausas eller avslutas när som helst, order före kl. 12 på vardagar skickas samma dag.`,
    `Vinkeln den här annonsen ska ta: ${angleBrief[angle.id] ?? angle.id}`,
    `Skriv en helt ny text för vinkeln. Härma inte formuleringarna nedan, de visar bara vad vinkeln handlar om:\n${fillCopy(angle.text, { name: product.name, hook })}`,
  ]
    .filter(Boolean)
    .join("\n");

/** Vad varje vinkel ska handla om, så att de fem annonserna i en kampanj blir olika. */
const angleBrief: Record<string, string> = {
  extrakt: "Råvaran och extraktstyrkan. Visa hur koncentrerat det är och hur mycket som finns per kapsel.",
  jamfor: "Utmana läsaren att jämföra innehållsförteckningar. Vi redovisar styrka och dos öppet, många gör det inte.",
  rutin: "Enkelheten. En kapsel om dagen, vegansk, inga tillsatser. Passa in i vardagen utan krångel.",
  prenumeration: "Erbjudandet. Prenumerera och spara, välj intervall, pausa eller avsluta när du vill.",
  svenskt: "Trygga villkor: skickas samma dag, fri frakt, 30 dagars ångerrätt på oöppnade produkter.",
  varukorg: "Retargeting till någon som lagt varan i varukorgen men inte köpt. Vänlig påminnelse, sänk tröskeln med villkoren (snabb leverans, fri frakt, ångerrätt). Inget tjat, ingen brådska som inte är sann.",
  paminnelse: "Retargeting till någon som besökt produktsidan. Påminn om produkten, peka på det som går att kontrollera (styrka, dos, analyser) och nämn prenumerationsrabatten. Ingen brådska.",
};

const clean = (s: unknown, max: number) =>
  String(s ?? "")
    .replace(/\s+\n/g, "\n")
    .replace(/[#*]/g, "")
    .trim()
    .slice(0, max);

/** Vad som är fel med texten, eller null om den duger. */
function validate(copy: { primaryText: string; headline: string; description: string }): string | null {
  if (copy.primaryText.length < LIMITS.primaryMin) return `primärtexten är för kort (${copy.primaryText.length} tecken, minst ${LIMITS.primaryMin}).`;
  if (!copy.headline) return "rubriken saknas.";
  if (copy.headline.length > LIMITS.headlineMax) return `rubriken är längre än ${LIMITS.headlineMax} tecken.`;
  if (emojiCount(copy.primaryText) < 1) return "primärtexten saknar emojis.";
  if (emojiCount(copy.headline) > 1) return "rubriken har mer än en emoji.";
  const all = `${copy.primaryText}\n${copy.headline}\n${copy.description}`;
  for (const { re, why } of bannedPatterns) {
    const hit = all.match(re);
    // "extraktstyrka" och liknande sammansättningar är fakta om produkten, inte påståenden
    if (hit && !/extraktstyrk|styrkan i extraktet/i.test(hit[0])) return `texten innehåller ett hälsopåstående om ${why} ("${hit[0].trim()}").`;
  }
  return null;
}

const parse = (text: string): Raw | null => {
  const body = text.slice(text.indexOf("{"), text.lastIndexOf("}") + 1);
  try {
    return JSON.parse(body) as Raw;
  } catch {
    return null;
  }
};

/** Texten från mallarna, som reserv när AI inte är påslaget eller inte håller måttet. */
export const templateCopy = (product: Product, angle: AdAngle, hook: string): AdCopy => {
  const vars = { name: product.name, hook };
  return {
    primaryText: fillCopy(angle.text, vars),
    headline: fillCopy(angle.headline, vars),
    description: angle.description ? fillCopy(angle.description, vars) : undefined,
    source: "mall",
  };
};

/**
 * Skriver annonstexten för en vinkel. Försöker två gånger och berättar för modellen vad
 * som var fel, och faller tillbaka på mallen om det ändå inte håller. Kastar aldrig.
 */
export async function writeAdCopy(o: { product: Product; angle: AdAngle; hook: string; notes?: string[]; avoid?: string }): Promise<AdCopy> {
  if (!copyAiConfigured()) return templateCopy(o.product, o.angle, o.hook);
  let brief = productBrief(o.product, o.hook, o.angle);
  // Synpunkter från granskningen av ett tidigare förslag
  if (o.avoid) brief = `${brief}\n\nEn tidigare text underkändes av granskningen med motiveringen: "${o.avoid}". Undvik det helt den här gången.`;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const raw = parse(await askText(systemPrompt, brief));
      if (!raw) {
        brief = `${brief}\n\nDitt förra svar gick inte att tolka. Svara bara med JSON.`;
        continue;
      }
      const copy = {
        primaryText: clean(raw.primaryText, LIMITS.primaryMax),
        headline: clean(raw.headline, LIMITS.headlineMax),
        description: clean(raw.description, LIMITS.descriptionMax),
      };
      const problem = validate(copy);
      if (!problem) return { ...copy, description: copy.description || undefined, source: "ai" };
      o.notes?.push(`${o.angle.id}: omskrivning – ${problem}`);
      brief = `${brief}\n\nDitt förra förslag godkändes inte: ${problem} Skriv om texten utan det, behåll säljtonen och emojisarna.`;
    } catch (e) {
      o.notes?.push(`${o.angle.id}: AI-texten misslyckades (${e instanceof Error ? e.message : e}), mallen används.`);
      break;
    }
  }
  o.notes?.push(`${o.angle.id}: mallen används i stället för AI-texten.`);
  return templateCopy(o.product, o.angle, o.hook);
}

/**
 * Skriver texten utifrån bilden: modellen ser annonsbilden och skriver en text som passar
 * det den visar (miljö, stämning, det som står på bilden) utan att upprepa bildens text.
 * Samma regler och samma kontroll som writeAdCopy; mallen för fallbackAngle är reserven.
 */
export async function writeAdCopyFromImage(o: { product: Product; imageUrl: string; hook: string; notes?: string[]; avoid?: string; fallbackAngle: AdAngle }): Promise<AdCopy> {
  const label = "bild";
  if (!copyAiConfigured()) return templateCopy(o.product, o.fallbackAngle, o.hook);
  let brief = [
    `Produkt: ${o.product.name}`,
    `Pris: ${o.product.regularPrice} kr för ${[o.product.variant?.size, o.product.variant?.format].filter(Boolean).join(" ") || "en burk"}`,
    `Kort beskrivning: ${o.product.short}`,
    o.product.bullets.length ? `Verifierade fakta (bara dessa får användas):\n- ${o.product.bullets.join("\n- ")}` : "",
    `Faktamening att bygga på: ${o.hook}`,
    `Villkor som alltid gäller: fri frakt över ${site.freeShippingOver} kr, 30 dagars ångerrätt på oöppnade produkter, prenumeration ger ${site.subscriptionDiscount} % rabatt och kan pausas eller avslutas när som helst, order före kl. 12 på vardagar skickas samma dag.`,
    "Bilden är annonsens bild. Titta noga på den: miljön, stämningen, vad som lyfts fram och vilken text som redan står på bilden.",
    "Skriv en text som hör ihop med just den här bilden: ta upp det bilden visar och förstärk det, i stället för en allmän produkttext. Upprepa inte ord för ord det som redan står på bilden. Påstå aldrig något om bilden som inte syns, och hitta inte på siffror utöver de verifierade fakta.",
  ]
    .filter(Boolean)
    .join("\n");
  if (o.avoid) brief = `${brief}\n\nEn tidigare text underkändes av granskningen med motiveringen: "${o.avoid}". Undvik det helt den här gången.`;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const raw = parse(await askVision(systemPrompt, brief, o.imageUrl));
      if (!raw) {
        brief = `${brief}\n\nDitt förra svar gick inte att tolka. Svara bara med JSON.`;
        continue;
      }
      const copy = {
        primaryText: clean(raw.primaryText, LIMITS.primaryMax),
        headline: clean(raw.headline, LIMITS.headlineMax),
        description: clean(raw.description, LIMITS.descriptionMax),
      };
      const problem = validate(copy);
      if (!problem) return { ...copy, description: copy.description || undefined, source: "ai" };
      o.notes?.push(`${label}: omskrivning – ${problem}`);
      brief = `${brief}\n\nDitt förra förslag godkändes inte: ${problem} Skriv om texten utan det, behåll säljtonen och emojisarna.`;
    } catch (e) {
      o.notes?.push(`${label}: AI-texten misslyckades (${e instanceof Error ? e.message : e}), mallen används.`);
      break;
    }
  }
  o.notes?.push(`${label}: mallen används i stället för AI-texten.`);
  return templateCopy(o.product, o.fallbackAngle, o.hook);
}

/**
 * Primärtext till en katalogannons (karusell). Samma regler som vanliga annonser:
 * säljande ton med emojis, men bara påståenden som går att styrka. Faller tillbaka på
 * en neutral text som byggs av produkternas egna fakta.
 */
export async function writeCatalogText(o: { products: Product[]; angle: string; notes?: string[] }): Promise<AdCopy> {
  const list = o.products
    .map((p) => `- ${p.name.replace(/ \|.*$/, "")}: ${p.bullets.filter((b) => b.length <= 46).slice(0, 2).join("; ") || p.short}`)
    .join("\n");
  const fallback = (): AdCopy => ({
    primaryText: `${o.products.length} botaniska extrakt från Metilde 🌿\n\n${o.products.map((p) => `• ${p.name.replace(/ \|.*$/, "")}`).join("\n")}\n\nExtraktstyrka och dos står på varje burk. 📦 Fri frakt över ${site.freeShippingOver} kr.\n\nSvep och välj din.`,
    headline: "Hela sortimentet",
    description: "Vegansk kapsel",
    source: "mall",
  });
  if (!copyAiConfigured()) return fallback();

  let brief = [
    `Du skriver primärtexten till en karusellannons där varje kort visar en produkt ur sortimentet.`,
    `Produkter i karusellen (bara dessa fakta får användas):\n${list}`,
    `Villkor: fri frakt över ${site.freeShippingOver} kr, 30 dagars ångerrätt på oöppnade produkter, prenumeration ger ${site.subscriptionDiscount} % rabatt.`,
    `Vinkel: ${o.angle}`,
    `Nämn gärna att man kan svepa mellan korten. Räkna aldrig upp fler produkter än de som står ovan.`,
  ].join("\n");

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const raw = parse(await askText(systemPrompt, brief));
      if (!raw) {
        brief = `${brief}\n\nDitt förra svar gick inte att tolka. Svara bara med JSON.`;
        continue;
      }
      const copy = { primaryText: clean(raw.primaryText, LIMITS.primaryMax), headline: clean(raw.headline, LIMITS.headlineMax), description: clean(raw.description, LIMITS.descriptionMax) };
      const problem = validate(copy);
      if (!problem) return { ...copy, description: copy.description || undefined, source: "ai" };
      o.notes?.push(`katalogtexten skrevs om: ${problem}`);
      brief = `${brief}\n\nDitt förra förslag godkändes inte: ${problem} Skriv om texten utan det.`;
    } catch (e) {
      o.notes?.push(`katalogtexten misslyckades (${e instanceof Error ? e.message : e}), mallen används.`);
      break;
    }
  }
  return fallback();
}

/* ------------------------------ Kampanjannonser på marknadens språk ------------------------------ */

/**
 * Hälsopåståenden på marknadernas språk (en, de, fr, nl, fi, da, pl) och Sverige som ursprung.
 * Grovt nät före granskningen; modellen instrueras redan att undvika allt detta.
 */
const bannedAnyLanguage: { re: RegExp; why: string }[] = [
  { re: /\b(energy|energie|énergie|energia|energi|energiaa)\b/i, why: "energi" },
  { re: /testosteron|hormon/i, why: "hormoner" },
  { re: /\b(libido|potency|potenz|puissance sexuelle)\b/i, why: "libido" },
  { re: /\b(sleep|schlaf\w*|sommeil|slaap|søvn|unta|unen|uni)\b/i, why: "sömn" },
  { re: /\b(stress\w*|stres\w*|anxiety|angst|anxiété|ahdistus)\b/i, why: "stress" },
  { re: /\b(focus|fokus|konzentration|concentration|concentratie|keskittym\w*|koncentracj\w*)\b/i, why: "fokus" },
  { re: /\b(immun\w*|odporno\w*|vastustusky\w*)\b/i, why: "immunförsvar" },
  { re: /\b(performance|leistung\w*|prestatie\w*|suoritusky\w*|wydajno\w*|ydeevne)\b/i, why: "prestation" },
  { re: /\b(muscle\w*|muskel\w*|spier\w*|lihas\w*|mięś\w*|muskl\w*)\b/i, why: "muskler" },
  { re: /\b(vitality|vitalität|vitalité|vitaliteit|vitalitet|elinvoima\w*|witalno\w*)\b/i, why: "vitalitet" },
  { re: /\b(boost\w*|recovery|erholung|récupération|herstel|palautum\w*|regeneracj\w*|restitution)\b/i, why: "boost och återhämtning" },
  { re: /\b(swed\w*|schwed\w*|suède|suédois\w*|zweed\w*|zweden|ruotsi\w*|sverige|svensk\w*|szwecj\w*|szwedzk\w*)\b/i, why: "Sverige som ursprung" },
  { re: /\b(tehok\w*|effective\w*|effektiv\w*|wirksam\w*|efficac\w*|effectie\w*|skuteczn\w*|powerful|kraftvoll\w*|puissant\w*|krachtig\w*|voimakk\w*|potężn\w*)/i, why: "effekt (effektiv, kraftfull)" },
  { re: /\b(third[- ]party tested|lab[- ]tested|laborgeprüft|certified|zertifiziert|certifié)\b/i, why: "tester och certifieringar" },
];

export type SaleBrief = {
  /** Produkten från marknadens katalog: namn, fakta och priser på språket och i valutan. */
  product: Product;
  /** Språkets namn på engelska, t.ex. "Finnish". */
  language: string;
  /** Färdigformaterade fakta: kampanjpriset, ordinarie pris, slutdatum, frakt. */
  facts: string[];
  /** "price" = erbjudandet först, "product" = råvaran först och erbjudandet sist. */
  angle: "price" | "product";
  notes?: string[];
  avoid?: string;
};

const saleSystem = (language: string) => `You are the copywriter for Metilde, a brand of botanical food supplements in capsules.
You write Meta ads (Facebook and Instagram) for a time-limited sale. Write ONLY in ${language}, natural and idiomatic, as a native copywriter would. Never mix in Swedish or English words (except brand and product names).

TONE: direct, confident, personal. Short sentences. Address the reader informally where natural in ${language}. Open with a hook that stops the scroll. Always end with a clear call to buy before the sale ends. Use 2–5 emojis in the primary text, placed naturally (e.g. as a short list), at most one in the headline. No hashtags. No all-caps words except "BLACK WEEK".

FORBIDDEN – the ad is stopped if you break this:
- Anything suggesting the product does something for the body or mind: energy, testosterone, hormones, libido, sleep, stress, mood, focus, memory, immunity, performance, recovery, muscles, weight, vitality, "boost". The label on the jar shows words like Energy/Performance/Vitality – never repeat them.
- Medical words, before/after, comparisons with medicine, promises of results, addressing personal traits ("if you are over 40").
- Numbers, prices, dates, test results, certifications or offers that are not in the facts you are given. Use the prices exactly as written.
- Calling the product effective, powerful or potent in any language (e.g. tehokas, wirksam, efficace, effectief, skuteczny, effektiv) – describe what it contains, never what it does.
- Mentioning Sweden or that anything is Swedish. Saying the products are tested, lab-tested or certified.
- Inventing urgency beyond the real end date.

WHAT YOU SELL ON: the sale (the exact discount, price and end date), the botanical raw material and extract strength per capsule as given, vegan capsule without fillers, one capsule a day, the shipping and return terms as given.

Answer only with JSON: {"primaryText": "...", "headline": "...", "description": "..."}
primaryText: 90–600 characters, line breaks welcome. headline: max 40 characters. description: max 40 characters.`;

/**
 * Kampanjtexter på andra språk än svenska skrivs av en starkare modell än de svenska
 * (gpt-4o skriver stelt på finska och polska): OpenAI gpt-5.4 i första hand (AD_SALE_MODEL),
 * annars Claude. Misslyckas anropet används samma väg som övriga texter.
 */
async function askSale(system: string, user: string): Promise<string> {
  try {
    if (process.env.OPENAI_API_KEY) {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: { "content-type": "application/json", authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
        body: JSON.stringify({
          model: process.env.AD_SALE_MODEL ?? "gpt-5.4",
          reasoning_effort: "low",
          max_completion_tokens: 4000,
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: system },
            { role: "user", content: user },
          ],
        }),
      });
      const data = (await res.json()) as { choices?: { message?: { content?: string | null } }[]; error?: { message?: string } };
      if (!res.ok) throw new Error(`OpenAI: ${data.error?.message ?? res.status}`);
      return data.choices?.[0]?.message?.content ?? "";
    }
    if (process.env.ANTHROPIC_API_KEY) {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "content-type": "application/json", "x-api-key": process.env.ANTHROPIC_API_KEY, "anthropic-version": "2023-06-01" },
        body: JSON.stringify({ model: process.env.AD_SALE_MODEL ?? "claude-sonnet-5-5", max_tokens: 900, system, messages: [{ role: "user", content: user }] }),
      });
      const data = (await res.json()) as { content?: { text?: string }[]; error?: { message?: string } };
      if (!res.ok) throw new Error(`Anthropic: ${data.error?.message ?? res.status}`);
      return data.content?.map((c) => c.text ?? "").join("") ?? "";
    }
  } catch {
    // faller tillbaka nedan
  }
  return askText(system, user);
}

/**
 * Kampanjtext (t.ex. Black Week) på marknadens språk. Samma kontroller som de svenska
 * annonserna plus en spärrlista som täcker marknadernas språk. Kastar aldrig: om AI:n inte
 * håller returneras null och anroparen använder sin översatta mall.
 */
export async function writeSaleCopy(o: SaleBrief): Promise<AdCopy | null> {
  if (!copyAiConfigured()) return null;
  const p = o.product;
  let brief = [
    `Product: ${p.name}`,
    `Short description (${o.language}): ${p.short}`,
    p.bullets.length ? `Verified product facts – the only product facts you may use:\n- ${p.bullets.join("\n- ")}` : "",
    `Verified sale facts and terms:\n- ${o.facts.join("\n- ")}`,
    o.angle === "price"
      ? "Angle: lead with the deal – the discount and the new price against the regular price – then one product fact, then the end date and a call to buy."
      : "Angle: lead with the botanical raw material and the extract strength, then reveal the sale price and end date as the reason to buy now.",
  ]
    .filter(Boolean)
    .join("\n");
  if (o.avoid) brief = `${brief}\n\nAn earlier text was rejected by the reviewer because: "${o.avoid}". Avoid that completely.`;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const raw = parse(await askSale(saleSystem(o.language), brief));
      if (!raw) {
        brief = `${brief}\n\nYour last answer was not valid JSON. Answer only with JSON.`;
        continue;
      }
      const copy = { primaryText: clean(raw.primaryText, LIMITS.primaryMax), headline: clean(raw.headline, LIMITS.headlineMax), description: clean(raw.description, LIMITS.descriptionMax) };
      let problem: string | null = null;
      if (copy.primaryText.length < LIMITS.primaryMin) problem = `the primary text is too short (${copy.primaryText.length} characters, at least ${LIMITS.primaryMin}).`;
      else if (!copy.headline) problem = "the headline is missing.";
      else if (emojiCount(copy.primaryText) < 1) problem = "the primary text has no emojis.";
      else if (emojiCount(copy.headline) > 1) problem = "the headline has more than one emoji.";
      else {
        const all = `${copy.primaryText}\n${copy.headline}\n${copy.description}`;
        const hit = bannedAnyLanguage.find(({ re }) => re.test(all));
        if (hit) problem = `the text contains a forbidden claim about ${hit.why} ("${all.match(hit.re)?.[0]}").`;
      }
      if (!problem) return { ...copy, description: copy.description || undefined, source: "ai" };
      o.notes?.push(`${p.slug} ${o.angle}: omskrivning – ${problem}`);
      brief = `${brief}\n\nYour last proposal was not approved: ${problem} Rewrite it without that, keep the selling tone and the emojis.`;
    } catch (e) {
      o.notes?.push(`${p.slug} ${o.angle}: AI-texten misslyckades (${e instanceof Error ? e.message : e}).`);
      return null;
    }
  }
  return null;
}
