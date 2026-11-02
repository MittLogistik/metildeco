import type { CartMessages } from "../../cart";

export const messages: CartMessages = {
  // Rabattetiketter på korgrader
  bundleDiscount: (pct) => `Pack −${pct} %`,
  giftValue: (value) => `Cadeau · valeur ${value}`,
  subDiscount: (pct) => `Abonnement −${pct} %`,
  tierDiscount: (pct) => `Remise sur quantité −${pct} %`,

  // Summor
  subtotal: "Sous-total",
  discount: "Remise",
  shipping: "Livraison",
  free: "Offerte",
  shippingFrom: (price) => `à partir de ${price}`,
  toPay: "Total à payer",
  totalsNote: "TVA incluse. Le mode de livraison et un éventuel code promo se choisissent à l'étape du paiement.",

  // Gemensamt
  pcs: (n) => `${n} pcs`,
  perPcs: "/pce",
  capsules: (n) => `${n} gélules`,
  save: (amount) => `Économisez ${amount}`,
  decrease: "Diminuer la quantité",
  increase: "Augmenter la quantité",
  remove: "Supprimer",
  soldOut: "Épuisé",
  tempOut: "Temporairement épuisé",
  added: "Ajouté",
  addedToCart: "Ajouté au panier",
  addToCart: "Ajouter au panier",
  addBundle: "Ajouter le pack au panier",
  buy: "Acheter",
  freeShipping: "Livraison offerte",
  gift: "Cadeau",
  once: "Achat unique",

  // Produktsidans köpruta (variant A)
  planLegend: "Mode d'achat",
  onceNote: "Payez une fois, sans engagement",
  subTitle: (pct) => `Abonnement – économisez ${pct} %`,
  subNote: "Livraison offerte, fréquence au choix, résiliable à tout moment",
  delivery: "Livraison",
  deliveryHint: "– à quelle fréquence souhaitez-vous être livré ?",
  everyDays: (d) => `Tous les ${d} jours`,
  chooseQty: "Choisir la quantité",
  chooseQtyHint: "– plus de pots, prix plus bas",

  // Erbjudanderutan (variant B)
  chooseOption: "Choisissez votre option d'achat",
  bestValue: "Meilleure offre",
  sub1Title: "Abonnement à 1 pot",
  sub1Sub: (caps) => `1 mois d'utilisation${caps ? ` · ${caps} gélules` : ""}`,
  freeEvery: (d) => `Livraison offerte · tous les ${d} jours`,
  cancelAnytime: "Résiliable à tout moment",
  packTitle: (n) => `Abonnement à ${n} pots`,
  packSub: (n, caps) => `${n} mois d'utilisation${caps ? ` · ${caps} gélules` : ""}`,
  giftPoint: (name, value) => `+ ${name} offert (valeur ${value})`,
  chooseGift: "Choisissez votre cadeau",
  onceTitle: "Acheter 1 pot",
  onceSub: "Achat unique, prix normal",
  freeOver: (amount) => `Livraison offerte dès ${amount}`,
  saveOffer: (pct, amount) => `Économisez ${pct} % · ${amount}`,
  onceFootnote: "Payez une fois. La remise et la livraison offerte sont réservées à l'abonnement.",
  subFootnote: "Sans engagement. Vous pouvez mettre votre abonnement en pause ou le résilier à tout moment.",
  giftFootnote: " Le cadeau est joint à la première livraison.",

  // Korgrad
  giftNote: "Joint à votre multipack lors de la première livraison.",
  subscribeToggle: (pct) => `Abonnement −${pct} %`,
  deliveryEvery: "Livraison tous les",
  dayN: (d) => `${d} jours`,
  subHint: (price) => `Abonnement : ${price}/pce et livraison offerte, résiliable à tout moment.`,

  // Låda
  close: "Fermer le panier",
  title: "Votre panier",
  empty: "Votre panier est vide.",
  explore: "Découvrir la gamme",
  remainingBefore: "Plus que ",
  remainingAfter: " pour la livraison offerte",
  haveFreeShipping: "La livraison de cette commande est offerte",
  toCheckout: "Passer commande",
  continueShopping: "Continuer mes achats",
};
