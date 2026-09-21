import "server-only";
import { type Concept, type Format, formatById } from "@/content/ad-concepts";
import type { Product } from "./products";

/**
 * Bygger prompten till bildmodellen i block, så att koncept, format och egna
 * instruktioner kan ändras var för sig. Prompten beskriver bara miljön: produkten
 * och all text läggs på i efterhand, därför är "no products, no text" alltid med.
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
    `Background plate for an advertisement by ${brand.name}, a Swedish brand of botanical supplements in capsule form.`,
    `Visual direction: ${brand.visualStyle}. Palette: ${brand.palette}. Light: ${brand.light}.`,
    `Avoid: ${brand.avoid}.`,
  ].join(" ");

/** Fakta ger modellen sammanhang för miljön – aldrig text att skriva ut. */
const productBlock = (product: Product) =>
  `Context only, never write any of this in the image: the product is ${product.name.replace(/ \|.*$/, "")}, a botanical supplement in a small glass jar with a metal cap.`;

const compositionBlock = (format: Format) => {
  const f = formatById(format);
  return format === "9:16"
    ? `Composition: vertical ${f?.width}x${f?.height} for Instagram and Facebook Stories. Use the full height naturally. Keep the top 15 percent and the bottom 20 percent calm and free of detail, since the app interface covers them. The empty product area belongs in the middle of the frame.`
    : `Composition: square ${f?.width}x${f?.height} for the Instagram and Facebook feed. Keep the important area near the centre and leave an even margin around it.`;
};

/** Sista ordet: ingen text och ingen produkt får finnas i den genererade bilden. */
const cleanBlock = () =>
  "Absolute requirements: the image must contain no text, no letters, no numbers, no logos, no watermarks, no labels, no signage, and no product packaging of any kind. It is only an empty environment. Do not add any bottle, jar, box, tube or capsule.";

export type PromptInput = {
  product: Product;
  concept: Concept;
  format: Format;
  /** Fritext från användaren, t.ex. "mörkare bakgrund" eller "mer minimalistisk". */
  customInstructions?: string;
  /** Extra variation vid omgenerering. */
  variation?: string;
};

/** Sätter ihop prompten: varumärke, produktsammanhang, koncept, format, egna önskemål, rensning. */
export function buildCreativePrompt({ product, concept, format, customInstructions, variation }: PromptInput): string {
  return [
    brandBlock(),
    productBlock(product),
    concept.scene({ product, format }),
    compositionBlock(format),
    variation ? `Variation: ${variation}` : "",
    customInstructions?.trim() ? `Extra direction from the art director: ${customInstructions.trim()}` : "",
    cleanBlock(),
  ]
    .filter(Boolean)
    .join("\n");
}

/** Slumpad variation så att en omgenerering ger en ny tolkning, inte samma bild igen. */
const variations = [
  "shift the camera slightly lower and closer",
  "use a softer, more diffused light and a lighter background",
  "use a warmer late-afternoon light with longer shadows",
  "make the composition more asymmetric, with the empty area slightly off centre",
  "use a deeper, moodier background with more contrast",
  "pull the camera back for a wider, airier framing",
];
export const randomVariation = () => variations[Math.floor(Math.random() * variations.length)]!;
