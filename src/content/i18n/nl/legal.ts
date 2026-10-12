/**
 * Juridiskt innehåll och informationssidor på nederländska (nl-NL), lokaliserat för Nederländerna.
 * Samma nycklar och blockstruktur som src/content/legal.ts. `slug` är det interna id:t (svenskt).
 * Platshållare som {epost} och {företag} fylls i när sidan visas (lib/page-text).
 */
import type { LegalBlock, LegalDoc } from "@/content/legal";

const updated = "Laatst bijgewerkt: 12 oktober 2026";

const contactBlock: LegalBlock[] = [
  { type: "h2", text: "Contact- en bedrijfsgegevens" },
  { type: "companyInfo" },
];

const helpBlock: LegalBlock[] = [
  { type: "h2", text: "Hulp nodig?" },
  {
    type: "p",
    text: `Mail naar {epost} of bel {telefon} ({öppettider}). Vermeld altijd je ordernummer, dan kunnen we je sneller helpen. Onze klantenservice antwoordt in het Zweeds en Engels.`,
  },
];

const disputeText =
  "Komen we er samen niet uit, dan vind je informatie over je rechten en mogelijkheden bij ConsuWijzer, consuwijzer.nl, en kun je je geschil voorleggen aan de bevoegde Nederlandse rechter. Op de overeenkomst is Zweeds recht van toepassing. Dat beperkt de dwingende rechten die je als consument hebt op grond van het Nederlandse recht niet.";

/* ------------------------------ Privacy ------------------------------ */

const privacy: LegalDoc = {
  slug: "integritetspolicy",
  title: "Privacybeleid",
  updated,
  intro:
    "Dit beleid legt uit welke persoonsgegevens Metilde verzamelt wanneer je metilde.com bezoekt, een bestelling plaatst of een abonnement beheert, waarom we ze verwerken, hoe lang we ze bewaren en welke rechten je hebt op grond van de AVG (GDPR).",
  metaTitle: "Privacybeleid",
  metaDescription:
    "Hoe Metilde je persoonsgegevens verzamelt, gebruikt, deelt en beschermt, hoe lang we ze bewaren en hoe je je rechten onder de AVG uitoefent.",
  blocks: [
    ...contactBlock,
    {
      type: "p",
      text: `{företag} is verwerkingsverantwoordelijke voor de verwerking die hier wordt beschreven. Neem contact met ons op via {epost} als je vragen hebt of je rechten wilt uitoefenen.`,
    },
    { type: "h2", text: "Gegevens die we verzamelen" },
    {
      type: "ul",
      items: [
        "Bestelgegevens: naam, bezorg- en factuuradres, e-mailadres, telefoonnummer, inhoud van de bestelling, bestelgeschiedenis en retouren.",
        "Accountgegevens: e-mailadres en abonnementsinstellingen. Je logt in met een eenmalige code die naar je e-mail wordt gestuurd, dus we slaan geen wachtwoord op.",
        "Betaalgegevens: betaalmethode, transactie-ID en betaalstatus. Volledige kaartnummers worden nooit door ons opgeslagen, maar worden verwerkt door onze betaalprovider.",
        "Supportgegevens: berichten, vragen en bijlagen die je naar de klantenservice stuurt.",
        "Marketinggegevens: e-mailadres en toestemmingsstatus als je je abonneert op de nieuwsbrief.",
        "Winkelwagengegevens: e-mailadres en de inhoud van je winkelwagen wanneer je bent begonnen met afrekenen, zodat we de winkelwagen kunnen bewaren en je er per e-mail aan kunnen herinneren (maximaal vier keer in tien dagen). Elke herinnering bevat een link om je af te melden voor verdere herinneringen.",
        "Technische gegevens: IP-adres, type apparaat en browser, bezochte pagina's en interacties, verzameld via cookies en vergelijkbare technieken.",
      ],
    },
    { type: "h2", text: "Doeleinden en rechtsgrond" },
    {
      type: "table",
      head: ["Doel", "Rechtsgrond", "Bewaartermijn"],
      rows: [
        ["Je bestelling verwerken en leveren, retouren en terugbetalingen afhandelen", "Uitvoering van de overeenkomst", "Zolang de bestelling loopt en gedurende de reclamatietermijn"],
        ["Je account en abonnementen beheren", "Uitvoering van de overeenkomst", "Tot je je account verwijdert"],
        ["Boekhouding en fiscale verplichtingen", "Wettelijke verplichting (Zweedse boekhoudwet)", "7 jaar"],
        ["Klantenservice en reclamaties", "Gerechtvaardigd belang", "36 maanden na afsluiting van de zaak"],
        ["Nieuwsbrief en marketing", "Toestemming", "Tot je je toestemming intrekt"],
        ["Analyse en verbetering van de website", "Toestemming (niet-noodzakelijke cookies)", "Tot 24 maanden"],
        ["Fraudepreventie en IT-beveiliging", "Gerechtvaardigd belang", "12 maanden"],
      ],
    },
    { type: "h2", text: "Met wie we gegevens delen" },
    {
      type: "p",
      text: "We verkopen je persoonsgegevens nooit. We delen ze alleen met verwerkers die ons helpen de winkel te runnen, en alleen voor zover dat nodig is:",
    },
    {
      type: "ul",
      items: [
        "Betaalproviders, voor betalingen en fraudecontrole.",
        "Logistieke partners en vervoerders, voor levering en retouren.",
        "Leveranciers van hosting, database en e-mail, om de website te laten draaien en e-mails over je bestelling te versturen.",
        "Betaling via Stripe (kaart, iDEAL, Klarna, Apple Pay, Google Pay), opslag en verzending via MittLogistik en PostNord, e-mail via Resend, hosting en database via Vercel en Supabase.",
        "Meta (Facebook, Instagram) en Google Ads, om onze advertenties te meten. Met je toestemming voor marketingcookies ontvangen zij gegevens over je bezoek en aankoop, en je e-mailadres in gehashte vorm om de aankoop aan een advertentie te koppelen. Zonder toestemming stuurt de tag van Google alleen anonieme signalen zonder cookies.",
        "AddRevenue, als je via een affiliatelink bij ons bent gekomen: ordernummer en orderwaarde, om commissie uit te betalen aan degene die de link plaatste.",
        "Overheidsinstanties, als we wettelijk verplicht zijn informatie te verstrekken.",
      ],
    },
    {
      type: "p",
      text: "Met alle verwerkers zijn verwerkersovereenkomsten gesloten. Als doorgifte buiten de EU/EER nodig is, wordt die beschermd door de standaardcontractbepalingen van de Europese Commissie, aangevuld met extra beschermingsmaatregelen.",
    },
    { type: "h2", text: "Je rechten" },
    {
      type: "ul",
      items: [
        "Inzage – een overzicht opvragen van de gegevens die we over je hebben.",
        "Rectificatie – onjuiste gegevens laten corrigeren.",
        "Verwijdering – je gegevens laten verwijderen wanneer we ze niet meer nodig hebben.",
        "Beperking en bezwaar – bepaalde verwerking laten beperken of er bezwaar tegen maken, waaronder direct marketing.",
        "Dataportabiliteit – je gegevens ontvangen in een machineleesbaar formaat.",
        "Toestemming intrekken – op elk moment, zonder dat dit gevolgen heeft voor verwerking die al heeft plaatsgevonden.",
      ],
    },
    {
      type: "p",
      text: `Mail naar {epost} om een recht uit te oefenen. We antwoorden binnen 30 dagen. Ben je niet tevreden over hoe we met je gegevens omgaan, dan kun je een klacht indienen bij de Autoriteit Persoonsgegevens, autoriteitpersoonsgegevens.nl, of bij onze toezichthouder in Zweden, Integritetsskyddsmyndigheten (IMY), imy.se.`,
    },
    { type: "h2", text: "Beveiliging" },
    {
      type: "p",
      text: "De website wordt geleverd via TLS, inloggen gebeurt met eenmalige codes, toegang tot persoonsgegevens is beperkt tot medewerkers die die nodig hebben, en onze systemen worden beschermd door logging en rolgebaseerde toegangsrechten.",
    },
    { type: "h2", text: "Kinderen" },
    { type: "p", text: "De winkel is niet bedoeld voor kinderen. Je moet 18 jaar of ouder zijn om te bestellen of een account aan te maken." },
    { type: "h2", text: "Wijzigingen in dit beleid" },
    {
      type: "p",
      text: "We kunnen dit beleid bijwerken als onze diensten of wettelijke eisen veranderen. De datum hierboven toont altijd de geldende versie, en belangrijke wijzigingen laten we geregistreerde klanten per e-mail weten.",
    },
  ],
};

/* ------------------------------- Algemene voorwaarden ------------------------------- */

const terms: LegalDoc = {
  slug: "kopvillkor",
  title: "Algemene voorwaarden",
  updated,
  intro:
    "Deze voorwaarden gelden voor alle bestellingen die consumenten plaatsen op metilde.com. Ze gaan over prijzen, betaling, levering, abonnementen, herroepingsrecht, retouren, terugbetaling en reclamaties.",
  metaTitle: "Algemene voorwaarden",
  metaDescription:
    "De algemene voorwaarden van Metilde: prijzen en betaling, levertijden en verzendkosten, abonnementen, herroepingsrecht, retouren, terugbetaling en reclamaties.",
  blocks: [
    ...contactBlock,
    { type: "h2", text: "Bestelling en overeenkomst" },
    {
      type: "p",
      text: "Een bindende overeenkomst komt tot stand zodra we je bestelling per e-mail bevestigen. Je moet minimaal 18 jaar zijn om te bestellen. Als een product niet op voorraad is of een prijs duidelijk onjuist is, kunnen we de bestelling annuleren en een eventueel afgeschreven bedrag terugbetalen. Alle communicatie verloopt in het Zweeds of Engels.",
    },
    { type: "h2", text: "Prijzen, btw en betaling" },
    {
      type: "ul",
      items: [
        "Alle prijzen worden weergegeven in euro (EUR) en zijn inclusief btw. Het totaalbedrag inclusief verzendkosten zie je voordat je de bestelling bevestigt.",
        "Geaccepteerde betaalmethoden: iDEAL, Klarna, Visa, Mastercard, American Express, Apple Pay en Google Pay. iDEAL is niet beschikbaar voor abonnementen.",
        "Bij een eenmalige aankoop wordt de betaling afgeschreven zodra je de bestelling plaatst.",
        "We leveren aan adressen in Zweden, Finland, Denemarken en Nederland. Bestellingen naar Nederland worden binnen de EU verzonden, dus er komen nooit douanekosten of invoerheffingen bij.",
      ],
    },
    { type: "h2", text: "Levering" },
    { type: "shippingTable" },
    {
      type: "p",
      text: "Bestellingen die op een werkdag vóór 12.00 uur (Zweedse tijd) worden geplaatst, versturen we normaal gesproken dezelfde dag vanuit ons magazijn in Timrå, Zweden. Bestellingen naar Nederland gaan met PostNord als brief met track & trace; de levertijd is normaal 3–6 werkdagen. Je ontvangt een track & trace-link per e-mail zodra de zending bij ons vertrekt. Voor zendingen die niet worden afgehaald, rekenen we de werkelijke verzendkosten heen en terug.",
    },
    { type: "h2", text: "Abonnement" },
    {
      type: "ul",
      items: [
        "Een abonnement geeft 15 % korting op de normale prijs en wordt geleverd met het interval dat je kiest.",
        "De eerste levering betaal je direct bij aankoop. Daarna wordt de betaling automatisch afgeschreven wanneer een nieuwe periode begint, elke 30, 60 of 90 dagen gerekend vanaf de aankoop. De zending wordt een paar dagen na de afschrijving verstuurd en je krijgt een e-mail met de verwachte leverdag.",
        "Je kunt je abonnement op elk moment pauzeren of opzeggen tot de dag vóór de volgende verlenging, zelf via Mijn account of door de klantenservice te mailen. Wil je het interval, het aantal of het product wijzigen, mail dan de klantenservice. Wijzigingen die later worden doorgegeven, gelden vanaf de volgende levering.",
        "Het abonnement loopt door tot je het opzegt. Geen minimale looptijd en geen opzegkosten.",
      ],
    },
    { type: "h2", text: "Herroepingsrecht" },
    {
      type: "p",
      text: `Als consument heb je een wettelijk herroepingsrecht van 14 dagen vanaf de dag dat je het product ontvangt – wij verlengen dat tot 30 dagen. Neem contact met ons op via {epost} of gebruik het Europese modelformulier voor herroeping. Het product moet ongebruikt en in de ongeopende originele verpakking worden teruggestuurd. Om hygiënische redenen en vanwege voedselveiligheid kunnen voedingssupplementen met een verbroken verzegeling niet worden geretourneerd.`,
    },
    { type: "h2", text: "Retour en terugbetaling" },
    {
      type: "ul",
      items: [
        "Laat het ons binnen 30 dagen na ontvangst weten en stuur het product binnen 14 dagen na je melding terug.",
        "Bij herroeping betaal je zelf de retourkosten (8,00 € wordt van de terugbetaling afgetrokken). Is het product defect of verkeerd geleverd, dan betalen wij de retourkosten.",
        "We betalen het aankoopbedrag inclusief de standaardverzendkosten die je hebt betaald terug binnen 14 dagen nadat we de retour of een bewijs van verzending hebben ontvangen.",
        "De terugbetaling gebeurt via de oorspronkelijke betaalmethode.",
        "Is het product minder waard geworden doordat je het meer hebt gebruikt dan nodig was om het te beoordelen, dan kunnen we een overeenkomstig bedrag inhouden.",
      ],
    },
    { type: "h2", text: "Reclamaties en defecte producten" },
    {
      type: "p",
      text: `Je hebt drie jaar reclamatierecht volgens de Zweedse consumentenkoopwet (konsumentköplagen). Mail naar {epost} met je ordernummer en een foto van het defect. Een goedgekeurde reclamatie lossen we op met een nieuw product of een terugbetaling, en wij betalen de retourkosten.`,
    },
    { type: "h2", text: "Productinformatie" },
    {
      type: "p",
      text: "Onze producten zijn voedingssupplementen en zijn niet bedoeld om ziekte te voorkomen, te behandelen of te genezen. Een voedingssupplement is geen vervanging voor een gevarieerde voeding en een gezonde levensstijl. Lees altijd het etiket, houd je aan de aanbevolen dagelijkse dosis en bewaar het product buiten het bereik van kinderen. Overleg met een arts als je zwanger bent, borstvoeding geeft of medicijnen gebruikt.",
    },
    { type: "h2", text: "Geschillen" },
    { type: "p", text: disputeText },
  ],
};

/* -------------------------------- Cookies -------------------------------- */

const cookies: LegalDoc = {
  slug: "cookies",
  title: "Cookiebeleid",
  updated,
  intro:
    "Cookies zijn kleine tekstbestanden die op je apparaat worden opgeslagen wanneer je metilde.com bezoekt. We gebruiken ze om de winkel te laten werken, om je keuzes te onthouden en om te begrijpen hoe de website wordt gebruikt.",
  metaTitle: "Cookiebeleid",
  metaDescription:
    "Welke cookies Metilde gebruikt, wat ze doen, hoe lang ze worden bewaard en hoe je je toestemming wijzigt of intrekt.",
  blocks: [
    { type: "h2", text: "Toestemming" },
    {
      type: "p",
      text: "Noodzakelijke cookies worden automatisch geplaatst, omdat de winkel niet werkt zonder deze cookies. Analyse- en marketingcookies worden pas geplaatst nadat je ze hebt geaccepteerd. Je kunt je toestemming op elk moment wijzigen of intrekken via de cookie-instellingen onderaan de pagina, of door de cookies in je browser te wissen.",
    },
    { type: "h2", text: "Cookies die we gebruiken" },
    { type: "h3", text: "Noodzakelijk" },
    {
      type: "table",
      head: ["Cookie", "Doel", "Bewaartermijn"],
      rows: [
        ["metilde_consent", "Slaat je cookiekeuzes op", "12 maanden"],
        ["sb-access-token", "Houdt je ingelogd op Mijn account", "1 uur"],
      ],
    },
    {
      type: "p",
      text: "De winkelwagen wordt opgeslagen in de lokale opslag van je browser (metilde_cart), niet in een cookie. We gebruiken geen aparte analysedienst; de bezoekersstatistieken worden zonder cookies op onze eigen server bijgehouden.",
    },
    { type: "h3", text: "Marketing (vereist toestemming)" },
    {
      type: "table",
      head: ["Cookie", "Doel", "Bewaartermijn"],
      rows: [
        ["_fbp", "Meet het effect van onze advertenties", "3 maanden"],
        ["_gcl_au", "Koppelt conversies aan Google Ads", "3 maanden"],
      ],
    },
    { type: "h2", text: "Derde partijen" },
    {
      type: "p",
      text: "Analyse- en marketingcookies worden geplaatst door Google en Meta als zelfstandige aanbieders. Zij verwerken gegevens volgens hun eigen beleid, en de cookies worden pas actief na je toestemming. De advertentietag van Google gebruikt de toestemmingsmodus (Consent Mode): zonder je toestemming plaatst de tag geen cookies en stuurt alleen anonieme signalen over paginaweergaven en aankopen, zonder persoonsgegevens zoals je e-mailadres. Google gebruikt die om de resultaten van advertenties te schatten.",
    },
    { type: "h2", text: "Cookies beheren in je browser" },
    {
      type: "p",
      text: "Je kunt cookies blokkeren of verwijderen in de instellingen van je browser. Let op: als je noodzakelijke cookies blokkeert, werken de winkelwagen, het afrekenen en het inloggen niet.",
    },
    { type: "p", text: `Vragen over cookies? Mail naar {epost}.` },
  ],
};

/* ---------------------------- Kwaliteit ---------------------------- */

const quality: LegalDoc = {
  slug: "kvalitetsgaranti",
  title: "Kwaliteit en etikettering",
  updated,
  intro: "Zo zijn onze capsules geëtiketteerd, en dit geldt als je niet tevreden bent.",
  metaTitle: "Kwaliteit en etikettering – inhoud, etiket en retouren",
  metaDescription:
    "De capsules van Metilde vermelden extractsterkte, dosering en batchnummer op het etiket en kunnen binnen 30 dagen ongeopend worden geretourneerd.",
  blocks: [
    { type: "h2", text: "Dit geldt voor al onze capsules" },
    {
      type: "ul",
      items: [
        "Veganistische capsule zonder vulstoffen.",
        "Extractsterkte, hoeveelheid per capsule en Latijnse naam staan op de pot.",
        "De capsules worden geleverd in een plastic pot. Metilde is een Zweeds merk; de grondstoffen komen uit de landen waar de planten van nature thuishoren.",
        "Batchnummer en houdbaarheidsdatum op elke pot.",
      ],
    },
    { type: "h2", text: "Traceerbaarheid" },
    {
      type: "p",
      text: "Elke pot heeft een batchnummer en een houdbaarheidsdatum (ten minste houdbaar tot). Vermeld het batchnummer als je contact met ons opneemt over een product, dan kunnen we nagaan uit welke productie het komt.",
    },
    { type: "h2", text: "Als je niet tevreden bent" },
    {
      type: "p",
      text: "Ongeopende producten kun je binnen 30 dagen retourneren volgens onze voorwaarden voor retouren en ruilen. Is een product defect of beschadigd, dan geldt het reclamatierecht, ook als de verpakking geopend is. Laat het ons weten als er iets niet klopt, dan bekijken we het samen.",
    },
    { type: "h2", text: "Regelgeving" },
    {
      type: "p",
      text: "Onze producten zijn voedingssupplementen en worden geëtiketteerd volgens de EU-regels voor voedingssupplementen. Voedingssupplementen zijn geen vervanging voor een gevarieerde voeding en een gezonde levensstijl en zijn niet bedoeld om ziekte vast te stellen, te behandelen of te genezen. Overleg met een arts als je zwanger bent, borstvoeding geeft of medicijnen gebruikt.",
    },
    ...helpBlock,
  ],
};

/* ---------------------------- Verzending & levering ---------------------------- */

const shipping: LegalDoc = {
  slug: "frakt-och-leverans",
  title: "Verzending & levering",
  updated,
  intro:
    "Bestellingen die op werkdagen vóór 12.00 uur (Zweedse tijd) binnenkomen, worden dezelfde dag ingepakt en verzonden vanuit ons magazijn in Zweden. Gratis verzending bij bestellingen boven 79 €.",
  metaTitle: "Verzending & levering – verzendkosten, levertijden en track & trace",
  metaDescription:
    "Verzendkosten en levertijden van Metilde naar Nederland, gratis verzending boven 79 €, track & trace, niet-afgehaalde zendingen en wat er geldt bij een beschadigde levering.",
  blocks: [
    { type: "h2", text: "Verwerkingstijd" },
    {
      type: "p",
      text: "We pakken bestellingen in op werkdagen. Bestellingen die vóór 12.00 uur (Zweedse tijd) binnenkomen, worden dezelfde dag verzonden, latere bestellingen de volgende werkdag. Tijdens acties en rond feestdagen kan het inpakken een dag langer duren.",
    },
    { type: "h2", text: "Verzendkosten en levertijden" },
    { type: "shippingTable" },
    {
      type: "p",
      text: "Alle prijzen zijn inclusief btw. We leveren aan adressen in Zweden, Finland, Denemarken en Nederland. Bestellingen naar Nederland gaan met PostNord als brief met track & trace vanuit ons magazijn in Timrå, Zweden; de levertijd is normaal 3–6 werkdagen. De verzendkosten zijn 8,00 €, en bij bestellingen boven 79 € is de verzending gratis. Abonnementen en bundels worden altijd gratis verzonden. Omdat de zending binnen de EU blijft, betaal je geen douanekosten of invoerheffingen.",
    },
    { type: "h2", text: "Je bestelling volgen" },
    {
      type: "p",
      text: "Je ontvangt een orderbevestiging zodra je bestelling is geplaatst, en een track & trace-link zodra de zending ons magazijn verlaat. Je kunt de levering ook volgen via Bestelling volgen.",
    },
    { type: "h2", text: "Niet-afgehaalde zendingen" },
    {
      type: "p",
      text: "Zendingen blijven 14 dagen klaarliggen op het afhaalpunt. Zendingen die niet worden afgehaald, komen terug naar ons en dan rekenen we de werkelijke verzendkosten heen en terug. Laat het ons liever weten als het je niet lukt om de zending op tijd op te halen – we helpen je graag.",
    },
    { type: "h2", text: "Beschadigde of ontbrekende leveringen" },
    {
      type: "ul",
      items: [
        "Meld zichtbare transportschade binnen 7 dagen na ontvangst, met foto's van de zending en de producten.",
        "Staat de zending in de track & trace als bezorgd maar heb je niets ontvangen? Vraag het eerst na bij je buren en het afhaalpunt en neem daarna binnen 14 dagen contact met ons op.",
        "We sturen een vervangende levering of betalen de bestelling terug zodra de zaak is bevestigd.",
      ],
    },
    ...helpBlock,
  ],
};

/* ----------------------------- Retouren & ruilen ---------------------------- */

const returns: LegalDoc = {
  slug: "returer-och-byten",
  title: "Retouren & ruilen",
  updated,
  intro:
    "Je hebt altijd 30 dagen herroepingsrecht – langer dan de wettelijke 14 dagen. Ongeopende producten in originele staat kun je retourneren of ruilen.",
  metaTitle: "Retouren & ruilen – 30 dagen herroepingsrecht",
  metaDescription:
    "Zo retourneer of ruil je een product bij Metilde: 30 dagen herroepingsrecht, retourkosten, terugbetaling binnen 14 dagen en drie jaar reclamatierecht.",
  blocks: [
    { type: "h2", text: "Je herroepingsrecht" },
    {
      type: "p",
      text: "Als consument in de EU heb je een wettelijk herroepingsrecht van 14 dagen vanaf de dag dat je je bestelling ontvangt. Wij verlengen dat tot 30 dagen. Het herroepingsrecht geldt voor producten die ongeopend zijn en in wezenlijk onveranderde staat – om hygiënische redenen en vanwege voedselveiligheid kunnen we geopende voedingssupplementen niet opnieuw verkopen.",
    },
    { type: "h2", text: "Zo retourneer je" },
    {
      type: "ul",
      items: [
        `Meld je retour door te mailen naar {epost} met je ordernummer en om welke producten het gaat. Je kunt ook het Europese modelformulier voor herroeping gebruiken.`,
        `Je ontvangt binnen één werkdag een retourlabel en instructies. Retouren stuur je naar {returadress}.`,
        "Verpak de producten in de originele verpakking of een vergelijkbare beschermende verpakking.",
        "Lever de zending in en bewaar het bewijs van verzending tot de terugbetaling is afgerond.",
      ],
    },
    { type: "h2", text: "Retourkosten en terugbetaling" },
    {
      type: "table",
      head: ["Situatie", "Retourkosten", "Terugbetaling"],
      rows: [
        ["Herroeping (spijt van aankoop)", "Voor jouw rekening, 8,00 € wordt van de terugbetaling afgetrokken", "De orderwaarde inclusief de oorspronkelijke standaardverzendkosten"],
        ["Verkeerd product verzonden", "Gratis, met een voorgefrankeerd label van ons", "Het volledige bedrag of een vervangend product"],
        ["Beschadigd of defect product", "Gratis, met een voorgefrankeerd label van ons", "Het volledige bedrag of een vervangend product"],
        ["Ruilen voor een ander product", "Voor jouw rekening zoals bij een retour (8,00 €), tenzij het product defect was", "Het verschil wordt in rekening gebracht of terugbetaald"],
      ],
    },
    {
      type: "p",
      text: "De terugbetaling gebeurt via dezelfde betaalmethode als bij de aankoop, binnen 14 dagen nadat we de retour hebben ontvangen en goedgekeurd, meestal binnen 2–5 bankdagen. We rekenen geen extra retourtoeslag bovenop de retourkosten in de tabel hierboven.",
    },
    { type: "h2", text: "Reclamaties" },
    {
      type: "p",
      text: "Je hebt drie jaar reclamatierecht voor defecte producten volgens de Zweedse consumentenkoopwet (konsumentköplagen). Meld het defect binnen een redelijke termijn nadat je het hebt ontdekt – binnen twee maanden geldt altijd als redelijk. Stuur foto's mee en het batchnummer dat op het etiket staat.",
    },
    { type: "h2", text: "Uitzonderingen" },
    {
      type: "ul",
      items: [
        "Geopende voedingssupplementen of producten met een verbroken verzegeling, om hygiënische redenen en vanwege voedselveiligheid.",
        "Producten waarvan de houdbaarheidsdatum is verstreken terwijl ze in jouw bezit waren.",
      ],
    },
    { type: "h2", text: "Geschillenbeslechting" },
    { type: "p", text: disputeText },
    ...helpBlock,
  ],
};

/* -------------------------------- Duurzaamheid ------------------------------ */

const sustainability: LegalDoc = {
  slug: "hallbarhet",
  title: "Duurzaamheid",
  updated,
  intro:
    "Minder maar betere producten, verpakkingen die gerecycled kunnen worden en een leveranciersketen die we kunnen uitleggen. Zo ziet het er vandaag uit – en hier werken we verder aan.",
  metaTitle: "Duurzaamheid – verpakkingen, verzending en grondstoffen",
  metaDescription:
    "Zo werkt Metilde aan duurzaamheid: recyclebare verpakkingen, gebundelde verzending vanuit één magazijn in Zweden en gedocumenteerde grondstoffen.",
  blocks: [
    { type: "h2", text: "Hoe we erover denken" },
    {
      type: "p",
      text: "De grootste voetafdruk van een merk voor voedingssupplementen zit in grondstoffen, verpakkingen en transport. Daar werken we aan, in die volgorde, en we vertellen liever eerlijk waar we staan dan dat we beweringen doen die we niet kunnen onderbouwen.",
    },
    { type: "h2", text: "Verpakkingen" },
    {
      type: "ul",
      items: [
        "De buitendoos en het opvulmateriaal zijn gemaakt van gerecycled papier en gaan bij het oud papier.",
        "De capsules worden geleverd in plastic potten met schroefdeksel die beschermen tegen vocht en licht. De pot hoort bij het plastic verpakkingsafval.",
        "Geen plastic folie om de buitenverpakking en geen bedrukte papieren bijlagen waar je niet om hebt gevraagd.",
      ],
    },
    { type: "h2", text: "Verzending" },
    {
      type: "p",
      text: "We verzenden vanuit één magazijn in Zweden, bij voorkeur als brief en naar afhaalpunten, omdat gebundelde routes minder kilometers per zending betekenen. Abonnementen kunnen worden samengevoegd tot één levering, zodat meerdere producten samen reizen.",
    },
    { type: "h2", text: "Grondstoffen en maatschappelijke verantwoordelijkheid" },
    {
      type: "ul",
      items: [
        "Leveranciers moeten de herkomst documenteren en zich houden aan de geldende arbeids- en milieuwetgeving.",
        "We kopen grondstoffen van telers met gedocumenteerde oogstroutines.",
        "Botanische grondstoffen die alleen buiten Europa groeien, kopen we in zo groot mogelijke partijen om het aantal transporten te beperken.",
      ],
    },
    { type: "h2", text: "Wat we nog niet hebben opgelost" },
    {
      type: "ul",
      items: [
        "We publiceren nog geen volledige klimaatberekening per product.",
        "Sommige botanische grondstoffen kunnen alleen buiten Europa worden geteeld, wat lange transporten betekent.",
      ],
    },
    {
      type: "p",
      text: `Heb je een vraag of een suggestie over ons duurzaamheidswerk? Schrijf naar {epost} – we lezen alles.`,
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
