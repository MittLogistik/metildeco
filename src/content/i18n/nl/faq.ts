/** Veelgestelde vragen (nl-NL). Svaren följer köpvillkor, fraktsida och retursida för Nederländerna. */
import type { FaqGroup } from "@/content/faq";
import { company } from "@/lib/site";

export const faqGroups: FaqGroup[] = [
  {
    id: "bestallning",
    title: "Bestellen & betalen",
    items: [
      {
        q: "Welke betaalmethoden kan ik gebruiken?",
        a: "Je kunt betalen met Klarna, Visa, Mastercard, American Express, Apple Pay en Google Pay. De betaling wordt verwerkt door Stripe – wij slaan je kaartgegevens nooit op.",
      },
      {
        q: "Kan ik mijn bestelling wijzigen of annuleren?",
        a: `Mail zo snel mogelijk naar ${company.email} met je ordernummer. Is de bestelling nog niet ingepakt, dan passen we hem aan of annuleren we hem. Is hij al verzonden, dan kun je je herroepingsrecht gebruiken zodra de zending binnen is.`,
      },
      {
        q: "Krijg ik een bon?",
        a: "Ja, de orderbevestiging met bon wordt naar je e-mailadres gestuurd zodra de betaling is voltooid.",
      },
      {
        q: "Kan ik als bedrijf bestellen?",
        a: `Ja. Vul de bedrijfsnaam en het KvK-nummer in bij het adres, of mail naar ${company.email} als je een factuur wilt.`,
      },
    ],
  },
  {
    id: "frakt",
    title: "Verzending & levering",
    items: [
      {
        q: "Wat kost de verzending?",
        a: "Verzending naar Nederland kost 8,00 €, en bij alle bestellingen boven 79 € is de verzending gratis. Abonnementen en bundels worden altijd gratis verzonden. De actuele prijzen vind je op de pagina Verzending & levering.",
      },
      {
        q: "Hoe lang is de levertijd?",
        a: "Bestellingen die op werkdagen vóór 12.00 uur (Zweedse tijd) worden geplaatst, versturen we dezelfde dag vanuit ons magazijn in Zweden. De levertijd naar Nederland is normaal 3–6 werkdagen.",
      },
      {
        q: "Leveren jullie in Nederland?",
        a: "Ja. We leveren aan adressen in Zweden, Finland, Denemarken en Nederland. Bestellingen naar Nederland gaan met PostNord als brief met track & trace vanuit ons magazijn in Timrå, Zweden. Omdat de zending binnen de EU blijft, betaal je geen douanekosten of invoerheffingen.",
      },
      {
        q: "Hoe volg ik mijn zending?",
        a: "Je ontvangt een track & trace-link per e-mail zodra de zending het magazijn verlaat. Je kunt ook je ordernummer en e-mailadres invullen bij Bestelling volgen.",
      },
    ],
  },
  {
    id: "retur",
    title: "Retouren & reclamaties",
    items: [
      {
        q: "Welk herroepingsrecht geldt er?",
        a: "30 dagen vanaf het moment dat je de bestelling hebt ontvangen – langer dan de wettelijke 14 dagen. Het product moet ongeopend zijn, omdat we geopende voedingssupplementen om hygiënische redenen en vanwege voedselveiligheid niet opnieuw kunnen verkopen.",
      },
      {
        q: "Hoe stuur ik iets retour?",
        a: `Mail naar ${company.email} met je ordernummer en om welke producten het gaat. Je ontvangt binnen één werkdag een retourlabel en instructies. Bij herroeping betaal je zelf de retourkosten en wordt 8,00 € van de terugbetaling afgetrokken. We betalen je terug binnen 14 dagen nadat we de retour hebben ontvangen.`,
      },
      {
        q: "Wat moet ik doen als een product beschadigd is?",
        a: "Meld de schade binnen 7 dagen met foto's van de zending en het product. We sturen een vervangend product of betalen je terug, en wij betalen de retourkosten.",
      },
    ],
  },
  {
    id: "prenumeration",
    title: "Abonnement",
    items: [
      {
        q: "Hoe werkt het abonnement?",
        a: "Kies Abonneren op de productpagina, dan krijg je 15 % korting en gratis verzending op elke levering. Je kiest het interval (30, 60 of 90 dagen) en kunt pauzeren of opzeggen wanneer je wilt.",
      },
      {
        q: "Wanneer wordt er betaald?",
        a: "De eerste levering betaal je bij aankoop. Daarna wordt de betaling automatisch afgeschreven wanneer een nieuwe periode begint, elke 30, 60 of 90 dagen gerekend vanaf de aankoop. De zending wordt een paar dagen na de afschrijving verstuurd en je krijgt een e-mail met de verwachte leverdag.",
      },
      {
        q: "Hoe pauzeer of beëindig ik mijn abonnement?",
        a: "Log in op Mijn account en kies Pauzeren of Opzeggen. Een pauze gaat direct in en er wordt niets afgeschreven tot je het abonnement hervat. Zeg je op, dan wordt er niets meer afgeschreven en stopt het abonnement aan het einde van de betaalde periode. Geen minimale looptijd en geen kosten. Lukt het inloggen niet, mail dan de klantenservice, dan helpen we je verder.",
      },
      {
        q: "Kan ik van product of interval wisselen?",
        a: "Ja. Mail de klantenservice, dan passen we het interval, het aantal, het product of het bezorgadres aan vóór de volgende levering. Pauzeren en opzeggen kun je zelf doen via Mijn account.",
      },
    ],
  },
  {
    id: "produkter",
    title: "Producten & kwaliteit",
    items: [
      {
        q: "Waar komen jullie producten vandaan?",
        a: "Metilde is een Zweeds merk en het assortiment wordt in Zweden ontwikkeld. De grondstoffen en extracten komen uit de landen waar de planten van nature thuishoren, bijvoorbeeld Tongkat Ali uit Zuidoost-Azië en maca uit de Andes.",
      },
      {
        q: "Hoe weet ik welke batch ik heb gekregen?",
        a: "Het batchnummer en de houdbaarheidsdatum staan op de pot. Vermeld het batchnummer als je contact met ons opneemt over een product, dan kunnen we het traceren.",
      },
      {
        q: "Bevatten de producten onnodige toevoegingen?",
        a: "Nee. Onze capsules bevatten extract en een plantaardige capsulewand – geen bindmiddelen, vulstoffen, kleurstoffen of zoetstoffen.",
      },
      {
        q: "Hoe bewaar ik de producten?",
        a: "Droog en op kamertemperatuur, met het deksel na elk gebruik goed dichtgedraaid en buiten het bereik van jonge kinderen.",
      },
    ],
  },
  {
    id: "konto",
    title: "Account & privacy",
    items: [
      {
        q: "Moet ik een account aanmaken om te bestellen?",
        a: "Nee, je kunt als gast bestellen. Een account heb je alleen nodig om abonnementen te beheren en je bestelgeschiedenis te bekijken.",
      },
      {
        q: "Hoe gaan jullie om met mijn persoonsgegevens?",
        a: "We gebruiken je gegevens om je bestelling en je account af te handelen. Heb je marketingcookies geaccepteerd, dan delen we ook bepaalde informatie met Meta en Google om onze advertenties te meten. We verkopen je gegevens nooit. Lees meer in ons privacybeleid.",
      },
    ],
  },
];
