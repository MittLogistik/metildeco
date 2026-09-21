import type { Product } from "@/lib/products";

/**
 * Creative Studio: fem annonskoncept som skiljer sig i komposition, miljö och typografi.
 *
 * Varje koncept byggs i tre lager:
 *  1. miljön genereras (utan produkt, med en tom yta där burken ska stå),
 *  2. produktens riktiga packshot läggs in – etiketten blir därmed alltid korrekt,
 *  3. texten ritas av oss ur produktens verifierade fakta, aldrig av bildmodellen.
 *
 * Därför innehåller scenbeskrivningarna alltid "no text, no products".
 */

export type Format = "1:1" | "9:16";
export const formats: { id: Format; label: string; width: number; height: number }[] = [
  { id: "1:1", label: "Flöde 1:1", width: 1080, height: 1080 },
  { id: "9:16", label: "Story 9:16", width: 1080, height: 1920 },
];
export const formatById = (id: string) => formats.find((f) => f.id === id);

/** Var packshoten hamnar: x = mitten i andel av bredden, baseY = burkens fot, height = andel av höjden. */
export type Placement = { x: number; baseY: number; height: number };

export type ConceptCopy = {
  /** Liten etikett över rubriken. */
  eyebrow?: string;
  headline: string;
  subline?: string;
  /** Punkter ur verifierade fakta. */
  facts: string[];
  /** Vänsterkolumnens rubrik i jämförelsen. */
  compareLeft?: string;
  compareRight?: string;
  cta?: string;
  /** Äkta recension, eller inget. Hittas aldrig på. */
  quote?: string;
  quoteBy?: string;
};

export type Concept = {
  id: string;
  label: string;
  description: string;
  /** Kort beskrivning av kompositionen, visas i valkortet. */
  preview: string;
  scene: (o: { product: Product; format: Format }) => string;
  placement: Record<Format, Placement>;
  copy: (o: { product: Product; review?: string }) => ConceptCopy;
  /** Behöver konceptet en äkta recension för att bli bra? */
  wantsReview?: boolean;
};

const shortName = (p: Product) => p.name.replace(/ \|.*$/, "");
/** Verifierade fakta: produktens egna punkter, korta nog att läsas i ett flöde. */
const facts = (p: Product, n = 4) => p.bullets.filter((b) => b.length <= 46).slice(0, n);
const madeIn = "Tillverkad i Sverige";

export const concepts: Concept[] = [
  {
    id: "notification",
    label: "Notis",
    description: "En telefonnotis över en lugn produktbild. Lekfull och scroll-stoppande, utan löften.",
    preview: "Notiskort högst upp, produkten nedanför",
    scene: ({ format }) =>
      [
        "Calm lifestyle background plate for a premium Scandinavian supplement advertisement.",
        format === "9:16"
          ? "A pale linen bedspread and a light oak bedside table, soft morning light from a window on the left. The table surface runs horizontally across the image at about 72 percent of the height."
          : "A light oak table by a window with soft morning light, a folded linen cloth and a glass of water to the right. The table surface runs horizontally at about 74 percent of the height.",
        "IMPORTANT: leave the middle of the surface completely empty and unobstructed, and keep the upper third calm and uncluttered.",
        "No products, no bottles, no jars, no packaging, no phones, no screens, no text, no letters, no numbers, no people.",
        "Photorealistic, premium, editorial, muted sand and off-white palette, gentle natural shadows.",
      ].join(" "),
    placement: { "1:1": { x: 0.5, baseY: 0.79, height: 0.44 }, "9:16": { x: 0.5, baseY: 0.62, height: 0.26 } },
    copy: ({ product }) => ({
      eyebrow: "Påminnelse",
      headline: shortName(product),
      subline: "1 kapsel om dagen",
      facts: facts(product, 2),
      cta: "Handla på metilde.com",
    }),
  },
  {
    id: "simple-routine",
    label: "Enkel rutin",
    description: "Produkten i handen med korta faktaetiketter runt om. Social-media-native, ljus och lekfull.",
    preview: "Stor rubrik, fakta i chips runt produkten",
    scene: ({ format }) =>
      [
        "Bright lifestyle background plate for a Scandinavian supplement advertisement.",
        format === "9:16"
          ? "A sunlit kitchen counter in light oak seen from the front, a linen towel and a glass of water far to the right, soft daylight. The counter surface runs across the image at about 76 percent of the height."
          : "A sunlit kitchen counter in light oak, a linen towel far to the right, soft daylight from the left. The counter surface runs across the image at about 78 percent of the height.",
        "IMPORTANT: the centre of the counter must be completely empty, and the left and right sides at mid height must be calm and plain so labels can be placed there.",
        "No products, no bottles, no jars, no packaging, no hands, no text, no letters, no numbers, no people.",
        "Photorealistic, airy, warm and modern, sand and off-white palette.",
      ].join(" "),
    placement: { "1:1": { x: 0.5, baseY: 0.82, height: 0.46 }, "9:16": { x: 0.5, baseY: 0.6, height: 0.26 } },
    copy: ({ product }) => ({
      headline: "1 kapsel. Enkelt.",
      subline: shortName(product),
      facts: [...facts(product, 3), madeIn],
      cta: "Handla på metilde.com",
    }),
  },
  {
    id: "product-facts",
    label: "Produktfakta",
    description: "Minimalistisk premiumannons: stor produkt och en bockad lista med verifierade fakta.",
    preview: "Ren bakgrund, checklista bredvid produkten",
    scene: () =>
      [
        "Minimal studio background plate for a premium supplement advertisement.",
        "A seamless off-white to warm sand gradient backdrop with a soft pale stone plinth in the lower area, studio light from the upper left, one gentle shadow to the right.",
        "IMPORTANT: the plinth top runs across the image at about 80 percent of the height and must be completely empty. Keep the whole background plain and free of props.",
        "No products, no bottles, no jars, no packaging, no plants, no text, no letters, no numbers, no people.",
        "Photorealistic, premium, editorial, extremely clean and minimal.",
      ].join(" "),
    placement: { "1:1": { x: 0.28, baseY: 0.85, height: 0.56 }, "9:16": { x: 0.5, baseY: 0.55, height: 0.26 } },
    copy: ({ product }) => ({
      headline: `Varför ${shortName(product)}?`,
      facts: [...facts(product, 4), madeIn],
      cta: "metilde.com",
    }),
  },
  {
    id: "comparison",
    label: "Jämförelse",
    description: "Delad bild: rörig rutin mot enkel rutin. Jämför upplevelse och innehåll, aldrig effekt.",
    preview: "Två halvor med rubrik över varje",
    scene: ({ format }) =>
      [
        "Split background plate for a supplement advertisement, divided into two equal halves by a thin vertical line" +
          (format === "9:16" ? " (the split runs top to bottom through the middle)." : "."),
        "Left half: a cluttered, messy bathroom shelf in cool grey light with tangled cables, scattered loose pill organisers, crumpled paper and clutter, but no readable packaging and no branded products.",
        "Right half: a calm, empty light oak surface in warm daylight, completely tidy, with a small folded linen cloth in the corner.",
        "IMPORTANT: the centre of the right half must be completely empty so a product can be placed there. Keep the top fifth of both halves calm.",
        "No text, no letters, no numbers, no logos, no branded packaging, no people.",
        "Photorealistic, editorial, the left half slightly cooler and busier, the right half warm and minimal.",
      ].join(" "),
    placement: { "1:1": { x: 0.75, baseY: 0.86, height: 0.42 }, "9:16": { x: 0.72, baseY: 0.58, height: 0.24 } },
    copy: ({ product }) => ({
      headline: "Krånglig rutin",
      subline: "Enkel rutin",
      compareLeft: "Krånglig rutin",
      compareRight: "Enkel rutin",
      facts: [...facts(product, 3), madeIn],
      cta: "metilde.com",
    }),
  },
  {
    id: "social-proof",
    label: "Omdöme",
    description: "Premiumbild med ett omdömeskort. Kortet visas bara med en äkta recension – annars bara fakta.",
    preview: "Lifestylebild med citatkort nederst",
    wantsReview: true,
    scene: ({ format }) =>
      [
        "Warm lifestyle background plate for a premium Scandinavian supplement advertisement.",
        format === "9:16"
          ? "A quiet window sill in warm late afternoon light with soft linen curtains, a ceramic cup far to the left. The sill runs across the image at about 58 percent of the height."
          : "A quiet window sill in warm late afternoon light with soft linen curtains and a ceramic cup far to the left. The sill runs across the image at about 62 percent of the height.",
        "IMPORTANT: the middle of the sill must be completely empty, and the lower third of the image must be calm and plain so a card can be placed there.",
        "No products, no bottles, no jars, no packaging, no text, no letters, no numbers, no people.",
        "Photorealistic, premium, warm and inviting, sand and deep green palette.",
      ].join(" "),
    placement: { "1:1": { x: 0.5, baseY: 0.63, height: 0.42 }, "9:16": { x: 0.5, baseY: 0.52, height: 0.24 } },
    copy: ({ product, review }) => ({
      // Utan recension är produktnamnet rubrik; då behövs ingen etikett som säger samma sak
      eyebrow: review ? shortName(product) : undefined,
      headline: review ? "" : shortName(product),
      facts: facts(product, 3),
      quote: review,
      cta: "metilde.com",
    }),
  },
];

export const conceptById = (id: string) => concepts.find((c) => c.id === id);

/** All text som kommer att stå i bilden – granskaren får listan som tillåten text. */
export const copyLines = (c: ConceptCopy): string[] =>
  [c.eyebrow, c.headline, c.subline, c.compareLeft, c.compareRight, ...c.facts, c.quote, c.quoteBy, c.cta].filter((s): s is string => Boolean(s));

/** Internt namn: fadogia-agrestis-notification-1x1 */
export const creativeName = (slug: string, conceptId: string, format: Format) => `${slug}-${conceptId}-${format.replace(":", "x")}`;
