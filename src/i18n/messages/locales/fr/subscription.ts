import type { SubscriptionMessages } from "../../subscription";

export const messages: SubscriptionMessages = {
  title: (pct) => `Abonnement – économisez ${pct} % sur chaque livraison`,
  description: (pct) =>
    `Abonnez-vous à vos compléments alimentaires et économisez ${pct} % sur chaque livraison. Livraison offerte, fréquence au choix et résiliation quand vous le souhaitez.`,
  breadcrumb: "Abonnement",
  eyebrow: (pct) => `Économisez ${pct} %`,
  h1: "Abonnement – vos compléments livrés automatiquement",
  lead: (pct) =>
    `Fini les pots vides et les commandes oubliées. Abonnez-vous à ce que vous utilisez chaque jour et économisez ${pct} % sur chaque livraison – avec la livraison offerte et sans engagement.`,
  start: "Démarrer un abonnement",
  how: "Comment ça marche",
  checks: ["Sans engagement", "Livraison offerte", "Résiliable à tout moment"],
  stepsEyebrow: "Étape par étape",
  stepsIntro: "Quatre étapes simples – et vous gardez le contrôle du début à la fin.",
  steps: [
    ["Choisissez un produit", "Choisissez les extraits que vous utilisez régulièrement et sélectionnez Abonnement sur la page produit."],
    ["Choisissez la fréquence", "Livraison tous les 30, 60 ou 90 jours – selon la vitesse à laquelle vous terminez votre pot."],
    ["Recevez-le automatiquement", "À chaque nouvelle période, le paiement est prélevé et vous recevez un e-mail avec la date de livraison estimée. Livraison toujours offerte, quel que soit le montant de la commande."],
    ["Mettez en pause ou résiliez", "Vous souhaitez mettre votre abonnement en pause, le reprendre, le résilier ou changer de fréquence ou de produit ? Écrivez à notre service client et nous nous en chargeons – sans aucun engagement."],
  ],
  exampleEyebrow: "Exemple chiffré",
  exampleTitle: "Qu'y gagnez-vous ?",
  exampleIntro: (pct) =>
    `La remise de ${pct} % s'applique à chaque livraison, pas seulement à la première. Avec la livraison offerte, la différence se voit dès les premiers mois.`,
  exampleChecks: (pct, zero) => [`Un prix ${pct} % plus bas sur chaque pot`, `${zero} de frais de livraison`, "Aucun risque de manquer de produit en pleine cure"],
  example: (name) => `Exemple · ${name}`,
  oneTime: "Achat unique",
  perDelivery: (price) => `${price} / livraison`,
  subscriptionLabel: "Abonnement",
  shipping: "Livraison",
  yearly: "Votre économie par an (6 livraisons, tous les 60 jours)",
  exampleNote: "Hors frais de livraison économisés. Votre prix dépend des produits et de la fréquence choisis.",
  benefitsEyebrow: "Avantages",
  benefitsTitle: "Les avantages de l'abonnement",
  benefits: (pct) => [
    [`${pct} % de remise à chaque fois`, "La remise s'applique tant que l'abonnement est actif – pas seulement sur la première commande."],
    ["Livraison toujours offerte", "Aucun frais de livraison sur les commandes d'abonnement, même pour une petite commande."],
    ["Sans engagement", "Résiliez quand vous le souhaitez. Sans frais, sans préavis."],
    ["Pause si besoin", "Vous partez en voyage ou il vous reste un pot ? Demandez à notre service client de mettre votre abonnement en pause. Aucun prélèvement n'est effectué tant que vous ne l'avez pas repris."],
    ["Pas de surprises", "Nous ne modifions jamais le prix d'un abonnement en cours sans vous prévenir à l'avance, et vous pouvez toujours résilier avant que le changement ne s'applique."],
    ["Paiement sécurisé", "Payez en toute sécurité par carte, Klarna, Apple Pay ou Google Pay. Reçu par e-mail à chaque livraison."],
  ],
  popularEyebrow: "Populaires en abonnement",
  popularTitle: "Des extraits que beaucoup utilisent au quotidien",
  faqTitle: "Questions fréquentes",
  faq: [
    { q: "Comment résilier mon abonnement ?", a: "Écrivez à notre service client : nous résilions l'abonnement pour vous et vous le confirmons par écrit. Aucun nouveau prélèvement n'est effectué et l'abonnement prend fin à l'issue de la période déjà payée." },
    { q: "Puis-je modifier la fréquence de livraison ou mon adresse ?", a: "Vous déménagez ou souhaitez changer de fréquence, de quantité ou de produit ? Écrivez à notre service client et nous nous en occupons avant la prochaine livraison." },
    { q: "Puis-je avoir plusieurs produits dans le même abonnement ?", a: "Oui. Si vous ajoutez plusieurs produits avec la même fréquence dans un même achat, ils font partie du même abonnement et arrivent dans le même colis." },
    { q: "Quand le paiement est-il prélevé ?", a: "La première livraison est payée lors de l'achat. Ensuite, le paiement est prélevé automatiquement au début de chaque nouvelle période, tous les 30, 60 ou 90 jours à compter de l'achat. Le colis est expédié quelques jours après le prélèvement et vous recevez un e-mail avec la date de livraison estimée." },
  ],
};
