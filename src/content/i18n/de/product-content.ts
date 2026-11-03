import type { ProductContent } from "@/content/product-content";

/**
 * Inhalte der Produktseiten auf Deutsch (de-DE). Übersetzt aus src/content/product-content.ts.
 * Keine gesundheitsbezogenen Angaben – nur Botanik, Herkunft, Extraktion, Form und Dosierung.
 */

const packaging = {
  heading: "Verpackung und Versand",
  body:
    "Die Kapseln werden in einer Kunststoffdose mit Schraubdeckel verpackt, die den Inhalt zwischen den Einnahmen trocken hält. Jede Bestellung wird aus unserem Lager in der EU verschickt.",
};

const noExceed = "Die empfohlene tägliche Verzehrmenge nicht überschreiten.";
const keepAway = "Außerhalb der Reichweite von kleinen Kindern aufbewahren.";
const storeRoomTemp = "Trocken bei Raumtemperatur lagern. Die Dose nach jedem Gebrauch wieder gut verschließen.";
const storeCool = "Kühl und trocken lagern. Die Dose nach jedem Gebrauch wieder gut verschließen.";
const cleanNoSweeteners =
  "Vegan, glutenfrei und gentechnikfrei – ohne Bindemittel, Füllstoffe, Süßungsmittel oder künstliche Konservierungsstoffe.";
const veganFaq = {
  q: "Ist die Kapsel vegan?",
  a: "Ja. Die Kapselhülle ist pflanzlich, und das Produkt ist glutenfrei und gentechnikfrei.",
};
const oneDaily = "1 Kapsel täglich mit einem Glas Wasser.";
const lasts60 = { q: "Wie lange reicht eine Dose?", a: "60 Kapseln reichen bei 1 Kapsel täglich für 60 Tage." };

export const productContent: Record<string, ProductContent> = {
  "tongkat-ali-elite": {
    eyebrow: "Eurycoma longifolia · 200:1 Wurzelextrakt",
    headline: "Reine Wurzel, 450 mg pro Kapsel",
    intro:
      "Tongkat Ali Elite ist ein konzentrierter 200:1-Extrakt aus der Wurzel von Eurycoma longifolia – auch bekannt als Malaysian Ginseng oder Longjack. In einer veganen Kapsel, ohne Zusatzstoffe.",
    highlights: [
      { label: "Extrakt", value: "200:1" },
      { label: "Pro Kapsel", value: "450 mg" },
      { label: "Kapseln", value: "60 Stück" },
    ],
    story: [
      {
        heading: "Die Wurzel",
        body:
          "Wir gehen von sorgfältig ausgewählten Wurzeln von Eurycoma longifolia aus, einem botanischen Rohstoff mit langer Tradition in Südostasien. Die Wurzel wird getrocknet, gemahlen und zu einem 200:1-Extrakt konzentriert – aus 200 Teilen getrockneter Wurzel wird 1 Teil Extrakt.",
      },
      {
        heading: "Reine Zusammensetzung",
        body:
          "Nur Wurzelextrakt in einer pflanzlichen Kapselhülle. Vegan, glutenfrei und gentechnikfrei – ohne Bindemittel, Füllstoffe, Süßungsmittel oder künstliche Konservierungsstoffe.",
      },
      packaging,
    ],
    specs: [
      { label: "Lateinischer Name", value: "Eurycoma longifolia" },
      { label: "Verwendeter Pflanzenteil", value: "Wurzel" },
      { label: "Extraktstärke", value: "200:1" },
      { label: "Pro Kapsel", value: "450 mg Wurzelextrakt" },
      { label: "Tagesdosis", value: "1 Kapsel täglich" },
      { label: "Inhalt", value: "60 Kapseln – 60 Tage" },
      { label: "Kapsel", value: "Vegan (HPMC)" },
    ],
    ingredients:
      "Tongkat-Ali-Extrakt (Eurycoma longifolia, Wurzel) 200:1, Kapselhülle (HPMC). Inhalt pro Kapsel: Tongkat-Ali-Extrakt (200:1) 450 mg.",
    usage: [oneDaily, noExceed, storeRoomTemp, keepAway],
    faq: [
      {
        q: "Was bedeutet 200:1?",
        a: "Dass 200 Teile getrocknete Wurzel zu 1 Teil Extrakt konzentriert wurden. Es ist ein Maß für die Konzentration, nichts anderes.",
      },
      lasts60,
      {
        q: "Ist die Kapsel vegan?",
        a: "Ja. Die Kapselhülle ist pflanzlich (HPMC), und das Produkt ist glutenfrei und gentechnikfrei.",
      },
      {
        q: "Enthält sie Füllstoffe?",
        a: "Nein. Nur Wurzelextrakt und die Kapselhülle – ohne Bindemittel, Süßungsmittel oder künstliche Konservierungsstoffe.",
      },
    ],
  },

  "tongkat-premium": {
    eyebrow: "Eurycoma longifolia · 200:1, 20 mg Eurycomanon",
    headline: "Standardisiert auf Eurycomanon",
    intro:
      "Tongkat Ali Ultra 4% ist ein 200:1-Wurzelextrakt aus Eurycoma longifolia – 520 mg pro Kapsel, davon 20 mg Eurycomanon. 60 Kapseln pro Dose. Nicht auf leeren Magen einnehmen.",
    highlights: [
      { label: "Extrakt", value: "200:1" },
      { label: "Pro Kapsel", value: "520 mg" },
      { label: "Kapseln", value: "60 Stück" },
    ],
    story: [
      {
        heading: "Die Wurzel",
        body:
          "Wir gehen von sorgfältig ausgewählten Wurzeln von Eurycoma longifolia aus – auch bekannt als Malaysian Ginseng oder Longjack –, einem botanischen Rohstoff mit langer Tradition in Südostasien. Die Wurzel wird zu einem 200:1-Extrakt konzentriert.",
      },
      {
        heading: "20 mg Eurycomanon pro Kapsel",
        body:
          "Jede Charge wird auf den Gehalt an Eurycomanon standardisiert, sodass jede Kapsel mit 520 mg 20 mg Eurycomanon enthält. So bleibt die Stärke von Charge zu Charge gleich. Eine Kapsel am Tag.",
      },
      packaging,
    ],
    specs: [
      { label: "Lateinischer Name", value: "Eurycoma longifolia" },
      { label: "Verwendeter Pflanzenteil", value: "Wurzel" },
      { label: "Extraktstärke", value: "200:1, standardisiert auf Eurycomanon" },
      { label: "Pro Kapsel", value: "520 mg Wurzelextrakt (20 mg Eurycomanon)" },
      { label: "Tagesdosis", value: "1 Kapsel täglich" },
      { label: "Inhalt", value: "60 Kapseln – 60 Tage" },
      { label: "Verpackung", value: "Kunststoffdose mit Schraubdeckel" },
      { label: "Kapsel", value: "Vegan (HPMC)" },
    ],
    ingredients:
      "Tongkat-Ali-Extrakt (Eurycoma longifolia, Wurzel) 200:1, Kapselhülle (HPMC). Inhalt pro Kapsel: Tongkat-Ali-Extrakt (200:1) 520 mg, davon Eurycomanon 20 mg.",
    usage: [
      oneDaily,
      "Nicht auf nüchternen Magen einnehmen – der Extrakt ist sehr stark.",
      noExceed,
      storeRoomTemp,
      keepAway,
    ],
    faq: [
      {
        q: "Wie viel Eurycomanon enthält eine Kapsel?",
        a: "20 mg Eurycomanon in 520 mg Extrakt.",
      },
      {
        q: "Was unterscheidet Ultra 4% von Elite?",
        a: "Elite ist ein 200:1-Wurzelextrakt mit 450 mg pro Kapsel ohne Standardisierung auf Eurycomanon. Ultra 4% enthält 520 mg pro Kapsel, davon 20 mg Eurycomanon.",
      },
      lasts60,
      {
        q: "Enthält sie Füllstoffe?",
        a: "Nein. Nur Wurzelextrakt und eine vegane Kapselhülle – ohne Bindemittel, Füllstoffe oder künstliche Konservierungsstoffe.",
      },
    ],
  },

  "fadogia-agrestis": {
    eyebrow: "Fadogia agrestis · 20:1 Kräuterextrakt",
    headline: "Reine Pflanze, 450 mg pro Kapsel",
    intro:
      "Ein 20:1-Extrakt aus Fadogia agrestis, einem Strauch mit langer Tradition in der westafrikanischen Kräuterverwendung. 450 mg pro Kapsel in einer veganen Kapsel – ohne Zusatzstoffe.",
    highlights: [
      { label: "Extrakt", value: "20:1" },
      { label: "Pro Kapsel", value: "450 mg" },
      { label: "Kapseln", value: "60 Stück" },
    ],
    story: [
      {
        heading: "Die Pflanze",
        body:
          "Fadogia agrestis ist ein Strauch, der in Teilen Afrikas wächst und seit Langem einen festen Platz in traditionellen Kräuterzubereitungen hat. Wir verwenden sorgfältig ausgewählte Pflanzenteile, die zu einem 20:1-Extrakt konzentriert werden – für eine gleichmäßige Stärke in jeder Kapsel.",
      },
      {
        heading: "Reine Zusammensetzung",
        body:
          "Nur Fadogia-agrestis-Extrakt in einer pflanzlichen Kapselhülle. Vegan, glutenfrei und gentechnikfrei – ohne Bindemittel, Füllstoffe oder künstliche Konservierungsstoffe.",
      },
      packaging,
    ],
    specs: [
      { label: "Lateinischer Name", value: "Fadogia agrestis" },
      { label: "Extraktstärke", value: "20:1" },
      { label: "Pro Kapsel", value: "450 mg Extrakt" },
      { label: "Tagesdosis", value: "1 Kapsel täglich" },
      { label: "Inhalt", value: "60 Kapseln – 60 Tage" },
      { label: "Kapsel", value: "Vegan (HPMC)" },
    ],
    ingredients:
      "Fadogia-agrestis-Extrakt 20:1, Kapselhülle (HPMC). Inhalt pro Kapsel: Fadogia-agrestis-Extrakt (20:1) 450 mg.",
    usage: [oneDaily, noExceed, storeRoomTemp, keepAway],
    faq: [
      {
        q: "Was bedeutet 20:1?",
        a: "Dass 20 Teile getrocknetes Pflanzenmaterial zu 1 Teil Extrakt konzentriert wurden. Es ist ein Maß für die Konzentration, nichts anderes.",
      },
      {
        q: "Kann ich es mit Tongkat Ali kombinieren?",
        a: "Viele tun das. Halte dich an die empfohlene tägliche Verzehrmenge des jeweiligen Produkts.",
      },
      lasts60,
      {
        q: "Enthält sie Füllstoffe?",
        a: "Nein. Nur Extrakt und eine vegane Kapselhülle – ohne Bindemittel, Süßungsmittel oder künstliche Konservierungsstoffe.",
      },
    ],
  },

  "blue-lotus": {
    eyebrow: "Nymphaea caerulea · 200:1 Extrakt",
    headline: "Die heilige Blume des Nils, 400 mg pro Kapsel",
    intro:
      "Ein konzentrierter 200:1-Extrakt aus Blue Lotus. Reiner Rohstoff ohne Zusatzstoffe, Füllstoffe oder künstliche Stoffe, in einer veganen Kapsel.",
    highlights: [
      { label: "Extrakt", value: "200:1" },
      { label: "Pro Kapsel", value: "400 mg" },
      { label: "Tagesdosis", value: "1–2 Kapseln" },
    ],
    story: [
      {
        heading: "Heilig im alten Ägypten",
        body:
          "Blue Lotus (Nymphaea caerulea), die Blaue Seerose, wuchs im alten Ägypten wild an den Ufern des Nils. Dort hatte sie einen heiligen Status und wurde häufig in Hieroglyphen und Tempelmalereien dargestellt.",
      },
      {
        heading: "Extrem hoch konzentriert",
        body:
          "Unser Extrakt ist ein 200:1-Konzentrat: 200 Teile getrocknete Blüte wurden zu 1 Teil Extrakt konzentriert. Reiner Rohstoff – ohne Zusatzstoffe, Füllstoffe oder künstliche Stoffe.",
      },
      {
        heading: "Tradition trifft moderne Reinheit",
        body:
          "Nur Blütenextrakt in einer pflanzlichen Kapselhülle aus Cellulose auf Algenbasis. Vegan und ohne unnötige Zusatzstoffe.",
      },
    ],
    specs: [
      { label: "Lateinischer Name", value: "Nymphaea caerulea" },
      { label: "Extraktstärke", value: "200:1" },
      { label: "Pro Kapsel", value: "400 mg Extrakt" },
      { label: "Tagesdosis", value: "1–2 Kapseln (400–800 mg)" },
      { label: "Kapsel", value: "Vegan (HPMC)" },
      { label: "Zusatzstoffe", value: "Keine" },
    ],
    ingredients:
      "Blue-Lotus-Extrakt (Nymphaea caerulea) 200:1, pflanzliche Kapsel (HPMC). Inhalt pro Kapsel: 400 mg Blauer-Lotus-Extrakt. Bei 2 Kapseln: 800 mg Blauer-Lotus-Extrakt.",
    usage: [
      "1–2 Kapseln täglich mit Wasser.",
      noExceed,
      "Nicht zur Verwendung oder zum Kauf durch Personen unter 18 Jahren bestimmt.",
      "Sprich mit medizinischem Fachpersonal, wenn du schwanger bist, stillst oder in ärztlicher Behandlung bist.",
      "Trocken bei Raumtemperatur und außerhalb der Reichweite von kleinen Kindern aufbewahren.",
    ],
    faq: [
      {
        q: "Was bedeutet 200:1?",
        a: "Dass 200 Teile getrocknete Blüte zu 1 Teil Extrakt konzentriert wurden. Es ist ein Maß für die Konzentration, nichts anderes.",
      },
      {
        q: "Enthält sie Zusatzstoffe?",
        a: "Nein. Nur Blue-Lotus-Extrakt und eine pflanzliche Kapselhülle – ohne Füllstoffe oder künstliche Stoffe.",
      },
      {
        q: "Ist das Produkt vegan?",
        a: "Ja, die Kapselhülle ist pflanzlich (Cellulose auf Algenbasis).",
      },
      {
        q: "Zu welcher Tageszeit nimmt man sie?",
        a: "Den Zeitpunkt bestimmst du selbst. Viele wählen den Abend als festen Punkt in ihrer Routine.",
      },
    ],
  },

  "black-tongkat": {
    eyebrow: "Eurycoma longifolia · dunkle Wurzel, 200:1",
    headline: "Die dunkle Wurzel – 200:1 in einer veganen Kapsel",
    intro:
      "Black Tongkat Ali ist ein 200:1-Wurzelextrakt aus Eurycoma longifolia, derselben Art wie unser gelber Tongkat Ali, hergestellt aus dunkler Wurzel. 500 mg pro Kapsel. Die empfohlene Dosis liegt bei 1–2 Kapseln am Tag.",
    highlights: [
      { label: "Extrakt", value: "200:1" },
      { label: "Pro Kapsel", value: "500 mg" },
      { label: "Dosierung", value: "1–2 Kapseln/Tag" },
    ],
    story: [
      {
        heading: "Dieselbe Art, dunklere Wurzel",
        body:
          "Black Tongkat Ali ist Eurycoma longifolia, genau wie der gelbe. Der Unterschied liegt im Rohstoff: Der Extrakt wird aus dunkler Wurzel hergestellt. Wir geben immer den lateinischen Namen auf der Dose an, damit du genau weißt, was du kaufst.",
      },
      {
        heading: "Wurzel, 200:1 konzentriert",
        body:
          "200 Teile getrocknete Wurzel werden zu einem Teil Extrakt konzentriert. Verwendet wird nur die Wurzel – keine Rinde, kein Stamm, keine Blätter. Der Wurzelextrakt stammt aus Südostasien, wo die Pflanze zu Hause ist.",
      },
      {
        heading: "Reine Kapsel, klare Dosierung",
        body:
          "Jede Kapsel enthält 500 mg Extrakt in einer pflanzlichen Hülle (HPMC). Keine Füllstoffe, keine Fließmittel, keine Farbstoffe. Die empfohlene Dosis liegt bei 1–2 Kapseln am Tag.",
      },
    ],
    specs: [
      { label: "Lateinischer Name", value: "Eurycoma longifolia" },
      { label: "Verwendeter Pflanzenteil", value: "Wurzel" },
      { label: "Extraktstärke", value: "200:1" },
      { label: "Pro Kapsel", value: "500 mg Extrakt" },
      { label: "Tagesdosis", value: "1–2 Kapseln (500–1.000 mg)" },
      { label: "Inhalt", value: "60 Kapseln – 30 bis 60 Tage" },
      { label: "Kapselhülle", value: "Pflanzlich (HPMC)" },
      { label: "Verpackung", value: "Kunststoffdose mit Schraubdeckel" },
    ],
    ingredients:
      "Tongkat-Ali-Extrakt (Eurycoma longifolia, Wurzel) 200:1, Kapselhülle (HPMC). Inhalt pro Kapsel: Tongkat-Ali-Extrakt (200:1) 500 mg.",
    usage: [
      "1–2 Kapseln täglich mit einem Glas Wasser.",
      "Am besten zu einer Mahlzeit einnehmen, jeden Tag zur gleichen Zeit.",
      noExceed,
      "Trocken bei Raumtemperatur und außerhalb der Reichweite von kleinen Kindern aufbewahren.",
    ],
    faq: [
      {
        q: "Was ist der Unterschied zu normalem (gelbem) Tongkat Ali?",
        a: "Beide sind Eurycoma longifolia. Black Tongkat Ali wird aus dunkler Wurzel hergestellt und mit 1–2 Kapseln am Tag dosiert. Unser gelber Elite enthält 450 mg pro Kapsel, und du nimmst 1 Kapsel am Tag.",
      },
      {
        q: "Was bedeutet 200:1?",
        a: "Dass 200 Teile getrocknete Wurzel zu 1 Teil Extrakt konzentriert wurden. Es ist ein Maß für die Konzentration.",
      },
      {
        q: "Wie viele Kapseln soll ich nehmen?",
        a: "1–2 Kapseln täglich. Eine Dose mit 60 Kapseln reicht 30 Tage bei 2 Kapseln am Tag oder 60 Tage bei 1.",
      },
      {
        q: "Enthält sie Füllstoffe, und ist sie vegan?",
        a: "Keine Füllstoffe. Die Kapsel enthält Wurzelextrakt und eine pflanzliche Kapselhülle aus HPMC und ist damit vegan.",
      },
    ],
  },

  ashwagandha: {
    eyebrow: "Withania somnifera · 10 % Withanolide",
    headline: "Ashwagandha, 400 mg pro Kapsel",
    intro:
      "Ein standardisierter Wurzelextrakt aus Withania somnifera mit 10 % Withanoliden – 400 mg pro Kapsel. 60 Kapseln in einer veganen Kapselhülle, ohne Zusatzstoffe.",
    highlights: [
      { label: "Standardisierung", value: "10 % Withanolide" },
      { label: "Pro Kapsel", value: "400 mg" },
      { label: "Kapseln", value: "60 Stück" },
    ],
    story: [
      {
        heading: "Die Wurzel, nicht die ganze Pflanze",
        body:
          "Ashwagandha wird auch Indischer Ginseng genannt und hat eine lange Tradition in der ayurvedischen Kräuterkultur. Unser Extrakt stammt ausschließlich aus der Wurzel. Günstigere Varianten werden oft aus der ganzen Pflanze gemahlen, Blätter und Stängel inklusive, was einen ganz anderen Inhalt ergibt.",
      },
      {
        heading: "Standardisiert auf 10 %",
        body:
          "Withanolide sind die Stoffe, die in einem Ashwagandha-Extrakt gemessen werden. Unserer ist auf 10 % standardisiert. 400 mg Extrakt entsprechen 40 mg Withanoliden in jeder Kapsel.",
      },
      {
        heading: "Reine Zusammensetzung",
        body:
          "Nur der Extrakt und eine pflanzliche Kapselhülle. Keine Bindemittel, Füllstoffe oder Trennmittel und nichts, was zugesetzt wird, um den Inhalt zu strecken.",
      },
    ],
    specs: [
      { label: "Lateinischer Name", value: "Withania somnifera" },
      { label: "Pflanzenteil", value: "Wurzel" },
      { label: "Standardisierung", value: "10 % Withanolide" },
      { label: "Pro Kapsel", value: "400 mg Extrakt, davon 40 mg Withanolide" },
      { label: "Tagesdosis", value: "2–3 Kapseln täglich" },
      { label: "Verpackung", value: "60 Kapseln" },
      { label: "Kapsel", value: "Vegan (HPMC)" },
    ],
    ingredients:
      "Ashwagandha-Extrakt (Withania somnifera, Wurzel), standardisiert auf 10 % Withanolide, Kapselhülle (pflanzlich, HPMC). Inhalt pro Kapsel: Ashwagandha-Extrakt 400 mg, davon Withanolide 40 mg.",
    usage: ["2–3 Kapseln täglich mit einem Glas Wasser.", noExceed, storeCool, keepAway],
    faq: [
      {
        q: "Was bedeutet 10 % Withanolide?",
        a: "Dass der Extrakt so standardisiert ist, dass er zu 10 % aus Withanoliden besteht. In 400 mg Extrakt entspricht das 40 mg.",
      },
      {
        q: "Welcher Teil der Pflanze wird verwendet?",
        a: "Nur die Wurzel. Blätter und Stängel werden nicht verwendet.",
      },
      {
        q: "Ist die Kapsel vegan?",
        a: "Ja. Die Kapselhülle ist pflanzlich (HPMC).",
      },
      {
        q: "Wie viele Kapseln enthält die Dose?",
        a: "60 Kapseln.",
      },
    ],
  },

  maca: {
    eyebrow: "Lepidium meyenii · 20:1 Wurzelextrakt",
    headline: "Macawurzel, 470 mg pro Kapsel",
    intro:
      "Maca ist ein konzentrierter 20:1-Extrakt aus der Wurzel von Lepidium meyenii – einer Knollenpflanze mit langer Tradition in den Anden. 60 Kapseln, vegane Kapselhülle ohne Zusatzstoffe.",
    highlights: [
      { label: "Extrakt", value: "20:1" },
      { label: "Pro Kapsel", value: "470 mg" },
      { label: "Kapseln", value: "60 Stück" },
    ],
    story: [
      {
        heading: "Die Wurzel",
        body:
          "Maca (Lepidium meyenii) wird in großer Höhe in den Anden angebaut und wird seit Generationen in der peruanischen Kräutertradition verwendet. Die Wurzel wird getrocknet, gemahlen und zu einem standardisierten 20:1-Extrakt konzentriert – aus 20 Teilen getrockneter Wurzel wird 1 Teil Extrakt.",
      },
      {
        heading: "Reine Zusammensetzung",
        body: `Nur Macawurzelextrakt in einer pflanzlichen Kapselhülle. ${cleanNoSweeteners}`,
      },
      packaging,
    ],
    specs: [
      { label: "Lateinischer Name", value: "Lepidium meyenii" },
      { label: "Verwendeter Pflanzenteil", value: "Wurzel" },
      { label: "Extraktstärke", value: "20:1" },
      { label: "Pro Kapsel", value: "470 mg Wurzelextrakt" },
      { label: "Tagesdosis", value: "2 Kapseln täglich" },
      { label: "Inhalt", value: "60 Kapseln – 30 Tage" },
      { label: "Kapsel", value: "Vegan (HPMC)" },
    ],
    ingredients:
      "Maca-Extrakt (Lepidium meyenii, Wurzel) 20:1, Kapselhülle (HPMC). Inhalt pro Kapsel: Macawurzelextrakt (20:1) 470 mg.",
    usage: ["2 Kapseln täglich mit einem Glas Wasser.", noExceed, storeCool, keepAway],
    faq: [
      {
        q: "Was bedeutet 20:1?",
        a: "Dass 20 Teile getrocknete Macawurzel zu 1 Teil Extrakt konzentriert wurden. Es ist ein Maß für die Konzentration, nichts anderes.",
      },
      {
        q: "Wie lange reicht eine Dose?",
        a: "60 Kapseln und 2 Kapseln täglich ergeben 30 Tage.",
      },
      veganFaq,
      {
        q: "Enthält sie Füllstoffe?",
        a: "Nein. Nur Wurzelextrakt und die Kapselhülle – ohne Bindemittel, Süßungsmittel oder künstliche Konservierungsstoffe.",
      },
    ],
  },

  mariatistel: {
    eyebrow: "Silybum marianum · 20:1, 80 % Silymarin",
    headline: "Mariendistel, 350 mg pro Kapsel",
    intro:
      "Mariendistel ist ein 20:1-Extrakt aus Silybum marianum, standardisiert auf 80 % Silymarin – 350 mg pro Kapsel. 60 Kapseln in einer veganen Kapselhülle ohne Zusatzstoffe.",
    highlights: [
      { label: "Extrakt", value: "20:1 · 80 %" },
      { label: "Pro Kapsel", value: "350 mg" },
      { label: "Kapseln", value: "60 Stück" },
    ],
    story: [
      {
        heading: "Die Pflanze",
        body:
          "Die Mariendistel (Silybum marianum) ist eine Distelpflanze aus dem Mittelmeerraum mit langer Tradition in der europäischen Kräuterverwendung. Die Samen werden getrocknet und zu einem Konzentrat extrahiert, das auf 80 % Silymarin standardisiert ist – einen Flavonoidkomplex, der unter anderem Isosilybin (ca. 2,5 %), Silychristin (ca. 10 %) und Silydianin (ca. 7,5 %) enthält.",
      },
      {
        heading: "Reine Zusammensetzung",
        body:
          "Nur Mariendistelextrakt in einer pflanzlichen Kapselhülle aus Pullulan. Vegan, glutenfrei und gentechnikfrei – frei von Laktose, Soja, Hefe, Weizen und Milch und ohne Farbstoffe, Bindemittel, Füllstoffe oder künstliche Konservierungsstoffe.",
      },
      packaging,
    ],
    specs: [
      { label: "Lateinischer Name", value: "Silybum marianum" },
      { label: "Verwendeter Pflanzenteil", value: "Samen" },
      { label: "Extraktstärke", value: "20:1" },
      { label: "Standardisierung", value: "80 % Silymarin" },
      { label: "Pro Kapsel", value: "350 mg Extrakt" },
      { label: "Tagesdosis", value: "1 Kapsel täglich" },
      { label: "Inhalt", value: "60 Kapseln – 60 Tage" },
      { label: "Kapsel", value: "Vegan (Pullulan)" },
    ],
    ingredients:
      "Mariendistelextrakt (Silybum marianum, Samen) 20:1, standardisiert auf 80 % Silymarin, Kapselhülle (Pullulan). Inhalt pro Kapsel: Mariendistelextrakt 350 mg, davon Silymarin 280 mg.",
    usage: [oneDaily, noExceed, storeCool, keepAway],
    faq: [
      {
        q: "Was bedeutet 80 % Silymarin?",
        a: "Dass der Extrakt so standardisiert ist, dass er zu 80 % aus dem Flavonoidkomplex Silymarin besteht. In 350 mg Extrakt entspricht das 280 mg Silymarin.",
      },
      {
        q: "Welcher Pflanzenteil wird verwendet?",
        a: "Die Samen der Mariendistel, die getrocknet und zu einem 20:1-Konzentrat extrahiert werden.",
      },
      {
        q: "Ist die Kapsel vegan?",
        a: "Ja. Die Kapselhülle besteht aus pflanzlichem Pullulan, und das Produkt ist glutenfrei und gentechnikfrei.",
      },
      lasts60,
    ],
  },

  nasselblad: {
    eyebrow: "Urtica dioica · 10:1 Blattextrakt",
    headline: "Brennnesselblatt, 430 mg pro Kapsel",
    intro:
      "Brennnesselblatt ist ein 10:1-Extrakt aus den Blättern von Urtica dioica – 430 mg pro Kapsel. 60 Kapseln in einer veganen Kapselhülle ohne Zusatzstoffe.",
    highlights: [
      { label: "Extrakt", value: "10:1" },
      { label: "Pro Kapsel", value: "430 mg" },
      { label: "Kapseln", value: "60 Stück" },
    ],
    story: [
      {
        heading: "Das Blatt",
        body:
          "Die Große Brennnessel (Urtica dioica) wird seit Jahrhunderten in der europäischen Kräutertradition verwendet. Wir verwenden die Blätter, die getrocknet und zu einem 10:1-Extrakt konzentriert werden – aus 10 Teilen getrocknetem Blatt wird 1 Teil Extrakt.",
      },
      {
        heading: "Reine Zusammensetzung",
        body: `Nur Brennnesselblattextrakt in einer pflanzlichen Kapselhülle. ${cleanNoSweeteners}`,
      },
      packaging,
    ],
    specs: [
      { label: "Lateinischer Name", value: "Urtica dioica" },
      { label: "Verwendeter Pflanzenteil", value: "Blatt" },
      { label: "Extraktstärke", value: "10:1" },
      { label: "Pro Kapsel", value: "430 mg Extrakt" },
      { label: "Tagesdosis", value: "1 Kapsel täglich" },
      { label: "Inhalt", value: "60 Kapseln – 60 Tage" },
      { label: "Kapsel", value: "Vegan" },
    ],
    ingredients:
      "Brennnesselblattextrakt (Urtica dioica, Blatt) 10:1, Kapselhülle (pflanzlich). Inhalt pro Kapsel: Brennnesselblattextrakt 430 mg.",
    usage: [oneDaily, noExceed, storeCool, keepAway],
    faq: [
      {
        q: "Was bedeutet 10:1?",
        a: "Dass 10 Teile getrocknetes Brennnesselblatt zu 1 Teil Extrakt konzentriert wurden. Es ist ein Maß für die Konzentration, nichts anderes.",
      },
      {
        q: "Welcher Pflanzenteil wird verwendet?",
        a: "Die Blätter der Großen Brennnessel, die getrocknet und zu einem 10:1-Konzentrat extrahiert werden.",
      },
      veganFaq,
      lasts60,
    ],
  },

  druvkarneextrakt: {
    eyebrow: "Vitis vinifera · 95 % OPC",
    headline: "Traubenkernextrakt, 500 mg pro Kapsel",
    intro:
      "Traubenkernextrakt ist ein Extrakt aus den Kernen von Vitis vinifera, standardisiert auf 95 % Proanthocyanidine (OPC) – 500 mg pro Kapsel. 60 Kapseln in einer veganen Kapselhülle ohne Zusatzstoffe.",
    highlights: [
      { label: "Standardisierung", value: "95 % OPC" },
      { label: "Pro Kapsel", value: "500 mg" },
      { label: "Kapseln", value: "60 Stück" },
    ],
    story: [
      {
        heading: "Der Kern",
        body:
          "Die Weinrebe (Vitis vinifera) wird in Europa seit Menschengedenken angebaut. Wir verwenden die Kerne, eine natürliche Quelle von Polyphenolen, und extrahieren sie zu einem Konzentrat, das auf 95 % Proanthocyanidine standardisiert ist – auch OPC genannt.",
      },
      {
        heading: "Reine Zusammensetzung",
        body: `Nur Traubenkernextrakt in einer pflanzlichen Kapselhülle. ${cleanNoSweeteners}`,
      },
      packaging,
    ],
    specs: [
      { label: "Lateinischer Name", value: "Vitis vinifera" },
      { label: "Verwendeter Pflanzenteil", value: "Kern" },
      { label: "Standardisierung", value: "95 % Proanthocyanidine (OPC)" },
      { label: "Pro Kapsel", value: "500 mg Extrakt" },
      { label: "Tagesdosis", value: "1–2 Kapseln täglich" },
      { label: "Inhalt", value: "60 Kapseln – 30–60 Tage" },
      { label: "Kapsel", value: "Vegan" },
    ],
    ingredients:
      "Traubenkernextrakt (Vitis vinifera, Kern), standardisiert auf 95 % Proanthocyanidine, Kapselhülle (pflanzlich). Inhalt pro Kapsel: Traubenkernextrakt 500 mg, davon Proanthocyanidine 475 mg.",
    usage: ["1–2 Kapseln täglich mit einem Glas Wasser.", noExceed, storeCool, keepAway],
    faq: [
      {
        q: "Was bedeutet 95 % OPC?",
        a: "Dass der Extrakt so standardisiert ist, dass er zu 95 % aus Proanthocyanidinen besteht. In 500 mg Extrakt entspricht das 475 mg.",
      },
      {
        q: "Welcher Pflanzenteil wird verwendet?",
        a: "Die Kerne der Weintraube, die extrahiert und auf Polyphenole standardisiert werden.",
      },
      veganFaq,
      {
        q: "Wie lange reicht eine Dose?",
        a: "60 Kapseln reichen 30 Tage bei 2 Kapseln täglich und 60 Tage bei 1 Kapsel täglich.",
      },
    ],
  },

  quercetin: {
    eyebrow: "Quercetin · 98 % Reinheit",
    headline: "Quercetin, 500 mg pro Kapsel",
    intro:
      "Quercetin ist ein Flavonoid, das natürlich in Obst und Gemüse vorkommt. Unser Extrakt hat eine Reinheit von 98 % – 500 mg pro Kapsel. 60 Kapseln in einer veganen Kapselhülle ohne Zusatzstoffe.",
    highlights: [
      { label: "Reinheit", value: "98 %" },
      { label: "Pro Kapsel", value: "500 mg" },
      { label: "Kapseln", value: "60 Stück" },
    ],
    story: [
      {
        heading: "Der Stoff",
        body:
          "Quercetin ist ein pflanzliches Flavonoid, das unter anderem in Zwiebeln, Äpfeln und Beeren vorkommt. Wir wählen einen Extrakt mit hoher Reinheit – 98 % –, damit jede Kapsel denselben Inhalt hat, Charge für Charge.",
      },
      {
        heading: "Reine Zusammensetzung",
        body: `Nur Quercetin-Extrakt in einer pflanzlichen Kapselhülle. ${cleanNoSweeteners}`,
      },
      packaging,
    ],
    specs: [
      { label: "Inhalt", value: "Quercetin-Extrakt" },
      { label: "Reinheit", value: "98 % Quercetin" },
      { label: "Pro Kapsel", value: "500 mg" },
      { label: "Tagesdosis", value: "1 Kapsel täglich" },
      { label: "Verpackung", value: "60 Kapseln – 60 Tage" },
      { label: "Kapsel", value: "Vegan" },
    ],
    ingredients:
      "Quercetin-Extrakt (98 % Quercetin), Kapselhülle (pflanzlich). Inhalt pro Kapsel: Quercetin-Extrakt 500 mg, davon Quercetin 490 mg.",
    usage: [oneDaily, noExceed, storeCool, keepAway],
    faq: [
      {
        q: "Was bedeutet 98 % Reinheit?",
        a: "Dass der Extrakt zu 98 % aus Quercetin besteht. In 500 mg Extrakt entspricht das 490 mg Quercetin.",
      },
      {
        q: "Woher kommt Quercetin?",
        a: "Quercetin ist ein Flavonoid, das natürlich in Obst, Gemüse und Kräutern vorkommt.",
      },
      veganFaq,
      lasts60,
    ],
  },

  reishi: {
    eyebrow: "Ganoderma lucidum · 40 % Polysaccharide",
    headline: "Reishi, 350 mg pro Kapsel",
    intro:
      "Reishi (Ganoderma lucidum) als standardisierter Pilzextrakt mit 40 % Polysacchariden – 350 mg pro Kapsel. 60 Kapseln in einer veganen Kapselhülle ohne Zusatzstoffe.",
    highlights: [
      { label: "Standardisierung", value: "40 % Polysaccharide" },
      { label: "Pro Kapsel", value: "350 mg" },
      { label: "Kapseln", value: "60 Stück" },
    ],
    story: [
      {
        heading: "Der Pilz",
        body:
          "Reishi, Ganoderma lucidum, wird seit Jahrhunderten in der traditionellen Kräuterkultur verwendet. Unser Extrakt ist konzentriert und auf 40 % Polysaccharide standardisiert, sodass der Inhalt in jeder Kapsel gleich ist.",
      },
      {
        heading: "Reine Zusammensetzung",
        body: `Nur Reishi-Extrakt in einer pflanzlichen Kapselhülle. ${cleanNoSweeteners}`,
      },
      packaging,
    ],
    specs: [
      { label: "Lateinischer Name", value: "Ganoderma lucidum" },
      { label: "Standardisierung", value: "40 % Polysaccharide" },
      { label: "Pro Kapsel", value: "350 mg" },
      { label: "Tagesdosis", value: "1 Kapsel täglich" },
      { label: "Verpackung", value: "60 Kapseln – 60 Tage" },
      { label: "Kapsel", value: "Vegan" },
    ],
    ingredients:
      "Reishi-Extrakt (Ganoderma lucidum), standardisiert auf 40 % Polysaccharide, Kapselhülle (pflanzlich). Inhalt pro Kapsel: Reishi-Extrakt 350 mg, davon Polysaccharide 140 mg.",
    usage: [oneDaily, noExceed, storeCool, keepAway],
    faq: [
      {
        q: "Was bedeutet 40 % Polysaccharide?",
        a: "Dass der Extrakt so standardisiert ist, dass er zu 40 % aus Polysacchariden besteht. In 350 mg Extrakt entspricht das 140 mg.",
      },
      {
        q: "Welcher Pilz wird verwendet?",
        a: "Ganoderma lucidum, allgemein bekannt als Reishi.",
      },
      veganFaq,
      lasts60,
    ],
  },

  chaga: {
    eyebrow: "Inonotus obliquus · 30:1 Extrakt",
    headline: "Chaga, 400 mg pro Kapsel",
    intro:
      "Chaga (Inonotus obliquus) als 30:1-Extrakt, standardisiert auf 10 % Polysaccharide – 400 mg pro Kapsel. 60 Kapseln in einer veganen Kapselhülle ohne Zusatzstoffe.",
    highlights: [
      { label: "Extrakt", value: "30:1" },
      { label: "Pro Kapsel", value: "400 mg" },
      { label: "Kapseln", value: "60 Stück" },
    ],
    story: [
      {
        heading: "Der Pilz",
        body:
          "Chaga wächst langsam an Birken und nimmt über viele Jahre Nährstoffe aus dem Baum auf. Unser Extrakt stammt aus wild gesammeltem Chaga von hoher Qualität, 30:1 konzentriert und auf 10 % Polysaccharide standardisiert.",
      },
      {
        heading: "Reine Zusammensetzung",
        body: `Nur Chaga-Extrakt in einer pflanzlichen Kapselhülle. ${cleanNoSweeteners}`,
      },
      packaging,
    ],
    specs: [
      { label: "Lateinischer Name", value: "Inonotus obliquus" },
      { label: "Extrakt", value: "30:1" },
      { label: "Standardisierung", value: "10 % Polysaccharide" },
      { label: "Pro Kapsel", value: "400 mg" },
      { label: "Tagesdosis", value: "1 Kapsel täglich" },
      { label: "Verpackung", value: "60 Kapseln – 60 Tage" },
      { label: "Kapsel", value: "Vegan" },
    ],
    ingredients:
      "Chaga-Extrakt (Inonotus obliquus) 30:1, standardisiert auf 10 % Polysaccharide, Kapselhülle (pflanzlich). Inhalt pro Kapsel: Chaga-Extrakt 400 mg, davon Polysaccharide 40 mg.",
    usage: [oneDaily, noExceed, storeCool, keepAway],
    faq: [
      {
        q: "Was bedeutet 30:1?",
        a: "Dass 30 Teile Rohstoff zu 1 Teil Extrakt konzentriert wurden. 400 mg Extrakt entsprechen etwa 12 g getrocknetem Chaga.",
      },
      {
        q: "Was bedeuten 10 % Polysaccharide?",
        a: "Dass der Extrakt so standardisiert ist, dass er zu 10 % aus Polysacchariden besteht – 40 mg pro Kapsel.",
      },
      veganFaq,
      lasts60,
    ],
  },

  "lions-mane": {
    eyebrow: "Hericium erinaceus · 60 % Polysaccharide",
    headline: "Lion's Mane, 500 mg pro Kapsel",
    intro:
      "Lion's Mane (Hericium erinaceus) als standardisierter Pilzextrakt mit 60 % Polysacchariden, davon 45 % Beta-Glucane – 500 mg pro Kapsel. 60 Kapseln in einer veganen Kapselhülle ohne Zusatzstoffe.",
    highlights: [
      { label: "Standardisierung", value: "60 % Polysaccharide" },
      { label: "Pro Kapsel", value: "500 mg" },
      { label: "Kapseln", value: "60 Stück" },
    ],
    story: [
      {
        heading: "Der Pilz",
        body:
          "Lion's Mane, Hericium erinaceus, hat eine lange Geschichte in der traditionellen Kräuterkultur Ostasiens. Unser Extrakt ist konzentriert und auf 60 % Polysaccharide standardisiert, davon 45 % Beta-Glucane, sodass der Inhalt in jeder Kapsel gleich ist.",
      },
      {
        heading: "Reine Zusammensetzung",
        body: `Nur Lion's-Mane-Extrakt in einer pflanzlichen Kapselhülle. ${cleanNoSweeteners}`,
      },
      packaging,
    ],
    specs: [
      { label: "Lateinischer Name", value: "Hericium erinaceus" },
      { label: "Standardisierung", value: "60 % Polysaccharide" },
      { label: "Davon Beta-Glucane", value: "45 %" },
      { label: "Pro Kapsel", value: "500 mg" },
      { label: "Tagesdosis", value: "1 Kapsel täglich" },
      { label: "Verpackung", value: "60 Kapseln – 60 Tage" },
      { label: "Kapsel", value: "Vegan" },
    ],
    ingredients:
      "Lion's-Mane-Extrakt (Hericium erinaceus), standardisiert auf 60 % Polysaccharide, davon 45 % Beta-Glucane, Kapselhülle (pflanzlich). Inhalt pro Kapsel: Extrakt 500 mg, davon Polysaccharide 300 mg und Beta-Glucane 225 mg.",
    usage: [oneDaily, noExceed, storeCool, keepAway],
    faq: [
      {
        q: "Was bedeutet 60 % Polysaccharide?",
        a: "Dass der Extrakt so standardisiert ist, dass er zu 60 % aus Polysacchariden besteht. In 500 mg Extrakt entspricht das 300 mg.",
      },
      {
        q: "Was sind Beta-Glucane?",
        a: "Eine bestimmte Gruppe von Polysacchariden. In unserem Extrakt machen sie 45 % aus, also 225 mg pro Kapsel.",
      },
      veganFaq,
      lasts60,
    ],
  },

  cordyceps: {
    eyebrow: "Cordyceps militaris · 8:1 Extrakt",
    headline: "Cordyceps, 350 mg pro Kapsel",
    intro:
      "Cordyceps (Cordyceps militaris) als 8:1-Extrakt, standardisiert auf 40 % Polysaccharide – 350 mg pro Kapsel. 60 Kapseln in einer veganen Kapselhülle ohne Zusatzstoffe.",
    highlights: [
      { label: "Extrakt", value: "8:1" },
      { label: "Pro Kapsel", value: "350 mg" },
      { label: "Kapseln", value: "60 Stück" },
    ],
    story: [
      {
        heading: "Der Pilz",
        body:
          "Cordyceps hat seit Langem einen Platz in der ostasiatischen Kräuterkultur. Unser Extrakt stammt aus sorgfältig ausgewähltem Cordyceps militaris, 8:1 konzentriert und auf 40 % Polysaccharide standardisiert, sodass der Inhalt in jeder Kapsel gleich ist.",
      },
      {
        heading: "Reine Zusammensetzung",
        body: `Nur Cordyceps-Extrakt in einer pflanzlichen Kapselhülle. ${cleanNoSweeteners}`,
      },
      packaging,
    ],
    specs: [
      { label: "Lateinischer Name", value: "Cordyceps militaris" },
      { label: "Extrakt", value: "8:1" },
      { label: "Standardisierung", value: "40 % Polysaccharide" },
      { label: "Pro Kapsel", value: "350 mg" },
      { label: "Tagesdosis", value: "1 Kapsel täglich" },
      { label: "Verpackung", value: "60 Kapseln – 60 Tage" },
      { label: "Kapsel", value: "Vegan" },
    ],
    ingredients:
      "Cordyceps-Extrakt (Cordyceps militaris) 8:1, standardisiert auf 40 % Polysaccharide, Kapselhülle (pflanzlich). Inhalt pro Kapsel: Cordyceps-Extrakt 350 mg, davon Polysaccharide 140 mg.",
    usage: [oneDaily, noExceed, storeCool, keepAway],
    faq: [
      {
        q: "Was bedeutet 8:1?",
        a: "Dass 8 Teile Rohstoff zu 1 Teil Extrakt konzentriert wurden. 350 mg Extrakt entsprechen etwa 2,8 g getrocknetem Cordyceps.",
      },
      {
        q: "Was bedeuten 40 % Polysaccharide?",
        a: "Dass der Extrakt so standardisiert ist, dass er zu 40 % aus Polysacchariden besteht – 140 mg pro Kapsel.",
      },
      veganFaq,
      lasts60,
    ],
  },

  "pine-pollen": {
    eyebrow: "Kiefernpollen · 99 % reiner Extrakt",
    headline: "Pine Pollen, 300 mg pro Kapsel",
    intro:
      "Pollen der Kiefer als 99 % reiner Extrakt mit aufgebrochenen Zellwänden – 300 mg pro Kapsel. 60 Kapseln in einer veganen Kapselhülle, ohne Zusatzstoffe.",
    highlights: [
      { label: "Reinheit", value: "99 %" },
      { label: "Pro Kapsel", value: "300 mg" },
      { label: "Kapseln", value: "60 Stück" },
    ],
    story: [
      {
        heading: "Der gelbe Staub des Frühlings",
        body:
          "Einige Wochen im Frühling gibt die Kiefer ihre Pollen frei: einen feinen gelben Staub, der sich über Boden und Wasser legt. Geerntet wird in dieser kurzen Zeit, in der die Pollen da sind – deshalb ist der Rohstoff an die Jahreszeit gebunden.",
      },
      {
        heading: "Aufgebrochene Zellwände",
        body:
          "Ein Pollenkorn hat eine harte äußere Schale. In unserem Extrakt sind die Zellwände aufgebrochen; das ist der Schritt, der den Inhalt des Korns zugänglich macht, statt dass es unversehrt hindurchgeht.",
      },
      {
        heading: "Reine Zusammensetzung",
        body:
          "99 % reiner Pollenextrakt und eine pflanzliche Kapselhülle. Keine Bindemittel, Füllstoffe oder Trennmittel.",
      },
    ],
    specs: [
      { label: "Rohstoff", value: "Pollen der Kiefer" },
      { label: "Reinheit", value: "99 %" },
      { label: "Verarbeitung", value: "Aufgebrochene Zellwände" },
      { label: "Pro Kapsel", value: "300 mg" },
      { label: "Tagesdosis", value: "1–3 Kapseln täglich" },
      { label: "Verpackung", value: "60 Kapseln" },
      { label: "Kapsel", value: "Vegan (HPMC)" },
    ],
    ingredients:
      "Kiefernpollenextrakt (99 % rein, aufgebrochene Zellwände), Kapselhülle (pflanzlich, HPMC). Inhalt pro Kapsel: Pollenextrakt 300 mg.",
    usage: ["1–3 Kapseln täglich mit einem Glas Wasser.", noExceed, storeCool, keepAway],
    faq: [
      {
        q: "Was bedeutet aufgebrochene Zellwände?",
        a: "Die äußere Schale des Pollenkorns wurde bei der Verarbeitung geöffnet, sodass der Inhalt zugänglich wird, statt unversehrt hindurchzugehen.",
      },
      {
        q: "Wann werden die Pollen geerntet?",
        a: "In der kurzen Zeit im Frühling, in der die Kiefer ihre Pollen freigibt.",
      },
      {
        q: "Ist die Kapsel vegan?",
        a: "Ja. Die Kapselhülle ist pflanzlich (HPMC).",
      },
      {
        q: "Wie viele Kapseln enthält die Dose?",
        a: "60 Kapseln.",
      },
    ],
  },
};
