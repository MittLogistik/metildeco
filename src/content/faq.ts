/** Vanliga frågor. Svaren följer köpvillkor, fraktsida och retursida. */
import { company } from "@/lib/site";

export type FaqItem = { q: string; a: string };
export type FaqGroup = { id: string; title: string; items: FaqItem[] };

export const faqGroups: FaqGroup[] = [
  {
    id: "bestallning",
    title: "Beställning & betalning",
    items: [
      {
        q: "Vilka betalsätt kan jag använda?",
        a: "Du kan betala med Klarna, Visa, Mastercard, American Express, Apple Pay och Google Pay. Betalningen hanteras av Stripe – vi lagrar aldrig dina kortuppgifter.",
      },
      {
        q: "Kan jag ändra eller avbryta min order?",
        a: `Hör av dig till ${company.email} så snart som möjligt med ditt ordernummer. Har ordern inte packats ändrar eller annullerar vi den. Har den redan skickats kan du använda din ångerrätt när paketet kommer.`,
      },
      {
        q: "Får jag ett kvitto?",
        a: "Ja, orderbekräftelsen med kvitto skickas till din e-post direkt när betalningen är genomförd.",
      },
      {
        q: "Kan jag handla som företag?",
        a: `Ja. Ange företagsnamn och organisationsnummer i adressfältet, eller mejla ${company.email} om du vill ha faktura.`,
      },
    ],
  },
  {
    id: "frakt",
    title: "Frakt & leverans",
    items: [
      {
        q: "Vad kostar frakten?",
        a: "Inom Sverige från 39 kr beroende på fraktsätt, och fri frakt på alla ordrar över 499 kr. Aktuella priser för alla zoner finns på sidan Frakt & leverans.",
      },
      {
        q: "Hur lång är leveranstiden?",
        a: "Ordrar lagda före kl. 12.00 på vardagar skickas samma dag från vårt lager i Sverige. Leveranstiden inom Sverige är normalt 1–3 arbetsdagar.",
      },
      {
        q: "Levererar ni utanför Sverige?",
        a: "Inte just nu. Vi levererar bara till adresser i Sverige, med PostNord från vårt lager i Timrå.",
      },
      {
        q: "Hur spårar jag mitt paket?",
        a: "Du får en spårningslänk via e-post när paketet lämnar lagret. Du kan också ange ordernummer och e-post under Spåra order.",
      },
    ],
  },
  {
    id: "retur",
    title: "Retur & reklamation",
    items: [
      {
        q: "Vilken ångerrätt gäller?",
        a: "30 dagar från att du tagit emot ordern – längre än lagens 14 dagar. Produkten ska vara oöppnad, eftersom vi av hygien- och livsmedelsskäl inte kan sälja öppnade kosttillskott vidare.",
      },
      {
        q: "Hur gör jag en retur?",
        a: `Mejla ${company.email} med ordernummer och vilka varor det gäller. Du får retursedel och instruktioner inom en arbetsdag. Återbetalning sker inom 14 dagar från att vi tagit emot returen.`,
      },
      {
        q: "Vad gör jag om en produkt är skadad?",
        a: "Anmäl skadan inom 7 dagar med foton på paket och produkt. Vi skickar en ersättningsvara eller återbetalar dig, och vi står för returfrakten.",
      },
    ],
  },
  {
    id: "prenumeration",
    title: "Prenumeration",
    items: [
      {
        q: "Hur fungerar prenumerationen?",
        a: "Välj Prenumerera på produktsidan så får du 15 % rabatt och fri frakt på varje leverans. Du väljer intervall (30, 60 eller 90 dagar) och kan pausa eller avsluta när du vill.",
      },
      {
        q: "När dras pengarna?",
        a: "Första leveransen betalas vid köpet. Därefter dras betalningen automatiskt när en ny period börjar, var 30:e, 60:e eller 90:e dag räknat från köpet. Paketet skickas några dagar efter dragningen och du får ett mejl med beräknad leveransdag.",
      },
      {
        q: "Hur pausar eller avslutar jag min prenumeration?",
        a: "Logga in på Mitt konto och välj Pausa eller Avsluta. En paus gäller direkt och inga pengar dras förrän du återupptar. Avslutar du görs inga fler dragningar och prenumerationen upphör när den betalda perioden är slut. Ingen bindningstid och ingen avgift. Kommer du inte in, mejla kundservice så hjälper vi dig.",
      },
      {
        q: "Kan jag byta produkt eller intervall?",
        a: "Ja. Mejla kundservice så byter vi intervall, antal, produkt eller leveransadress före nästa leverans. Pausa och avsluta kan du göra själv under Mitt konto.",
      },
    ],
  },
  {
    id: "produkter",
    title: "Produkter & kvalitet",
    items: [
      {
        q: "Var kommer era produkter ifrån?",
        a: "Metilde är ett svenskt varumärke och sortimentet tas fram i Sverige. Råvarorna och extrakten kommer från länderna där växterna hör hemma, till exempel Tongkat Ali från Sydostasien och maca från Anderna.",
      },
      {
        q: "Hur vet jag vilken batch jag har fått?",
        a: "Batchnummer och bäst före-datum står på burken. Ange batchnumret om du kontaktar oss om en produkt, så kan vi spåra den.",
      },
      {
        q: "Innehåller produkterna onödiga tillsatser?",
        a: "Nej. Våra kapslar innehåller extrakt och ett växtbaserat kapselskal – inga bindemedel, fyllnadsmedel, färgämnen eller sötningsmedel.",
      },
      {
        q: "Hur förvarar jag produkterna?",
        a: "Torrt i rumstemperatur, med locket väl påskruvat efter varje användning och utom räckhåll för små barn.",
      },
    ],
  },
  {
    id: "konto",
    title: "Konto & integritet",
    items: [
      {
        q: "Måste jag skapa ett konto för att handla?",
        a: "Nej, du kan handla som gäst. Ett konto behövs bara för att hantera prenumerationer och se orderhistorik.",
      },
      {
        q: "Hur hanterar ni mina personuppgifter?",
        a: "Vi använder dina uppgifter för att hantera din order och ditt konto. Har du godkänt marknadsföringscookies delar vi även viss information med Meta och Google för att mäta våra annonser. Vi säljer aldrig dina uppgifter. Läs mer i vår integritetspolicy.",
      },
    ],
  },
];
