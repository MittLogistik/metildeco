/**
 * Informationssidor: villkor/policyer (frakttabell, företagsuppgifter), vanliga frågor,
 * kontakt och vår historia. Användning: `const t = info[locale]`.
 */
import type { Locale } from "@/lib/i18n";

const sv = {
  shippingTable: {
    destination: "Destination",
    method: "Fraktsätt",
    time: "Leveranstid",
    cost: "Kostnad",
    days: (from: number, to: number) => `${from}–${to} arbetsdagar`,
    freeOver: (price: string, freeOver: string) => `${price} – fri frakt över ${freeOver}`,
  },
  /** Företagsuppgifterna (blocket companyInfo) och platshållarna i sidtexterna. */
  company: {
    legalEntity: "Juridisk enhet",
    orgNumber: "Organisationsnummer",
    vatId: "Momsregistreringsnummer",
    address: "Adress",
    email: "E-post",
    phone: "Telefon",
    hours: "Mån–fre 09:00–17:00",
    /** Landsnamnet för Sverige i adresser. */
    sweden: "Sverige",
    logistics: (logistics: string, orgNumber: string, address: string, seller: string) =>
      `Lager, packning, leveranser och returer sköts av ${logistics} (org.nr ${orgNumber}), ${address}, för ${seller}s räkning.`,
  },
  faq: {
    metaTitle: "Vanliga frågor",
    metaDescription: "Svar på de vanligaste frågorna om beställning, betalning, frakt, returer, prenumeration och våra produkter.",
    title: "Vanliga frågor",
    eyebrow: "Kundservice",
    intro: "Här hittar du svar på de vanligaste frågorna om beställningar, leverans, prenumerationer och våra produkter.",
    categories: "Kategorier",
    moreTitle: "Fick du inte svar?",
    moreBefore: "Vår kundservice svarar vardagar 09–17 och återkommer normalt inom ett arbetsdygn. Mejla",
    moreOr: "eller ring",
    languages: "",
    contact: "Kontakta oss",
    trackOrder: "Spåra din order",
  },
  contact: {
    metaTitle: "Kontakta oss",
    metaDescription: "Har du en fråga om din order, en produkt eller din prenumeration? Metildes kundservice svarar inom 1–2 arbetsdagar.",
    title: "Kontakta oss",
    eyebrow: "Kundservice",
    intro: "Vi svarar normalt inom 1–2 arbetsdagar, helgfria vardagar. Gäller det en pågående order är det snabbast om du anger ditt ordernummer.",
    /** Visas bara på språk där kundservice inte svarar på sidans språk. */
    languages: "",
    formTitle: "Skicka ett meddelande",
    otherWays: "Andra vägar till oss",
    email: "E-post",
    phone: "Telefon",
    swedishTime: "svensk tid",
    companyInfo: "Företagsuppgifter",
    trackTitle: "Vill du bara veta var paketet är?",
    trackText: "Spåra din leverans direkt med ordernummer och e-post.",
    trackLink: "Spåra din order",
    faqTitle: "Snabba svar",
    faqText: "Många frågor om frakt, retur och prenumeration besvaras redan i våra vanliga frågor.",
    faqLink: "Till vanliga frågor",
  },
  story: {
    metaTitle: "Vår historia – så startade Metilde",
    metaDescription:
      "Metilde startade av en enkel frustration: för få rena kosttillskott utan krångel. Läs om hur varumärket grundades och varför prenumeration blev självklart.",
    title: "Vår historia",
    eyebrow: "Om Metilde",
    intro:
      "Metilde föddes ur en frustration som många känner igen: varför ska det vara så svårt att hitta rena kosttillskott utan krångel? Det var den frågan som fick Matilda att lägga allt annat åt sidan och bygga varumärket från grunden.",
    sections: [
      {
        title: "Det saknades något på hyllan",
        body: [
          "Matilda hade länge använt kosttillskott, men ju mer hon läste på desto mer frustrerad blev hon. Många produkter var fulla av fyllnadsmedel, sötningsmedel och ingredienser som inte tillförde något. Samtidigt var priserna ofta höga för produkter som inte ens innehöll det de utlovade.",
          "Det fanns gott om varumärken som pratade om hälsa och välmående, men få som förklarade varför produkten faktiskt var värd sitt pris. Det var då idén om Metilde började växa: ett märke som satsar på renhet och transparens, där kunden får vad den betalar för och ingenting annat.",
        ],
      },
      {
        title: "Prenumeration som borde fungera bättre",
        body: [
          "En annan sak som irriterade var att det nästan inte fanns något sätt att prenumerera på kosttillskott. Det som fanns var antingen krångliga abonnemang med uppsägningstider, eller lösningar där man fick komma ihåg att beställa själv.",
          "Metilde byggde därför en prenumeration som faktiskt är schysst: 15 % lägre pris, fri frakt och möjlighet att pausa, byta eller avsluta när som helst. Ingen bindningstid, ingen dold avgift.",
        ],
      },
      {
        title: "Från Matilda till Metilde",
        body: [
          "När det var dags att välja namn var första alternativet självklart. Alla domäner med \"Matilda\" var redan upptagna, så det fick bli något som låg nära – lite enklare, lite renare. Metilde.com fanns ledigt, och namnet kändes direkt rätt.",
        ],
      },
      {
        title: "Nästa steg: växa sortimentet",
        body: [
          "Vi kommer inte att slänga på nya produkter bara för att det ser bra ut. Varje extrakt ska finnas där för att det fyller ett syfte, har riktig kvalitet och lever upp till samma krav som vi satte från dag ett.",
        ],
      },
    ],
    valuesEyebrow: "Värderingar",
    valuesTitle: "Vad vi står för",
    values: [
      ["Inget krångel", "Vi listar exakt vad varje produkt innehåller. Ingen fluff, inga dolda tillsatser."],
      ["Du får vad du betalar för", "Råvaror, kapslar, förpackning. Det är där vi lägger pengarna – inte på dyra reklamkampanjer."],
      ["Prenumeration på riktigt", "15 % rabatt, fri frakt och full kontroll. Pausa, byt eller avsluta när du vill."],
      ["Svenskt varumärke", "Sortimentet tas fram i Sverige och varje order skickas från vårt lager i Timrå."],
    ] as [string, string][],
    companyEyebrow: "Företaget",
    companyTitle: "Om företaget",
    companyIntro: (legalName: string) =>
      `Metilde drivs av ${legalName}. Här hittar du våra fullständiga företagsuppgifter – vi vill att du alltid ska veta vem du handlar av.`,
    legalName: "Juridiskt namn",
    customerService: "Kundtjänst",
    ctaTitle: "Vi är bara i början",
    ctaText:
      "Metilde är ett ungt varumärke, men ambitionen är tydlig: att växa sortimentet och bli en stor spelare på marknaden för rena, botaniska kosttillskott. Det gör vi genom att vara ärliga, hålla hög kvalitet och lyssna på våra kunder.",
    ctaProducts: "Upptäck produkterna",
    ctaSubscription: "Läs om prenumeration",
  },
};

export const info: Record<Locale, typeof sv> = {
  sv,
  fi: {
    shippingTable: {
      destination: "Kohde",
      method: "Toimitustapa",
      time: "Toimitusaika",
      cost: "Hinta",
      days: (from, to) => `${from}–${to} arkipäivää`,
      freeOver: (price, freeOver) => `${price} – ilmainen toimitus yli ${freeOver}`,
    },
    company: {
      legalEntity: "Oikeushenkilö",
      orgNumber: "Organisaationumero",
      vatId: "ALV-tunniste",
      address: "Osoite",
      email: "Sähköposti",
      phone: "Puhelin",
      hours: "ma–pe 9.00–17.00 (Ruotsin aikaa)",
      sweden: "Ruotsi",
      logistics: (logistics, orgNumber, address, seller) =>
        `Varastoinnista, pakkaamisesta, toimituksista ja palautuksista vastaa ${logistics} (ruotsalainen organisaationumero ${orgNumber}), ${address}, ${seller}:n puolesta.`,
    },
    faq: {
      metaTitle: "Usein kysytyt kysymykset",
      metaDescription: "Vastaukset yleisimpiin kysymyksiin tilaamisesta, maksamisesta, toimituksesta, palautuksista, kestotilauksesta ja tuotteistamme.",
      title: "Usein kysytyt kysymykset",
      eyebrow: "Asiakaspalvelu",
      intro: "Täältä löydät vastaukset yleisimpiin kysymyksiin tilauksista, toimituksesta, kestotilauksista ja tuotteistamme.",
      categories: "Kategoriat",
      moreTitle: "Etkö löytänyt vastausta?",
      moreBefore: "Asiakaspalvelumme palvelee arkisin klo 9–17 (Ruotsin aikaa) ja vastaa yleensä yhden arkipäivän kuluessa. Lähetä sähköpostia osoitteeseen",
      moreOr: "tai soita numeroon",
      languages: "Asiakaspalvelumme palvelee ruotsiksi ja englanniksi.",
      contact: "Ota yhteyttä",
      trackOrder: "Seuraa tilaustasi",
    },
    contact: {
      metaTitle: "Ota yhteyttä",
      metaDescription: "Onko sinulla kysyttävää tilauksestasi, tuotteesta tai kestotilauksestasi? Metilden asiakaspalvelu vastaa 1–2 arkipäivän kuluessa.",
      title: "Ota yhteyttä",
      eyebrow: "Asiakaspalvelu",
      intro: "Vastaamme yleensä 1–2 arkipäivän kuluessa. Jos asia koskee keskeneräistä tilausta, nopeinta on, kun kerrot tilausnumerosi.",
      languages: "Asiakaspalvelumme palvelee ruotsiksi ja englanniksi.",
      formTitle: "Lähetä viesti",
      otherWays: "Muut yhteydenottotavat",
      email: "Sähköposti",
      phone: "Puhelin",
      swedishTime: "Ruotsin aikaa",
      companyInfo: "Yrityksen tiedot",
      trackTitle: "Haluatko vain tietää, missä pakettisi on?",
      trackText: "Seuraa toimitustasi tilausnumerolla ja sähköpostilla.",
      trackLink: "Seuraa tilaustasi",
      faqTitle: "Nopeat vastaukset",
      faqText: "Moniin toimitusta, palautuksia ja kestotilausta koskeviin kysymyksiin löytyy vastaus usein kysytyistä kysymyksistä.",
      faqLink: "Usein kysyttyihin kysymyksiin",
    },
    story: {
      metaTitle: "Tarinamme – näin Metilde sai alkunsa",
      metaDescription:
        "Metilde syntyi yksinkertaisesta turhautumisesta: puhtaita ja vaivattomia ravintolisiä oli liian vähän. Lue, miten brändi perustettiin ja miksi kestotilauksesta tuli itsestäänselvyys.",
      title: "Tarinamme",
      eyebrow: "Tietoa Metildestä",
      intro:
        "Metilde syntyi turhautumisesta, jonka moni tunnistaa: miksi puhtaiden ja vaivattomien ravintolisien löytäminen on niin vaikeaa? Juuri tämä kysymys sai Matildan jättämään kaiken muun sivuun ja rakentamaan brändin alusta asti.",
      sections: [
        {
          title: "Hyllyltä puuttui jotain",
          body: [
            "Matilda oli käyttänyt ravintolisiä pitkään, mutta mitä enemmän hän perehtyi niihin, sitä turhautuneemmaksi hän tuli. Monet tuotteet olivat täynnä täyteaineita, makeutusaineita ja ainesosia, jotka eivät tuoneet mitään lisää. Samalla hinnat olivat usein korkeita tuotteille, jotka eivät edes sisältäneet sitä, mitä ne lupasivat.",
            "Brändejä, jotka puhuivat terveydestä ja hyvinvoinnista, oli paljon, mutta harva kertoi, miksi tuote oli todella hintansa arvoinen. Silloin ajatus Metildestä alkoi kasvaa: brändi, joka panostaa puhtauteen ja läpinäkyvyyteen ja jossa asiakas saa sen, mistä maksaa – eikä mitään muuta.",
          ],
        },
        {
          title: "Kestotilaus, jonka pitäisi toimia paremmin",
          body: [
            "Toinen ärsyttävä asia oli, että ravintolisiä ei juuri voinut tilata kestotilauksena. Tarjolla oli joko hankalia sopimuksia irtisanomisaikoineen tai ratkaisuja, joissa tilaaminen piti muistaa itse.",
            "Siksi Metilde rakensi kestotilauksen, joka on oikeasti reilu: 15 % edullisempi hinta, ilmainen toimitus ja mahdollisuus keskeyttää, vaihtaa tai lopettaa milloin tahansa. Ei sitoutumisaikaa, ei piilomaksuja.",
          ],
        },
        {
          title: "Matildasta Metildeksi",
          body: [
            "Kun oli aika valita nimi, ensimmäinen vaihtoehto oli itsestään selvä. Kaikki \"Matilda\"-verkkotunnukset olivat jo varattuja, joten nimeksi tuli jotain lähellä olevaa – vähän yksinkertaisempaa, vähän puhtaampaa. Metilde.com oli vapaana, ja nimi tuntui heti oikealta.",
          ],
        },
        {
          title: "Seuraava askel: valikoiman kasvattaminen",
          body: [
            "Emme lisää uusia tuotteita vain siksi, että se näyttää hyvältä. Jokaisen uutteen pitää olla valikoimassa, koska sillä on tarkoitus, se on aidosti laadukas ja täyttää samat vaatimukset, jotka asetimme ensimmäisestä päivästä lähtien.",
          ],
        },
      ],
      valuesEyebrow: "Arvot",
      valuesTitle: "Mitä edustamme",
      values: [
        ["Ei turhaa monimutkaisuutta", "Kerromme tarkalleen, mitä jokainen tuote sisältää. Ei täytettä, ei piilotettuja lisäaineita."],
        ["Saat sen, mistä maksat", "Raaka-aineet, kapselit, pakkaus. Niihin käytämme rahamme – emme kalliisiin mainoskampanjoihin."],
        ["Kestotilaus, joka toimii", "15 % alennus, ilmainen toimitus ja täysi hallinta. Keskeytä, vaihda tai lopeta milloin haluat."],
        ["Ruotsalainen brändi", "Valikoima kehitetään Ruotsissa, ja jokainen tilaus lähetetään varastostamme Timråsta."],
      ],
      companyEyebrow: "Yritys",
      companyTitle: "Tietoa yrityksestä",
      companyIntro: (legalName) =>
        `Metildeä ylläpitää ${legalName}. Täältä löydät yrityksemme täydelliset tiedot – haluamme, että tiedät aina, keneltä ostat.`,
      legalName: "Virallinen nimi",
      customerService: "Asiakaspalvelu",
      ctaTitle: "Olemme vasta alussa",
      ctaText:
        "Metilde on nuori brändi, mutta tavoite on selvä: kasvattaa valikoimaa ja tulla merkittäväksi toimijaksi puhtaiden kasviperäisten ravintolisien markkinoilla. Teemme sen olemalla rehellisiä, pitämällä laadun korkeana ja kuuntelemalla asiakkaitamme.",
      ctaProducts: "Tutustu tuotteisiin",
      ctaSubscription: "Lue kestotilauksesta",
    },
  },
  da: {
    shippingTable: {
      destination: "Destination",
      method: "Fragtmetode",
      time: "Leveringstid",
      cost: "Pris",
      days: (from, to) => `${from}–${to} hverdage`,
      freeOver: (price, freeOver) => `${price} – fri fragt over ${freeOver}`,
    },
    company: {
      legalEntity: "Juridisk enhed",
      orgNumber: "Organisationsnummer",
      vatId: "Momsregistreringsnummer",
      address: "Adresse",
      email: "E-mail",
      phone: "Telefon",
      hours: "man–fre 09.00–17.00",
      sweden: "Sverige",
      logistics: (logistics, orgNumber, address, seller) =>
        `Lager, pakning, levering og returnering varetages af ${logistics} (svensk org.nr. ${orgNumber}), ${address}, på vegne af ${seller}.`,
    },
    faq: {
      metaTitle: "Ofte stillede spørgsmål",
      metaDescription: "Svar på de mest almindelige spørgsmål om bestilling, betaling, fragt, returnering, abonnement og vores produkter.",
      title: "Ofte stillede spørgsmål",
      eyebrow: "Kundeservice",
      intro: "Her finder du svar på de mest almindelige spørgsmål om bestillinger, levering, abonnementer og vores produkter.",
      categories: "Kategorier",
      moreTitle: "Fandt du ikke svar?",
      moreBefore: "Vores kundeservice svarer på hverdage kl. 9–17 og vender normalt tilbage inden for en hverdag. Skriv til",
      moreOr: "eller ring på",
      languages: "Kundeservice svarer på svensk og engelsk.",
      contact: "Kontakt os",
      trackOrder: "Spor din ordre",
    },
    contact: {
      metaTitle: "Kontakt os",
      metaDescription: "Har du et spørgsmål om din ordre, et produkt eller dit abonnement? Metildes kundeservice svarer inden for 1–2 hverdage.",
      title: "Kontakt os",
      eyebrow: "Kundeservice",
      intro: "Vi svarer normalt inden for 1–2 hverdage. Drejer det sig om en igangværende ordre, går det hurtigst, hvis du oplyser dit ordrenummer.",
      languages: "Kundeservice svarer på svensk og engelsk.",
      formTitle: "Send en besked",
      otherWays: "Andre måder at kontakte os på",
      email: "E-mail",
      phone: "Telefon",
      swedishTime: "svensk tid",
      companyInfo: "Virksomhedsoplysninger",
      trackTitle: "Vil du bare vide, hvor pakken er?",
      trackText: "Spor din levering direkte med ordrenummer og e-mail.",
      trackLink: "Spor din ordre",
      faqTitle: "Hurtige svar",
      faqText: "Mange spørgsmål om fragt, returnering og abonnement er allerede besvaret under ofte stillede spørgsmål.",
      faqLink: "Til ofte stillede spørgsmål",
    },
    story: {
      metaTitle: "Vores historie – sådan startede Metilde",
      metaDescription:
        "Metilde startede med en enkel frustration: for få rene kosttilskud uden besvær. Læs om, hvordan brandet blev grundlagt, og hvorfor abonnement var en selvfølge.",
      title: "Vores historie",
      eyebrow: "Om Metilde",
      intro:
        "Metilde blev født af en frustration, som mange kender: Hvorfor skal det være så svært at finde rene kosttilskud uden besvær? Det var det spørgsmål, der fik Matilda til at lægge alt andet til side og bygge brandet op fra bunden.",
      sections: [
        {
          title: "Der manglede noget på hylden",
          body: [
            "Matilda havde længe brugt kosttilskud, men jo mere hun satte sig ind i det, desto mere frustreret blev hun. Mange produkter var fulde af fyldstoffer, sødestoffer og ingredienser, der ikke tilførte noget. Samtidig var priserne ofte høje for produkter, der ikke engang indeholdt det, de lovede.",
            "Der var masser af brands, der talte om sundhed og velvære, men få forklarede, hvorfor produktet faktisk var sin pris værd. Det var der, idéen om Metilde begyndte at vokse: et brand, der satser på renhed og gennemsigtighed, hvor kunden får det, der betales for, og intet andet.",
          ],
        },
        {
          title: "Abonnement, der burde fungere bedre",
          body: [
            "En anden ting, der irriterede, var, at der næsten ikke fandtes nogen måde at abonnere på kosttilskud. Det, der fandtes, var enten besværlige abonnementer med opsigelsesvarsel eller løsninger, hvor man selv skulle huske at bestille.",
            "Metilde byggede derfor et abonnement, der faktisk er fair: 15 % lavere pris, fri fragt og mulighed for at sætte på pause, skifte eller opsige når som helst. Ingen binding, ingen skjulte gebyrer.",
          ],
        },
        {
          title: "Fra Matilda til Metilde",
          body: [
            "Da det blev tid til at vælge navn, var det første valg indlysende. Alle domæner med \"Matilda\" var allerede taget, så det måtte blive noget, der lå tæt på – lidt enklere, lidt renere. Metilde.com var ledigt, og navnet føltes straks rigtigt.",
          ],
        },
        {
          title: "Næste skridt: et større sortiment",
          body: [
            "Vi kommer ikke til at smide nye produkter på hylden, bare fordi det ser godt ud. Hvert ekstrakt skal være der, fordi det har et formål, har ægte kvalitet og lever op til de samme krav, som vi satte fra dag ét.",
          ],
        },
      ],
      valuesEyebrow: "Værdier",
      valuesTitle: "Det står vi for",
      values: [
        ["Intet besvær", "Vi oplyser præcis, hvad hvert produkt indeholder. Intet fyld, ingen skjulte tilsætningsstoffer."],
        ["Du får det, du betaler for", "Råvarer, kapsler, emballage. Det er dér, vi bruger pengene – ikke på dyre reklamekampagner."],
        ["Abonnement for alvor", "15 % rabat, fri fragt og fuld kontrol. Sæt på pause, skift eller opsig, når du vil."],
        ["Svensk brand", "Sortimentet udvikles i Sverige, og hver ordre sendes fra vores lager i Timrå."],
      ],
      companyEyebrow: "Virksomheden",
      companyTitle: "Om virksomheden",
      companyIntro: (legalName) =>
        `Metilde drives af ${legalName}. Her finder du vores fulde virksomhedsoplysninger – vi vil have, at du altid ved, hvem du handler med.`,
      legalName: "Juridisk navn",
      customerService: "Kundeservice",
      ctaTitle: "Vi er kun lige begyndt",
      ctaText:
        "Metilde er et ungt brand, men ambitionen er klar: at udvide sortimentet og blive en stor aktør på markedet for rene, botaniske kosttilskud. Det gør vi ved at være ærlige, holde en høj kvalitet og lytte til vores kunder.",
      ctaProducts: "Opdag produkterne",
      ctaSubscription: "Læs om abonnement",
    },
  },
  nl: {
    shippingTable: {
      destination: "Bestemming",
      method: "Verzendmethode",
      time: "Levertijd",
      cost: "Kosten",
      days: (from, to) => `${from}–${to} werkdagen`,
      freeOver: (price, freeOver) => `${price} – gratis verzending vanaf ${freeOver}`,
    },
    company: {
      legalEntity: "Rechtspersoon",
      orgNumber: "Organisatienummer",
      vatId: "Btw-identificatienummer",
      address: "Adres",
      email: "E-mail",
      phone: "Telefoon",
      hours: "ma–vr 9.00–17.00 (Zweedse tijd)",
      sweden: "Zweden",
      logistics: (logistics, orgNumber, address, seller) =>
        `Opslag, verpakking, levering en retouren worden verzorgd door ${logistics} (Zweeds org.nr. ${orgNumber}), ${address}, namens ${seller}.`,
    },
    faq: {
      metaTitle: "Veelgestelde vragen",
      metaDescription: "Antwoorden op de meest gestelde vragen over bestellen, betalen, verzending, retourneren, abonnementen en onze producten.",
      title: "Veelgestelde vragen",
      eyebrow: "Klantenservice",
      intro: "Hier vind je antwoorden op de meest gestelde vragen over bestellingen, levering, abonnementen en onze producten.",
      categories: "Categorieën",
      moreTitle: "Geen antwoord gevonden?",
      moreBefore: "Onze klantenservice is op werkdagen bereikbaar van 9 tot 17 uur (Zweedse tijd) en reageert meestal binnen één werkdag. Mail naar",
      moreOr: "of bel",
      languages: "Onze klantenservice antwoordt in het Zweeds en Engels.",
      contact: "Neem contact op",
      trackOrder: "Volg je bestelling",
    },
    contact: {
      metaTitle: "Contact",
      metaDescription: "Heb je een vraag over je bestelling, een product of je abonnement? De klantenservice van Metilde reageert binnen 1–2 werkdagen.",
      title: "Neem contact op",
      eyebrow: "Klantenservice",
      intro: "We reageren meestal binnen 1–2 werkdagen. Gaat het om een lopende bestelling, vermeld dan je bestelnummer – dan gaat het het snelst.",
      languages: "Onze klantenservice antwoordt in het Zweeds en Engels.",
      formTitle: "Stuur een bericht",
      otherWays: "Andere manieren om ons te bereiken",
      email: "E-mail",
      phone: "Telefoon",
      swedishTime: "Zweedse tijd",
      companyInfo: "Bedrijfsgegevens",
      trackTitle: "Wil je alleen weten waar je pakket is?",
      trackText: "Volg je levering direct met je bestelnummer en e-mailadres.",
      trackLink: "Volg je bestelling",
      faqTitle: "Snelle antwoorden",
      faqText: "Veel vragen over verzending, retourneren en abonnementen worden al beantwoord bij de veelgestelde vragen.",
      faqLink: "Naar veelgestelde vragen",
    },
    story: {
      metaTitle: "Ons verhaal – zo is Metilde begonnen",
      metaDescription:
        "Metilde begon met een simpele frustratie: te weinig pure voedingssupplementen zonder gedoe. Lees hoe het merk is opgericht en waarom een abonnement vanzelfsprekend was.",
      title: "Ons verhaal",
      eyebrow: "Over Metilde",
      intro:
        "Metilde is ontstaan uit een frustratie die veel mensen herkennen: waarom is het zo moeilijk om pure voedingssupplementen zonder gedoe te vinden? Die vraag zette Matilda ertoe aan om al het andere opzij te leggen en het merk vanaf de grond op te bouwen.",
      sections: [
        {
          title: "Er ontbrak iets in het schap",
          body: [
            "Matilda gebruikte al lange tijd voedingssupplementen, maar hoe meer ze erover las, hoe gefrustreerder ze werd. Veel producten zaten vol vulstoffen, zoetstoffen en ingrediënten die niets toevoegden. Tegelijk waren de prijzen vaak hoog voor producten die niet eens bevatten wat ze beloofden.",
            "Er waren genoeg merken die over gezondheid en welzijn praatten, maar weinig die uitlegden waarom een product zijn prijs echt waard was. Daar begon het idee van Metilde te groeien: een merk dat inzet op zuiverheid en transparantie, waarbij de klant krijgt waarvoor hij betaalt en niets anders.",
          ],
        },
        {
          title: "Een abonnement dat beter zou moeten werken",
          body: [
            "Iets anders wat stoorde, was dat er bijna geen manier was om je op voedingssupplementen te abonneren. Wat er was, waren ofwel ingewikkelde abonnementen met opzegtermijnen, ofwel oplossingen waarbij je er zelf aan moest denken om te bestellen.",
            "Daarom bouwde Metilde een abonnement dat echt eerlijk is: 15% lagere prijs, gratis verzending en de mogelijkheid om op elk moment te pauzeren, te wijzigen of op te zeggen. Geen minimale looptijd, geen verborgen kosten.",
          ],
        },
        {
          title: "Van Matilda naar Metilde",
          body: [
            "Toen het tijd was om een naam te kiezen, lag de eerste keuze voor de hand. Alle domeinen met \"Matilda\" waren al bezet, dus het werd iets wat er dichtbij lag – iets eenvoudiger, iets zuiverder. Metilde.com was nog vrij, en de naam voelde meteen goed.",
          ],
        },
        {
          title: "Volgende stap: het assortiment uitbreiden",
          body: [
            "We gaan geen nieuwe producten toevoegen alleen omdat het er goed uitziet. Elk extract moet er zijn omdat het een doel heeft, echte kwaliteit heeft en voldoet aan dezelfde eisen die we vanaf dag één hebben gesteld.",
          ],
        },
      ],
      valuesEyebrow: "Waarden",
      valuesTitle: "Waar we voor staan",
      values: [
        ["Geen gedoe", "We vermelden precies wat elk product bevat. Geen opvulling, geen verborgen toevoegingen."],
        ["Je krijgt waarvoor je betaalt", "Grondstoffen, capsules, verpakking. Daar gaat ons geld naartoe – niet naar dure reclamecampagnes."],
        ["Een echt abonnement", "15% korting, gratis verzending en volledige controle. Pauzeren, wijzigen of opzeggen wanneer je wilt."],
        ["Zweeds merk", "Het assortiment wordt in Zweden ontwikkeld en elke bestelling wordt verzonden vanuit ons magazijn in Timrå."],
      ],
      companyEyebrow: "Het bedrijf",
      companyTitle: "Over het bedrijf",
      companyIntro: (legalName) =>
        `Metilde wordt gerund door ${legalName}. Hier vind je onze volledige bedrijfsgegevens – we willen dat je altijd weet bij wie je koopt.`,
      legalName: "Juridische naam",
      customerService: "Klantenservice",
      ctaTitle: "We staan pas aan het begin",
      ctaText:
        "Metilde is een jong merk, maar de ambitie is duidelijk: het assortiment uitbreiden en een grote speler worden op de markt voor pure, botanische voedingssupplementen. Dat doen we door eerlijk te zijn, een hoge kwaliteit te leveren en naar onze klanten te luisteren.",
      ctaProducts: "Ontdek de producten",
      ctaSubscription: "Lees over abonnementen",
    },
  },
};
