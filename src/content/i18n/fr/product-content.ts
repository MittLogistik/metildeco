import type { ProductContent } from "@/content/product-content";

/**
 * Contenu des pages produit en français (fr-FR). Traduit depuis src/content/product-content.ts.
 * Aucune allégation de santé – uniquement botanique, origine, extraction, forme et dosage.
 */

const packaging = {
  heading: "Emballage et livraison",
  body:
    "Les gélules sont conditionnées dans un pot en plastique à couvercle vissé qui garde le contenu au sec entre les prises. Chaque commande est expédiée depuis notre entrepôt en Suède.",
};

const noExceed = "Ne pas dépasser la dose journalière recommandée.";
const keepAway = "Tenir hors de portée des jeunes enfants.";
const storeRoomTemp =
  "À conserver au sec, à température ambiante. Bien refermer le pot après chaque utilisation.";
const storeCool = "À conserver dans un endroit frais et sec. Bien refermer le pot après chaque utilisation.";
const cleanNoSweeteners =
  "Végane, sans gluten et sans OGM – sans liants, agents de charge, édulcorants ni conservateurs artificiels.";
const veganFaq = {
  q: "La gélule est-elle végane ?",
  a: "Oui. L'enveloppe de la gélule est d'origine végétale et le produit est sans gluten et sans OGM.",
};
const oneDaily = "1 gélule par jour avec un verre d'eau.";
const lasts60 = {
  q: "Combien de temps dure un pot ?",
  a: "60 gélules à raison d'1 gélule par jour, soit 60 jours.",
};

export const productContent: Record<string, ProductContent> = {
  "tongkat-ali-elite": {
    eyebrow: "Eurycoma longifolia · extrait de racine 200:1",
    headline: "Racine pure, 450 mg par gélule",
    intro:
      "Tongkat Ali Elite est un extrait concentré 200:1 de la racine d'Eurycoma longifolia – aussi appelée Malaysian Ginseng ou Longjack. En gélule végane, sans additifs.",
    highlights: [
      { label: "Extrait", value: "200:1" },
      { label: "Par gélule", value: "450 mg" },
      { label: "Gélules", value: "60" },
    ],
    story: [
      {
        heading: "La racine",
        body:
          "Nous partons de racines d'Eurycoma longifolia soigneusement sélectionnées, une matière première botanique à la longue tradition en Asie du Sud-Est. La racine est séchée, broyée puis concentrée en un extrait 200:1 – 200 parts de racine séchée donnent 1 part d'extrait.",
      },
      {
        heading: "Une composition pure",
        body:
          "Uniquement de l'extrait de racine dans une enveloppe de gélule d'origine végétale. Végane, sans gluten et sans OGM – sans liants, agents de charge, édulcorants ni conservateurs artificiels.",
      },
      packaging,
    ],
    specs: [
      { label: "Nom latin", value: "Eurycoma longifolia" },
      { label: "Partie utilisée", value: "Racine" },
      { label: "Concentration", value: "200:1" },
      { label: "Par gélule", value: "450 mg d'extrait de racine" },
      { label: "Dose journalière", value: "1 gélule par jour" },
      { label: "Contenu", value: "60 gélules – 60 jours" },
      { label: "Gélule", value: "Végane (HPMC)" },
    ],
    ingredients:
      "Extrait de Tongkat Ali (Eurycoma longifolia, racine) 200:1, enveloppe de la gélule (HPMC). Teneur par gélule : extrait de Tongkat Ali (200:1) 450 mg.",
    usage: [oneDaily, noExceed, storeRoomTemp, keepAway],
    faq: [
      {
        q: "Que signifie 200:1 ?",
        a: "Que 200 parts de racine séchée ont été concentrées en 1 part d'extrait. C'est une mesure de concentration, rien de plus.",
      },
      lasts60,
      {
        q: "La gélule est-elle végane ?",
        a: "Oui. L'enveloppe de la gélule est d'origine végétale (HPMC) et le produit est sans gluten et sans OGM.",
      },
      {
        q: "Contient-il des agents de charge ?",
        a: "Non. Uniquement de l'extrait de racine et l'enveloppe de la gélule – sans liants, édulcorants ni conservateurs artificiels.",
      },
    ],
  },

  "tongkat-premium": {
    eyebrow: "Eurycoma longifolia · 200:1, 20 mg d'eurycomanone",
    headline: "Standardisé en eurycomanone",
    intro:
      "Tongkat Ali Ultra 4% est un extrait de racine 200:1 d'Eurycoma longifolia – 520 mg par gélule, dont 20 mg d'eurycomanone. 60 gélules par pot. Ne pas prendre à jeun.",
    highlights: [
      { label: "Extrait", value: "200:1" },
      { label: "Par gélule", value: "520 mg" },
      { label: "Gélules", value: "60" },
    ],
    story: [
      {
        heading: "La racine",
        body:
          "Nous partons de racines d'Eurycoma longifolia soigneusement sélectionnées – aussi appelée Malaysian Ginseng ou Longjack –, une matière première botanique à la longue tradition en Asie du Sud-Est. La racine est concentrée en un extrait 200:1.",
      },
      {
        heading: "20 mg d'eurycomanone par gélule",
        body:
          "Chaque lot est standardisé sur sa teneur en eurycomanone, de sorte que chaque gélule de 520 mg contient 20 mg d'eurycomanone. La concentration reste ainsi constante d'un lot à l'autre. Une gélule par jour.",
      },
      packaging,
    ],
    specs: [
      { label: "Nom latin", value: "Eurycoma longifolia" },
      { label: "Partie utilisée", value: "Racine" },
      { label: "Concentration", value: "200:1, standardisé en eurycomanone" },
      { label: "Par gélule", value: "520 mg d'extrait de racine (20 mg d'eurycomanone)" },
      { label: "Dose journalière", value: "1 gélule par jour" },
      { label: "Contenu", value: "60 gélules – 60 jours" },
      { label: "Conditionnement", value: "Pot en plastique à couvercle vissé" },
      { label: "Gélule", value: "Végane (HPMC)" },
    ],
    ingredients:
      "Extrait de Tongkat Ali (Eurycoma longifolia, racine) 200:1, enveloppe de la gélule (HPMC). Teneur par gélule : extrait de Tongkat Ali (200:1) 520 mg, dont eurycomanone 20 mg.",
    usage: [
      oneDaily,
      "Ne pas prendre à jeun – l'extrait est très concentré.",
      noExceed,
      storeRoomTemp,
      keepAway,
    ],
    faq: [
      {
        q: "Combien d'eurycomanone contient une gélule ?",
        a: "20 mg d'eurycomanone dans 520 mg d'extrait.",
      },
      {
        q: "Quelle différence entre Ultra 4% et Elite ?",
        a: "Elite est un extrait de racine 200:1 de 450 mg par gélule, sans standardisation en eurycomanone. Ultra 4% contient 520 mg par gélule, dont 20 mg d'eurycomanone.",
      },
      lasts60,
      {
        q: "Contient-il des agents de charge ?",
        a: "Non. Uniquement de l'extrait de racine et une enveloppe de gélule végane – sans liants, agents de charge ni conservateurs artificiels.",
      },
    ],
  },

  "fadogia-agrestis": {
    eyebrow: "Fadogia agrestis · extrait de plante 20:1",
    headline: "Plante pure, 450 mg par gélule",
    intro:
      "Un extrait 20:1 de Fadogia agrestis, un arbuste à la longue tradition dans l'herboristerie d'Afrique de l'Ouest. 450 mg par gélule, en gélule végane – sans additifs.",
    highlights: [
      { label: "Extrait", value: "20:1" },
      { label: "Par gélule", value: "450 mg" },
      { label: "Gélules", value: "60" },
    ],
    story: [
      {
        heading: "La plante",
        body:
          "Fadogia agrestis est un arbuste qui pousse dans certaines régions d'Afrique et qui occupe depuis longtemps une place de choix dans les préparations végétales traditionnelles. Nous utilisons des parties de la plante soigneusement sélectionnées, concentrées en un extrait 20:1 – pour une concentration constante dans chaque gélule.",
      },
      {
        heading: "Une composition pure",
        body:
          "Uniquement de l'extrait de Fadogia agrestis dans une enveloppe de gélule d'origine végétale. Végane, sans gluten et sans OGM – sans liants, agents de charge ni conservateurs artificiels.",
      },
      packaging,
    ],
    specs: [
      { label: "Nom latin", value: "Fadogia agrestis" },
      { label: "Concentration", value: "20:1" },
      { label: "Par gélule", value: "450 mg d'extrait" },
      { label: "Dose journalière", value: "1 gélule par jour" },
      { label: "Contenu", value: "60 gélules – 60 jours" },
      { label: "Gélule", value: "Végane (HPMC)" },
    ],
    ingredients:
      "Extrait de Fadogia agrestis 20:1, enveloppe de la gélule (HPMC). Teneur par gélule : extrait de Fadogia agrestis (20:1) 450 mg.",
    usage: [oneDaily, noExceed, storeRoomTemp, keepAway],
    faq: [
      {
        q: "Que signifie 20:1 ?",
        a: "Que 20 parts de matière végétale séchée ont été concentrées en 1 part d'extrait. C'est une mesure de concentration, rien de plus.",
      },
      {
        q: "Puis-je le combiner avec du Tongkat Ali ?",
        a: "Beaucoup le font. Respectez la dose journalière recommandée de chaque produit.",
      },
      lasts60,
      {
        q: "Contient-il des agents de charge ?",
        a: "Non. Uniquement de l'extrait et une enveloppe de gélule végane – sans liants, édulcorants ni conservateurs artificiels.",
      },
    ],
  },

  "blue-lotus": {
    eyebrow: "Nymphaea caerulea · extrait 200:1",
    headline: "La fleur sacrée du Nil, 400 mg par gélule",
    intro:
      "Un extrait concentré 200:1 de Blue Lotus. Une matière première pure, sans additifs, agents de charge ni substances artificielles, en gélule végane.",
    highlights: [
      { label: "Extrait", value: "200:1" },
      { label: "Par gélule", value: "400 mg" },
      { label: "Dose journalière", value: "1–2 gélules" },
    ],
    story: [
      {
        heading: "Sacrée dans l'Égypte ancienne",
        body:
          "Le Blue Lotus (Nymphaea caerulea), le nénuphar bleu, poussait à l'état sauvage sur les rives du Nil dans l'Égypte ancienne. Il y jouissait d'un statut sacré et figurait souvent dans les hiéroglyphes et les peintures des temples.",
      },
      {
        heading: "Extrêmement concentré",
        body:
          "Notre extrait est un concentré 200:1 : 200 parts de fleur séchée ont été concentrées en 1 part d'extrait. Une matière première pure – sans additifs, agents de charge ni substances artificielles.",
      },
      {
        heading: "Tradition et pureté moderne",
        body:
          "Uniquement de l'extrait de fleur dans une enveloppe de gélule végétale en cellulose à base d'algues. Végane et sans additifs superflus.",
      },
    ],
    specs: [
      { label: "Nom latin", value: "Nymphaea caerulea" },
      { label: "Concentration", value: "200:1" },
      { label: "Par gélule", value: "400 mg d'extrait" },
      { label: "Dose journalière", value: "1–2 gélules (400–800 mg)" },
      { label: "Gélule", value: "Végane (HPMC)" },
      { label: "Additifs", value: "Aucun" },
    ],
    ingredients:
      "Extrait de Blue Lotus (Nymphaea caerulea) 200:1, gélule d'origine végétale (HPMC). Teneur par gélule : 400 mg d'extrait de lotus bleu. Pour 2 gélules : 800 mg d'extrait de lotus bleu.",
    usage: [
      "1–2 gélules par jour avec de l'eau.",
      noExceed,
      "Ne convient pas à l'usage ni à l'achat par des personnes de moins de 18 ans.",
      "Demandez conseil à un professionnel de santé si vous êtes enceinte, allaitez ou êtes sous surveillance médicale.",
      "À conserver au sec, à température ambiante, hors de portée des jeunes enfants.",
    ],
    faq: [
      {
        q: "Que signifie 200:1 ?",
        a: "Que 200 parts de fleur séchée ont été concentrées en 1 part d'extrait. C'est une mesure de concentration, rien de plus.",
      },
      {
        q: "Contient-il des additifs ?",
        a: "Non. Uniquement de l'extrait de blue lotus et une enveloppe de gélule d'origine végétale – sans agents de charge ni substances artificielles.",
      },
      {
        q: "Le produit est-il végane ?",
        a: "Oui, l'enveloppe de la gélule est d'origine végétale (cellulose à base d'algues).",
      },
      {
        q: "À quel moment de la journée le prendre ?",
        a: "C'est à vous de choisir. Beaucoup en font un rendez-vous fixe de leur routine du soir.",
      },
    ],
  },

  "black-tongkat": {
    eyebrow: "Eurycoma longifolia · racine sombre, 200:1",
    headline: "La racine sombre – 200:1 en gélule végane",
    intro:
      "Black Tongkat Ali est un extrait de racine 200:1 d'Eurycoma longifolia, la même espèce que notre Tongkat Ali jaune, élaboré à partir de racine sombre. 500 mg par gélule. La dose recommandée est de 1–2 gélules par jour.",
    highlights: [
      { label: "Extrait", value: "200:1" },
      { label: "Par gélule", value: "500 mg" },
      { label: "Dosage", value: "1–2 gélules/jour" },
    ],
    story: [
      {
        heading: "Même espèce, racine plus sombre",
        body:
          "Black Tongkat Ali, c'est Eurycoma longifolia, tout comme la version jaune. La différence tient à la matière première : l'extrait est élaboré à partir de racine sombre. Nous indiquons toujours le nom latin sur le pot, pour que vous sachiez exactement ce que vous achetez.",
      },
      {
        heading: "La racine, concentrée 200:1",
        body:
          "200 parts de racine séchée sont concentrées en une part d'extrait. Seule la racine est utilisée – ni écorce, ni tige, ni feuilles. L'extrait de racine provient d'Asie du Sud-Est, la région d'origine de la plante.",
      },
      {
        heading: "Une gélule pure, un dosage clair",
        body:
          "Chaque gélule contient 500 mg d'extrait dans une enveloppe d'origine végétale (HPMC). Sans agents de charge, sans agents d'écoulement, sans colorants. La dose recommandée est de 1–2 gélules par jour.",
      },
    ],
    specs: [
      { label: "Nom latin", value: "Eurycoma longifolia" },
      { label: "Partie utilisée", value: "Racine" },
      { label: "Concentration", value: "200:1" },
      { label: "Par gélule", value: "500 mg d'extrait" },
      { label: "Dose journalière", value: "1–2 gélules (500–1 000 mg)" },
      { label: "Contenu", value: "60 gélules – 30 à 60 jours" },
      { label: "Enveloppe", value: "Végétale (HPMC)" },
      { label: "Conditionnement", value: "Pot en plastique à couvercle vissé" },
    ],
    ingredients:
      "Extrait de Tongkat Ali (Eurycoma longifolia, racine) 200:1, enveloppe de la gélule (HPMC). Teneur par gélule : extrait de Tongkat Ali (200:1) 500 mg.",
    usage: [
      "1–2 gélules par jour avec un verre d'eau.",
      "À prendre de préférence au cours d'un repas, à la même heure chaque jour.",
      noExceed,
      "À conserver au sec, à température ambiante et hors de portée des jeunes enfants.",
    ],
    faq: [
      {
        q: "Quelle différence avec le Tongkat Ali classique (jaune) ?",
        a: "Les deux sont Eurycoma longifolia. Black Tongkat Ali est élaboré à partir de racine sombre et se dose à 1–2 gélules par jour. Notre Elite jaune contient 450 mg par gélule, à raison d'1 gélule par jour.",
      },
      {
        q: "Que signifie 200:1 ?",
        a: "Que 200 parts de racine séchée ont été concentrées en 1 part d'extrait. C'est une mesure de concentration.",
      },
      {
        q: "Combien de gélules dois-je prendre ?",
        a: "1–2 gélules par jour. Un pot de 60 gélules dure 30 jours à raison de 2 gélules par jour, ou 60 jours à raison d'1 gélule.",
      },
      {
        q: "Contient-il des agents de charge, et est-il végane ?",
        a: "Aucun agent de charge. La gélule contient de l'extrait de racine et une enveloppe végétale en HPMC, ce qui la rend végane.",
      },
    ],
  },

  ashwagandha: {
    eyebrow: "Withania somnifera · 10 % de withanolides",
    headline: "Ashwagandha, 400 mg par gélule",
    intro:
      "Un extrait de racine standardisé de Withania somnifera à 10 % de withanolides – 400 mg par gélule. 60 gélules à enveloppe végane, sans additifs.",
    highlights: [
      { label: "Standardisation", value: "10 % de withanolides" },
      { label: "Par gélule", value: "400 mg" },
      { label: "Gélules", value: "60" },
    ],
    story: [
      {
        heading: "La racine, pas la plante entière",
        body:
          "L'ashwagandha, aussi appelée ginseng indien, a une longue tradition dans l'herboristerie ayurvédique. Notre extrait provient exclusivement de la racine. Les variantes moins chères sont souvent obtenues en broyant la plante entière, feuilles et tiges comprises, ce qui donne une composition tout à fait différente.",
      },
      {
        heading: "Standardisé à 10 %",
        body:
          "Les withanolides sont les substances que l'on mesure dans un extrait d'ashwagandha. Le nôtre est standardisé à 10 %. 400 mg d'extrait correspondent à 40 mg de withanolides dans chaque gélule.",
      },
      {
        heading: "Une composition pure",
        body:
          "Uniquement l'extrait et une enveloppe de gélule d'origine végétale. Sans liants, agents de charge ni antiagglomérants, et rien d'ajouté pour diluer le contenu.",
      },
    ],
    specs: [
      { label: "Nom latin", value: "Withania somnifera" },
      { label: "Partie de la plante", value: "Racine" },
      { label: "Standardisation", value: "10 % de withanolides" },
      { label: "Par gélule", value: "400 mg d'extrait, dont 40 mg de withanolides" },
      { label: "Dose journalière", value: "2–3 gélules par jour" },
      { label: "Conditionnement", value: "60 gélules" },
      { label: "Gélule", value: "Végane (HPMC)" },
    ],
    ingredients:
      "Extrait d'ashwagandha (Withania somnifera, racine) standardisé à 10 % de withanolides, enveloppe de la gélule (végétale, HPMC). Teneur par gélule : extrait d'ashwagandha 400 mg, dont withanolides 40 mg.",
    usage: ["2–3 gélules par jour avec un verre d'eau.", noExceed, storeCool, keepAway],
    faq: [
      {
        q: "Que signifie 10 % de withanolides ?",
        a: "Que l'extrait est standardisé de sorte que 10 % soient des withanolides. Dans 400 mg d'extrait, cela correspond à 40 mg.",
      },
      {
        q: "Quelle partie de la plante est utilisée ?",
        a: "Uniquement la racine. Les feuilles et les tiges ne sont pas utilisées.",
      },
      {
        q: "La gélule est-elle végane ?",
        a: "Oui. L'enveloppe de la gélule est d'origine végétale (HPMC).",
      },
      {
        q: "Combien de gélules contient le pot ?",
        a: "60 gélules.",
      },
    ],
  },

  maca: {
    eyebrow: "Lepidium meyenii · extrait de racine 20:1",
    headline: "Racine de maca, 470 mg par gélule",
    intro:
      "La maca est un extrait concentré 20:1 de la racine de Lepidium meyenii – un tubercule à la longue tradition dans les Andes. 60 gélules, enveloppe végane sans additifs.",
    highlights: [
      { label: "Extrait", value: "20:1" },
      { label: "Par gélule", value: "470 mg" },
      { label: "Gélules", value: "60" },
    ],
    story: [
      {
        heading: "La racine",
        body:
          "La maca (Lepidium meyenii) est cultivée à haute altitude dans les Andes et fait partie de la tradition végétale péruvienne depuis des générations. La racine est séchée, broyée puis concentrée en un extrait standardisé 20:1 – 20 parts de racine séchée donnent 1 part d'extrait.",
      },
      {
        heading: "Une composition pure",
        body: `Uniquement de l'extrait de racine de maca dans une enveloppe de gélule d'origine végétale. ${cleanNoSweeteners}`,
      },
      packaging,
    ],
    specs: [
      { label: "Nom latin", value: "Lepidium meyenii" },
      { label: "Partie utilisée", value: "Racine" },
      { label: "Concentration", value: "20:1" },
      { label: "Par gélule", value: "470 mg d'extrait de racine" },
      { label: "Dose journalière", value: "2 gélules par jour" },
      { label: "Contenu", value: "60 gélules – 30 jours" },
      { label: "Gélule", value: "Végane (HPMC)" },
    ],
    ingredients:
      "Extrait de maca (Lepidium meyenii, racine) 20:1, enveloppe de la gélule (HPMC). Teneur par gélule : extrait de racine de maca (20:1) 470 mg.",
    usage: ["2 gélules par jour avec un verre d'eau.", noExceed, storeCool, keepAway],
    faq: [
      {
        q: "Que signifie 20:1 ?",
        a: "Que 20 parts de racine de maca séchée ont été concentrées en 1 part d'extrait. C'est une mesure de concentration, rien de plus.",
      },
      {
        q: "Combien de temps dure un pot ?",
        a: "60 gélules à raison de 2 gélules par jour, soit 30 jours.",
      },
      veganFaq,
      {
        q: "Contient-il des agents de charge ?",
        a: "Non. Uniquement de l'extrait de racine et l'enveloppe de la gélule – sans liants, édulcorants ni conservateurs artificiels.",
      },
    ],
  },

  mariatistel: {
    eyebrow: "Silybum marianum · 20:1, 80 % de silymarine",
    headline: "Chardon-Marie, 350 mg par gélule",
    intro:
      "Le chardon-Marie est un extrait 20:1 de Silybum marianum standardisé à 80 % de silymarine – 350 mg par gélule. 60 gélules à enveloppe végane, sans additifs.",
    highlights: [
      { label: "Extrait", value: "20:1 · 80 %" },
      { label: "Par gélule", value: "350 mg" },
      { label: "Gélules", value: "60" },
    ],
    story: [
      {
        heading: "La plante",
        body:
          "Le chardon-Marie (Silybum marianum) est un chardon originaire du bassin méditerranéen, à la longue tradition dans l'herboristerie européenne. Les graines sont séchées puis extraites en un concentré standardisé à 80 % de silymarine – un complexe de flavonoïdes qui contient notamment de l'isosilybine (env. 2,5 %), de la silychristine (env. 10 %) et de la silydianine (env. 7,5 %).",
      },
      {
        heading: "Une composition pure",
        body:
          "Uniquement de l'extrait de chardon-Marie dans une enveloppe de gélule végétale en pullulane. Végane, sans gluten et sans OGM – sans lactose, soja, levure, blé ni lait, et sans colorants, liants, agents de charge ni conservateurs artificiels.",
      },
      packaging,
    ],
    specs: [
      { label: "Nom latin", value: "Silybum marianum" },
      { label: "Partie utilisée", value: "Graine" },
      { label: "Concentration", value: "20:1" },
      { label: "Standardisation", value: "80 % de silymarine" },
      { label: "Par gélule", value: "350 mg d'extrait" },
      { label: "Dose journalière", value: "1 gélule par jour" },
      { label: "Contenu", value: "60 gélules – 60 jours" },
      { label: "Gélule", value: "Végane (pullulane)" },
    ],
    ingredients:
      "Extrait de chardon-Marie (Silybum marianum, graine) 20:1 standardisé à 80 % de silymarine, enveloppe de la gélule (pullulane). Teneur par gélule : extrait de chardon-Marie 350 mg, dont silymarine 280 mg.",
    usage: [oneDaily, noExceed, storeCool, keepAway],
    faq: [
      {
        q: "Que signifie 80 % de silymarine ?",
        a: "Que l'extrait est standardisé de sorte que 80 % soient constitués du complexe de flavonoïdes silymarine. Dans 350 mg d'extrait, cela correspond à 280 mg de silymarine.",
      },
      {
        q: "Quelle partie de la plante est utilisée ?",
        a: "Les graines du chardon-Marie, séchées puis extraites en un concentré 20:1.",
      },
      {
        q: "La gélule est-elle végane ?",
        a: "Oui. L'enveloppe de la gélule est en pullulane d'origine végétale et le produit est sans gluten et sans OGM.",
      },
      lasts60,
    ],
  },

  nasselblad: {
    eyebrow: "Urtica dioica · extrait de feuille 10:1",
    headline: "Feuille d'ortie, 430 mg par gélule",
    intro:
      "La feuille d'ortie est un extrait 10:1 des feuilles d'Urtica dioica – 430 mg par gélule. 60 gélules à enveloppe végane, sans additifs.",
    highlights: [
      { label: "Extrait", value: "10:1" },
      { label: "Par gélule", value: "430 mg" },
      { label: "Gélules", value: "60" },
    ],
    story: [
      {
        heading: "La feuille",
        body:
          "La grande ortie (Urtica dioica) est utilisée depuis des siècles dans la tradition végétale européenne. Nous utilisons les feuilles, séchées puis concentrées en un extrait 10:1 – 10 parts de feuille séchée donnent 1 part d'extrait.",
      },
      {
        heading: "Une composition pure",
        body: `Uniquement de l'extrait de feuille d'ortie dans une enveloppe de gélule d'origine végétale. ${cleanNoSweeteners}`,
      },
      packaging,
    ],
    specs: [
      { label: "Nom latin", value: "Urtica dioica" },
      { label: "Partie utilisée", value: "Feuille" },
      { label: "Concentration", value: "10:1" },
      { label: "Par gélule", value: "430 mg d'extrait" },
      { label: "Dose journalière", value: "1 gélule par jour" },
      { label: "Contenu", value: "60 gélules – 60 jours" },
      { label: "Gélule", value: "Végane" },
    ],
    ingredients:
      "Extrait de feuille d'ortie (Urtica dioica, feuille) 10:1, enveloppe de la gélule (végétale). Teneur par gélule : extrait de feuille d'ortie 430 mg.",
    usage: [oneDaily, noExceed, storeCool, keepAway],
    faq: [
      {
        q: "Que signifie 10:1 ?",
        a: "Que 10 parts de feuille d'ortie séchée ont été concentrées en 1 part d'extrait. C'est une mesure de concentration, rien de plus.",
      },
      {
        q: "Quelle partie de la plante est utilisée ?",
        a: "Les feuilles de la grande ortie, séchées puis extraites en un concentré 10:1.",
      },
      veganFaq,
      lasts60,
    ],
  },

  druvkarneextrakt: {
    eyebrow: "Vitis vinifera · 95 % d'OPC",
    headline: "Extrait de pépins de raisin, 500 mg par gélule",
    intro:
      "L'extrait de pépins de raisin est un extrait des pépins de Vitis vinifera standardisé à 95 % de proanthocyanidines (OPC) – 500 mg par gélule. 60 gélules à enveloppe végane, sans additifs.",
    highlights: [
      { label: "Standardisation", value: "95 % d'OPC" },
      { label: "Par gélule", value: "500 mg" },
      { label: "Gélules", value: "60" },
    ],
    story: [
      {
        heading: "Le pépin",
        body:
          "La vigne (Vitis vinifera) est cultivée en Europe depuis des temps immémoriaux. Nous utilisons les pépins, source naturelle de polyphénols, et les extrayons en un concentré standardisé à 95 % de proanthocyanidines – aussi appelées OPC.",
      },
      {
        heading: "Une composition pure",
        body: `Uniquement de l'extrait de pépins de raisin dans une enveloppe de gélule d'origine végétale. ${cleanNoSweeteners}`,
      },
      packaging,
    ],
    specs: [
      { label: "Nom latin", value: "Vitis vinifera" },
      { label: "Partie utilisée", value: "Pépin" },
      { label: "Standardisation", value: "95 % de proanthocyanidines (OPC)" },
      { label: "Par gélule", value: "500 mg d'extrait" },
      { label: "Dose journalière", value: "1–2 gélules par jour" },
      { label: "Contenu", value: "60 gélules – 30–60 jours" },
      { label: "Gélule", value: "Végane" },
    ],
    ingredients:
      "Extrait de pépins de raisin (Vitis vinifera, pépin) standardisé à 95 % de proanthocyanidines, enveloppe de la gélule (végétale). Teneur par gélule : extrait de pépins de raisin 500 mg, dont proanthocyanidines 475 mg.",
    usage: ["1–2 gélules par jour avec un verre d'eau.", noExceed, storeCool, keepAway],
    faq: [
      {
        q: "Que signifie 95 % d'OPC ?",
        a: "Que l'extrait est standardisé de sorte que 95 % soient des proanthocyanidines. Dans 500 mg d'extrait, cela correspond à 475 mg.",
      },
      {
        q: "Quelle partie de la plante est utilisée ?",
        a: "Les pépins du raisin, extraits puis standardisés en polyphénols.",
      },
      veganFaq,
      {
        q: "Combien de temps dure un pot ?",
        a: "60 gélules durent 30 jours à raison de 2 gélules par jour et 60 jours à raison d'1 gélule par jour.",
      },
    ],
  },

  quercetin: {
    eyebrow: "Quercétine · pureté 98 %",
    headline: "Quercétine, 500 mg par gélule",
    intro:
      "La quercétine est un flavonoïde présent naturellement dans les fruits et les légumes. Notre extrait affiche une pureté de 98 % – 500 mg par gélule. 60 gélules à enveloppe végane, sans additifs.",
    highlights: [
      { label: "Pureté", value: "98 %" },
      { label: "Par gélule", value: "500 mg" },
      { label: "Gélules", value: "60" },
    ],
    story: [
      {
        heading: "La substance",
        body:
          "La quercétine est un flavonoïde d'origine végétale que l'on trouve notamment dans l'oignon, la pomme et les baies. Nous choisissons un extrait de haute pureté – 98 % – pour que chaque gélule ait la même teneur, lot après lot.",
      },
      {
        heading: "Une composition pure",
        body: `Uniquement de l'extrait de quercétine dans une enveloppe de gélule d'origine végétale. ${cleanNoSweeteners}`,
      },
      packaging,
    ],
    specs: [
      { label: "Contenu", value: "Extrait de quercétine" },
      { label: "Pureté", value: "98 % de quercétine" },
      { label: "Par gélule", value: "500 mg" },
      { label: "Dose journalière", value: "1 gélule par jour" },
      { label: "Conditionnement", value: "60 gélules – 60 jours" },
      { label: "Gélule", value: "Végane" },
    ],
    ingredients:
      "Extrait de quercétine (98 % de quercétine), enveloppe de la gélule (végétale). Teneur par gélule : extrait de quercétine 500 mg, dont quercétine 490 mg.",
    usage: [oneDaily, noExceed, storeCool, keepAway],
    faq: [
      {
        q: "Que signifie une pureté de 98 % ?",
        a: "Que 98 % de l'extrait est constitué de quercétine. Dans 500 mg d'extrait, cela correspond à 490 mg de quercétine.",
      },
      {
        q: "D'où vient la quercétine ?",
        a: "La quercétine est un flavonoïde présent naturellement dans les fruits, les légumes et les plantes.",
      },
      veganFaq,
      lasts60,
    ],
  },

  reishi: {
    eyebrow: "Ganoderma lucidum · 40 % de polysaccharides",
    headline: "Reishi, 350 mg par gélule",
    intro:
      "Le reishi (Ganoderma lucidum) en extrait de champignon standardisé à 40 % de polysaccharides – 350 mg par gélule. 60 gélules à enveloppe végane, sans additifs.",
    highlights: [
      { label: "Standardisation", value: "40 % de polysaccharides" },
      { label: "Par gélule", value: "350 mg" },
      { label: "Gélules", value: "60" },
    ],
    story: [
      {
        heading: "Le champignon",
        body:
          "Le reishi, Ganoderma lucidum, est utilisé depuis des siècles dans la culture végétale traditionnelle. Notre extrait est concentré et standardisé à 40 % de polysaccharides, pour une teneur identique dans chaque gélule.",
      },
      {
        heading: "Une composition pure",
        body: `Uniquement de l'extrait de reishi dans une enveloppe de gélule d'origine végétale. ${cleanNoSweeteners}`,
      },
      packaging,
    ],
    specs: [
      { label: "Nom latin", value: "Ganoderma lucidum" },
      { label: "Standardisation", value: "40 % de polysaccharides" },
      { label: "Par gélule", value: "350 mg" },
      { label: "Dose journalière", value: "1 gélule par jour" },
      { label: "Conditionnement", value: "60 gélules – 60 jours" },
      { label: "Gélule", value: "Végane" },
    ],
    ingredients:
      "Extrait de reishi (Ganoderma lucidum) standardisé à 40 % de polysaccharides, enveloppe de la gélule (végétale). Teneur par gélule : extrait de reishi 350 mg, dont polysaccharides 140 mg.",
    usage: [oneDaily, noExceed, storeCool, keepAway],
    faq: [
      {
        q: "Que signifie 40 % de polysaccharides ?",
        a: "Que l'extrait est standardisé de sorte que 40 % soient des polysaccharides. Dans 350 mg d'extrait, cela correspond à 140 mg.",
      },
      {
        q: "Quel champignon est utilisé ?",
        a: "Ganoderma lucidum, communément appelé reishi.",
      },
      veganFaq,
      lasts60,
    ],
  },

  chaga: {
    eyebrow: "Inonotus obliquus · extrait 30:1",
    headline: "Chaga, 400 mg par gélule",
    intro:
      "Le chaga (Inonotus obliquus) en extrait 30:1 standardisé à 10 % de polysaccharides – 400 mg par gélule. 60 gélules à enveloppe végane, sans additifs.",
    highlights: [
      { label: "Extrait", value: "30:1" },
      { label: "Par gélule", value: "400 mg" },
      { label: "Gélules", value: "60" },
    ],
    story: [
      {
        heading: "Le champignon",
        body:
          "Le chaga pousse lentement sur le bouleau et puise ses nutriments dans l'arbre pendant de nombreuses années. Notre extrait provient de chaga sauvage de haute qualité, concentré 30:1 et standardisé à 10 % de polysaccharides.",
      },
      {
        heading: "Une composition pure",
        body: `Uniquement de l'extrait de chaga dans une enveloppe de gélule d'origine végétale. ${cleanNoSweeteners}`,
      },
      packaging,
    ],
    specs: [
      { label: "Nom latin", value: "Inonotus obliquus" },
      { label: "Extrait", value: "30:1" },
      { label: "Standardisation", value: "10 % de polysaccharides" },
      { label: "Par gélule", value: "400 mg" },
      { label: "Dose journalière", value: "1 gélule par jour" },
      { label: "Conditionnement", value: "60 gélules – 60 jours" },
      { label: "Gélule", value: "Végane" },
    ],
    ingredients:
      "Extrait de chaga (Inonotus obliquus) 30:1 standardisé à 10 % de polysaccharides, enveloppe de la gélule (végétale). Teneur par gélule : extrait de chaga 400 mg, dont polysaccharides 40 mg.",
    usage: [oneDaily, noExceed, storeCool, keepAway],
    faq: [
      {
        q: "Que signifie 30:1 ?",
        a: "Que 30 parts de matière première ont été concentrées en 1 part d'extrait. 400 mg d'extrait correspondent à environ 12 g de chaga séché.",
      },
      {
        q: "Que veut dire 10 % de polysaccharides ?",
        a: "Que l'extrait est standardisé de sorte que 10 % soient des polysaccharides – 40 mg par gélule.",
      },
      veganFaq,
      lasts60,
    ],
  },

  "lions-mane": {
    eyebrow: "Hericium erinaceus · 60 % de polysaccharides",
    headline: "Lion's Mane, 500 mg par gélule",
    intro:
      "Le Lion's Mane (Hericium erinaceus) en extrait de champignon standardisé à 60 % de polysaccharides, dont 45 % de bêta-glucanes – 500 mg par gélule. 60 gélules à enveloppe végane, sans additifs.",
    highlights: [
      { label: "Standardisation", value: "60 % de polysaccharides" },
      { label: "Par gélule", value: "500 mg" },
      { label: "Gélules", value: "60" },
    ],
    story: [
      {
        heading: "Le champignon",
        body:
          "Le Lion's Mane, Hericium erinaceus, a une longue histoire dans la culture végétale traditionnelle d'Asie de l'Est. Notre extrait est concentré et standardisé à 60 % de polysaccharides, dont 45 % de bêta-glucanes, pour une teneur identique dans chaque gélule.",
      },
      {
        heading: "Une composition pure",
        body: `Uniquement de l'extrait de Lion's Mane dans une enveloppe de gélule d'origine végétale. ${cleanNoSweeteners}`,
      },
      packaging,
    ],
    specs: [
      { label: "Nom latin", value: "Hericium erinaceus" },
      { label: "Standardisation", value: "60 % de polysaccharides" },
      { label: "Dont bêta-glucanes", value: "45 %" },
      { label: "Par gélule", value: "500 mg" },
      { label: "Dose journalière", value: "1 gélule par jour" },
      { label: "Conditionnement", value: "60 gélules – 60 jours" },
      { label: "Gélule", value: "Végane" },
    ],
    ingredients:
      "Extrait de Lion's Mane (Hericium erinaceus) standardisé à 60 % de polysaccharides, dont 45 % de bêta-glucanes, enveloppe de la gélule (végétale). Teneur par gélule : extrait 500 mg, dont polysaccharides 300 mg et bêta-glucanes 225 mg.",
    usage: [oneDaily, noExceed, storeCool, keepAway],
    faq: [
      {
        q: "Que signifie 60 % de polysaccharides ?",
        a: "Que l'extrait est standardisé de sorte que 60 % soient des polysaccharides. Dans 500 mg d'extrait, cela correspond à 300 mg.",
      },
      {
        q: "Que sont les bêta-glucanes ?",
        a: "Un groupe spécifique de polysaccharides. Dans notre extrait, ils représentent 45 %, soit 225 mg par gélule.",
      },
      veganFaq,
      lasts60,
    ],
  },

  cordyceps: {
    eyebrow: "Cordyceps militaris · extrait 8:1",
    headline: "Cordyceps, 350 mg par gélule",
    intro:
      "Le cordyceps (Cordyceps militaris) en extrait 8:1 standardisé à 40 % de polysaccharides – 350 mg par gélule. 60 gélules à enveloppe végane, sans additifs.",
    highlights: [
      { label: "Extrait", value: "8:1" },
      { label: "Par gélule", value: "350 mg" },
      { label: "Gélules", value: "60" },
    ],
    story: [
      {
        heading: "Le champignon",
        body:
          "Le cordyceps occupe depuis longtemps une place dans la culture végétale d'Asie de l'Est. Notre extrait provient de Cordyceps militaris soigneusement sélectionné, concentré 8:1 et standardisé à 40 % de polysaccharides, pour une teneur identique dans chaque gélule.",
      },
      {
        heading: "Une composition pure",
        body: `Uniquement de l'extrait de cordyceps dans une enveloppe de gélule d'origine végétale. ${cleanNoSweeteners}`,
      },
      packaging,
    ],
    specs: [
      { label: "Nom latin", value: "Cordyceps militaris" },
      { label: "Extrait", value: "8:1" },
      { label: "Standardisation", value: "40 % de polysaccharides" },
      { label: "Par gélule", value: "350 mg" },
      { label: "Dose journalière", value: "1 gélule par jour" },
      { label: "Conditionnement", value: "60 gélules – 60 jours" },
      { label: "Gélule", value: "Végane" },
    ],
    ingredients:
      "Extrait de cordyceps (Cordyceps militaris) 8:1 standardisé à 40 % de polysaccharides, enveloppe de la gélule (végétale). Teneur par gélule : extrait de cordyceps 350 mg, dont polysaccharides 140 mg.",
    usage: [oneDaily, noExceed, storeCool, keepAway],
    faq: [
      {
        q: "Que signifie 8:1 ?",
        a: "Que 8 parts de matière première ont été concentrées en 1 part d'extrait. 350 mg d'extrait correspondent à environ 2,8 g de cordyceps séché.",
      },
      {
        q: "Que veut dire 40 % de polysaccharides ?",
        a: "Que l'extrait est standardisé de sorte que 40 % soient des polysaccharides – 140 mg par gélule.",
      },
      veganFaq,
      lasts60,
    ],
  },

  "pine-pollen": {
    eyebrow: "Pollen de pin · extrait pur à 99 %",
    headline: "Pine Pollen, 300 mg par gélule",
    intro:
      "Du pollen de pin en extrait pur à 99 %, aux parois cellulaires éclatées – 300 mg par gélule. 60 gélules à enveloppe végane, sans additifs.",
    highlights: [
      { label: "Pureté", value: "99 %" },
      { label: "Par gélule", value: "300 mg" },
      { label: "Gélules", value: "60" },
    ],
    story: [
      {
        heading: "La poussière jaune du printemps",
        body:
          "Pendant quelques semaines au printemps, le pin libère son pollen, une fine poussière jaune qui se dépose sur le sol et l'eau. La récolte a lieu pendant cette courte période où le pollen est présent ; la matière première est donc saisonnière.",
      },
      {
        heading: "Parois cellulaires éclatées",
        body:
          "Un grain de pollen possède une enveloppe extérieure dure. Dans notre extrait, les parois cellulaires sont éclatées : c'est l'étape qui rend le contenu du grain accessible, au lieu qu'il passe intact.",
      },
      {
        heading: "Une composition pure",
        body:
          "Un extrait de pollen pur à 99 % et une enveloppe de gélule d'origine végétale. Sans liants, agents de charge ni antiagglomérants.",
      },
    ],
    specs: [
      { label: "Matière première", value: "Pollen de pin" },
      { label: "Pureté", value: "99 %" },
      { label: "Traitement", value: "Parois cellulaires éclatées" },
      { label: "Par gélule", value: "300 mg" },
      { label: "Dose journalière", value: "1–3 gélules par jour" },
      { label: "Conditionnement", value: "60 gélules" },
      { label: "Gélule", value: "Végane (HPMC)" },
    ],
    ingredients:
      "Extrait de pollen de pin (pur à 99 %, parois cellulaires éclatées), enveloppe de la gélule (végétale, HPMC). Teneur par gélule : extrait de pollen 300 mg.",
    usage: ["1–3 gélules par jour avec un verre d'eau.", noExceed, storeCool, keepAway],
    faq: [
      {
        q: "Que signifient des parois cellulaires éclatées ?",
        a: "L'enveloppe extérieure du grain de pollen a été ouverte lors du traitement, de sorte que son contenu devient accessible au lieu de passer intact.",
      },
      {
        q: "Quand le pollen est-il récolté ?",
        a: "Pendant la courte période du printemps où le pin libère son pollen.",
      },
      {
        q: "La gélule est-elle végane ?",
        a: "Oui. L'enveloppe de la gélule est d'origine végétale (HPMC).",
      },
      {
        q: "Combien de gélules contient le pot ?",
        a: "60 gélules.",
      },
    ],
  },
};
