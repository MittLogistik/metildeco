import type { ProductMessages } from "../../product";

export const messages: ProductMessages = {
  notFound: "Produit introuvable",
  products: "Produits",
  vegan: "Végan",
  inclVat: "TTC",
  soldOut: "Épuisé – réassort en cours",
  lowStock: (n) => `En stock – plus que ${n}`,
  inStock: "En stock – expédié le jour même pour toute commande passée en semaine avant 12 h (CET)",
  shippingFrom: (from, freeOver) => `Livraison à partir de ${from}, offerte dès ${freeOver}.`,
  deliveryTime: (min, max) => `Délai de livraison ${min}–${max} jours ouvrés`,
  returnRight: "30 jours de droit de rétractation",
  securePayment: "Paiement sécurisé avec",
  summary: "Le produit en bref",
  description: "Description",
  facts: "Caractéristiques",
  sku: "Référence",
  ingredients: "Composition",
  usage: "Mode d'emploi",
  qualityTitle: "Comment nous garantissons la qualité",
  quality: [
    { t: "Nom latin", d: "L'espèce et la partie de la plante figurent sur chaque pot." },
    { t: "Dosage clair", d: "Le ratio d'extraction et la quantité par gélule figurent sur l'étiquette." },
    { t: "Gélule végane", d: "Gélule végane sans agents de charge, conditionnée en pot plastique." },
  ],
  faq: "Questions fréquentes",
  disclaimer:
    "Les compléments alimentaires ne remplacent pas une alimentation variée et équilibrée ni un mode de vie sain. Ne pas dépasser la dose journalière recommandée. Tenir hors de portée des jeunes enfants.",
  related: "Vous aimerez peut-être aussi",
};
