import type { CommonMessages } from "../../common";

export const messages: CommonMessages = {
  siteTitle: "Metilde – Compléments alimentaires botaniques purs, développés en Suède",
  siteDescription: (freeOver) =>
    `Extraits standardisés de plantes et de champignons sans agents de charge, développés en Suède. Livraison offerte dès ${freeOver}.`,
  notFound: {
    title: "Page introuvable",
    text: "L'adresse a peut-être changé ou le produit ne fait plus partie de la gamme.",
    home: "Retour à l'accueil",
  },
};
