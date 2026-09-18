import "server-only";
import type { Product } from "./products";

/**
 * AI-granskning av annonsbilder och annonser innan de används.
 * Bild: jämförs med referenspackshoten (framsidan) – rätt burk, läsbar och oförändrad etikett,
 * ingen påhittad text, ingen baksida, inga extra burkar. Annons: inga hälsopåståenden, faktakoll
 * mot produktdatan, texten passar bilden.
 * Kräver ANTHROPIC_API_KEY (Claude) eller OPENAI_API_KEY. Poäng 0–100 + omdöme.
 */

export type Review = { score: number; verdict: "ok" | "review" | "reject"; issues: string[]; notes: string };

export const qaConfigured = () => Boolean(process.env.ANTHROPIC_API_KEY || process.env.OPENAI_API_KEY);
export const minImageScore = () => Number(process.env.AD_QA_MIN_IMAGE ?? 70);
export const minAdScore = () => Number(process.env.AD_QA_MIN_AD ?? 70);

async function askVision(prompt: string, imageUrls: string[]): Promise<string> {
  if (process.env.ANTHROPIC_API_KEY) {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "content-type": "application/json", "x-api-key": process.env.ANTHROPIC_API_KEY, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({
        model: process.env.AD_QA_MODEL ?? "claude-sonnet-5",
        max_tokens: 800,
        messages: [{ role: "user", content: [...imageUrls.map((url) => ({ type: "image", source: { type: "url", url } })), { type: "text", text: prompt }] }],
      }),
    });
    const data = (await res.json()) as { content?: { type: string; text?: string }[]; error?: { message?: string } };
    if (!res.ok) throw new Error(`Anthropic: ${data.error?.message ?? res.status}`);
    return data.content?.map((c) => c.text ?? "").join("") ?? "";
  }
  if (process.env.OPENAI_API_KEY) {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
      body: JSON.stringify({
        model: process.env.AD_QA_MODEL ?? "gpt-4o",
        max_tokens: 800,
        messages: [{ role: "user", content: [{ type: "text", text: prompt }, ...imageUrls.map((url) => ({ type: "image_url", image_url: { url } }))] }],
      }),
    });
    const data = (await res.json()) as { choices?: { message?: { content?: string } }[]; error?: { message?: string } };
    if (!res.ok) throw new Error(`OpenAI: ${data.error?.message ?? res.status}`);
    return data.choices?.[0]?.message?.content ?? "";
  }
  throw new Error("Ingen AI-nyckel (ANTHROPIC_API_KEY eller OPENAI_API_KEY) för granskning.");
}

function parseReview(text: string, min: number): Review {
  const m = text.match(/\{[\s\S]*\}/);
  if (!m) return { score: 0, verdict: "review", issues: ["Kunde inte tolka granskningssvaret."], notes: text.slice(0, 300) };
  try {
    const j = JSON.parse(m[0]) as Partial<Review>;
    const score = Math.max(0, Math.min(100, Math.round(Number(j.score ?? 0))));
    const issues = Array.isArray(j.issues) ? j.issues.map(String) : [];
    const verdict: Review["verdict"] = j.verdict === "reject" || score < min - 15 ? "reject" : score < min ? "review" : "ok";
    return { score, verdict, issues, notes: String(j.notes ?? "") };
  } catch {
    return { score: 0, verdict: "review", issues: ["Kunde inte tolka granskningssvaret."], notes: text.slice(0, 300) };
  }
}

const jsonFormat = `Svara ENDAST med JSON: {"score": 0-100, "verdict": "ok" | "review" | "reject", "issues": ["kort punkt på svenska", ...], "notes": "en mening på svenska"}.`;

/** Granskar en genererad annonsbild mot referenspackshoten (bild 1 = referens, bild 2 = kandidat). */
export async function reviewImage(o: { referenceUrl: string; imageUrl: string; product: Product }): Promise<Review> {
  const prompt = [
    `Du granskar en AI-genererad annonsbild för det svenska kosttillskottsmärket Metilde. Bild 1 är referensen: produktens framsida. Bild 2 är kandidaten.`,
    `Produkt: ${o.product.name}.`,
    `Underkänn (verdict "reject") om något av detta gäller: burken i bild 2 är inte samma som i bild 1; etiketten är ändrad, förvrängd, oläslig eller har annan text än referensen; baksidan eller sidan av burken visas i stället för framsidan; det finns fler än en burk; det finns påhittad text, siffror, badges, logotyper eller vattenstämplar i bilden; ansikten syns; bilden ser ut som medicin eller antyder hälsoeffekter.`,
    `Bedöm sedan kvaliteten: fotorealism, skärpa på produkten, att produkten är tydligt synlig och inte för liten, ljus, komposition för en annons, färgton som passar märket (djupgrön, sand, offwhite, naturligt ljus). Ge en helhetspoäng 0–100 där 100 är en perfekt annonsbild med exakt rätt produkt.`,
    jsonFormat,
  ].join("\n");
  return parseReview(await askVision(prompt, [o.referenceUrl, o.imageUrl]), minImageScore());
}

/** Granskar en färdig annons: text + bild tillsammans, regler och fakta. */
export async function reviewAd(o: { primaryText: string; headline: string; description?: string; imageUrl: string; product: Product }): Promise<Review> {
  const facts = [o.product.short, ...o.product.bullets].filter(Boolean).join(" · ");
  const prompt = [
    `Du granskar en Meta-annons (Facebook/Instagram) för det svenska kosttillskottsmärket Metilde innan den publiceras. Bilden är annonsens bild.`,
    `Produkt: ${o.product.name}. Verifierade produktfakta: ${facts}`,
    `Primärtext: """${o.primaryText}"""`,
    `Rubrik: """${o.headline}"""`,
    o.description ? `Beskrivning: """${o.description}"""` : "",
    `Underkänn (verdict "reject") om texten innehåller hälsopåståenden eller antyder effekt på kropp eller sinne (energi, testosteron, sömn, stress, fokus, libido, immunförsvar, prestation, återhämtning, viktnedgång, "naturlig boost" osv.), medicinska termer, före/efter, garantier, jämförelser med läkemedel, eller riktar sig till personliga egenskaper ("du som är över 40", "män med låg…"). Underkänn också om texten påstår fakta som inte finns i produktfakta (dos, styrka, innehåll, certifieringar), om språket inte är korrekt svenska, eller om bilden innehåller text som strider mot samma regler.`,
    `Bedöm sedan: tydlighet, trovärdighet, att text och bild hänger ihop, och att annonsen troligen presterar i flödet. Ge en helhetspoäng 0–100.`,
    jsonFormat,
  ]
    .filter(Boolean)
    .join("\n");
  return parseReview(await askVision(prompt, [o.imageUrl]), minAdScore());
}
