import type { Product } from "@/lib/products";

/**
 * Grafiska annonsstilar inspirerade av referenser (Bloom, AG1, Ryze) men med fakta i stället
 * för hälsopåståenden. Varje stil = Higgsfield-mallar som passar formen + ett svenskt manus
 * som är den enda text AI:n får skriva. Granskaren får manuset som tillåten text.
 */

export type AdStyle = {
  id: string;
  label: string;
  description: string;
  /** Higgsfield-mallnamn i prioritetsordning; första som finns i rätt format används. */
  presets: string[];
  /** Manus: rubrik + punkter, byggt från produktens verifierade fakta. */
  script: (p: Product) => { headline: string; sub?: string; bullets: string[]; extra?: string[] };
  /** Kompositionsanvisning till modellen. */
  layout: string;
};

const facts = (p: Product) => p.bullets.filter((b) => b.length <= 48).slice(0, 4);
const shortName = (p: Product) => p.name.replace(/ \|.*$/, "");

export const adStyles: AdStyle[] = [
  {
    id: "pilar",
    label: "Pilar runt produkten",
    description: "Produkten i mitten, tunna pilar till fyra fakta. Som Bloom/Athletic Greens, men med innehåll i stället för löften.",
    presets: ["Callout Fan", "Pill Callouts", "Annotated Tilt", "Ingredient Compass", "Capsule Ring"],
    script: (p) => ({ headline: shortName(p), bullets: [...facts(p).slice(0, 3), "Tillverkad i Sverige"] }),
    layout: "Exactly one product bottle, centered and large. Around it, four short fact labels connected to the bottle with thin hand-drawn arrows or lines. A headline at the top. Generous space, calm composition.",
  },
  {
    id: "spec",
    label: "Spec-lista",
    description: "Produkten till vänster, rubrik och bocklista till höger. Redaktionell, som AG1.",
    presets: ["Weightless Spec Grid", "Benefit Ladder", "Quiet Numbers", "Zigzag Split"],
    // Sex punkter fyller mallarnas rutnät utan upprepningar
    script: (p) => ({ headline: "Innehållet, rakt upp och ner.", bullets: [...facts(p), "Tredjepartstestad batch för batch", "Tillverkad i Sverige"].slice(0, 6), extra: [shortName(p)] }),
    layout: "Editorial split layout: the product bottle on the left third, and on the right a headline with a vertical checklist of facts, each with a small green check mark and thin divider lines. Off-white background, lots of air.",
  },
  {
    id: "jamfor",
    label: "Så jämför du",
    description: "Två kolumner: vad en etikett borde visa, mot vad Metilde visar. Aldrig gammalt/nytt jag.",
    presets: ["Comparison", "Old Way New Way", "Dueling Timers", "Orange Tape Diptych"],
    script: (p) => ({ headline: "Så jämför du extrakt", bullets: ["Extraktstyrka", "Dos per kapsel", "Analys per batch", "Tillverkningsland"], extra: [shortName(p), ...facts(p).slice(0, 3), "Sverige"] }),
    layout: "Two equal columns under a headline. Left column titled 'Fråga' lists what to look for on a label. Right column titled 'Metilde' shows the product's answers next to the product bottle. Clean grid, thin dividers, no people.",
  },
  {
    id: "notis",
    label: "Notis",
    description: "En telefonnotis över produktbilden: en påminnelse, inget löfte.",
    presets: ["Pickup Screen", "Search Bar Answer", "Slide to Answer", "Accept or Decline"],
    script: (p) => ({ headline: "Påminnelse", sub: "1 kapsel om dagen", bullets: [shortName(p), "Tillverkad i Sverige"] }),
    layout: "A phone notification card near the top of the image, with the reminder text, over a photo of the product on a calm surface. Nothing else written on the image.",
  },
];

export const styleById = (id: string) => adStyles.find((s) => s.id === id);

/** Manuset som text, för prompt och för granskarens lista över tillåten text. */
export const scriptLines = (s: ReturnType<AdStyle["script"]>): string[] => [s.headline, s.sub ?? "", ...s.bullets, ...(s.extra ?? [])].filter(Boolean);
