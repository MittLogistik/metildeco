import type { CommonMessages } from "../../common";

export const messages: CommonMessages = {
  siteTitle: "Metilde – Pure botanical food supplements developed in Sweden",
  siteDescription: (freeOver) =>
    `Standardised herbal and mushroom extracts with no fillers, developed in Sweden. Free shipping over ${freeOver}.`,
  notFound: {
    title: "Page not found",
    text: "The address may have changed, or the product is no longer in our range.",
    home: "Go to the home page",
  },
};
