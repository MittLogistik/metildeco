import type { CatalogMessages } from "../../catalog";

export const messages: CatalogMessages = {
  // Kort
  soldOut: "Épuisé",
  isNew: "Nouveau",
  bundleSoldOut: "Temporairement épuisé",
  save: (pct) => `Économisez ${pct} %`,
  bundleItems: (n) => `Pack · ${n} produits`,
  boughtSeparately: (v) => `Acheté séparément ${v}`,
  readMinutes: (n) => `${n} min de lecture`,
  rating: (r) => `Note ${r} sur 5`,
  // Galleri
  imageAlt: (name, n) => `${name} – image ${n}`,
  playVideo: "Lire la vidéo",
  showVideo: "Afficher la vidéo",
  showImage: (n) => `Afficher l'image ${n}`,
  moreImages: "Plus d'images",
  // Produktlistan
  listTitle: "Tous les produits – extraits de plantes et de champignons",
  listDescription:
    "Toute la gamme Metilde d'extraits standardisés de plantes et de champignons : Lion's Mane, Cordyceps, Reishi, Chaga, Maca et plus encore.",
  sorts: { utvald: "Sélection", "pris-lag": "Prix croissant", "pris-hog": "Prix décroissant", namn: "A–Z" },
  bundles: "Packs",
  allProducts: "Tous les produits",
  products: "Produits",
  listIntro: "Des extraits standardisés en gélule végane, conditionnés en pot plastique.",
  categoryNav: "Catégorie",
  all: "Tous",
  sortLabel: "Trier :",
  emptyCategory: "Aucun produit dans cette catégorie pour le moment.",
  productCount: (n) => `${n} produits`,
  // Paketsidan
  bundleNotFound: "Pack introuvable",
  bundleSeoTitle: (name, pct) => `${name} – économisez ${pct} %`,
  bundleEyebrow: (pct) => `Pack · économisez ${pct} %`,
  included: "Contenu du pack",
  valueSeparately: "Valeur à l'unité",
  bundlePrice: "Prix du pack",
  youSave: "Vous économisez",
  bundleFreeShipping: "Livraison offerte pour ce pack",
  freeShippingOver: (amount) => `Livraison offerte dès ${amount}`,
  sameDay: "Expédié le jour même pour toute commande passée avant 12 h (heure suédoise) en semaine",
  securePayment: "Paiement sécurisé avec",
  description: "Description",
  moreBundles: "Plus de packs",
};
