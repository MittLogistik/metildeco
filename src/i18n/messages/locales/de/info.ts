import type { InfoMessages } from "../../info";

export const messages: InfoMessages = {
  shippingTable: {
    destination: "Ziel",
    method: "Versandart",
    time: "Lieferzeit",
    cost: "Kosten",
    days: (from, to) => `${from}–${to} Werktage`,
    freeOver: (price, freeOver) => `${price} – kostenloser Versand ab ${freeOver}`,
  },
  company: {
    legalEntity: "Rechtsträger",
    orgNumber: "Organisationsnummer",
    vatId: "USt-IdNr.",
    address: "Adresse",
    email: "E-Mail",
    phone: "Telefon",
    hours: "Mo–Fr 9:00–17:00 Uhr (CET)",
    sweden: "Schweden",
  },
  faq: {
    metaTitle: "Häufige Fragen",
    metaDescription: "Antworten auf die häufigsten Fragen zu Bestellung, Bezahlung, Versand, Rücksendung, Abo und unseren Produkten.",
    title: "Häufige Fragen",
    eyebrow: "Kundenservice",
    intro: "Hier findest du Antworten auf die häufigsten Fragen zu Bestellungen, Lieferung, Abos und unseren Produkten.",
    categories: "Kategorien",
    moreTitle: "Keine Antwort gefunden?",
    moreBefore: "Unser Kundenservice ist werktags von 9 bis 17 Uhr (CET) erreichbar und antwortet in der Regel innerhalb eines Werktags. Schreib an",
    moreOr: "oder ruf an unter",
    languages: "Unser Kundenservice antwortet auf Schwedisch und Englisch.",
    contact: "Kontakt aufnehmen",
    trackOrder: "Bestellung verfolgen",
  },
  contact: {
    metaTitle: "Kontakt",
    metaDescription: "Du hast eine Frage zu deiner Bestellung, einem Produkt oder deinem Abo? Der Kundenservice von Metilde antwortet innerhalb von 1–2 Werktagen.",
    title: "Kontakt",
    eyebrow: "Kundenservice",
    intro: "Wir antworten in der Regel innerhalb von 1–2 Werktagen. Geht es um eine laufende Bestellung, gib am besten deine Bestellnummer an – dann geht es am schnellsten.",
    languages: "Unser Kundenservice antwortet auf Schwedisch und Englisch.",
    formTitle: "Nachricht senden",
    otherWays: "Weitere Kontaktmöglichkeiten",
    email: "E-Mail",
    phone: "Telefon",
    swedishTime: "CET",
    companyInfo: "Unternehmensangaben",
    trackTitle: "Du willst nur wissen, wo dein Paket ist?",
    trackText: "Verfolge deine Lieferung direkt mit Bestellnummer und E-Mail-Adresse.",
    trackLink: "Bestellung verfolgen",
    faqTitle: "Schnelle Antworten",
    faqText: "Viele Fragen zu Versand, Rücksendung und Abo werden bereits in unseren häufigen Fragen beantwortet.",
    faqLink: "Zu den häufigen Fragen",
  },
  story: {
    metaTitle: "Unsere Geschichte – so hat Metilde angefangen",
    metaDescription:
      "Metilde begann mit einer einfachen Frustration: zu wenige reine Nahrungsergänzungsmittel ohne Umstände. Lies, wie die Marke gegründet wurde und warum ein Abo selbstverständlich war.",
    title: "Unsere Geschichte",
    eyebrow: "Über Metilde",
    intro:
      "Metilde entstand aus einer Frustration, die viele kennen: Warum ist es so schwer, reine Nahrungsergänzungsmittel ohne Umstände zu finden? Diese Frage brachte Matilda dazu, alles andere beiseitezulegen und die Marke von Grund auf aufzubauen.",
    sections: [
      {
        title: "Im Regal fehlte etwas",
        body: [
          "Matilda nahm schon lange Nahrungsergänzungsmittel, doch je mehr sie sich einlas, desto frustrierter wurde sie. Viele Produkte steckten voller Füllstoffe, Süßungsmittel und Zutaten, die nichts beitrugen. Gleichzeitig waren die Preise oft hoch – für Produkte, die nicht einmal enthielten, was sie versprachen.",
          "Es gab reichlich Marken, die über Gesundheit und Wohlbefinden sprachen, aber nur wenige, die erklärten, warum ein Produkt seinen Preis tatsächlich wert war. Da begann die Idee von Metilde zu wachsen: eine Marke, die auf Reinheit und Transparenz setzt, bei der man bekommt, wofür man bezahlt, und nichts anderes.",
        ],
      },
      {
        title: "Ein Abo, das besser funktionieren sollte",
        body: [
          "Was außerdem störte: Es gab kaum eine Möglichkeit, Nahrungsergänzungsmittel im Abo zu beziehen. Was es gab, waren entweder komplizierte Verträge mit Kündigungsfristen oder Lösungen, bei denen man selbst ans Nachbestellen denken musste.",
          "Deshalb hat Metilde ein Abo gebaut, das wirklich fair ist: 15 % günstiger, kostenloser Versand und jederzeit pausieren, ändern oder kündigen. Keine Mindestlaufzeit, keine versteckten Gebühren.",
        ],
      },
      {
        title: "Von Matilda zu Metilde",
        body: [
          "Als es Zeit war, einen Namen zu wählen, lag die erste Wahl auf der Hand. Alle Domains mit „Matilda“ waren schon vergeben, also wurde es etwas, das nah dran war – etwas einfacher, etwas klarer. Metilde.com war frei, und der Name fühlte sich sofort richtig an.",
        ],
      },
      {
        title: "Nächster Schritt: das Sortiment erweitern",
        body: [
          "Wir werden keine neuen Produkte aufnehmen, nur weil es gut aussieht. Jedes Extrakt soll einen Zweck erfüllen, echte Qualität haben und denselben Anforderungen genügen, die wir uns vom ersten Tag an gesetzt haben.",
        ],
      },
    ],
    valuesEyebrow: "Werte",
    valuesTitle: "Wofür wir stehen",
    values: [
      ["Keine Umstände", "Wir geben genau an, was jedes Produkt enthält. Kein Blabla, keine versteckten Zusätze."],
      ["Du bekommst, wofür du bezahlst", "Rohstoffe, Kapseln, Verpackung. Dafür geben wir unser Geld aus – nicht für teure Werbekampagnen."],
      ["Ein echtes Abo", "15 % Rabatt, kostenloser Versand und volle Kontrolle. Pausieren, ändern oder kündigen, wann du willst."],
      ["Schnelle Lieferung", "Bestellungen, die an Werktagen vor 12 Uhr eingehen, werden am selben Tag verschickt."],
    ],
    companyEyebrow: "Das Unternehmen",
    companyTitle: "Über das Unternehmen",
    companyIntro: (legalName) =>
      `Metilde wird von ${legalName} betrieben. Hier findest du unsere vollständigen Unternehmensangaben – du sollst immer wissen, bei wem du kaufst.`,
    legalName: "Firmenname",
    customerService: "Kundenservice",
    ctaTitle: "Wir stehen erst am Anfang",
    ctaText:
      "Metilde ist eine junge Marke, aber das Ziel ist klar: das Sortiment zu erweitern und ein großer Anbieter auf dem Markt für reine, botanische Nahrungsergänzungsmittel zu werden. Das schaffen wir, indem wir ehrlich sind, hohe Qualität liefern und unseren Kundinnen und Kunden zuhören.",
    ctaProducts: "Produkte entdecken",
    ctaSubscription: "Mehr über das Abo",
  },
};
