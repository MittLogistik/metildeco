import "server-only";
import type { Concept, ConceptCopy, Format } from "@/content/ad-concepts";
import { copyLines, formatById } from "@/content/ad-concepts";
import { brand } from "./ad-prompt";
import type { Product } from "./products";

/**
 * Art director: en språkmodell som ser packshoten och skriver regin till bildmodellen,
 * på samma sätt som ChatGPT gör i chatten när man laddar upp en bild och ber om en annons.
 *
 * Den skriver bara scenen, kompositionen och typografin. Reglerna om produkten, vilken
 * text som får stå i bilden, formatet och hälsopåståenden sätter vi själva efteråt, så att
 * modellen inte kan tumma på dem.
 */

export type ArtDirection = { art: string; source: "ai" | "mall" };

export const artDirectorConfigured = () => process.env.AD_ART_DIRECTOR !== "false" && Boolean(process.env.OPENAI_API_KEY || process.env.ANTHROPIC_API_KEY);

const model = () => process.env.AD_ART_MODEL ?? "gpt-4o";

async function ask(prompt: string, imageUrl: string): Promise<string> {
  if (process.env.OPENAI_API_KEY) {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
      body: JSON.stringify({
        model: model(),
        temperature: 0.8,
        max_tokens: 900,
        messages: [{ role: "user", content: [{ type: "text", text: prompt }, { type: "image_url", image_url: { url: imageUrl } }] }],
      }),
    });
    const data = (await res.json()) as { choices?: { message?: { content?: string | null; refusal?: string | null } }[]; error?: { message?: string } };
    if (!res.ok) throw new Error(`OpenAI: ${data.error?.message ?? res.status}`);
    const msg = data.choices?.[0]?.message;
    if (!msg?.content && msg?.refusal) throw new Error(`OpenAI vägrade: ${msg.refusal.slice(0, 160)}`);
    return msg?.content ?? "";
  }
  if (process.env.ANTHROPIC_API_KEY) {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "content-type": "application/json", "x-api-key": process.env.ANTHROPIC_API_KEY, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({
        model: process.env.AD_ART_MODEL ?? "claude-sonnet-5",
        max_tokens: 900,
        messages: [{ role: "user", content: [{ type: "image", source: { type: "url", url: imageUrl } }, { type: "text", text: prompt }] }],
      }),
    });
    const data = (await res.json()) as { content?: { text?: string }[]; error?: { message?: string } };
    if (!res.ok) throw new Error(`Anthropic: ${data.error?.message ?? res.status}`);
    return data.content?.map((c) => c.text ?? "").join("") ?? "";
  }
  throw new Error("Ingen AI-nyckel för art direction.");
}

const brief = (o: { product: Product; concept: Concept; format: Format; copy: ConceptCopy; customInstructions?: string; variation?: string }) => {
  const f = formatById(o.format);
  return [
    `Du är art director för ${brand.name}, ett svenskt märke som säljer botaniska kosttillskott i kapselform. Bilden du ser är produktens riktiga packshot.`,
    `Din uppgift: skriv regin till en bildmodell (gpt-image-1) som ska rita en färdig annons för Meta. Skriv på engelska, i löpande stycken, 150–250 ord.`,
    ``,
    `Konceptet du ska tolka: ${o.concept.label} – ${o.concept.description}`,
    `Utgångspunkt, som du får tolka fritt så länge konceptet känns igen:`,
    o.concept.art({ product: o.product, format: o.format, copy: o.copy }),
    ``,
    `Format: ${o.format} (${f?.width}×${f?.height}).`,
    `Texten som kommer att stå i bilden (den är redan bestämd, ändra den inte, men placera den): ${copyLines(o.copy).map((t) => `"${t}"`).join(", ")}`,
    o.customInstructions?.trim() ? `Beställarens önskemål: ${o.customInstructions.trim()}` : "",
    o.variation ? `Den här gången: ${o.variation}` : "",
    ``,
    `Skriv om: miljön och ljuset, var burken står eller hålls och hur stor den är i bild, var varje textelement sitter, formen på badges och knappar, typsnittskänslan, färgerna, och djupet i bilden (skuggor, skärpedjup).`,
    `Titta noga på packshoten och beskriv burken som du ser den – glaset, locket, etikettens färg och form – så att bildmodellen återger rätt burk.`,
    `Var konkret och visuell. Skriv aldrig ut måttangivelser i pixlar. Lova ingenting om effekt på kropp eller sinne.`,
    `Placera aldrig rubrik, badge eller knapp mot bildens kant – allt ska ha luft omkring sig och rymmas i sin helhet. Skriv hellre "well inside the frame" än "at the very top".`,
    o.format === "9:16"
      ? `Det här är ett högt format. Komponera det som tre band ovanpå varandra: rubrik högt upp, produkten stor i mitten, stödtext och knapp under. Stapla aldrig alla badges i en hög spalt längs ena kanten, och tänj inte ut en kvadratisk idé. Nedersta femtedelen ska vara tom på text – appen lägger sina knappar där.`
      : "",``,
    `Svara med enbart regin, ingen inledning och inga rubriker som "Prompt:".`,
  ]
    .filter((l) => l !== undefined)
    .join("\n");
};

const clean = (text: string) =>
  text
    .replace(/^```[a-z]*\n?/i, "")
    .replace(/```$/i, "")
    .replace(/^(prompt|image prompt|regi)\s*:\s*/i, "")
    .trim();

/**
 * Skriver regin till en bild. Misslyckas den används konceptets egen beskrivning,
 * så att en bild alltid går att skapa.
 */
export async function directArt(o: {
  product: Product;
  concept: Concept;
  format: Format;
  copy: ConceptCopy;
  packshotUrl: string;
  customInstructions?: string;
  variation?: string;
  notes?: string[];
}): Promise<ArtDirection> {
  const fallback = (): ArtDirection => ({ art: o.concept.art({ product: o.product, format: o.format, copy: o.copy }), source: "mall" });
  if (!artDirectorConfigured()) return fallback();
  try {
    const art = clean(await ask(brief(o), o.packshotUrl));
    // För kort svar betyder att modellen inte förstod uppgiften
    if (art.length < 200) {
      o.notes?.push("Art direction blev för kort, konceptets egen beskrivning används.");
      return fallback();
    }
    return { art, source: "ai" };
  } catch (e) {
    o.notes?.push(`Art direction misslyckades (${e instanceof Error ? e.message : e}), konceptets egen beskrivning används.`);
    return fallback();
  }
}
