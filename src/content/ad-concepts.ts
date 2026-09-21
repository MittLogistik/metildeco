import type { Product } from "@/lib/products";

/**
 * Creative Studio: fem annonskoncept som skiljer sig i komposition, miljö och typografi.
 *
 * Bildmodellen ritar hela annonsen i en enda genomkörning – miljö, produkt, badges, pilar
 * och all typografi. Att lägga text ovanpå i efterhand gav platta bilder; modellen bygger
 * in typografin i scenen med rätt ljus, djup och skuggor.
 *
 * Vi styr den hårt på två punkter: produkten ska vara identisk med den bifogade packshoten,
 * och den enda text som får stå i bilden är den vi räknar upp, hämtad ur verifierade fakta.
 */

export type Format = "1:1" | "9:16";
export const formats: { id: Format; label: string; width: number; height: number }[] = [
  { id: "1:1", label: "Flöde 1:1", width: 1080, height: 1080 },
  { id: "9:16", label: "Story 9:16", width: 1080, height: 1920 },
];
export const formatById = (id: string) => formats.find((f) => f.id === id);

export type ConceptCopy = {
  eyebrow?: string;
  headline: string;
  subline?: string;
  /** Punkter ur verifierade fakta. */
  facts: string[];
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
  /** Miljö, komposition och typografi. Modellen ritar allt detta själv. */
  art: (o: { product: Product; format: Format; copy: ConceptCopy }) => string;
  copy: (o: { product: Product; review?: string }) => ConceptCopy;
  wantsReview?: boolean;
};

const shortName = (p: Product) => p.name.replace(/ \|.*$/, "");
const facts = (p: Product, n = 4) => p.bullets.filter((b) => b.length <= 46).slice(0, n);
const madeIn = "Tillverkad i Sverige";
const q = (s: string) => `"${s}"`;
const list = (items: string[]) => items.map(q).join(", ");

export const concepts: Concept[] = [
  {
    id: "notification",
    label: "Notis",
    description: "Telefonnotiser över en lugn produktbild. Lekfull och scroll-stoppande, utan löften.",
    preview: "Notiskort högst upp, produkten nedanför",
    copy: ({ product }) => ({
      eyebrow: "Påminnelse",
      headline: shortName(product),
      subline: "1 kapsel om dagen",
      facts: facts(product, 2),
      cta: "Handla på metilde.com",
    }),
    art: ({ format, copy }) =>
      [
        "SCENE: a calm morning at home. The jar stands on a light oak bedside table or windowsill in soft daylight, with a linen bedspread or curtain softly blurred behind it. Warm, quiet and premium.",
        "LAYOUT: near the top of the image, two realistic phone notification cards float over the scene like an iOS lock screen: rounded translucent dark cards, each with a small rounded app icon, a sender name and one line of text. The jar sits below them, large and in sharp focus.",
        `NOTIFICATION CARDS: the first card shows the sender ${q("Metilde")} and the line ${q(copy.headline)}. The second card shows the sender ${q(copy.eyebrow ?? "Påminnelse")} and the line ${q(copy.subline ?? "")}.`,
        copy.facts.length ? `Two small rounded badges sit near the bottom and read ${list(copy.facts)}.` : "",
        copy.cta ? `A wide rounded dark green button at the very bottom reads ${q(copy.cta)}.` : "",
        "TYPOGRAPHY: clean modern sans, the kind a phone uses for notifications. Nothing shouty.",
        format === "9:16"
          ? "Use the tall frame: notifications in the upper third, jar in the middle, button low but well inside the frame."
          : "Square composition: notifications at the top, jar centred, button at the bottom.",
      ]
        .filter(Boolean)
        .join("\n"),
  },
  {
    id: "simple-routine",
    label: "Enkel rutin",
    description: "Burken i handen utomhus, faktaetiketter med handritade pilar. Ljus, lekfull och social-media-native.",
    preview: "Stor rubrik, badges med pilar mot burken",
    copy: ({ product }) => ({
      headline: "1 kapsel. Enkelt.",
      subline: shortName(product),
      facts: [...facts(product, 3), madeIn],
      cta: "Upptäck mer",
    }),
    art: ({ copy }) =>
      [
        "SCENE: a hand holds the jar up outdoors in bright Scandinavian daylight, soft blue sky with light clouds and green foliage blurred behind. Fresh, airy and optimistic. A natural hand, no face visible.",
        `LAYOUT: a big bold headline across the top on a painted off-white brush banner reading ${q(copy.headline.toUpperCase())}, with a small letter-spaced subtitle under it reading ${q((copy.subline ?? "").toUpperCase())}.`,
        `Around the jar sit ${copy.facts.length} soft rounded pale badges, two on the left and two on the right, each with a thin hand-drawn arrow curving towards the jar. The badges read ${list(copy.facts)}.`,
        copy.cta ? `A wide rounded green call-to-action button near the bottom reads ${q(copy.cta.toUpperCase())} with a small arrow.` : "",
        "TYPOGRAPHY: bold condensed sans for the headline in deep forest green, friendly rounded sans in the badges. Playful but premium.",
      ]
        .filter(Boolean)
        .join("\n"),
  },
  {
    id: "product-facts",
    label: "Produktfakta",
    description: "Minimalistisk premiumannons: stor produkt och en bockad lista med verifierade fakta.",
    preview: "Ren bakgrund, checklista bredvid produkten",
    copy: ({ product }) => ({
      headline: `Varför ${shortName(product)}?`,
      facts: [...facts(product, 4), madeIn],
      cta: "metilde.com",
    }),
    art: ({ format, copy }) =>
      [
        "SCENE: a minimal studio. The jar stands on a pale stone plinth against a seamless off-white to warm sand backdrop, studio light from the upper left, one soft shadow. Extremely clean and expensive looking.",
        format === "9:16"
          ? `LAYOUT: a headline at the top reading ${q(copy.headline)}, the jar large in the middle, and a vertical checklist below it.`
          : `LAYOUT: the jar on the left third, and on the right a headline reading ${q(copy.headline)} with a vertical checklist under it.`,
        `The checklist has ${copy.facts.length} rows, each with a small dark green circle containing a white check mark, reading ${list(copy.facts)}.`,
        copy.cta ? `A small rounded dark green tag in a corner reads ${q(copy.cta)}.` : "",
        "TYPOGRAPHY: large editorial sans in deep forest green, generous spacing, thin hairline dividers between the rows. Restrained and premium, like an apothecary brand.",
      ]
        .filter(Boolean)
        .join("\n"),
  },
  {
    id: "comparison",
    label: "Jämförelse",
    description: "Delad bild: rörig rutin mot enkel rutin. Jämför upplevelse och innehåll, aldrig effekt.",
    preview: "Två halvor med rubrik över varje",
    copy: ({ product }) => ({
      headline: "Krånglig rutin",
      subline: "Enkel rutin",
      compareLeft: "Krånglig rutin",
      compareRight: "Enkel rutin",
      facts: [...facts(product, 3), madeIn],
      cta: "metilde.com",
    }),
    art: ({ format, copy }) =>
      (format === "9:16"
        ? [
            // I ett högt format delas bilden på höjden: en stapel, inte två spalter
            "SCENE: the image is split into two horizontal bands by a thin line across the middle.",
            "UPPER BAND: a cluttered bathroom shelf in cool grey light with tangled cables, scattered loose pill organisers and crumpled paper. Messy and joyless, but with no readable packaging and no other brands. It fills roughly the top third.",
            "LOWER BAND: a calm, tidy light oak surface in warm daylight that fills the rest of the frame. The jar stands here alone, large and in sharp focus, entirely inside this band and never touching the dividing line.",
            `LAYOUT: a rounded pale tag sits in the upper band and reads ${q(copy.compareLeft ?? "")}. A rounded dark green tag sits just below the dividing line and reads ${q(copy.compareRight ?? "")}.`,
            `${Math.min(copy.facts.length, 3)} small rounded badges are placed around the jar in the lower band, some to its left and some to its right, never in a single tall column. They read ${list(copy.facts.slice(0, 3))}.`,
            copy.cta ? `A small rounded tag at the bottom centre reads ${q(copy.cta)}.` : "",
          ]
        : [
            "SCENE: the image is split into two halves by a thin vertical line.",
            "LEFT HALF: a cluttered bathroom shelf in cool grey light with tangled cables, scattered loose pill organisers and crumpled paper. Messy and joyless, but with no readable packaging and no other brands.",
            "RIGHT HALF: a calm, tidy light oak surface in warm daylight where the jar stands alone, large and in sharp focus, entirely inside the right half and never crossing the dividing line.",
            `LAYOUT: a rounded pale tag at the top of the left half reads ${q(copy.compareLeft ?? "")}, and a rounded dark green tag at the top of the right half reads ${q(copy.compareRight ?? "")}.`,
            `On the right half, ${copy.facts.length} small rounded badges are placed beside the jar and read ${list(copy.facts)}.`,
            copy.cta ? `A small rounded tag at the bottom centre reads ${q(copy.cta)}.` : "",
          ]
      )
        .concat("TYPOGRAPHY: confident sans with a clear hierarchy. The messy side is cooler and duller, the Metilde side warm and clean, so the contrast is felt before it is read.")
        .filter(Boolean)
        .join("\n"),
  },
  {
    id: "social-proof",
    label: "Omdöme",
    description: "Premiumbild med ett omdömeskort. Kortet visas bara med en äkta recension – annars bara fakta.",
    preview: "Lifestylebild med citatkort nederst",
    wantsReview: true,
    copy: ({ product, review }) => ({
      eyebrow: review ? shortName(product) : undefined,
      headline: review ? "" : shortName(product),
      facts: facts(product, 3),
      quote: review,
      cta: "metilde.com",
    }),
    art: ({ copy }) =>
      [
        "SCENE: a warm window sill in late afternoon light with soft linen curtains and a ceramic cup. The jar stands in the light, large and in sharp focus. Inviting and premium.",
        copy.quote
          ? `LAYOUT: a clean off-white review card floats over the lower part of the image, with a row of five small gold stars at the top and the quote under them reading ${q(copy.quote)}${copy.quoteBy ? `, signed ${q(copy.quoteBy)}` : ""}.`
          : `LAYOUT: a clean off-white card floats over the lower part of the image with a headline reading ${q(copy.headline)}. Do not draw any stars, ratings, review counts or quotation marks anywhere.`,
        `Under the card, ${copy.facts.length} small rounded badges read ${list(copy.facts)}.`,
        copy.eyebrow ? `A small dark green pill at the top of the image reads ${q(copy.eyebrow)}.` : "",
        copy.cta ? `A small rounded tag at the bottom reads ${q(copy.cta)}.` : "",
        "TYPOGRAPHY: warm editorial sans, the card set large and confident.",
      ]
        .filter(Boolean)
        .join("\n"),
  },
];

export const conceptById = (id: string) => concepts.find((c) => c.id === id);

/** All text som ska stå i bilden – både till prompten och till granskarens lista över tillåten text. */
export const copyLines = (c: ConceptCopy): string[] =>
  [c.eyebrow, c.headline, c.subline, c.compareLeft, c.compareRight, ...c.facts, c.quote, c.quoteBy, c.cta].filter((s): s is string => Boolean(s));

/** Internt namn: fadogia-agrestis-notification-1x1 */
export const creativeName = (slug: string, conceptId: string, format: Format) => `${slug}-${conceptId}-${format.replace(":", "x")}`;
