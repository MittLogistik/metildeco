/**
 * Juridiskt innehåll och informationssidor (svenska).
 *
 * Innehållet är skrivet för att uppfylla kraven i Google Merchant Center:
 * tydliga kontakt- och företagsuppgifter, betalning, leverans, retur och
 * återbetalning samt hantering av personuppgifter. Uppgifter om frakt
 * hämtas från databasen (blocktypen "shippingTable") så att villkor,
 * fraktsida och kassa alltid visar samma siffror.
 */
import { company } from "@/lib/site";

export type LegalBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "table"; head: string[]; rows: string[][] }
  | { type: "shippingTable" };

export type LegalDoc = {
  slug: string;
  title: string;
  intro: string;
  updated: string;
  metaTitle: string;
  metaDescription: string;
  blocks: LegalBlock[];
};

const updated = "Senast uppdaterad: 17 september 2026";

const contactBlock: LegalBlock[] = [
  { type: "h2", text: "Kontakt- och företagsuppgifter" },
  {
    type: "ul",
    items: [
      `Juridisk enhet: ${company.legalName}`,
      `Organisationsnummer: ${company.orgNumber}`,
      `Adress: ${company.address}`,
      `E-post: ${company.email}`,
      `Telefon: ${company.phone} (${company.hours})`,
    ],
  },
];

const helpBlock: LegalBlock[] = [
  { type: "h2", text: "Behöver du hjälp?" },
  {
    type: "p",
    text: `Mejla ${company.email} eller ring ${company.phone} (${company.hours}). Ange alltid ditt ordernummer så hjälper vi dig snabbare.`,
  },
];

/* ------------------------------ Integritet ------------------------------ */

const privacy: LegalDoc = {
  slug: "integritetspolicy",
  title: "Integritetspolicy",
  updated,
  intro:
    "Den här policyn förklarar vilka personuppgifter Metilde samlar in när du besöker metilde.com, handlar eller hanterar en prenumeration, varför vi behandlar dem, hur länge vi sparar dem och vilka rättigheter du har enligt GDPR.",
  metaTitle: "Integritetspolicy",
  metaDescription:
    "Så samlar Metilde in, använder, delar och skyddar dina personuppgifter, hur länge vi sparar dem och hur du använder dina rättigheter enligt GDPR.",
  blocks: [
    ...contactBlock,
    {
      type: "p",
      text: `${company.legalName} är personuppgiftsansvarig för behandlingen som beskrivs här. Kontakta oss på ${company.email} om du har frågor eller vill använda dina rättigheter.`,
    },
    { type: "h2", text: "Uppgifter vi samlar in" },
    {
      type: "ul",
      items: [
        "Orderuppgifter: namn, leverans- och fakturaadress, e-post, telefonnummer, orderinnehåll, orderhistorik och returer.",
        "Kontouppgifter: e-postadress och prenumerationsinställningar. Du loggar in med en engångskod som skickas till din e-post, så vi lagrar inget lösenord.",
        "Betaluppgifter: betalsätt, transaktions-ID och betalstatus. Fullständiga kortnummer lagras aldrig av oss utan hanteras av vår betalleverantör.",
        "Supportuppgifter: meddelanden, ärenden och bilagor du skickar till kundservice.",
        "Marknadsföringsuppgifter: e-postadress och samtyckesstatus om du prenumererar på nyhetsbrevet.",
        "Varukorgsuppgifter: e-postadress och innehållet i varukorgen när du påbörjat ett köp i kassan, så att vi kan spara korgen och påminna dig per e-post (högst fyra gånger under tio dagar). Varje påminnelse har en länk för att avsäga sig fler.",
        "Tekniska uppgifter: IP-adress, enhets- och webbläsartyp, besökta sidor och interaktioner, insamlade via cookies och liknande tekniker.",
      ],
    },
    { type: "h2", text: "Ändamål och rättslig grund" },
    {
      type: "table",
      head: ["Ändamål", "Rättslig grund", "Lagringstid"],
      rows: [
        ["Behandla och leverera din order, hantera returer och återbetalningar", "Fullgörande av avtal", "Under orderns gång samt reklamationstiden"],
        ["Hantera ditt konto och dina prenumerationer", "Fullgörande av avtal", "Tills du raderar ditt konto"],
        ["Bokföring och skatteskyldigheter", "Rättslig förpliktelse (bokföringslagen)", "7 år"],
        ["Kundservice och reklamationer", "Berättigat intresse", "36 månader efter avslutat ärende"],
        ["Nyhetsbrev och marknadsföring", "Samtycke", "Tills du återkallar samtycket"],
        ["Analys och förbättring av sajten", "Samtycke (icke nödvändiga cookies)", "Upp till 24 månader"],
        ["Bedrägeriprevention och IT-säkerhet", "Berättigat intresse", "12 månader"],
      ],
    },
    { type: "h2", text: "Vilka vi delar uppgifter med" },
    {
      type: "p",
      text: "Vi säljer aldrig dina personuppgifter. Vi delar dem endast med biträden som hjälper oss driva butiken, och bara i den omfattning som krävs:",
    },
    {
      type: "ul",
      items: [
        "Betalleverantörer, för betalning och bedrägerikontroll.",
        "Logistikpartners och fraktbolag, för leverans och returer.",
        "Leverantörer av drift, databas och e-post, för att driva sajten och skicka orderrelaterad e-post.",
        "Betalning via Stripe (kort, Klarna, Apple Pay, Google Pay), lager och frakt via MittLogistik och PostNord, e-post via Resend, drift och databas via Vercel och Supabase.",
        "Meta (Facebook, Instagram) och Google Ads, för att mäta våra annonser. Med ditt samtycke till marknadsföringscookies får de uppgifter om ditt besök och köp, och e-post i hashad form för att koppla köpet till en annons. Utan samtycke skickar Googles tagg bara anonyma signaler utan cookies.",
        "AddRevenue, när du kommit till oss via en affiliatelänk: ordernummer och ordervärde, för att betala ut provision till den som länkade.",
        "Myndigheter, när vi enligt lag är skyldiga att lämna ut information.",
      ],
    },
    {
      type: "p",
      text: "Alla biträden omfattas av personuppgiftsbiträdesavtal. När överföring utanför EU/EES är nödvändig skyddas den av EU-kommissionens standardavtalsklausuler tillsammans med kompletterande skyddsåtgärder.",
    },
    { type: "h2", text: "Dina rättigheter" },
    {
      type: "ul",
      items: [
        "Tillgång – begära ett registerutdrag över de uppgifter vi har om dig.",
        "Rättelse – få felaktiga uppgifter korrigerade.",
        "Radering – få dina uppgifter raderade när vi inte längre behöver dem.",
        "Begränsning och invändning – begränsa eller invända mot viss behandling, inklusive direktmarknadsföring.",
        "Dataportabilitet – få dina uppgifter i ett maskinläsbart format.",
        "Återkalla samtycke – när som helst, utan att det påverkar behandling som redan skett.",
      ],
    },
    {
      type: "p",
      text: `Mejla ${company.email} för att använda en rättighet. Vi svarar inom 30 dagar. Är du missnöjd med hur vi hanterar dina uppgifter kan du klaga hos Integritetsskyddsmyndigheten (IMY), imy.se.`,
    },
    { type: "h2", text: "Säkerhet" },
    {
      type: "p",
      text: "Sajten levereras över TLS, inloggning sker med engångskoder, åtkomsten till personuppgifter är begränsad till personal som behöver den, och våra system skyddas av loggning och rollbaserad behörighet.",
    },
    { type: "h2", text: "Barn" },
    { type: "p", text: "Butiken riktar sig inte till barn. Du måste vara 18 år eller äldre för att handla eller skapa konto." },
    { type: "h2", text: "Ändringar i policyn" },
    {
      type: "p",
      text: "Vi kan uppdatera policyn när våra tjänster eller lagkrav förändras. Datumet ovan visar alltid gällande version och väsentliga ändringar meddelas registrerade kunder via e-post.",
    },
  ],
};

/* ------------------------------- Köpvillkor ------------------------------- */

const terms: LegalDoc = {
  slug: "kopvillkor",
  title: "Köpvillkor",
  updated,
  intro:
    "Villkoren gäller för alla beställningar som konsumenter gör på metilde.com. De omfattar priser, betalning, leverans, prenumerationer, ångerrätt, returer, återbetalning och reklamation.",
  metaTitle: "Köpvillkor",
  metaDescription:
    "Metildes köpvillkor: priser och betalning, leveranstider och fraktkostnader, prenumerationer, ångerrätt, returer, återbetalning och reklamation.",
  blocks: [
    ...contactBlock,
    { type: "h2", text: "Beställning och avtal" },
    {
      type: "p",
      text: "Ett bindande avtal ingås när vi bekräftar din order via e-post. Du måste vara minst 18 år för att handla. Om en vara är slut i lager eller ett pris är uppenbart felaktigt kan vi annullera ordern och återbetala eventuellt debiterat belopp. All kommunikation sker på svenska eller engelska.",
    },
    { type: "h2", text: "Priser, moms och betalning" },
    {
      type: "ul",
      items: [
        "Alla priser visas i svenska kronor (SEK) och inkluderar moms. Totalsumman inklusive frakt visas innan du bekräftar ordern.",
        "Betalsätt som accepteras: Klarna, Visa, Mastercard, American Express, Apple Pay och Google Pay.",
        "Vid engångsköp dras betalningen när ordern läggs.",
        "Vi levererar för närvarande bara till adresser i Sverige. Tull eller importavgifter tillkommer därför aldrig.",
      ],
    },
    { type: "h2", text: "Leverans" },
    { type: "shippingTable" },
    {
      type: "p",
      text: "Order som läggs före kl. 12.00 en vardag skickas normalt samma dag från vårt lager i Sverige. Du får en spårningslänk via e-post så snart paketet lämnar oss. Outlöst paket debiteras den faktiska returfraktkostnaden.",
    },
    { type: "h2", text: "Prenumeration" },
    {
      type: "ul",
      items: [
        "Prenumeration ger 15 % rabatt på ordinarie pris och levereras med det intervall du väljer.",
        "Första leveransen betalas direkt vid köpet. Därefter dras betalningen automatiskt vid varje förnyelse, och leveransen skickas samma dag.",
        "Du kan pausa, ändra intervall eller avsluta när som helst fram till dagen före nästa förnyelse, via Mitt konto eller genom att mejla kundservice. Ändringar som görs senare gäller från nästa leverans.",
        "Prenumerationen löper tills du avslutar den. Ingen bindningstid och ingen avgift för att avsluta.",
      ],
    },
    { type: "h2", text: "Ångerrätt" },
    {
      type: "p",
      text: `Som konsument har du 14 dagars lagstadgad ångerrätt från den dag du tar emot varan – vi förlänger den till 30 dagar. Kontakta oss på ${company.email} eller använd Konsumentverkets ångerblankett. Varan ska returneras oanvänd och i obruten originalförpackning. Av hygien- och livsmedelsskäl kan kosttillskott med bruten försegling inte returneras.`,
    },
    { type: "h2", text: "Retur och återbetalning" },
    {
      type: "ul",
      items: [
        "Meddela oss inom 30 dagar från mottagandet och skicka tillbaka varan inom 14 dagar från ditt meddelande.",
        "Vid ångrat köp betalar du returfrakten (79 kr dras från återbetalningen). Är varan felaktig eller fellevererad står vi för returfrakten.",
        "Vi återbetalar köpesumman inklusive den standardfrakt du betalat inom 14 dagar från att vi tagit emot returen eller bevis på retur.",
        "Återbetalning sker till det ursprungliga betalsättet.",
        "Har varan minskat i värde på grund av hantering utöver vad som krävts för att bedöma den kan vi göra ett motsvarande avdrag.",
      ],
    },
    { type: "h2", text: "Reklamation och felaktiga varor" },
    {
      type: "p",
      text: `Du har tre års reklamationsrätt enligt konsumentköplagen. Kontakta ${company.email} med ordernummer och en bild på felet. Godkänd reklamation åtgärdas med ny vara eller återbetalning, och vi betalar returfrakten.`,
    },
    { type: "h2", text: "Produktinformation" },
    {
      type: "p",
      text: "Våra produkter är kosttillskott och är inte avsedda att förebygga, behandla eller bota sjukdom. Kosttillskott bör inte ersätta en varierad kost och en hälsosam livsstil. Läs alltid etiketten, följ rekommenderad dagsdos och förvara produkten utom räckhåll för barn. Rådgör med läkare om du är gravid, ammar eller tar läkemedel.",
    },
    { type: "h2", text: "Tvist" },
    {
      type: "p",
      text: "Om vi inte kommer överens kan du vända dig till Allmänna reklamationsnämnden (ARN), Box 174, 101 23 Stockholm, arn.se. Vi följer ARN:s rekommendationer. Svensk lag tillämpas på avtalet.",
    },
  ],
};

/* -------------------------------- Cookies -------------------------------- */

const cookies: LegalDoc = {
  slug: "cookies",
  title: "Cookiepolicy",
  updated,
  intro:
    "Cookies är små textfiler som sparas på din enhet när du besöker metilde.com. Vi använder dem för att butiken ska fungera, för att komma ihåg dina val och för att förstå hur sajten används.",
  metaTitle: "Cookiepolicy",
  metaDescription:
    "Vilka cookies Metilde använder, vad de gör, hur länge de sparas och hur du ändrar eller återkallar ditt samtycke.",
  blocks: [
    { type: "h2", text: "Samtycke" },
    {
      type: "p",
      text: "Nödvändiga cookies sätts automatiskt eftersom butiken inte fungerar utan dem. Analys- och marknadsföringscookies sätts först när du accepterat dem. Du kan ändra eller återkalla ditt samtycke när som helst via cookieinställningarna i sidfoten, eller genom att rensa cookies i webbläsaren.",
    },
    { type: "h2", text: "Cookies vi använder" },
    { type: "h3", text: "Nödvändiga" },
    {
      type: "table",
      head: ["Cookie", "Ändamål", "Lagringstid"],
      rows: [
        ["metilde_consent", "Sparar dina cookieval", "12 månader"],
        ["sb-access-token", "Håller dig inloggad på Mitt konto", "1 timme"],
      ],
    },
    {
      type: "p",
      text: "Varukorgen sparas i webbläsarens lokala lagring (metilde_cart), inte i en cookie. Vi använder ingen separat analystjänst; besöksstatistiken räknas på vår egen server utan cookies.",
    },
    { type: "h3", text: "Marknadsföring (kräver samtycke)" },
    {
      type: "table",
      head: ["Cookie", "Ändamål", "Lagringstid"],
      rows: [
        ["_fbp", "Mäter effekten av våra annonser", "3 månader"],
        ["_gcl_au", "Attribuerar konverteringar från Google Ads", "3 månader"],
      ],
    },
    { type: "h2", text: "Tredje parter" },
    {
      type: "p",
      text: "Analys- och marknadsföringscookies sätts av Google och Meta som självständiga leverantörer. De behandlar uppgifter enligt sina egna policyer och aktiveras först efter ditt samtycke. Googles annonstagg använder samtyckesläge (Consent Mode): utan ditt samtycke sätter den inga cookies och skickar bara anonyma signaler om sidvisningar och köp, utan personuppgifter som e-post, som Google använder för att uppskatta annonsernas resultat.",
    },
    { type: "h2", text: "Hantera cookies i webbläsaren" },
    {
      type: "p",
      text: "Du kan blockera eller radera cookies i webbläsarens inställningar. Observera att blockering av nödvändiga cookies gör att varukorg, kassa och inloggning inte fungerar.",
    },
    { type: "p", text: `Frågor om cookies? Mejla ${company.email}.` },
  ],
};

/* ---------------------------- Kvalitetsgaranti ---------------------------- */

const quality: LegalDoc = {
  slug: "kvalitetsgaranti",
  title: "Kvalitetsgaranti",
  updated,
  intro:
    "Varje batch tredjepartstestas innan den når dig. Rena formler utan onödiga tillsatser och full spårbarhet från råvara till färdig förpackning.",
  metaTitle: "Kvalitetsgaranti – tredjepartstestat, spårbart, utan tillsatser",
  metaDescription:
    "Så säkrar Metilde kvaliteten: tredjepartstestade batcher, dokumenterade råvaror, batchspårning och vad som gäller om du inte är nöjd.",
  blocks: [
    { type: "h2", text: "Våra fyra löften" },
    {
      type: "ul",
      items: [
        "Inga onödiga tillsatser – inga konstgjorda färgämnen, sötningsmedel eller fyllnadsmedel vi inte kan motivera.",
        "Väldokumenterade råvaror, valda efter form och standardisering snarare än lägsta pris.",
        "Tredjepartstestade batcher med analyscertifikat.",
        "Tillverkat i Sverige enligt europeiska tillverkningskrav.",
      ],
    },
    { type: "h2", text: "Råvaruval" },
    {
      type: "p",
      text: "Vi väljer leverantörer med dokumenterat ursprung, standardiserade extrakt där det är relevant och en stabil produktionshistorik. Varje leverantör utvärderas på specifikation, revisionshistorik och förmågan att leverera jämna batcher över tid.",
    },
    { type: "h2", text: "Tester" },
    {
      type: "table",
      head: ["Test", "Vad vi kontrollerar", "När"],
      rows: [
        ["Identitet och halt", "Att råvaran är den den utger sig för, samt deklarerad mängd", "Varje batch"],
        ["Tungmetaller", "Bly, kadmium, kvicksilver, arsenik mot EU:s gränsvärden", "Varje batch"],
        ["Mikrobiologi", "Totalantal, jäst, mögel, salmonella, E. coli", "Varje batch"],
        ["Bekämpningsmedel och lösningsmedel", "Rester från odling och extraktion", "Riskbaserat per råvara"],
        ["Stabilitet", "Halt och kvalitet över hållbarhetstiden", "Per produkt och receptändring"],
      ],
    },
    { type: "h2", text: "Spårbarhet" },
    {
      type: "p",
      text: "Varje förpackning har ett batchnummer och bäst före-datum. Med batchnumret kan vi spåra produkten tillbaka till råvarubatch, tillverkningsdatum och testresultat. Mejla oss batchnumret så skickar vi analyscertifikatet för just den batchen.",
    },
    { type: "h2", text: "Om du inte är nöjd" },
    {
      type: "p",
      text: "Oöppnade produkter kan returneras inom 30 dagar enligt våra villkor för returer och byten. Är en produkt felaktig eller skadad gäller reklamationsrätten, även om förpackningen är öppnad. Hör av dig om något inte känns rätt, så går vi igenom det tillsammans.",
    },
    { type: "h2", text: "Regelverk" },
    {
      type: "p",
      text: "Våra produkter är kosttillskott, anmälda till berörda svenska myndigheter och märkta enligt EU:s regelverk. Kosttillskott ersätter inte en varierad kost och hälsosam livsstil och är inte avsedda att diagnostisera, behandla eller bota sjukdom. Rådgör med läkare om du är gravid, ammar eller använder läkemedel.",
    },
    ...helpBlock,
  ],
};

/* ---------------------------- Frakt & leverans ---------------------------- */

const shipping: LegalDoc = {
  slug: "frakt-och-leverans",
  title: "Frakt & leverans",
  updated,
  intro:
    "Beställningar lagda före kl. 12.00 på vardagar packas och skickas samma dag från vårt lager i Sverige. Fri frakt på alla ordrar över 499 kr.",
  metaTitle: "Frakt & leverans – fraktpriser, leveranstider och spårning",
  metaDescription:
    "Metildes fraktpriser och leveranstider i Sverige, fri frakt över 499 kr, spårning, outlösta paket och vad som gäller vid skadad leverans.",
  blocks: [
    { type: "h2", text: "Handläggningstid" },
    {
      type: "p",
      text: "Vi packar ordrar på vardagar. Beställningar som kommer in före kl. 12.00 skickas samma dag, senare ordrar nästa arbetsdag. Under kampanjer och helgdagar kan packningen ta en extra dag.",
    },
    { type: "h2", text: "Fraktpriser och leveranstider" },
    { type: "shippingTable" },
    {
      type: "p",
      text: "Alla priser visas inklusive moms. Vi levererar för närvarande bara till adresser i Sverige. Paketen skickas med PostNord från vårt lager i Timrå.",
    },
    { type: "h2", text: "Spåra din order" },
    {
      type: "p",
      text: "Du får en orderbekräftelse när beställningen är lagd och en spårningslänk när paketet lämnar vårt lager. Du kan också följa leveransen under Spåra order.",
    },
    { type: "h2", text: "Outlösta paket" },
    {
      type: "p",
      text: "Paket ligger kvar hos ombudet i 14 dagar. Outlösta paket returneras till oss och vi debiterar den faktiska kostnaden för frakt tur och retur. Hör hellre av dig om du inte hinner hämta i tid – vi hjälper gärna till att boka om.",
    },
    { type: "h2", text: "Skadade eller saknade leveranser" },
    {
      type: "ul",
      items: [
        "Anmäl synlig transportskada inom 7 dagar från mottagandet, med foton på paket och produkter.",
        "Om spårningen visar levererat men paketet saknas – kolla först med grannar och ombud, kontakta oss sedan inom 14 dagar.",
        "Vi skickar en ersättningsleverans eller återbetalar ordern så snart ärendet är bekräftat.",
      ],
    },
    ...helpBlock,
  ],
};

/* ----------------------------- Returer & byten ---------------------------- */

const returns: LegalDoc = {
  slug: "returer-och-byten",
  title: "Returer & byten",
  updated,
  intro:
    "Du har alltid 30 dagars ångerrätt – längre än lagens 14 dagar. Oöppnade produkter i originalskick kan returneras eller bytas.",
  metaTitle: "Returer & byten – 30 dagars ångerrätt",
  metaDescription:
    "Så returnerar eller byter du en produkt hos Metilde: 30 dagars ångerrätt, returfrakt, återbetalning inom 14 dagar och tre års reklamationsrätt.",
  blocks: [
    { type: "h2", text: "Din ångerrätt" },
    {
      type: "p",
      text: "Som konsument inom EU har du 14 dagars lagstadgad ångerrätt från den dag du tar emot din order. Vi förlänger den till 30 dagar. Ångerrätten gäller produkter som är oöppnade och i väsentligen oförändrat skick – av hygien- och livsmedelsskäl kan vi inte sälja öppnade kosttillskott vidare.",
    },
    { type: "h2", text: "Så returnerar du" },
    {
      type: "ul",
      items: [
        `Anmäl returen genom att mejla ${company.email} med ordernummer och vilka varor det gäller.`,
        "Du får retursedel och instruktioner inom en arbetsdag. Returer skickas till Swedish Treats AB, Plåtslagarvägen 19, 861 36 Timrå.",
        "Packa produkterna i originalförpackningen eller motsvarande skyddande emballage.",
        "Lämna paketet hos närmaste ombud och spara kvittot tills återbetalningen är klar.",
      ],
    },
    { type: "h2", text: "Returfrakt och återbetalning" },
    {
      type: "table",
      head: ["Situation", "Returfrakt", "Återbetalning"],
      rows: [
        ["Ångrat köp", "Betalas av dig, 79 kr dras från återbetalningen", "Ordervärdet inklusive ursprunglig standardfrakt"],
        ["Fel vara skickad", "Kostnadsfri, förbetald etikett från oss", "Hela beloppet eller ersättningsvara"],
        ["Skadad eller felaktig produkt", "Kostnadsfri, förbetald etikett från oss", "Hela beloppet eller ersättningsvara"],
        ["Byte till annan produkt", "Kostnadsfritt inom Sverige", "Mellanskillnad debiteras eller återbetalas"],
      ],
    },
    {
      type: "p",
      text: "Återbetalning sker med samma betalmetod som vid köpet inom 14 dagar från att vi tagit emot och godkänt returen, normalt inom 2–5 bankdagar. Vi tar ingen returavgift utöver returfrakten i tabellen ovan.",
    },
    { type: "h2", text: "Reklamation" },
    {
      type: "p",
      text: "Du har tre års reklamationsrätt för felaktiga varor enligt konsumentköplagen. Anmäl felet inom skälig tid efter att du upptäckt det – inom två månader räknas alltid som skälig tid. Bifoga foton och batchnumret som står på etiketten.",
    },
    { type: "h2", text: "Undantag" },
    {
      type: "ul",
      items: [
        "Öppnade kosttillskott eller produkter med bruten försegling, av hygien- och livsmedelsskäl.",
        "Digitala presentkort som redan skickats till mottagaren.",
        "Produkter där bäst före-datum passerat medan de varit i din ägo.",
      ],
    },
    { type: "h2", text: "Tvistlösning" },
    {
      type: "p",
      text: "Om vi inte kommer överens kan du vända dig till Allmänna reklamationsnämnden (ARN), Box 174, 101 23 Stockholm, arn.se. Vi följer ARN:s rekommendationer.",
    },
    ...helpBlock,
  ],
};

/* -------------------------------- Hållbarhet ------------------------------ */

const sustainability: LegalDoc = {
  slug: "hallbarhet",
  title: "Hållbarhet",
  updated,
  intro:
    "Färre men bättre produkter, förpackningar som går att återvinna och en leverantörskedja vi kan förklara. Så här ser det ut idag – och det här jobbar vi vidare med.",
  metaTitle: "Hållbarhet – förpackningar, frakt och råvaror",
  metaDescription:
    "Så arbetar Metilde med hållbarhet: återvinningsbara förpackningar, samlad frakt från ett lager i Sverige och dokumenterade råvaror.",
  blocks: [
    { type: "h2", text: "Så tänker vi" },
    {
      type: "p",
      text: "Ett kosttillskottsvarumärkes största avtryck ligger i råvaror, förpackningar och transporter. Vi jobbar med de tre, i den ordningen, och redovisar hellre ärligt var vi står än gör påståenden vi inte kan dokumentera.",
    },
    { type: "h2", text: "Förpackningar" },
    {
      type: "ul",
      items: [
        "Ytterkartong och fyllnadsmaterial är gjorda av returpapper och återvinns som papper.",
        "Kapslarna levereras i plastburkar med skruvlock som skyddar mot fukt och ljus. Burken sorteras som plastförpackning.",
        "Ingen plastfilm runt ytterförpackningen och inga tryckta pappersinlagor du inte bett om.",
      ],
    },
    { type: "h2", text: "Frakt" },
    {
      type: "p",
      text: "Vi skickar från ett enda lager i Sverige, i första hand som brev och till ombud eftersom samlade rutter innebär färre kilometer per paket. Prenumerationer kan slås ihop till en leverans så att flera produkter reser tillsammans.",
    },
    { type: "h2", text: "Råvaror och socialt ansvar" },
    {
      type: "ul",
      items: [
        "Leverantörer ska dokumentera ursprung och följa tillämplig arbets- och miljölagstiftning.",
        "Vi tillverkar i Sverige och köper råvara från odlare med dokumenterade skörderutiner.",
        "Botaniska råvaror som bara växer utanför Europa köps i så stora partier som möjligt för att minska antalet transporter.",
      ],
    },
    { type: "h2", text: "Det vi inte löst än" },
    {
      type: "ul",
      items: [
        "Vi publicerar ännu inte en fullständig klimatberäkning per produkt.",
        "Vissa botaniska råvaror kan bara odlas utanför Europa, vilket innebär långa transporter.",
      ],
    },
    {
      type: "p",
      text: `Har du en fråga eller ett förslag kring vårt hållbarhetsarbete? Skriv till ${company.email} – vi läser allt.`,
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

export const getLegalDoc = (slug: string): LegalDoc | undefined => legalDocs[slug];
