import "server-only";
import { type Concept, type ConceptCopy, copyLines, type Format, formatById } from "@/content/ad-concepts";
import type { Product } from "./products";

/**
 * Bygger prompten till bildmodellen i block, så att koncept, format och egna
 * instruktioner kan ändras var för sig. Modellen ritar hela annonsen, inklusive
 * typografin – därför räknar prompten upp exakt vilken text som får förekomma.
 */

/** Metildes visuella riktning. Ändras här, slår igenom i alla koncept. */
export const brand = {
  name: "Metilde",
  visualStyle: "premium, natural, modern, Scandinavian, clean, botanical",
  avoid: "nothing clinical or pharmaceutical, no gym-bro aesthetics, no neon, no stock-photo smiles",
  palette: "deep forest green, warm sand, off-white, muted olive",
  light: "soft natural daylight, gentle shadows, no harsh flash",
};

const brandBlock = () =>
  [
    `You are designing a finished, polished advertisement image for ${brand.name}, a Swedish brand of botanical supplements in capsule form.`,
    `You design the whole thing: scene, composition, badges, arrows and all typography, with light and shadow that belong to the same photograph.`,
    `Visual direction: ${brand.visualStyle}. Palette: ${brand.palette}. Light: ${brand.light}. Avoid: ${brand.avoid}.`,
  ].join(" ");

/**
 * Produkten är det enda som inte får tolkas. Etikettens finstilta är den svåraste biten:
 * kan modellen inte återge den exakt ska den hellre hamna i mjukt fokus än hittas på,
 * eftersom en påhittad dos är ett felaktigt påstående om varan.
 */
const productBlock = (product: Product) =>
  [
    "THE PRODUCT — the most important rule:",
    `Use the jar from the attached reference image exactly as it is: same glass, same metal cap, same label shape, same logo, same colours and the same printed text, letter for letter.`,
    `Never re-letter, restyle, translate or invent anything printed on the label. If you cannot reproduce the smallest print exactly, render that part softly out of focus rather than inventing characters or numbers.`,
    `There is exactly one jar in the image, large and in sharp focus. The product is ${product.name.replace(/ \|.*$/, "")}.`,
  ].join(" ");

const textBlock = (copy: ConceptCopy) => {
  const lines = copyLines(copy);
  return [
    "TEXT: every word in the image must come from this list, spelled exactly like this, in Swedish:",
    lines.map((l) => `- "${l}"`).join("\n"),
    "Do not add any other words, numbers, percentages, claims, badges, logos, watermarks, hashtags or signatures. Do not repeat a line twice. Text printed on the jar's own label does not count and must stay unchanged.",
  ].join("\n");
};

const formatBlock = (format: Format) => {
  const f = formatById(format);
  return format === "9:16"
    ? `FORMAT: vertical ${f?.width}x${f?.height} for Instagram and Facebook Stories. Use the whole height. Keep text and buttons out of the top 15 percent and the bottom 20 percent, where the app interface sits.`
    : `FORMAT: square ${f?.width}x${f?.height} for the Instagram and Facebook feed. Keep the important parts near the centre with an even margin.`;
};

const complianceBlock = () =>
  [
    "RULES: this is a food supplement, so the image must not suggest any effect on the body or mind.",
    "No words about energy, testosterone, hormones, libido, sleep, stress, focus, immunity, performance, recovery, muscles or weight.",
    "No medical or pharmaceutical look, no before and after, no doctors, no lab coats, no pills spilling out like medication, no faces.",
  ].join(" ");

export type PromptInput = {
  product: Product;
  concept: Concept;
  format: Format;
  copy: ConceptCopy;
  /** Fritext från användaren, t.ex. "mörkare bakgrund" eller "mer minimalistisk". */
  customInstructions?: string;
  /** Extra variation vid omgenerering. */
  variation?: string;
};

/** Sätter ihop prompten: varumärke, produkt, koncept, text, format, önskemål, regler. */
export function buildCreativePrompt({ product, concept, format, copy, customInstructions, variation }: PromptInput): string {
  return [
    brandBlock(),
    productBlock(product),
    concept.art({ product, format, copy }),
    textBlock(copy),
    formatBlock(format),
    variation ? `VARIATION: ${variation}` : "",
    customInstructions?.trim() ? `EXTRA DIRECTION from the art director: ${customInstructions.trim()}` : "",
    complianceBlock(),
  ]
    .filter(Boolean)
    .join("\n\n");
}

/** Slumpad variation så att en omgenerering ger en ny tolkning, inte samma bild igen. */
const variations = [
  "shift the camera lower and closer to the jar",
  "use softer, more diffused light and a lighter background",
  "use warmer late-afternoon light with longer shadows",
  "make the composition more asymmetric, with the jar slightly off centre",
  "use a deeper, moodier background with more contrast",
  "pull the camera back for a wider, airier framing",
];
export const randomVariation = () => variations[Math.floor(Math.random() * variations.length)]!;
