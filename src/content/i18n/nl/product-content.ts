import type { ProductContent } from "@/content/product-content";

/**
 * Inhoud van de productpagina's in het Nederlands (nl-NL). Vertaald uit src/content/product-content.ts.
 * Geen gezondheidsclaims – alleen botanie, herkomst, extractie, vorm en dosering.
 */

const developedInSweden = {
  heading: "Ontwikkeld in Zweden",
  body:
    "Metilde is een Zweeds merk. Het assortiment wordt hier ontwikkeld en elke bestelling wordt verzonden vanuit ons magazijn in Timrå, Zweden. De verpakking is een plastic pot met schroefdeksel die de inhoud droog houdt tussen de doses door.",
};

const noExceed = "De aanbevolen dagelijkse dosis niet overschrijden.";
const keepAway = "Buiten bereik van jonge kinderen bewaren.";
const storeRoomTemp = "Droog bewaren op kamertemperatuur. Sluit de pot na elk gebruik goed af.";
const storeCool = "Koel en droog bewaren. Sluit de pot na elk gebruik goed af.";
const cleanNoSweeteners =
  "Vegan, glutenvrij en zonder ggo – geen bindmiddelen, vulstoffen, zoetstoffen of kunstmatige conserveermiddelen.";
const veganFaq = {
  q: "Is de capsule vegan?",
  a: "Ja. De capsulewand is plantaardig en het product is glutenvrij en zonder ggo.",
};
const oneDaily = "1 capsule per dag met een glas water.";
const lasts60 = { q: "Hoe lang doe je met een pot?", a: "60 capsules zijn genoeg voor 60 dagen bij 1 capsule per dag." };

export const productContent: Record<string, ProductContent> = {
  "tongkat-ali-elite": {
    eyebrow: "Eurycoma longifolia · 200:1 wortelextract",
    headline: "Pure wortel, 450 mg per capsule",
    intro:
      "Tongkat Ali Elite is een geconcentreerd 200:1-extract van de wortel van Eurycoma longifolia – ook bekend als Malaysian Ginseng of Longjack. Ontwikkeld in Zweden, in een vegan capsule, zonder toevoegingen.",
    highlights: [
      { label: "Extract", value: "200:1" },
      { label: "Per capsule", value: "450 mg" },
      { label: "Capsules", value: "60 stuks" },
    ],
    story: [
      {
        heading: "De wortel",
        body:
          "We gaan uit van zorgvuldig geselecteerde wortels van Eurycoma longifolia, een botanische grondstof met een lange traditie in Zuidoost-Azië. De wortel wordt gedroogd, gemalen en geconcentreerd tot een 200:1-extract – 200 delen gedroogde wortel worden 1 deel extract.",
      },
      {
        heading: "Pure samenstelling",
        body:
          "Alleen wortelextract in een plantaardige capsulewand. Vegan, glutenvrij en zonder ggo – geen bindmiddelen, vulstoffen, zoetstoffen of kunstmatige conserveermiddelen.",
      },
      developedInSweden,
    ],
    specs: [
      { label: "Latijnse naam", value: "Eurycoma longifolia" },
      { label: "Gebruikt plantendeel", value: "Wortel" },
      { label: "Extractsterkte", value: "200:1" },
      { label: "Per capsule", value: "450 mg wortelextract" },
      { label: "Dagelijkse dosis", value: "1 capsule per dag" },
      { label: "Inhoud", value: "60 capsules – 60 dagen" },
      { label: "Capsule", value: "Vegan (HPMC)" },
      { label: "Ontwikkeld in", value: "Zweden" },
    ],
    ingredients:
      "Tongkat Ali-extract (Eurycoma longifolia, wortel) 200:1, capsulewand (HPMC). Inhoud per capsule: Tongkat Ali-extract (200:1) 450 mg.",
    usage: [oneDaily, noExceed, storeRoomTemp, keepAway],
    faq: [
      {
        q: "Wat betekent 200:1?",
        a: "Dat 200 delen gedroogde wortel zijn geconcentreerd tot 1 deel extract. Het is een maat voor concentratie, niets anders.",
      },
      lasts60,
      {
        q: "Is de capsule vegan?",
        a: "Ja. De capsulewand is plantaardig (HPMC) en het product is glutenvrij en zonder ggo.",
      },
      {
        q: "Bevat het vulstoffen?",
        a: "Nee. Alleen wortelextract en de capsulewand – geen bindmiddelen, zoetstoffen of kunstmatige conserveermiddelen.",
      },
    ],
  },

  "tongkat-premium": {
    eyebrow: "Eurycoma longifolia · 200:1, 20 mg eurycomanon",
    headline: "Gestandaardiseerd op eurycomanon",
    intro:
      "Tongkat Ali Ultra 4% is een 200:1-wortelextract van Eurycoma longifolia – 520 mg per capsule, waarvan 20 mg eurycomanon. 60 capsules per pot. Niet op een lege maag innemen.",
    highlights: [
      { label: "Extract", value: "200:1" },
      { label: "Per capsule", value: "520 mg" },
      { label: "Capsules", value: "60 stuks" },
    ],
    story: [
      {
        heading: "De wortel",
        body:
          "We gaan uit van zorgvuldig geselecteerde wortels van Eurycoma longifolia – ook bekend als Malaysian Ginseng of Longjack – een botanische grondstof met een lange traditie in Zuidoost-Azië. De wortel wordt geconcentreerd tot een 200:1-extract.",
      },
      {
        heading: "20 mg eurycomanon per capsule",
        body:
          "Elke batch wordt gestandaardiseerd op het gehalte aan eurycomanon, zodat elke capsule van 520 mg 20 mg eurycomanon bevat. Zo blijft de sterkte gelijk van batch tot batch. Eén capsule per dag.",
      },
      developedInSweden,
    ],
    specs: [
      { label: "Latijnse naam", value: "Eurycoma longifolia" },
      { label: "Gebruikt plantendeel", value: "Wortel" },
      { label: "Extractsterkte", value: "200:1, gestandaardiseerd op eurycomanon" },
      { label: "Per capsule", value: "520 mg wortelextract (20 mg eurycomanon)" },
      { label: "Dagelijkse dosis", value: "1 capsule per dag" },
      { label: "Inhoud", value: "60 capsules – 60 dagen" },
      { label: "Verpakking", value: "Plastic pot met schroefdeksel" },
      { label: "Capsule", value: "Vegan (HPMC)" },
      { label: "Ontwikkeld in", value: "Zweden" },
    ],
    ingredients:
      "Tongkat Ali-extract (Eurycoma longifolia, wortel) 200:1, capsulewand (HPMC). Inhoud per capsule: Tongkat Ali-extract (200:1) 520 mg, waarvan eurycomanon 20 mg.",
    usage: [
      oneDaily,
      "Niet op een nuchtere maag innemen – het extract is erg sterk.",
      noExceed,
      storeRoomTemp,
      keepAway,
    ],
    faq: [
      {
        q: "Hoeveel eurycomanon bevat een capsule?",
        a: "20 mg eurycomanon in 520 mg extract. Het gehalte wordt in elke batch gecontroleerd, zodat de sterkte gelijk blijft.",
      },
      {
        q: "Wat is het verschil tussen Ultra 4% en Elite?",
        a: "Elite is een 200:1-wortelextract van 450 mg per capsule, zonder standaardisatie op eurycomanon. Ultra 4% bevat 520 mg per capsule, waarvan 20 mg eurycomanon.",
      },
      lasts60,
      {
        q: "Bevat het vulstoffen?",
        a: "Nee. Alleen wortelextract en een vegan capsulewand – geen bindmiddelen, vulstoffen of kunstmatige conserveermiddelen.",
      },
    ],
  },

  "fadogia-agrestis": {
    eyebrow: "Fadogia agrestis · 20:1 kruidenextract",
    headline: "Pure plant, 450 mg per capsule",
    intro:
      "Een 20:1-extract van Fadogia agrestis, een struik met een lange traditie in het West-Afrikaanse kruidengebruik. 450 mg per capsule in een vegan capsule – zonder toevoegingen. Ontwikkeld in Zweden.",
    highlights: [
      { label: "Extract", value: "20:1" },
      { label: "Per capsule", value: "450 mg" },
      { label: "Capsules", value: "60 stuks" },
    ],
    story: [
      {
        heading: "De plant",
        body:
          "Fadogia agrestis is een struik die in delen van Afrika groeit en al lang een vaste plaats heeft in traditionele kruidenbereidingen. We gebruiken zorgvuldig geselecteerde plantendelen die worden geconcentreerd tot een 20:1-extract – voor een gelijke sterkte in elke capsule.",
      },
      {
        heading: "Pure samenstelling",
        body:
          "Alleen Fadogia agrestis-extract in een plantaardige capsulewand. Vegan, glutenvrij en zonder ggo – geen bindmiddelen, vulstoffen of kunstmatige conserveermiddelen.",
      },
      developedInSweden,
    ],
    specs: [
      { label: "Latijnse naam", value: "Fadogia agrestis" },
      { label: "Extractsterkte", value: "20:1" },
      { label: "Per capsule", value: "450 mg extract" },
      { label: "Dagelijkse dosis", value: "1 capsule per dag" },
      { label: "Inhoud", value: "60 capsules – 60 dagen" },
      { label: "Capsule", value: "Vegan (HPMC)" },
      { label: "Ontwikkeld in", value: "Zweden" },
    ],
    ingredients:
      "Fadogia agrestis-extract 20:1, capsulewand (HPMC). Inhoud per capsule: Fadogia agrestis-extract (20:1) 450 mg.",
    usage: [oneDaily, noExceed, storeRoomTemp, keepAway],
    faq: [
      {
        q: "Wat betekent 20:1?",
        a: "Dat 20 delen gedroogd plantmateriaal zijn geconcentreerd tot 1 deel extract. Het is een maat voor concentratie, niets anders.",
      },
      {
        q: "Kan ik het combineren met Tongkat Ali?",
        a: "Veel mensen doen dat. Volg de aanbevolen dagelijkse dosis van elk product.",
      },
      lasts60,
      {
        q: "Bevat het vulstoffen?",
        a: "Nee. Alleen extract en een vegan capsulewand – geen bindmiddelen, zoetstoffen of kunstmatige conserveermiddelen.",
      },
    ],
  },

  "blue-lotus": {
    eyebrow: "Nymphaea caerulea · 200:1 extract",
    headline: "De heilige bloem van de Nijl, 400 mg per capsule",
    intro:
      "Een geconcentreerd 200:1-extract van Blue Lotus. Pure grondstof zonder toevoegingen, vulstoffen of kunstmatige stoffen, in een vegan capsule.",
    highlights: [
      { label: "Extract", value: "200:1" },
      { label: "Per capsule", value: "400 mg" },
      { label: "Dagelijkse dosis", value: "1–2 capsules" },
    ],
    story: [
      {
        heading: "Heilig in het oude Egypte",
        body:
          "Blue Lotus (Nymphaea caerulea), de blauwe waterlelie, groeide in het oude Egypte in het wild langs de oevers van de Nijl. Daar had ze een heilige status en werd ze vaak afgebeeld in hiërogliefen en tempelschilderingen.",
      },
      {
        heading: "Zeer sterk geconcentreerd",
        body:
          "Ons extract is een 200:1-concentraat: 200 delen gedroogde bloem zijn geconcentreerd tot 1 deel extract. Pure grondstof – zonder toevoegingen, vulstoffen of kunstmatige stoffen.",
      },
      {
        heading: "Traditie en moderne zuiverheid",
        body:
          "Alleen bloemextract in een plantaardige capsulewand van cellulose op basis van zeewier. Vegan, zonder onnodige toevoegingen, en gecontroleerd volgens Europese veiligheidseisen.",
      },
    ],
    specs: [
      { label: "Latijnse naam", value: "Nymphaea caerulea" },
      { label: "Extractsterkte", value: "200:1" },
      { label: "Per capsule", value: "400 mg extract" },
      { label: "Dagelijkse dosis", value: "1–2 capsules (400–800 mg)" },
      { label: "Capsule", value: "Vegan (HPMC)" },
      { label: "Toevoegingen", value: "Geen" },
    ],
    ingredients:
      "Blue Lotus-extract (Nymphaea caerulea) 200:1, plantaardige capsule (HPMC). Inhoud per capsule: 400 mg blauwe-lotusextract. Bij 2 capsules: 800 mg blauwe-lotusextract.",
    usage: [
      "1–2 capsules per dag met water.",
      noExceed,
      "Niet bestemd voor gebruik of aankoop door personen jonger dan 18 jaar.",
      "Overleg met een zorgverlener als je zwanger bent, borstvoeding geeft of onder medisch toezicht staat.",
      "Droog bewaren op kamertemperatuur, buiten bereik van jonge kinderen.",
    ],
    faq: [
      {
        q: "Wat betekent 200:1?",
        a: "Dat 200 delen gedroogde bloem zijn geconcentreerd tot 1 deel extract. Het is een maat voor concentratie, niets anders.",
      },
      {
        q: "Bevat het toevoegingen?",
        a: "Nee. Alleen blue lotus-extract en een plantaardige capsulewand – geen vulstoffen of kunstmatige stoffen.",
      },
      {
        q: "Is het product vegan?",
        a: "Ja, de capsulewand is plantaardig (cellulose op basis van zeewier).",
      },
      {
        q: "Op welk moment van de dag neem je het?",
        a: "Het tijdstip bepaal je zelf. Veel mensen kiezen de avond als vast moment in hun routine.",
      },
    ],
  },

  "black-tongkat": {
    eyebrow: "Eurycoma longifolia · donkere wortel, 200:1",
    headline: "De donkere wortel – 200:1 in een vegan capsule",
    intro:
      "Black Tongkat Ali is een 200:1-wortelextract van Eurycoma longifolia, dezelfde soort als onze gele Tongkat Ali, gemaakt van donkere wortel. 500 mg per capsule. De aanbevolen dosis is 1–2 capsules per dag.",
    highlights: [
      { label: "Extract", value: "200:1" },
      { label: "Per capsule", value: "500 mg" },
      { label: "Dosering", value: "1–2 capsules/dag" },
    ],
    story: [
      {
        heading: "Dezelfde soort, donkerdere wortel",
        body:
          "Black Tongkat Ali is Eurycoma longifolia, net als de gele. Het verschil zit in de grondstof: het extract wordt gemaakt van donkere wortel. We vermelden altijd de Latijnse naam op de pot, zodat je precies weet wat je koopt.",
      },
      {
        heading: "Wortel, 200:1 geconcentreerd",
        body:
          "200 delen gedroogde wortel worden geconcentreerd tot één deel extract. Alleen de wortel wordt gebruikt – geen schors, geen stam, geen bladeren. Het wortelextract komt uit Zuidoost-Azië, waar de plant thuishoort.",
      },
      {
        heading: "Pure capsule, duidelijke dosering",
        body:
          "Elke capsule bevat 500 mg extract in een plantaardige wand (HPMC). Geen vulstoffen, geen glijmiddelen, geen kleurstoffen. De aanbevolen dosis is 1–2 capsules per dag.",
      },
    ],
    specs: [
      { label: "Latijnse naam", value: "Eurycoma longifolia" },
      { label: "Gebruikt plantendeel", value: "Wortel" },
      { label: "Extractsterkte", value: "200:1" },
      { label: "Per capsule", value: "500 mg extract" },
      { label: "Dagelijkse dosis", value: "1–2 capsules (500–1.000 mg)" },
      { label: "Inhoud", value: "60 capsules – 30 tot 60 dagen" },
      { label: "Capsulewand", value: "Plantaardig (HPMC)" },
      { label: "Verpakking", value: "Plastic pot met schroefdeksel" },
      { label: "Ontwikkeld in", value: "Zweden" },
    ],
    ingredients:
      "Tongkat Ali-extract (Eurycoma longifolia, wortel) 200:1, capsulewand (HPMC). Inhoud per capsule: Tongkat Ali-extract (200:1) 500 mg.",
    usage: [
      "1–2 capsules per dag met een glas water.",
      "Bij voorkeur bij een maaltijd innemen, elke dag op hetzelfde tijdstip.",
      noExceed,
      "Droog bewaren op kamertemperatuur en buiten bereik van jonge kinderen.",
    ],
    faq: [
      {
        q: "Wat is het verschil met gewone (gele) Tongkat Ali?",
        a: "Beide zijn Eurycoma longifolia. Black Tongkat Ali wordt gemaakt van donkere wortel en gedoseerd op 1–2 capsules per dag. Onze gele Elite bevat 450 mg per capsule en je neemt 1 capsule per dag.",
      },
      {
        q: "Wat betekent 200:1?",
        a: "Dat 200 delen gedroogde wortel zijn geconcentreerd tot 1 deel extract. Het is een maat voor concentratie.",
      },
      {
        q: "Hoeveel capsules moet ik nemen?",
        a: "1–2 capsules per dag. Een pot met 60 capsules is genoeg voor 30 dagen bij 2 capsules per dag, of voor 60 dagen bij 1.",
      },
      {
        q: "Bevat het vulstoffen en is het vegan?",
        a: "Geen vulstoffen. De capsule bevat wortelextract en een plantaardige capsulewand van HPMC, waardoor hij vegan is.",
      },
    ],
  },

  ashwagandha: {
    eyebrow: "Withania somnifera · 10 % withanoliden",
    headline: "Ashwagandha, 400 mg per capsule",
    intro:
      "Een gestandaardiseerd wortelextract van Withania somnifera met 10 % withanoliden – 400 mg per capsule. 60 capsules in een vegan capsulewand, zonder toevoegingen.",
    highlights: [
      { label: "Standaardisatie", value: "10 % withanoliden" },
      { label: "Per capsule", value: "400 mg" },
      { label: "Capsules", value: "60 stuks" },
    ],
    story: [
      {
        heading: "De wortel, niet de hele plant",
        body:
          "Ashwagandha wordt ook Indiase ginseng genoemd en heeft een lange traditie in de ayurvedische kruidencultuur. Ons extract komt uitsluitend uit de wortel. Goedkopere varianten worden vaak van de hele plant gemalen, inclusief blad en stengel, wat een heel andere inhoud geeft.",
      },
      {
        heading: "Gestandaardiseerd op 10 %",
        body:
          "Withanoliden zijn de stoffen die in een ashwagandha-extract worden gemeten. Ons extract is gestandaardiseerd op 10 %. 400 mg extract komt overeen met 40 mg withanoliden in elke capsule.",
      },
      {
        heading: "Pure samenstelling",
        body:
          "Alleen het extract en een plantaardige capsulewand. Geen bindmiddelen, vulstoffen of antiklontermiddelen, en niets toegevoegd om de inhoud aan te lengen.",
      },
    ],
    specs: [
      { label: "Latijnse naam", value: "Withania somnifera" },
      { label: "Plantendeel", value: "Wortel" },
      { label: "Standaardisatie", value: "10 % withanoliden" },
      { label: "Per capsule", value: "400 mg extract, waarvan 40 mg withanoliden" },
      { label: "Dagelijkse dosis", value: "2–3 capsules per dag" },
      { label: "Verpakking", value: "60 capsules" },
      { label: "Capsule", value: "Vegan (HPMC)" },
    ],
    ingredients:
      "Ashwagandha-extract (Withania somnifera, wortel) gestandaardiseerd op 10 % withanoliden, capsulewand (plantaardig, HPMC). Inhoud per capsule: ashwagandha-extract 400 mg, waarvan withanoliden 40 mg.",
    usage: ["2–3 capsules per dag met een glas water.", noExceed, storeCool, keepAway],
    faq: [
      {
        q: "Wat betekent 10 % withanoliden?",
        a: "Dat het extract zo is gestandaardiseerd dat 10 % uit withanoliden bestaat. In 400 mg extract komt dat overeen met 40 mg.",
      },
      {
        q: "Welk deel van de plant wordt gebruikt?",
        a: "Alleen de wortel. Blad en stengel worden niet gebruikt.",
      },
      {
        q: "Is de capsule vegan?",
        a: "Ja. De capsulewand is plantaardig (HPMC).",
      },
      {
        q: "Hoeveel capsules zitten er in de pot?",
        a: "60 capsules.",
      },
    ],
  },

  maca: {
    eyebrow: "Lepidium meyenii · 20:1 wortelextract",
    headline: "Macawortel, 470 mg per capsule",
    intro:
      "Maca is een geconcentreerd 20:1-extract van de wortel van Lepidium meyenii – een knolgewas met een lange traditie in de Andes. 60 capsules, vegan capsulewand zonder toevoegingen.",
    highlights: [
      { label: "Extract", value: "20:1" },
      { label: "Per capsule", value: "470 mg" },
      { label: "Capsules", value: "60 stuks" },
    ],
    story: [
      {
        heading: "De wortel",
        body:
          "Maca (Lepidium meyenii) wordt op grote hoogte in de Andes geteeld en wordt al generaties lang gebruikt in de Peruaanse kruidentraditie. De wortel wordt gedroogd, gemalen en geconcentreerd tot een gestandaardiseerd 20:1-extract – 20 delen gedroogde wortel worden 1 deel extract.",
      },
      {
        heading: "Pure samenstelling",
        body: `Alleen macawortelextract in een plantaardige capsulewand. ${cleanNoSweeteners}`,
      },
      developedInSweden,
    ],
    specs: [
      { label: "Latijnse naam", value: "Lepidium meyenii" },
      { label: "Gebruikt plantendeel", value: "Wortel" },
      { label: "Extractsterkte", value: "20:1" },
      { label: "Per capsule", value: "470 mg wortelextract" },
      { label: "Dagelijkse dosis", value: "2 capsules per dag" },
      { label: "Inhoud", value: "60 capsules – 30 dagen" },
      { label: "Capsule", value: "Vegan (HPMC)" },
      { label: "Ontwikkeld in", value: "Zweden" },
    ],
    ingredients:
      "Maca-extract (Lepidium meyenii, wortel) 20:1, capsulewand (HPMC). Inhoud per capsule: macawortelextract (20:1) 470 mg.",
    usage: ["2 capsules per dag met een glas water.", noExceed, storeCool, keepAway],
    faq: [
      {
        q: "Wat betekent 20:1?",
        a: "Dat 20 delen gedroogde macawortel zijn geconcentreerd tot 1 deel extract. Het is een maat voor concentratie, niets anders.",
      },
      {
        q: "Hoe lang doe je met een pot?",
        a: "60 capsules en 2 capsules per dag geven 30 dagen.",
      },
      veganFaq,
      {
        q: "Bevat het vulstoffen?",
        a: "Nee. Alleen wortelextract en de capsulewand – geen bindmiddelen, zoetstoffen of kunstmatige conserveermiddelen.",
      },
    ],
  },

  mariatistel: {
    eyebrow: "Silybum marianum · 20:1, 80 % silymarine",
    headline: "Mariadistel, 350 mg per capsule",
    intro:
      "Mariadistel is een 20:1-extract van Silybum marianum, gestandaardiseerd op 80 % silymarine – 350 mg per capsule. 60 capsules in een vegan capsulewand zonder toevoegingen.",
    highlights: [
      { label: "Extract", value: "20:1 · 80 %" },
      { label: "Per capsule", value: "350 mg" },
      { label: "Capsules", value: "60 stuks" },
    ],
    story: [
      {
        heading: "De plant",
        body:
          "Mariadistel (Silybum marianum) is een distelplant uit het Middellandse Zeegebied met een lange traditie in het Europese kruidengebruik. De zaden worden gedroogd en geëxtraheerd tot een concentraat dat is gestandaardiseerd op 80 % silymarine – een flavonoïdencomplex dat onder meer isosilybine (ca. 2,5 %), silychristine (ca. 10 %) en silydianine (ca. 7,5 %) bevat.",
      },
      {
        heading: "Pure samenstelling",
        body:
          "Alleen mariadistelextract in een plantaardige capsulewand van pullulan. Vegan, glutenvrij en zonder ggo – vrij van lactose, soja, gist, tarwe en melk, en zonder kleurstoffen, bindmiddelen, vulstoffen of kunstmatige conserveermiddelen.",
      },
      developedInSweden,
    ],
    specs: [
      { label: "Latijnse naam", value: "Silybum marianum" },
      { label: "Gebruikt plantendeel", value: "Zaad" },
      { label: "Extractsterkte", value: "20:1" },
      { label: "Standaardisatie", value: "80 % silymarine" },
      { label: "Per capsule", value: "350 mg extract" },
      { label: "Dagelijkse dosis", value: "1 capsule per dag" },
      { label: "Inhoud", value: "60 capsules – 60 dagen" },
      { label: "Capsule", value: "Vegan (pullulan)" },
      { label: "Ontwikkeld in", value: "Zweden" },
    ],
    ingredients:
      "Mariadistelextract (Silybum marianum, zaad) 20:1 gestandaardiseerd op 80 % silymarine, capsulewand (pullulan). Inhoud per capsule: mariadistelextract 350 mg, waarvan silymarine 280 mg.",
    usage: [oneDaily, noExceed, storeCool, keepAway],
    faq: [
      {
        q: "Wat betekent 80 % silymarine?",
        a: "Dat het extract zo is gestandaardiseerd dat 80 % uit het flavonoïdencomplex silymarine bestaat. In 350 mg extract komt dat overeen met 280 mg silymarine.",
      },
      {
        q: "Welk plantendeel wordt gebruikt?",
        a: "De zaden van de mariadistel, die worden gedroogd en geëxtraheerd tot een 20:1-concentraat.",
      },
      {
        q: "Is de capsule vegan?",
        a: "Ja. De capsulewand is van plantaardig pullulan en het product is glutenvrij en zonder ggo.",
      },
      lasts60,
    ],
  },

  nasselblad: {
    eyebrow: "Urtica dioica · 10:1 bladextract",
    headline: "Brandnetelblad, 430 mg per capsule",
    intro:
      "Brandnetelblad is een 10:1-extract van de bladeren van Urtica dioica – 430 mg per capsule. 60 capsules in een vegan capsulewand zonder toevoegingen.",
    highlights: [
      { label: "Extract", value: "10:1" },
      { label: "Per capsule", value: "430 mg" },
      { label: "Capsules", value: "60 stuks" },
    ],
    story: [
      {
        heading: "Het blad",
        body:
          "De grote brandnetel (Urtica dioica) wordt al eeuwenlang gebruikt in de Europese kruidentraditie. We gebruiken de bladeren, die worden gedroogd en geconcentreerd tot een 10:1-extract – 10 delen gedroogd blad worden 1 deel extract.",
      },
      {
        heading: "Pure samenstelling",
        body: `Alleen brandnetelbladextract in een plantaardige capsulewand. ${cleanNoSweeteners}`,
      },
      developedInSweden,
    ],
    specs: [
      { label: "Latijnse naam", value: "Urtica dioica" },
      { label: "Gebruikt plantendeel", value: "Blad" },
      { label: "Extractsterkte", value: "10:1" },
      { label: "Per capsule", value: "430 mg extract" },
      { label: "Dagelijkse dosis", value: "1 capsule per dag" },
      { label: "Inhoud", value: "60 capsules – 60 dagen" },
      { label: "Capsule", value: "Vegan" },
      { label: "Ontwikkeld in", value: "Zweden" },
    ],
    ingredients:
      "Brandnetelbladextract (Urtica dioica, blad) 10:1, capsulewand (plantaardig). Inhoud per capsule: brandnetelbladextract 430 mg.",
    usage: [oneDaily, noExceed, storeCool, keepAway],
    faq: [
      {
        q: "Wat betekent 10:1?",
        a: "Dat 10 delen gedroogd brandnetelblad zijn geconcentreerd tot 1 deel extract. Het is een maat voor concentratie, niets anders.",
      },
      {
        q: "Welk plantendeel wordt gebruikt?",
        a: "De bladeren van de grote brandnetel, die worden gedroogd en geëxtraheerd tot een 10:1-concentraat.",
      },
      veganFaq,
      lasts60,
    ],
  },

  druvkarneextrakt: {
    eyebrow: "Vitis vinifera · 95 % OPC",
    headline: "Druivenpitextract, 500 mg per capsule",
    intro:
      "Druivenpitextract is een extract van de pitten van Vitis vinifera, gestandaardiseerd op 95 % proanthocyanidinen (OPC) – 500 mg per capsule. 60 capsules in een vegan capsulewand zonder toevoegingen.",
    highlights: [
      { label: "Standaardisatie", value: "95 % OPC" },
      { label: "Per capsule", value: "500 mg" },
      { label: "Capsules", value: "60 stuks" },
    ],
    story: [
      {
        heading: "De pit",
        body:
          "De druif (Vitis vinifera) wordt in Europa al sinds mensenheugenis geteeld. We gebruiken de pitten, een natuurlijke bron van polyfenolen, en extraheren ze tot een concentraat dat is gestandaardiseerd op 95 % proanthocyanidinen – ook wel OPC genoemd.",
      },
      {
        heading: "Pure samenstelling",
        body: `Alleen druivenpitextract in een plantaardige capsulewand. ${cleanNoSweeteners}`,
      },
      developedInSweden,
    ],
    specs: [
      { label: "Latijnse naam", value: "Vitis vinifera" },
      { label: "Gebruikt plantendeel", value: "Pit" },
      { label: "Standaardisatie", value: "95 % proanthocyanidinen (OPC)" },
      { label: "Per capsule", value: "500 mg extract" },
      { label: "Dagelijkse dosis", value: "1–2 capsules per dag" },
      { label: "Inhoud", value: "60 capsules – 30–60 dagen" },
      { label: "Capsule", value: "Vegan" },
      { label: "Ontwikkeld in", value: "Zweden" },
    ],
    ingredients:
      "Druivenpitextract (Vitis vinifera, pit) gestandaardiseerd op 95 % proanthocyanidinen, capsulewand (plantaardig). Inhoud per capsule: druivenpitextract 500 mg, waarvan proanthocyanidinen 475 mg.",
    usage: ["1–2 capsules per dag met een glas water.", noExceed, storeCool, keepAway],
    faq: [
      {
        q: "Wat betekent 95 % OPC?",
        a: "Dat het extract zo is gestandaardiseerd dat 95 % uit proanthocyanidinen bestaat. In 500 mg extract komt dat overeen met 475 mg.",
      },
      {
        q: "Welk plantendeel wordt gebruikt?",
        a: "De pitten van de druif, die worden geëxtraheerd en gestandaardiseerd op polyfenolen.",
      },
      veganFaq,
      {
        q: "Hoe lang doe je met een pot?",
        a: "60 capsules zijn genoeg voor 30 dagen bij 2 capsules per dag en voor 60 dagen bij 1 capsule per dag.",
      },
    ],
  },

  quercetin: {
    eyebrow: "Quercetine · 98 % zuiverheid",
    headline: "Quercetine, 500 mg per capsule",
    intro:
      "Quercetine is een flavonoïde die van nature voorkomt in fruit en groenten. Ons extract heeft een zuiverheid van 98 % – 500 mg per capsule. 60 capsules in een vegan capsulewand zonder toevoegingen.",
    highlights: [
      { label: "Zuiverheid", value: "98 %" },
      { label: "Per capsule", value: "500 mg" },
      { label: "Capsules", value: "60 stuks" },
    ],
    story: [
      {
        heading: "De stof",
        body:
          "Quercetine is een plantaardige flavonoïde die onder meer voorkomt in uien, appels en bessen. We kiezen een extract met een hoge zuiverheid – 98 % – zodat elke capsule dezelfde inhoud heeft, batch na batch.",
      },
      {
        heading: "Pure samenstelling",
        body: `Alleen quercetine-extract in een plantaardige capsulewand. ${cleanNoSweeteners}`,
      },
      developedInSweden,
    ],
    specs: [
      { label: "Inhoud", value: "Quercetine-extract" },
      { label: "Zuiverheid", value: "98 % quercetine" },
      { label: "Per capsule", value: "500 mg" },
      { label: "Dagelijkse dosis", value: "1 capsule per dag" },
      { label: "Verpakking", value: "60 capsules – 60 dagen" },
      { label: "Capsule", value: "Vegan" },
      { label: "Ontwikkeld in", value: "Zweden" },
    ],
    ingredients:
      "Quercetine-extract (98 % quercetine), capsulewand (plantaardig). Inhoud per capsule: quercetine-extract 500 mg, waarvan quercetine 490 mg.",
    usage: [oneDaily, noExceed, storeCool, keepAway],
    faq: [
      {
        q: "Wat betekent 98 % zuiverheid?",
        a: "Dat 98 % van het extract uit quercetine bestaat. In 500 mg extract komt dat overeen met 490 mg quercetine.",
      },
      {
        q: "Waar komt quercetine vandaan?",
        a: "Quercetine is een flavonoïde die van nature voorkomt in fruit, groenten en kruiden.",
      },
      veganFaq,
      lasts60,
    ],
  },

  reishi: {
    eyebrow: "Ganoderma lucidum · 40 % polysachariden",
    headline: "Reishi, 350 mg per capsule",
    intro:
      "Reishi (Ganoderma lucidum) in een gestandaardiseerd paddenstoelenextract met 40 % polysachariden – 350 mg per capsule. 60 capsules in een vegan capsulewand zonder toevoegingen.",
    highlights: [
      { label: "Standaardisatie", value: "40 % polysachariden" },
      { label: "Per capsule", value: "350 mg" },
      { label: "Capsules", value: "60 stuks" },
    ],
    story: [
      {
        heading: "De paddenstoel",
        body:
          "Reishi, Ganoderma lucidum, wordt al eeuwenlang gebruikt in de traditionele kruidencultuur. Ons extract is geconcentreerd en gestandaardiseerd op 40 % polysachariden, zodat de inhoud in elke capsule gelijk is.",
      },
      {
        heading: "Pure samenstelling",
        body: `Alleen reishi-extract in een plantaardige capsulewand. ${cleanNoSweeteners}`,
      },
      developedInSweden,
    ],
    specs: [
      { label: "Latijnse naam", value: "Ganoderma lucidum" },
      { label: "Standaardisatie", value: "40 % polysachariden" },
      { label: "Per capsule", value: "350 mg" },
      { label: "Dagelijkse dosis", value: "1 capsule per dag" },
      { label: "Verpakking", value: "60 capsules – 60 dagen" },
      { label: "Capsule", value: "Vegan" },
      { label: "Ontwikkeld in", value: "Zweden" },
    ],
    ingredients:
      "Reishi-extract (Ganoderma lucidum) gestandaardiseerd op 40 % polysachariden, capsulewand (plantaardig). Inhoud per capsule: reishi-extract 350 mg, waarvan polysachariden 140 mg.",
    usage: [oneDaily, noExceed, storeCool, keepAway],
    faq: [
      {
        q: "Wat betekent 40 % polysachariden?",
        a: "Dat het extract zo is gestandaardiseerd dat 40 % uit polysachariden bestaat. In 350 mg extract komt dat overeen met 140 mg.",
      },
      {
        q: "Welke paddenstoel wordt gebruikt?",
        a: "Ganoderma lucidum, algemeen bekend als reishi.",
      },
      veganFaq,
      lasts60,
    ],
  },

  chaga: {
    eyebrow: "Inonotus obliquus · 30:1 extract",
    headline: "Chaga, 400 mg per capsule",
    intro:
      "Chaga (Inonotus obliquus) in een 30:1-extract, gestandaardiseerd op 10 % polysachariden – 400 mg per capsule. 60 capsules in een vegan capsulewand zonder toevoegingen.",
    highlights: [
      { label: "Extract", value: "30:1" },
      { label: "Per capsule", value: "400 mg" },
      { label: "Capsules", value: "60 stuks" },
    ],
    story: [
      {
        heading: "De paddenstoel",
        body:
          "Chaga groeit langzaam op berken en neemt gedurende vele jaren voedingsstoffen op uit de boom. Ons extract komt van in het wild geoogste chaga van hoge kwaliteit, 30:1 geconcentreerd en gestandaardiseerd op 10 % polysachariden.",
      },
      {
        heading: "Pure samenstelling",
        body: `Alleen chaga-extract in een plantaardige capsulewand. ${cleanNoSweeteners}`,
      },
      developedInSweden,
    ],
    specs: [
      { label: "Latijnse naam", value: "Inonotus obliquus" },
      { label: "Extract", value: "30:1" },
      { label: "Standaardisatie", value: "10 % polysachariden" },
      { label: "Per capsule", value: "400 mg" },
      { label: "Dagelijkse dosis", value: "1 capsule per dag" },
      { label: "Verpakking", value: "60 capsules – 60 dagen" },
      { label: "Capsule", value: "Vegan" },
      { label: "Ontwikkeld in", value: "Zweden" },
    ],
    ingredients:
      "Chaga-extract (Inonotus obliquus) 30:1 gestandaardiseerd op 10 % polysachariden, capsulewand (plantaardig). Inhoud per capsule: chaga-extract 400 mg, waarvan polysachariden 40 mg.",
    usage: [oneDaily, noExceed, storeCool, keepAway],
    faq: [
      {
        q: "Wat betekent 30:1?",
        a: "Dat 30 delen grondstof zijn geconcentreerd tot 1 deel extract. 400 mg extract komt overeen met ongeveer 12 g gedroogde chaga.",
      },
      {
        q: "Wat houdt 10 % polysachariden in?",
        a: "Dat het extract zo is gestandaardiseerd dat 10 % uit polysachariden bestaat – 40 mg per capsule.",
      },
      veganFaq,
      lasts60,
    ],
  },

  "lions-mane": {
    eyebrow: "Hericium erinaceus · 60 % polysachariden",
    headline: "Lion's Mane, 500 mg per capsule",
    intro:
      "Lion's Mane (Hericium erinaceus) in een gestandaardiseerd paddenstoelenextract met 60 % polysachariden, waarvan 45 % bètaglucanen – 500 mg per capsule. 60 capsules in een vegan capsulewand zonder toevoegingen.",
    highlights: [
      { label: "Standaardisatie", value: "60 % polysachariden" },
      { label: "Per capsule", value: "500 mg" },
      { label: "Capsules", value: "60 stuks" },
    ],
    story: [
      {
        heading: "De paddenstoel",
        body:
          "Lion's Mane, Hericium erinaceus, heeft een lange geschiedenis in de traditionele kruidencultuur van Oost-Azië. Ons extract is geconcentreerd en gestandaardiseerd op 60 % polysachariden, waarvan 45 % bètaglucanen, zodat de inhoud in elke capsule gelijk is.",
      },
      {
        heading: "Pure samenstelling",
        body: `Alleen Lion's Mane-extract in een plantaardige capsulewand. ${cleanNoSweeteners}`,
      },
      developedInSweden,
    ],
    specs: [
      { label: "Latijnse naam", value: "Hericium erinaceus" },
      { label: "Standaardisatie", value: "60 % polysachariden" },
      { label: "Waarvan bètaglucanen", value: "45 %" },
      { label: "Per capsule", value: "500 mg" },
      { label: "Dagelijkse dosis", value: "1 capsule per dag" },
      { label: "Verpakking", value: "60 capsules – 60 dagen" },
      { label: "Capsule", value: "Vegan" },
      { label: "Ontwikkeld in", value: "Zweden" },
    ],
    ingredients:
      "Lion's Mane-extract (Hericium erinaceus) gestandaardiseerd op 60 % polysachariden, waarvan 45 % bètaglucanen, capsulewand (plantaardig). Inhoud per capsule: extract 500 mg, waarvan polysachariden 300 mg en bètaglucanen 225 mg.",
    usage: [oneDaily, noExceed, storeCool, keepAway],
    faq: [
      {
        q: "Wat betekent 60 % polysachariden?",
        a: "Dat het extract zo is gestandaardiseerd dat 60 % uit polysachariden bestaat. In 500 mg extract komt dat overeen met 300 mg.",
      },
      {
        q: "Wat zijn bètaglucanen?",
        a: "Een specifieke groep polysachariden. In ons extract vormen ze 45 %, oftewel 225 mg per capsule.",
      },
      veganFaq,
      lasts60,
    ],
  },

  cordyceps: {
    eyebrow: "Cordyceps militaris · 8:1 extract",
    headline: "Cordyceps, 350 mg per capsule",
    intro:
      "Cordyceps (Cordyceps militaris) in een 8:1-extract, gestandaardiseerd op 40 % polysachariden – 350 mg per capsule. 60 capsules in een vegan capsulewand zonder toevoegingen.",
    highlights: [
      { label: "Extract", value: "8:1" },
      { label: "Per capsule", value: "350 mg" },
      { label: "Capsules", value: "60 stuks" },
    ],
    story: [
      {
        heading: "De paddenstoel",
        body:
          "Cordyceps heeft al lang een plaats in de Oost-Aziatische kruidencultuur. Ons extract komt van zorgvuldig geselecteerde Cordyceps militaris, 8:1 geconcentreerd en gestandaardiseerd op 40 % polysachariden, zodat de inhoud in elke capsule gelijk is.",
      },
      {
        heading: "Pure samenstelling",
        body: `Alleen cordyceps-extract in een plantaardige capsulewand. ${cleanNoSweeteners}`,
      },
      developedInSweden,
    ],
    specs: [
      { label: "Latijnse naam", value: "Cordyceps militaris" },
      { label: "Extract", value: "8:1" },
      { label: "Standaardisatie", value: "40 % polysachariden" },
      { label: "Per capsule", value: "350 mg" },
      { label: "Dagelijkse dosis", value: "1 capsule per dag" },
      { label: "Verpakking", value: "60 capsules – 60 dagen" },
      { label: "Capsule", value: "Vegan" },
      { label: "Ontwikkeld in", value: "Zweden" },
    ],
    ingredients:
      "Cordyceps-extract (Cordyceps militaris) 8:1 gestandaardiseerd op 40 % polysachariden, capsulewand (plantaardig). Inhoud per capsule: cordyceps-extract 350 mg, waarvan polysachariden 140 mg.",
    usage: [oneDaily, noExceed, storeCool, keepAway],
    faq: [
      {
        q: "Wat betekent 8:1?",
        a: "Dat 8 delen grondstof zijn geconcentreerd tot 1 deel extract. 350 mg extract komt overeen met ongeveer 2,8 g gedroogde cordyceps.",
      },
      {
        q: "Wat houdt 40 % polysachariden in?",
        a: "Dat het extract zo is gestandaardiseerd dat 40 % uit polysachariden bestaat – 140 mg per capsule.",
      },
      veganFaq,
      lasts60,
    ],
  },

  "pine-pollen": {
    eyebrow: "Dennenpollen · 99 % zuiver extract",
    headline: "Pine Pollen, 300 mg per capsule",
    intro:
      "Stuifmeel van de den in een 99 % zuiver extract met opengebroken celwanden – 300 mg per capsule. 60 capsules in een vegan capsulewand, zonder toevoegingen.",
    highlights: [
      { label: "Zuiverheid", value: "99 %" },
      { label: "Per capsule", value: "300 mg" },
      { label: "Capsules", value: "60 stuks" },
    ],
    story: [
      {
        heading: "Het gele stof van het voorjaar",
        body:
          "Een paar weken per jaar, in het voorjaar, laat de den zijn stuifmeel los: een fijn geel stof dat neerdaalt op de grond en het water. De oogst vindt plaats in die korte periode waarin het pollen er is, en daarom is de grondstof seizoensgebonden.",
      },
      {
        heading: "Opengebroken celwanden",
        body:
          "Een pollenkorrel heeft een harde buitenschil. In ons extract zijn de celwanden opengebroken; dat is de stap die de inhoud van de korrel toegankelijk maakt, in plaats van dat hij onaangetast passeert.",
      },
      {
        heading: "Pure samenstelling",
        body:
          "99 % zuiver pollenextract en een plantaardige capsulewand. Geen bindmiddelen, vulstoffen of antiklontermiddelen.",
      },
    ],
    specs: [
      { label: "Grondstof", value: "Stuifmeel van de den" },
      { label: "Zuiverheid", value: "99 %" },
      { label: "Bewerking", value: "Opengebroken celwanden" },
      { label: "Per capsule", value: "300 mg" },
      { label: "Dagelijkse dosis", value: "1–3 capsules per dag" },
      { label: "Verpakking", value: "60 capsules" },
      { label: "Capsule", value: "Vegan (HPMC)" },
    ],
    ingredients:
      "Dennenpollenextract (99 % zuiver, opengebroken celwanden), capsulewand (plantaardig, HPMC). Inhoud per capsule: pollenextract 300 mg.",
    usage: ["1–3 capsules per dag met een glas water.", noExceed, storeCool, keepAway],
    faq: [
      {
        q: "Wat betekent opengebroken celwanden?",
        a: "De buitenschil van de pollenkorrel is tijdens de bewerking geopend, zodat de inhoud toegankelijk wordt in plaats van onaangetast te passeren.",
      },
      {
        q: "Wanneer wordt het pollen geoogst?",
        a: "In de korte periode in het voorjaar waarin de den zijn stuifmeel loslaat.",
      },
      {
        q: "Is de capsule vegan?",
        a: "Ja. De capsulewand is plantaardig (HPMC).",
      },
      {
        q: "Hoeveel capsules zitten er in de pot?",
        a: "60 capsules.",
      },
    ],
  },
};
