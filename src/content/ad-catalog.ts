import type { Product } from "@/lib/products";

/**
 * Katalogannonser: en karusell där bakgrunden löper sammanhängande över korten.
 * Två tydligt olika varianter så att de kan ställas mot varandra i samma annonsgrupp –
 * de skiljer sig i både bild och text, inte bara i rubrik.
 */

export type CatalogVariant = {
  id: string;
  label: string;
  description: string;
  /** Miljön som löper över alla kort. Ska vara tom på produkter och text. */
  background: (o: { cards: number }) => string;
  /** Hur stor burken är och var den står i sitt kort. */
  placement: { baseY: number; height: number };
  /** Raden som skrivs på varje kort. Kort, annars blir karusellen plottrig. */
  cardLine: (p: Product) => string;
  /** Vinkeln som AI:n skriver primärtexten utifrån. */
  copyAngle: string;
  /** Rubriken under varje kort i Meta. */
  cardHeadline: (p: Product) => string;
  theme: "light" | "dark";
};

const shortName = (p: Product) => p.name.replace(/ \|.*$/, "");
const firstFact = (p: Product) => p.bullets.filter((b) => b.length <= 40)[0] ?? p.short.slice(0, 40);

export const catalogVariants: CatalogVariant[] = [
  {
    id: "studio",
    label: "A · Ljus studio",
    description: "Ljus sandfärgad hylla som löper genom alla kort. Ren, dyr och lugn. En kort faktarad per kort.",
    theme: "light",
    background: ({ cards }) =>
      [
        "Wide seamless background banner for a premium Scandinavian supplement advertisement, composed as one continuous panorama.",
        `A long pale sand-coloured stone shelf runs horizontally across the entire width at about 78 percent of the height, with a smooth off-white plaster wall behind it.`,
        `Soft studio daylight from the upper left, gentle even shadows. A few dry botanical stems and a folded linen cloth are placed sparsely along the shelf, well spread out across the full width so that no part of the banner is empty and none of them sits in the middle of any of the ${cards} equal vertical sections.`,
        "IMPORTANT: the shelf must be clear and unobstructed in the middle of each section, because products will be placed there later.",
        "No products, no bottles, no jars, no packaging, no text, no letters, no numbers, no people. Photorealistic, premium, editorial, extremely clean.",
      ].join(" "),
    placement: { baseY: 0.79, height: 0.52 },
    cardLine: (p) => firstFact(p),
    cardHeadline: (p) => shortName(p),
    copyAngle:
      "Presentera sortimentet som en samling att välja ur. Lyft att varje burk har extraktstyrka och dos öppet redovisad, att de tillverkas i Sverige och analyseras batch för batch. Uppmana att svepa och välja sin.",
  },
  {
    id: "natur",
    label: "B · Mörk natur",
    description: "Mossa och sten i skymningsljus, djupgrön ton. Varmare och mer känsla. Produktnamnet på kortet.",
    theme: "dark",
    background: ({ cards }) =>
      [
        "Wide seamless background banner for a premium Scandinavian botanical supplement advertisement, composed as one continuous panorama.",
        `A dark Swedish forest floor of deep green moss, lichen and smooth grey stone stretches across the entire width, seen from a low angle in soft misty light at dusk.`,
        `Scattered pine needles and a few small stones are spread evenly along the full width, well distributed so that none of the ${cards} equal vertical sections is empty and none of them blocks the middle of a section.`,
        "IMPORTANT: leave a clear, level patch of moss in the middle of each section, because products will be placed there later.",
        "No products, no bottles, no jars, no packaging, no text, no letters, no numbers, no people. Photorealistic, moody, deep forest green and muted sand, cinematic and calm.",
      ].join(" "),
    placement: { baseY: 0.76, height: 0.56 },
    cardLine: (p) => shortName(p),
    cardHeadline: (p) => shortName(p),
    copyAngle:
      "Berätta om botaniken bakom sortimentet: växten, roten, extraktet. Håll en lugn och naturnära ton. Avsluta med en tydlig uppmaning att se hela sortimentet.",
  },
];

export const catalogVariantById = (id: string) => catalogVariants.find((v) => v.id === id);

/** Kortets beskrivning under rubriken i Meta: en verifierad faktamening. */
export const cardDescription = (p: Product) => firstFact(p);
