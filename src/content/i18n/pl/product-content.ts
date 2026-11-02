import type { ProductContent } from "@/content/product-content";

/**
 * Treści stron produktowych po polsku (pl-PL). Przetłumaczone z src/content/product-content.ts.
 * Bez oświadczeń zdrowotnych – tylko botanika, pochodzenie, ekstrakcja, forma i dawkowanie.
 */

const packaging = {
  heading: "Opakowanie i dostawa",
  body:
    "Kapsułki pakujemy w plastikowy słoik z zakrętką, który utrzymuje zawartość suchą między kolejnymi dawkami. Każde zamówienie wysyłamy z naszego magazynu.",
};

const noExceed = "Nie przekraczaj zalecanej dziennej porcji.";
const keepAway = "Przechowuj w miejscu niedostępnym dla małych dzieci.";
const storeRoomTemp = "Przechowuj w suchym miejscu, w temperaturze pokojowej. Po każdym użyciu dokładnie zamknij pojemnik.";
const storeCool = "Przechowuj w chłodnym i suchym miejscu. Po każdym użyciu dokładnie zamknij pojemnik.";
const cleanNoSweeteners =
  "Wegańskie, bezglutenowe i bez GMO – bez substancji wiążących, wypełniaczy, słodzików i sztucznych konserwantów.";
const veganFaq = {
  q: "Czy kapsułka jest wegańska?",
  a: "Tak. Otoczka kapsułki jest roślinna, a produkt jest bezglutenowy i bez GMO.",
};
const oneDaily = "1 kapsułka dziennie, popijana szklanką wody.";
const lasts60 = { q: "Na jak długo wystarcza jedno opakowanie?", a: "60 kapsułek przy 1 kapsułce dziennie wystarcza na 60 dni." };

export const productContent: Record<string, ProductContent> = {
  "tongkat-ali-elite": {
    eyebrow: "Eurycoma longifolia · ekstrakt z korzenia 200:1",
    headline: "Czysty korzeń, 450 mg w kapsułce",
    intro:
      "Tongkat Ali Elite to skoncentrowany ekstrakt 200:1 z korzenia Eurycoma longifolia – znanej też jako Malaysian Ginseng lub Longjack. W wegańskiej kapsułce, bez dodatków.",
    highlights: [
      { label: "Ekstrakt", value: "200:1" },
      { label: "W kapsułce", value: "450 mg" },
      { label: "Kapsułki", value: "60 szt." },
    ],
    story: [
      {
        heading: "Korzeń",
        body:
          "Wychodzimy od starannie wyselekcjonowanych korzeni Eurycoma longifolia – surowca botanicznego o długiej tradycji w Azji Południowo-Wschodniej. Korzeń jest suszony, mielony i zagęszczany do ekstraktu 200:1 – z 200 części suszonego korzenia powstaje 1 część ekstraktu.",
      },
      {
        heading: "Czysty skład",
        body:
          "Tylko ekstrakt z korzenia w roślinnej otoczce kapsułki. Wegański, bezglutenowy i bez GMO – bez substancji wiążących, wypełniaczy, słodzików i sztucznych konserwantów.",
      },
      packaging,
    ],
    specs: [
      { label: "Nazwa łacińska", value: "Eurycoma longifolia" },
      { label: "Użyta część rośliny", value: "Korzeń" },
      { label: "Stopień koncentracji", value: "200:1" },
      { label: "W kapsułce", value: "450 mg ekstraktu z korzenia" },
      { label: "Dzienna porcja", value: "1 kapsułka dziennie" },
      { label: "Zawartość", value: "60 kapsułek – 60 dni" },
      { label: "Kapsułka", value: "Wegańska (HPMC)" },
    ],
    ingredients:
      "Ekstrakt z Tongkat Ali (Eurycoma longifolia, korzeń) 200:1, otoczka kapsułki (HPMC). Zawartość w kapsułce: ekstrakt z Tongkat Ali (200:1) 450 mg.",
    usage: [oneDaily, noExceed, storeRoomTemp, keepAway],
    faq: [
      {
        q: "Co oznacza 200:1?",
        a: "Że 200 części suszonego korzenia zagęszczono do 1 części ekstraktu. To miara koncentracji, nic więcej.",
      },
      lasts60,
      {
        q: "Czy kapsułka jest wegańska?",
        a: "Tak. Otoczka kapsułki jest roślinna (HPMC), a produkt jest bezglutenowy i bez GMO.",
      },
      {
        q: "Czy zawiera wypełniacze?",
        a: "Nie. Tylko ekstrakt z korzenia i otoczka kapsułki – bez substancji wiążących, słodzików i sztucznych konserwantów.",
      },
    ],
  },

  "tongkat-premium": {
    eyebrow: "Eurycoma longifolia · 200:1, 20 mg eurykomanonu",
    headline: "Standaryzowany na eurykomanon",
    intro:
      "Tongkat Ali Ultra 4% to ekstrakt z korzenia Eurycoma longifolia 200:1 – 520 mg w kapsułce, w tym 20 mg eurykomanonu. 60 kapsułek w opakowaniu. Nie przyjmuj na pusty żołądek.",
    highlights: [
      { label: "Ekstrakt", value: "200:1" },
      { label: "W kapsułce", value: "520 mg" },
      { label: "Kapsułki", value: "60 szt." },
    ],
    story: [
      {
        heading: "Korzeń",
        body:
          "Wychodzimy od starannie wyselekcjonowanych korzeni Eurycoma longifolia – znanej też jako Malaysian Ginseng lub Longjack – surowca botanicznego o długiej tradycji w Azji Południowo-Wschodniej. Korzeń jest zagęszczany do ekstraktu 200:1.",
      },
      {
        heading: "20 mg eurykomanonu w kapsułce",
        body:
          "Każda partia jest standaryzowana pod kątem zawartości eurykomanonu, tak aby każda kapsułka o masie 520 mg zawierała 20 mg eurykomanonu. Dzięki temu moc jest taka sama w kolejnych partiach. Jedna kapsułka dziennie.",
      },
      packaging,
    ],
    specs: [
      { label: "Nazwa łacińska", value: "Eurycoma longifolia" },
      { label: "Użyta część rośliny", value: "Korzeń" },
      { label: "Stopień koncentracji", value: "200:1, standaryzowany na eurykomanon" },
      { label: "W kapsułce", value: "520 mg ekstraktu z korzenia (20 mg eurykomanonu)" },
      { label: "Dzienna porcja", value: "1 kapsułka dziennie" },
      { label: "Zawartość", value: "60 kapsułek – 60 dni" },
      { label: "Opakowanie", value: "Plastikowy pojemnik z zakrętką" },
      { label: "Kapsułka", value: "Wegańska (HPMC)" },
    ],
    ingredients:
      "Ekstrakt z Tongkat Ali (Eurycoma longifolia, korzeń) 200:1, otoczka kapsułki (HPMC). Zawartość w kapsułce: ekstrakt z Tongkat Ali (200:1) 520 mg, w tym eurykomanon 20 mg.",
    usage: [
      oneDaily,
      "Nie przyjmuj na czczo – ekstrakt jest bardzo mocny.",
      noExceed,
      storeRoomTemp,
      keepAway,
    ],
    faq: [
      {
        q: "Ile eurykomanonu zawiera kapsułka?",
        a: "20 mg eurykomanonu w 520 mg ekstraktu.",
      },
      {
        q: "Czym Ultra 4% różni się od Elite?",
        a: "Elite to ekstrakt z korzenia 200:1, 450 mg w kapsułce, bez standaryzacji na eurykomanon. Ultra 4% zawiera 520 mg w kapsułce, w tym 20 mg eurykomanonu.",
      },
      lasts60,
      {
        q: "Czy zawiera wypełniacze?",
        a: "Nie. Tylko ekstrakt z korzenia i wegańska otoczka kapsułki – bez substancji wiążących, wypełniaczy i sztucznych konserwantów.",
      },
    ],
  },

  "fadogia-agrestis": {
    eyebrow: "Fadogia agrestis · ekstrakt ziołowy 20:1",
    headline: "Czysta roślina, 450 mg w kapsułce",
    intro:
      "Ekstrakt 20:1 z Fadogia agrestis – krzewu o długiej tradycji w zielarstwie Afryki Zachodniej. 450 mg w wegańskiej kapsułce – bez dodatków.",
    highlights: [
      { label: "Ekstrakt", value: "20:1" },
      { label: "W kapsułce", value: "450 mg" },
      { label: "Kapsułki", value: "60 szt." },
    ],
    story: [
      {
        heading: "Roślina",
        body:
          "Fadogia agrestis to krzew rosnący w części Afryki, który od dawna ma stałe miejsce w tradycyjnych preparatach ziołowych. Używamy starannie wyselekcjonowanych części rośliny, zagęszczanych do ekstraktu 20:1 – aby moc w każdej kapsułce była taka sama.",
      },
      {
        heading: "Czysty skład",
        body:
          "Tylko ekstrakt z Fadogia agrestis w roślinnej otoczce kapsułki. Wegański, bezglutenowy i bez GMO – bez substancji wiążących, wypełniaczy i sztucznych konserwantów.",
      },
      packaging,
    ],
    specs: [
      { label: "Nazwa łacińska", value: "Fadogia agrestis" },
      { label: "Stopień koncentracji", value: "20:1" },
      { label: "W kapsułce", value: "450 mg ekstraktu" },
      { label: "Dzienna porcja", value: "1 kapsułka dziennie" },
      { label: "Zawartość", value: "60 kapsułek – 60 dni" },
      { label: "Kapsułka", value: "Wegańska (HPMC)" },
    ],
    ingredients:
      "Ekstrakt z Fadogia agrestis 20:1, otoczka kapsułki (HPMC). Zawartość w kapsułce: ekstrakt z Fadogia agrestis (20:1) 450 mg.",
    usage: [oneDaily, noExceed, storeRoomTemp, keepAway],
    faq: [
      {
        q: "Co oznacza 20:1?",
        a: "Że 20 części suszonego surowca roślinnego zagęszczono do 1 części ekstraktu. To miara koncentracji, nic więcej.",
      },
      {
        q: "Czy mogę łączyć go z Tongkat Ali?",
        a: "Wiele osób tak robi. Stosuj się do zalecanej dziennej porcji każdego z produktów.",
      },
      lasts60,
      {
        q: "Czy zawiera wypełniacze?",
        a: "Nie. Tylko ekstrakt i wegańska otoczka kapsułki – bez substancji wiążących, słodzików i sztucznych konserwantów.",
      },
    ],
  },

  "blue-lotus": {
    eyebrow: "Nymphaea caerulea · ekstrakt 200:1",
    headline: "Święty kwiat Nilu, 400 mg w kapsułce",
    intro:
      "Skoncentrowany ekstrakt 200:1 z Blue Lotus. Czysty surowiec bez dodatków, wypełniaczy i sztucznych substancji, w wegańskiej kapsułce.",
    highlights: [
      { label: "Ekstrakt", value: "200:1" },
      { label: "W kapsułce", value: "400 mg" },
      { label: "Dzienna porcja", value: "1–2 kapsułki" },
    ],
    story: [
      {
        heading: "Święty w starożytnym Egipcie",
        body:
          "Blue Lotus (Nymphaea caerulea), czyli niebieska lilia wodna, rosła dziko na brzegach Nilu w starożytnym Egipcie. Miała tam status świętej rośliny i często przedstawiano ją w hieroglifach i na malowidłach świątynnych.",
      },
      {
        heading: "Bardzo wysoko skoncentrowany",
        body:
          "Nasz ekstrakt to koncentrat 200:1: 200 części suszonego kwiatu zagęszczono do 1 części ekstraktu. Czysty surowiec – bez dodatków, wypełniaczy i sztucznych substancji.",
      },
      {
        heading: "Tradycja i nowoczesna czystość",
        body:
          "Tylko ekstrakt z kwiatu w roślinnej otoczce kapsułki z celulozy na bazie wodorostów. Wegański i bez zbędnych dodatków.",
      },
    ],
    specs: [
      { label: "Nazwa łacińska", value: "Nymphaea caerulea" },
      { label: "Stopień koncentracji", value: "200:1" },
      { label: "W kapsułce", value: "400 mg ekstraktu" },
      { label: "Dzienna porcja", value: "1–2 kapsułki (400–800 mg)" },
      { label: "Kapsułka", value: "Wegańska (HPMC)" },
      { label: "Dodatki", value: "Brak" },
    ],
    ingredients:
      "Ekstrakt z Blue Lotus (Nymphaea caerulea) 200:1, roślinna kapsułka (HPMC). Zawartość w kapsułce: 400 mg ekstraktu z niebieskiego lotosu. Przy 2 kapsułkach: 800 mg ekstraktu z niebieskiego lotosu.",
    usage: [
      "1–2 kapsułki dziennie, popijane wodą.",
      noExceed,
      "Produkt nie jest przeznaczony do stosowania ani zakupu przez osoby poniżej 18 roku życia.",
      "Jeśli jesteś w ciąży, karmisz piersią lub pozostajesz pod opieką lekarską, skonsultuj się z lekarzem.",
      "Przechowuj w suchym miejscu, w temperaturze pokojowej, w miejscu niedostępnym dla małych dzieci.",
    ],
    faq: [
      {
        q: "Co oznacza 200:1?",
        a: "Że 200 części suszonego kwiatu zagęszczono do 1 części ekstraktu. To miara koncentracji, nic więcej.",
      },
      {
        q: "Czy zawiera dodatki?",
        a: "Nie. Tylko ekstrakt z blue lotus i roślinna otoczka kapsułki – bez wypełniaczy i sztucznych substancji.",
      },
      {
        q: "Czy produkt jest wegański?",
        a: "Tak, otoczka kapsułki jest roślinna (celuloza na bazie wodorostów).",
      },
      {
        q: "O jakiej porze dnia go przyjmować?",
        a: "Porę wybierasz sam. Wiele osób wybiera wieczór jako stały punkt swojej rutyny.",
      },
    ],
  },

  "black-tongkat": {
    eyebrow: "Eurycoma longifolia · ciemny korzeń, 200:1",
    headline: "Ciemny korzeń – 200:1 w wegańskiej kapsułce",
    intro:
      "Black Tongkat Ali to ekstrakt z korzenia Eurycoma longifolia 200:1 – ten sam gatunek co nasz żółty Tongkat Ali, ale z ciemnego korzenia. 500 mg w kapsułce. Zalecana porcja to 1–2 kapsułki dziennie.",
    highlights: [
      { label: "Ekstrakt", value: "200:1" },
      { label: "W kapsułce", value: "500 mg" },
      { label: "Dawkowanie", value: "1–2 kapsułki/dzień" },
    ],
    story: [
      {
        heading: "Ten sam gatunek, ciemniejszy korzeń",
        body:
          "Black Tongkat Ali to Eurycoma longifolia, tak samo jak żółty. Różnica tkwi w surowcu: ekstrakt powstaje z ciemnego korzenia. Na opakowaniu zawsze podajemy nazwę łacińską, żebyś dokładnie wiedział, co kupujesz.",
      },
      {
        heading: "Korzeń zagęszczony 200:1",
        body:
          "200 części suszonego korzenia zagęszcza się do jednej części ekstraktu. Używamy wyłącznie korzenia – bez kory, bez łodygi, bez liści. Ekstrakt z korzenia pochodzi z Azji Południowo-Wschodniej, skąd wywodzi się ta roślina.",
      },
      {
        heading: "Czysta kapsułka, jasne dawkowanie",
        body:
          "Każda kapsułka zawiera 500 mg ekstraktu w roślinnej otoczce (HPMC). Bez wypełniaczy, bez substancji poślizgowych, bez barwników. Zalecana porcja to 1–2 kapsułki dziennie.",
      },
    ],
    specs: [
      { label: "Nazwa łacińska", value: "Eurycoma longifolia" },
      { label: "Użyta część rośliny", value: "Korzeń" },
      { label: "Stopień koncentracji", value: "200:1" },
      { label: "W kapsułce", value: "500 mg ekstraktu" },
      { label: "Dzienna porcja", value: "1–2 kapsułki (500–1000 mg)" },
      { label: "Zawartość", value: "60 kapsułek – od 30 do 60 dni" },
      { label: "Otoczka kapsułki", value: "Roślinna (HPMC)" },
      { label: "Opakowanie", value: "Plastikowy pojemnik z zakrętką" },
    ],
    ingredients:
      "Ekstrakt z Tongkat Ali (Eurycoma longifolia, korzeń) 200:1, otoczka kapsułki (HPMC). Zawartość w kapsułce: ekstrakt z Tongkat Ali (200:1) 500 mg.",
    usage: [
      "1–2 kapsułki dziennie, popijane szklanką wody.",
      "Najlepiej przyjmować podczas posiłku, codziennie o tej samej porze.",
      noExceed,
      "Przechowuj w suchym miejscu, w temperaturze pokojowej i w miejscu niedostępnym dla małych dzieci.",
    ],
    faq: [
      {
        q: "Czym różni się od zwykłego (żółtego) Tongkat Ali?",
        a: "Oba to Eurycoma longifolia. Black Tongkat Ali powstaje z ciemnego korzenia i przyjmuje się go w ilości 1–2 kapsułek dziennie. Nasz żółty Elite zawiera 450 mg w kapsułce i przyjmuje się 1 kapsułkę dziennie.",
      },
      {
        q: "Co oznacza 200:1?",
        a: "Że 200 części suszonego korzenia zagęszczono do 1 części ekstraktu. To miara koncentracji.",
      },
      {
        q: "Ile kapsułek przyjmować?",
        a: "1–2 kapsułki dziennie. Opakowanie z 60 kapsułkami wystarcza na 30 dni przy 2 kapsułkach dziennie albo na 60 dni przy 1.",
      },
      {
        q: "Czy zawiera wypełniacze i czy jest wegański?",
        a: "Nie zawiera wypełniaczy. Kapsułka zawiera ekstrakt z korzenia i roślinną otoczkę z HPMC, dzięki czemu jest wegańska.",
      },
    ],
  },

  ashwagandha: {
    eyebrow: "Withania somnifera · 10% witanolidów",
    headline: "Ashwagandha, 400 mg w kapsułce",
    intro:
      "Standaryzowany ekstrakt z korzenia Withania somnifera z 10% witanolidów – 400 mg w kapsułce. 60 kapsułek w wegańskiej otoczce, bez dodatków.",
    highlights: [
      { label: "Standaryzacja", value: "10% witanolidów" },
      { label: "W kapsułce", value: "400 mg" },
      { label: "Kapsułki", value: "60 szt." },
    ],
    story: [
      {
        heading: "Korzeń, a nie cała roślina",
        body:
          "Ashwagandha bywa nazywana indyjskim żeń-szeniem i ma długą tradycję w ajurwedyjskiej kulturze ziołowej. Nasz ekstrakt pochodzi wyłącznie z korzenia. Tańsze warianty często powstają z całej zmielonej rośliny, łącznie z liśćmi i łodygą, co daje zupełnie inny skład.",
      },
      {
        heading: "Standaryzowany na 10%",
        body:
          "Witanolidy to substancje, których zawartość mierzy się w ekstrakcie z ashwagandhy. Nasz jest standaryzowany na 10%. 400 mg ekstraktu odpowiada 40 mg witanolidów w każdej kapsułce.",
      },
      {
        heading: "Czysty skład",
        body:
          "Tylko ekstrakt i roślinna otoczka kapsułki. Bez substancji wiążących, wypełniaczy i środków przeciwzbrylających – nic nie zostało dodane, by „rozcieńczyć” zawartość.",
      },
    ],
    specs: [
      { label: "Nazwa łacińska", value: "Withania somnifera" },
      { label: "Część rośliny", value: "Korzeń" },
      { label: "Standaryzacja", value: "10% witanolidów" },
      { label: "W kapsułce", value: "400 mg ekstraktu, w tym 40 mg witanolidów" },
      { label: "Dzienna porcja", value: "2–3 kapsułki dziennie" },
      { label: "Opakowanie", value: "60 kapsułek" },
      { label: "Kapsułka", value: "Wegańska (HPMC)" },
    ],
    ingredients:
      "Ekstrakt z ashwagandhy (Withania somnifera, korzeń) standaryzowany na 10% witanolidów, otoczka kapsułki (roślinna, HPMC). Zawartość w kapsułce: ekstrakt z ashwagandhy 400 mg, w tym witanolidy 40 mg.",
    usage: ["2–3 kapsułki dziennie, popijane szklanką wody.", noExceed, storeCool, keepAway],
    faq: [
      {
        q: "Co oznacza 10% witanolidów?",
        a: "Że ekstrakt jest standaryzowany tak, by witanolidy stanowiły 10% jego masy. W 400 mg ekstraktu odpowiada to 40 mg.",
      },
      {
        q: "Która część rośliny jest używana?",
        a: "Wyłącznie korzeń. Liście i łodyga nie są używane.",
      },
      {
        q: "Czy kapsułka jest wegańska?",
        a: "Tak. Otoczka kapsułki jest roślinna (HPMC).",
      },
      {
        q: "Ile kapsułek jest w opakowaniu?",
        a: "60 kapsułek.",
      },
    ],
  },

  maca: {
    eyebrow: "Lepidium meyenii · ekstrakt z korzenia 20:1",
    headline: "Korzeń maca, 470 mg w kapsułce",
    intro:
      "Maca to skoncentrowany ekstrakt 20:1 z korzenia Lepidium meyenii – rośliny bulwiastej o długiej tradycji w Andach. 60 kapsułek w wegańskiej otoczce, bez dodatków.",
    highlights: [
      { label: "Ekstrakt", value: "20:1" },
      { label: "W kapsułce", value: "470 mg" },
      { label: "Kapsułki", value: "60 szt." },
    ],
    story: [
      {
        heading: "Korzeń",
        body:
          "Maca (Lepidium meyenii) jest uprawiana wysoko w Andach i od pokoleń wykorzystywana w peruwiańskiej tradycji ziołowej. Korzeń jest suszony, mielony i zagęszczany do standaryzowanego ekstraktu 20:1 – z 20 części suszonego korzenia powstaje 1 część ekstraktu.",
      },
      {
        heading: "Czysty skład",
        body: `Tylko ekstrakt z korzenia maca w roślinnej otoczce kapsułki. ${cleanNoSweeteners}`,
      },
      packaging,
    ],
    specs: [
      { label: "Nazwa łacińska", value: "Lepidium meyenii" },
      { label: "Użyta część rośliny", value: "Korzeń" },
      { label: "Stopień koncentracji", value: "20:1" },
      { label: "W kapsułce", value: "470 mg ekstraktu z korzenia" },
      { label: "Dzienna porcja", value: "2 kapsułki dziennie" },
      { label: "Zawartość", value: "60 kapsułek – 30 dni" },
      { label: "Kapsułka", value: "Wegańska (HPMC)" },
    ],
    ingredients:
      "Ekstrakt z maca (Lepidium meyenii, korzeń) 20:1, otoczka kapsułki (HPMC). Zawartość w kapsułce: ekstrakt z korzenia maca (20:1) 470 mg.",
    usage: ["2 kapsułki dziennie, popijane szklanką wody.", noExceed, storeCool, keepAway],
    faq: [
      {
        q: "Co oznacza 20:1?",
        a: "Że 20 części suszonego korzenia maca zagęszczono do 1 części ekstraktu. To miara koncentracji, nic więcej.",
      },
      {
        q: "Na jak długo wystarcza jedno opakowanie?",
        a: "60 kapsułek przy 2 kapsułkach dziennie wystarcza na 30 dni.",
      },
      veganFaq,
      {
        q: "Czy zawiera wypełniacze?",
        a: "Nie. Tylko ekstrakt z korzenia i otoczka kapsułki – bez substancji wiążących, słodzików i sztucznych konserwantów.",
      },
    ],
  },

  mariatistel: {
    eyebrow: "Silybum marianum · 20:1, 80% sylimaryny",
    headline: "Ostropest plamisty, 350 mg w kapsułce",
    intro:
      "Ostropest plamisty to ekstrakt 20:1 z Silybum marianum, standaryzowany na 80% sylimaryny – 350 mg w kapsułce. 60 kapsułek w wegańskiej otoczce, bez dodatków.",
    highlights: [
      { label: "Ekstrakt", value: "20:1 · 80%" },
      { label: "W kapsułce", value: "350 mg" },
      { label: "Kapsułki", value: "60 szt." },
    ],
    story: [
      {
        heading: "Roślina",
        body:
          "Ostropest plamisty (Silybum marianum) to roślina z rodziny ostów pochodząca z regionu Morza Śródziemnego, o długiej tradycji w europejskim zielarstwie. Nasiona są suszone i ekstrahowane do koncentratu standaryzowanego na 80% sylimaryny – kompleksu flawonoidów, który zawiera m.in. izosilibinę (ok. 2,5%), sylikrystynę (ok. 10%) i silidianinę (ok. 7,5%).",
      },
      {
        heading: "Czysty skład",
        body:
          "Tylko ekstrakt z ostropestu w roślinnej otoczce kapsułki z pullulanu. Wegański, bezglutenowy i bez GMO – bez laktozy, soi, drożdży, pszenicy i mleka, a także bez barwników, substancji wiążących, wypełniaczy i sztucznych konserwantów.",
      },
      packaging,
    ],
    specs: [
      { label: "Nazwa łacińska", value: "Silybum marianum" },
      { label: "Użyta część rośliny", value: "Nasiona" },
      { label: "Stopień koncentracji", value: "20:1" },
      { label: "Standaryzacja", value: "80% sylimaryny" },
      { label: "W kapsułce", value: "350 mg ekstraktu" },
      { label: "Dzienna porcja", value: "1 kapsułka dziennie" },
      { label: "Zawartość", value: "60 kapsułek – 60 dni" },
      { label: "Kapsułka", value: "Wegańska (pullulan)" },
    ],
    ingredients:
      "Ekstrakt z ostropestu plamistego (Silybum marianum, nasiona) 20:1 standaryzowany na 80% sylimaryny, otoczka kapsułki (pullulan). Zawartość w kapsułce: ekstrakt z ostropestu plamistego 350 mg, w tym sylimaryna 280 mg.",
    usage: [oneDaily, noExceed, storeCool, keepAway],
    faq: [
      {
        q: "Co oznacza 80% sylimaryny?",
        a: "Że ekstrakt jest standaryzowany tak, by 80% stanowił kompleks flawonoidów zwany sylimaryną. W 350 mg ekstraktu odpowiada to 280 mg sylimaryny.",
      },
      {
        q: "Która część rośliny jest używana?",
        a: "Nasiona ostropestu plamistego, które są suszone i ekstrahowane do koncentratu 20:1.",
      },
      {
        q: "Czy kapsułka jest wegańska?",
        a: "Tak. Otoczka kapsułki jest z roślinnego pullulanu, a produkt jest bezglutenowy i bez GMO.",
      },
      lasts60,
    ],
  },

  nasselblad: {
    eyebrow: "Urtica dioica · ekstrakt z liści 10:1",
    headline: "Liść pokrzywy, 430 mg w kapsułce",
    intro:
      "Liść pokrzywy to ekstrakt 10:1 z liści Urtica dioica – 430 mg w kapsułce. 60 kapsułek w wegańskiej otoczce, bez dodatków.",
    highlights: [
      { label: "Ekstrakt", value: "10:1" },
      { label: "W kapsułce", value: "430 mg" },
      { label: "Kapsułki", value: "60 szt." },
    ],
    story: [
      {
        heading: "Liść",
        body:
          "Pokrzywa zwyczajna (Urtica dioica) od stuleci jest obecna w europejskiej tradycji ziołowej. Używamy liści, które są suszone i zagęszczane do ekstraktu 10:1 – z 10 części suszonego liścia powstaje 1 część ekstraktu.",
      },
      {
        heading: "Czysty skład",
        body: `Tylko ekstrakt z liści pokrzywy w roślinnej otoczce kapsułki. ${cleanNoSweeteners}`,
      },
      packaging,
    ],
    specs: [
      { label: "Nazwa łacińska", value: "Urtica dioica" },
      { label: "Użyta część rośliny", value: "Liść" },
      { label: "Stopień koncentracji", value: "10:1" },
      { label: "W kapsułce", value: "430 mg ekstraktu" },
      { label: "Dzienna porcja", value: "1 kapsułka dziennie" },
      { label: "Zawartość", value: "60 kapsułek – 60 dni" },
      { label: "Kapsułka", value: "Wegańska" },
    ],
    ingredients:
      "Ekstrakt z liści pokrzywy (Urtica dioica, liść) 10:1, otoczka kapsułki (roślinna). Zawartość w kapsułce: ekstrakt z liści pokrzywy 430 mg.",
    usage: [oneDaily, noExceed, storeCool, keepAway],
    faq: [
      {
        q: "Co oznacza 10:1?",
        a: "Że 10 części suszonego liścia pokrzywy zagęszczono do 1 części ekstraktu. To miara koncentracji, nic więcej.",
      },
      {
        q: "Która część rośliny jest używana?",
        a: "Liście pokrzywy zwyczajnej, które są suszone i ekstrahowane do koncentratu 10:1.",
      },
      veganFaq,
      lasts60,
    ],
  },

  druvkarneextrakt: {
    eyebrow: "Vitis vinifera · 95% OPC",
    headline: "Ekstrakt z pestek winogron, 500 mg w kapsułce",
    intro:
      "Ekstrakt z pestek winogron to ekstrakt z pestek Vitis vinifera, standaryzowany na 95% proantocyjanidyn (OPC) – 500 mg w kapsułce. 60 kapsułek w wegańskiej otoczce, bez dodatków.",
    highlights: [
      { label: "Standaryzacja", value: "95% OPC" },
      { label: "W kapsułce", value: "500 mg" },
      { label: "Kapsułki", value: "60 szt." },
    ],
    story: [
      {
        heading: "Pestka",
        body:
          "Winorośl (Vitis vinifera) uprawia się w Europie od niepamiętnych czasów. Używamy pestek – naturalnego źródła polifenoli – i ekstrahujemy je do koncentratu standaryzowanego na 95% proantocyjanidyn, nazywanych też OPC.",
      },
      {
        heading: "Czysty skład",
        body: `Tylko ekstrakt z pestek winogron w roślinnej otoczce kapsułki. ${cleanNoSweeteners}`,
      },
      packaging,
    ],
    specs: [
      { label: "Nazwa łacińska", value: "Vitis vinifera" },
      { label: "Użyta część rośliny", value: "Pestka" },
      { label: "Standaryzacja", value: "95% proantocyjanidyn (OPC)" },
      { label: "W kapsułce", value: "500 mg ekstraktu" },
      { label: "Dzienna porcja", value: "1–2 kapsułki dziennie" },
      { label: "Zawartość", value: "60 kapsułek – 30–60 dni" },
      { label: "Kapsułka", value: "Wegańska" },
    ],
    ingredients:
      "Ekstrakt z pestek winogron (Vitis vinifera, pestka) standaryzowany na 95% proantocyjanidyn, otoczka kapsułki (roślinna). Zawartość w kapsułce: ekstrakt z pestek winogron 500 mg, w tym proantocyjanidyny 475 mg.",
    usage: ["1–2 kapsułki dziennie, popijane szklanką wody.", noExceed, storeCool, keepAway],
    faq: [
      {
        q: "Co oznacza 95% OPC?",
        a: "Że ekstrakt jest standaryzowany tak, by proantocyjanidyny stanowiły 95% jego masy. W 500 mg ekstraktu odpowiada to 475 mg.",
      },
      {
        q: "Która część rośliny jest używana?",
        a: "Pestki winogron, które są ekstrahowane i standaryzowane na polifenole.",
      },
      veganFaq,
      {
        q: "Na jak długo wystarcza jedno opakowanie?",
        a: "60 kapsułek wystarcza na 30 dni przy 2 kapsułkach dziennie i na 60 dni przy 1 kapsułce dziennie.",
      },
    ],
  },

  quercetin: {
    eyebrow: "Kwercetyna · czystość 98%",
    headline: "Kwercetyna, 500 mg w kapsułce",
    intro:
      "Kwercetyna to flawonoid, który naturalnie występuje w owocach i warzywach. Nasz ekstrakt ma czystość 98% – 500 mg w kapsułce. 60 kapsułek w wegańskiej otoczce, bez dodatków.",
    highlights: [
      { label: "Czystość", value: "98%" },
      { label: "W kapsułce", value: "500 mg" },
      { label: "Kapsułki", value: "60 szt." },
    ],
    story: [
      {
        heading: "Substancja",
        body:
          "Kwercetyna to roślinny flawonoid, który występuje m.in. w cebuli, jabłkach i jagodach. Wybieramy ekstrakt o wysokiej czystości – 98% – aby każda kapsułka miała taką samą zawartość, partia po partii.",
      },
      {
        heading: "Czysty skład",
        body: `Tylko ekstrakt z kwercetyny w roślinnej otoczce kapsułki. ${cleanNoSweeteners}`,
      },
      packaging,
    ],
    specs: [
      { label: "Zawartość", value: "Ekstrakt z kwercetyny" },
      { label: "Czystość", value: "98% kwercetyny" },
      { label: "W kapsułce", value: "500 mg" },
      { label: "Dzienna porcja", value: "1 kapsułka dziennie" },
      { label: "Opakowanie", value: "60 kapsułek – 60 dni" },
      { label: "Kapsułka", value: "Wegańska" },
    ],
    ingredients:
      "Ekstrakt z kwercetyny (98% kwercetyny), otoczka kapsułki (roślinna). Zawartość w kapsułce: ekstrakt z kwercetyny 500 mg, w tym kwercetyna 490 mg.",
    usage: [oneDaily, noExceed, storeCool, keepAway],
    faq: [
      {
        q: "Co oznacza czystość 98%?",
        a: "Że 98% ekstraktu stanowi kwercetyna. W 500 mg ekstraktu odpowiada to 490 mg kwercetyny.",
      },
      {
        q: "Skąd pochodzi kwercetyna?",
        a: "Kwercetyna to flawonoid, który naturalnie występuje w owocach, warzywach i ziołach.",
      },
      veganFaq,
      lasts60,
    ],
  },

  reishi: {
    eyebrow: "Ganoderma lucidum · 40% polisacharydów",
    headline: "Reishi, 350 mg w kapsułce",
    intro:
      "Reishi (Ganoderma lucidum) w standaryzowanym ekstrakcie z grzyba z 40% polisacharydów – 350 mg w kapsułce. 60 kapsułek w wegańskiej otoczce, bez dodatków.",
    highlights: [
      { label: "Standaryzacja", value: "40% polisacharydów" },
      { label: "W kapsułce", value: "350 mg" },
      { label: "Kapsułki", value: "60 szt." },
    ],
    story: [
      {
        heading: "Grzyb",
        body:
          "Reishi, Ganoderma lucidum, od stuleci jest wykorzystywany w tradycyjnej kulturze ziołowej. Nasz ekstrakt jest skoncentrowany i standaryzowany na 40% polisacharydów, dzięki czemu zawartość każdej kapsułki jest taka sama.",
      },
      {
        heading: "Czysty skład",
        body: `Tylko ekstrakt z reishi w roślinnej otoczce kapsułki. ${cleanNoSweeteners}`,
      },
      packaging,
    ],
    specs: [
      { label: "Nazwa łacińska", value: "Ganoderma lucidum" },
      { label: "Standaryzacja", value: "40% polisacharydów" },
      { label: "W kapsułce", value: "350 mg" },
      { label: "Dzienna porcja", value: "1 kapsułka dziennie" },
      { label: "Opakowanie", value: "60 kapsułek – 60 dni" },
      { label: "Kapsułka", value: "Wegańska" },
    ],
    ingredients:
      "Ekstrakt z reishi (Ganoderma lucidum) standaryzowany na 40% polisacharydów, otoczka kapsułki (roślinna). Zawartość w kapsułce: ekstrakt z reishi 350 mg, w tym polisacharydy 140 mg.",
    usage: [oneDaily, noExceed, storeCool, keepAway],
    faq: [
      {
        q: "Co oznacza 40% polisacharydów?",
        a: "Że ekstrakt jest standaryzowany tak, by polisacharydy stanowiły 40% jego masy. W 350 mg ekstraktu odpowiada to 140 mg.",
      },
      {
        q: "Jaki grzyb jest używany?",
        a: "Ganoderma lucidum, powszechnie znany jako reishi.",
      },
      veganFaq,
      lasts60,
    ],
  },

  chaga: {
    eyebrow: "Inonotus obliquus · ekstrakt 30:1",
    headline: "Chaga, 400 mg w kapsułce",
    intro:
      "Chaga (Inonotus obliquus) w ekstrakcie 30:1, standaryzowanym na 10% polisacharydów – 400 mg w kapsułce. 60 kapsułek w wegańskiej otoczce, bez dodatków.",
    highlights: [
      { label: "Ekstrakt", value: "30:1" },
      { label: "W kapsułce", value: "400 mg" },
      { label: "Kapsułki", value: "60 szt." },
    ],
    story: [
      {
        heading: "Grzyb",
        body:
          "Chaga rośnie powoli na brzozach i przez wiele lat pobiera z drzewa składniki odżywcze. Nasz ekstrakt pochodzi z dziko zbieranej chagi wysokiej jakości, jest zagęszczony 30:1 i standaryzowany na 10% polisacharydów.",
      },
      {
        heading: "Czysty skład",
        body: `Tylko ekstrakt z chagi w roślinnej otoczce kapsułki. ${cleanNoSweeteners}`,
      },
      packaging,
    ],
    specs: [
      { label: "Nazwa łacińska", value: "Inonotus obliquus" },
      { label: "Ekstrakt", value: "30:1" },
      { label: "Standaryzacja", value: "10% polisacharydów" },
      { label: "W kapsułce", value: "400 mg" },
      { label: "Dzienna porcja", value: "1 kapsułka dziennie" },
      { label: "Opakowanie", value: "60 kapsułek – 60 dni" },
      { label: "Kapsułka", value: "Wegańska" },
    ],
    ingredients:
      "Ekstrakt z chagi (Inonotus obliquus) 30:1 standaryzowany na 10% polisacharydów, otoczka kapsułki (roślinna). Zawartość w kapsułce: ekstrakt z chagi 400 mg, w tym polisacharydy 40 mg.",
    usage: [oneDaily, noExceed, storeCool, keepAway],
    faq: [
      {
        q: "Co oznacza 30:1?",
        a: "Że 30 części surowca zagęszczono do 1 części ekstraktu. 400 mg ekstraktu odpowiada około 12 g suszonej chagi.",
      },
      {
        q: "Co oznacza 10% polisacharydów?",
        a: "Że ekstrakt jest standaryzowany tak, by polisacharydy stanowiły 10% jego masy – 40 mg w kapsułce.",
      },
      veganFaq,
      lasts60,
    ],
  },

  "lions-mane": {
    eyebrow: "Hericium erinaceus · 60% polisacharydów",
    headline: "Lion's Mane, 500 mg w kapsułce",
    intro:
      "Lion's Mane (Hericium erinaceus) w standaryzowanym ekstrakcie z grzyba z 60% polisacharydów, w tym 45% beta-glukanów – 500 mg w kapsułce. 60 kapsułek w wegańskiej otoczce, bez dodatków.",
    highlights: [
      { label: "Standaryzacja", value: "60% polisacharydów" },
      { label: "W kapsułce", value: "500 mg" },
      { label: "Kapsułki", value: "60 szt." },
    ],
    story: [
      {
        heading: "Grzyb",
        body:
          "Lion's Mane, Hericium erinaceus, ma długą historię w tradycyjnej kulturze ziołowej Azji Wschodniej. Nasz ekstrakt jest skoncentrowany i standaryzowany na 60% polisacharydów, w tym 45% beta-glukanów, dzięki czemu zawartość każdej kapsułki jest taka sama.",
      },
      {
        heading: "Czysty skład",
        body: `Tylko ekstrakt z Lion's Mane w roślinnej otoczce kapsułki. ${cleanNoSweeteners}`,
      },
      packaging,
    ],
    specs: [
      { label: "Nazwa łacińska", value: "Hericium erinaceus" },
      { label: "Standaryzacja", value: "60% polisacharydów" },
      { label: "W tym beta-glukany", value: "45%" },
      { label: "W kapsułce", value: "500 mg" },
      { label: "Dzienna porcja", value: "1 kapsułka dziennie" },
      { label: "Opakowanie", value: "60 kapsułek – 60 dni" },
      { label: "Kapsułka", value: "Wegańska" },
    ],
    ingredients:
      "Ekstrakt z Lion's Mane (Hericium erinaceus) standaryzowany na 60% polisacharydów, w tym 45% beta-glukanów, otoczka kapsułki (roślinna). Zawartość w kapsułce: ekstrakt 500 mg, w tym polisacharydy 300 mg i beta-glukany 225 mg.",
    usage: [oneDaily, noExceed, storeCool, keepAway],
    faq: [
      {
        q: "Co oznacza 60% polisacharydów?",
        a: "Że ekstrakt jest standaryzowany tak, by polisacharydy stanowiły 60% jego masy. W 500 mg ekstraktu odpowiada to 300 mg.",
      },
      {
        q: "Czym są beta-glukany?",
        a: "To określona grupa polisacharydów. W naszym ekstrakcie stanowią 45%, czyli 225 mg w kapsułce.",
      },
      veganFaq,
      lasts60,
    ],
  },

  cordyceps: {
    eyebrow: "Cordyceps militaris · ekstrakt 8:1",
    headline: "Cordyceps, 350 mg w kapsułce",
    intro:
      "Cordyceps (Cordyceps militaris) w ekstrakcie 8:1, standaryzowanym na 40% polisacharydów – 350 mg w kapsułce. 60 kapsułek w wegańskiej otoczce, bez dodatków.",
    highlights: [
      { label: "Ekstrakt", value: "8:1" },
      { label: "W kapsułce", value: "350 mg" },
      { label: "Kapsułki", value: "60 szt." },
    ],
    story: [
      {
        heading: "Grzyb",
        body:
          "Cordyceps od dawna ma swoje miejsce we wschodnioazjatyckiej kulturze ziołowej. Nasz ekstrakt pochodzi ze starannie wyselekcjonowanego Cordyceps militaris, jest zagęszczony 8:1 i standaryzowany na 40% polisacharydów, dzięki czemu zawartość każdej kapsułki jest taka sama.",
      },
      {
        heading: "Czysty skład",
        body: `Tylko ekstrakt z cordycepsa w roślinnej otoczce kapsułki. ${cleanNoSweeteners}`,
      },
      packaging,
    ],
    specs: [
      { label: "Nazwa łacińska", value: "Cordyceps militaris" },
      { label: "Ekstrakt", value: "8:1" },
      { label: "Standaryzacja", value: "40% polisacharydów" },
      { label: "W kapsułce", value: "350 mg" },
      { label: "Dzienna porcja", value: "1 kapsułka dziennie" },
      { label: "Opakowanie", value: "60 kapsułek – 60 dni" },
      { label: "Kapsułka", value: "Wegańska" },
    ],
    ingredients:
      "Ekstrakt z cordycepsa (Cordyceps militaris) 8:1 standaryzowany na 40% polisacharydów, otoczka kapsułki (roślinna). Zawartość w kapsułce: ekstrakt z cordycepsa 350 mg, w tym polisacharydy 140 mg.",
    usage: [oneDaily, noExceed, storeCool, keepAway],
    faq: [
      {
        q: "Co oznacza 8:1?",
        a: "Że 8 części surowca zagęszczono do 1 części ekstraktu. 350 mg ekstraktu odpowiada około 2,8 g suszonego cordycepsa.",
      },
      {
        q: "Co oznacza 40% polisacharydów?",
        a: "Że ekstrakt jest standaryzowany tak, by polisacharydy stanowiły 40% jego masy – 140 mg w kapsułce.",
      },
      veganFaq,
      lasts60,
    ],
  },

  "pine-pollen": {
    eyebrow: "Pyłek sosnowy · ekstrakt o czystości 99%",
    headline: "Pine Pollen, 300 mg w kapsułce",
    intro:
      "Pyłek sosny w ekstrakcie o czystości 99%, z rozbitymi ścianami komórkowymi – 300 mg w kapsułce. 60 kapsułek w wegańskiej otoczce, bez dodatków.",
    highlights: [
      { label: "Czystość", value: "99%" },
      { label: "W kapsułce", value: "300 mg" },
      { label: "Kapsułki", value: "60 szt." },
    ],
    story: [
      {
        heading: "Żółty pył wiosny",
        body:
          "Przez kilka tygodni wiosną sosna uwalnia pyłek – drobny żółty pył, który osiada na ziemi i wodzie. Zbiór odbywa się w tym krótkim okresie, gdy pyłek jest dostępny, dlatego surowiec jest sezonowy.",
      },
      {
        heading: "Rozbite ściany komórkowe",
        body:
          "Ziarno pyłku ma twardą zewnętrzną otoczkę. W naszym ekstrakcie ściany komórkowe są rozbite – to etap, który udostępnia zawartość ziarna, zamiast pozwolić mu przejść w nienaruszonym stanie.",
      },
      {
        heading: "Czysty skład",
        body:
          "Ekstrakt z pyłku o czystości 99% i roślinna otoczka kapsułki. Bez substancji wiążących, wypełniaczy i środków przeciwzbrylających.",
      },
    ],
    specs: [
      { label: "Surowiec", value: "Pyłek sosny" },
      { label: "Czystość", value: "99%" },
      { label: "Obróbka", value: "Rozbite ściany komórkowe" },
      { label: "W kapsułce", value: "300 mg" },
      { label: "Dzienna porcja", value: "1–3 kapsułki dziennie" },
      { label: "Opakowanie", value: "60 kapsułek" },
      { label: "Kapsułka", value: "Wegańska (HPMC)" },
    ],
    ingredients:
      "Ekstrakt z pyłku sosny (czystość 99%, rozbite ściany komórkowe), otoczka kapsułki (roślinna, HPMC). Zawartość w kapsułce: ekstrakt z pyłku 300 mg.",
    usage: ["1–3 kapsułki dziennie, popijane szklanką wody.", noExceed, storeCool, keepAway],
    faq: [
      {
        q: "Co oznaczają rozbite ściany komórkowe?",
        a: "Zewnętrzna otoczka ziarna pyłku została otwarta podczas obróbki, dzięki czemu jego zawartość staje się dostępna, zamiast przejść w nienaruszonym stanie.",
      },
      {
        q: "Kiedy zbiera się pyłek?",
        a: "W krótkim okresie wiosną, gdy sosna uwalnia pyłek.",
      },
      {
        q: "Czy kapsułka jest wegańska?",
        a: "Tak. Otoczka kapsułki jest roślinna (HPMC).",
      },
      {
        q: "Ile kapsułek jest w opakowaniu?",
        a: "60 kapsułek.",
      },
    ],
  },
};
