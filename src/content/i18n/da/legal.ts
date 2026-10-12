/**
 * Juridiskt innehåll och informationssidor på danska (da-DK), lokaliserat för Danmark.
 * Samma nycklar och blockstruktur som src/content/legal.ts. `slug` är det interna id:t (svenskt).
 * Platshållare som {epost} och {företag} fylls i när sidan visas (lib/page-text).
 */
import type { LegalBlock, LegalDoc } from "@/content/legal";

const updated = "Senest opdateret: 12. oktober 2026";

const contactBlock: LegalBlock[] = [
  { type: "h2", text: "Kontakt- og virksomhedsoplysninger" },
  { type: "companyInfo" },
];

const helpBlock: LegalBlock[] = [
  { type: "h2", text: "Brug for hjælp?" },
  {
    type: "p",
    text: `Skriv til {epost} eller ring på {telefon} ({öppettider}). Oplys altid dit ordrenummer, så kan vi hjælpe dig hurtigere. Kundeservice svarer på svensk og engelsk.`,
  },
];

const disputeText =
  "Hvis vi ikke kan blive enige, kan du klage til Nævnenes Hus (Forbrugerklagenævnet), naevneneshus.dk. Vi følger nævnets afgørelser. Aftalen er underlagt svensk ret. Det begrænser ikke de ufravigelige rettigheder, du har som forbruger efter dansk lovgivning.";

/* ------------------------------ Privatliv ------------------------------ */

const privacy: LegalDoc = {
  slug: "integritetspolicy",
  title: "Privatlivspolitik",
  updated,
  intro:
    "Denne politik forklarer, hvilke personoplysninger Metilde indsamler, når du besøger metilde.com, handler eller administrerer et abonnement, hvorfor vi behandler dem, hvor længe vi gemmer dem, og hvilke rettigheder du har efter GDPR.",
  metaTitle: "Privatlivspolitik",
  metaDescription:
    "Sådan indsamler, bruger, deler og beskytter Metilde dine personoplysninger, hvor længe vi gemmer dem, og hvordan du bruger dine rettigheder efter GDPR.",
  blocks: [
    ...contactBlock,
    {
      type: "p",
      text: `{företag} er dataansvarlig for den behandling, der beskrives her. Kontakt os på {epost}, hvis du har spørgsmål eller vil bruge dine rettigheder.`,
    },
    { type: "h2", text: "Oplysninger, vi indsamler" },
    {
      type: "ul",
      items: [
        "Ordreoplysninger: navn, leverings- og faktureringsadresse, e-mail, telefonnummer, ordrens indhold, ordrehistorik og returneringer.",
        "Kontooplysninger: e-mailadresse og abonnementsindstillinger. Du logger ind med en engangskode, der sendes til din e-mail, så vi gemmer ingen adgangskode.",
        "Betalingsoplysninger: betalingsmåde, transaktions-id og betalingsstatus. Fulde kortnumre gemmes aldrig hos os, men håndteres af vores betalingsudbyder.",
        "Supportoplysninger: beskeder, sager og vedhæftede filer, du sender til kundeservice.",
        "Markedsføringsoplysninger: e-mailadresse og status for samtykke, hvis du abonnerer på nyhedsbrevet.",
        "Kurvoplysninger: e-mailadresse og indholdet af kurven, når du er gået i gang med et køb i kassen, så vi kan gemme kurven og minde dig om den på e-mail (højst fire gange over ti dage). Hver påmindelse har et link, så du kan framelde dig flere.",
        "Tekniske oplysninger: IP-adresse, enheds- og browsertype, besøgte sider og interaktioner, indsamlet via cookies og lignende teknologier.",
      ],
    },
    { type: "h2", text: "Formål og retsgrundlag" },
    {
      type: "table",
      head: ["Formål", "Retsgrundlag", "Opbevaringsperiode"],
      rows: [
        ["Behandle og levere din ordre, håndtere returneringer og tilbagebetalinger", "Opfyldelse af aftale", "Mens ordren behandles samt i reklamationsperioden"],
        ["Administrere din konto og dine abonnementer", "Opfyldelse af aftale", "Indtil du sletter din konto"],
        ["Bogføring og skatteforpligtelser", "Retlig forpligtelse (den svenske bogføringslov)", "7 år"],
        ["Kundeservice og reklamationer", "Legitim interesse", "36 måneder efter afsluttet sag"],
        ["Nyhedsbrev og markedsføring", "Samtykke", "Indtil du trækker samtykket tilbage"],
        ["Analyse og forbedring af websitet", "Samtykke (ikke-nødvendige cookies)", "Op til 24 måneder"],
        ["Forebyggelse af svindel og IT-sikkerhed", "Legitim interesse", "12 måneder"],
      ],
    },
    { type: "h2", text: "Hvem vi deler oplysninger med" },
    {
      type: "p",
      text: "Vi sælger aldrig dine personoplysninger. Vi deler dem kun med databehandlere, der hjælper os med at drive butikken, og kun i det omfang, det er nødvendigt:",
    },
    {
      type: "ul",
      items: [
        "Betalingsudbydere, til betaling og kontrol af svindel.",
        "Logistikpartnere og fragtfirmaer, til levering og returnering.",
        "Udbydere af drift, database og e-mail, til at drive websitet og sende ordrerelaterede e-mails.",
        "Betaling via Stripe (kort, Klarna, Apple Pay, Google Pay, MobilePay), lager og fragt via MittLogistik og PostNord, e-mail via Resend, drift og database via Vercel og Supabase.",
        "Meta (Facebook, Instagram), Google Ads og Microsoft Advertising, til at måle vores annoncer. Med dit samtykke til markedsføringscookies modtager de oplysninger om dit besøg og køb samt din e-mail i hashet form for at koble købet til en annonce. Uden samtykke sender Googles tag kun anonyme signaler uden cookies.",
        "AddRevenue, når du er kommet til os via et affiliatelink: ordrenummer og ordreværdi, så vi kan udbetale provision til den, der linkede.",
        "Myndigheder, når vi efter loven er forpligtet til at udlevere oplysninger.",
      ],
    },
    {
      type: "p",
      text: "Alle databehandlere er omfattet af databehandleraftaler. Når overførsel uden for EU/EØS er nødvendig, er den beskyttet af EU-Kommissionens standardkontraktbestemmelser sammen med supplerende sikkerhedsforanstaltninger.",
    },
    { type: "h2", text: "Dine rettigheder" },
    {
      type: "ul",
      items: [
        "Indsigt – anmode om en oversigt over de oplysninger, vi har om dig.",
        "Berigtigelse – få forkerte oplysninger rettet.",
        "Sletning – få dine oplysninger slettet, når vi ikke længere har brug for dem.",
        "Begrænsning og indsigelse – begrænse eller gøre indsigelse mod bestemt behandling, herunder direkte markedsføring.",
        "Dataportabilitet – få dine oplysninger i et maskinlæsbart format.",
        "Tilbagetrækning af samtykke – når som helst, uden at det påvirker behandling, der allerede har fundet sted.",
      ],
    },
    {
      type: "p",
      text: `Skriv til {epost} for at bruge en rettighed. Vi svarer inden for 30 dage. Er du utilfreds med, hvordan vi behandler dine oplysninger, kan du klage til Datatilsynet i Danmark, datatilsynet.dk, eller til vores tilsynsmyndighed i Sverige, Integritetsskyddsmyndigheten (IMY), imy.se.`,
    },
    { type: "h2", text: "Sikkerhed" },
    {
      type: "p",
      text: "Websitet leveres over TLS, login sker med engangskoder, adgangen til personoplysninger er begrænset til medarbejdere, der har brug for den, og vores systemer er beskyttet af logning og rollebaserede adgangsrettigheder.",
    },
    { type: "h2", text: "Børn" },
    { type: "p", text: "Butikken henvender sig ikke til børn. Du skal være 18 år eller ældre for at handle eller oprette en konto." },
    { type: "h2", text: "Ændringer i politikken" },
    {
      type: "p",
      text: "Vi kan opdatere politikken, når vores tjenester eller lovkrav ændrer sig. Datoen ovenfor viser altid den gældende version, og væsentlige ændringer meddeles registrerede kunder på e-mail.",
    },
  ],
};

/* ------------------------------- Handelsbetingelser ------------------------------- */

const terms: LegalDoc = {
  slug: "kopvillkor",
  title: "Handelsbetingelser",
  updated,
  intro:
    "Betingelserne gælder for alle bestillinger, som forbrugere afgiver på metilde.com. De omfatter priser, betaling, levering, abonnementer, fortrydelsesret, returnering, tilbagebetaling og reklamation.",
  metaTitle: "Handelsbetingelser",
  metaDescription:
    "Metildes handelsbetingelser: priser og betaling, leveringstider og fragtpriser, abonnementer, fortrydelsesret, returnering, tilbagebetaling og reklamation.",
  blocks: [
    ...contactBlock,
    { type: "h2", text: "Bestilling og aftale" },
    {
      type: "p",
      text: "En bindende aftale indgås, når vi bekræfter din ordre på e-mail. Du skal være mindst 18 år for at handle. Hvis en vare er udsolgt, eller en pris er åbenlyst forkert, kan vi annullere ordren og tilbagebetale et eventuelt trukket beløb. Al kommunikation foregår på svensk eller engelsk.",
    },
    { type: "h2", text: "Priser, moms og betaling" },
    {
      type: "ul",
      items: [
        "Alle priser vises i danske kroner (DKK) og er inklusive moms. Den samlede pris inklusive fragt vises, før du bekræfter ordren.",
        "Vi accepterer følgende betalingsmåder: Klarna, Visa, Mastercard, American Express, Apple Pay, Google Pay og MobilePay. MobilePay kan ikke bruges til abonnementer.",
        "Ved enkeltkøb trækkes betalingen, når ordren afgives.",
        "Vi leverer til adresser i Sverige, Finland og Danmark. Ordrer til Danmark sendes inden for EU, så der kommer aldrig told eller importafgifter oveni.",
      ],
    },
    { type: "h2", text: "Levering" },
    { type: "shippingTable" },
    {
      type: "p",
      text: "Ordrer, der afgives før kl. 12.00 (svensk tid) på en hverdag, sendes normalt samme dag fra vores lager i Timrå i Sverige. Ordrer til Danmark sendes med PostNord som sporbart brev, og leveringstiden er normalt 2–5 hverdage. Du får et sporingslink på e-mail, så snart forsendelsen forlader os. For forsendelser, der ikke bliver afhentet, opkræves de faktiske omkostninger til fragt frem og tilbage.",
    },
    { type: "h2", text: "Abonnement" },
    {
      type: "ul",
      items: [
        "Et abonnement giver 15 % rabat på den normale pris og leveres med det interval, du vælger.",
        "Første levering betales med det samme ved købet. Derefter trækkes betalingen automatisk, når en ny periode begynder, hver 30., 60. eller 90. dag regnet fra købet. Forsendelsen sendes nogle dage efter betalingen, og du får en e-mail med forventet leveringsdag.",
        "Du kan sætte abonnementet på pause eller opsige det når som helst frem til dagen før næste fornyelse, selv under Min konto eller ved at skrive til kundeservice. Vil du ændre interval, antal eller produkt, skriver du til kundeservice. Ændringer, der foretages senere, gælder fra næste levering.",
        "Abonnementet løber, indtil du opsiger det. Ingen bindingsperiode og intet gebyr for at opsige.",
      ],
    },
    { type: "h2", text: "Fortrydelsesret" },
    {
      type: "p",
      text: `Som forbruger har du 14 dages lovbestemt fortrydelsesret fra den dag, du modtager varen – vi forlænger den til 30 dage. Kontakt os på {epost} eller brug EU's standardfortrydelsesformular. Varen skal returneres ubrugt og i ubrudt originalemballage. Af hygiejne- og fødevarehensyn kan kosttilskud med brudt forsegling ikke returneres.`,
    },
    { type: "h2", text: "Returnering og tilbagebetaling" },
    {
      type: "ul",
      items: [
        "Giv os besked inden for 30 dage fra modtagelsen, og send varen tilbage inden for 14 dage fra din besked.",
        "Ved fortrudt køb betaler du returfragten (59 kr. trækkes fra tilbagebetalingen). Er varen defekt eller forkert leveret, betaler vi returfragten.",
        "Vi tilbagebetaler købesummen inklusive den standardfragt, du har betalt, inden for 14 dage fra vi har modtaget returneringen eller dokumentation for, at den er sendt.",
        "Tilbagebetalingen sker til den oprindelige betalingsmåde.",
        "Er varens værdi forringet på grund af anden håndtering, end hvad der var nødvendigt for at vurdere den, kan vi foretage et tilsvarende fradrag.",
      ],
    },
    { type: "h2", text: "Reklamation og defekte varer" },
    {
      type: "p",
      text: `Du har tre års reklamationsret efter den svenske forbrugerkøbslov (konsumentköplagen). Kontakt {epost} med ordrenummer og et billede af fejlen. En godkendt reklamation afhjælpes med en ny vare eller tilbagebetaling, og vi betaler returfragten.`,
    },
    { type: "h2", text: "Produktinformation" },
    {
      type: "p",
      text: "Vores produkter er kosttilskud og er ikke beregnet til at forebygge, behandle eller helbrede sygdom. Kosttilskud bør ikke erstatte en varieret kost og en sund livsstil. Læs altid etiketten, følg den anbefalede daglige dosis, og opbevar produktet utilgængeligt for børn. Tal med en læge, hvis du er gravid, ammer eller tager medicin.",
    },
    { type: "h2", text: "Tvister" },
    { type: "p", text: disputeText },
  ],
};

/* -------------------------------- Cookies -------------------------------- */

const cookies: LegalDoc = {
  slug: "cookies",
  title: "Cookiepolitik",
  updated,
  intro:
    "Cookies er små tekstfiler, der gemmes på din enhed, når du besøger metilde.com. Vi bruger dem, for at butikken kan fungere, for at huske dine valg og for at forstå, hvordan websitet bruges.",
  metaTitle: "Cookiepolitik",
  metaDescription:
    "Hvilke cookies Metilde bruger, hvad de gør, hvor længe de gemmes, og hvordan du ændrer eller trækker dit samtykke tilbage.",
  blocks: [
    { type: "h2", text: "Samtykke" },
    {
      type: "p",
      text: "Nødvendige cookies sættes automatisk, fordi butikken ikke fungerer uden dem. Analyse- og markedsføringscookies sættes først, når du har accepteret dem. Du kan ændre eller trække dit samtykke tilbage når som helst via cookieindstillingerne nederst på siden eller ved at slette cookies i din browser.",
    },
    { type: "h2", text: "Cookies, vi bruger" },
    { type: "h3", text: "Nødvendige" },
    {
      type: "table",
      head: ["Cookie", "Formål", "Opbevaringsperiode"],
      rows: [
        ["metilde_consent", "Gemmer dine cookievalg", "12 måneder"],
        ["sb-access-token", "Holder dig logget ind på Min konto", "1 time"],
      ],
    },
    {
      type: "p",
      text: "Kurven gemmes i browserens lokale lager (metilde_cart), ikke i en cookie. Vi bruger ikke en separat analysetjeneste; besøgsstatistikken opgøres på vores egen server uden cookies.",
    },
    { type: "h3", text: "Markedsføring (kræver samtykke)" },
    {
      type: "table",
      head: ["Cookie", "Formål", "Opbevaringsperiode"],
      rows: [
        ["_fbp", "Måler effekten af vores annoncer", "3 måneder"],
        ["_gcl_au", "Tilskriver konverteringer fra Google Ads", "3 måneder"],
        ["_uetsid, _uetvid, MUID", "Tilskriver konverteringer fra Microsoft Advertising (Bing)", "1 dag – 13 måneder"],
      ],
    },
    { type: "h2", text: "Tredjeparter" },
    {
      type: "p",
      text: "Analyse- og markedsføringscookies sættes af Google, Microsoft og Meta som selvstændige udbydere. De behandler oplysninger efter deres egne politikker og aktiveres først efter dit samtykke. Googles annoncetag bruger samtykketilstand (Consent Mode): uden dit samtykke sætter den ingen cookies og sender kun anonyme signaler om sidevisninger og køb uden personoplysninger som e-mail, som Google bruger til at anslå annoncernes resultater.",
    },
    { type: "h2", text: "Administrer cookies i browseren" },
    {
      type: "p",
      text: "Du kan blokere eller slette cookies i browserens indstillinger. Bemærk, at hvis du blokerer nødvendige cookies, fungerer kurv, kasse og login ikke.",
    },
    { type: "p", text: `Spørgsmål om cookies? Skriv til {epost}.` },
  ],
};

/* ---------------------------- Kvalitet ---------------------------- */

const quality: LegalDoc = {
  slug: "kvalitetsgaranti",
  title: "Kvalitet og mærkning",
  updated,
  intro: "Sådan er vores kapsler mærket, og det gælder, hvis du ikke er tilfreds.",
  metaTitle: "Kvalitet og mærkning – indhold, mærkning og returnering",
  metaDescription:
    "Metildes kapsler er mærket med ekstraktstyrke, dosis og batchnummer og kan returneres uåbnede inden for 30 dage.",
  blocks: [
    { type: "h2", text: "Det gælder for alle vores kapsler" },
    {
      type: "ul",
      items: [
        "Vegansk kapsel uden fyldstoffer.",
        "Ekstraktstyrke, mængde pr. kapsel og latinsk navn står på dåsen.",
        "Kapslerne leveres i en plastdåse. Metilde er et svensk varemærke; råvarerne kommer fra de lande, hvor planterne hører hjemme.",
        "Batchnummer og bedst før-dato på hver dåse.",
      ],
    },
    { type: "h2", text: "Sporbarhed" },
    {
      type: "p",
      text: "Hver dåse har et batchnummer og en bedst før-dato. Oplys batchnummeret, hvis du kontakter os om et produkt, så kan vi spore, hvilken produktion det kommer fra.",
    },
    { type: "h2", text: "Hvis du ikke er tilfreds" },
    {
      type: "p",
      text: "Uåbnede produkter kan returneres inden for 30 dage efter vores betingelser for returnering og ombytning. Er et produkt defekt eller beskadiget, gælder reklamationsretten, også selvom emballagen er åbnet. Kontakt os, hvis noget ikke virker rigtigt, så gennemgår vi det sammen.",
    },
    { type: "h2", text: "Regler" },
    {
      type: "p",
      text: "Vores produkter er kosttilskud og er mærket efter EU's regler for kosttilskud. Kosttilskud erstatter ikke en varieret kost og en sund livsstil og er ikke beregnet til at diagnosticere, behandle eller helbrede sygdom. Tal med en læge, hvis du er gravid, ammer eller tager medicin.",
    },
    ...helpBlock,
  ],
};

/* ---------------------------- Fragt & levering ---------------------------- */

const shipping: LegalDoc = {
  slug: "frakt-och-leverans",
  title: "Fragt & levering",
  updated,
  intro:
    "Bestillinger, der afgives før kl. 12.00 (svensk tid) på hverdage, pakkes og sendes samme dag fra vores lager i Sverige. Fri fragt på alle ordrer over 469 kr.",
  metaTitle: "Fragt & levering – fragtpriser, leveringstider og sporing",
  metaDescription:
    "Metildes fragtpriser og leveringstider til Danmark, fri fragt over 469 kr., sporing, forsendelser der ikke afhentes, og hvad der gælder ved beskadiget levering.",
  blocks: [
    { type: "h2", text: "Ekspeditionstid" },
    {
      type: "p",
      text: "Vi pakker ordrer på hverdage. Bestillinger, der kommer ind før kl. 12.00 (svensk tid), sendes samme dag, senere ordrer næste hverdag. I kampagneperioder og omkring helligdage kan pakningen tage en dag ekstra.",
    },
    { type: "h2", text: "Fragtpriser og leveringstider" },
    { type: "shippingTable" },
    {
      type: "p",
      text: "Alle priser er inklusive moms. Vi leverer til adresser i Sverige, Finland og Danmark. Ordrer til Danmark sendes med PostNord som sporbart brev fra vores lager i Timrå i Sverige, og leveringstiden er normalt 2–5 hverdage. Fragten koster 46 kr., og der er fri fragt på ordrer over 469 kr. Abonnementer og pakker sendes altid gratis. Da forsendelsen sker inden for EU, kommer der ingen told eller importafgifter.",
    },
    { type: "h2", text: "Spor din ordre" },
    {
      type: "p",
      text: "Du får en ordrebekræftelse, når bestillingen er afgivet, og et sporingslink, når forsendelsen forlader vores lager. Du kan også følge leveringen under Spor ordre.",
    },
    { type: "h2", text: "Forsendelser, der ikke afhentes" },
    {
      type: "p",
      text: "Forsendelser ligger klar på udleveringsstedet i 14 dage. Forsendelser, der ikke bliver afhentet, sendes tilbage til os, og vi opkræver de faktiske omkostninger til fragt frem og tilbage. Kontakt os hellere, hvis du ikke når at hente den i tide – vi hjælper gerne.",
    },
    { type: "h2", text: "Beskadigede eller manglende leveringer" },
    {
      type: "ul",
      items: [
        "Anmeld synlig transportskade inden for 7 dage fra modtagelsen med fotos af forsendelsen og produkterne.",
        "Hvis sporingen viser leveret, men forsendelsen mangler – spørg først naboer og udleveringssted, og kontakt os derefter inden for 14 dage.",
        "Vi sender en erstatningslevering eller tilbagebetaler ordren, så snart sagen er bekræftet.",
      ],
    },
    ...helpBlock,
  ],
};

/* ----------------------------- Returnering & ombytning ---------------------------- */

const returns: LegalDoc = {
  slug: "returer-och-byten",
  title: "Returnering & ombytning",
  updated,
  intro:
    "Du har altid 30 dages fortrydelsesret – længere end lovens 14 dage. Uåbnede produkter i original stand kan returneres eller byttes.",
  metaTitle: "Returnering & ombytning – 30 dages fortrydelsesret",
  metaDescription:
    "Sådan returnerer eller bytter du et produkt hos Metilde: 30 dages fortrydelsesret, returfragt, tilbagebetaling inden for 14 dage og tre års reklamationsret.",
  blocks: [
    { type: "h2", text: "Din fortrydelsesret" },
    {
      type: "p",
      text: "Som forbruger i EU har du 14 dages lovbestemt fortrydelsesret fra den dag, du modtager din ordre. Vi forlænger den til 30 dage. Fortrydelsesretten gælder produkter, der er uåbnede og i det væsentlige i uændret stand – af hygiejne- og fødevarehensyn kan vi ikke sælge åbnede kosttilskud videre.",
    },
    { type: "h2", text: "Sådan returnerer du" },
    {
      type: "ul",
      items: [
        `Anmeld returneringen ved at skrive til {epost} med ordrenummer og hvilke varer, det drejer sig om. Du kan også bruge EU's standardfortrydelsesformular.`,
        `Du får returlabel og instruktioner inden for en hverdag. Returneringer sendes til {returadress}.`,
        "Pak produkterne i originalemballagen eller tilsvarende beskyttende emballage.",
        "Indlever forsendelsen, og gem kvitteringen, indtil tilbagebetalingen er gennemført.",
      ],
    },
    { type: "h2", text: "Returfragt og tilbagebetaling" },
    {
      type: "table",
      head: ["Situation", "Returfragt", "Tilbagebetaling"],
      rows: [
        ["Fortrudt køb", "Betales af dig, 59 kr. trækkes fra tilbagebetalingen", "Ordreværdien inklusive oprindelig standardfragt"],
        ["Forkert vare sendt", "Gratis, forudbetalt label fra os", "Hele beløbet eller en erstatningsvare"],
        ["Beskadiget eller defekt produkt", "Gratis, forudbetalt label fra os", "Hele beløbet eller en erstatningsvare"],
        ["Ombytning til et andet produkt", "Betales af dig som ved returnering (59 kr.), medmindre varen var defekt", "Difference opkræves eller tilbagebetales"],
      ],
    },
    {
      type: "p",
      text: "Tilbagebetalingen sker med samme betalingsmåde som ved købet inden for 14 dage fra vi har modtaget og godkendt returneringen, normalt inden for 2–5 bankdage. Vi opkræver intet returgebyr ud over returfragten i tabellen ovenfor.",
    },
    { type: "h2", text: "Reklamation" },
    {
      type: "p",
      text: "Du har tre års reklamationsret for defekte varer efter den svenske forbrugerkøbslov (konsumentköplagen). Anmeld fejlen inden for rimelig tid, efter du har opdaget den – inden for to måneder er altid rimelig tid. Vedhæft fotos og batchnummeret, der står på etiketten.",
    },
    { type: "h2", text: "Undtagelser" },
    {
      type: "ul",
      items: [
        "Åbnede kosttilskud eller produkter med brudt forsegling, af hygiejne- og fødevarehensyn.",
        "Produkter, hvis bedst før-dato er overskredet, mens de har været i din besiddelse.",
      ],
    },
    { type: "h2", text: "Tvistløsning" },
    { type: "p", text: disputeText },
    ...helpBlock,
  ],
};

/* -------------------------------- Bæredygtighed ------------------------------ */

const sustainability: LegalDoc = {
  slug: "hallbarhet",
  title: "Bæredygtighed",
  updated,
  intro:
    "Færre, men bedre produkter, emballage der kan genanvendes, og en leverandørkæde, vi kan forklare. Sådan ser det ud i dag – og det arbejder vi videre med.",
  metaTitle: "Bæredygtighed – emballage, fragt og råvarer",
  metaDescription:
    "Sådan arbejder Metilde med bæredygtighed: genanvendelig emballage, samlet fragt fra ét lager i Sverige og dokumenterede råvarer.",
  blocks: [
    { type: "h2", text: "Sådan tænker vi" },
    {
      type: "p",
      text: "Et kosttilskudsmærkes største aftryk ligger i råvarer, emballage og transport. Vi arbejder med de tre, i den rækkefølge, og fortæller hellere ærligt, hvor vi står, end vi kommer med påstande, vi ikke kan dokumentere.",
    },
    { type: "h2", text: "Emballage" },
    {
      type: "ul",
      items: [
        "Yderkartonen og fyldmaterialet er lavet af genbrugspapir og sorteres som papir.",
        "Kapslerne leveres i plastdåser med skruelåg, der beskytter mod fugt og lys. Dåsen sorteres som plastemballage.",
        "Ingen plastfilm om yderemballagen og ingen trykte papirindlæg, du ikke har bedt om.",
      ],
    },
    { type: "h2", text: "Fragt" },
    {
      type: "p",
      text: "Vi sender fra ét enkelt lager i Sverige, primært som brev og til udleveringssteder, fordi samlede ruter betyder færre kilometer pr. forsendelse. Abonnementer kan slås sammen til én levering, så flere produkter rejser sammen.",
    },
    { type: "h2", text: "Råvarer og socialt ansvar" },
    {
      type: "ul",
      items: [
        "Leverandører skal dokumentere oprindelse og følge gældende arbejds- og miljølovgivning.",
        "Vi køber råvarer fra dyrkere med dokumenterede høstrutiner.",
        "Botaniske råvarer, der kun vokser uden for Europa, købes i så store partier som muligt for at begrænse antallet af transporter.",
      ],
    },
    { type: "h2", text: "Det, vi ikke har løst endnu" },
    {
      type: "ul",
      items: [
        "Vi offentliggør endnu ikke en fuld klimaberegning pr. produkt.",
        "Visse botaniske råvarer kan kun dyrkes uden for Europa, hvilket betyder lange transporter.",
      ],
    },
    {
      type: "p",
      text: `Har du et spørgsmål eller et forslag til vores arbejde med bæredygtighed? Skriv til {epost} – vi læser alt.`,
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
