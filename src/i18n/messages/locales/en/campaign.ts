import type { CampaignMessages } from "../../campaign";

export const messages: CampaignMessages = {
  metaTitle: "Mushroom and plant extracts in vegan capsules",
  metaDescription: "Standardised mushroom and plant extracts with no fillers, in vegan capsules.",
  eyebrow: "Standardised extracts · vegan capsule",
  title: "Pure mushroom and plant extracts",
  intro: "Standardised extracts with no fillers. Extract strength and dose are printed on every jar.",
  cta: "See the products",
  usps: (freeOver) => [`Free shipping over ${freeOver}`, "Subscribe and save 15%", "Vegan capsule, no fillers", "30-day right of withdrawal"],
  mushrooms: "Mushroom extracts",
  mushroomsIntro: "Lion's Mane, Reishi, Chaga and Cordyceps as concentrated extracts.",
  plants: "Plant and herbal extracts",
  plantsIntro: "Root extracts, leaf extracts and algae – each with its extract strength stated.",
  subTitle: "Subscribe and save 15%",
  subText: "Choose delivery every 30, 60 or 90 days. Subscriptions always ship free.",
  subLink: "How subscriptions work",
  allProducts: "View the full range",
  disclaimer: "Food supplements should not replace a varied diet. Do not exceed the recommended daily dose.",
};
