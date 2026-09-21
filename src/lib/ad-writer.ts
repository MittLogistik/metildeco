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
- Tillverkning i Sverige och att varje batch analyseras av oberoende labb.
- Rutinen: en kapsel om dagen.
- Villkoren: pris, fri frakt, ångerrätt på oöppnade produkter, prenumeration med rabatt, pausa när du vill.
- Nyfikenhet och hantverk: att det här är för den som läser innehållsförteckningen.

Svara bara med JSON: {"primaryText": "...", "headline": "...", "description": "..."}
primaryText: 90–600 tecken, gärna radbrytningar. headline: högst 40 tecken. description: högst 40 tecken.`;

const productBrief = (product: Product, hook: string, angle: AdAngle) =>
  [
    `Produkt: ${product.name}`,
    `Pris: ${product.price} kr för ${[product.variant?.size, product.variant?.format].filter(Boolean).join(" ") || "en burk"}`,
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
  extrakt: "Råvaran och extraktstyrkan. Visa hur koncentrerat det är och att varje batch testas av oberoende labb.",
  jamfor: "Utmana läsaren att jämföra innehållsförteckningar. Vi redovisar styrka och dos öppet, många gör det inte.",
  rutin: "Enkelheten. En kapsel om dagen, vegansk, inga tillsatser. Passa in i vardagen utan krångel.",
  prenumeration: "Erbjudandet. Prenumerera och spara, välj intervall, pausa eller avsluta när du vill.",
  svenskt: "Svensk tillverkning och trygga villkor: skickas samma dag, fri frakt, öppet köp.",
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
 * Primärtext till en katalogannons (karusell). Samma regler som vanliga annonser:
 * säljande ton med emojis, men bara påståenden som går att styrka. Faller tillbaka på
 * en neutral text som byggs av produkternas egna fakta.
 */
export async function writeCatalogText(o: { products: Product[]; angle: string; notes?: string[] }): Promise<AdCopy> {
  const list = o.products
    .map((p) => `- ${p.name.replace(/ \|.*$/, "")}: ${p.bullets.filter((b) => b.length <= 46).slice(0, 2).join("; ") || p.short}`)
    .join("\n");
  const fallback = (): AdCopy => ({
    primaryText: `${o.products.length} botaniska extrakt från Metilde 🌿\n\n${o.products.map((p) => `• ${p.name.replace(/ \|.*$/, "")}`).join("\n")}\n\nExtraktstyrka och dos står på varje burk. Tillverkade i Sverige, analyserade batch för batch. 📦 Fri frakt över ${site.freeShippingOver} kr.\n\nSvep och välj din.`,
    headline: "Hela sortimentet",
    description: "Tillverkat i Sverige",
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
