import type { InfoMessages } from "../../info";

export const messages: InfoMessages = {
  shippingTable: {
    destination: "Destination",
    method: "Mode de livraison",
    time: "Délai de livraison",
    cost: "Coût",
    days: (from, to) => `${from}–${to} jours ouvrés`,
    freeOver: (price, freeOver) => `${price} – livraison offerte dès ${freeOver}`,
  },
  /** Företagsuppgifterna (blocket companyInfo) och platshållarna i sidtexterna. */
  company: {
    legalEntity: "Entité juridique",
    orgNumber: "Numéro d'immatriculation",
    vatId: "Numéro de TVA intracommunautaire",
    address: "Adresse",
    email: "E-mail",
    phone: "Téléphone",
    hours: "lun.–ven. 9 h–17 h (heure suédoise)",
    /** Landsnamnet för Sverige i adresser. */
    sweden: "Suède",
  },
  faq: {
    metaTitle: "Questions fréquentes",
    metaDescription: "Réponses aux questions les plus fréquentes sur la commande, le paiement, la livraison, les retours, l'abonnement et nos produits.",
    title: "Questions fréquentes",
    eyebrow: "Service client",
    intro: "Vous trouverez ici les réponses aux questions les plus fréquentes sur les commandes, la livraison, les abonnements et nos produits.",
    categories: "Catégories",
    moreTitle: "Vous n'avez pas trouvé de réponse ?",
    moreBefore: "Notre service client répond en semaine de 9 h à 17 h (heure suédoise) et revient normalement vers vous sous un jour ouvré. Écrivez à",
    moreOr: "ou appelez le",
    languages: "Notre service client répond en suédois et en anglais.",
    contact: "Nous contacter",
    trackOrder: "Suivre votre commande",
  },
  contact: {
    metaTitle: "Nous contacter",
    metaDescription: "Une question sur votre commande, un produit ou votre abonnement ? Le service client de Metilde répond sous 1 à 2 jours ouvrés.",
    title: "Nous contacter",
    eyebrow: "Service client",
    intro: "Nous répondons normalement sous 1 à 2 jours ouvrés. S'il s'agit d'une commande en cours, indiquez votre numéro de commande : c'est le plus rapide.",
    /** Visas bara på språk där kundservice inte svarar på sidans språk. */
    languages: "Notre service client répond en suédois et en anglais.",
    formTitle: "Envoyer un message",
    otherWays: "Autres moyens de nous joindre",
    email: "E-mail",
    phone: "Téléphone",
    swedishTime: "heure suédoise",
    companyInfo: "Informations sur la société",
    trackTitle: "Vous voulez simplement savoir où est votre colis ?",
    trackText: "Suivez votre livraison directement avec votre numéro de commande et votre e-mail.",
    trackLink: "Suivre votre commande",
    faqTitle: "Réponses rapides",
    faqText: "De nombreuses questions sur la livraison, les retours et l'abonnement trouvent déjà leur réponse dans nos questions fréquentes.",
    faqLink: "Voir les questions fréquentes",
  },
  story: {
    metaTitle: "Notre histoire – les débuts de Metilde",
    metaDescription:
      "Metilde est né d'une frustration toute simple : trop peu de compléments alimentaires purs et sans complications. Découvrez comment la marque a été fondée et pourquoi l'abonnement s'est imposé comme une évidence.",
    title: "Notre histoire",
    eyebrow: "À propos de Metilde",
    intro:
      "Metilde est né d'une frustration que beaucoup connaissent : pourquoi est-il si difficile de trouver des compléments alimentaires purs et sans complications ? C'est cette question qui a poussé Matilda à tout mettre de côté pour construire la marque de A à Z.",
    sections: [
      {
        title: "Il manquait quelque chose dans les rayons",
        body: [
          "Matilda utilisait des compléments alimentaires depuis longtemps, mais plus elle se renseignait, plus elle était frustrée. De nombreux produits étaient remplis d'agents de charge, d'édulcorants et d'ingrédients qui n'apportaient rien. Et les prix étaient souvent élevés pour des produits qui ne contenaient même pas ce qu'ils promettaient.",
          "Les marques qui parlaient de santé et de bien-être ne manquaient pas, mais rares étaient celles qui expliquaient pourquoi le produit valait vraiment son prix. C'est là que l'idée de Metilde a commencé à germer : une marque qui mise sur la pureté et la transparence, où le client obtient ce pour quoi il paie, et rien d'autre.",
        ],
      },
      {
        title: "Un abonnement qui devrait mieux fonctionner",
        body: [
          "Autre source d'agacement : il n'existait presque aucun moyen de s'abonner à des compléments alimentaires. Ce qui existait, c'était soit des abonnements compliqués avec préavis de résiliation, soit des solutions où il fallait penser soi-même à commander.",
          "Metilde a donc conçu un abonnement vraiment honnête : un prix 15 % plus bas, la livraison offerte et la possibilité de mettre en pause, de modifier ou de résilier à tout moment. Sans engagement, sans frais cachés.",
        ],
      },
      {
        title: "De Matilda à Metilde",
        body: [
          "Quand il a fallu choisir un nom, la première option s'imposait. Tous les noms de domaine avec « Matilda » étaient déjà pris, alors ce fut quelque chose de proche – un peu plus simple, un peu plus épuré. Metilde.com était disponible, et le nom a tout de suite semblé juste.",
        ],
      },
      {
        title: "Prochaine étape : élargir la gamme",
        body: [
          "Nous n'allons pas ajouter de nouveaux produits simplement parce que cela fait bien. Chaque extrait doit avoir sa place parce qu'il répond à un objectif, qu'il est d'une réelle qualité et qu'il satisfait aux mêmes exigences que celles que nous nous sommes fixées dès le premier jour.",
        ],
      },
    ],
    valuesEyebrow: "Valeurs",
    valuesTitle: "Ce que nous défendons",
    values: [
      ["Sans complications", "Nous indiquons exactement ce que contient chaque produit. Pas de superflu, pas d'additifs cachés."],
      ["Vous obtenez ce que vous payez", "Matières premières, gélules, emballage. C'est là que va notre argent – pas dans de coûteuses campagnes publicitaires."],
      ["Un vrai abonnement", "15 % de remise, livraison offerte et contrôle total. Mettez en pause, modifiez ou résiliez quand vous le souhaitez."],
      ["Expédié depuis la Suède", "Chaque commande est expédiée depuis notre entrepôt en Suède."],
    ],
    companyEyebrow: "L'entreprise",
    companyTitle: "À propos de l'entreprise",
    companyIntro: (legalName) =>
      `Metilde est exploité par ${legalName}. Vous trouverez ici toutes nos informations légales – nous voulons que vous sachiez toujours à qui vous achetez.`,
    legalName: "Raison sociale",
    customerService: "Service client",
    ctaTitle: "Ce n'est que le début",
    ctaText:
      "Metilde est une jeune marque, mais l'ambition est claire : élargir la gamme et devenir un acteur majeur du marché des compléments alimentaires botaniques purs. Pour y parvenir, nous restons honnêtes, maintenons une qualité élevée et écoutons nos clients.",
    ctaProducts: "Découvrir les produits",
    ctaSubscription: "En savoir plus sur l'abonnement",
  },
};
