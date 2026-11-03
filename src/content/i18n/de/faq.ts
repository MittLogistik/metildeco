/** Häufige Fragen (de). Svaren följer köpvillkor, fraktsida och retursida för Tyskland, Österrike och Luxemburg. */
import type { FaqGroup } from "@/content/faq";
import { company } from "@/lib/site";

export const faqGroups: FaqGroup[] = [
  {
    id: "bestallning",
    title: "Bestellung & Bezahlung",
    items: [
      {
        q: "Welche Zahlungsarten kann ich nutzen?",
        a: "Du kannst mit Klarna, Visa, Mastercard, American Express, Apple Pay und Google Pay bezahlen. Die Zahlung wird von Stripe abgewickelt – wir speichern deine Kartendaten nie.",
      },
      {
        q: "Kann ich meine Bestellung ändern oder stornieren?",
        a: `Schreib so schnell wie möglich an ${company.email} und gib deine Bestellnummer an. Ist die Bestellung noch nicht gepackt, ändern oder stornieren wir sie. Ist sie bereits verschickt, kannst du dein Widerrufsrecht nutzen, sobald das Paket angekommen ist.`,
      },
      {
        q: "Bekomme ich eine Quittung?",
        a: "Ja, die Bestellbestätigung mit Quittung wird an deine E-Mail-Adresse geschickt, sobald die Zahlung abgeschlossen ist.",
      },
      {
        q: "Kann ich als Unternehmen bestellen?",
        a: `Ja. Gib Firmennamen und USt-IdNr. bei der Adresse an, oder schreib an ${company.email}, wenn du eine Rechnung möchtest.`,
      },
    ],
  },
  {
    id: "frakt",
    title: "Versand & Lieferung",
    items: [
      {
        q: "Was kostet der Versand?",
        a: "Der Versand nach Deutschland, Österreich und Luxemburg kostet 8,00 €, und ab einem Bestellwert von 79 € ist der Versand kostenlos. Abos und Sets werden immer kostenlos verschickt. Die aktuellen Preise findest du auf der Seite Versand & Lieferung.",
      },
      {
        q: "Wie lange dauert die Lieferung?",
        a: "Bestellungen, die an Werktagen bis 12:00 Uhr (CET) eingehen, verschicken wir noch am selben Tag aus unserem Lager in der EU. Die Lieferzeit nach Deutschland, Österreich und Luxemburg beträgt normalerweise 3–6 Werktage.",
      },
      {
        q: "Liefert ihr nach Deutschland, Österreich und Luxemburg?",
        a: "Ja. Bestellungen nach Deutschland, Österreich und Luxemburg gehen mit PostNord als Brief mit Sendungsverfolgung aus unserem Lager in der EU. Da die Sendung innerhalb der EU bleibt, zahlst du keinen Zoll und keine Einfuhrabgaben.",
      },
      {
        q: "Wie verfolge ich mein Paket?",
        a: "Du bekommst einen Link zur Sendungsverfolgung per E-Mail, sobald das Paket das Lager verlässt. Du kannst auch Bestellnummer und E-Mail-Adresse unter Bestellung verfolgen eingeben.",
      },
    ],
  },
  {
    id: "retur",
    title: "Rücksendung & Reklamation",
    items: [
      {
        q: "Welches Widerrufsrecht gilt?",
        a: "30 Tage ab Erhalt der Bestellung – länger als die gesetzlichen 14 Tage. Das Produkt muss ungeöffnet sein, da wir geöffnete Nahrungsergänzungsmittel aus Hygiene- und Lebensmittelsicherheitsgründen nicht weiterverkaufen können.",
      },
      {
        q: "Wie sende ich etwas zurück?",
        a: `Schreib an ${company.email} mit deiner Bestellnummer und den betreffenden Artikeln. Du bekommst innerhalb eines Werktags ein Rücksendeetikett und eine Anleitung. Bei einem Widerruf trägst du die Rücksendekosten, und 8,00 € werden von der Erstattung abgezogen. Wir erstatten den Betrag innerhalb von 14 Tagen, nachdem wir die Rücksendung erhalten haben.`,
      },
      {
        q: "Was mache ich, wenn ein Produkt beschädigt ist?",
        a: "Melde den Schaden innerhalb von 7 Tagen mit Fotos von Paket und Produkt. Wir schicken dir einen Ersatz oder erstatten den Betrag, und wir übernehmen die Rücksendekosten.",
      },
    ],
  },
  {
    id: "prenumeration",
    title: "Abo",
    items: [
      {
        q: "Wie funktioniert das Abo?",
        a: "Wähle auf der Produktseite Abo, dann bekommst du 15 % Rabatt und kostenlosen Versand bei jeder Lieferung. Du wählst das Intervall (30, 60 oder 90 Tage) und kannst jederzeit pausieren oder kündigen.",
      },
      {
        q: "Wann wird abgebucht?",
        a: "Die erste Lieferung bezahlst du beim Kauf. Danach wird die Zahlung automatisch abgebucht, wenn eine neue Periode beginnt – alle 30, 60 oder 90 Tage, gerechnet ab dem Kauf. Das Paket wird einige Tage nach der Abbuchung verschickt, und du bekommst eine E-Mail mit dem voraussichtlichen Liefertag.",
      },
      {
        q: "Wie pausiere oder kündige ich mein Abo?",
        a: "Schreib dem Kundenservice, dann pausieren oder kündigen wir das Abo für dich und bestätigen es schriftlich. Eine Pause gilt sofort, und es wird nichts abgebucht, bis du das Abo fortsetzt. Kündigst du, wird nichts mehr abgebucht und das Abo endet mit Ablauf der bezahlten Periode. Keine Mindestlaufzeit und keine Gebühr.",
      },
      {
        q: "Kann ich Produkt oder Intervall wechseln?",
        a: "Ja. Schreib dem Kundenservice, dann ändern wir Intervall, Menge, Produkt oder Lieferadresse vor der nächsten Lieferung.",
      },
    ],
  },
  {
    id: "produkter",
    title: "Produkte & Qualität",
    items: [
      {
        q: "Woher kommen eure Produkte?",
        a: "Die Rohstoffe und Extrakte stammen aus den Ländern, in denen die Pflanzen heimisch sind, zum Beispiel Maca aus den Anden.",
      },
      {
        q: "Woran erkenne ich, welche Charge ich bekommen habe?",
        a: "Chargennummer und Mindesthaltbarkeitsdatum stehen auf der Dose. Gib die Chargennummer an, wenn du uns wegen eines Produkts kontaktierst, dann können wir es zurückverfolgen.",
      },
      {
        q: "Enthalten die Produkte unnötige Zusätze?",
        a: "Nein. Unsere Kapseln enthalten Extrakt und eine pflanzliche Kapselhülle – keine Bindemittel, Füllstoffe, Farbstoffe oder Süßungsmittel.",
      },
      {
        q: "Wie lagere ich die Produkte?",
        a: "Trocken und bei Raumtemperatur, mit nach jedem Gebrauch gut verschlossenem Deckel und außerhalb der Reichweite von kleinen Kindern.",
      },
    ],
  },
  {
    id: "konto",
    title: "Konto & Datenschutz",
    items: [
      {
        q: "Muss ich ein Konto anlegen, um zu bestellen?",
        a: "Nein, du kannst als Gast bestellen. Ein Konto brauchst du nur, um Abos zu verwalten und deine Bestellhistorie zu sehen.",
      },
      {
        q: "Wie geht ihr mit meinen personenbezogenen Daten um?",
        a: "Wir verwenden deine Daten, um deine Bestellung und dein Konto abzuwickeln. Hast du Marketing-Cookies zugestimmt, teilen wir außerdem bestimmte Informationen mit Meta und Google, um unsere Werbung zu messen. Wir verkaufen deine Daten nie. Mehr dazu in unserer Datenschutzerklärung.",
      },
    ],
  },
];
