import type { ProductContent } from "@/content/product-content";

/**
 * Tuotesivujen sisältö suomeksi (fi-FI). Käännetty tiedostosta src/content/product-content.ts.
 * Ei terveysväitteitä – vain kasvitiede, alkuperä, uutto, muoto, annostus ja perinteinen käyttö.
 */

const developedInSweden = {
  heading: "Kehitetty Ruotsissa",
  body:
    "Metilde on ruotsalainen tuotemerkki. Valikoimamme kehitetään Ruotsissa, ja jokainen tilaus lähetetään varastostamme Timråsta, Ruotsista. Pakkaus on kierrekorkillinen muovipurkki, joka pitää sisällön kuivana annosten välillä.",
};

export const productContent: Record<string, ProductContent> = {
  "tongkat-ali-elite": {
    eyebrow: "Eurycoma longifolia · 200:1-juuriuute",
    headline: "Puhdasta juurta, 450 mg kapselissa",
    intro:
      "Tongkat Ali Elite on tiivistetty 200:1-uute Eurycoma longifolian juuresta – kasvia kutsutaan myös nimillä Malaysian Ginseng ja Longjack. Kehitetty Ruotsissa, vegaanisessa kapselissa, ilman lisäaineita.",
    highlights: [
      { label: "Uute", value: "200:1" },
      { label: "Kapselissa", value: "450 mg" },
      { label: "Kapseleita", value: "60 kpl" },
    ],
    story: [
      {
        heading: "Juuri",
        body:
          "Lähtökohtana ovat huolella valitut Eurycoma longifolian juuret – kasvitieteellinen raaka-aine, jolla on pitkä perinne Kaakkois-Aasiassa. Juuri kuivataan, jauhetaan ja tiivistetään 200:1-uutteeksi: 200 osaa kuivattua juurta tuottaa 1 osan uutetta.",
      },
      {
        heading: "Puhdas koostumus",
        body:
          "Vain juuriuutetta kasvipohjaisessa kapselikuoressa. Vegaaninen, gluteeniton ja GMO-vapaa – ei sidosaineita, täyteaineita, makeutusaineita tai keinotekoisia säilöntäaineita.",
      },
      developedInSweden,
    ],
    specs: [
      { label: "Latinalainen nimi", value: "Eurycoma longifolia" },
      { label: "Käytetty kasvinosa", value: "Juuri" },
      { label: "Uutteen vahvuus", value: "200:1" },
      { label: "Kapselissa", value: "450 mg juuriuutetta" },
      { label: "Päiväannos", value: "1 kapseli päivässä" },
      { label: "Sisältö", value: "60 kapselia – 60 päivää" },
      { label: "Kapseli", value: "Vegaaninen (HPMC)" },
      { label: "Kehitetty", value: "Ruotsissa" },
    ],
    ingredients:
      "Tongkat Ali -uute (Eurycoma longifolia, juuri) 200:1, kapselikuori (HPMC). Yhdessä kapselissa: Tongkat Ali -uutetta (200:1) 450 mg.",
    usage: [
      "1 kapseli päivässä vesilasillisen kanssa.",
      "Älä ylitä suositeltua päivittäistä annosta.",
      "Säilytä kuivassa huoneenlämmössä. Sulje purkki huolellisesti jokaisen käytön jälkeen.",
      "Säilytä pienten lasten ulottumattomissa.",
    ],
    faq: [
      {
        q: "Mitä 200:1 tarkoittaa?",
        a: "Sitä, että 200 osaa kuivattua juurta on tiivistetty 1 osaksi uutetta. Se kertoo tiivistysasteesta, ei mistään muusta.",
      },
      {
        q: "Kuinka kauan yksi purkki riittää?",
        a: "60 kapselia ja 1 kapseli päivässä riittää 60 päiväksi.",
      },
      {
        q: "Onko kapseli vegaaninen?",
        a: "Kyllä. Kapselikuori on kasvipohjainen (HPMC), ja tuote on gluteeniton ja GMO-vapaa.",
      },
      {
        q: "Sisältääkö tuote täyteaineita?",
        a: "Ei. Vain juuriuutetta ja kapselikuori – ei sidosaineita, makeutusaineita tai keinotekoisia säilöntäaineita.",
      },
    ],
  },

  "tongkat-premium": {
    eyebrow: "Eurycoma longifolia · 200:1, 20 mg eurykomanonia",
    headline: "Standardoitu eurykomanoniin",
    intro:
      "Tongkat Ali Ultra 4% on 200:1-juuriuute Eurycoma longifoliasta – 520 mg kapselissa, josta 20 mg eurykomanonia. 60 kapselia purkissa. Älä ota tyhjään vatsaan.",
    highlights: [
      { label: "Uute", value: "200:1" },
      { label: "Kapselissa", value: "520 mg" },
      { label: "Kapseleita", value: "60 kpl" },
    ],
    story: [
      {
        heading: "Juuri",
        body:
          "Lähtökohtana ovat huolella valitut Eurycoma longifolian juuret – kasvia kutsutaan myös nimillä Malaysian Ginseng ja Longjack – kasvitieteellinen raaka-aine, jolla on pitkä perinne Kaakkois-Aasiassa. Juuri tiivistetään 200:1-uutteeksi.",
      },
      {
        heading: "20 mg eurykomanonia kapselissa",
        body:
          "Jokainen erä standardoidaan eurykomanonipitoisuuden mukaan, joten jokainen 520 mg:n kapseli sisältää 20 mg eurykomanonia. Näin vahvuus pysyy tasaisena erästä toiseen. Yksi kapseli päivässä.",
      },
      developedInSweden,
    ],
    specs: [
      { label: "Latinalainen nimi", value: "Eurycoma longifolia" },
      { label: "Käytetty kasvinosa", value: "Juuri" },
      { label: "Uutteen vahvuus", value: "200:1, standardoitu eurykomanoniin" },
      { label: "Kapselissa", value: "520 mg juuriuutetta (20 mg eurykomanonia)" },
      { label: "Päiväannos", value: "1 kapseli päivässä" },
      { label: "Sisältö", value: "60 kapselia – 60 päivää" },
      { label: "Pakkaus", value: "Kierrekorkillinen muovipurkki" },
      { label: "Kapseli", value: "Vegaaninen (HPMC)" },
      { label: "Kehitetty", value: "Ruotsissa" },
    ],
    ingredients:
      "Tongkat Ali -uute (Eurycoma longifolia, juuri) 200:1, kapselikuori (HPMC). Yhdessä kapselissa: Tongkat Ali -uutetta (200:1) 520 mg, josta eurykomanonia 20 mg.",
    usage: [
      "1 kapseli päivässä vesilasillisen kanssa.",
      "Älä ota tyhjään vatsaan – uute on hyvin vahva.",
      "Älä ylitä suositeltua päivittäistä annosta.",
      "Säilytä kuivassa huoneenlämmössä. Sulje purkki huolellisesti jokaisen käytön jälkeen.",
      "Säilytä pienten lasten ulottumattomissa.",
    ],
    faq: [
      {
        q: "Kuinka paljon eurykomanonia yksi kapseli sisältää?",
        a: "20 mg eurykomanonia 520 mg:ssa uutetta. Pitoisuus tarkistetaan jokaisesta erästä, jotta vahvuus pysyy tasaisena.",
      },
      {
        q: "Mitä eroa on Ultra 4%:lla ja Elitellä?",
        a: "Elite on 200:1-juuriuute, 450 mg kapselissa, eikä sitä ole standardoitu eurykomanoniin. Ultra 4% sisältää 520 mg kapselissa, josta 20 mg eurykomanonia.",
      },
      {
        q: "Kuinka kauan yksi purkki riittää?",
        a: "60 kapselia ja 1 kapseli päivässä riittää 60 päiväksi.",
      },
      {
        q: "Sisältääkö tuote täyteaineita?",
        a: "Ei. Vain juuriuutetta ja vegaaninen kapselikuori – ei sidosaineita, täyteaineita tai keinotekoisia säilöntäaineita.",
      },
    ],
  },

  "fadogia-agrestis": {
    eyebrow: "Fadogia agrestis · 20:1-yrttiuute",
    headline: "Puhdasta kasvia, 450 mg kapselissa",
    intro:
      "20:1-uute Fadogia agrestiksesta, pensaasta, jolla on pitkä perinne länsiafrikkalaisessa yrttikäytössä. 450 mg kapselissa, vegaaninen kapseli – ilman lisäaineita. Kehitetty Ruotsissa.",
    highlights: [
      { label: "Uute", value: "20:1" },
      { label: "Kapselissa", value: "450 mg" },
      { label: "Kapseleita", value: "60 kpl" },
    ],
    story: [
      {
        heading: "Kasvi",
        body:
          "Fadogia agrestis on pensas, joka kasvaa osissa Afrikkaa ja jolla on pitkään ollut vakiintunut paikka perinteisissä yrttivalmisteissa. Käytämme huolella valittuja kasvinosia, jotka tiivistetään 20:1-uutteeksi – jotta vahvuus on tasainen jokaisessa kapselissa.",
      },
      {
        heading: "Puhdas koostumus",
        body:
          "Vain Fadogia agrestis -uutetta kasvipohjaisessa kapselikuoressa. Vegaaninen, gluteeniton ja GMO-vapaa – ei sidosaineita, täyteaineita tai keinotekoisia säilöntäaineita.",
      },
      developedInSweden,
    ],
    specs: [
      { label: "Latinalainen nimi", value: "Fadogia agrestis" },
      { label: "Uutteen vahvuus", value: "20:1" },
      { label: "Kapselissa", value: "450 mg uutetta" },
      { label: "Päiväannos", value: "1 kapseli päivässä" },
      { label: "Sisältö", value: "60 kapselia – 60 päivää" },
      { label: "Kapseli", value: "Vegaaninen (HPMC)" },
      { label: "Kehitetty", value: "Ruotsissa" },
    ],
    ingredients:
      "Fadogia agrestis -uute 20:1, kapselikuori (HPMC). Yhdessä kapselissa: Fadogia agrestis -uutetta (20:1) 450 mg.",
    usage: [
      "1 kapseli päivässä vesilasillisen kanssa.",
      "Älä ylitä suositeltua päivittäistä annosta.",
      "Säilytä kuivassa huoneenlämmössä. Sulje purkki huolellisesti jokaisen käytön jälkeen.",
      "Säilytä pienten lasten ulottumattomissa.",
    ],
    faq: [
      {
        q: "Mitä 20:1 tarkoittaa?",
        a: "Sitä, että 20 osaa kuivattua kasviraaka-ainetta on tiivistetty 1 osaksi uutetta. Se kertoo tiivistysasteesta, ei mistään muusta.",
      },
      {
        q: "Voinko yhdistää sen Tongkat Aliin?",
        a: "Moni tekee niin. Noudata kummankin tuotteen suositeltua päivittäistä annosta.",
      },
      {
        q: "Kuinka kauan yksi purkki riittää?",
        a: "60 kapselia ja 1 kapseli päivässä riittää 60 päiväksi.",
      },
      {
        q: "Sisältääkö tuote täyteaineita?",
        a: "Ei. Vain uutetta ja vegaaninen kapselikuori – ei sidosaineita, makeutusaineita tai keinotekoisia säilöntäaineita.",
      },
    ],
  },

  "blue-lotus": {
    eyebrow: "Nymphaea caerulea · 200:1-uute",
    headline: "Niilin pyhä kukka, 400 mg kapselissa",
    intro:
      "Tiivistetty 200:1-uute Blue Lotuksesta. Puhdas raaka-aine ilman lisäaineita, täyteaineita tai keinotekoisia aineita, vegaanisessa kapselissa.",
    highlights: [
      { label: "Uute", value: "200:1" },
      { label: "Kapselissa", value: "400 mg" },
      { label: "Päiväannos", value: "1–2 kapselia" },
    ],
    story: [
      {
        heading: "Pyhä kasvi muinaisessa Egyptissä",
        body:
          "Blue Lotus (Nymphaea caerulea), sininen lootus, kasvoi luonnonvaraisena Niilin rannoilla muinaisessa Egyptissä. Siellä sillä oli pyhä asema, ja sitä kuvattiin usein hieroglyfeissä ja temppelimaalauksissa.",
      },
      {
        heading: "Erittäin pitkälle tiivistetty",
        body:
          "Uutteemme on 200:1-tiiviste, eli 200 osaa kuivattua kukkaa on tiivistetty 1 osaksi uutetta. Puhdas raaka-aine – ilman lisäaineita, täyteaineita tai keinotekoisia aineita.",
      },
      {
        heading: "Perinne ja nykyaikainen puhtaus",
        body:
          "Vain kukkauutetta kasvipohjaisessa, merilevään pohjautuvasta selluloosasta valmistetussa kapselikuoressa. Vegaaninen, ilman turhia lisäaineita, ja laatu tarkastettu eurooppalaisten turvallisuusvaatimusten mukaisesti.",
      },
    ],
    specs: [
      { label: "Latinalainen nimi", value: "Nymphaea caerulea" },
      { label: "Uutteen vahvuus", value: "200:1" },
      { label: "Kapselissa", value: "400 mg uutetta" },
      { label: "Päiväannos", value: "1–2 kapselia (400–800 mg)" },
      { label: "Kapseli", value: "Vegaaninen (HPMC)" },
      { label: "Lisäaineet", value: "Ei lisäaineita" },
    ],
    ingredients:
      "Blue Lotus -uute (Nymphaea caerulea) 200:1, kasvipohjainen kapseli (HPMC). Yhdessä kapselissa: 400 mg sinisen lootuksen uutetta. 2 kapselissa: 800 mg sinisen lootuksen uutetta.",
    usage: [
      "1–2 kapselia päivässä veden kanssa.",
      "Älä ylitä suositeltua päivittäistä annosta.",
      "Ei alle 18-vuotiaiden käyttöön eikä alle 18-vuotiaiden ostettavaksi.",
      "Keskustele terveydenhuollon ammattilaisen kanssa, jos olet raskaana, imetät tai olet lääkärin seurannassa.",
      "Säilytä kuivassa huoneenlämmössä, pienten lasten ulottumattomissa.",
    ],
    faq: [
      {
        q: "Mitä 200:1 tarkoittaa?",
        a: "Sitä, että 200 osaa kuivattua kukkaa on tiivistetty 1 osaksi uutetta. Se kertoo tiivistysasteesta, ei mistään muusta.",
      },
      {
        q: "Sisältääkö tuote lisäaineita?",
        a: "Ei. Vain Blue Lotus -uutetta ja kasvipohjainen kapselikuori – ei täyteaineita tai keinotekoisia aineita.",
      },
      {
        q: "Onko tuote vegaaninen?",
        a: "Kyllä, kapselikuori on kasvipohjainen (merilevään pohjautuva selluloosa).",
      },
      {
        q: "Mihin aikaan päivästä sitä otetaan?",
        a: "Ajankohdan voit valita itse. Moni valitsee illan rutiininsa vakiokohdaksi.",
      },
    ],
  },

  "black-tongkat": {
    eyebrow: "Eurycoma longifolia · tumma juuri, 200:1",
    headline: "Tumma juuri – 200:1 vegaanisessa kapselissa",
    intro:
      "Black Tongkat Ali on 200:1-juuriuute Eurycoma longifoliasta – samaa lajia kuin keltainen Tongkat Ali -tuotteemme, mutta valmistettu tummasta juuresta. 500 mg kapselissa. Suositeltu annos on 1–2 kapselia päivässä.",
    highlights: [
      { label: "Uute", value: "200:1" },
      { label: "Kapselissa", value: "500 mg" },
      { label: "Annostus", value: "1–2 kapselia/pv" },
    ],
    story: [
      {
        heading: "Sama laji, tummempi juuri",
        body:
          "Black Tongkat Ali on Eurycoma longifolia, aivan kuten keltainenkin. Ero on raaka-aineessa: uute valmistetaan tummasta juuresta. Ilmoitamme purkissa aina latinalaisen nimen, jotta tiedät tarkalleen, mitä ostat.",
      },
      {
        heading: "Juuri, tiivistetty 200:1",
        body:
          "200 osaa kuivattua juurta tiivistetään yhdeksi osaksi uutetta. Käytämme vain juurta – ei kuorta, ei vartta, ei lehtiä. Juuriuute tulee Kaakkois-Aasiasta, kasvin kotiseudulta.",
      },
      {
        heading: "Puhdas kapseli, selkeä annostus",
        body:
          "Jokainen kapseli sisältää 500 mg uutetta kasvipohjaisessa kuoressa (HPMC). Ei täyteaineita, ei valumisenestoaineita, ei väriaineita. Suositeltu annos on 1–2 kapselia päivässä.",
      },
    ],
    specs: [
      { label: "Latinalainen nimi", value: "Eurycoma longifolia" },
      { label: "Käytetty kasvinosa", value: "Juuri" },
      { label: "Uutteen vahvuus", value: "200:1" },
      { label: "Kapselissa", value: "500 mg uutetta" },
      { label: "Päiväannos", value: "1–2 kapselia (500–1 000 mg)" },
      { label: "Sisältö", value: "60 kapselia – 30–60 päivää" },
      { label: "Kapselikuori", value: "Kasvipohjainen (HPMC)" },
      { label: "Pakkaus", value: "Kierrekorkillinen muovipurkki" },
      { label: "Kehitetty", value: "Ruotsissa" },
    ],
    ingredients:
      "Tongkat Ali -uute (Eurycoma longifolia, juuri) 200:1, kapselikuori (HPMC). Yhdessä kapselissa: Tongkat Ali -uutetta (200:1) 500 mg.",
    usage: [
      "1–2 kapselia päivässä vesilasillisen kanssa.",
      "Otetaan mieluiten aterian yhteydessä, samaan aikaan joka päivä.",
      "Älä ylitä suositeltua päivittäistä annosta.",
      "Säilytä kuivassa huoneenlämmössä ja pienten lasten ulottumattomissa.",
    ],
    faq: [
      {
        q: "Mitä eroa on tavalliseen (keltaiseen) Tongkat Aliin?",
        a: "Molemmat ovat Eurycoma longifoliaa. Black Tongkat Ali valmistetaan tummasta juuresta, ja sitä otetaan 1–2 kapselia päivässä. Keltaisessa Elite-tuotteessamme on 450 mg kapselissa, ja sitä otetaan 1 kapseli päivässä.",
      },
      {
        q: "Mitä 200:1 tarkoittaa?",
        a: "Sitä, että 200 osaa kuivattua juurta on tiivistetty 1 osaksi uutetta. Se kertoo tiivistysasteesta.",
      },
      {
        q: "Montako kapselia minun pitäisi ottaa?",
        a: "1–2 kapselia päivässä. 60 kapselin purkki riittää 30 päiväksi 2 kapselilla päivässä tai 60 päiväksi 1 kapselilla.",
      },
      {
        q: "Sisältääkö tuote täyteaineita, ja onko se vegaaninen?",
        a: "Ei täyteaineita. Kapseli sisältää juuriuutetta ja kasvipohjaisen HPMC-kapselikuoren, joten se on vegaaninen.",
      },
    ],
  },

  maca: {
    eyebrow: "Lepidium meyenii · 20:1-juuriuute",
    headline: "Macajuuri, 470 mg kapselissa",
    intro:
      "Maca on tiivistetty 20:1-uute Lepidium meyenii -kasvin juuresta – juurikasvista, jolla on pitkä perinne Andeilla. 60 kapselia, vegaaninen kapselikuori ilman lisäaineita.",
    highlights: [
      { label: "Uute", value: "20:1" },
      { label: "Kapselissa", value: "470 mg" },
      { label: "Kapseleita", value: "60 kpl" },
    ],
    story: [
      {
        heading: "Juuri",
        body:
          "Macaa (Lepidium meyenii) viljellään korkealla Andeilla, ja sitä on käytetty perulaisessa yrttiperinteessä sukupolvien ajan. Juuri kuivataan, jauhetaan ja tiivistetään standardoiduksi 20:1-uutteeksi: 20 osaa kuivattua juurta tuottaa 1 osan uutetta.",
      },
      {
        heading: "Puhdas koostumus",
        body:
          "Vain macajuuriuutetta kasvipohjaisessa kapselikuoressa. Vegaaninen, gluteeniton ja GMO-vapaa – ei sidosaineita, täyteaineita, makeutusaineita tai keinotekoisia säilöntäaineita.",
      },
      developedInSweden,
    ],
    specs: [
      { label: "Latinalainen nimi", value: "Lepidium meyenii" },
      { label: "Käytetty kasvinosa", value: "Juuri" },
      { label: "Uutteen vahvuus", value: "20:1" },
      { label: "Kapselissa", value: "470 mg juuriuutetta" },
      { label: "Päiväannos", value: "2 kapselia päivässä" },
      { label: "Sisältö", value: "60 kapselia – 30 päivää" },
      { label: "Kapseli", value: "Vegaaninen (HPMC)" },
      { label: "Kehitetty", value: "Ruotsissa" },
    ],
    ingredients:
      "Macauute (Lepidium meyenii, juuri) 20:1, kapselikuori (HPMC). Yhdessä kapselissa: macajuuriuutetta (20:1) 470 mg.",
    usage: [
      "2 kapselia päivässä vesilasillisen kanssa.",
      "Älä ylitä suositeltua päivittäistä annosta.",
      "Säilytä viileässä ja kuivassa. Sulje purkki huolellisesti jokaisen käytön jälkeen.",
      "Säilytä pienten lasten ulottumattomissa.",
    ],
    faq: [
      {
        q: "Mitä 20:1 tarkoittaa?",
        a: "Sitä, että 20 osaa kuivattua macajuurta on tiivistetty 1 osaksi uutetta. Se kertoo tiivistysasteesta, ei mistään muusta.",
      },
      {
        q: "Kuinka kauan yksi purkki riittää?",
        a: "60 kapselia ja 2 kapselia päivässä riittää 30 päiväksi.",
      },
      {
        q: "Onko kapseli vegaaninen?",
        a: "Kyllä. Kapselikuori on kasvipohjainen, ja tuote on gluteeniton ja GMO-vapaa.",
      },
      {
        q: "Sisältääkö tuote täyteaineita?",
        a: "Ei. Vain juuriuutetta ja kapselikuori – ei sidosaineita, makeutusaineita tai keinotekoisia säilöntäaineita.",
      },
    ],
  },

  mariatistel: {
    eyebrow: "Silybum marianum · 20:1, 80 % silymariinia",
    headline: "Maarianohdake, 350 mg kapselissa",
    intro:
      "Maarianohdake on 20:1-uute Silybum marianum -kasvista, standardoitu 80 % silymariiniin – 350 mg kapselissa. 60 kapselia vegaanisessa kapselikuoressa ilman lisäaineita.",
    highlights: [
      { label: "Uute", value: "20:1 · 80 %" },
      { label: "Kapselissa", value: "350 mg" },
      { label: "Kapseleita", value: "60 kpl" },
    ],
    story: [
      {
        heading: "Kasvi",
        body:
          "Maarianohdake (Silybum marianum) on Välimeren alueelta peräisin oleva ohdakekasvi, jolla on pitkä perinne eurooppalaisessa yrttikäytössä. Siemenet kuivataan ja uutetaan tiivisteeksi, joka on standardoitu 80 % silymariiniin – flavonoidikompleksiin, joka sisältää muun muassa isosilybiniiniä (n. 2,5 %), silikristiiniä (n. 10 %) ja silydianiinia (n. 7,5 %).",
      },
      {
        heading: "Puhdas koostumus",
        body:
          "Vain maarianohdakeuutetta kasvipohjaisessa pullulaanikapselissa. Vegaaninen, gluteeniton ja GMO-vapaa – ei sisällä laktoosia, soijaa, hiivaa, vehnää tai maitoa, eikä väriaineita, sidosaineita, täyteaineita tai keinotekoisia säilöntäaineita.",
      },
      developedInSweden,
    ],
    specs: [
      { label: "Latinalainen nimi", value: "Silybum marianum" },
      { label: "Käytetty kasvinosa", value: "Siemen" },
      { label: "Uutteen vahvuus", value: "20:1" },
      { label: "Standardointi", value: "80 % silymariinia" },
      { label: "Kapselissa", value: "350 mg uutetta" },
      { label: "Päiväannos", value: "1 kapseli päivässä" },
      { label: "Sisältö", value: "60 kapselia – 60 päivää" },
      { label: "Kapseli", value: "Vegaaninen (pullulaani)" },
      { label: "Kehitetty", value: "Ruotsissa" },
    ],
    ingredients:
      "Maarianohdakeuute (Silybum marianum, siemen) 20:1, standardoitu 80 % silymariiniin, kapselikuori (pullulaani). Yhdessä kapselissa: maarianohdakeuutetta 350 mg, josta silymariinia 280 mg.",
    usage: [
      "1 kapseli päivässä vesilasillisen kanssa.",
      "Älä ylitä suositeltua päivittäistä annosta.",
      "Säilytä viileässä ja kuivassa. Sulje purkki huolellisesti jokaisen käytön jälkeen.",
      "Säilytä pienten lasten ulottumattomissa.",
    ],
    faq: [
      {
        q: "Mitä 80 % silymariinia tarkoittaa?",
        a: "Sitä, että uute on standardoitu niin, että 80 % siitä on silymariini-flavonoidikompleksia. 350 mg:ssa uutetta se vastaa 280 mg:aa silymariinia.",
      },
      {
        q: "Mitä kasvinosaa käytetään?",
        a: "Maarianohdakkeen siemeniä, jotka kuivataan ja uutetaan 20:1-tiivisteeksi.",
      },
      {
        q: "Onko kapseli vegaaninen?",
        a: "Kyllä. Kapselikuori on kasvipohjaista pullulaania, ja tuote on gluteeniton ja GMO-vapaa.",
      },
      {
        q: "Kuinka kauan yksi purkki riittää?",
        a: "60 kapselia ja 1 kapseli päivässä riittää 60 päiväksi.",
      },
    ],
  },

  nasselblad: {
    eyebrow: "Urtica dioica · 10:1-lehtiuute",
    headline: "Nokkosenlehti, 430 mg kapselissa",
    intro:
      "Nokkosenlehti on 10:1-uute Urtica dioican lehdistä – 430 mg kapselissa. 60 kapselia vegaanisessa kapselikuoressa ilman lisäaineita.",
    highlights: [
      { label: "Uute", value: "10:1" },
      { label: "Kapselissa", value: "430 mg" },
      { label: "Kapseleita", value: "60 kpl" },
    ],
    story: [
      {
        heading: "Lehti",
        body:
          "Nokkosta (Urtica dioica) on käytetty eurooppalaisessa yrttiperinteessä vuosisatojen ajan. Käytämme lehtiä, jotka kuivataan ja tiivistetään 10:1-uutteeksi: 10 osaa kuivattua lehteä tuottaa 1 osan uutetta.",
      },
      {
        heading: "Puhdas koostumus",
        body:
          "Vain nokkosenlehtiuutetta kasvipohjaisessa kapselikuoressa. Vegaaninen, gluteeniton ja GMO-vapaa – ei sidosaineita, täyteaineita, makeutusaineita tai keinotekoisia säilöntäaineita.",
      },
      developedInSweden,
    ],
    specs: [
      { label: "Latinalainen nimi", value: "Urtica dioica" },
      { label: "Käytetty kasvinosa", value: "Lehti" },
      { label: "Uutteen vahvuus", value: "10:1" },
      { label: "Kapselissa", value: "430 mg uutetta" },
      { label: "Päiväannos", value: "1 kapseli päivässä" },
      { label: "Sisältö", value: "60 kapselia – 60 päivää" },
      { label: "Kapseli", value: "Vegaaninen" },
      { label: "Kehitetty", value: "Ruotsissa" },
    ],
    ingredients:
      "Nokkosenlehtiuute (Urtica dioica, lehti) 10:1, kapselikuori (kasvipohjainen). Yhdessä kapselissa: nokkosenlehtiuutetta 430 mg.",
    usage: [
      "1 kapseli päivässä vesilasillisen kanssa.",
      "Älä ylitä suositeltua päivittäistä annosta.",
      "Säilytä viileässä ja kuivassa. Sulje purkki huolellisesti jokaisen käytön jälkeen.",
      "Säilytä pienten lasten ulottumattomissa.",
    ],
    faq: [
      {
        q: "Mitä 10:1 tarkoittaa?",
        a: "Sitä, että 10 osaa kuivattua nokkosenlehteä on tiivistetty 1 osaksi uutetta. Se kertoo tiivistysasteesta, ei mistään muusta.",
      },
      {
        q: "Mitä kasvinosaa käytetään?",
        a: "Nokkosen lehtiä, jotka kuivataan ja uutetaan 10:1-tiivisteeksi.",
      },
      {
        q: "Onko kapseli vegaaninen?",
        a: "Kyllä. Kapselikuori on kasvipohjainen, ja tuote on gluteeniton ja GMO-vapaa.",
      },
      {
        q: "Kuinka kauan yksi purkki riittää?",
        a: "60 kapselia ja 1 kapseli päivässä riittää 60 päiväksi.",
      },
    ],
  },

  druvkarneextrakt: {
    eyebrow: "Vitis vinifera · 95 % OPC",
    headline: "Viinirypäleensiemenuute, 500 mg kapselissa",
    intro:
      "Viinirypäleensiemenuute on Vitis viniferan siemenistä valmistettu uute, joka on standardoitu 95 % proantosyanidiineihin (OPC) – 500 mg kapselissa. 60 kapselia vegaanisessa kapselikuoressa ilman lisäaineita.",
    highlights: [
      { label: "Standardointi", value: "95 % OPC" },
      { label: "Kapselissa", value: "500 mg" },
      { label: "Kapseleita", value: "60 kpl" },
    ],
    story: [
      {
        heading: "Siemen",
        body:
          "Viinirypälettä (Vitis vinifera) on viljelty Euroopassa ikimuistoisista ajoista. Käytämme siemeniä, jotka ovat luonnollinen polyfenolien lähde, ja uutamme niistä tiivisteen, joka on standardoitu 95 % proantosyanidiineihin – joita kutsutaan myös OPC:ksi.",
      },
      {
        heading: "Puhdas koostumus",
        body:
          "Vain viinirypäleensiemenuutetta kasvipohjaisessa kapselikuoressa. Vegaaninen, gluteeniton ja GMO-vapaa – ei sidosaineita, täyteaineita, makeutusaineita tai keinotekoisia säilöntäaineita.",
      },
      developedInSweden,
    ],
    specs: [
      { label: "Latinalainen nimi", value: "Vitis vinifera" },
      { label: "Käytetty kasvinosa", value: "Siemen" },
      { label: "Standardointi", value: "95 % proantosyanidiineja (OPC)" },
      { label: "Kapselissa", value: "500 mg uutetta" },
      { label: "Päiväannos", value: "1–2 kapselia päivässä" },
      { label: "Sisältö", value: "60 kapselia – 30–60 päivää" },
      { label: "Kapseli", value: "Vegaaninen" },
      { label: "Kehitetty", value: "Ruotsissa" },
    ],
    ingredients:
      "Viinirypäleensiemenuute (Vitis vinifera, siemen), standardoitu 95 % proantosyanidiineihin, kapselikuori (kasvipohjainen). Yhdessä kapselissa: viinirypäleensiemenuutetta 500 mg, josta proantosyanidiineja 475 mg.",
    usage: [
      "1–2 kapselia päivässä vesilasillisen kanssa.",
      "Älä ylitä suositeltua päivittäistä annosta.",
      "Säilytä viileässä ja kuivassa. Sulje purkki huolellisesti jokaisen käytön jälkeen.",
      "Säilytä pienten lasten ulottumattomissa.",
    ],
    faq: [
      {
        q: "Mitä 95 % OPC tarkoittaa?",
        a: "Sitä, että uute on standardoitu niin, että 95 % siitä on proantosyanidiineja. 500 mg:ssa uutetta se vastaa 475 mg:aa.",
      },
      {
        q: "Mitä kasvinosaa käytetään?",
        a: "Viinirypäleen siemeniä, jotka uutetaan ja standardoidaan polyfenolien mukaan.",
      },
      {
        q: "Onko kapseli vegaaninen?",
        a: "Kyllä. Kapselikuori on kasvipohjainen, ja tuote on gluteeniton ja GMO-vapaa.",
      },
      {
        q: "Kuinka kauan yksi purkki riittää?",
        a: "60 kapselia riittää 30 päiväksi 2 kapselilla päivässä ja 60 päiväksi 1 kapselilla päivässä.",
      },
    ],
  },

  quercetin: {
    eyebrow: "Kversetiini · puhtaus 98 %",
    headline: "Quercetin, 500 mg kapselissa",
    intro:
      "Kversetiini on flavonoidi, jota esiintyy luonnostaan hedelmissä ja vihanneksissa. Uutteemme puhtaus on 98 % – 500 mg kapselissa. 60 kapselia vegaanisessa kapselikuoressa ilman lisäaineita.",
    highlights: [
      { label: "Puhtaus", value: "98 %" },
      { label: "Kapselissa", value: "500 mg" },
      { label: "Kapseleita", value: "60 kpl" },
    ],
    story: [
      {
        heading: "Aine",
        body:
          "Kversetiini on kasviperäinen flavonoidi, jota on muun muassa sipulissa, omenoissa ja marjoissa. Valitsemme erittäin puhtaan uutteen – 98 % – jotta jokaisen kapselin sisältö on sama erästä toiseen.",
      },
      {
        heading: "Puhdas koostumus",
        body:
          "Vain kversetiiniuutetta kasvipohjaisessa kapselikuoressa. Vegaaninen, gluteeniton ja GMO-vapaa – ei sidosaineita, täyteaineita, makeutusaineita tai keinotekoisia säilöntäaineita.",
      },
      developedInSweden,
    ],
    specs: [
      { label: "Sisältö", value: "Kversetiiniuute" },
      { label: "Puhtaus", value: "98 % kversetiiniä" },
      { label: "Kapselissa", value: "500 mg" },
      { label: "Päiväannos", value: "1 kapseli päivässä" },
      { label: "Pakkaus", value: "60 kapselia – 60 päivää" },
      { label: "Kapseli", value: "Vegaaninen" },
      { label: "Kehitetty", value: "Ruotsissa" },
    ],
    ingredients:
      "Kversetiiniuute (98 % kversetiiniä), kapselikuori (kasvipohjainen). Yhdessä kapselissa: kversetiiniuutetta 500 mg, josta kversetiiniä 490 mg.",
    usage: [
      "1 kapseli päivässä vesilasillisen kanssa.",
      "Älä ylitä suositeltua päivittäistä annosta.",
      "Säilytä viileässä ja kuivassa. Sulje purkki huolellisesti jokaisen käytön jälkeen.",
      "Säilytä pienten lasten ulottumattomissa.",
    ],
    faq: [
      {
        q: "Mitä 98 % puhtaus tarkoittaa?",
        a: "Sitä, että 98 % uutteesta on kversetiiniä. 500 mg:ssa uutetta se vastaa 490 mg:aa kversetiiniä.",
      },
      {
        q: "Mistä kversetiini on peräisin?",
        a: "Kversetiini on flavonoidi, jota esiintyy luonnostaan hedelmissä, vihanneksissa ja yrteissä.",
      },
      {
        q: "Onko kapseli vegaaninen?",
        a: "Kyllä. Kapselikuori on kasvipohjainen, ja tuote on gluteeniton ja GMO-vapaa.",
      },
      {
        q: "Kuinka kauan yksi purkki riittää?",
        a: "60 kapselia riittää 60 päiväksi 1 kapselilla päivässä.",
      },
    ],
  },

  reishi: {
    eyebrow: "Ganoderma lucidum · 40 % polysakkarideja",
    headline: "Reishi, 350 mg kapselissa",
    intro:
      "Reishi (Ganoderma lucidum) standardoituna sieniuutteena, jossa on 40 % polysakkarideja – 350 mg kapselissa. 60 kapselia vegaanisessa kapselikuoressa ilman lisäaineita.",
    highlights: [
      { label: "Standardointi", value: "40 % polysakkarideja" },
      { label: "Kapselissa", value: "350 mg" },
      { label: "Kapseleita", value: "60 kpl" },
    ],
    story: [
      {
        heading: "Sieni",
        body:
          "Reishiä, Ganoderma lucidum, on käytetty perinteisessä yrttikulttuurissa vuosisatojen ajan. Uutteemme on tiivistetty ja standardoitu 40 % polysakkarideihin, joten jokaisen kapselin sisältö on sama.",
      },
      {
        heading: "Puhdas koostumus",
        body:
          "Vain reishiuutetta kasvipohjaisessa kapselikuoressa. Vegaaninen, gluteeniton ja GMO-vapaa – ei sidosaineita, täyteaineita, makeutusaineita tai keinotekoisia säilöntäaineita.",
      },
      developedInSweden,
    ],
    specs: [
      { label: "Latinalainen nimi", value: "Ganoderma lucidum" },
      { label: "Standardointi", value: "40 % polysakkarideja" },
      { label: "Kapselissa", value: "350 mg" },
      { label: "Päiväannos", value: "1 kapseli päivässä" },
      { label: "Pakkaus", value: "60 kapselia – 60 päivää" },
      { label: "Kapseli", value: "Vegaaninen" },
      { label: "Kehitetty", value: "Ruotsissa" },
    ],
    ingredients:
      "Reishiuute (Ganoderma lucidum), standardoitu 40 % polysakkarideihin, kapselikuori (kasvipohjainen). Yhdessä kapselissa: reishiuutetta 350 mg, josta polysakkarideja 140 mg.",
    usage: [
      "1 kapseli päivässä vesilasillisen kanssa.",
      "Älä ylitä suositeltua päivittäistä annosta.",
      "Säilytä viileässä ja kuivassa. Sulje purkki huolellisesti jokaisen käytön jälkeen.",
      "Säilytä pienten lasten ulottumattomissa.",
    ],
    faq: [
      {
        q: "Mitä 40 % polysakkarideja tarkoittaa?",
        a: "Sitä, että uute on standardoitu niin, että 40 % siitä on polysakkarideja. 350 mg:ssa uutetta se vastaa 140 mg:aa.",
      },
      {
        q: "Mitä sientä käytetään?",
        a: "Ganoderma lucidumia, joka tunnetaan yleisesti nimellä reishi.",
      },
      {
        q: "Onko kapseli vegaaninen?",
        a: "Kyllä. Kapselikuori on kasvipohjainen, ja tuote on gluteeniton ja GMO-vapaa.",
      },
      {
        q: "Kuinka kauan yksi purkki riittää?",
        a: "60 kapselia riittää 60 päiväksi 1 kapselilla päivässä.",
      },
    ],
  },

  chaga: {
    eyebrow: "Inonotus obliquus · 30:1-uute",
    headline: "Chaga, 400 mg kapselissa",
    intro:
      "Chaga (Inonotus obliquus) 30:1-uutteena, standardoitu 10 % polysakkarideihin – 400 mg kapselissa. 60 kapselia vegaanisessa kapselikuoressa ilman lisäaineita.",
    highlights: [
      { label: "Uute", value: "30:1" },
      { label: "Kapselissa", value: "400 mg" },
      { label: "Kapseleita", value: "60 kpl" },
    ],
    story: [
      {
        heading: "Sieni",
        body:
          "Chaga eli pakurikääpä kasvaa hitaasti koivussa ja ottaa ravinteita puusta monen vuoden ajan. Uutteemme on valmistettu laadukkaasta, luonnosta kerätystä chagasta, tiivistetty suhteessa 30:1 ja standardoitu 10 % polysakkarideihin.",
      },
      {
        heading: "Puhdas koostumus",
        body:
          "Vain chagauutetta kasvipohjaisessa kapselikuoressa. Vegaaninen, gluteeniton ja GMO-vapaa – ei sidosaineita, täyteaineita, makeutusaineita tai keinotekoisia säilöntäaineita.",
      },
      developedInSweden,
    ],
    specs: [
      { label: "Latinalainen nimi", value: "Inonotus obliquus" },
      { label: "Uute", value: "30:1" },
      { label: "Standardointi", value: "10 % polysakkarideja" },
      { label: "Kapselissa", value: "400 mg" },
      { label: "Päiväannos", value: "1 kapseli päivässä" },
      { label: "Pakkaus", value: "60 kapselia – 60 päivää" },
      { label: "Kapseli", value: "Vegaaninen" },
      { label: "Kehitetty", value: "Ruotsissa" },
    ],
    ingredients:
      "Chagauute (Inonotus obliquus) 30:1, standardoitu 10 % polysakkarideihin, kapselikuori (kasvipohjainen). Yhdessä kapselissa: chagauutetta 400 mg, josta polysakkarideja 40 mg.",
    usage: [
      "1 kapseli päivässä vesilasillisen kanssa.",
      "Älä ylitä suositeltua päivittäistä annosta.",
      "Säilytä viileässä ja kuivassa. Sulje purkki huolellisesti jokaisen käytön jälkeen.",
      "Säilytä pienten lasten ulottumattomissa.",
    ],
    faq: [
      {
        q: "Mitä 30:1 tarkoittaa?",
        a: "Sitä, että 30 osaa raaka-ainetta on tiivistetty 1 osaksi uutetta. 400 mg uutetta vastaa noin 12 g:aa kuivattua chagaa.",
      },
      {
        q: "Mitä 10 % polysakkarideja tarkoittaa?",
        a: "Sitä, että uute on standardoitu niin, että 10 % siitä on polysakkarideja – 40 mg kapselissa.",
      },
      {
        q: "Onko kapseli vegaaninen?",
        a: "Kyllä. Kapselikuori on kasvipohjainen, ja tuote on gluteeniton ja GMO-vapaa.",
      },
      {
        q: "Kuinka kauan yksi purkki riittää?",
        a: "60 kapselia riittää 60 päiväksi 1 kapselilla päivässä.",
      },
    ],
  },

  "lions-mane": {
    eyebrow: "Hericium erinaceus · 60 % polysakkarideja",
    headline: "Lion's Mane, 500 mg kapselissa",
    intro:
      "Lion's Mane (Hericium erinaceus) standardoituna sieniuutteena, jossa on 60 % polysakkarideja, joista 45 % beetaglukaaneja – 500 mg kapselissa. 60 kapselia vegaanisessa kapselikuoressa ilman lisäaineita.",
    highlights: [
      { label: "Standardointi", value: "60 % polysakkarideja" },
      { label: "Kapselissa", value: "500 mg" },
      { label: "Kapseleita", value: "60 kpl" },
    ],
    story: [
      {
        heading: "Sieni",
        body:
          "Lion's Manella, Hericium erinaceus, on pitkä historia Itä-Aasian perinteisessä yrttikulttuurissa. Uutteemme on tiivistetty ja standardoitu 60 % polysakkarideihin, joista 45 % beetaglukaaneja, joten jokaisen kapselin sisältö on sama.",
      },
      {
        heading: "Puhdas koostumus",
        body:
          "Vain Lion's Mane -uutetta kasvipohjaisessa kapselikuoressa. Vegaaninen, gluteeniton ja GMO-vapaa – ei sidosaineita, täyteaineita, makeutusaineita tai keinotekoisia säilöntäaineita.",
      },
      developedInSweden,
    ],
    specs: [
      { label: "Latinalainen nimi", value: "Hericium erinaceus" },
      { label: "Standardointi", value: "60 % polysakkarideja" },
      { label: "Josta beetaglukaaneja", value: "45 %" },
      { label: "Kapselissa", value: "500 mg" },
      { label: "Päiväannos", value: "1 kapseli päivässä" },
      { label: "Pakkaus", value: "60 kapselia – 60 päivää" },
      { label: "Kapseli", value: "Vegaaninen" },
      { label: "Kehitetty", value: "Ruotsissa" },
    ],
    ingredients:
      "Lion's Mane -uute (Hericium erinaceus), standardoitu 60 % polysakkarideihin, joista 45 % beetaglukaaneja, kapselikuori (kasvipohjainen). Yhdessä kapselissa: uutetta 500 mg, josta polysakkarideja 300 mg ja beetaglukaaneja 225 mg.",
    usage: [
      "1 kapseli päivässä vesilasillisen kanssa.",
      "Älä ylitä suositeltua päivittäistä annosta.",
      "Säilytä viileässä ja kuivassa. Sulje purkki huolellisesti jokaisen käytön jälkeen.",
      "Säilytä pienten lasten ulottumattomissa.",
    ],
    faq: [
      {
        q: "Mitä 60 % polysakkarideja tarkoittaa?",
        a: "Sitä, että uute on standardoitu niin, että 60 % siitä on polysakkarideja. 500 mg:ssa uutetta se vastaa 300 mg:aa.",
      },
      {
        q: "Mitä beetaglukaanit ovat?",
        a: "Tietty polysakkaridien ryhmä. Uutteessamme niiden osuus on 45 % eli 225 mg kapselissa.",
      },
      {
        q: "Onko kapseli vegaaninen?",
        a: "Kyllä. Kapselikuori on kasvipohjainen, ja tuote on gluteeniton ja GMO-vapaa.",
      },
      {
        q: "Kuinka kauan yksi purkki riittää?",
        a: "60 kapselia riittää 60 päiväksi 1 kapselilla päivässä.",
      },
    ],
  },

  cordyceps: {
    eyebrow: "Cordyceps militaris · 8:1-uute",
    headline: "Cordyceps, 350 mg kapselissa",
    intro:
      "Cordyceps (Cordyceps militaris) 8:1-uutteena, standardoitu 40 % polysakkarideihin – 350 mg kapselissa. 60 kapselia vegaanisessa kapselikuoressa ilman lisäaineita.",
    highlights: [
      { label: "Uute", value: "8:1" },
      { label: "Kapselissa", value: "350 mg" },
      { label: "Kapseleita", value: "60 kpl" },
    ],
    story: [
      {
        heading: "Sieni",
        body:
          "Cordycepsillä on pitkään ollut paikkansa itäaasialaisessa yrttikulttuurissa. Uutteemme on valmistettu huolella valitusta Cordyceps militariksesta, tiivistetty suhteessa 8:1 ja standardoitu 40 % polysakkarideihin, joten jokaisen kapselin sisältö on sama.",
      },
      {
        heading: "Puhdas koostumus",
        body:
          "Vain cordyceps-uutetta kasvipohjaisessa kapselikuoressa. Vegaaninen, gluteeniton ja GMO-vapaa – ei sidosaineita, täyteaineita, makeutusaineita tai keinotekoisia säilöntäaineita.",
      },
      developedInSweden,
    ],
    specs: [
      { label: "Latinalainen nimi", value: "Cordyceps militaris" },
      { label: "Uute", value: "8:1" },
      { label: "Standardointi", value: "40 % polysakkarideja" },
      { label: "Kapselissa", value: "350 mg" },
      { label: "Päiväannos", value: "1 kapseli päivässä" },
      { label: "Pakkaus", value: "60 kapselia – 60 päivää" },
      { label: "Kapseli", value: "Vegaaninen" },
      { label: "Kehitetty", value: "Ruotsissa" },
    ],
    ingredients:
      "Cordyceps-uute (Cordyceps militaris) 8:1, standardoitu 40 % polysakkarideihin, kapselikuori (kasvipohjainen). Yhdessä kapselissa: cordyceps-uutetta 350 mg, josta polysakkarideja 140 mg.",
    usage: [
      "1 kapseli päivässä vesilasillisen kanssa.",
      "Älä ylitä suositeltua päivittäistä annosta.",
      "Säilytä viileässä ja kuivassa. Sulje purkki huolellisesti jokaisen käytön jälkeen.",
      "Säilytä pienten lasten ulottumattomissa.",
    ],
    faq: [
      {
        q: "Mitä 8:1 tarkoittaa?",
        a: "Sitä, että 8 osaa raaka-ainetta on tiivistetty 1 osaksi uutetta. 350 mg uutetta vastaa noin 2,8 g:aa kuivattua cordycepsiä.",
      },
      {
        q: "Mitä 40 % polysakkarideja tarkoittaa?",
        a: "Sitä, että uute on standardoitu niin, että 40 % siitä on polysakkarideja – 140 mg kapselissa.",
      },
      {
        q: "Onko kapseli vegaaninen?",
        a: "Kyllä. Kapselikuori on kasvipohjainen, ja tuote on gluteeniton ja GMO-vapaa.",
      },
      {
        q: "Kuinka kauan yksi purkki riittää?",
        a: "60 kapselia riittää 60 päiväksi 1 kapselilla päivässä.",
      },
    ],
  },

  ashwagandha: {
    eyebrow: "Withania somnifera · 10 % witanolideja",
    headline: "Ashwagandha, 400 mg kapselissa",
    intro:
      "Standardoitu Withania somniferan juuriuute, jossa on 10 % witanolideja – 400 mg kapselissa. 60 kapselia vegaanisessa kapselikuoressa, ilman lisäaineita.",
    highlights: [
      { label: "Standardointi", value: "10 % witanolideja" },
      { label: "Kapselissa", value: "400 mg" },
      { label: "Kapseleita", value: "60 kpl" },
    ],
    story: [
      {
        heading: "Juuri, ei koko kasvi",
        body:
          "Ashwagandhaa kutsutaan myös intialaiseksi ginsengiksi, ja sillä on pitkä perinne ajurvedisessa yrttikulttuurissa. Uutteemme on valmistettu pelkästään juuresta. Halvemmat vaihtoehdot jauhetaan usein koko kasvista lehtineen ja varsineen, jolloin sisältö on aivan toinen.",
      },
      {
        heading: "Standardoitu 10 %:iin",
        body:
          "Witanolidit ovat aineita, joita ashwagandhauutteesta mitataan. Uutteemme on standardoitu 10 %:iin. 400 mg uutetta vastaa 40 mg:aa witanolideja jokaisessa kapselissa.",
      },
      {
        heading: "Puhdas koostumus",
        body:
          "Vain uute ja kasvipohjainen kapselikuori. Ei sidosaineita, täyteaineita tai paakkuuntumisenestoaineita, eikä mitään lisättyä sisällön jatkamiseksi.",
      },
    ],
    specs: [
      { label: "Latinalainen nimi", value: "Withania somnifera" },
      { label: "Kasvinosa", value: "Juuri" },
      { label: "Standardointi", value: "10 % witanolideja" },
      { label: "Kapselissa", value: "400 mg uutetta, josta 40 mg witanolideja" },
      { label: "Päiväannos", value: "2–3 kapselia päivässä" },
      { label: "Pakkaus", value: "60 kapselia" },
      { label: "Kapseli", value: "Vegaaninen (HPMC)" },
    ],
    ingredients:
      "Ashwagandhauute (Withania somnifera, juuri), standardoitu 10 % witanolideihin, kapselikuori (kasvipohjainen, HPMC). Yhdessä kapselissa: ashwagandhauutetta 400 mg, josta witanolideja 40 mg.",
    usage: [
      "2–3 kapselia päivässä vesilasillisen kanssa.",
      "Älä ylitä suositeltua päivittäistä annosta.",
      "Säilytä viileässä ja kuivassa. Sulje purkki huolellisesti jokaisen käytön jälkeen.",
      "Säilytä pienten lasten ulottumattomissa.",
    ],
    faq: [
      {
        q: "Mitä 10 % witanolideja tarkoittaa?",
        a: "Sitä, että uute on standardoitu niin, että 10 % siitä on witanolideja. 400 mg:ssa uutetta se vastaa 40 mg:aa.",
      },
      {
        q: "Mitä kasvin osaa käytetään?",
        a: "Pelkästään juurta. Lehtiä ja vartta ei käytetä.",
      },
      {
        q: "Onko kapseli vegaaninen?",
        a: "Kyllä. Kapselikuori on kasvipohjainen (HPMC).",
      },
      {
        q: "Montako kapselia purkissa on?",
        a: "60 kapselia.",
      },
    ],
  },

  "pine-pollen": {
    eyebrow: "Männyn siitepöly · 99 % puhdas uute",
    headline: "Pine Pollen, 300 mg kapselissa",
    intro:
      "Männyn siitepölyä 99 % puhtaana uutteena, jonka soluseinät on rikottu – 300 mg kapselissa. 60 kapselia vegaanisessa kapselikuoressa, ilman lisäaineita.",
    highlights: [
      { label: "Puhtaus", value: "99 %" },
      { label: "Kapselissa", value: "300 mg" },
      { label: "Kapseleita", value: "60 kpl" },
    ],
    story: [
      {
        heading: "Kevään keltainen pöly",
        body:
          "Muutaman viikon ajan keväällä mänty päästää siitepölynsä, hienon keltaisen pölyn, joka laskeutuu maan ja veden pinnalle. Sato kerätään sinä lyhyenä aikana, kun siitepölyä on saatavilla, joten raaka-aine on sidottu vuodenaikaan.",
      },
      {
        heading: "Rikotut soluseinät",
        body:
          "Siitepölyjyvällä on kova ulkokuori. Uutteessamme soluseinät on rikottu – tämä vaihe tekee jyvän sisällön saatavaksi sen sijaan, että jyvä kulkisi läpi rikkoutumattomana.",
      },
      {
        heading: "Puhdas koostumus",
        body:
          "99 % puhdasta siitepölyuutetta ja kasvipohjainen kapselikuori. Ei sidosaineita, täyteaineita tai paakkuuntumisenestoaineita.",
      },
    ],
    specs: [
      { label: "Raaka-aine", value: "Männyn siitepöly" },
      { label: "Puhtaus", value: "99 %" },
      { label: "Käsittely", value: "Rikotut soluseinät" },
      { label: "Kapselissa", value: "300 mg" },
      { label: "Päiväannos", value: "1–3 kapselia päivässä" },
      { label: "Pakkaus", value: "60 kapselia" },
      { label: "Kapseli", value: "Vegaaninen (HPMC)" },
    ],
    ingredients:
      "Männyn siitepölyuute (99 % puhdas, rikotut soluseinät), kapselikuori (kasvipohjainen, HPMC). Yhdessä kapselissa: siitepölyuutetta 300 mg.",
    usage: [
      "1–3 kapselia päivässä vesilasillisen kanssa.",
      "Älä ylitä suositeltua päivittäistä annosta.",
      "Säilytä viileässä ja kuivassa. Sulje purkki huolellisesti jokaisen käytön jälkeen.",
      "Säilytä pienten lasten ulottumattomissa.",
    ],
    faq: [
      {
        q: "Mitä rikotut soluseinät tarkoittavat?",
        a: "Siitepölyjyvän ulkokuori on avattu käsittelyssä, jotta sisältö on saatavilla sen sijaan, että jyvä kulkisi läpi rikkoutumattomana.",
      },
      {
        q: "Milloin siitepöly kerätään?",
        a: "Sinä lyhyenä aikana keväällä, kun mänty päästää siitepölynsä.",
      },
      {
        q: "Onko kapseli vegaaninen?",
        a: "Kyllä. Kapselikuori on kasvipohjainen (HPMC).",
      },
      {
        q: "Montako kapselia purkissa on?",
        a: "60 kapselia.",
      },
    ],
  },
};
