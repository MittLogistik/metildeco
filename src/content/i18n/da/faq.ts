/** Ofte stillede spørgsmål (da-DK). Svarene følger handelsbetingelser, fragtside og returside for Danmark. */
import type { FaqGroup } from "@/content/faq";
import { company } from "@/lib/site";

export const faqGroups: FaqGroup[] = [
  {
    id: "bestallning",
    title: "Bestilling & betaling",
    items: [
      {
        q: "Hvilke betalingsmåder kan jeg bruge?",
        a: "Du kan betale med Klarna, Visa, Mastercard, American Express, Apple Pay, Google Pay og MobilePay (MobilePay kan ikke bruges til abonnementer). Betalingen håndteres af Stripe – vi gemmer aldrig dine kortoplysninger.",
      },
      {
        q: "Kan jeg ændre eller annullere min ordre?",
        a: `Kontakt ${company.email} så hurtigt som muligt med dit ordrenummer. Er ordren ikke blevet pakket, ændrer eller annullerer vi den. Er den allerede sendt, kan du bruge din fortrydelsesret, når forsendelsen kommer.`,
      },
      {
        q: "Får jeg en kvittering?",
        a: "Ja, ordrebekræftelsen med kvittering sendes til din e-mail, så snart betalingen er gennemført.",
      },
      {
        q: "Kan jeg handle som virksomhed?",
        a: `Ja. Angiv virksomhedens navn og CVR-nummer i adressefeltet, eller skriv til ${company.email}, hvis du ønsker en faktura.`,
      },
    ],
  },
  {
    id: "frakt",
    title: "Fragt & levering",
    items: [
      {
        q: "Hvad koster fragten?",
        a: "Fragt til Danmark koster 46 kr., og der er fri fragt på alle ordrer over 469 kr. Abonnementer og pakker sendes altid gratis. Aktuelle priser finder du på siden Fragt & levering.",
      },
      {
        q: "Hvor lang er leveringstiden?",
        a: "Ordrer afgivet før kl. 12.00 (svensk tid) på hverdage sendes samme dag fra vores lager i Sverige. Leveringstiden til Danmark er normalt 2–5 hverdage.",
      },
      {
        q: "Leverer I til Danmark?",
        a: "Ja. Vi leverer til adresser i Sverige, Finland og Danmark. Ordrer til Danmark sendes med PostNord som sporbart brev fra vores lager i Timrå i Sverige. Da forsendelsen sker inden for EU, kommer der ingen told eller importafgifter.",
      },
      {
        q: "Hvordan sporer jeg min forsendelse?",
        a: "Du får et sporingslink på e-mail, når forsendelsen forlader lageret. Du kan også indtaste ordrenummer og e-mail under Spor ordre.",
      },
    ],
  },
  {
    id: "retur",
    title: "Returnering & reklamation",
    items: [
      {
        q: "Hvilken fortrydelsesret gælder?",
        a: "30 dage fra du har modtaget ordren – længere end lovens 14 dage. Produktet skal være uåbnet, fordi vi af hygiejne- og fødevarehensyn ikke kan sælge åbnede kosttilskud videre.",
      },
      {
        q: "Hvordan returnerer jeg en vare?",
        a: `Skriv til ${company.email} med ordrenummer og hvilke varer, det drejer sig om. Du får returlabel og instruktioner inden for en hverdag. Ved fortrudt køb betaler du returfragten, og 59 kr. trækkes fra tilbagebetalingen. Tilbagebetalingen sker inden for 14 dage fra vi har modtaget returneringen.`,
      },
      {
        q: "Hvad gør jeg, hvis et produkt er beskadiget?",
        a: "Anmeld skaden inden for 7 dage med fotos af forsendelsen og produktet. Vi sender en erstatningsvare eller tilbagebetaler dig, og vi betaler returfragten.",
      },
    ],
  },
  {
    id: "prenumeration",
    title: "Abonnement",
    items: [
      {
        q: "Hvordan fungerer abonnementet?",
        a: "Vælg Abonnér på produktsiden, så får du 15 % rabat og fri fragt på hver levering. Du vælger interval (30, 60 eller 90 dage) og kan sætte på pause eller opsige, når du vil.",
      },
      {
        q: "Hvornår trækkes pengene?",
        a: "Første levering betales ved købet. Derefter trækkes betalingen automatisk, når en ny periode begynder, hver 30., 60. eller 90. dag regnet fra købet. Forsendelsen sendes nogle dage efter betalingen, og du får en e-mail med forventet leveringsdag.",
      },
      {
        q: "Hvordan sætter jeg mit abonnement på pause eller opsiger det?",
        a: "Log ind på Min konto, og vælg Pause eller Opsig. En pause gælder med det samme, og der trækkes ingen penge, før du genoptager abonnementet. Opsiger du, foretages der ikke flere træk, og abonnementet ophører, når den betalte periode er slut. Ingen bindingsperiode og intet gebyr. Kan du ikke logge ind, så skriv til kundeservice, så hjælper vi dig.",
      },
      {
        q: "Kan jeg skifte produkt eller interval?",
        a: "Ja. Skriv til kundeservice, så ændrer vi interval, antal, produkt eller leveringsadresse før næste levering. Pause og opsigelse kan du klare selv under Min konto.",
      },
    ],
  },
  {
    id: "produkter",
    title: "Produkter & kvalitet",
    items: [
      {
        q: "Hvor kommer jeres produkter fra?",
        a: "Metilde er et svensk varemærke, og sortimentet er udviklet i Sverige. Råvarerne og ekstrakterne kommer fra de lande, hvor planterne hører hjemme, for eksempel Tongkat Ali fra Sydøstasien og maca fra Andesbjergene.",
      },
      {
        q: "Hvordan ved jeg, hvilken batch jeg har fået?",
        a: "Batchnummer og bedst før-dato står på dåsen. Oplys batchnummeret, hvis du kontakter os om et produkt, så kan vi spore det.",
      },
      {
        q: "Indeholder produkterne unødvendige tilsætningsstoffer?",
        a: "Nej. Vores kapsler indeholder ekstrakt og en plantebaseret kapselskal – ingen bindemidler, fyldstoffer, farvestoffer eller sødemidler.",
      },
      {
        q: "Hvordan opbevarer jeg produkterne?",
        a: "Tørt ved stuetemperatur, med låget skruet godt på efter hver brug og utilgængeligt for små børn.",
      },
    ],
  },
  {
    id: "konto",
    title: "Konto & privatliv",
    items: [
      {
        q: "Skal jeg oprette en konto for at handle?",
        a: "Nej, du kan handle som gæst. Du skal kun bruge en konto for at administrere abonnementer og se din ordrehistorik.",
      },
      {
        q: "Hvordan behandler I mine personoplysninger?",
        a: "Vi bruger dine oplysninger til at håndtere din ordre og din konto. Har du accepteret markedsføringscookies, deler vi også visse oplysninger med Meta og Google for at måle vores annoncer. Vi sælger aldrig dine oplysninger. Læs mere i vores privatlivspolitik.",
      },
    ],
  },
];
