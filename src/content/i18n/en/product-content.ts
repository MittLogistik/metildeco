import type { ProductContent } from "@/content/product-content";

/**
 * Product page content in English for Ireland (en-IE). Translated from src/content/product-content.ts.
 * No health claims – only botany, origin, extraction, format and dosage.
 */

const packaging = {
  heading: "Packaging and delivery",
  body:
    "The capsules are packed in a plastic jar with a screw lid that keeps the contents dry between doses. Every order ships from our warehouse in Sweden.",
};

const noExceed = "Do not exceed the recommended daily dose.";
const keepAway = "Keep out of reach of young children.";
const storeRoomTemp = "Store in a dry place at room temperature. Close the jar tightly after each use.";
const storeCool = "Store in a cool, dry place. Close the jar tightly after each use.";
const cleanNoSweeteners =
  "Vegan, gluten-free and GMO-free – no binders, fillers, sweeteners or artificial preservatives.";
const veganFaq = {
  q: "Is the capsule vegan?",
  a: "Yes. The capsule shell is plant-based and the product is gluten-free and GMO-free.",
};
const oneDaily = "1 capsule daily with a glass of water.";
const lasts60 = { q: "How long does a jar last?", a: "60 capsules at 1 capsule a day last 60 days." };

export const productContent: Record<string, ProductContent> = {
  "tongkat-ali-elite": {
    eyebrow: "Eurycoma longifolia · 200:1 root extract",
    headline: "Pure root, 450 mg per capsule",
    intro:
      "Tongkat Ali Elite is a concentrated 200:1 extract of the root of Eurycoma longifolia – also known as Malaysian Ginseng or Longjack. In a vegan capsule, with no additives.",
    highlights: [
      { label: "Extract", value: "200:1" },
      { label: "Per capsule", value: "450 mg" },
      { label: "Capsules", value: "60" },
    ],
    story: [
      {
        heading: "The root",
        body:
          "We start with carefully selected roots of Eurycoma longifolia, a botanical raw material with a long tradition in Southeast Asia. The root is dried, ground and concentrated into a 200:1 extract – 200 parts dried root become 1 part extract.",
      },
      {
        heading: "Clean composition",
        body:
          "Nothing but root extract in a plant-based capsule shell. Vegan, gluten-free and GMO-free – no binders, fillers, sweeteners or artificial preservatives.",
      },
      packaging,
    ],
    specs: [
      { label: "Latin name", value: "Eurycoma longifolia" },
      { label: "Plant part used", value: "Root" },
      { label: "Extract strength", value: "200:1" },
      { label: "Per capsule", value: "450 mg root extract" },
      { label: "Daily dose", value: "1 capsule daily" },
      { label: "Contents", value: "60 capsules – 60 days" },
      { label: "Capsule", value: "Vegan (HPMC)" },
    ],
    ingredients:
      "Tongkat Ali extract (Eurycoma longifolia, root) 200:1, capsule shell (HPMC). Content per capsule: Tongkat Ali extract (200:1) 450 mg.",
    usage: [oneDaily, noExceed, storeRoomTemp, keepAway],
    faq: [
      {
        q: "What does 200:1 mean?",
        a: "That 200 parts dried root have been concentrated into 1 part extract. It is a measure of concentration, nothing more.",
      },
      lasts60,
      {
        q: "Is the capsule vegan?",
        a: "Yes. The capsule shell is plant-based (HPMC) and the product is gluten-free and GMO-free.",
      },
      {
        q: "Does it contain fillers?",
        a: "No. Just root extract and the capsule shell – no binders, sweeteners or artificial preservatives.",
      },
    ],
  },

  "tongkat-premium": {
    eyebrow: "Eurycoma longifolia · 200:1, 20 mg eurycomanone",
    headline: "Standardised for eurycomanone",
    intro:
      "Tongkat Ali Ultra 4% is a 200:1 root extract of Eurycoma longifolia – 520 mg per capsule, of which 20 mg is eurycomanone. 60 capsules per jar. Do not take on an empty stomach.",
    highlights: [
      { label: "Extract", value: "200:1" },
      { label: "Per capsule", value: "520 mg" },
      { label: "Capsules", value: "60" },
    ],
    story: [
      {
        heading: "The root",
        body:
          "We start with carefully selected roots of Eurycoma longifolia – also known as Malaysian Ginseng or Longjack – a botanical raw material with a long tradition in Southeast Asia. The root is concentrated into a 200:1 extract.",
      },
      {
        heading: "20 mg eurycomanone per capsule",
        body:
          "Every batch is standardised for its eurycomanone content, so that each 520 mg capsule contains 20 mg eurycomanone. This keeps the strength consistent from batch to batch. One capsule a day.",
      },
      packaging,
    ],
    specs: [
      { label: "Latin name", value: "Eurycoma longifolia" },
      { label: "Plant part used", value: "Root" },
      { label: "Extract strength", value: "200:1, standardised for eurycomanone" },
      { label: "Per capsule", value: "520 mg root extract (20 mg eurycomanone)" },
      { label: "Daily dose", value: "1 capsule daily" },
      { label: "Contents", value: "60 capsules – 60 days" },
      { label: "Packaging", value: "Plastic jar with screw lid" },
      { label: "Capsule", value: "Vegan (HPMC)" },
    ],
    ingredients:
      "Tongkat Ali extract (Eurycoma longifolia, root) 200:1, capsule shell (HPMC). Content per capsule: Tongkat Ali extract (200:1) 520 mg, of which eurycomanone 20 mg.",
    usage: [
      oneDaily,
      "Do not take on an empty stomach – the extract is very strong.",
      noExceed,
      storeRoomTemp,
      keepAway,
    ],
    faq: [
      {
        q: "How much eurycomanone does a capsule contain?",
        a: "20 mg eurycomanone in 520 mg of extract.",
      },
      {
        q: "How does Ultra 4% differ from Elite?",
        a: "Elite is a 200:1 root extract with 450 mg per capsule, not standardised for eurycomanone. Ultra 4% contains 520 mg per capsule, of which 20 mg is eurycomanone.",
      },
      lasts60,
      {
        q: "Does it contain fillers?",
        a: "No. Just root extract and a vegan capsule shell – no binders, fillers or artificial preservatives.",
      },
    ],
  },

  "fadogia-agrestis": {
    eyebrow: "Fadogia agrestis · 20:1 herbal extract",
    headline: "Pure plant, 450 mg per capsule",
    intro:
      "A 20:1 extract of Fadogia agrestis, a shrub with a long tradition in West African herbal use. 450 mg per capsule in a vegan capsule – with no additives.",
    highlights: [
      { label: "Extract", value: "20:1" },
      { label: "Per capsule", value: "450 mg" },
      { label: "Capsules", value: "60" },
    ],
    story: [
      {
        heading: "The plant",
        body:
          "Fadogia agrestis is a shrub that grows in parts of Africa and has long had a natural place in traditional herbal preparations. We use carefully selected plant parts, concentrated into a 20:1 extract – for consistent strength in every capsule.",
      },
      {
        heading: "Clean composition",
        body:
          "Nothing but Fadogia agrestis extract in a plant-based capsule shell. Vegan, gluten-free and GMO-free – no binders, fillers or artificial preservatives.",
      },
      packaging,
    ],
    specs: [
      { label: "Latin name", value: "Fadogia agrestis" },
      { label: "Extract strength", value: "20:1" },
      { label: "Per capsule", value: "450 mg extract" },
      { label: "Daily dose", value: "1 capsule daily" },
      { label: "Contents", value: "60 capsules – 60 days" },
      { label: "Capsule", value: "Vegan (HPMC)" },
    ],
    ingredients:
      "Fadogia agrestis extract 20:1, capsule shell (HPMC). Content per capsule: Fadogia agrestis extract (20:1) 450 mg.",
    usage: [oneDaily, noExceed, storeRoomTemp, keepAway],
    faq: [
      {
        q: "What does 20:1 mean?",
        a: "That 20 parts dried plant material have been concentrated into 1 part extract. It is a measure of concentration, nothing more.",
      },
      {
        q: "Can I combine it with Tongkat Ali?",
        a: "Many people do. Follow the recommended daily dose for each product.",
      },
      lasts60,
      {
        q: "Does it contain fillers?",
        a: "No. Just extract and a vegan capsule shell – no binders, sweeteners or artificial preservatives.",
      },
    ],
  },

  "blue-lotus": {
    eyebrow: "Nymphaea caerulea · 200:1 extract",
    headline: "The sacred flower of the Nile, 400 mg per capsule",
    intro:
      "A concentrated 200:1 extract of Blue Lotus. A pure raw material with no additives, fillers or artificial substances, in a vegan capsule.",
    highlights: [
      { label: "Extract", value: "200:1" },
      { label: "Per capsule", value: "400 mg" },
      { label: "Daily dose", value: "1–2 capsules" },
    ],
    story: [
      {
        heading: "Sacred in ancient Egypt",
        body:
          "Blue Lotus (Nymphaea caerulea), the blue water lily, grew wild along the banks of the Nile in ancient Egypt, where it held sacred status and was often depicted in hieroglyphs and temple paintings.",
      },
      {
        heading: "Highly concentrated",
        body:
          "Our extract is a 200:1 concentrate: 200 parts dried flower have been concentrated into 1 part extract. A pure raw material – with no additives, fillers or artificial substances.",
      },
      {
        heading: "Tradition meets modern purity",
        body:
          "Nothing but flower extract in a plant-based capsule shell made from seaweed-based cellulose. Vegan and free from unnecessary additives.",
      },
    ],
    specs: [
      { label: "Latin name", value: "Nymphaea caerulea" },
      { label: "Extract strength", value: "200:1" },
      { label: "Per capsule", value: "400 mg extract" },
      { label: "Daily dose", value: "1–2 capsules (400–800 mg)" },
      { label: "Capsule", value: "Vegan (HPMC)" },
      { label: "Additives", value: "None" },
    ],
    ingredients:
      "Blue Lotus extract (Nymphaea caerulea) 200:1, plant-based capsule (HPMC). Content per capsule: 400 mg blue lotus extract. With 2 capsules: 800 mg blue lotus extract.",
    usage: [
      "1–2 capsules daily with water.",
      noExceed,
      "Not intended for use or purchase by anyone under 18.",
      "Consult a healthcare professional if you are pregnant, breastfeeding or under medical supervision.",
      "Store in a dry place at room temperature, out of reach of young children.",
    ],
    faq: [
      {
        q: "What does 200:1 mean?",
        a: "That 200 parts dried flower have been concentrated into 1 part extract. It is a measure of concentration, nothing more.",
      },
      {
        q: "Does it contain additives?",
        a: "No. Just blue lotus extract and a plant-based capsule shell – no fillers or artificial substances.",
      },
      {
        q: "Is the product vegan?",
        a: "Yes, the capsule shell is plant-based (seaweed-based cellulose).",
      },
      {
        q: "What time of day do you take it?",
        a: "The timing is up to you. Many people choose the evening as a fixed point in their routine.",
      },
    ],
  },

  "black-tongkat": {
    eyebrow: "Eurycoma longifolia · dark root, 200:1",
    headline: "The dark root – 200:1 in a vegan capsule",
    intro:
      "Black Tongkat Ali is a 200:1 root extract of Eurycoma longifolia, the same species as our yellow Tongkat Ali, made from dark root. 500 mg per capsule. The recommended dose is 1–2 capsules a day.",
    highlights: [
      { label: "Extract", value: "200:1" },
      { label: "Per capsule", value: "500 mg" },
      { label: "Dosage", value: "1–2 capsules/day" },
    ],
    story: [
      {
        heading: "Same species, darker root",
        body:
          "Black Tongkat Ali is Eurycoma longifolia, just like the yellow one. The difference lies in the raw material: the extract is made from dark root. We always state the Latin name on the jar so you know exactly what you are buying.",
      },
      {
        heading: "Root, concentrated 200:1",
        body:
          "200 parts dried root are concentrated into one part extract. Only the root is used – no bark, no stem, no leaves. The root extract comes from Southeast Asia, where the plant is native.",
      },
      {
        heading: "Clean capsule, clear dosage",
        body:
          "Each capsule contains 500 mg of extract in a plant-based shell (HPMC). No fillers, no flow agents, no colourings. The recommended dose is 1–2 capsules a day.",
      },
    ],
    specs: [
      { label: "Latin name", value: "Eurycoma longifolia" },
      { label: "Plant part used", value: "Root" },
      { label: "Extract strength", value: "200:1" },
      { label: "Per capsule", value: "500 mg extract" },
      { label: "Daily dose", value: "1–2 capsules (500–1,000 mg)" },
      { label: "Contents", value: "60 capsules – 30 to 60 days" },
      { label: "Capsule shell", value: "Plant-based (HPMC)" },
      { label: "Packaging", value: "Plastic jar with screw lid" },
    ],
    ingredients:
      "Tongkat Ali extract (Eurycoma longifolia, root) 200:1, capsule shell (HPMC). Content per capsule: Tongkat Ali extract (200:1) 500 mg.",
    usage: [
      "1–2 capsules daily with a glass of water.",
      "Ideally taken with a meal, at the same time every day.",
      noExceed,
      "Store in a dry place at room temperature and out of reach of young children.",
    ],
    faq: [
      {
        q: "How does it differ from regular (yellow) Tongkat Ali?",
        a: "Both are Eurycoma longifolia. Black Tongkat Ali is made from dark root and dosed at 1–2 capsules a day. Our yellow Elite contains 450 mg per capsule, taken as 1 capsule a day.",
      },
      {
        q: "What does 200:1 mean?",
        a: "That 200 parts dried root have been concentrated into 1 part extract. It is a measure of concentration.",
      },
      {
        q: "How many capsules should I take?",
        a: "1–2 capsules daily. A jar of 60 capsules lasts 30 days at 2 capsules a day, or 60 days at 1.",
      },
      {
        q: "Does it contain fillers, and is it vegan?",
        a: "No fillers. The capsule contains root extract and a plant-based HPMC capsule shell, which makes it vegan.",
      },
    ],
  },

  ashwagandha: {
    eyebrow: "Withania somnifera · 10 % withanolides",
    headline: "Ashwagandha, 400 mg per capsule",
    intro:
      "A standardised root extract of Withania somnifera with 10 % withanolides – 400 mg per capsule. 60 capsules in a vegan capsule shell, with no additives.",
    highlights: [
      { label: "Standardisation", value: "10 % withanolides" },
      { label: "Per capsule", value: "400 mg" },
      { label: "Capsules", value: "60" },
    ],
    story: [
      {
        heading: "The root, not the whole plant",
        body:
          "Ashwagandha is also called Indian ginseng and has a long tradition in Ayurvedic herbal culture. Our extract comes from the root only. Cheaper versions are often ground from the whole plant, leaves and stems included, which gives entirely different contents.",
      },
      {
        heading: "Standardised to 10 %",
        body:
          "Withanolides are the compounds measured in an ashwagandha extract. Ours is standardised to 10 %. 400 mg of extract corresponds to 40 mg withanolides in every capsule.",
      },
      {
        heading: "Clean composition",
        body:
          "Just the extract and a plant-based capsule shell. No binders, fillers or anti-caking agents, and nothing added to bulk out the contents.",
      },
    ],
    specs: [
      { label: "Latin name", value: "Withania somnifera" },
      { label: "Plant part", value: "Root" },
      { label: "Standardisation", value: "10 % withanolides" },
      { label: "Per capsule", value: "400 mg extract, of which 40 mg withanolides" },
      { label: "Daily dose", value: "2–3 capsules daily" },
      { label: "Packaging", value: "60 capsules" },
      { label: "Capsule", value: "Vegan (HPMC)" },
    ],
    ingredients:
      "Ashwagandha extract (Withania somnifera, root) standardised to 10 % withanolides, capsule shell (plant-based, HPMC). Content per capsule: ashwagandha extract 400 mg, of which withanolides 40 mg.",
    usage: ["2–3 capsules daily with a glass of water.", noExceed, storeCool, keepAway],
    faq: [
      {
        q: "What does 10 % withanolides mean?",
        a: "That the extract has been standardised so that 10 % consists of withanolides. In 400 mg of extract that corresponds to 40 mg.",
      },
      {
        q: "Which part of the plant is used?",
        a: "Only the root. Leaves and stems are not used.",
      },
      {
        q: "Is the capsule vegan?",
        a: "Yes. The capsule shell is plant-based (HPMC).",
      },
      {
        q: "How many capsules are in the jar?",
        a: "60 capsules.",
      },
    ],
  },

  maca: {
    eyebrow: "Lepidium meyenii · 20:1 root extract",
    headline: "Maca root, 470 mg per capsule",
    intro:
      "Maca is a concentrated 20:1 extract of the root of Lepidium meyenii – a root vegetable with a long tradition in the Andes. 60 capsules, vegan capsule shell with no additives.",
    highlights: [
      { label: "Extract", value: "20:1" },
      { label: "Per capsule", value: "470 mg" },
      { label: "Capsules", value: "60" },
    ],
    story: [
      {
        heading: "The root",
        body:
          "Maca (Lepidium meyenii) is grown at high altitude in the Andes and has been used in Peruvian herbal tradition for generations. The root is dried, ground and concentrated into a standardised 20:1 extract – 20 parts dried root become 1 part extract.",
      },
      {
        heading: "Clean composition",
        body: `Nothing but maca root extract in a plant-based capsule shell. ${cleanNoSweeteners}`,
      },
      packaging,
    ],
    specs: [
      { label: "Latin name", value: "Lepidium meyenii" },
      { label: "Plant part used", value: "Root" },
      { label: "Extract strength", value: "20:1" },
      { label: "Per capsule", value: "470 mg root extract" },
      { label: "Daily dose", value: "2 capsules daily" },
      { label: "Contents", value: "60 capsules – 30 days" },
      { label: "Capsule", value: "Vegan (HPMC)" },
    ],
    ingredients:
      "Maca extract (Lepidium meyenii, root) 20:1, capsule shell (HPMC). Content per capsule: maca root extract (20:1) 470 mg.",
    usage: ["2 capsules daily with a glass of water.", noExceed, storeCool, keepAway],
    faq: [
      {
        q: "What does 20:1 mean?",
        a: "That 20 parts dried maca root have been concentrated into 1 part extract. It is a measure of concentration, nothing more.",
      },
      {
        q: "How long does a jar last?",
        a: "60 capsules at 2 capsules a day last 30 days.",
      },
      veganFaq,
      {
        q: "Does it contain fillers?",
        a: "No. Just root extract and the capsule shell – no binders, sweeteners or artificial preservatives.",
      },
    ],
  },

  mariatistel: {
    eyebrow: "Silybum marianum · 20:1, 80 % silymarin",
    headline: "Milk thistle, 350 mg per capsule",
    intro:
      "Milk thistle is a 20:1 extract of Silybum marianum standardised to 80 % silymarin – 350 mg per capsule. 60 capsules in a vegan capsule shell with no additives.",
    highlights: [
      { label: "Extract", value: "20:1 · 80 %" },
      { label: "Per capsule", value: "350 mg" },
      { label: "Capsules", value: "60" },
    ],
    story: [
      {
        heading: "The plant",
        body:
          "Milk thistle (Silybum marianum) is a thistle from the Mediterranean region with a long tradition in European herbal use. The seeds are dried and extracted into a concentrate standardised to 80 % silymarin – a flavonoid complex that includes isosilybin (approx. 2.5 %), silychristin (approx. 10 %) and silydianin (approx. 7.5 %).",
      },
      {
        heading: "Clean composition",
        body:
          "Nothing but milk thistle extract in a plant-based pullulan capsule shell. Vegan, gluten-free and GMO-free – free from lactose, soy, yeast, wheat and milk, and with no colourings, binders, fillers or artificial preservatives.",
      },
      packaging,
    ],
    specs: [
      { label: "Latin name", value: "Silybum marianum" },
      { label: "Plant part used", value: "Seed" },
      { label: "Extract strength", value: "20:1" },
      { label: "Standardisation", value: "80 % silymarin" },
      { label: "Per capsule", value: "350 mg extract" },
      { label: "Daily dose", value: "1 capsule daily" },
      { label: "Contents", value: "60 capsules – 60 days" },
      { label: "Capsule", value: "Vegan (pullulan)" },
    ],
    ingredients:
      "Milk thistle extract (Silybum marianum, seed) 20:1 standardised to 80 % silymarin, capsule shell (pullulan). Content per capsule: milk thistle extract 350 mg, of which silymarin 280 mg.",
    usage: [oneDaily, noExceed, storeCool, keepAway],
    faq: [
      {
        q: "What does 80 % silymarin mean?",
        a: "That the extract has been standardised so that 80 % consists of the flavonoid complex silymarin. In 350 mg of extract that corresponds to 280 mg silymarin.",
      },
      {
        q: "Which plant part is used?",
        a: "The seeds of the milk thistle, which are dried and extracted into a 20:1 concentrate.",
      },
      {
        q: "Is the capsule vegan?",
        a: "Yes. The capsule shell is plant-based pullulan and the product is gluten-free and GMO-free.",
      },
      lasts60,
    ],
  },

  nasselblad: {
    eyebrow: "Urtica dioica · 10:1 leaf extract",
    headline: "Nettle leaf, 430 mg per capsule",
    intro:
      "Nettle leaf is a 10:1 extract of the leaves of Urtica dioica – 430 mg per capsule. 60 capsules in a vegan capsule shell with no additives.",
    highlights: [
      { label: "Extract", value: "10:1" },
      { label: "Per capsule", value: "430 mg" },
      { label: "Capsules", value: "60" },
    ],
    story: [
      {
        heading: "The leaf",
        body:
          "Stinging nettle (Urtica dioica) has been used in European herbal tradition for centuries. We use the leaves, which are dried and concentrated into a 10:1 extract – 10 parts dried leaf become 1 part extract.",
      },
      {
        heading: "Clean composition",
        body: `Nothing but nettle leaf extract in a plant-based capsule shell. ${cleanNoSweeteners}`,
      },
      packaging,
    ],
    specs: [
      { label: "Latin name", value: "Urtica dioica" },
      { label: "Plant part used", value: "Leaf" },
      { label: "Extract strength", value: "10:1" },
      { label: "Per capsule", value: "430 mg extract" },
      { label: "Daily dose", value: "1 capsule daily" },
      { label: "Contents", value: "60 capsules – 60 days" },
      { label: "Capsule", value: "Vegan" },
    ],
    ingredients:
      "Nettle leaf extract (Urtica dioica, leaf) 10:1, capsule shell (plant-based). Content per capsule: nettle leaf extract 430 mg.",
    usage: [oneDaily, noExceed, storeCool, keepAway],
    faq: [
      {
        q: "What does 10:1 mean?",
        a: "That 10 parts dried nettle leaf have been concentrated into 1 part extract. It is a measure of concentration, nothing more.",
      },
      {
        q: "Which plant part is used?",
        a: "The leaves of the stinging nettle, which are dried and extracted into a 10:1 concentrate.",
      },
      veganFaq,
      lasts60,
    ],
  },

  druvkarneextrakt: {
    eyebrow: "Vitis vinifera · 95 % OPC",
    headline: "Grape seed extract, 500 mg per capsule",
    intro:
      "Grape seed extract is an extract of the seeds of Vitis vinifera standardised to 95 % proanthocyanidins (OPC) – 500 mg per capsule. 60 capsules in a vegan capsule shell with no additives.",
    highlights: [
      { label: "Standardisation", value: "95 % OPC" },
      { label: "Per capsule", value: "500 mg" },
      { label: "Capsules", value: "60" },
    ],
    story: [
      {
        heading: "The seed",
        body:
          "The grapevine (Vitis vinifera) has been cultivated in Europe since time immemorial. We use the seeds, a natural source of polyphenols, and extract them into a concentrate standardised to 95 % proanthocyanidins – also known as OPC.",
      },
      {
        heading: "Clean composition",
        body: `Nothing but grape seed extract in a plant-based capsule shell. ${cleanNoSweeteners}`,
      },
      packaging,
    ],
    specs: [
      { label: "Latin name", value: "Vitis vinifera" },
      { label: "Plant part used", value: "Seed" },
      { label: "Standardisation", value: "95 % proanthocyanidins (OPC)" },
      { label: "Per capsule", value: "500 mg extract" },
      { label: "Daily dose", value: "1–2 capsules daily" },
      { label: "Contents", value: "60 capsules – 30–60 days" },
      { label: "Capsule", value: "Vegan" },
    ],
    ingredients:
      "Grape seed extract (Vitis vinifera, seed) standardised to 95 % proanthocyanidins, capsule shell (plant-based). Content per capsule: grape seed extract 500 mg, of which proanthocyanidins 475 mg.",
    usage: ["1–2 capsules daily with a glass of water.", noExceed, storeCool, keepAway],
    faq: [
      {
        q: "What does 95 % OPC mean?",
        a: "That the extract has been standardised so that 95 % consists of proanthocyanidins. In 500 mg of extract that corresponds to 475 mg.",
      },
      {
        q: "Which plant part is used?",
        a: "The seeds of the grape, which are extracted and standardised for polyphenols.",
      },
      veganFaq,
      {
        q: "How long does a jar last?",
        a: "60 capsules last 30 days at 2 capsules a day and 60 days at 1 capsule a day.",
      },
    ],
  },

  quercetin: {
    eyebrow: "Quercetin · 98 % purity",
    headline: "Quercetin, 500 mg per capsule",
    intro:
      "Quercetin is a flavonoid found naturally in fruit and vegetables. Our extract has 98 % purity – 500 mg per capsule. 60 capsules in a vegan capsule shell with no additives.",
    highlights: [
      { label: "Purity", value: "98 %" },
      { label: "Per capsule", value: "500 mg" },
      { label: "Capsules", value: "60" },
    ],
    story: [
      {
        heading: "The compound",
        body:
          "Quercetin is a plant-based flavonoid found in onions, apples and berries, among other foods. We choose a high-purity extract – 98 % – so that every capsule has the same contents, batch after batch.",
      },
      {
        heading: "Clean composition",
        body: `Nothing but quercetin extract in a plant-based capsule shell. ${cleanNoSweeteners}`,
      },
      packaging,
    ],
    specs: [
      { label: "Contents", value: "Quercetin extract" },
      { label: "Purity", value: "98 % quercetin" },
      { label: "Per capsule", value: "500 mg" },
      { label: "Daily dose", value: "1 capsule daily" },
      { label: "Packaging", value: "60 capsules – 60 days" },
      { label: "Capsule", value: "Vegan" },
    ],
    ingredients:
      "Quercetin extract (98 % quercetin), capsule shell (plant-based). Content per capsule: quercetin extract 500 mg, of which quercetin 490 mg.",
    usage: [oneDaily, noExceed, storeCool, keepAway],
    faq: [
      {
        q: "What does 98 % purity mean?",
        a: "That 98 % of the extract consists of quercetin. In 500 mg of extract that corresponds to 490 mg quercetin.",
      },
      {
        q: "Where does quercetin come from?",
        a: "Quercetin is a flavonoid found naturally in fruit, vegetables and herbs.",
      },
      veganFaq,
      lasts60,
    ],
  },

  reishi: {
    eyebrow: "Ganoderma lucidum · 40 % polysaccharides",
    headline: "Reishi, 350 mg per capsule",
    intro:
      "Reishi (Ganoderma lucidum) in a standardised mushroom extract with 40 % polysaccharides – 350 mg per capsule. 60 capsules in a vegan capsule shell with no additives.",
    highlights: [
      { label: "Standardisation", value: "40 % polysaccharides" },
      { label: "Per capsule", value: "350 mg" },
      { label: "Capsules", value: "60" },
    ],
    story: [
      {
        heading: "The mushroom",
        body:
          "Reishi, Ganoderma lucidum, has been used in traditional herbal culture for centuries. Our extract is concentrated and standardised to 40 % polysaccharides, so the contents are the same in every capsule.",
      },
      {
        heading: "Clean composition",
        body: `Nothing but reishi extract in a plant-based capsule shell. ${cleanNoSweeteners}`,
      },
      packaging,
    ],
    specs: [
      { label: "Latin name", value: "Ganoderma lucidum" },
      { label: "Standardisation", value: "40 % polysaccharides" },
      { label: "Per capsule", value: "350 mg" },
      { label: "Daily dose", value: "1 capsule daily" },
      { label: "Packaging", value: "60 capsules – 60 days" },
      { label: "Capsule", value: "Vegan" },
    ],
    ingredients:
      "Reishi extract (Ganoderma lucidum) standardised to 40 % polysaccharides, capsule shell (plant-based). Content per capsule: reishi extract 350 mg, of which polysaccharides 140 mg.",
    usage: [oneDaily, noExceed, storeCool, keepAway],
    faq: [
      {
        q: "What does 40 % polysaccharides mean?",
        a: "That the extract has been standardised so that 40 % consists of polysaccharides. In 350 mg of extract that corresponds to 140 mg.",
      },
      {
        q: "Which mushroom is used?",
        a: "Ganoderma lucidum, commonly known as reishi.",
      },
      veganFaq,
      lasts60,
    ],
  },

  chaga: {
    eyebrow: "Inonotus obliquus · 30:1 extract",
    headline: "Chaga, 400 mg per capsule",
    intro:
      "Chaga (Inonotus obliquus) in a 30:1 extract standardised to 10 % polysaccharides – 400 mg per capsule. 60 capsules in a vegan capsule shell with no additives.",
    highlights: [
      { label: "Extract", value: "30:1" },
      { label: "Per capsule", value: "400 mg" },
      { label: "Capsules", value: "60" },
    ],
    story: [
      {
        heading: "The mushroom",
        body:
          "Chaga grows slowly on birch trees, taking up nutrients from the tree over many years. Our extract comes from high-quality wild-harvested chaga, concentrated 30:1 and standardised to 10 % polysaccharides.",
      },
      {
        heading: "Clean composition",
        body: `Nothing but chaga extract in a plant-based capsule shell. ${cleanNoSweeteners}`,
      },
      packaging,
    ],
    specs: [
      { label: "Latin name", value: "Inonotus obliquus" },
      { label: "Extract", value: "30:1" },
      { label: "Standardisation", value: "10 % polysaccharides" },
      { label: "Per capsule", value: "400 mg" },
      { label: "Daily dose", value: "1 capsule daily" },
      { label: "Packaging", value: "60 capsules – 60 days" },
      { label: "Capsule", value: "Vegan" },
    ],
    ingredients:
      "Chaga extract (Inonotus obliquus) 30:1 standardised to 10 % polysaccharides, capsule shell (plant-based). Content per capsule: chaga extract 400 mg, of which polysaccharides 40 mg.",
    usage: [oneDaily, noExceed, storeCool, keepAway],
    faq: [
      {
        q: "What does 30:1 mean?",
        a: "That 30 parts raw material have been concentrated into 1 part extract. 400 mg of extract corresponds to about 12 g of dried chaga.",
      },
      {
        q: "What does 10 % polysaccharides mean?",
        a: "That the extract has been standardised so that 10 % consists of polysaccharides – 40 mg per capsule.",
      },
      veganFaq,
      lasts60,
    ],
  },

  "lions-mane": {
    eyebrow: "Hericium erinaceus · 60 % polysaccharides",
    headline: "Lion's Mane, 500 mg per capsule",
    intro:
      "Lion's Mane (Hericium erinaceus) in a standardised mushroom extract with 60 % polysaccharides, of which 45 % beta-glucans – 500 mg per capsule. 60 capsules in a vegan capsule shell with no additives.",
    highlights: [
      { label: "Standardisation", value: "60 % polysaccharides" },
      { label: "Per capsule", value: "500 mg" },
      { label: "Capsules", value: "60" },
    ],
    story: [
      {
        heading: "The mushroom",
        body:
          "Lion's Mane, Hericium erinaceus, has a long history in the traditional herbal culture of East Asia. Our extract is concentrated and standardised to 60 % polysaccharides, of which 45 % beta-glucans, so the contents are the same in every capsule.",
      },
      {
        heading: "Clean composition",
        body: `Nothing but Lion's Mane extract in a plant-based capsule shell. ${cleanNoSweeteners}`,
      },
      packaging,
    ],
    specs: [
      { label: "Latin name", value: "Hericium erinaceus" },
      { label: "Standardisation", value: "60 % polysaccharides" },
      { label: "Of which beta-glucans", value: "45 %" },
      { label: "Per capsule", value: "500 mg" },
      { label: "Daily dose", value: "1 capsule daily" },
      { label: "Packaging", value: "60 capsules – 60 days" },
      { label: "Capsule", value: "Vegan" },
    ],
    ingredients:
      "Lion's Mane extract (Hericium erinaceus) standardised to 60 % polysaccharides, of which 45 % beta-glucans, capsule shell (plant-based). Content per capsule: extract 500 mg, of which polysaccharides 300 mg and beta-glucans 225 mg.",
    usage: [oneDaily, noExceed, storeCool, keepAway],
    faq: [
      {
        q: "What does 60 % polysaccharides mean?",
        a: "That the extract has been standardised so that 60 % consists of polysaccharides. In 500 mg of extract that corresponds to 300 mg.",
      },
      {
        q: "What are beta-glucans?",
        a: "A specific group of polysaccharides. In our extract they make up 45 %, which is 225 mg per capsule.",
      },
      veganFaq,
      lasts60,
    ],
  },

  cordyceps: {
    eyebrow: "Cordyceps militaris · 8:1 extract",
    headline: "Cordyceps, 350 mg per capsule",
    intro:
      "Cordyceps (Cordyceps militaris) in an 8:1 extract standardised to 40 % polysaccharides – 350 mg per capsule. 60 capsules in a vegan capsule shell with no additives.",
    highlights: [
      { label: "Extract", value: "8:1" },
      { label: "Per capsule", value: "350 mg" },
      { label: "Capsules", value: "60" },
    ],
    story: [
      {
        heading: "The mushroom",
        body:
          "Cordyceps has long had a place in East Asian herbal culture. Our extract comes from carefully selected Cordyceps militaris, concentrated 8:1 and standardised to 40 % polysaccharides so the contents are the same in every capsule.",
      },
      {
        heading: "Clean composition",
        body: `Nothing but cordyceps extract in a plant-based capsule shell. ${cleanNoSweeteners}`,
      },
      packaging,
    ],
    specs: [
      { label: "Latin name", value: "Cordyceps militaris" },
      { label: "Extract", value: "8:1" },
      { label: "Standardisation", value: "40 % polysaccharides" },
      { label: "Per capsule", value: "350 mg" },
      { label: "Daily dose", value: "1 capsule daily" },
      { label: "Packaging", value: "60 capsules – 60 days" },
      { label: "Capsule", value: "Vegan" },
    ],
    ingredients:
      "Cordyceps extract (Cordyceps militaris) 8:1 standardised to 40 % polysaccharides, capsule shell (plant-based). Content per capsule: cordyceps extract 350 mg, of which polysaccharides 140 mg.",
    usage: [oneDaily, noExceed, storeCool, keepAway],
    faq: [
      {
        q: "What does 8:1 mean?",
        a: "That 8 parts raw material have been concentrated into 1 part extract. 350 mg of extract corresponds to about 2.8 g of dried cordyceps.",
      },
      {
        q: "What does 40 % polysaccharides mean?",
        a: "That the extract has been standardised so that 40 % consists of polysaccharides – 140 mg per capsule.",
      },
      veganFaq,
      lasts60,
    ],
  },

  "pine-pollen": {
    eyebrow: "Pine pollen · 99 % pure extract",
    headline: "Pine Pollen, 300 mg per capsule",
    intro:
      "Pollen from pine in a 99 % pure extract with cracked cell walls – 300 mg per capsule. 60 capsules in a vegan capsule shell, with no additives.",
    highlights: [
      { label: "Purity", value: "99 %" },
      { label: "Per capsule", value: "300 mg" },
      { label: "Capsules", value: "60" },
    ],
    story: [
      {
        heading: "The yellow dust of spring",
        body:
          "For a few weeks each spring, the pine releases its pollen: a fine yellow dust that settles over land and water. The harvest takes place during the short period when the pollen is there, which is why the raw material is seasonal.",
      },
      {
        heading: "Cracked cell walls",
        body:
          "A pollen grain has a hard outer shell. In our extract the cell walls have been cracked – the step that makes the contents of the grain accessible instead of letting it pass through intact.",
      },
      {
        heading: "Clean composition",
        body:
          "99 % pure pollen extract and a plant-based capsule shell. No binders, fillers or anti-caking agents.",
      },
    ],
    specs: [
      { label: "Raw material", value: "Pollen from pine" },
      { label: "Purity", value: "99 %" },
      { label: "Processing", value: "Cracked cell walls" },
      { label: "Per capsule", value: "300 mg" },
      { label: "Daily dose", value: "1–3 capsules daily" },
      { label: "Packaging", value: "60 capsules" },
      { label: "Capsule", value: "Vegan (HPMC)" },
    ],
    ingredients:
      "Pine pollen extract (99 % pure, cracked cell walls), capsule shell (plant-based, HPMC). Content per capsule: pollen extract 300 mg.",
    usage: ["1–3 capsules daily with a glass of water.", noExceed, storeCool, keepAway],
    faq: [
      {
        q: "What does cracked cell walls mean?",
        a: "The outer shell of the pollen grain has been opened during processing, so the contents become accessible instead of passing through intact.",
      },
      {
        q: "When is the pollen harvested?",
        a: "During the short period in spring when the pine releases its pollen.",
      },
      {
        q: "Is the capsule vegan?",
        a: "Yes. The capsule shell is plant-based (HPMC).",
      },
      {
        q: "How many capsules are in the jar?",
        a: "60 capsules.",
      },
    ],
  },
};
