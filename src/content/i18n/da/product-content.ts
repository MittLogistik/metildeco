import type { ProductContent } from "@/content/product-content";

/**
 * Landingssideindhold pr. produkt på dansk (da-DK). Oversat fra src/content/product-content.ts.
 * Ingen sundhedsanprisninger – kun botanik, oprindelse, ekstraktion, format og dosering.
 */

const developedInSweden = {
  heading: "Udviklet i Sverige",
  body:
    "Metilde er et svensk varemærke. Sortimentet udvikles her, og alle ordrer sendes fra vores lager i Timrå, Sverige. Emballagen er en plastbøtte med skruelåg, der holder indholdet tørt mellem doserne.",
};

export const productContent: Record<string, ProductContent> = {
  "tongkat-ali-elite": {
    eyebrow: "Eurycoma longifolia · 200:1 rodekstrakt",
    headline: "Ren rod, 450 mg pr. kapsel",
    intro:
      "Tongkat Ali Elite er et koncentreret 200:1-ekstrakt af roden fra Eurycoma longifolia – også kendt som Malaysian Ginseng eller Longjack. Udviklet i Sverige, i vegansk kapsel, uden tilsætningsstoffer.",
    highlights: [
      { label: "Ekstrakt", value: "200:1" },
      { label: "Pr. kapsel", value: "450 mg" },
      { label: "Kapsler", value: "60 stk." },
    ],
    story: [
      {
        heading: "Roden",
        body:
          "Vi tager udgangspunkt i omhyggeligt udvalgte rødder af Eurycoma longifolia, en botanisk råvare med lang tradition i Sydøstasien. Roden tørres, males og koncentreres til et 200:1-ekstrakt – 200 dele tørret rod bliver til 1 del ekstrakt.",
      },
      {
        heading: "Ren sammensætning",
        body:
          "Kun rodekstrakt i et plantebaseret kapselskal. Vegansk, glutenfri og uden GMO – ingen bindemidler, fyldstoffer, sødestoffer eller kunstige konserveringsmidler.",
      },
      developedInSweden,
    ],
    specs: [
      { label: "Latinsk navn", value: "Eurycoma longifolia" },
      { label: "Anvendt plantedel", value: "Rod" },
      { label: "Ekstraktstyrke", value: "200:1" },
      { label: "Pr. kapsel", value: "450 mg rodekstrakt" },
      { label: "Daglig dosis", value: "1 kapsel dagligt" },
      { label: "Indhold", value: "60 kapsler – 60 dage" },
      { label: "Kapsel", value: "Vegansk (HPMC)" },
      { label: "Udviklet i", value: "Sverige" },
    ],
    ingredients:
      "Tongkat Ali-ekstrakt (Eurycoma longifolia, rod) 200:1, kapselskal (HPMC). Indhold pr. kapsel: Tongkat Ali-ekstrakt (200:1) 450 mg.",
    usage: [
      "1 kapsel dagligt med et glas vand.",
      "Den anbefalede daglige dosis må ikke overskrides.",
      "Opbevares tørt ved stuetemperatur. Luk bøtten efter hver brug.",
      "Opbevares utilgængeligt for små børn.",
    ],
    faq: [
      {
        q: "Hvad betyder 200:1?",
        a: "At 200 dele tørret rod er koncentreret til 1 del ekstrakt. Det er et mål for koncentration, intet andet.",
      },
      {
        q: "Hvor længe rækker en bøtte?",
        a: "60 kapsler og 1 kapsel dagligt giver 60 dage.",
      },
      {
        q: "Er kapslen vegansk?",
        a: "Ja. Kapselskallen er plantebaseret (HPMC), og produktet er glutenfrit og uden GMO.",
      },
      {
        q: "Indeholder den fyldstoffer?",
        a: "Nej. Kun rodekstrakt og kapselskal – ingen bindemidler, sødestoffer eller kunstige konserveringsmidler.",
      },
    ],
  },

  "tongkat-premium": {
    eyebrow: "Eurycoma longifolia · 200:1, 20 mg eurycomanon",
    headline: "Standardiseret på eurycomanon",
    intro:
      "Tongkat Ali Ultra 4% er et 200:1-rodekstrakt af Eurycoma longifolia – 520 mg pr. kapsel, heraf 20 mg eurycomanon. 60 kapsler pr. bøtte. Tag den ikke på tom mave.",
    highlights: [
      { label: "Ekstrakt", value: "200:1" },
      { label: "Pr. kapsel", value: "520 mg" },
      { label: "Kapsler", value: "60 stk." },
    ],
    story: [
      {
        heading: "Roden",
        body:
          "Vi tager udgangspunkt i omhyggeligt udvalgte rødder af Eurycoma longifolia – også kendt som Malaysian Ginseng eller Longjack – en botanisk råvare med lang tradition i Sydøstasien. Roden koncentreres til et 200:1-ekstrakt.",
      },
      {
        heading: "20 mg eurycomanon pr. kapsel",
        body:
          "Hver batch standardiseres på indholdet af eurycomanon, så hver kapsel på 520 mg indeholder 20 mg eurycomanon. Det giver en ensartet styrke fra batch til batch. Én kapsel om dagen.",
      },
      developedInSweden,
    ],
    specs: [
      { label: "Latinsk navn", value: "Eurycoma longifolia" },
      { label: "Anvendt plantedel", value: "Rod" },
      { label: "Ekstraktstyrke", value: "200:1, standardiseret på eurycomanon" },
      { label: "Pr. kapsel", value: "520 mg rodekstrakt (20 mg eurycomanon)" },
      { label: "Daglig dosis", value: "1 kapsel dagligt" },
      { label: "Indhold", value: "60 kapsler – 60 dage" },
      { label: "Emballage", value: "Plastbøtte med skruelåg" },
      { label: "Kapsel", value: "Vegansk (HPMC)" },
      { label: "Udviklet i", value: "Sverige" },
    ],
    ingredients:
      "Tongkat Ali-ekstrakt (Eurycoma longifolia, rod) 200:1, kapselskal (HPMC). Indhold pr. kapsel: Tongkat Ali-ekstrakt (200:1) 520 mg, heraf eurycomanon 20 mg.",
    usage: [
      "1 kapsel dagligt med et glas vand.",
      "Tag den ikke på tom mave – ekstraktet er meget stærkt.",
      "Den anbefalede daglige dosis må ikke overskrides.",
      "Opbevares tørt ved stuetemperatur. Luk bøtten efter hver brug.",
      "Opbevares utilgængeligt for små børn.",
    ],
    faq: [
      {
        q: "Hvor meget eurycomanon indeholder en kapsel?",
        a: "20 mg eurycomanon i 520 mg ekstrakt.",
      },
      {
        q: "Hvad er forskellen på Ultra 4% og Elite?",
        a: "Elite er et 200:1-rodekstrakt på 450 mg pr. kapsel uden standardisering på eurycomanon. Ultra 4% indeholder 520 mg pr. kapsel, heraf 20 mg eurycomanon.",
      },
      {
        q: "Hvor længe rækker en bøtte?",
        a: "60 kapsler og 1 kapsel dagligt giver 60 dage.",
      },
      {
        q: "Indeholder den fyldstoffer?",
        a: "Nej. Kun rodekstrakt og et vegansk kapselskal – ingen bindemidler, fyldstoffer eller kunstige konserveringsmidler.",
      },
    ],
  },

  "fadogia-agrestis": {
    eyebrow: "Fadogia agrestis · 20:1 urteekstrakt",
    headline: "Ren plante, 450 mg pr. kapsel",
    intro:
      "Et 20:1-ekstrakt af Fadogia agrestis, en busk med lang tradition i vestafrikansk urtebrug. 450 mg pr. kapsel i vegansk kapsel – uden tilsætningsstoffer. Udviklet i Sverige.",
    highlights: [
      { label: "Ekstrakt", value: "20:1" },
      { label: "Pr. kapsel", value: "450 mg" },
      { label: "Kapsler", value: "60 stk." },
    ],
    story: [
      {
        heading: "Planten",
        body:
          "Fadogia agrestis er en busk, der vokser i dele af Afrika og længe har haft en selvfølgelig plads i traditionelle urtetilberedninger. Vi bruger omhyggeligt udvalgte plantedele, som koncentreres til et 20:1-ekstrakt – for en ensartet styrke i hver kapsel.",
      },
      {
        heading: "Ren sammensætning",
        body:
          "Kun Fadogia agrestis-ekstrakt i et plantebaseret kapselskal. Vegansk, glutenfri og uden GMO – ingen bindemidler, fyldstoffer eller kunstige konserveringsmidler.",
      },
      developedInSweden,
    ],
    specs: [
      { label: "Latinsk navn", value: "Fadogia agrestis" },
      { label: "Ekstraktstyrke", value: "20:1" },
      { label: "Pr. kapsel", value: "450 mg ekstrakt" },
      { label: "Daglig dosis", value: "1 kapsel dagligt" },
      { label: "Indhold", value: "60 kapsler – 60 dage" },
      { label: "Kapsel", value: "Vegansk (HPMC)" },
      { label: "Udviklet i", value: "Sverige" },
    ],
    ingredients:
      "Fadogia agrestis-ekstrakt 20:1, kapselskal (HPMC). Indhold pr. kapsel: Fadogia agrestis-ekstrakt (20:1) 450 mg.",
    usage: [
      "1 kapsel dagligt med et glas vand.",
      "Den anbefalede daglige dosis må ikke overskrides.",
      "Opbevares tørt ved stuetemperatur. Luk bøtten efter hver brug.",
      "Opbevares utilgængeligt for små børn.",
    ],
    faq: [
      {
        q: "Hvad betyder 20:1?",
        a: "At 20 dele tørret plantemateriale er koncentreret til 1 del ekstrakt. Det er et mål for koncentration, intet andet.",
      },
      {
        q: "Kan jeg kombinere den med Tongkat Ali?",
        a: "Det gør mange. Følg den anbefalede daglige dosis for hvert produkt.",
      },
      {
        q: "Hvor længe rækker en bøtte?",
        a: "60 kapsler og 1 kapsel dagligt giver 60 dage.",
      },
      {
        q: "Indeholder den fyldstoffer?",
        a: "Nej. Kun ekstrakt og et vegansk kapselskal – ingen bindemidler, sødestoffer eller kunstige konserveringsmidler.",
      },
    ],
  },

  "blue-lotus": {
    eyebrow: "Nymphaea caerulea · 200:1 ekstrakt",
    headline: "Nilens hellige blomst, 400 mg pr. kapsel",
    intro:
      "Et koncentreret 200:1-ekstrakt af Blue Lotus. Ren råvare uden tilsætningsstoffer, fyldstoffer eller kunstige stoffer, i vegansk kapsel.",
    highlights: [
      { label: "Ekstrakt", value: "200:1" },
      { label: "Pr. kapsel", value: "400 mg" },
      { label: "Daglig dosis", value: "1–2 kapsler" },
    ],
    story: [
      {
        heading: "Hellig i det gamle Egypten",
        body:
          "Blue Lotus (Nymphaea caerulea), den blå åkande, voksede vildt langs Nilens bredder i det gamle Egypten, hvor den havde hellig status og ofte blev afbildet i hieroglyffer og tempelmalerier.",
      },
      {
        heading: "Ekstremt højkoncentreret",
        body:
          "Vores ekstrakt er et 200:1-koncentrat, hvilket betyder, at 200 dele tørret blomst er koncentreret til 1 del ekstrakt. Ren råvare – uden tilsætningsstoffer, fyldstoffer eller kunstige stoffer.",
      },
      {
        heading: "Tradition møder moderne renhed",
        body:
          "Kun blomsterekstrakt i et plantebaseret kapselskal af tangbaseret cellulose. Vegansk og uden unødvendige tilsætningsstoffer.",
      },
    ],
    specs: [
      { label: "Latinsk navn", value: "Nymphaea caerulea" },
      { label: "Ekstraktstyrke", value: "200:1" },
      { label: "Pr. kapsel", value: "400 mg ekstrakt" },
      { label: "Daglig dosis", value: "1–2 kapsler (400–800 mg)" },
      { label: "Kapsel", value: "Vegansk (HPMC)" },
      { label: "Tilsætningsstoffer", value: "Ingen" },
    ],
    ingredients:
      "Blue Lotus-ekstrakt (Nymphaea caerulea) 200:1, plantebaseret kapsel (HPMC). Indhold pr. kapsel: 400 mg blå lotus-ekstrakt. Ved 2 kapsler: 800 mg blå lotus-ekstrakt.",
    usage: [
      "1–2 kapsler om dagen med vand.",
      "Den anbefalede daglige dosis må ikke overskrides.",
      "Ikke til brug eller køb for personer under 18 år.",
      "Rådfør dig med din læge, hvis du er gravid, ammer eller er under medicinsk behandling.",
      "Opbevares tørt ved stuetemperatur og utilgængeligt for små børn.",
    ],
    faq: [
      {
        q: "Hvad betyder 200:1?",
        a: "At 200 dele tørret blomst er koncentreret til 1 del ekstrakt. Det er et mål for koncentration, intet andet.",
      },
      {
        q: "Indeholder den tilsætningsstoffer?",
        a: "Nej. Kun blue lotus-ekstrakt og et plantebaseret kapselskal – ingen fyldstoffer eller kunstige stoffer.",
      },
      {
        q: "Er produktet vegansk?",
        a: "Ja, kapselskallen er plantebaseret (tangbaseret cellulose).",
      },
      {
        q: "Hvornår på døgnet tager man den?",
        a: "Det er op til dig. Mange vælger aftenen som et fast punkt i rutinen.",
      },
    ],
  },

  "black-tongkat": {
    eyebrow: "Eurycoma longifolia · mørk rod, 200:1",
    headline: "Den mørke rod – 200:1 i vegansk kapsel",
    intro:
      "Black Tongkat Ali er et 200:1-rodekstrakt af Eurycoma longifolia – samme art som vores gule Tongkat Ali, men lavet af mørk rod. 500 mg pr. kapsel. Den anbefalede dosis er 1–2 kapsler om dagen.",
    highlights: [
      { label: "Ekstrakt", value: "200:1" },
      { label: "Pr. kapsel", value: "500 mg" },
      { label: "Dosering", value: "1–2 kapsler/dag" },
    ],
    story: [
      {
        heading: "Samme art, mørkere rod",
        body:
          "Black Tongkat Ali er Eurycoma longifolia, præcis som den gule. Forskellen ligger i råvaren: ekstraktet laves af mørk rod. Vi angiver altid det latinske navn på bøtten, så du ved præcis, hvad du køber.",
      },
      {
        heading: "Rod, koncentreret 200:1",
        body:
          "200 dele tørret rod koncentreres til én del ekstrakt. Kun roden bruges – ingen bark, ingen stængel, ingen blade. Rodekstraktet kommer fra Sydøstasien, hvor planten hører hjemme.",
      },
      {
        heading: "Ren kapsel, tydelig dosering",
        body:
          "Hver kapsel indeholder 500 mg ekstrakt i en plantebaseret skal (HPMC). Ingen fyldstoffer, ingen flydemidler, ingen farvestoffer. Den anbefalede dosis er 1–2 kapsler om dagen.",
      },
    ],
    specs: [
      { label: "Latinsk navn", value: "Eurycoma longifolia" },
      { label: "Anvendt plantedel", value: "Rod" },
      { label: "Ekstraktstyrke", value: "200:1" },
      { label: "Pr. kapsel", value: "500 mg ekstrakt" },
      { label: "Daglig dosis", value: "1–2 kapsler (500–1.000 mg)" },
      { label: "Indhold", value: "60 kapsler – 30 til 60 dage" },
      { label: "Kapselskal", value: "Vegetabilsk (HPMC)" },
      { label: "Emballage", value: "Plastbøtte med skruelåg" },
      { label: "Udviklet i", value: "Sverige" },
    ],
    ingredients:
      "Tongkat Ali-ekstrakt (Eurycoma longifolia, rod) 200:1, kapselskal (HPMC). Indhold pr. kapsel: Tongkat Ali-ekstrakt (200:1) 500 mg.",
    usage: [
      "1–2 kapsler dagligt med et glas vand.",
      "Tages gerne i forbindelse med et måltid, på samme tidspunkt hver dag.",
      "Den anbefalede daglige dosis må ikke overskrides.",
      "Opbevares tørt ved stuetemperatur og utilgængeligt for små børn.",
    ],
    faq: [
      {
        q: "Hvad er forskellen på almindelig (gul) Tongkat Ali?",
        a: "Begge er Eurycoma longifolia. Black Tongkat Ali laves af mørk rod og doseres med 1–2 kapsler om dagen. Vores gule Elite har 450 mg pr. kapsel og doseres med 1 kapsel om dagen.",
      },
      {
        q: "Hvad betyder 200:1?",
        a: "At 200 dele tørret rod er koncentreret til 1 del ekstrakt. Det er et mål for koncentration.",
      },
      {
        q: "Hvor mange kapsler skal jeg tage?",
        a: "1–2 kapsler dagligt. En bøtte med 60 kapsler rækker til 30 dage med 2 kapsler om dagen eller 60 dage med 1.",
      },
      {
        q: "Indeholder den fyldstoffer, og er den vegansk?",
        a: "Ingen fyldstoffer. Kapslen indeholder rodekstrakt og et plantebaseret kapselskal af HPMC, hvilket gør den vegansk.",
      },
    ],
  },

  maca: {
    eyebrow: "Lepidium meyenii · 20:1 rodekstrakt",
    headline: "Macarod, 470 mg pr. kapsel",
    intro:
      "Maca er et koncentreret 20:1-ekstrakt af roden fra Lepidium meyenii – en rodfrugt med lang tradition i Andesbjergene. 60 kapsler, vegansk kapselskal uden tilsætningsstoffer.",
    highlights: [
      { label: "Ekstrakt", value: "20:1" },
      { label: "Pr. kapsel", value: "470 mg" },
      { label: "Kapsler", value: "60 stk." },
    ],
    story: [
      {
        heading: "Roden",
        body:
          "Maca (Lepidium meyenii) dyrkes i stor højde i Andesbjergene og har været brugt i peruansk urtetradition i generationer. Roden tørres, males og koncentreres til et standardiseret 20:1-ekstrakt – 20 dele tørret rod bliver til 1 del ekstrakt.",
      },
      {
        heading: "Ren sammensætning",
        body:
          "Kun macarodekstrakt i et plantebaseret kapselskal. Vegansk, glutenfri og uden GMO – ingen bindemidler, fyldstoffer, sødestoffer eller kunstige konserveringsmidler.",
      },
      developedInSweden,
    ],
    specs: [
      { label: "Latinsk navn", value: "Lepidium meyenii" },
      { label: "Anvendt plantedel", value: "Rod" },
      { label: "Ekstraktstyrke", value: "20:1" },
      { label: "Pr. kapsel", value: "470 mg rodekstrakt" },
      { label: "Daglig dosis", value: "2 kapsler dagligt" },
      { label: "Indhold", value: "60 kapsler – 30 dage" },
      { label: "Kapsel", value: "Vegansk (HPMC)" },
      { label: "Udviklet i", value: "Sverige" },
    ],
    ingredients:
      "Macaekstrakt (Lepidium meyenii, rod) 20:1, kapselskal (HPMC). Indhold pr. kapsel: macarodekstrakt (20:1) 470 mg.",
    usage: [
      "2 kapsler dagligt med et glas vand.",
      "Den anbefalede daglige dosis må ikke overskrides.",
      "Opbevares køligt og tørt. Luk bøtten efter hver brug.",
      "Opbevares utilgængeligt for små børn.",
    ],
    faq: [
      {
        q: "Hvad betyder 20:1?",
        a: "At 20 dele tørret macarod er koncentreret til 1 del ekstrakt. Det er et mål for koncentration, intet andet.",
      },
      {
        q: "Hvor længe rækker en bøtte?",
        a: "60 kapsler og 2 kapsler dagligt giver 30 dage.",
      },
      {
        q: "Er kapslen vegansk?",
        a: "Ja. Kapselskallen er plantebaseret, og produktet er glutenfrit og uden GMO.",
      },
      {
        q: "Indeholder den fyldstoffer?",
        a: "Nej. Kun rodekstrakt og kapselskal – ingen bindemidler, sødestoffer eller kunstige konserveringsmidler.",
      },
    ],
  },

  mariatistel: {
    eyebrow: "Silybum marianum · 20:1, 80 % silymarin",
    headline: "Mariatidsel, 350 mg pr. kapsel",
    intro:
      "Mariatidsel er et 20:1-ekstrakt af Silybum marianum standardiseret til 80 % silymarin – 350 mg pr. kapsel. 60 kapsler i vegansk kapselskal uden tilsætningsstoffer.",
    highlights: [
      { label: "Ekstrakt", value: "20:1 · 80 %" },
      { label: "Pr. kapsel", value: "350 mg" },
      { label: "Kapsler", value: "60 stk." },
    ],
    story: [
      {
        heading: "Planten",
        body:
          "Mariatidsel (Silybum marianum) er en tidselplante fra Middelhavsområdet med lang tradition i europæisk urtebrug. Frøene tørres og ekstraheres til et koncentrat standardiseret til 80 % silymarin – et flavonoidkompleks, der blandt andet indeholder isosilybinin (ca. 2,5 %), silicristin (ca. 10 %) og silydianin (ca. 7,5 %).",
      },
      {
        heading: "Ren sammensætning",
        body:
          "Kun mariatidselekstrakt i et plantebaseret kapselskal af pullulan. Vegansk, glutenfri og uden GMO – fri for laktose, soja, gær, hvede og mælk og uden farvestoffer, bindemidler, fyldstoffer eller kunstige konserveringsmidler.",
      },
      developedInSweden,
    ],
    specs: [
      { label: "Latinsk navn", value: "Silybum marianum" },
      { label: "Anvendt plantedel", value: "Frø" },
      { label: "Ekstraktstyrke", value: "20:1" },
      { label: "Standardisering", value: "80 % silymarin" },
      { label: "Pr. kapsel", value: "350 mg ekstrakt" },
      { label: "Daglig dosis", value: "1 kapsel dagligt" },
      { label: "Indhold", value: "60 kapsler – 60 dage" },
      { label: "Kapsel", value: "Vegansk (pullulan)" },
      { label: "Udviklet i", value: "Sverige" },
    ],
    ingredients:
      "Mariatidselekstrakt (Silybum marianum, frø) 20:1 standardiseret til 80 % silymarin, kapselskal (pullulan). Indhold pr. kapsel: mariatidselekstrakt 350 mg, heraf silymarin 280 mg.",
    usage: [
      "1 kapsel dagligt med et glas vand.",
      "Den anbefalede daglige dosis må ikke overskrides.",
      "Opbevares køligt og tørt. Luk bøtten efter hver brug.",
      "Opbevares utilgængeligt for små børn.",
    ],
    faq: [
      {
        q: "Hvad betyder 80 % silymarin?",
        a: "At ekstraktet er standardiseret, så 80 % udgøres af flavonoidkomplekset silymarin. I 350 mg ekstrakt svarer det til 280 mg silymarin.",
      },
      {
        q: "Hvilken plantedel bruges?",
        a: "Frøene fra mariatidsel, som tørres og ekstraheres til et 20:1-koncentrat.",
      },
      {
        q: "Er kapslen vegansk?",
        a: "Ja. Kapselskallen er af plantebaseret pullulan, og produktet er glutenfrit og uden GMO.",
      },
      {
        q: "Hvor længe rækker en bøtte?",
        a: "60 kapsler og 1 kapsel dagligt giver 60 dage.",
      },
    ],
  },

  nasselblad: {
    eyebrow: "Urtica dioica · 10:1 bladekstrakt",
    headline: "Brændenældeblad, 430 mg pr. kapsel",
    intro:
      "Brændenældeblad er et 10:1-ekstrakt af bladene fra Urtica dioica – 430 mg pr. kapsel. 60 kapsler i vegansk kapselskal uden tilsætningsstoffer.",
    highlights: [
      { label: "Ekstrakt", value: "10:1" },
      { label: "Pr. kapsel", value: "430 mg" },
      { label: "Kapsler", value: "60 stk." },
    ],
    story: [
      {
        heading: "Bladet",
        body:
          "Brændenælde (Urtica dioica) har været brugt i europæisk urtetradition i århundreder. Vi bruger bladene, som tørres og koncentreres til et 10:1-ekstrakt – 10 dele tørret blad bliver til 1 del ekstrakt.",
      },
      {
        heading: "Ren sammensætning",
        body:
          "Kun brændenældebladekstrakt i et plantebaseret kapselskal. Vegansk, glutenfri og uden GMO – ingen bindemidler, fyldstoffer, sødestoffer eller kunstige konserveringsmidler.",
      },
      developedInSweden,
    ],
    specs: [
      { label: "Latinsk navn", value: "Urtica dioica" },
      { label: "Anvendt plantedel", value: "Blad" },
      { label: "Ekstraktstyrke", value: "10:1" },
      { label: "Pr. kapsel", value: "430 mg ekstrakt" },
      { label: "Daglig dosis", value: "1 kapsel dagligt" },
      { label: "Indhold", value: "60 kapsler – 60 dage" },
      { label: "Kapsel", value: "Vegansk" },
      { label: "Udviklet i", value: "Sverige" },
    ],
    ingredients:
      "Brændenældebladekstrakt (Urtica dioica, blad) 10:1, kapselskal (vegetabilsk). Indhold pr. kapsel: brændenældebladekstrakt 430 mg.",
    usage: [
      "1 kapsel dagligt med et glas vand.",
      "Den anbefalede daglige dosis må ikke overskrides.",
      "Opbevares køligt og tørt. Luk bøtten efter hver brug.",
      "Opbevares utilgængeligt for små børn.",
    ],
    faq: [
      {
        q: "Hvad betyder 10:1?",
        a: "At 10 dele tørret brændenældeblad er koncentreret til 1 del ekstrakt. Det er et mål for koncentration, intet andet.",
      },
      {
        q: "Hvilken plantedel bruges?",
        a: "Bladene fra brændenælde, som tørres og ekstraheres til et 10:1-koncentrat.",
      },
      {
        q: "Er kapslen vegansk?",
        a: "Ja. Kapselskallen er plantebaseret, og produktet er glutenfrit og uden GMO.",
      },
      {
        q: "Hvor længe rækker en bøtte?",
        a: "60 kapsler og 1 kapsel dagligt giver 60 dage.",
      },
    ],
  },

  druvkarneextrakt: {
    eyebrow: "Vitis vinifera · 95 % OPC",
    headline: "Druekerneekstrakt, 500 mg pr. kapsel",
    intro:
      "Druekerneekstrakt er et ekstrakt af kernerne fra Vitis vinifera standardiseret til 95 % proanthocyanidiner (OPC) – 500 mg pr. kapsel. 60 kapsler i vegansk kapselskal uden tilsætningsstoffer.",
    highlights: [
      { label: "Standardisering", value: "95 % OPC" },
      { label: "Pr. kapsel", value: "500 mg" },
      { label: "Kapsler", value: "60 stk." },
    ],
    story: [
      {
        heading: "Kernen",
        body:
          "Vindruen (Vitis vinifera) har været dyrket i Europa siden umindelige tider. Vi bruger kernerne, som er en naturlig kilde til polyfenoler, og ekstraherer dem til et koncentrat standardiseret til 95 % proanthocyanidiner – også kaldet OPC.",
      },
      {
        heading: "Ren sammensætning",
        body:
          "Kun druekerneekstrakt i et plantebaseret kapselskal. Vegansk, glutenfri og uden GMO – ingen bindemidler, fyldstoffer, sødestoffer eller kunstige konserveringsmidler.",
      },
      developedInSweden,
    ],
    specs: [
      { label: "Latinsk navn", value: "Vitis vinifera" },
      { label: "Anvendt plantedel", value: "Kerne" },
      { label: "Standardisering", value: "95 % proanthocyanidiner (OPC)" },
      { label: "Pr. kapsel", value: "500 mg ekstrakt" },
      { label: "Daglig dosis", value: "1–2 kapsler dagligt" },
      { label: "Indhold", value: "60 kapsler – 30–60 dage" },
      { label: "Kapsel", value: "Vegansk" },
      { label: "Udviklet i", value: "Sverige" },
    ],
    ingredients:
      "Druekerneekstrakt (Vitis vinifera, kerne) standardiseret til 95 % proanthocyanidiner, kapselskal (vegetabilsk). Indhold pr. kapsel: druekerneekstrakt 500 mg, heraf proanthocyanidiner 475 mg.",
    usage: [
      "1–2 kapsler dagligt med et glas vand.",
      "Den anbefalede daglige dosis må ikke overskrides.",
      "Opbevares køligt og tørt. Luk bøtten efter hver brug.",
      "Opbevares utilgængeligt for små børn.",
    ],
    faq: [
      {
        q: "Hvad betyder 95 % OPC?",
        a: "At ekstraktet er standardiseret, så 95 % udgøres af proanthocyanidiner. I 500 mg ekstrakt svarer det til 475 mg.",
      },
      {
        q: "Hvilken plantedel bruges?",
        a: "Kernerne fra vindruen, som ekstraheres og standardiseres på polyfenoler.",
      },
      {
        q: "Er kapslen vegansk?",
        a: "Ja. Kapselskallen er plantebaseret, og produktet er glutenfrit og uden GMO.",
      },
      {
        q: "Hvor længe rækker en bøtte?",
        a: "60 kapsler rækker til 30 dage ved 2 kapsler dagligt og 60 dage ved 1 kapsel dagligt.",
      },
    ],
  },

  quercetin: {
    eyebrow: "Quercetin · 98 % renhed",
    headline: "Quercetin, 500 mg pr. kapsel",
    intro:
      "Quercetin er en flavonoid, der forekommer naturligt i frugt og grøntsager. Vores ekstrakt har en renhed på 98 % – 500 mg pr. kapsel. 60 kapsler i vegansk kapselskal uden tilsætningsstoffer.",
    highlights: [
      { label: "Renhed", value: "98 %" },
      { label: "Pr. kapsel", value: "500 mg" },
      { label: "Kapsler", value: "60 stk." },
    ],
    story: [
      {
        heading: "Stoffet",
        body:
          "Quercetin er en plantebaseret flavonoid, der blandt andet findes i løg, æbler og bær. Vi vælger et ekstrakt med høj renhed – 98 % – så hver kapsel har det samme indhold, batch efter batch.",
      },
      {
        heading: "Ren sammensætning",
        body:
          "Kun quercetinekstrakt i et plantebaseret kapselskal. Vegansk, glutenfri og uden GMO – ingen bindemidler, fyldstoffer, sødestoffer eller kunstige konserveringsmidler.",
      },
      developedInSweden,
    ],
    specs: [
      { label: "Indhold", value: "Quercetinekstrakt" },
      { label: "Renhed", value: "98 % quercetin" },
      { label: "Pr. kapsel", value: "500 mg" },
      { label: "Daglig dosis", value: "1 kapsel dagligt" },
      { label: "Emballage", value: "60 kapsler – 60 dage" },
      { label: "Kapsel", value: "Vegansk" },
      { label: "Udviklet i", value: "Sverige" },
    ],
    ingredients:
      "Quercetinekstrakt (98 % quercetin), kapselskal (vegetabilsk). Indhold pr. kapsel: quercetinekstrakt 500 mg, heraf quercetin 490 mg.",
    usage: [
      "1 kapsel dagligt med et glas vand.",
      "Den anbefalede daglige dosis må ikke overskrides.",
      "Opbevares køligt og tørt. Luk bøtten efter hver brug.",
      "Opbevares utilgængeligt for små børn.",
    ],
    faq: [
      {
        q: "Hvad betyder 98 % renhed?",
        a: "At 98 % af ekstraktet udgøres af quercetin. I 500 mg ekstrakt svarer det til 490 mg quercetin.",
      },
      {
        q: "Hvor kommer quercetin fra?",
        a: "Quercetin er en flavonoid, der forekommer naturligt i frugt, grøntsager og urter.",
      },
      {
        q: "Er kapslen vegansk?",
        a: "Ja. Kapselskallen er plantebaseret, og produktet er glutenfrit og uden GMO.",
      },
      {
        q: "Hvor længe rækker en bøtte?",
        a: "60 kapsler rækker til 60 dage ved 1 kapsel dagligt.",
      },
    ],
  },

  reishi: {
    eyebrow: "Ganoderma lucidum · 40 % polysakkarider",
    headline: "Reishi, 350 mg pr. kapsel",
    intro:
      "Reishi (Ganoderma lucidum) i et standardiseret svampeekstrakt med 40 % polysakkarider – 350 mg pr. kapsel. 60 kapsler i vegansk kapselskal uden tilsætningsstoffer.",
    highlights: [
      { label: "Standardisering", value: "40 % polysakkarider" },
      { label: "Pr. kapsel", value: "350 mg" },
      { label: "Kapsler", value: "60 stk." },
    ],
    story: [
      {
        heading: "Svampen",
        body:
          "Reishi, Ganoderma lucidum, har været brugt i traditionel urtekultur i århundreder. Vores ekstrakt er koncentreret og standardiseret til 40 % polysakkarider, så indholdet er det samme i hver kapsel.",
      },
      {
        heading: "Ren sammensætning",
        body:
          "Kun reishiekstrakt i et plantebaseret kapselskal. Vegansk, glutenfri og uden GMO – ingen bindemidler, fyldstoffer, sødestoffer eller kunstige konserveringsmidler.",
      },
      developedInSweden,
    ],
    specs: [
      { label: "Latinsk navn", value: "Ganoderma lucidum" },
      { label: "Standardisering", value: "40 % polysakkarider" },
      { label: "Pr. kapsel", value: "350 mg" },
      { label: "Daglig dosis", value: "1 kapsel dagligt" },
      { label: "Emballage", value: "60 kapsler – 60 dage" },
      { label: "Kapsel", value: "Vegansk" },
      { label: "Udviklet i", value: "Sverige" },
    ],
    ingredients:
      "Reishiekstrakt (Ganoderma lucidum) standardiseret til 40 % polysakkarider, kapselskal (vegetabilsk). Indhold pr. kapsel: reishiekstrakt 350 mg, heraf polysakkarider 140 mg.",
    usage: [
      "1 kapsel dagligt med et glas vand.",
      "Den anbefalede daglige dosis må ikke overskrides.",
      "Opbevares køligt og tørt. Luk bøtten efter hver brug.",
      "Opbevares utilgængeligt for små børn.",
    ],
    faq: [
      {
        q: "Hvad betyder 40 % polysakkarider?",
        a: "At ekstraktet er standardiseret, så 40 % udgøres af polysakkarider. I 350 mg ekstrakt svarer det til 140 mg.",
      },
      {
        q: "Hvilken svamp bruges?",
        a: "Ganoderma lucidum, almindeligvis kaldet reishi.",
      },
      {
        q: "Er kapslen vegansk?",
        a: "Ja. Kapselskallen er plantebaseret, og produktet er glutenfrit og uden GMO.",
      },
      {
        q: "Hvor længe rækker en bøtte?",
        a: "60 kapsler rækker til 60 dage ved 1 kapsel dagligt.",
      },
    ],
  },

  chaga: {
    eyebrow: "Inonotus obliquus · 30:1 ekstrakt",
    headline: "Chaga, 400 mg pr. kapsel",
    intro:
      "Chaga (Inonotus obliquus) i et 30:1-ekstrakt standardiseret til 10 % polysakkarider – 400 mg pr. kapsel. 60 kapsler i vegansk kapselskal uden tilsætningsstoffer.",
    highlights: [
      { label: "Ekstrakt", value: "30:1" },
      { label: "Pr. kapsel", value: "400 mg" },
      { label: "Kapsler", value: "60 stk." },
    ],
    story: [
      {
        heading: "Svampen",
        body:
          "Chaga vokser langsomt på birk og optager næring fra træet gennem mange år. Vores ekstrakt kommer fra vildthøstet chaga af høj kvalitet, koncentreret 30:1 og standardiseret til 10 % polysakkarider.",
      },
      {
        heading: "Ren sammensætning",
        body:
          "Kun chagaekstrakt i et plantebaseret kapselskal. Vegansk, glutenfri og uden GMO – ingen bindemidler, fyldstoffer, sødestoffer eller kunstige konserveringsmidler.",
      },
      developedInSweden,
    ],
    specs: [
      { label: "Latinsk navn", value: "Inonotus obliquus" },
      { label: "Ekstrakt", value: "30:1" },
      { label: "Standardisering", value: "10 % polysakkarider" },
      { label: "Pr. kapsel", value: "400 mg" },
      { label: "Daglig dosis", value: "1 kapsel dagligt" },
      { label: "Emballage", value: "60 kapsler – 60 dage" },
      { label: "Kapsel", value: "Vegansk" },
      { label: "Udviklet i", value: "Sverige" },
    ],
    ingredients:
      "Chagaekstrakt (Inonotus obliquus) 30:1 standardiseret til 10 % polysakkarider, kapselskal (vegetabilsk). Indhold pr. kapsel: chagaekstrakt 400 mg, heraf polysakkarider 40 mg.",
    usage: [
      "1 kapsel dagligt med et glas vand.",
      "Den anbefalede daglige dosis må ikke overskrides.",
      "Opbevares køligt og tørt. Luk bøtten efter hver brug.",
      "Opbevares utilgængeligt for små børn.",
    ],
    faq: [
      {
        q: "Hvad betyder 30:1?",
        a: "At 30 dele råvare er koncentreret til 1 del ekstrakt. 400 mg ekstrakt svarer til ca. 12 g tørret chaga.",
      },
      {
        q: "Hvad betyder 10 % polysakkarider?",
        a: "At ekstraktet er standardiseret, så 10 % udgøres af polysakkarider – 40 mg pr. kapsel.",
      },
      {
        q: "Er kapslen vegansk?",
        a: "Ja. Kapselskallen er plantebaseret, og produktet er glutenfrit og uden GMO.",
      },
      {
        q: "Hvor længe rækker en bøtte?",
        a: "60 kapsler rækker til 60 dage ved 1 kapsel dagligt.",
      },
    ],
  },

  "lions-mane": {
    eyebrow: "Hericium erinaceus · 60 % polysakkarider",
    headline: "Lion's Mane, 500 mg pr. kapsel",
    intro:
      "Lion's Mane (Hericium erinaceus) i et standardiseret svampeekstrakt med 60 % polysakkarider, heraf 45 % betaglucaner – 500 mg pr. kapsel. 60 kapsler i vegansk kapselskal uden tilsætningsstoffer.",
    highlights: [
      { label: "Standardisering", value: "60 % polysakkarider" },
      { label: "Pr. kapsel", value: "500 mg" },
      { label: "Kapsler", value: "60 stk." },
    ],
    story: [
      {
        heading: "Svampen",
        body:
          "Lion's Mane, Hericium erinaceus, har en lang historie i traditionel urtekultur i Østasien. Vores ekstrakt er koncentreret og standardiseret til 60 % polysakkarider, heraf 45 % betaglucaner, så indholdet er det samme i hver kapsel.",
      },
      {
        heading: "Ren sammensætning",
        body:
          "Kun Lion's Mane-ekstrakt i et plantebaseret kapselskal. Vegansk, glutenfri og uden GMO – ingen bindemidler, fyldstoffer, sødestoffer eller kunstige konserveringsmidler.",
      },
      developedInSweden,
    ],
    specs: [
      { label: "Latinsk navn", value: "Hericium erinaceus" },
      { label: "Standardisering", value: "60 % polysakkarider" },
      { label: "Heraf betaglucaner", value: "45 %" },
      { label: "Pr. kapsel", value: "500 mg" },
      { label: "Daglig dosis", value: "1 kapsel dagligt" },
      { label: "Emballage", value: "60 kapsler – 60 dage" },
      { label: "Kapsel", value: "Vegansk" },
      { label: "Udviklet i", value: "Sverige" },
    ],
    ingredients:
      "Lion's Mane-ekstrakt (Hericium erinaceus) standardiseret til 60 % polysakkarider, heraf 45 % betaglucaner, kapselskal (vegetabilsk). Indhold pr. kapsel: ekstrakt 500 mg, heraf polysakkarider 300 mg og betaglucaner 225 mg.",
    usage: [
      "1 kapsel dagligt med et glas vand.",
      "Den anbefalede daglige dosis må ikke overskrides.",
      "Opbevares køligt og tørt. Luk bøtten efter hver brug.",
      "Opbevares utilgængeligt for små børn.",
    ],
    faq: [
      {
        q: "Hvad betyder 60 % polysakkarider?",
        a: "At ekstraktet er standardiseret, så 60 % udgøres af polysakkarider. I 500 mg ekstrakt svarer det til 300 mg.",
      },
      {
        q: "Hvad er betaglucaner?",
        a: "En bestemt gruppe polysakkarider. I vores ekstrakt udgør de 45 %, det vil sige 225 mg pr. kapsel.",
      },
      {
        q: "Er kapslen vegansk?",
        a: "Ja. Kapselskallen er plantebaseret, og produktet er glutenfrit og uden GMO.",
      },
      {
        q: "Hvor længe rækker en bøtte?",
        a: "60 kapsler rækker til 60 dage ved 1 kapsel dagligt.",
      },
    ],
  },

  cordyceps: {
    eyebrow: "Cordyceps militaris · 8:1 ekstrakt",
    headline: "Cordyceps, 350 mg pr. kapsel",
    intro:
      "Cordyceps (Cordyceps militaris) i et 8:1-ekstrakt standardiseret til 40 % polysakkarider – 350 mg pr. kapsel. 60 kapsler i vegansk kapselskal uden tilsætningsstoffer.",
    highlights: [
      { label: "Ekstrakt", value: "8:1" },
      { label: "Pr. kapsel", value: "350 mg" },
      { label: "Kapsler", value: "60 stk." },
    ],
    story: [
      {
        heading: "Svampen",
        body:
          "Cordyceps har længe haft en plads i østasiatisk urtekultur. Vores ekstrakt kommer fra omhyggeligt udvalgt Cordyceps militaris, koncentreret 8:1 og standardiseret til 40 % polysakkarider, så indholdet er det samme i hver kapsel.",
      },
      {
        heading: "Ren sammensætning",
        body:
          "Kun cordycepsekstrakt i et plantebaseret kapselskal. Vegansk, glutenfri og uden GMO – ingen bindemidler, fyldstoffer, sødestoffer eller kunstige konserveringsmidler.",
      },
      developedInSweden,
    ],
    specs: [
      { label: "Latinsk navn", value: "Cordyceps militaris" },
      { label: "Ekstrakt", value: "8:1" },
      { label: "Standardisering", value: "40 % polysakkarider" },
      { label: "Pr. kapsel", value: "350 mg" },
      { label: "Daglig dosis", value: "1 kapsel dagligt" },
      { label: "Emballage", value: "60 kapsler – 60 dage" },
      { label: "Kapsel", value: "Vegansk" },
      { label: "Udviklet i", value: "Sverige" },
    ],
    ingredients:
      "Cordycepsekstrakt (Cordyceps militaris) 8:1 standardiseret til 40 % polysakkarider, kapselskal (vegetabilsk). Indhold pr. kapsel: cordycepsekstrakt 350 mg, heraf polysakkarider 140 mg.",
    usage: [
      "1 kapsel dagligt med et glas vand.",
      "Den anbefalede daglige dosis må ikke overskrides.",
      "Opbevares køligt og tørt. Luk bøtten efter hver brug.",
      "Opbevares utilgængeligt for små børn.",
    ],
    faq: [
      {
        q: "Hvad betyder 8:1?",
        a: "At 8 dele råvare er koncentreret til 1 del ekstrakt. 350 mg ekstrakt svarer til ca. 2,8 g tørret cordyceps.",
      },
      {
        q: "Hvad betyder 40 % polysakkarider?",
        a: "At ekstraktet er standardiseret, så 40 % udgøres af polysakkarider – 140 mg pr. kapsel.",
      },
      {
        q: "Er kapslen vegansk?",
        a: "Ja. Kapselskallen er plantebaseret, og produktet er glutenfrit og uden GMO.",
      },
      {
        q: "Hvor længe rækker en bøtte?",
        a: "60 kapsler rækker til 60 dage ved 1 kapsel dagligt.",
      },
    ],
  },

  ashwagandha: {
    eyebrow: "Withania somnifera · 10 % withanolider",
    headline: "Ashwagandha, 400 mg pr. kapsel",
    intro:
      "Et standardiseret rodekstrakt af Withania somnifera med 10 % withanolider – 400 mg pr. kapsel. 60 kapsler i vegansk kapselskal, uden tilsætningsstoffer.",
    highlights: [
      { label: "Standardisering", value: "10 % withanolider" },
      { label: "Pr. kapsel", value: "400 mg" },
      { label: "Kapsler", value: "60 stk." },
    ],
    story: [
      {
        heading: "Roden, ikke hele planten",
        body:
          "Ashwagandha kaldes også indisk ginseng og har en lang tradition i ayurvedisk urtekultur. Vores ekstrakt kommer udelukkende fra roden. Billigere varianter males ofte af hele planten, inklusive blade og stængel, hvilket giver et helt andet indhold.",
      },
      {
        heading: "Standardiseret til 10 %",
        body:
          "Withanolider er de stoffer, der måles i et ashwagandhaekstrakt. Vores er standardiseret til 10 %. 400 mg ekstrakt svarer til 40 mg withanolider i hver kapsel.",
      },
      {
        heading: "Ren sammensætning",
        body:
          "Kun ekstraktet og et plantebaseret kapselskal. Ingen bindemidler, fyldstoffer eller antiklumpningsmidler, og intet tilsat for at strække indholdet.",
      },
    ],
    specs: [
      { label: "Latinsk navn", value: "Withania somnifera" },
      { label: "Plantedel", value: "Rod" },
      { label: "Standardisering", value: "10 % withanolider" },
      { label: "Pr. kapsel", value: "400 mg ekstrakt, heraf 40 mg withanolider" },
      { label: "Daglig dosis", value: "2–3 kapsler dagligt" },
      { label: "Emballage", value: "60 kapsler" },
      { label: "Kapsel", value: "Vegansk (HPMC)" },
    ],
    ingredients:
      "Ashwagandhaekstrakt (Withania somnifera, rod) standardiseret til 10 % withanolider, kapselskal (vegetabilsk, HPMC). Indhold pr. kapsel: ashwagandhaekstrakt 400 mg, heraf withanolider 40 mg.",
    usage: [
      "2–3 kapsler dagligt med et glas vand.",
      "Den anbefalede daglige dosis må ikke overskrides.",
      "Opbevares køligt og tørt. Luk bøtten efter hver brug.",
      "Opbevares utilgængeligt for små børn.",
    ],
    faq: [
      {
        q: "Hvad betyder 10 % withanolider?",
        a: "At ekstraktet er standardiseret, så 10 % udgøres af withanolider. I 400 mg ekstrakt svarer det til 40 mg.",
      },
      {
        q: "Hvilken del af planten bruges?",
        a: "Kun roden. Blade og stængel bruges ikke.",
      },
      {
        q: "Er kapslen vegansk?",
        a: "Ja. Kapselskallen er plantebaseret (HPMC).",
      },
      {
        q: "Hvor mange kapsler indeholder bøtten?",
        a: "60 kapsler.",
      },
    ],
  },

  "pine-pollen": {
    eyebrow: "Fyrrepollen · 99 % rent ekstrakt",
    headline: "Pine Pollen, 300 mg pr. kapsel",
    intro:
      "Pollen fra fyrretræer i et 99 % rent ekstrakt med knækkede cellevægge – 300 mg pr. kapsel. 60 kapsler i vegansk kapselskal, uden tilsætningsstoffer.",
    highlights: [
      { label: "Renhed", value: "99 %" },
      { label: "Pr. kapsel", value: "300 mg" },
      { label: "Kapsler", value: "60 stk." },
    ],
    story: [
      {
        heading: "Forårets gule støv",
        body:
          "I nogle uger om foråret slipper fyrretræet sit pollen, et fint gult støv, der lægger sig over jord og vand. Høsten sker i den korte periode, hvor pollenet findes, og derfor er råvaren sæsonbestemt.",
      },
      {
        heading: "Knækkede cellevægge",
        body:
          "Et pollenkorn har en hård ydre skal. I vores ekstrakt er cellevæggene knækket, hvilket er det trin, der gør kornets indhold tilgængeligt i stedet for at det passerer ubrudt igennem.",
      },
      {
        heading: "Ren sammensætning",
        body:
          "99 % rent pollenekstrakt og et plantebaseret kapselskal. Ingen bindemidler, fyldstoffer eller antiklumpningsmidler.",
      },
    ],
    specs: [
      { label: "Råvare", value: "Pollen fra fyrretræer" },
      { label: "Renhed", value: "99 %" },
      { label: "Forarbejdning", value: "Knækkede cellevægge" },
      { label: "Pr. kapsel", value: "300 mg" },
      { label: "Daglig dosis", value: "1–3 kapsler dagligt" },
      { label: "Emballage", value: "60 kapsler" },
      { label: "Kapsel", value: "Vegansk (HPMC)" },
    ],
    ingredients:
      "Fyrrepollenekstrakt (99 % rent, knækkede cellevægge), kapselskal (vegetabilsk, HPMC). Indhold pr. kapsel: pollenekstrakt 300 mg.",
    usage: [
      "1–3 kapsler dagligt med et glas vand.",
      "Den anbefalede daglige dosis må ikke overskrides.",
      "Opbevares køligt og tørt. Luk bøtten efter hver brug.",
      "Opbevares utilgængeligt for små børn.",
    ],
    faq: [
      {
        q: "Hvad betyder knækkede cellevægge?",
        a: "Pollenkornets ydre skal er åbnet under forarbejdningen, så indholdet bliver tilgængeligt i stedet for at passere ubrudt igennem.",
      },
      {
        q: "Hvornår høstes pollenet?",
        a: "I den korte periode om foråret, hvor fyrretræet slipper sit pollen.",
      },
      {
        q: "Er kapslen vegansk?",
        a: "Ja. Kapselskallen er plantebaseret (HPMC).",
      },
      {
        q: "Hvor mange kapsler indeholder bøtten?",
        a: "60 kapsler.",
      },
    ],
  },
};
