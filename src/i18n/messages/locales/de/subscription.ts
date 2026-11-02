import type { SubscriptionMessages } from "../../subscription";

export const messages: SubscriptionMessages = {
  title: (pct) => `Abo – spare ${pct} % bei jeder Lieferung`,
  description: (pct) =>
    `Bezieh deine Nahrungsergänzungsmittel im Abo und spare ${pct} % bei jeder Lieferung. Kostenloser Versand, Intervall frei wählbar und jederzeit kündbar.`,
  breadcrumb: "Abo",
  eyebrow: (pct) => `Spare ${pct} %`,
  h1: "Abo – deine Nahrungsergänzung automatisch nach Hause",
  lead: (pct) =>
    `Schluss mit leeren Dosen und vergessenen Bestellungen. Bezieh im Abo, was du jeden Tag verwendest, und spare ${pct} % bei jeder Lieferung – mit kostenlosem Versand und ohne Mindestlaufzeit.`,
  start: "Abo starten",
  how: "So funktioniert es",
  checks: ["Keine Mindestlaufzeit", "Kostenloser Versand", "Jederzeit kündbar"],
  stepsEyebrow: "Schritt für Schritt",
  stepsIntro: "Vier einfache Schritte – und du behältst die ganze Zeit die Kontrolle.",
  steps: [
    ["Produkt wählen", "Wähle die Extrakte, die du regelmäßig verwendest, und klicke auf der Produktseite auf Abo."],
    ["Intervall wählen", "Lieferung alle 30, 60 oder 90 Tage – passend dazu, wie schnell deine Dose leer ist."],
    ["Automatisch nach Hause", "Zu Beginn jeder neuen Periode wird die Zahlung abgebucht und du bekommst eine E-Mail mit dem voraussichtlichen Liefertag. Immer kostenloser Versand, unabhängig vom Bestellwert."],
    ["Pausieren oder kündigen", "Du möchtest dein Abo pausieren, fortsetzen oder kündigen oder ein anderes Intervall oder Produkt? Schreib unserem Kundenservice, wir kümmern uns darum – ganz ohne Mindestlaufzeit."],
  ],
  exampleEyebrow: "Rechenbeispiel",
  exampleTitle: "Was bringt es dir?",
  exampleIntro: (pct) =>
    `${pct} % Rabatt gelten für jede Lieferung, nicht nur für die erste. Mit kostenlosem Versand wird der Unterschied schon nach wenigen Monaten deutlich.`,
  exampleChecks: (pct, zero) => [`${pct} % niedrigerer Preis für jede Dose`, `${zero} Versandkosten`, "Kein Risiko, mitten in einer Kur ohne dazustehen"],
  example: (name) => `Beispiel · ${name}`,
  oneTime: "Einmalkauf",
  perDelivery: (price) => `${price} / Lieferung`,
  subscriptionLabel: "Abo",
  shipping: "Versand",
  yearly: "Deine Ersparnis pro Jahr (6 Lieferungen, alle 60 Tage)",
  exampleNote: "Ohne gesparte Versandkosten. Dein Preis hängt von den gewählten Produkten und dem Intervall ab.",
  benefitsEyebrow: "Vorteile",
  benefitsTitle: "Vorteile eines Abos",
  benefits: (pct) => [
    [`${pct} % Rabatt, jedes Mal`, "Der Rabatt gilt, solange das Abo aktiv ist – nicht nur für die erste Bestellung."],
    ["Immer kostenloser Versand", "Keine Versandkosten für Abo-Bestellungen, egal wie klein die Bestellung ist."],
    ["Keine Mindestlaufzeit", "Kündige, wann du willst. Keine Gebühren, keine Kündigungsfrist."],
    ["Pausieren bei Bedarf", "Du bist verreist oder hast noch eine Dose übrig? Bitte den Kundenservice, dein Abo zu pausieren. Es wird nichts abgebucht, bis du es fortsetzt."],
    ["Keine Überraschungen", "Wir ändern den Preis eines laufenden Abos nie, ohne dich vorher zu informieren, und du kannst immer kündigen, bevor die Änderung gilt."],
    ["Sicher bezahlen", "Bezahle sicher mit Karte, Klarna, Apple Pay oder Google Pay. Bei jeder Lieferung bekommst du einen Beleg per E-Mail."],
  ],
  popularEyebrow: "Beliebt im Abo",
  popularTitle: "Extrakte, die viele jeden Tag verwenden",
  faqTitle: "Häufige Fragen",
  faq: [
    { q: "Wie kündige ich mein Abo?", a: "Schreib unserem Kundenservice eine E-Mail, dann kündigen wir dein Abo für dich und bestätigen es schriftlich. Es wird nichts mehr abgebucht, und das Abo endet, wenn die bereits bezahlte Periode vorbei ist." },
    { q: "Kann ich das Lieferintervall oder meine Adresse ändern?", a: "Du ziehst um oder möchtest ein anderes Intervall, eine andere Menge oder ein anderes Produkt? Schreib unserem Kundenservice, dann regeln wir das vor der nächsten Lieferung." },
    { q: "Kann ich mehrere Produkte im selben Abo haben?", a: "Ja. Wenn du mehrere Produkte mit demselben Intervall im selben Kauf bestellst, gehören sie zum selben Abo und kommen im selben Paket." },
    { q: "Wann wird abgebucht?", a: "Die erste Lieferung bezahlst du beim Kauf. Danach wird die Zahlung automatisch abgebucht, wenn eine neue Periode beginnt – alle 30, 60 oder 90 Tage, gerechnet ab dem Kauf. Das Paket wird einige Tage nach der Abbuchung verschickt, und du bekommst eine E-Mail mit dem voraussichtlichen Liefertag." },
  ],
};
