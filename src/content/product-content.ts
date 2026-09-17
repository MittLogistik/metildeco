/**
 * Unikt landningssidesinnehåll per produkt (svenska).
 * Kopierat från exporten – översättningar per språk läggs till senare.
 *
 * VIKTIGT – regelefterlevnad:
 * Texterna får INTE innehålla hälsopåståenden. Beskriv botanik, ursprung,
 * odling, extraktion, format, dosering, tester och traditionell användning
 * – aldrig effekt på kropp, hälsa eller sjukdom.
 */
export type Spec = { label: string; value: string };
export type Faq = { q: string; a: string };
export type StorySection = { heading: string; body: string };

export type ProductContent = {
  /** Kort kursiv rad överst på landningssidan */
  eyebrow: string;
  /** Stor rubrik i produktens egen hero-sektion */
  headline: string;
  /** Ingress under rubriken */
  intro: string;
  /** Tre snabba nyckeltal i hero-raden */
  highlights: { label: string; value: string }[];
  /** 2–3 unika berättande sektioner */
  story: StorySection[];
  /** Faktatabell */
  specs: Spec[];
  /** Innehållsförteckning */
  ingredients: string;
  /** Så använder du produkten */
  usage: string[];
  /** Vanliga frågor */
  faq: Faq[];
};

export const productContent: Record<string, ProductContent> = {
  "tongkat-ali-elite": {
    eyebrow: "Eurycoma longifolia · 200:1 rotextrakt",
    headline: "Ren rot, 450 mg per kapsel",
    intro:
      "Tongkat Ali Elite är ett koncentrerat 200:1-extrakt av roten från Eurycoma longifolia – även kallad Malaysian Ginseng eller Longjack. Tillverkad i Sverige, i vegansk kapsel, utan tillsatser.",
    highlights: [
      { label: "Extrakt", value: "200:1" },
      { label: "Per kapsel", value: "450 mg" },
      { label: "Kapslar", value: "60 st" },
    ],
    story: [
      {
        heading: "Roten",
        body:
          "Vi utgår från noggrant utvalda rötter av Eurycoma longifolia, en botanisk råvara med lång tradition i Sydostasien. Roten torkas, males och koncentreras till ett 200:1-extrakt – 200 delar torkad rot blir 1 del extrakt.",
      },
      {
        heading: "Ren sammansättning",
        body:
          "Bara rotextrakt i ett växtbaserat kapselskal. Vegansk, glutenfri och utan GMO – inga bindemedel, fyllnadsmedel, sötningsmedel eller konstgjorda konserveringsmedel.",
      },
      {
        heading: "Tillverkad i Sverige",
        body:
          "Produktionen sker i Sverige enligt europeiska tillverkningskrav, med kontroll av råvara och batch. Förpackningen är en återförslutningsbar, återvinningsbar pappersbaserad påse som håller innehållet torrt mellan doserna.",
      },
    ],
    specs: [
      { label: "Latinskt namn", value: "Eurycoma longifolia" },
      { label: "Använd växtdel", value: "Rot" },
      { label: "Extraktstyrka", value: "200:1" },
      { label: "Per kapsel", value: "450 mg rotextrakt" },
      { label: "Dagsdos", value: "1 kapsel dagligen" },
      { label: "Innehåll", value: "60 kapslar – 60 dagar" },
      { label: "Kapsel", value: "Vegansk (HPMC)" },
      { label: "Tillverkad i", value: "Sverige" },
    ],
    ingredients:
      "Tongkat Ali-extrakt (Eurycoma longifolia, rot) 200:1, kapselskal (HPMC). Innehåll per kapsel: Tongkat Ali-extrakt (200:1) 450 mg.",
    usage: [
      "1 kapsel dagligen med ett glas vatten.",
      "Överskrid inte rekommenderad dagsdos.",
      "Förvaras torrt i rumstemperatur. Återförslut burken efter varje användning.",
      "Förvaras utom räckhåll för små barn.",
    ],
    faq: [
      {
        q: "Vad betyder 200:1?",
        a: "Att 200 delar torkad rot koncentrerats till 1 del extrakt. Det är ett mått på koncentration, inget annat.",
      },
      {
        q: "Hur länge räcker en påse?",
        a: "60 kapslar och 1 kapsel dagligen ger 60 dagar.",
      },
      {
        q: "Är kapseln vegansk?",
        a: "Ja. Kapselskalet är växtbaserat (HPMC) och produkten är glutenfri och utan GMO.",
      },
      {
        q: "Innehåller den fyllnadsmedel?",
        a: "Nej. Bara rotextrakt och kapselskal – inga bindemedel, sötningsmedel eller konstgjorda konserveringsmedel.",
      },
    ],
  },


  "tongkat-premium": {
    eyebrow: "Eurycoma longifolia · 200:1, 4 % eurycomanon",
    headline: "Vår starkaste standardisering",
    intro:
      "Tongkat Ali Ultra 4% är ett 200:1-rotextrakt standardiserat till 4 % eurycomanon – 500 mg per kapsel, varav 20 mg eurycomanon. Ett koncentrat för den som vill ha högsta styrkan. Ta inte på tom mage.",
    highlights: [
      { label: "Extrakt", value: "200:1 · 4 %" },
      { label: "Per kapsel", value: "500 mg" },
      { label: "Kapslar", value: "30 st" },
    ],
    story: [
      {
        heading: "Roten",
        body:
          "Vi utgår från noggrant utvalda rötter av Eurycoma longifolia – även kallad Malaysian Ginseng eller Longjack – en botanisk råvara med lång tradition i Sydostasien. Roten koncentreras till ett 200:1-extrakt.",
      },
      {
        heading: "Standardiserad till 4 %",
        body:
          "Varje batch standardiseras till 4 % eurycomanon, vilket ger 20 mg eurycomanon per kapsel. Det är en tydligt högre standardisering än vanliga rotextrakt – och därför räcker en kapsel om dagen.",
      },
      {
        heading: "Tillverkad i Sverige",
        body:
          "Tillverkad i Sverige i små batcher enligt europeiska kvalitets- och säkerhetskrav. Förpackad i en återförslutningsbar, återvinningsbar pappersbaserad påse som håller innehållet torrt mellan doserna.",
      },
    ],
    specs: [
      { label: "Latinskt namn", value: "Eurycoma longifolia" },
      { label: "Använd växtdel", value: "Rot" },
      { label: "Extraktstyrka", value: "200:1, standardiserad till 4 % eurycomanon" },
      { label: "Per kapsel", value: "500 mg rotextrakt (20 mg eurycomanon)" },
      { label: "Dagsdos", value: "1 kapsel dagligen" },
      { label: "Innehåll", value: "30 kapslar – 30 dagar" },
      { label: "Kapsel", value: "Vegansk (HPMC)" },
      { label: "Tillverkad i", value: "Sverige" },
    ],
    ingredients:
      "Tongkat Ali-extrakt (Eurycoma longifolia, rot) 200:1, standardiserat till 4 % eurycomanon, kapselskal (HPMC). Innehåll per kapsel: Tongkat Ali-extrakt (200:1) 500 mg, varav eurycomanon 20 mg.",
    usage: [
      "1 kapsel dagligen med ett glas vatten.",
      "Ta inte på fastande mage – extraktet är mycket starkt.",
      "Överskrid inte rekommenderad dagsdos.",
      "Förvaras torrt i rumstemperatur. Återförslut burken efter varje användning.",
      "Förvaras utom räckhåll för små barn.",
    ],
    faq: [
      {
        q: "Vad betyder 4 % eurycomanon?",
        a: "Att extraktet standardiserats så att 4 % utgörs av eurycomanon – 20 mg per kapsel. Det gör styrkan jämn mellan batcher.",
      },
      {
        q: "Vad skiljer Ultra 4% från Elite?",
        a: "Elite är ett 200:1-rotextrakt på 450 mg per kapsel utan procentstandardisering. Ultra 4% är standardiserat till 4 % eurycomanon och innehåller 500 mg per kapsel.",
      },
      {
        q: "Hur länge räcker en påse?",
        a: "30 kapslar och 1 kapsel dagligen ger 30 dagar.",
      },
      {
        q: "Innehåller den fyllnadsmedel?",
        a: "Nej. Bara rotextrakt och ett veganskt kapselskal – inga bindemedel, fyllnadsmedel eller konstgjorda konserveringsmedel.",
      },
    ],
  },

  "cistanche-tubulosa": {
    eyebrow: "Cistanche tubulosa · Ökenväxt",
    headline: "Öknens ginseng",
    intro:
      "En parasitisk ökenväxt som växer på rötterna hos saxaulbusken. Vårt extrakt är standardiserat på echinakosider och verifierat av tredje part.",
    highlights: [
      { label: "Standardiserad", value: "Echinakosider" },
      { label: "Dagsdos", value: "500 mg" },
      { label: "Kapslar", value: "60 st" },
    ],
    story: [
      {
        heading: "En ovanlig växt",
        body:
          "Cistanche saknar klorofyll och lever kopplad till värdväxtens rötter i torra ökenområden. Den skördas för hand innan blomning, då stammen är som mest kompakt.",
      },
      {
        heading: "Standardiserat innehåll",
        body:
          "Vi standardiserar extraktet på echinakosider, växtens mest kända markörsubstans. Standardisering betyder att innehållet är detsamma i varje kapsel, oavsett skördeår.",
      },
      {
        heading: "Lång tradition",
        body:
          "Cistanche är dokumenterad i kinesiska örtsamlingar sedan Handynastin och kallas där ofta för 'öknens ginseng'.",
      },
    ],
    specs: [
      { label: "Latinskt namn", value: "Cistanche tubulosa" },
      { label: "Använd växtdel", value: "Stam" },
      { label: "Standardisering", value: "Echinakosider" },
      { label: "Dagsdos", value: "2 kapslar (500 mg extrakt)" },
      { label: "Innehåll", value: "60 kapslar – 30 dagar" },
    ],
    ingredients:
      "Cistanche tubulosa-extrakt, kapselskal (hydroxipropylmetylcellulosa).",
    usage: [
      "2 kapslar per dag med vatten.",
      "Kan tas när som helst på dygnet.",
      "Överskrid inte rekommenderad dagsdos.",
    ],
    faq: [
      {
        q: "Vad är echinakosider?",
        a: "En grupp naturligt förekommande ämnen i växten som används som markör för att mäta extraktets kvalitet.",
      },
      {
        q: "Är produkten vegansk?",
        a: "Ja, kapselskalet är växtbaserat.",
      },
    ],
  },

  "fadogia-agrestis": {
    eyebrow: "Fadogia agrestis · 20:1 örtextrakt",
    headline: "Ren växt, 450 mg per kapsel",
    intro:
      "Ett 20:1-extrakt av Fadogia agrestis, en buske med lång tradition i västafrikansk örtanvändning. 450 mg per kapsel i vegansk kapsel – utan tillsatser. Tillverkad i Sverige.",
    highlights: [
      { label: "Extrakt", value: "20:1" },
      { label: "Per kapsel", value: "450 mg" },
      { label: "Kapslar", value: "60 st" },
    ],
    story: [
      {
        heading: "Växten",
        body:
          "Fadogia agrestis är en buske som växer i delar av Afrika och länge haft en självklar plats i traditionella örtberedningar. Vi använder noggrant utvalda växtdelar som koncentreras till ett 20:1-extrakt – för jämn styrka i varje kapsel.",
      },
      {
        heading: "Ren sammansättning",
        body:
          "Bara Fadogia agrestis-extrakt i ett växtbaserat kapselskal. Vegansk, glutenfri och utan GMO – inga bindemedel, fyllnadsmedel eller konstgjorda konserveringsmedel.",
      },
      {
        heading: "Tillverkad i Sverige",
        body:
          "Producerad i små batcher i Sverige med noggrann kvalitetskontroll och europeiska säkerhetskrav. Förpackad i en återförslutningsbar, återvinningsbar pappersbaserad påse som håller innehållet fräscht mellan doserna.",
      },
    ],
    specs: [
      { label: "Latinskt namn", value: "Fadogia agrestis" },
      { label: "Extraktstyrka", value: "20:1" },
      { label: "Per kapsel", value: "450 mg extrakt" },
      { label: "Dagsdos", value: "1 kapsel dagligen" },
      { label: "Innehåll", value: "60 kapslar – 60 dagar" },
      { label: "Kapsel", value: "Vegansk (HPMC)" },
      { label: "Tillverkad i", value: "Sverige" },
    ],
    ingredients:
      "Fadogia agrestis-extrakt 20:1, kapselskal (HPMC). Innehåll per kapsel: Fadogia agrestis-extrakt (20:1) 450 mg.",
    usage: [
      "1 kapsel dagligen med ett glas vatten.",
      "Överskrid inte rekommenderad dagsdos.",
      "Förvaras torrt i rumstemperatur. Återförslut burken efter varje användning.",
      "Förvaras utom räckhåll för små barn.",
    ],
    faq: [
      {
        q: "Vad betyder 20:1?",
        a: "Att 20 delar torkad växtråvara koncentrerats till 1 del extrakt. Det är ett mått på koncentration, inget annat.",
      },
      {
        q: "Kan jag kombinera med Tongkat Ali?",
        a: "Många gör det. Följ rekommenderad dagsdos för respektive produkt.",
      },
      {
        q: "Hur länge räcker en påse?",
        a: "60 kapslar och 1 kapsel dagligen ger 60 dagar.",
      },
      {
        q: "Innehåller den fyllnadsmedel?",
        a: "Nej. Bara extrakt och ett veganskt kapselskal – inga bindemedel, sötningsmedel eller konstgjorda konserveringsmedel.",
      },
    ],
  },

  "blue-lotus": {
    eyebrow: "Nymphaea caerulea · 200:1 extrakt",
    headline: "Nilens heliga blomma, 400 mg per kapsel",
    intro:
      "Ett extremt högkoncentrerat 200:1-extrakt av Blue Lotus – en av marknadens högsta koncentrationer. Ren råvara utan tillsatser, fyllmedel eller konstgjorda ämnen, i vegansk kapsel.",
    highlights: [
      { label: "Extrakt", value: "200:1" },
      { label: "Per kapsel", value: "400 mg" },
      { label: "Dagsdos", value: "1–2 kapslar" },
    ],
    story: [
      {
        heading: "Helig i det forntida Egypten",
        body:
          "Blue Lotus (Nymphaea caerulea), den blå näckrosen, växte vild längs Nilens stränder i det forntida Egypten, där den hade helig status och ofta avbildades i hieroglyfer och tempelmålningar.",
      },
      {
        heading: "Extremt högkoncentrerat",
        body:
          "Vårt extrakt är ett 200:1-koncentrat, vilket innebär att 200 delar torkad blomma koncentrerats till 1 del extrakt. Ren råvara – utan tillsatser, fyllmedel eller konstgjorda ämnen.",
      },
      {
        heading: "Tradition möter modern renhet",
        body:
          "Bara blomextrakt i ett växtbaserat kapselskal av sjögräsbaserad cellulosa. Vegansk, utan onödiga tillsatser, och kvalitetskontrollerad enligt europeiska säkerhetskrav.",
      },
    ],
    specs: [
      { label: "Latinskt namn", value: "Nymphaea caerulea" },
      { label: "Extraktstyrka", value: "200:1" },
      { label: "Per kapsel", value: "400 mg extrakt" },
      { label: "Dagsdos", value: "1–2 kapslar (400–800 mg)" },
      { label: "Kapsel", value: "Vegansk (HPMC)" },
      { label: "Tillsatser", value: "Inga" },
    ],
    ingredients:
      "Blue Lotus-extrakt (Nymphaea caerulea) 200:1, växtbaserad kapsel (HPMC). Innehåll per kapsel: 400 mg blå lotusextrakt. Vid 2 kapslar: 800 mg blå lotusextrakt.",
    usage: [
      "1–2 kapslar per dag med vatten.",
      "Överskrid inte rekommenderad dagsdos.",
      "Ej för användning eller köp av personer under 18 år.",
      "Rådgör med vårdgivare om du är gravid, ammar eller står under medicinsk övervakning.",
      "Förvaras torrt i rumstemperatur, utom räckhåll för små barn.",
    ],
    faq: [
      {
        q: "Vad betyder 200:1?",
        a: "Att 200 delar torkad blomma koncentrerats till 1 del extrakt. Det är ett mått på koncentration, inget annat.",
      },
      {
        q: "Innehåller den tillsatser?",
        a: "Nej. Bara blue lotus-extrakt och ett växtbaserat kapselskal – inga fyllmedel eller konstgjorda ämnen.",
      },
      {
        q: "Är produkten vegansk?",
        a: "Ja, kapselskalet är växtbaserat (sjögräsbaserad cellulosa).",
      },
      {
        q: "När på dygnet tar man den?",
        a: "Tidpunkten är upp till dig. Många väljer kvällen som en fast punkt i rutinen.",
      },
    ],
  },

  "parasite-cleanse": {
    eyebrow: "Örtkomplex · 30-dagarskur",
    headline: "Tre örter, en kur",
    intro:
      "Malört, svartvalnöt och nejlika i ett och samma komplex – en klassisk örtkombination förpackad som en avgränsad kur om 90 kapslar.",
    highlights: [
      { label: "Örter", value: "3 st" },
      { label: "Format", value: "Kur" },
      { label: "Kapslar", value: "90 st" },
    ],
    story: [
      {
        heading: "Den klassiska trion",
        body:
          "Kombinationen malört (Artemisia absinthium), svartvalnötsskal (Juglans nigra) och nejlika (Syzygium aromaticum) är en av de mest välkända örtkombinationerna inom traditionell örtanvändning.",
      },
      {
        heading: "Tänkt som en period",
        body:
          "Till skillnad från våra dagliga tillskott är det här en kur som görs under en avgränsad period. Kurschemat står tryckt på förpackningen.",
      },
      {
        heading: "Utan magnesiumstearat",
        body:
          "Kapslarna pressas utan magnesiumstearat och innehåller enbart örtpulver och extrakt samt växtbaserat kapselskal.",
      },
    ],
    specs: [
      { label: "Innehåller", value: "Malört, svartvalnöt, nejlika" },
      { label: "Dagsdos", value: "3 kapslar" },
      { label: "Innehåll", value: "90 kapslar – 30 dagar" },
      { label: "Format", value: "Kur, avgränsad period" },
      { label: "Tillsatser", value: "Utan magnesiumstearat" },
    ],
    ingredients:
      "Malörtsextrakt (Artemisia absinthium), svartvalnötsskal (Juglans nigra), nejlika (Syzygium aromaticum), kapselskal (hydroxipropylmetylcellulosa).",
    usage: [
      "3 kapslar per dag i samband med måltid.",
      "Kuren görs under 30 dagar.",
      "Överskrid inte rekommenderad dagsdos.",
    ],
    faq: [
      {
        q: "Hur ofta kan kuren göras?",
        a: "Produkten är avsedd för avgränsade perioder, inte som dagligt tillskott året runt.",
      },
      {
        q: "Innehåller den nötter?",
        a: "Ja, svartvalnötsskal. Undvik vid nötallergi.",
      },
    ],
  },

  "black-tongkat": {
    eyebrow: "Polyalthia bullata · Borneos svarta rot",
    headline: "Den svarta roten – 200:1, en månads kur",
    intro:
      "Black Tongkat Ali är inte samma växt som den gula. Den kommer från Polyalthia bullata, en långsamt växande regnskogsväxt vars mörka rot skördas för hand och koncentreras 200:1. Två kapslar om dagen – 1 000 mg, inget annat.",
    highlights: [
      { label: "Extrakt", value: "200:1" },
      { label: "Per kapsel", value: "500 mg" },
      { label: "Dosering", value: "2 kapslar/dag" },
    ],
    story: [
      {
        heading: "En helt egen växt",
        body:
          "Gul Tongkat Ali är Eurycoma longifolia. Black Tongkat Ali är Polyalthia bullata – en annan art, med en märkbart mörkare, nästan svart rotved. Namnlikheten har gjort att de ofta blandas ihop; vi anger alltid det latinska namnet på burken så att du vet exakt vad du köper.",
      },
      {
        heading: "Handskördad rot, 200:1",
        body:
          "Roten skördas för hand från äldre plantor i Sydostasiens regnskog, tvättas, torkas i skugga och males innan extraktionen. 200 delar torkad rot koncentreras till en del extrakt. Ingen bark, ingen stam, inga blad.",
      },
      {
        heading: "Ren kapsel, tydlig dosering",
        body:
          "Varje kapsel innehåller 500 mg extrakt i ett växtbaserat skal (HPMC). Inga fyllnadsmedel, inga flytmedel, inga färgämnen – och en dosering som är lätt att hålla: två kapslar om dagen.",
      },
      {
        heading: "Testad innan den släpps",
        body:
          "Varje parti analyseras av oberoende laboratorium för tungmetaller och mikrobiologi innan det godkänns och packas. Batchnumret på burkens undersida hör ihop med ett specifikt analysprotokoll.",
      },
    ],
    specs: [
      { label: "Latinskt namn", value: "Polyalthia bullata" },
      { label: "Använd växtdel", value: "Rot" },
      { label: "Extraktstyrka", value: "200:1" },
      { label: "Per kapsel", value: "500 mg extrakt" },
      { label: "Dagsdos", value: "2 kapslar (1 000 mg)" },
      { label: "Innehåll", value: "60 kapslar – 30 dagar" },
      { label: "Kapselskal", value: "Vegetabiliskt (HPMC)" },
      { label: "Förvaring", value: "Torrt i rumstemperatur" },
    ],
    ingredients:
      "Black Tongkat Ali-extrakt (Polyalthia bullata, rot) 200:1, kapselskal (HPMC). Innehåll per kapsel: Black Tongkat Ali-extrakt (200:1) 500 mg.",
    usage: [
      "2 kapslar dagligen med ett glas vatten.",
      "Tas med fördel i samband med måltid, vid samma tidpunkt varje dag.",
      "Överskrid inte rekommenderad dagsdos.",
      "Förvaras torrt i rumstemperatur och utom räckhåll för små barn.",
    ],
    faq: [
      {
        q: "Vad är skillnaden mot vanlig (gul) Tongkat Ali?",
        a: "Det är två olika växter. Gul Tongkat Ali är Eurycoma longifolia, Black Tongkat Ali är Polyalthia bullata. Roten är mörkare och råvaran mer sällsynt.",
      },
      {
        q: "Vad betyder 200:1?",
        a: "Att 200 delar torkad rot koncentrerats till 1 del extrakt. Det är ett mått på koncentration.",
      },
      {
        q: "Hur många kapslar ska jag ta?",
        a: "2 kapslar dagligen. En burk med 60 kapslar räcker därmed i 30 dagar – en månads kur.",
      },
      {
        q: "Innehåller den fyllnadsmedel eller är den vegansk?",
        a: "Inga fyllnadsmedel. Kapseln innehåller rotextrakt och ett växtbaserat kapselskal av HPMC, vilket gör den vegansk.",
      },
      {
        q: "Varför är den dyrare än vår gula Tongkat?",
        a: "Råvaran växer långsamt, skördas för hand och finns i mindre volymer.",
      },
    ],
  },


  "turkey-tail": {
    eyebrow: "Trametes versicolor · Fruktkropp",
    headline: "Dubbelextraherad fruktkropp",
    intro:
      "Turkey Tail på 100 % fruktkropp – aldrig mycelium på korn – dubbelextraherad i vatten och alkohol och standardiserad på betaglukaner.",
    highlights: [
      { label: "Råvara", value: "Fruktkropp" },
      { label: "Dagsdos", value: "1000 mg" },
      { label: "Kapslar", value: "90 st" },
    ],
    story: [
      {
        heading: "Fruktkropp, inte mycelium",
        body:
          "Många svampprodukter görs på mycelium odlat på ris, vilket ger ett högt stärkelseinnehåll. Vi använder enbart den vilda formens fruktkropp – svampen du faktiskt ser i skogen.",
      },
      {
        heading: "Dubbel extraktion",
        body:
          "Först en varmvattenextraktion, sedan en alkoholextraktion. De två fraktionerna slås ihop, vilket är standardmetoden för svampextrakt.",
      },
      {
        heading: "Betaglukaner som mått",
        body:
          "Vi mäter betaglukaner, inte polysackarider. Polysackarider kan inkludera stärkelse från odlingssubstrat och säger därför mindre om kvaliteten.",
      },
    ],
    specs: [
      { label: "Latinskt namn", value: "Trametes versicolor" },
      { label: "Använd del", value: "Fruktkropp" },
      { label: "Extraktion", value: "Dubbel (vatten + alkohol)" },
      { label: "Standardisering", value: "Betaglukaner" },
      { label: "Dagsdos", value: "2 kapslar (1000 mg)" },
      { label: "Innehåll", value: "90 kapslar – 45 dagar" },
    ],
    ingredients:
      "Turkey Tail fruktkroppsextrakt (Trametes versicolor), kapselskal (hydroxipropylmetylcellulosa).",
    usage: [
      "2 kapslar per dag med vatten.",
      "Kan tas med eller utan mat.",
      "Överskrid inte rekommenderad dagsdos.",
    ],
    faq: [
      {
        q: "Varför är fruktkropp viktigt?",
        a: "Mycelium odlas ofta på spannmål som följer med i slutprodukten. Fruktkropp ger en renare råvara.",
      },
      {
        q: "Vad betyder dubbelextraherad?",
        a: "Att svampen extraherats både i vatten och i alkohol och att fraktionerna kombinerats.",
      },
    ],
  },

  "horny-goat-weed": {
    eyebrow: "Epimedium · 20 % icariin",
    headline: "Standardiserad på icariin",
    intro:
      "Epimedium – på svenska sockblomma – i ett extrakt standardiserat till 20 % icariin, så att varje kapsel innehåller samma mängd.",
    highlights: [
      { label: "Icariin", value: "20 %" },
      { label: "Dagsdos", value: "500 mg" },
      { label: "Kapslar", value: "60 st" },
    ],
    story: [
      {
        heading: "En ört med många namn",
        body:
          "Epimedium kallas yin yang huo i Kina och sockblomma på svenska. Släktet omfattar ett femtiotal arter, varav ett fåtal används som örtråvara.",
      },
      {
        heading: "Varför standardisering spelar roll",
        body:
          "Halten icariin varierar kraftigt mellan arter och skördar. Genom att standardisera till 20 % vet du exakt vad du får – varje gång.",
      },
      {
        heading: "Ren sammansättning",
        body:
          "Extrakt och kapselskal. Inga bindemedel, inga flytmedel, inga färgämnen.",
      },
    ],
    specs: [
      { label: "Latinskt namn", value: "Epimedium spp." },
      { label: "Använd växtdel", value: "Blad" },
      { label: "Standardisering", value: "20 % icariin" },
      { label: "Dagsdos", value: "2 kapslar (500 mg extrakt)" },
      { label: "Innehåll", value: "60 kapslar – 30 dagar" },
    ],
    ingredients:
      "Epimedium bladextrakt (std. 20 % icariin), kapselskal (hydroxipropylmetylcellulosa).",
    usage: [
      "2 kapslar per dag med vatten.",
      "Tas med fördel i samband med måltid.",
      "Överskrid inte rekommenderad dagsdos.",
    ],
    faq: [
      {
        q: "Vad är icariin?",
        a: "Växtens mest kända markörsubstans, som används för att mäta extraktets styrka.",
      },
      {
        q: "Är den vegansk?",
        a: "Ja, kapselskalet är växtbaserat.",
      },
    ],
  },

  akarkara: {
    eyebrow: "Anacyclus pyrethrum · Ayurveda",
    headline: "En rot ur ayurvedan",
    intro:
      "Akarkara är rotextrakt av Anacyclus pyrethrum, en medelhavsväxt som odlats och använts inom ayurvedisk tradition i Indien.",
    highlights: [
      { label: "Växtdel", value: "Rot" },
      { label: "Dagsdos", value: "500 mg" },
      { label: "Kapslar", value: "60 st" },
    ],
    story: [
      {
        heading: "Från Atlasbergen till Indien",
        body:
          "Växten är ursprungligen från Nordafrika och Medelhavsområdet men odlas idag främst i Indien, där roten skördas efter blomning.",
      },
      {
        heading: "Ren rot",
        body:
          "Vi använder enbart roten, torkad och malen, och extraherar den utan lösningsmedel. Inga fyllnadsmedel tillsätts.",
      },
      {
        heading: "Doserad och testad",
        body:
          "Varje batch testas för tungmetaller och mikrobiologi innan den packas i Norden.",
      },
    ],
    specs: [
      { label: "Latinskt namn", value: "Anacyclus pyrethrum" },
      { label: "Använd växtdel", value: "Rot" },
      { label: "Dagsdos", value: "2 kapslar (500 mg extrakt)" },
      { label: "Innehåll", value: "60 kapslar – 30 dagar" },
      { label: "Packat i", value: "Norden" },
    ],
    ingredients:
      "Akarkara rotextrakt (Anacyclus pyrethrum), kapselskal (hydroxipropylmetylcellulosa).",
    usage: [
      "2 kapslar per dag med vatten.",
      "Kan tas med eller utan mat.",
      "Överskrid inte rekommenderad dagsdos.",
    ],
    faq: [
      {
        q: "Vad betyder namnet?",
        a: "Akarkara är det ayurvediska namnet på roten av Anacyclus pyrethrum.",
      },
      {
        q: "Hur länge räcker en burk?",
        a: "30 dagar vid två kapslar per dag.",
      },
    ],
  },

  "maca": {
    eyebrow: "Lepidium meyenii · 20:1 rotextrakt",
    headline: "Macarot, 470 mg per kapsel",
    intro:
      "Maca är ett koncentrerat 20:1-extrakt av roten från Lepidium meyenii – en rotfrukt med lång tradition i Anderna. 60 kapslar, veganskt kapselskal, tillverkad i Sverige utan tillsatser.",
    highlights: [
      { label: "Extrakt", value: "20:1" },
      { label: "Per kapsel", value: "470 mg" },
      { label: "Kapslar", value: "60 st" },
    ],
    story: [
      {
        heading: "Roten",
        body:
          "Maca (Lepidium meyenii) odlas på hög höjd i Anderna och har använts i peruansk örttradition i generationer. Roten torkas, males och koncentreras till ett standardiserat 20:1-extrakt – 20 delar torkad rot blir 1 del extrakt.",
      },
      {
        heading: "Ren sammansättning",
        body:
          "Bara macarotextrakt i ett växtbaserat kapselskal. Veganskt, glutenfritt och utan GMO – inga bindemedel, fyllnadsmedel, sötningsmedel eller konstgjorda konserveringsmedel.",
      },
      {
        heading: "Tillverkad i Sverige",
        body:
          "Produktionen sker i Sverige i små batcher enligt europeiska tillverkningskrav, med kontroll av råvara och batch. Förpackningen är en återförslutningsbar, återvinningsbar pappersbaserad påse som håller innehållet torrt mellan doserna.",
      },
    ],
    specs: [
      { label: "Latinskt namn", value: "Lepidium meyenii" },
      { label: "Använd växtdel", value: "Rot" },
      { label: "Extraktstyrka", value: "20:1" },
      { label: "Per kapsel", value: "470 mg rotextrakt" },
      { label: "Dagsdos", value: "2 kapslar dagligen" },
      { label: "Innehåll", value: "60 kapslar – 30 dagar" },
      { label: "Kapsel", value: "Vegansk (HPMC)" },
      { label: "Tillverkad i", value: "Sverige" },
    ],
    ingredients:
      "Macaextrakt (Lepidium meyenii, rot) 20:1, kapselskal (HPMC). Innehåll per kapsel: macarotextrakt (20:1) 470 mg.",
    usage: [
      "2 kapslar dagligen med ett glas vatten.",
      "Överskrid inte rekommenderad dagsdos.",
      "Förvaras svalt och torrt. Återförslut burken efter varje användning.",
      "Förvaras utom räckhåll för små barn.",
    ],
    faq: [
      {
        q: "Vad betyder 20:1?",
        a: "Att 20 delar torkad macarot koncentrerats till 1 del extrakt. Det är ett mått på koncentration, inget annat.",
      },
      {
        q: "Hur länge räcker en påse?",
        a: "60 kapslar och 2 kapslar dagligen ger 30 dagar.",
      },
      {
        q: "Är kapseln vegansk?",
        a: "Ja. Kapselskalet är växtbaserat och produkten är glutenfri och utan GMO.",
      },
      {
        q: "Innehåller den fyllnadsmedel?",
        a: "Nej. Bara rotextrakt och kapselskal – inga bindemedel, sötningsmedel eller konstgjorda konserveringsmedel.",
      },
    ],
  },

  "mariatistel": {
    eyebrow: "Silybum marianum · 20:1, 80 % silymarin",
    headline: "Mariatistel, 350 mg per kapsel",
    intro:
      "Mariatistel är ett 20:1-extrakt av Silybum marianum standardiserat till 80 % silymarin – 350 mg per kapsel. 60 kapslar i veganskt kapselskal, tillverkad i Sverige utan tillsatser.",
    highlights: [
      { label: "Extrakt", value: "20:1 · 80 %" },
      { label: "Per kapsel", value: "350 mg" },
      { label: "Kapslar", value: "60 st" },
    ],
    story: [
      {
        heading: "Växten",
        body:
          "Mariatistel (Silybum marianum) är en tistelväxt från Medelhavsområdet med lång tradition i europeisk örtanvändning. Fröna torkas och extraheras till ett koncentrat standardiserat till 80 % silymarin – ett flavonoidkomplex som bland annat innehåller isosilybinin (ca 2,5 %), silikristin (ca 10 %) och silydianin (ca 7,5 %).",
      },
      {
        heading: "Ren sammansättning",
        body:
          "Bara mariatistelextrakt i ett växtbaserat kapselskal av pullulan. Veganskt, glutenfritt och utan GMO – fritt från laktos, soja, jäst, vete och mjölk, och utan färgämnen, bindemedel, fyllnadsmedel eller konstgjorda konserveringsmedel.",
      },
      {
        heading: "Tillverkad i Sverige",
        body:
          "Produktionen sker i Sverige i små batcher enligt europeiska tillverkningskrav, med kontroll av råvara och batch. Förpackningen är en återförslutningsbar, återvinningsbar pappersbaserad påse som håller innehållet torrt mellan doserna.",
      },
    ],
    specs: [
      { label: "Latinskt namn", value: "Silybum marianum" },
      { label: "Använd växtdel", value: "Frö" },
      { label: "Extraktstyrka", value: "20:1" },
      { label: "Standardisering", value: "80 % silymarin" },
      { label: "Per kapsel", value: "350 mg extrakt" },
      { label: "Dagsdos", value: "1 kapsel dagligen" },
      { label: "Innehåll", value: "60 kapslar – 60 dagar" },
      { label: "Kapsel", value: "Vegansk (pullulan)" },
      { label: "Tillverkad i", value: "Sverige" },
    ],
    ingredients:
      "Mariatistelextrakt (Silybum marianum, frö) 20:1 standardiserat till 80 % silymarin, kapselskal (pullulan). Innehåll per kapsel: mariatistelextrakt 350 mg, varav silymarin 280 mg.",
    usage: [
      "1 kapsel dagligen med ett glas vatten.",
      "Överskrid inte rekommenderad dagsdos.",
      "Förvaras svalt och torrt. Återförslut burken efter varje användning.",
      "Förvaras utom räckhåll för små barn.",
    ],
    faq: [
      {
        q: "Vad betyder 80 % silymarin?",
        a: "Att extraktet standardiserats så att 80 % utgörs av flavonoidkomplexet silymarin. I 350 mg extrakt motsvarar det 280 mg silymarin.",
      },
      {
        q: "Vilken växtdel används?",
        a: "Fröna från mariatistel, som torkas och extraheras till ett 20:1-koncentrat.",
      },
      {
        q: "Är kapseln vegansk?",
        a: "Ja. Kapselskalet är växtbaserat pullulan och produkten är glutenfri och utan GMO.",
      },
      {
        q: "Hur länge räcker en påse?",
        a: "60 kapslar och 1 kapsel dagligen ger 60 dagar.",
      },
    ],
  },

  "nasselblad": {
    eyebrow: "Urtica dioica · 10:1 bladextrakt",
    headline: "Nässelblad, 430 mg per kapsel",
    intro:
      "Nässelblad är ett 10:1-extrakt av bladen från Urtica dioica – 430 mg per kapsel. 60 kapslar i veganskt kapselskal, tillverkad i Sverige utan tillsatser.",
    highlights: [
      { label: "Extrakt", value: "10:1" },
      { label: "Per kapsel", value: "430 mg" },
      { label: "Kapslar", value: "60 st" },
    ],
    story: [
      {
        heading: "Bladet",
        body:
          "Brännässla (Urtica dioica) har använts i europeisk örttradition i århundraden. Vi använder bladen, som torkas och koncentreras till ett 10:1-extrakt – 10 delar torkat blad blir 1 del extrakt.",
      },
      {
        heading: "Ren sammansättning",
        body:
          "Bara nässelbladsextrakt i ett växtbaserat kapselskal. Veganskt, glutenfritt och utan GMO – inga bindemedel, fyllnadsmedel, sötningsmedel eller konstgjorda konserveringsmedel.",
      },
      {
        heading: "Tillverkad i Sverige",
        body:
          "Produktionen sker i Sverige enligt europeiska krav på säkerhet, kvalitet och hållbarhet. Förpackningen är en återförslutningsbar, återvinningsbar pappersbaserad påse som håller innehållet torrt mellan doserna.",
      },
    ],
    specs: [
      { label: "Latinskt namn", value: "Urtica dioica" },
      { label: "Använd växtdel", value: "Blad" },
      { label: "Extraktstyrka", value: "10:1" },
      { label: "Per kapsel", value: "430 mg extrakt" },
      { label: "Dagsdos", value: "1 kapsel dagligen" },
      { label: "Innehåll", value: "60 kapslar – 60 dagar" },
      { label: "Kapsel", value: "Vegansk" },
      { label: "Tillverkad i", value: "Sverige" },
    ],
    ingredients:
      "Nässelbladsextrakt (Urtica dioica, blad) 10:1, kapselskal (vegetabiliskt). Innehåll per kapsel: nässelbladsextrakt 430 mg.",
    usage: [
      "1 kapsel dagligen med ett glas vatten.",
      "Överskrid inte rekommenderad dagsdos.",
      "Förvaras svalt och torrt. Återförslut burken efter varje användning.",
      "Förvaras utom räckhåll för små barn.",
    ],
    faq: [
      {
        q: "Vad betyder 10:1?",
        a: "Att 10 delar torkat nässelblad har koncentrerats till 1 del extrakt. Det är ett mått på koncentration, inget annat.",
      },
      {
        q: "Vilken växtdel används?",
        a: "Bladen från brännässla, som torkas och extraheras till ett 10:1-koncentrat.",
      },
      {
        q: "Är kapseln vegansk?",
        a: "Ja. Kapselskalet är växtbaserat och produkten är glutenfri och utan GMO.",
      },
      {
        q: "Hur länge räcker en påse?",
        a: "60 kapslar och 1 kapsel dagligen ger 60 dagar.",
      },
    ],
  },

  "druvkarneextrakt": {
    eyebrow: "Vitis vinifera · 95 % OPC",
    headline: "Druvkärneextrakt, 500 mg per kapsel",
    intro:
      "Druvkärneextrakt är ett extrakt av kärnorna från Vitis vinifera standardiserat till 95 % proantocyanidiner (OPC) – 500 mg per kapsel. 60 kapslar i veganskt kapselskal, tillverkad i Sverige utan tillsatser.",
    highlights: [
      { label: "Standardisering", value: "95 % OPC" },
      { label: "Per kapsel", value: "500 mg" },
      { label: "Kapslar", value: "60 st" },
    ],
    story: [
      {
        heading: "Kärnan",
        body:
          "Vindruvan (Vitis vinifera) odlas i Europa sedan urminnes tider. Vi använder kärnorna, som är en naturlig källa till polyfenoler, och extraherar dem till ett koncentrat standardiserat till 95 % proantocyanidiner – även kallade OPC.",
      },
      {
        heading: "Ren sammansättning",
        body:
          "Bara druvkärneextrakt i ett växtbaserat kapselskal. Veganskt, glutenfritt och utan GMO – inga bindemedel, fyllnadsmedel, sötningsmedel eller konstgjorda konserveringsmedel.",
      },
      {
        heading: "Tillverkad i Sverige",
        body:
          "Produktionen sker i Sverige i små batcher enligt europeiska krav på säkerhet, kvalitet och hållbarhet. Förpackningen är en återförslutningsbar, återvinningsbar pappersbaserad påse som håller innehållet torrt mellan doserna.",
      },
    ],
    specs: [
      { label: "Latinskt namn", value: "Vitis vinifera" },
      { label: "Använd växtdel", value: "Kärna" },
      { label: "Standardisering", value: "95 % proantocyanidiner (OPC)" },
      { label: "Per kapsel", value: "500 mg extrakt" },
      { label: "Dagsdos", value: "1–2 kapslar dagligen" },
      { label: "Innehåll", value: "60 kapslar – 30–60 dagar" },
      { label: "Kapsel", value: "Vegansk" },
      { label: "Tillverkad i", value: "Sverige" },
    ],
    ingredients:
      "Druvkärneextrakt (Vitis vinifera, kärna) standardiserat till 95 % proantocyanidiner, kapselskal (vegetabiliskt). Innehåll per kapsel: druvkärneextrakt 500 mg, varav proantocyanidiner 475 mg.",
    usage: [
      "1–2 kapslar dagligen med ett glas vatten.",
      "Överskrid inte rekommenderad dagsdos.",
      "Förvaras svalt och torrt. Återförslut burken efter varje användning.",
      "Förvaras utom räckhåll för små barn.",
    ],
    faq: [
      {
        q: "Vad betyder 95 % OPC?",
        a: "Att extraktet standardiserats så att 95 % utgörs av proantocyanidiner. I 500 mg extrakt motsvarar det 475 mg.",
      },
      {
        q: "Vilken växtdel används?",
        a: "Kärnorna från vindruvan, som extraheras och standardiseras på polyfenoler.",
      },
      {
        q: "Är kapseln vegansk?",
        a: "Ja. Kapselskalet är växtbaserat och produkten är glutenfri och utan GMO.",
      },
      {
        q: "Hur länge räcker en påse?",
        a: "60 kapslar räcker 30 dagar vid 2 kapslar dagligen och 60 dagar vid 1 kapsel dagligen.",
      },
    ],
  },
  "quercetin": {
    eyebrow: "Quercetin · 98 % renhet",
    headline: "Quercetin, 500 mg per kapsel",
    intro:
      "Quercetin är en flavonoid som förekommer naturligt i frukt och grönsaker. Vårt extrakt håller 98 % renhet – 500 mg per kapsel. 60 kapslar i veganskt kapselskal, tillverkad i Sverige utan tillsatser.",
    highlights: [
      { label: "Renhet", value: "98 %" },
      { label: "Per kapsel", value: "500 mg" },
      { label: "Kapslar", value: "60 st" },
    ],
    story: [
      {
        heading: "Ämnet",
        body:
          "Quercetin är en växtbaserad flavonoid som finns i bland annat lök, äpplen och bär. Vi väljer ett extrakt med hög renhet – 98 % – för att varje kapsel ska ha samma innehåll, batch efter batch.",
      },
      {
        heading: "Ren sammansättning",
        body:
          "Bara quercetinextrakt i ett växtbaserat kapselskal. Veganskt, glutenfritt och utan GMO – inga bindemedel, fyllnadsmedel, sötningsmedel eller konstgjorda konserveringsmedel.",
      },
      {
        heading: "Tillverkad i Sverige",
        body:
          "Produktionen sker i Sverige i små batcher enligt europeiska krav på säkerhet och kvalitet. Förpackningen är en återförslutningsbar, återvinningsbar pappersbaserad påse som håller innehållet torrt mellan doserna.",
      },
    ],
    specs: [
      { label: "Innehåll", value: "Quercetinextrakt" },
      { label: "Renhet", value: "98 % quercetin" },
      { label: "Per kapsel", value: "500 mg" },
      { label: "Dagsdos", value: "1 kapsel dagligen" },
      { label: "Förpackning", value: "60 kapslar – 60 dagar" },
      { label: "Kapsel", value: "Vegansk" },
      { label: "Tillverkad i", value: "Sverige" },
    ],
    ingredients:
      "Quercetinextrakt (98 % quercetin), kapselskal (vegetabiliskt). Innehåll per kapsel: quercetinextrakt 500 mg, varav quercetin 490 mg.",
    usage: [
      "1 kapsel dagligen med ett glas vatten.",
      "Överskrid inte rekommenderad dagsdos.",
      "Förvaras svalt och torrt. Återförslut burken efter varje användning.",
      "Förvaras utom räckhåll för små barn.",
    ],
    faq: [
      {
        q: "Vad betyder 98 % renhet?",
        a: "Att 98 % av extraktet utgörs av quercetin. I 500 mg extrakt motsvarar det 490 mg quercetin.",
      },
      {
        q: "Var kommer quercetin ifrån?",
        a: "Quercetin är en flavonoid som förekommer naturligt i frukt, grönsaker och örter.",
      },
      {
        q: "Är kapseln vegansk?",
        a: "Ja. Kapselskalet är växtbaserat och produkten är glutenfri och utan GMO.",
      },
      {
        q: "Hur länge räcker en påse?",
        a: "60 kapslar räcker 60 dagar vid 1 kapsel dagligen.",
      },
    ],
  },
  "reishi": {
    eyebrow: "Ganoderma lucidum · 40 % polysackarider",
    headline: "Reishi, 350 mg per kapsel",
    intro:
      "Reishi (Ganoderma lucidum) i ett standardiserat svampextrakt med 40 % polysackarider – 350 mg per kapsel. 60 kapslar i veganskt kapselskal, tillverkad i Sverige utan tillsatser.",
    highlights: [
      { label: "Standardisering", value: "40 % polysackarider" },
      { label: "Per kapsel", value: "350 mg" },
      { label: "Kapslar", value: "60 st" },
    ],
    story: [
      {
        heading: "Svampen",
        body:
          "Reishi, Ganoderma lucidum, har använts i traditionell örtkultur i århundraden. Vårt extrakt är koncentrerat och standardiserat till 40 % polysackarider, så att innehållet blir detsamma i varje kapsel.",
      },
      {
        heading: "Ren sammansättning",
        body:
          "Bara reishiextrakt i ett växtbaserat kapselskal. Veganskt, glutenfritt och utan GMO – inga bindemedel, fyllnadsmedel, sötningsmedel eller konstgjorda konserveringsmedel.",
      },
      {
        heading: "Tillverkad i Sverige",
        body:
          "Produktionen sker i Sverige i små batcher enligt europeiska krav på säkerhet och kvalitet. Förpackningen är en återförslutningsbar, återvinningsbar pappersbaserad påse som håller innehållet torrt mellan doserna.",
      },
    ],
    specs: [
      { label: "Latinskt namn", value: "Ganoderma lucidum" },
      { label: "Standardisering", value: "40 % polysackarider" },
      { label: "Per kapsel", value: "350 mg" },
      { label: "Dagsdos", value: "1 kapsel dagligen" },
      { label: "Förpackning", value: "60 kapslar – 60 dagar" },
      { label: "Kapsel", value: "Vegansk" },
      { label: "Tillverkad i", value: "Sverige" },
    ],
    ingredients:
      "Reishiextrakt (Ganoderma lucidum) standardiserat till 40 % polysackarider, kapselskal (vegetabiliskt). Innehåll per kapsel: reishiextrakt 350 mg, varav polysackarider 140 mg.",
    usage: [
      "1 kapsel dagligen med ett glas vatten.",
      "Överskrid inte rekommenderad dagsdos.",
      "Förvaras svalt och torrt. Återförslut burken efter varje användning.",
      "Förvaras utom räckhåll för små barn.",
    ],
    faq: [
      {
        q: "Vad betyder 40 % polysackarider?",
        a: "Att extraktet standardiserats så att 40 % utgörs av polysackarider. I 350 mg extrakt motsvarar det 140 mg.",
      },
      {
        q: "Vilken svamp används?",
        a: "Ganoderma lucidum, allmänt kallad reishi.",
      },
      {
        q: "Är kapseln vegansk?",
        a: "Ja. Kapselskalet är växtbaserat och produkten är glutenfri och utan GMO.",
      },
      {
        q: "Hur länge räcker en påse?",
        a: "60 kapslar räcker 60 dagar vid 1 kapsel dagligen.",
      },
    ],
  },
  "chaga": {
    eyebrow: "Inonotus obliquus · 30:1 extrakt",
    headline: "Chaga, 400 mg per kapsel",
    intro:
      "Chaga (Inonotus obliquus) i ett 30:1-extrakt standardiserat till 10 % polysackarider – 400 mg per kapsel. 60 kapslar i veganskt kapselskal, tillverkad i Sverige utan tillsatser.",
    highlights: [
      { label: "Extrakt", value: "30:1" },
      { label: "Per kapsel", value: "400 mg" },
      { label: "Kapslar", value: "60 st" },
    ],
    story: [
      {
        heading: "Svampen",
        body:
          "Chaga växer långsamt på björk och tar upp näring ur trädet under många år. Vårt extrakt kommer från vildskördad chaga av hög kvalitet, koncentrerat 30:1 och standardiserat till 10 % polysackarider.",
      },
      {
        heading: "Ren sammansättning",
        body:
          "Bara chagaextrakt i ett växtbaserat kapselskal. Veganskt, glutenfritt och utan GMO – inga bindemedel, fyllnadsmedel, sötningsmedel eller konstgjorda konserveringsmedel.",
      },
      {
        heading: "Tillverkad i Sverige",
        body:
          "Produktionen sker i Sverige i små batcher enligt europeiska krav på säkerhet och hållbarhet. Förpackningen är en återförslutningsbar, återvinningsbar pappersbaserad påse som håller innehållet torrt mellan doserna.",
      },
    ],
    specs: [
      { label: "Latinskt namn", value: "Inonotus obliquus" },
      { label: "Extrakt", value: "30:1" },
      { label: "Standardisering", value: "10 % polysackarider" },
      { label: "Per kapsel", value: "400 mg" },
      { label: "Dagsdos", value: "1 kapsel dagligen" },
      { label: "Förpackning", value: "60 kapslar – 60 dagar" },
      { label: "Kapsel", value: "Vegansk" },
      { label: "Tillverkad i", value: "Sverige" },
    ],
    ingredients:
      "Chagaextrakt (Inonotus obliquus) 30:1 standardiserat till 10 % polysackarider, kapselskal (vegetabiliskt). Innehåll per kapsel: chagaextrakt 400 mg, varav polysackarider 40 mg.",
    usage: [
      "1 kapsel dagligen med ett glas vatten.",
      "Överskrid inte rekommenderad dagsdos.",
      "Förvaras svalt och torrt. Återförslut burken efter varje användning.",
      "Förvaras utom räckhåll för små barn.",
    ],
    faq: [
      {
        q: "Vad betyder 30:1?",
        a: "Att 30 delar råvara koncentrerats till 1 del extrakt. 400 mg extrakt motsvarar cirka 12 g torkad chaga.",
      },
      {
        q: "Vad innebär 10 % polysackarider?",
        a: "Att extraktet standardiserats så att 10 % utgörs av polysackarider – 40 mg per kapsel.",
      },
      {
        q: "Är kapseln vegansk?",
        a: "Ja. Kapselskalet är växtbaserat och produkten är glutenfri och utan GMO.",
      },
      {
        q: "Hur länge räcker en påse?",
        a: "60 kapslar räcker 60 dagar vid 1 kapsel dagligen.",
      },
    ],
  },
  "lions-mane": {
    eyebrow: "Hericium erinaceus · 60 % polysackarider",
    headline: "Lion's Mane, 500 mg per kapsel",
    intro:
      "Lion's Mane (Hericium erinaceus) i ett standardiserat svampextrakt med 60 % polysackarider, varav 45 % betaglukaner – 500 mg per kapsel. 60 kapslar i veganskt kapselskal, tillverkad i Sverige utan tillsatser.",
    highlights: [
      { label: "Standardisering", value: "60 % polysackarider" },
      { label: "Per kapsel", value: "500 mg" },
      { label: "Kapslar", value: "60 st" },
    ],
    story: [
      {
        heading: "Svampen",
        body:
          "Lion's Mane, Hericium erinaceus, har en lång historia inom traditionell örtkultur i Östasien. Vårt extrakt är koncentrerat och standardiserat till 60 % polysackarider, varav 45 % betaglukaner, så att innehållet blir detsamma i varje kapsel.",
      },
      {
        heading: "Ren sammansättning",
        body:
          "Bara Lion's Mane-extrakt i ett växtbaserat kapselskal. Veganskt, glutenfritt och utan GMO – inga bindemedel, fyllnadsmedel, sötningsmedel eller konstgjorda konserveringsmedel.",
      },
      {
        heading: "Tillverkad i Sverige",
        body:
          "Produktionen sker i Sverige i små batcher enligt europeiska krav på säkerhet och kvalitet. Förpackningen är en återförslutningsbar, återvinningsbar pappersbaserad påse som håller innehållet torrt mellan doserna.",
      },
    ],
    specs: [
      { label: "Latinskt namn", value: "Hericium erinaceus" },
      { label: "Standardisering", value: "60 % polysackarider" },
      { label: "Varav betaglukaner", value: "45 %" },
      { label: "Per kapsel", value: "500 mg" },
      { label: "Dagsdos", value: "1 kapsel dagligen" },
      { label: "Förpackning", value: "60 kapslar – 60 dagar" },
      { label: "Kapsel", value: "Vegansk" },
      { label: "Tillverkad i", value: "Sverige" },
    ],
    ingredients:
      "Lion's Mane-extrakt (Hericium erinaceus) standardiserat till 60 % polysackarider, varav 45 % betaglukaner, kapselskal (vegetabiliskt). Innehåll per kapsel: extrakt 500 mg, varav polysackarider 300 mg och betaglukaner 225 mg.",
    usage: [
      "1 kapsel dagligen med ett glas vatten.",
      "Överskrid inte rekommenderad dagsdos.",
      "Förvaras svalt och torrt. Återförslut burken efter varje användning.",
      "Förvaras utom räckhåll för små barn.",
    ],
    faq: [
      {
        q: "Vad betyder 60 % polysackarider?",
        a: "Att extraktet standardiserats så att 60 % utgörs av polysackarider. I 500 mg extrakt motsvarar det 300 mg.",
      },
      {
        q: "Vad är betaglukaner?",
        a: "En specifik grupp polysackarider. I vårt extrakt utgör de 45 %, det vill säga 225 mg per kapsel.",
      },
      {
        q: "Är kapseln vegansk?",
        a: "Ja. Kapselskalet är växtbaserat och produkten är glutenfri och utan GMO.",
      },
      {
        q: "Hur länge räcker en påse?",
        a: "60 kapslar räcker 60 dagar vid 1 kapsel dagligen.",
      },
    ],
  },
  "cordyceps": {
    eyebrow: "Cordyceps militaris · 8:1 extrakt",
    headline: "Cordyceps, 350 mg per kapsel",
    intro:
      "Cordyceps (Cordyceps militaris) i ett 8:1-extrakt standardiserat till 40 % polysackarider – 350 mg per kapsel. 60 kapslar i veganskt kapselskal, tillverkad i Sverige utan tillsatser.",
    highlights: [
      { label: "Extrakt", value: "8:1" },
      { label: "Per kapsel", value: "350 mg" },
      { label: "Kapslar", value: "60 st" },
    ],
    story: [
      {
        heading: "Svampen",
        body:
          "Cordyceps har länge haft en plats i östasiatisk örtkultur. Vårt extrakt kommer från noggrant utvald Cordyceps militaris, koncentrerat 8:1 och standardiserat till 40 % polysackarider så att innehållet blir detsamma i varje kapsel.",
      },
      {
        heading: "Ren sammansättning",
        body:
          "Bara cordycepsextrakt i ett växtbaserat kapselskal. Veganskt, glutenfritt och utan GMO – inga bindemedel, fyllnadsmedel, sötningsmedel eller konstgjorda konserveringsmedel.",
      },
      {
        heading: "Tillverkad i Sverige",
        body:
          "Produktionen sker i Sverige i små batcher enligt europeiska krav på säkerhet och hållbarhet. Förpackningen är en återförslutningsbar, återvinningsbar pappersbaserad påse som håller innehållet torrt mellan doserna.",
      },
    ],
    specs: [
      { label: "Latinskt namn", value: "Cordyceps militaris" },
      { label: "Extrakt", value: "8:1" },
      { label: "Standardisering", value: "40 % polysackarider" },
      { label: "Per kapsel", value: "350 mg" },
      { label: "Dagsdos", value: "1 kapsel dagligen" },
      { label: "Förpackning", value: "60 kapslar – 60 dagar" },
      { label: "Kapsel", value: "Vegansk" },
      { label: "Tillverkad i", value: "Sverige" },
    ],
    ingredients:
      "Cordycepsextrakt (Cordyceps militaris) 8:1 standardiserat till 40 % polysackarider, kapselskal (vegetabiliskt). Innehåll per kapsel: cordycepsextrakt 350 mg, varav polysackarider 140 mg.",
    usage: [
      "1 kapsel dagligen med ett glas vatten.",
      "Överskrid inte rekommenderad dagsdos.",
      "Förvaras svalt och torrt. Återförslut burken efter varje användning.",
      "Förvaras utom räckhåll för små barn.",
    ],
    faq: [
      {
        q: "Vad betyder 8:1?",
        a: "Att 8 delar råvara koncentrerats till 1 del extrakt. 350 mg extrakt motsvarar cirka 2,8 g torkad cordyceps.",
      },
      {
        q: "Vad innebär 40 % polysackarider?",
        a: "Att extraktet standardiserats så att 40 % utgörs av polysackarider – 140 mg per kapsel.",
      },
      {
        q: "Är kapseln vegansk?",
        a: "Ja. Kapselskalet är växtbaserat och produkten är glutenfri och utan GMO.",
      },
      {
        q: "Hur länge räcker en påse?",
        a: "60 kapslar räcker 60 dagar vid 1 kapsel dagligen.",
      },
    ],
  },
};







/* --------------------- Elektrolyter (smak × storlek) ---------------------- */

const electrolyteFlavorText: Record<string, { note: string; taste: string }> = {
  "lemon-lime": {
    note: "Citron & lime",
    taste:
      "Syrlig och rak i smaken, med naturlig citron- och limearom. Den smak vi tog fram först och den som fungerar bäst iskall.",
  },
  "mango-orange": {
    note: "Mango & apelsin",
    taste:
      "Mjukare och fylligare, med mogen mango balanserad av apelsinens syra. Fungerar lika bra i rumstempererat vatten.",
  },
  "wild-berries": {
    note: "Skogsbär",
    taste:
      "Rund bärsötma med lite syra i eftersmaken, byggd på en blandning av naturliga bärartomer.",
  },
};

for (const flavorKey of Object.keys(electrolyteFlavorText)) {
  const f = electrolyteFlavorText[flavorKey]!;
  for (const s of [
    { slug: "240g-bag", size: "240 g", pack: "påse", packText: "Återförslutningsbar påse – mindre material per portion och enkel att förvara i skåpet." },
    { slug: "120g-can", size: "120 g", pack: "burk", packText: "Stabil burk med brett lock, lätt att dosera ur med skopan även mitt i ett pass." },
  ]) {
    productContent[`electrolyte-powder-${flavorKey}-${s.slug}`] = {
      eyebrow: `Elektrolytpulver · ${f.note}`,
      headline: "Vatten, salter och smak",
      intro: `Ett pulver som blandas i vatten och ger natrium, kalium, magnesium och klorid i en avvägd sammansättning. ${s.size} i ${s.pack}, 50 portioner.`,
      highlights: [
        { label: "Portioner", value: "50 st" },
        { label: "Format", value: `${s.size} ${s.pack}` },
        { label: "Smak", value: f.note },
      ],
      story: [
        { heading: "Smaken", body: f.taste },
        {
          heading: "Sammansättningen",
          body:
            "Natrium från havssalt och natriumcitrat, kalium från kaliumcitrat, magnesium från magnesiummalat och klorid från salt. Inga färgämnen, inget tillsatt socker och inga fyllnadsmedel.",
        },
        { heading: "Förpackningen", body: s.packText },
      ],
      specs: [
        { label: "Nettovikt", value: s.size },
        { label: "Förpackning", value: s.pack === "påse" ? "Påse (Bag)" : "Burk (Can)" },
        { label: "Portioner", value: "50" },
        { label: "Smak", value: f.note },
        { label: "Tillsatt socker", value: "Nej" },
        { label: "Tredjepartstestad", value: "Ja, varje batch" },
      ],
      ingredients:
        "Natriumklorid (havssalt), natriumcitrat, kaliumcitrat, magnesiummalat, syra (citronsyra), naturlig arom, sötningsmedel (steviolglykosider).",
      usage: [
        "Blanda en skopa (ca 5 g) i 500 ml vatten.",
        "Rör eller skaka tills pulvret löst sig helt.",
        "Drick före, under eller efter aktivitet – eller när du bara vill ha smak på vattnet.",
      ],
      faq: [
        { q: "Hur många portioner ingår?", a: "50 portioner per förpackning." },
        {
          q: "Vad är skillnaden mellan påse och burk?",
          a: "Innehållet är detsamma. Påsen på 240 g är den större förpackningen, burken på 120 g är stadigare och lättare att dosera ur.",
        },
        { q: "Innehåller den socker?", a: "Nej, den är sötad med steviolglykosider." },
      ],
    };
  }
}

export const getProductContent = (slug: string): ProductContent | undefined =>
  productContent[slug];
