/**
 * Juridiskt innehåll och informationssidor på tyska (de-DE), lokaliserat för Tyskland, Österrike och Luxemburg.
 * Samma nycklar och blockstruktur som src/content/legal.ts. `slug` är det interna id:t (svenskt).
 * Platshållare som {epost} och {företag} fylls i när sidan visas (lib/page-text).
 */
import type { LegalBlock, LegalDoc } from "@/content/legal";

const updated = "Zuletzt aktualisiert: 2. November 2026";

const contactBlock: LegalBlock[] = [
  { type: "h2", text: "Kontakt- und Unternehmensangaben" },
  { type: "companyInfo" },
];

const helpBlock: LegalBlock[] = [
  { type: "h2", text: "Brauchst du Hilfe?" },
  {
    type: "p",
    text: `Schreib an {epost} oder ruf uns an unter {telefon} ({öppettider}). Gib immer deine Bestellnummer an, dann können wir dir schneller helfen. Unser Kundenservice antwortet auf Schwedisch und Englisch.`,
  },
];

const disputeText =
  "Wenn wir uns nicht einigen können, findest du Informationen und Unterstützung bei grenzüberschreitenden Streitigkeiten beim Netz der Europäischen Verbraucherzentren (ECC-Net) in deinem Land, und du kannst dich an das zuständige Gericht in deinem Wohnsitzland wenden. Es gelten die zwingenden Verbraucherschutzvorschriften des Landes, in dem du wohnst.";

/* ------------------------------ Datenschutz ------------------------------ */

const privacy: LegalDoc = {
  slug: "integritetspolicy",
  title: "Datenschutzerklärung",
  updated,
  intro:
    "Diese Erklärung beschreibt, welche personenbezogenen Daten Metilde erhebt, wenn du metilde.com besuchst, bestellst oder ein Abo verwaltest, warum wir sie verarbeiten, wie lange wir sie speichern und welche Rechte du nach der DSGVO hast.",
  metaTitle: "Datenschutzerklärung",
  metaDescription:
    "Wie Metilde deine personenbezogenen Daten erhebt, nutzt, weitergibt und schützt, wie lange wir sie speichern und wie du deine Rechte nach der DSGVO ausübst.",
  blocks: [
    ...contactBlock,
    {
      type: "p",
      text: `{företag} ist Verantwortlicher für die hier beschriebene Verarbeitung. Schreib uns an {epost}, wenn du Fragen hast oder deine Rechte ausüben möchtest.`,
    },
    { type: "h2", text: "Daten, die wir erheben" },
    {
      type: "ul",
      items: [
        "Bestelldaten: Name, Liefer- und Rechnungsadresse, E-Mail-Adresse, Telefonnummer, Inhalt der Bestellung, Bestellhistorie und Rücksendungen.",
        "Kontodaten: E-Mail-Adresse und Abo-Einstellungen. Du meldest dich mit einem Einmalcode an, der an deine E-Mail-Adresse geschickt wird – wir speichern also kein Passwort.",
        "Zahlungsdaten: Zahlungsart, Transaktions-ID und Zahlungsstatus. Vollständige Kartennummern werden nie von uns gespeichert, sondern von unserem Zahlungsdienstleister verarbeitet.",
        "Supportdaten: Nachrichten, Anfragen und Anhänge, die du an den Kundenservice schickst.",
        "Marketingdaten: E-Mail-Adresse und Einwilligungsstatus, wenn du den Newsletter abonnierst.",
        "Warenkorbdaten: E-Mail-Adresse und Inhalt des Warenkorbs, wenn du mit dem Bezahlvorgang begonnen hast, damit wir den Warenkorb speichern und dich per E-Mail daran erinnern können (höchstens viermal innerhalb von zehn Tagen). Jede Erinnerung enthält einen Link, mit dem du weitere Erinnerungen abbestellen kannst.",
        "Technische Daten: IP-Adresse, Geräte- und Browsertyp, besuchte Seiten und Interaktionen, erhoben über Cookies und ähnliche Technologien.",
      ],
    },
    { type: "h2", text: "Zwecke und Rechtsgrundlage" },
    {
      type: "table",
      head: ["Zweck", "Rechtsgrundlage", "Speicherdauer"],
      rows: [
        ["Deine Bestellung bearbeiten und liefern, Rücksendungen und Erstattungen abwickeln", "Vertragserfüllung", "Während der Abwicklung der Bestellung sowie für die Dauer der Gewährleistungsfrist"],
        ["Dein Konto und deine Abos verwalten", "Vertragserfüllung", "Bis du dein Konto löschst"],
        ["Buchhaltung und steuerliche Pflichten", "Rechtliche Verpflichtung (geltende Buchführungsvorschriften)", "7 Jahre"],
        ["Kundenservice und Reklamationen", "Berechtigtes Interesse", "36 Monate nach Abschluss des Vorgangs"],
        ["Newsletter und Marketing", "Einwilligung", "Bis du deine Einwilligung widerrufst"],
        ["Analyse und Verbesserung der Website", "Einwilligung (nicht notwendige Cookies)", "Bis zu 24 Monate"],
        ["Betrugsprävention und IT-Sicherheit", "Berechtigtes Interesse", "12 Monate"],
      ],
    },
    { type: "h2", text: "An wen wir Daten weitergeben" },
    {
      type: "p",
      text: "Wir verkaufen deine personenbezogenen Daten niemals. Wir geben sie nur an Auftragsverarbeiter weiter, die uns beim Betrieb des Shops helfen, und nur in dem Umfang, der dafür nötig ist:",
    },
    {
      type: "ul",
      items: [
        "Zahlungsdienstleister, für Zahlungen und Betrugsprüfung.",
        "Logistikpartner und Versanddienstleister, für Lieferung und Rücksendungen.",
        "Anbieter von Hosting, Datenbank und E-Mail, um die Website zu betreiben und E-Mails zu deiner Bestellung zu versenden.",
        "Zahlung über Stripe (Karte, Klarna, Apple Pay, Google Pay), Lager und Versand über MittLogistik und PostNord, E-Mail über Resend, Hosting und Datenbank über Vercel und Supabase.",
        "Meta (Facebook, Instagram), Google Ads und Microsoft Advertising, um unsere Werbung zu messen. Mit deiner Einwilligung in Marketing-Cookies erhalten sie Daten über deinen Besuch und Kauf sowie deine E-Mail-Adresse in gehashter Form, um den Kauf einer Anzeige zuzuordnen. Ohne Einwilligung sendet das Tag von Google nur anonyme Signale ohne Cookies.",
        "AddRevenue, wenn du über einen Affiliate-Link zu uns gekommen bist: Bestellnummer und Bestellwert, um der Person, die verlinkt hat, eine Provision auszuzahlen.",
        "Behörden, wenn wir gesetzlich verpflichtet sind, Informationen herauszugeben.",
      ],
    },
    {
      type: "p",
      text: "Mit allen Auftragsverarbeitern bestehen Verträge zur Auftragsverarbeitung. Ist eine Übermittlung außerhalb der EU/des EWR notwendig, wird sie durch die Standardvertragsklauseln der Europäischen Kommission zusammen mit ergänzenden Schutzmaßnahmen abgesichert.",
    },
    { type: "h2", text: "Deine Rechte" },
    {
      type: "ul",
      items: [
        "Auskunft – eine Übersicht über die Daten verlangen, die wir über dich gespeichert haben.",
        "Berichtigung – unrichtige Daten korrigieren lassen.",
        "Löschung – deine Daten löschen lassen, wenn wir sie nicht mehr benötigen.",
        "Einschränkung und Widerspruch – bestimmte Verarbeitungen einschränken lassen oder ihnen widersprechen, einschließlich Direktwerbung.",
        "Datenübertragbarkeit – deine Daten in einem maschinenlesbaren Format erhalten.",
        "Einwilligung widerrufen – jederzeit, ohne dass dies die Rechtmäßigkeit der bereits erfolgten Verarbeitung berührt.",
      ],
    },
    {
      type: "p",
      text: `Schreib an {epost}, um ein Recht auszuüben. Wir antworten innerhalb von 30 Tagen. Wenn du mit unserem Umgang mit deinen Daten nicht zufrieden bist, kannst du dich bei der Datenschutzaufsichtsbehörde in deinem Land beschweren.`,
    },
    { type: "h2", text: "Sicherheit" },
    {
      type: "p",
      text: "Die Website wird über TLS ausgeliefert, die Anmeldung erfolgt mit Einmalcodes, der Zugriff auf personenbezogene Daten ist auf Mitarbeitende beschränkt, die ihn benötigen, und unsere Systeme sind durch Protokollierung und rollenbasierte Zugriffsrechte geschützt.",
    },
    { type: "h2", text: "Kinder" },
    { type: "p", text: "Der Shop richtet sich nicht an Kinder. Du musst mindestens 18 Jahre alt sein, um zu bestellen oder ein Konto anzulegen." },
    { type: "h2", text: "Änderungen dieser Erklärung" },
    {
      type: "p",
      text: "Wir können diese Erklärung aktualisieren, wenn sich unsere Dienste oder gesetzliche Anforderungen ändern. Das Datum oben zeigt immer die gültige Fassung, und über wesentliche Änderungen informieren wir registrierte Kundinnen und Kunden per E-Mail.",
    },
  ],
};

/* ------------------------------- AGB ------------------------------- */

const terms: LegalDoc = {
  slug: "kopvillkor",
  title: "Allgemeine Geschäftsbedingungen",
  updated,
  intro:
    "Diese Bedingungen gelten für alle Bestellungen, die Verbraucherinnen und Verbraucher auf metilde.com aufgeben. Sie regeln Preise, Zahlung, Lieferung, Abos, Widerrufsrecht, Rücksendungen, Erstattung und Reklamationen.",
  metaTitle: "Allgemeine Geschäftsbedingungen",
  metaDescription:
    "Die AGB von Metilde: Preise und Zahlung, Lieferzeiten und Versandkosten, Abos, Widerrufsrecht, Rücksendungen, Erstattung und Reklamationen.",
  blocks: [
    ...contactBlock,
    { type: "h2", text: "Bestellung und Vertrag" },
    {
      type: "p",
      text: "Ein verbindlicher Vertrag kommt zustande, sobald wir deine Bestellung per E-Mail bestätigen. Du musst mindestens 18 Jahre alt sein, um zu bestellen. Ist ein Produkt nicht vorrätig oder ein Preis offensichtlich falsch, können wir die Bestellung stornieren und einen eventuell abgebuchten Betrag erstatten. Die gesamte Kommunikation erfolgt auf Schwedisch oder Englisch.",
    },
    { type: "h2", text: "Preise, Mehrwertsteuer und Zahlung" },
    {
      type: "ul",
      items: [
        "Alle Preise werden in Euro (EUR) angezeigt und enthalten die Mehrwertsteuer. Den Gesamtbetrag einschließlich Versand siehst du, bevor du die Bestellung bestätigst.",
        "Akzeptierte Zahlungsarten: Klarna, Visa, Mastercard, American Express, Apple Pay und Google Pay.",
        "Bei einem Einmalkauf wird die Zahlung belastet, sobald du die Bestellung aufgibst.",
        "Über diese Seite liefern wir an Adressen in Deutschland, Österreich und Luxemburg. Die Sendungen werden innerhalb der EU verschickt, daher fallen nie Zölle oder Einfuhrabgaben an.",
      ],
    },
    { type: "h2", text: "Lieferung" },
    { type: "shippingTable" },
    {
      type: "p",
      text: "Bestellungen, die an einem Werktag vor 12:00 Uhr (CET) eingehen, verschicken wir normalerweise noch am selben Tag aus unserem Lager. Bestellungen nach Deutschland, Österreich und Luxemburg gehen mit PostNord als Brief mit Sendungsverfolgung; die Lieferzeit beträgt normalerweise 3–6 Werktage. Du erhältst einen Link zur Sendungsverfolgung per E-Mail, sobald die Sendung uns verlässt. Für nicht abgeholte Sendungen berechnen wir die tatsächlichen Versandkosten für Hin- und Rückweg.",
    },
    { type: "h2", text: "Abo" },
    {
      type: "ul",
      items: [
        "Ein Abo gibt dir 15 % Rabatt auf den regulären Preis und wird in dem Intervall geliefert, das du wählst.",
        "Die erste Lieferung bezahlst du direkt beim Kauf. Danach wird die Zahlung automatisch belastet, wenn ein neuer Zeitraum beginnt – alle 30, 60 oder 90 Tage, gerechnet ab dem Kauf. Die Sendung wird einige Tage nach der Belastung verschickt, und du bekommst eine E-Mail mit dem voraussichtlichen Liefertag.",
        "Du kannst dein Abo jederzeit bis zum Tag vor der nächsten Verlängerung pausieren oder kündigen – selbst unter Mein Konto oder per E-Mail an den Kundenservice. Möchtest du Intervall, Menge oder Produkt ändern, schreib dem Kundenservice. Später mitgeteilte Änderungen gelten ab der nächsten Lieferung.",
        "Das Abo läuft, bis du es kündigst. Keine Mindestlaufzeit und keine Kündigungsgebühr.",
      ],
    },
    { type: "h2", text: "Widerrufsrecht" },
    {
      type: "p",
      text: `Als Verbraucherin oder Verbraucher hast du ein gesetzliches Widerrufsrecht von 14 Tagen ab dem Tag, an dem du die Ware erhältst – wir verlängern es auf 30 Tage. Kontaktiere uns unter {epost} oder nutze das europäische Muster-Widerrufsformular. Die Ware muss unbenutzt und in der ungeöffneten Originalverpackung zurückgeschickt werden. Aus Gründen des Gesundheitsschutzes und der Hygiene können Nahrungsergänzungsmittel mit geöffnetem Siegel nicht zurückgegeben werden.`,
    },
    { type: "h2", text: "Rücksendung und Erstattung" },
    {
      type: "ul",
      items: [
        "Gib uns innerhalb von 30 Tagen nach Erhalt Bescheid und schick die Ware innerhalb von 14 Tagen nach deiner Mitteilung zurück.",
        "Bei einem Widerruf trägst du die Kosten der Rücksendung (8,00 € werden von der Erstattung abgezogen). Ist die Ware mangelhaft oder falsch geliefert, übernehmen wir die Rücksendekosten.",
        "Wir erstatten den Kaufpreis einschließlich der von dir bezahlten Standardversandkosten innerhalb von 14 Tagen, nachdem wir die Rücksendung oder einen Nachweis über die Rücksendung erhalten haben.",
        "Die Erstattung erfolgt über die ursprüngliche Zahlungsart.",
        "Hat die Ware an Wert verloren, weil du sie mehr genutzt hast, als zur Prüfung nötig war, können wir einen entsprechenden Betrag abziehen.",
      ],
    },
    { type: "h2", text: "Reklamation und mangelhafte Ware" },
    {
      type: "p",
      text: `Du hast das gesetzliche Gewährleistungsrecht nach dem Verbraucherrecht, das für dich gilt. Schreib an {epost} mit deiner Bestellnummer und einem Foto des Mangels. Eine anerkannte Reklamation lösen wir mit einer neuen Ware oder einer Erstattung, und wir übernehmen die Rücksendekosten.`,
    },
    { type: "h2", text: "Produktinformationen" },
    {
      type: "p",
      text: "Unsere Produkte sind Nahrungsergänzungsmittel und nicht dazu bestimmt, Krankheiten vorzubeugen, sie zu behandeln oder zu heilen. Nahrungsergänzungsmittel sind kein Ersatz für eine abwechslungsreiche und ausgewogene Ernährung und eine gesunde Lebensweise. Lies immer das Etikett, halte dich an die empfohlene tägliche Verzehrmenge und bewahre das Produkt außerhalb der Reichweite von Kindern auf. Sprich mit einer Ärztin oder einem Arzt, wenn du schwanger bist, stillst oder Medikamente nimmst.",
    },
    { type: "h2", text: "Streitigkeiten" },
    { type: "p", text: disputeText },
  ],
};

/* -------------------------------- Cookies -------------------------------- */

const cookies: LegalDoc = {
  slug: "cookies",
  title: "Cookie-Richtlinie",
  updated,
  intro:
    "Cookies sind kleine Textdateien, die auf deinem Gerät gespeichert werden, wenn du metilde.com besuchst. Wir nutzen sie, damit der Shop funktioniert, um uns deine Auswahl zu merken und um zu verstehen, wie die Website genutzt wird.",
  metaTitle: "Cookie-Richtlinie",
  metaDescription:
    "Welche Cookies Metilde verwendet, was sie tun, wie lange sie gespeichert werden und wie du deine Einwilligung änderst oder widerrufst.",
  blocks: [
    { type: "h2", text: "Einwilligung" },
    {
      type: "p",
      text: "Notwendige Cookies werden automatisch gesetzt, weil der Shop ohne sie nicht funktioniert. Analyse- und Marketing-Cookies werden erst gesetzt, nachdem du sie akzeptiert hast. Du kannst deine Einwilligung jederzeit über die Cookie-Einstellungen in der Fußzeile ändern oder widerrufen oder indem du die Cookies in deinem Browser löschst.",
    },
    { type: "h2", text: "Cookies, die wir verwenden" },
    { type: "h3", text: "Notwendig" },
    {
      type: "table",
      head: ["Cookie", "Zweck", "Speicherdauer"],
      rows: [
        ["metilde_consent", "Speichert deine Cookie-Auswahl", "12 Monate"],
        ["sb-access-token", "Hält dich in Mein Konto angemeldet", "1 Stunde"],
      ],
    },
    {
      type: "p",
      text: "Der Warenkorb wird im lokalen Speicher deines Browsers (metilde_cart) gespeichert, nicht in einem Cookie. Wir nutzen keinen separaten Analysedienst; die Besucherstatistik wird ohne Cookies auf unserem eigenen Server gezählt.",
    },
    { type: "h3", text: "Marketing (erfordert Einwilligung)" },
    {
      type: "table",
      head: ["Cookie", "Zweck", "Speicherdauer"],
      rows: [
        ["_fbp", "Misst die Wirkung unserer Anzeigen", "3 Monate"],
        ["_gcl_au", "Ordnet Conversions Google Ads zu", "3 Monate"],
        ["_uetsid, _uetvid, MUID", "Ordnet Conversions Microsoft Advertising (Bing) zu", "1 Tag – 13 Monate"],
      ],
    },
    { type: "h2", text: "Drittanbieter" },
    {
      type: "p",
      text: "Analyse- und Marketing-Cookies werden von Google, Microsoft und Meta als eigenständigen Anbietern gesetzt. Sie verarbeiten Daten nach ihren eigenen Richtlinien und werden erst nach deiner Einwilligung aktiv. Das Werbe-Tag von Google nutzt den Einwilligungsmodus (Consent Mode): Ohne deine Einwilligung setzt es keine Cookies und sendet nur anonyme Signale über Seitenaufrufe und Käufe, ohne personenbezogene Daten wie deine E-Mail-Adresse. Google nutzt diese, um die Ergebnisse der Anzeigen zu schätzen.",
    },
    { type: "h2", text: "Cookies im Browser verwalten" },
    {
      type: "p",
      text: "Du kannst Cookies in den Einstellungen deines Browsers blockieren oder löschen. Beachte: Wenn du notwendige Cookies blockierst, funktionieren Warenkorb, Kasse und Anmeldung nicht.",
    },
    { type: "p", text: `Fragen zu Cookies? Schreib an {epost}.` },
  ],
};

/* ---------------------------- Qualität ---------------------------- */

const quality: LegalDoc = {
  slug: "kvalitetsgaranti",
  title: "Qualität und Kennzeichnung",
  updated,
  intro: "So sind unsere Kapseln gekennzeichnet – und das gilt, wenn du nicht zufrieden bist.",
  metaTitle: "Qualität und Kennzeichnung – Inhalt, Etikett und Rücksendungen",
  metaDescription:
    "Die Kapseln von Metilde sind mit Extraktstärke, Dosierung und Chargennummer gekennzeichnet und können ungeöffnet innerhalb von 30 Tagen zurückgeschickt werden.",
  blocks: [
    { type: "h2", text: "Das gilt für alle unsere Kapseln" },
    {
      type: "ul",
      items: [
        "Vegane Kapsel ohne Füllstoffe.",
        "Extraktstärke, Menge pro Kapsel und lateinischer Name stehen auf der Dose.",
        "Die Kapseln werden in einer Kunststoffdose geliefert. Die Rohstoffe stammen aus den Ländern, in denen die Pflanzen zu Hause sind.",
        "Chargennummer und Mindesthaltbarkeitsdatum auf jeder Dose.",
      ],
    },
    { type: "h2", text: "Rückverfolgbarkeit" },
    {
      type: "p",
      text: "Jede Dose trägt eine Chargennummer und ein Mindesthaltbarkeitsdatum. Gib die Chargennummer an, wenn du uns wegen eines Produkts kontaktierst, dann können wir nachvollziehen, aus welcher Herstellung es stammt.",
    },
    { type: "h2", text: "Wenn du nicht zufrieden bist" },
    {
      type: "p",
      text: "Ungeöffnete Produkte kannst du innerhalb von 30 Tagen gemäß unseren Bedingungen für Rücksendung und Umtausch zurückschicken. Ist ein Produkt mangelhaft oder beschädigt, gilt das Reklamationsrecht, auch wenn die Verpackung geöffnet ist. Melde dich, wenn sich etwas nicht richtig anfühlt, dann schauen wir es uns gemeinsam an.",
    },
    { type: "h2", text: "Rechtsrahmen" },
    {
      type: "p",
      text: "Unsere Produkte sind Nahrungsergänzungsmittel und werden nach den EU-Vorschriften für Nahrungsergänzungsmittel gekennzeichnet. Nahrungsergänzungsmittel sind kein Ersatz für eine abwechslungsreiche Ernährung und eine gesunde Lebensweise und nicht dazu bestimmt, Krankheiten zu diagnostizieren, zu behandeln oder zu heilen. Sprich mit einer Ärztin oder einem Arzt, wenn du schwanger bist, stillst oder Medikamente nimmst.",
    },
    ...helpBlock,
  ],
};

/* ---------------------------- Versand & Lieferung ---------------------------- */

const shipping: LegalDoc = {
  slug: "frakt-och-leverans",
  title: "Versand & Lieferung",
  updated,
  intro:
    "Bestellungen, die an Werktagen vor 12:00 Uhr (CET) eingehen, werden noch am selben Tag verpackt und aus unserem Lager verschickt. Kostenloser Versand ab einem Bestellwert von 79 €.",
  metaTitle: "Versand & Lieferung – Versandkosten, Lieferzeiten und Sendungsverfolgung",
  metaDescription:
    "Versandkosten und Lieferzeiten von Metilde nach Deutschland, Österreich und Luxemburg, kostenloser Versand ab 79 €, Sendungsverfolgung, nicht abgeholte Sendungen und was bei beschädigter Lieferung gilt.",
  blocks: [
    { type: "h2", text: "Bearbeitungszeit" },
    {
      type: "p",
      text: "Wir verpacken Bestellungen an Werktagen. Bestellungen, die vor 12:00 Uhr (CET) eingehen, werden am selben Tag verschickt, spätere Bestellungen am nächsten Werktag. Während Aktionen und rund um Feiertage kann das Verpacken einen Tag länger dauern.",
    },
    { type: "h2", text: "Versandkosten und Lieferzeiten" },
    { type: "shippingTable" },
    {
      type: "p",
      text: "Alle Preise enthalten die Mehrwertsteuer. Über diese Seite liefern wir an Adressen in Deutschland, Österreich und Luxemburg. Die Bestellungen gehen mit PostNord als Brief mit Sendungsverfolgung aus unserem Lager; die Lieferzeit beträgt normalerweise 3–6 Werktage. Der Versand kostet 8,00 €, ab einem Bestellwert von 79 € ist er kostenlos. Abos und Sets werden immer kostenlos verschickt. Da die Sendung innerhalb der EU bleibt, zahlst du keine Zölle oder Einfuhrabgaben.",
    },
    { type: "h2", text: "Deine Bestellung verfolgen" },
    {
      type: "p",
      text: "Du erhältst eine Bestellbestätigung, sobald deine Bestellung aufgegeben ist, und einen Link zur Sendungsverfolgung, sobald die Sendung unser Lager verlässt. Du kannst die Lieferung auch unter Bestellung verfolgen nachverfolgen.",
    },
    { type: "h2", text: "Nicht abgeholte Sendungen" },
    {
      type: "p",
      text: "Sendungen bleiben 14 Tage in der Abholstelle liegen. Nicht abgeholte Sendungen kommen zu uns zurück, und wir berechnen die tatsächlichen Versandkosten für Hin- und Rückweg. Melde dich lieber, wenn du es nicht rechtzeitig zur Abholung schaffst – wir helfen dir gern.",
    },
    { type: "h2", text: "Beschädigte oder fehlende Lieferungen" },
    {
      type: "ul",
      items: [
        "Melde sichtbare Transportschäden innerhalb von 7 Tagen nach Erhalt, mit Fotos der Sendung und der Produkte.",
        "Zeigt die Sendungsverfolgung die Sendung als zugestellt an, du hast aber nichts erhalten? Frag zuerst bei deinen Nachbarn und der Abholstelle nach und melde dich dann innerhalb von 14 Tagen bei uns.",
        "Wir schicken eine Ersatzlieferung oder erstatten die Bestellung, sobald der Fall bestätigt ist.",
      ],
    },
    ...helpBlock,
  ],
};

/* ----------------------------- Rücksendung & Umtausch ---------------------------- */

const returns: LegalDoc = {
  slug: "returer-och-byten",
  title: "Rücksendung & Umtausch",
  updated,
  intro:
    "Du hast immer 30 Tage Widerrufsrecht – länger als die gesetzlichen 14 Tage. Ungeöffnete Produkte im Originalzustand kannst du zurückschicken oder umtauschen.",
  metaTitle: "Rücksendung & Umtausch – 30 Tage Widerrufsrecht",
  metaDescription:
    "So schickst du ein Produkt bei Metilde zurück oder tauschst es um: 30 Tage Widerrufsrecht, Rücksendekosten, Erstattung innerhalb von 14 Tagen und drei Jahre Reklamationsrecht.",
  blocks: [
    { type: "h2", text: "Dein Widerrufsrecht" },
    {
      type: "p",
      text: "Als Verbraucherin oder Verbraucher in der EU hast du ein gesetzliches Widerrufsrecht von 14 Tagen ab dem Tag, an dem du deine Bestellung erhältst. Wir verlängern es auf 30 Tage. Das Widerrufsrecht gilt für Produkte, die ungeöffnet und in im Wesentlichen unverändertem Zustand sind – aus Gründen des Gesundheitsschutzes und der Hygiene können wir geöffnete Nahrungsergänzungsmittel nicht weiterverkaufen.",
    },
    { type: "h2", text: "So schickst du etwas zurück" },
    {
      type: "ul",
      items: [
        `Melde die Rücksendung per E-Mail an {epost} mit deiner Bestellnummer und den betroffenen Produkten. Du kannst auch das europäische Muster-Widerrufsformular verwenden.`,
        `Du erhältst innerhalb eines Werktags ein Rücksendeetikett mit Rücksendeadresse und Anleitung.`,
        "Verpacke die Produkte in der Originalverpackung oder einer vergleichbar schützenden Verpackung.",
        "Gib die Sendung auf und bewahre den Einlieferungsbeleg auf, bis die Erstattung abgeschlossen ist.",
      ],
    },
    { type: "h2", text: "Rücksendekosten und Erstattung" },
    {
      type: "table",
      head: ["Situation", "Rücksendekosten", "Erstattung"],
      rows: [
        ["Widerruf (Kauf bereut)", "Trägst du, 8,00 € werden von der Erstattung abgezogen", "Der Bestellwert einschließlich der ursprünglichen Standardversandkosten"],
        ["Falsches Produkt verschickt", "Kostenlos, mit einem vorfrankierten Etikett von uns", "Der volle Betrag oder ein Ersatzprodukt"],
        ["Beschädigtes oder mangelhaftes Produkt", "Kostenlos, mit einem vorfrankierten Etikett von uns", "Der volle Betrag oder ein Ersatzprodukt"],
        ["Umtausch gegen ein anderes Produkt", "Trägst du wie bei einer Rücksendung (8,00 €), es sei denn, das Produkt war mangelhaft", "Die Differenz wird berechnet oder erstattet"],
      ],
    },
    {
      type: "p",
      text: "Die Erstattung erfolgt über dieselbe Zahlungsart wie beim Kauf, innerhalb von 14 Tagen, nachdem wir die Rücksendung erhalten und geprüft haben, normalerweise innerhalb von 2–5 Bankarbeitstagen. Über die Rücksendekosten in der Tabelle oben hinaus berechnen wir keine Rücksendegebühr.",
    },
    { type: "h2", text: "Reklamation" },
    {
      type: "p",
      text: "Für mangelhafte Ware hast du das gesetzliche Gewährleistungsrecht nach dem Verbraucherrecht, das für dich gilt. Melde den Mangel innerhalb einer angemessenen Frist, nachdem du ihn entdeckt hast – innerhalb von zwei Monaten gilt immer als angemessen. Füge Fotos und die Chargennummer vom Etikett bei.",
    },
    { type: "h2", text: "Ausnahmen" },
    {
      type: "ul",
      items: [
        "Geöffnete Nahrungsergänzungsmittel oder Produkte mit geöffnetem Siegel, aus Gründen des Gesundheitsschutzes und der Hygiene.",
        "Produkte, deren Mindesthaltbarkeitsdatum abgelaufen ist, während sie in deinem Besitz waren.",
      ],
    },
    { type: "h2", text: "Streitbeilegung" },
    { type: "p", text: disputeText },
    ...helpBlock,
  ],
};

/* -------------------------------- Nachhaltigkeit ------------------------------ */

const sustainability: LegalDoc = {
  slug: "hallbarhet",
  title: "Nachhaltigkeit",
  updated,
  intro:
    "Weniger, aber bessere Produkte, Verpackungen, die sich recyceln lassen, und eine Lieferkette, die wir erklären können. So sieht es heute aus – und daran arbeiten wir weiter.",
  metaTitle: "Nachhaltigkeit – Verpackungen, Versand und Rohstoffe",
  metaDescription:
    "So arbeitet Metilde an Nachhaltigkeit: recycelbare Verpackungen, gebündelter Versand aus einem Lager und dokumentierte Rohstoffe.",
  blocks: [
    { type: "h2", text: "Wie wir denken" },
    {
      type: "p",
      text: "Der größte Fußabdruck einer Marke für Nahrungsergänzungsmittel liegt in Rohstoffen, Verpackungen und Transporten. Daran arbeiten wir, in dieser Reihenfolge, und wir sagen lieber ehrlich, wo wir stehen, als Behauptungen aufzustellen, die wir nicht belegen können.",
    },
    { type: "h2", text: "Verpackungen" },
    {
      type: "ul",
      items: [
        "Versandkarton und Füllmaterial bestehen aus Recyclingpapier und gehören ins Altpapier.",
        "Die Kapseln werden in Kunststoffdosen mit Schraubdeckel geliefert, die vor Feuchtigkeit und Licht schützen. Die Dose wird als Kunststoffverpackung entsorgt.",
        "Keine Plastikfolie um die Außenverpackung und keine gedruckten Papierbeilagen, um die du nicht gebeten hast.",
      ],
    },
    { type: "h2", text: "Versand" },
    {
      type: "p",
      text: "Wir verschicken aus einem einzigen Lager, vorzugsweise als Brief und an Abholstellen, weil gebündelte Routen weniger Kilometer pro Sendung bedeuten. Abos können zu einer Lieferung zusammengelegt werden, sodass mehrere Produkte gemeinsam reisen.",
    },
    { type: "h2", text: "Rohstoffe und soziale Verantwortung" },
    {
      type: "ul",
      items: [
        "Lieferanten müssen die Herkunft dokumentieren und die geltenden Arbeits- und Umweltgesetze einhalten.",
        "Wir kaufen Rohstoffe von Erzeugern mit dokumentierten Ernteabläufen.",
        "Botanische Rohstoffe, die nur außerhalb Europas wachsen, kaufen wir in möglichst großen Partien, um die Zahl der Transporte zu verringern.",
      ],
    },
    { type: "h2", text: "Was wir noch nicht gelöst haben" },
    {
      type: "ul",
      items: [
        "Wir veröffentlichen noch keine vollständige Klimabilanz pro Produkt.",
        "Manche botanischen Rohstoffe können nur außerhalb Europas angebaut werden, was lange Transporte bedeutet.",
      ],
    },
    {
      type: "p",
      text: `Hast du eine Frage oder einen Vorschlag zu unserer Nachhaltigkeitsarbeit? Schreib an {epost} – wir lesen alles.`,
    },
  ],
};

export const legalDocs: Record<string, LegalDoc> = {
  integritetspolicy: privacy,
  kopvillkor: terms,
  cookies,
  kvalitetsgaranti: quality,
  "frakt-och-leverans": shipping,
  "returer-och-byten": returns,
  hallbarhet: sustainability,
};
