import type { HomeMessages } from "../../home";

export const messages: HomeMessages = {
  title: "Metilde – Pure botanical food supplements developed in Sweden",
  description: (freeOver) =>
    `Tongkat Ali, Fadogia Agrestis, Blue Lotus and functional mushrooms as standardised extracts in vegan capsules, developed in Sweden. Free shipping over ${freeOver}.`,
  heroEyebrow: "Vegan capsule",
  heroTitle: "Pure botanical extracts",
  heroTitleAccent: "for everyday life",
  heroLead:
    "Standardised herbal and mushroom extracts in vegan capsules – with no binders, fillers or colourings. Extract strength and dose per capsule are printed on every jar.",
  shopNow: "Shop now",
  findExtract: "Find your extract",
  reviews: (n) => `${n} reviews`,
  freeShippingOver: (amount) => `Free shipping over ${amount}`,
  returnRight: "30-day right of withdrawal",
  original: "Our original",
  allProducts: "All products",
  rangeEyebrow: "The range",
  rangeTitle: "Our extracts",
  showAll: "View all products",
  bundlesEyebrow: "Bundles",
  bundlesTitle: "Combine and save",
  bundlesIntro: "Ready-made combinations of our most popular extracts – always with free shipping.",
  howEyebrow: "How we work",
  howTitle: "You should know exactly what's in every capsule",
  howText:
    "We always state the Latin name, plant part, extract strength and amount per capsule. No fillers, no flow agents, no colourings – and the batch number on the pack is linked to a specific certificate of analysis.",
  howCta: "Read about quality and labelling",
  pillars: [
    ["Standardised", "The same content in every batch – measured by marker compound or extract strength."],
    ["Traceable", "Every jar has a batch number and a best-before date."],
    ["Vegan", "Plant-based capsule shell (HPMC or pullulan). Gluten-free, GMO-free."],
  ],
  goalsEyebrow: "Personal",
  goalsIntro: "Sort the range by raw material and time of day.",
  productCount: (n) => `${n} ${n === 1 ? "product" : "products"}`,
  journalEyebrow: "Journal",
  journalTitle: "Guides and in-depth reading",
  allArticles: "All articles",
};
