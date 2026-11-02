import type { HomeMessages } from "../../home";

export const messages: HomeMessages = {
  title: "Metilde – Compléments alimentaires botaniques purs",
  description: (freeOver) =>
    `Champignons fonctionnels, herbes et extraits de plantes sous forme d'extraits standardisés en gélule végane. Livraison offerte dès ${freeOver}.`,
  heroEyebrow: "Gélule végane",
  heroTitle: "Des extraits botaniques purs",
  heroTitleAccent: "pour votre quotidien",
  heroLead:
    "Des extraits standardisés de plantes et de champignons en gélule végane – sans liants, agents de charge ni colorants. Le ratio d'extraction et la dose par gélule figurent sur chaque pot.",
  shopNow: "Acheter",
  findExtract: "Trouver votre extrait",
  reviews: (n) => `${n} avis`,
  freeShippingOver: (amount) => `Livraison offerte dès ${amount}`,
  returnRight: "30 jours de droit de rétractation",
  original: "Notre original",
  allProducts: "Tous les produits",
  rangeEyebrow: "La gamme",
  rangeTitle: "Nos extraits",
  showAll: "Voir tous les produits",
  bundlesEyebrow: "Packs",
  bundlesTitle: "Combinez et économisez",
  bundlesIntro: "Des combinaisons prêtes à l'emploi de nos extraits les plus demandés – toujours avec livraison offerte.",
  howEyebrow: "Notre façon de travailler",
  howTitle: "Vous devez savoir exactement ce que contient chaque gélule",
  howText:
    "Nous indiquons toujours le nom latin, la partie de la plante, le ratio d'extraction et la quantité par gélule. Pas d'agents de charge, pas d'antiagglomérants, pas de colorants – et le numéro de lot sur l'emballage correspond à un rapport d'analyse précis.",
  howCta: "En savoir plus sur la qualité et l'étiquetage",
  pillars: [
    ["Standardisé", "Le même contenu dans chaque lot – mesuré sur une substance marqueur ou le ratio d'extraction."],
    ["Traçable", "Chaque pot porte un numéro de lot et une date de durabilité minimale."],
    ["Végan", "Enveloppe de gélule d'origine végétale (HPMC ou pullulane). Sans gluten, sans OGM."],
  ],
  goalsEyebrow: "Personnel",
  goalsIntro: "Triez la gamme par matière première et par moment de la journée.",
  productCount: (n) => `${n} ${n === 1 ? "produit" : "produits"}`,
  journalEyebrow: "Journal",
  journalTitle: "Guides et articles de fond",
  allArticles: "Tous les articles",
};
