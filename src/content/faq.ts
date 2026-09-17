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
        a: "Du kan betala med Swish, Klarna, Visa, Mastercard, American Express, Apple Pay och Google Pay. Prenumerationer betalas med kort, Klarna, Apple Pay eller Google Pay. Betalningen hanteras av Stripe – vi lagrar aldrig dina kortuppgifter.",
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
        a: "Ja, till Norden, EU, Storbritannien och USA. Fraktpris och leveranstid beror på zon och visas i kassan.",
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
        a: "Välj Prenumerera på produktsidan så får du 15 % rabatt och fri frakt på varje leverans. Du väljer intervall (30, 60 eller 90 dagar) och kan pausa, ändra eller avsluta när du vill.",
      },
      {
        q: "När dras pengarna?",
        a: "Första leveransen betalas direkt vid köpet. Därefter dras betalningen automatiskt vid varje förnyelse, samma dag som leveransen skickas.",
      },
      {
        q: "Hur pausar eller avslutar jag min prenumeration?",
        a: "Logga in på Mitt konto och välj Pausa eller Avsluta på prenumerationen. Det gäller direkt, utan bindningstid eller avgift.",
      },
      {
        q: "Kan jag byta produkt eller intervall?",
        a: "Ja, under Mitt konto kan du ändra intervall, antal och produkt fram till dagen före nästa utskick.",
      },
    ],
  },
  {
    id: "produkter",
    title: "Produkter & kvalitet",
    items: [
      {
        q: "Var tillverkas era produkter?",
        a: "I Sverige, i små batcher enligt europeiska tillverkningskrav. Råvarorna kommer från odlare med dokumenterat ursprung.",
      },
      {
        q: "Testas produkterna av tredje part?",
        a: "Ja. Varje batch analyseras av ett oberoende laboratorium för identitet, tungmetaller och mikrobiologi. Mejla oss batchnumret så skickar vi analyscertifikatet.",
      },
      {
        q: "Innehåller produkterna onödiga tillsatser?",
        a: "Nej. Våra kapslar innehåller extrakt och ett växtbaserat kapselskal – inga bindemedel, fyllnadsmedel, färgämnen eller sötningsmedel.",
      },
      {
        q: "Hur förvarar jag produkterna?",
        a: "Torrt i rumstemperatur, med påsen återförsluten efter varje användning och utom räckhåll för små barn.",
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
        a: "Vi använder dina uppgifter bara för att hantera din order och ditt konto, och delar dem aldrig med tredje part i marknadsföringssyfte. Läs mer i vår integritetspolicy.",
      },
    ],
  },
];
