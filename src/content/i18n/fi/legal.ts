/**
 * Juridiset sivut ja tietosivut suomeksi (fi-FI), lokalisoitu Suomen markkinoille.
 * Rakenne ja avaimet vastaavat tiedostoa src/content/legal.ts. Paikkamerkit kuten {epost}
 * ja {företag} täytetään näyttöhetkellä (lib/page-text), joten niiden nimiä ei käännetä.
 */
import type { LegalBlock, LegalDoc } from "@/content/legal";

const updated = "Päivitetty viimeksi: 12. lokakuuta 2026";

const contactBlock: LegalBlock[] = [
  { type: "h2", text: "Yhteys- ja yritystiedot" },
  { type: "companyInfo" },
];

const helpBlock: LegalBlock[] = [
  { type: "h2", text: "Tarvitsetko apua?" },
  {
    type: "p",
    text: `Lähetä sähköpostia osoitteeseen {epost} tai soita numeroon {telefon} ({öppettider}). Asiakaspalvelumme palvelee ruotsiksi ja englanniksi. Kerro aina tilausnumerosi, niin voimme auttaa sinua nopeammin.`,
  },
];

/* ------------------------------ Tietosuoja ------------------------------ */

const privacy: LegalDoc = {
  slug: "integritetspolicy",
  title: "Tietosuojaseloste",
  updated,
  intro:
    "Tässä selosteessa kerrotaan, mitä henkilötietoja Metilde kerää, kun vierailet sivustolla metilde.com, teet ostoksia tai hallinnoit tilaustasi, miksi käsittelemme tietoja, kuinka kauan säilytämme niitä ja mitä oikeuksia sinulla on GDPR:n mukaan.",
  metaTitle: "Tietosuojaseloste",
  metaDescription:
    "Näin Metilde kerää, käyttää, jakaa ja suojaa henkilötietojasi, kuinka kauan säilytämme niitä ja miten voit käyttää GDPR:n mukaisia oikeuksiasi.",
  blocks: [
    ...contactBlock,
    {
      type: "p",
      text: `{företag} on tässä kuvatun käsittelyn rekisterinpitäjä. Ota yhteyttä osoitteeseen {epost}, jos sinulla on kysyttävää tai haluat käyttää oikeuksiasi.`,
    },
    { type: "h2", text: "Keräämämme tiedot" },
    {
      type: "ul",
      items: [
        "Tilaustiedot: nimi, toimitus- ja laskutusosoite, sähköposti, puhelinnumero, tilauksen sisältö, tilaushistoria ja palautukset.",
        "Tilitiedot: sähköpostiosoite ja kestotilauksen asetukset. Kirjaudut sisään sähköpostiisi lähetettävällä kertakäyttöisellä koodilla, joten emme tallenna salasanaa.",
        "Maksutiedot: maksutapa, tapahtumatunnus ja maksun tila. Emme koskaan tallenna täydellisiä korttinumeroita, vaan niitä käsittelee maksupalveluntarjoajamme.",
        "Asiakaspalvelutiedot: viestit, asiat ja liitteet, jotka lähetät asiakaspalveluun.",
        "Markkinointitiedot: sähköpostiosoite ja suostumuksen tila, jos tilaat uutiskirjeemme.",
        "Ostoskoritiedot: sähköpostiosoite ja ostoskorin sisältö, kun olet aloittanut ostoksen kassalla, jotta voimme tallentaa ostoskorin ja muistuttaa sinua sähköpostitse (enintään neljä kertaa kymmenen päivän aikana). Jokaisessa muistutuksessa on linkki, jolla voit kieltäytyä uusista muistutuksista.",
        "Tekniset tiedot: IP-osoite, laite- ja selaintyyppi, vieraillut sivut ja vuorovaikutus, jotka kerätään evästeillä ja vastaavilla tekniikoilla.",
      ],
    },
    { type: "h2", text: "Käsittelyn tarkoitukset ja oikeusperuste" },
    {
      type: "table",
      head: ["Tarkoitus", "Oikeusperuste", "Säilytysaika"],
      rows: [
        ["Tilauksesi käsittely ja toimitus, palautusten ja hyvitysten hoitaminen", "Sopimuksen täyttäminen", "Tilauksen ajan sekä virheilmoitusajan"],
        ["Tilisi ja kestotilaustesi hallinnointi", "Sopimuksen täyttäminen", "Kunnes poistat tilisi"],
        ["Kirjanpito ja verovelvoitteet", "Lakisääteinen velvoite (Ruotsin kirjanpitolaki)", "7 vuotta"],
        ["Asiakaspalvelu ja reklamaatiot", "Oikeutettu etu", "36 kuukautta asian päättymisestä"],
        ["Uutiskirje ja markkinointi", "Suostumus", "Kunnes peruutat suostumuksesi"],
        ["Sivuston analysointi ja kehittäminen", "Suostumus (muut kuin välttämättömät evästeet)", "Enintään 24 kuukautta"],
        ["Petosten ehkäisy ja tietoturva", "Oikeutettu etu", "12 kuukautta"],
      ],
    },
    { type: "h2", text: "Kenelle tietoja luovutetaan" },
    {
      type: "p",
      text: "Emme koskaan myy henkilötietojasi. Luovutamme niitä vain käsittelijöille, jotka auttavat meitä verkkokaupan ylläpidossa, ja vain siinä laajuudessa kuin on tarpeen:",
    },
    {
      type: "ul",
      items: [
        "Maksupalveluntarjoajat maksujen käsittelyä ja petosten tarkistusta varten.",
        "Logistiikkakumppanit ja kuljetusyhtiöt toimituksia ja palautuksia varten.",
        "Ylläpito-, tietokanta- ja sähköpostipalveluiden tarjoajat sivuston ylläpitoa ja tilauksiin liittyvien sähköpostien lähettämistä varten.",
        "Maksut Stripen kautta (kortti, Klarna, Apple Pay, Google Pay), varasto ja kuljetus MittLogistikin ja PostNordin kautta, sähköposti Resendin kautta, ylläpito ja tietokanta Vercelin ja Supabasen kautta.",
        "Meta (Facebook, Instagram) ja Google Ads mainostemme tulosten mittaamiseen. Jos annat suostumuksesi markkinointievästeisiin, ne saavat tietoja käynnistäsi ja ostoksestasi sekä sähköpostiosoitteesi tiivistetyssä (hashed) muodossa, jotta ostos voidaan yhdistää mainokseen. Ilman suostumusta Googlen tagi lähettää vain anonyymejä signaaleja ilman evästeitä.",
        "AddRevenue, kun olet tullut meille kumppanilinkin (affiliate) kautta: tilausnumero ja tilauksen arvo, jotta linkin jakajalle voidaan maksaa palkkio.",
        "Viranomaiset, kun olemme lain mukaan velvollisia luovuttamaan tietoja.",
      ],
    },
    {
      type: "p",
      text: "Kaikkien käsittelijöiden kanssa on tehty henkilötietojen käsittelysopimus. Kun tietoja on tarpeen siirtää EU:n/ETA:n ulkopuolelle, siirto suojataan EU-komission vakiosopimuslausekkeilla sekä täydentävillä suojatoimilla.",
    },
    { type: "h2", text: "Oikeutesi" },
    {
      type: "ul",
      items: [
        "Tarkastusoikeus – voit pyytää otteen tiedoista, joita meillä on sinusta.",
        "Oikaisuoikeus – voit pyytää virheellisten tietojen korjaamista.",
        "Poisto-oikeus – voit pyytää tietojesi poistamista, kun emme enää tarvitse niitä.",
        "Käsittelyn rajoittaminen ja vastustaminen – voit rajoittaa tiettyä käsittelyä tai vastustaa sitä, suoramarkkinointi mukaan lukien.",
        "Siirto-oikeus – voit saada tietosi koneluettavassa muodossa.",
        "Suostumuksen peruuttaminen – milloin tahansa, ilman että se vaikuttaa jo tapahtuneeseen käsittelyyn.",
      ],
    },
    {
      type: "p",
      text: `Lähetä sähköpostia osoitteeseen {epost}, jos haluat käyttää jotakin oikeuksistasi. Vastaamme 30 päivän kuluessa. Jos olet tyytymätön tapaan, jolla käsittelemme tietojasi, voit tehdä valituksen Ruotsin tietosuojaviranomaiselle (Integritetsskyddsmyndigheten, IMY, imy.se) tai asuinmaasi valvontaviranomaiselle, Suomessa tietosuojavaltuutetun toimistolle (tietosuoja.fi).`,
    },
    { type: "h2", text: "Tietoturva" },
    {
      type: "p",
      text: "Sivusto toimitetaan TLS-salattuna, kirjautuminen tapahtuu kertakäyttöisillä koodeilla, pääsy henkilötietoihin on rajattu henkilöstöön, joka tarvitsee niitä, ja järjestelmiämme suojaavat lokitus ja roolipohjaiset käyttöoikeudet.",
    },
    { type: "h2", text: "Lapset" },
    { type: "p", text: "Verkkokauppaa ei ole suunnattu lapsille. Sinun on oltava vähintään 18-vuotias tehdäksesi ostoksia tai luodaksesi tilin." },
    { type: "h2", text: "Muutokset tietosuojaselosteeseen" },
    {
      type: "p",
      text: "Voimme päivittää tätä selostetta, kun palvelumme tai lakisääteiset vaatimukset muuttuvat. Yllä oleva päivämäärä näyttää aina voimassa olevan version, ja olennaisista muutoksista ilmoitetaan rekisteröityneille asiakkaille sähköpostitse.",
    },
  ],
};

/* ------------------------------- Toimitusehdot ------------------------------- */

const terms: LegalDoc = {
  slug: "kopvillkor",
  title: "Toimitusehdot",
  updated,
  intro:
    "Nämä ehdot koskevat kaikkia kuluttajien tilauksia sivustolla metilde.com. Ne kattavat hinnat, maksun, toimituksen, kestotilaukset, peruuttamisoikeuden, palautukset, hyvitykset ja reklamaatiot.",
  metaTitle: "Toimitusehdot",
  metaDescription:
    "Metilden toimitusehdot: hinnat ja maksaminen, toimitusajat ja toimituskulut, kestotilaukset, peruuttamisoikeus, palautukset, hyvitykset ja reklamaatiot.",
  blocks: [
    ...contactBlock,
    { type: "h2", text: "Tilaus ja sopimus" },
    {
      type: "p",
      text: "Sitova sopimus syntyy, kun vahvistamme tilauksesi sähköpostitse. Sinun on oltava vähintään 18-vuotias tehdäksesi ostoksia. Jos tuote on loppunut varastosta tai hinta on ilmeisen virheellinen, voimme perua tilauksen ja palauttaa mahdollisesti veloitetun summan. Asiakaspalvelumme palvelee ruotsiksi ja englanniksi.",
    },
    { type: "h2", text: "Hinnat, arvonlisävero ja maksaminen" },
    {
      type: "ul",
      items: [
        "Kaikki hinnat näytetään euroina (EUR) ja ne sisältävät arvonlisäveron. Kokonaissumma toimituskuluineen näytetään ennen kuin vahvistat tilauksen.",
        "Hyväksytyt maksutavat: Klarna, Visa, Mastercard, American Express, Apple Pay ja Google Pay.",
        "Kertaostoksissa maksu veloitetaan, kun tilaus tehdään.",
        "Toimitamme Ruotsiin, Suomeen ja Tanskaan. EU:n sisäisistä toimituksista ei peritä tulleja eikä tuontimaksuja.",
      ],
    },
    { type: "h2", text: "Toimitus" },
    { type: "shippingTable" },
    {
      type: "p",
      text: "Arkipäivisin ennen klo 12.00 (Ruotsin aikaa) tehdyt tilaukset lähetetään yleensä samana päivänä varastostamme Timråsta, Ruotsista. Suomeen tilaukset lähetetään PostNordin kautta kirjeenä seurannalla, ja toimitus kestää yleensä 2–5 arkipäivää. Saat seurantalinkin sähköpostitse heti, kun lähetys on lähtenyt meiltä. Noutamatta jätetystä lähetyksestä veloitamme todelliset meno- ja paluukuljetuksen kustannukset.",
    },
    { type: "h2", text: "Kestotilaus" },
    {
      type: "ul",
      items: [
        "Kestotilauksella saat 15 % alennuksen normaalihinnasta, ja tuotteet toimitetaan valitsemasi väliajoin.",
        "Ensimmäinen toimitus maksetaan heti ostohetkellä. Sen jälkeen maksu veloitetaan automaattisesti uuden jakson alkaessa, 30, 60 tai 90 päivän välein ostopäivästä laskien. Paketti lähetetään muutaman päivän kuluttua veloituksesta, ja saat sähköpostin, jossa kerrotaan arvioitu toimituspäivä.",
        "Voit keskeyttää tai lopettaa kestotilauksen milloin tahansa seuraavaa uusimista edeltävään päivään asti, itse Oma tili -sivulla tai lähettämällä sähköpostia asiakaspalveluun. Jos haluat muuttaa toimitusväliä, määrää tai tuotetta, lähetä sähköpostia asiakaspalveluun. Myöhemmin tehdyt muutokset koskevat seuraavaa toimitusta.",
        "Kestotilaus on voimassa, kunnes lopetat sen. Ei sitoutumisaikaa eikä lopetusmaksua.",
      ],
    },
    { type: "h2", text: "Peruuttamisoikeus" },
    {
      type: "p",
      text: `Kuluttajana sinulla on lakisääteinen 14 päivän peruuttamisoikeus siitä päivästä, jona vastaanotat tuotteen – me pidennämme sen 30 päivään. Ilmoita peruuttamisesta sähköpostitse osoitteeseen {epost} tai käyttämällä EU:n vakiomuotoista peruuttamislomaketta. Tuote on palautettava käyttämättömänä ja avaamattomassa alkuperäispakkauksessa. Hygienia- ja elintarvikesyistä ravintolisiä, joiden sinetti on rikottu, ei voi palauttaa.`,
    },
    { type: "h2", text: "Palautus ja hyvitys" },
    {
      type: "ul",
      items: [
        "Ilmoita meille 30 päivän kuluessa vastaanottamisesta ja lähetä tuote takaisin 14 päivän kuluessa ilmoituksestasi.",
        "Kun peruutat ostoksen, maksat palautuksen postikulut (hyvityksestä vähennetään 8,00 €). Jos tuote on virheellinen tai toimitettu väärin, me maksamme palautuksen postikulut.",
        "Hyvitämme ostohinnan sekä maksamasi vakiotoimituksen kulut 14 päivän kuluessa siitä, kun olemme vastaanottaneet palautuksen tai todisteen palautuksesta.",
        "Hyvitys maksetaan alkuperäiselle maksutavalle.",
        "Jos tuotteen arvo on alentunut muun kuin sen luonteen toteamiseksi tarpeellisen käsittelyn vuoksi, voimme tehdä vastaavan vähennyksen.",
      ],
    },
    { type: "h2", text: "Reklamaatio ja virheelliset tuotteet" },
    {
      type: "p",
      text: `Sinulla on kolmen vuoden reklamaatio-oikeus Ruotsin kuluttajankauppalain (konsumentköplagen) mukaisesti. Ota yhteyttä osoitteeseen {epost} ja kerro tilausnumerosi sekä liitä kuva virheestä. Hyväksytty reklamaatio korjataan uudella tuotteella tai hyvityksellä, ja me maksamme palautuksen postikulut.`,
    },
    { type: "h2", text: "Tuotetiedot" },
    {
      type: "p",
      text: "Tuotteemme ovat ravintolisiä, eikä niitä ole tarkoitettu sairauksien ehkäisyyn, hoitoon tai parantamiseen. Ravintolisillä ei tule korvata monipuolista ruokavaliota ja terveellisiä elämäntapoja. Lue aina tuoteseloste, noudata suositeltua päiväannosta ja säilytä tuote lasten ulottumattomissa. Keskustele lääkärin kanssa, jos olet raskaana, imetät tai käytät lääkkeitä.",
    },
    { type: "h2", text: "Riitojen ratkaiseminen" },
    {
      type: "p",
      text: "Jos emme pääse yhteisymmärrykseen, voit kääntyä Kuluttajaneuvonnan puoleen (kkv.fi) ja saattaa asian Kuluttajariitalautakunnan käsiteltäväksi (kuluttajariita.fi). Noudatamme lautakunnan suosituksia. Sopimukseen sovelletaan Ruotsin lakia, mutta tämä ei rajoita Suomen lain mukaisia pakottavia kuluttajansuojaoikeuksiasi.",
    },
  ],
};

/* -------------------------------- Evästeet -------------------------------- */

const cookies: LegalDoc = {
  slug: "cookies",
  title: "Evästekäytäntö",
  updated,
  intro:
    "Evästeet ovat pieniä tekstitiedostoja, jotka tallennetaan laitteellesi, kun vierailet sivustolla metilde.com. Käytämme niitä, jotta verkkokauppa toimii, jotta muistamme valintasi ja jotta ymmärrämme, miten sivustoa käytetään.",
  metaTitle: "Evästekäytäntö",
  metaDescription:
    "Mitä evästeitä Metilde käyttää, mitä ne tekevät, kuinka kauan niitä säilytetään ja miten voit muuttaa tai peruuttaa suostumuksesi.",
  blocks: [
    { type: "h2", text: "Suostumus" },
    {
      type: "p",
      text: "Välttämättömät evästeet asetetaan automaattisesti, koska verkkokauppa ei toimi ilman niitä. Analytiikka- ja markkinointievästeet asetetaan vasta, kun olet hyväksynyt ne. Voit muuttaa tai peruuttaa suostumuksesi milloin tahansa sivun alatunnisteen evästeasetuksista tai tyhjentämällä evästeet selaimestasi.",
    },
    { type: "h2", text: "Käyttämämme evästeet" },
    { type: "h3", text: "Välttämättömät" },
    {
      type: "table",
      head: ["Eväste", "Tarkoitus", "Säilytysaika"],
      rows: [
        ["metilde_consent", "Tallentaa evästevalintasi", "12 kuukautta"],
        ["sb-access-token", "Pitää sinut kirjautuneena Oma tili -sivulla", "1 tunti"],
      ],
    },
    {
      type: "p",
      text: "Ostoskori tallennetaan selaimen paikalliseen tallennustilaan (metilde_cart), ei evästeeseen. Emme käytä erillistä analytiikkapalvelua; kävijätilastot lasketaan omalla palvelimellamme ilman evästeitä.",
    },
    { type: "h3", text: "Markkinointi (vaatii suostumuksen)" },
    {
      type: "table",
      head: ["Eväste", "Tarkoitus", "Säilytysaika"],
      rows: [
        ["_fbp", "Mittaa mainostemme tehoa", "3 kuukautta"],
        ["_gcl_au", "Kohdistaa konversiot Google Ads -mainoksille", "3 kuukautta"],
      ],
    },
    { type: "h2", text: "Kolmannet osapuolet" },
    {
      type: "p",
      text: "Analytiikka- ja markkinointievästeet asettavat Google ja Meta itsenäisinä palveluntarjoajina. Ne käsittelevät tietoja omien käytäntöjensä mukaisesti, ja ne otetaan käyttöön vasta suostumuksesi jälkeen. Googlen mainostagi käyttää suostumustilaa (Consent Mode): ilman suostumustasi se ei aseta evästeitä ja lähettää vain anonyymejä signaaleja sivunkatseluista ja ostoksista ilman henkilötietoja, kuten sähköpostiosoitetta. Google käyttää niitä mainosten tulosten arvioimiseen.",
    },
    { type: "h2", text: "Evästeiden hallinta selaimessa" },
    {
      type: "p",
      text: "Voit estää tai poistaa evästeitä selaimesi asetuksista. Huomaa, että välttämättömien evästeiden estäminen estää ostoskorin, kassan ja kirjautumisen toiminnan.",
    },
    { type: "p", text: `Kysyttävää evästeistä? Lähetä sähköpostia osoitteeseen {epost}.` },
  ],
};

/* ---------------------------- Laatu ja merkinnät ---------------------------- */

const quality: LegalDoc = {
  slug: "kvalitetsgaranti",
  title: "Laatu ja merkinnät",
  updated,
  intro: "Näin kapselimme on merkitty ja näin toimitaan, jos et ole tyytyväinen.",
  metaTitle: "Laatu ja merkinnät – sisältö, merkinnät ja palautukset",
  metaDescription:
    "Metilden kapselien purkkiin on merkitty uutteen vahvuus, annos ja eränumero, ja avaamattomat tuotteet voi palauttaa 30 päivän kuluessa.",
  blocks: [
    { type: "h2", text: "Tämä koskee kaikkia kapselejamme" },
    {
      type: "ul",
      items: [
        "Vegaaninen kapseli ilman täyteaineita.",
        "Uutteen vahvuus, määrä kapselia kohden ja latinankielinen nimi on merkitty purkkiin.",
        "Kapselit toimitetaan muovipurkissa. Metilde on ruotsalainen tuotemerkki; raaka-aineet tulevat maista, joissa kasvit luonnostaan kasvavat.",
        "Jokaisessa purkissa on eränumero ja parasta ennen -päiväys.",
      ],
    },
    { type: "h2", text: "Jäljitettävyys" },
    {
      type: "p",
      text: "Jokaisessa purkissa on eränumero ja parasta ennen -päiväys. Kerro eränumero, jos otat meihin yhteyttä tuotteeseen liittyen, niin voimme jäljittää, mistä valmistuserästä se on peräisin.",
    },
    { type: "h2", text: "Jos et ole tyytyväinen" },
    {
      type: "p",
      text: "Avaamattomat tuotteet voi palauttaa 30 päivän kuluessa palautuksia ja vaihtoja koskevien ehtojemme mukaisesti. Jos tuote on virheellinen tai vahingoittunut, reklamaatio-oikeus on voimassa, vaikka pakkaus olisi avattu. Ota yhteyttä, jos jokin ei tunnu oikealta, niin käymme asian läpi yhdessä.",
    },
    { type: "h2", text: "Säännökset" },
    {
      type: "p",
      text: "Tuotteemme ovat ravintolisiä, ja ne on merkitty EU:n ravintolisiä koskevien sääntöjen mukaisesti. Ravintolisät eivät korvaa monipuolista ruokavaliota ja terveellisiä elämäntapoja, eikä niitä ole tarkoitettu sairauksien diagnosointiin, hoitoon tai parantamiseen. Keskustele lääkärin kanssa, jos olet raskaana, imetät tai käytät lääkkeitä.",
    },
    ...helpBlock,
  ],
};

/* ---------------------------- Toimitus ---------------------------- */

const shipping: LegalDoc = {
  slug: "frakt-och-leverans",
  title: "Toimitus",
  updated,
  intro:
    "Arkipäivisin ennen klo 12.00 (Ruotsin aikaa) tehdyt tilaukset pakataan ja lähetetään samana päivänä varastostamme Ruotsista. Ilmainen toimitus yli 65 € tilauksille.",
  metaTitle: "Toimitus – toimituskulut, toimitusajat ja seuranta",
  metaDescription:
    "Metilden toimituskulut ja toimitusajat Suomeen, ilmainen toimitus yli 65 € tilauksille, lähetysten seuranta, noutamattomat lähetykset ja vahingoittuneet toimitukset.",
  blocks: [
    { type: "h2", text: "Käsittelyaika" },
    {
      type: "p",
      text: "Pakkaamme tilaukset arkipäivisin. Ennen klo 12.00 (Ruotsin aikaa) saapuneet tilaukset lähetetään samana päivänä, myöhemmin saapuneet seuraavana arkipäivänä. Kampanjoiden ja pyhäpäivien aikana pakkaaminen voi kestää päivän pidempään.",
    },
    { type: "h2", text: "Toimituskulut ja toimitusajat" },
    { type: "shippingTable" },
    {
      type: "p",
      text: "Kaikki hinnat sisältävät arvonlisäveron. Toimitamme Ruotsiin, Suomeen ja Tanskaan. Suomeen tilaukset lähetetään varastostamme Timråsta, Ruotsista, PostNordin kautta kirjeenä seurannalla, ja toimitus kestää yleensä 2–5 arkipäivää. Toimitus Suomeen maksaa 6,50 €, ja yli 65 € tilaukset toimitetaan ilmaiseksi. Kestotilaukset ja tuotepaketit toimitetaan aina ilmaiseksi. EU:n sisäisistä toimituksista ei peritä tulleja eikä tuontimaksuja.",
    },
    { type: "h2", text: "Seuraa tilaustasi" },
    {
      type: "p",
      text: "Saat tilausvahvistuksen, kun tilaus on tehty, ja seurantalinkin, kun lähetys lähtee varastostamme. Voit seurata toimitusta myös Seuraa tilausta -sivulla.",
    },
    { type: "h2", text: "Noutamattomat lähetykset" },
    {
      type: "p",
      text: "Jos lähetys on noudettava noutopisteestä, se säilytetään siellä 14 päivää. Noutamattomat lähetykset palautetaan meille, ja veloitamme todelliset meno- ja paluukuljetuksen kustannukset. Ota mieluummin yhteyttä, jos et ehdi noutaa lähetystä ajoissa – autamme mielellämme.",
    },
    { type: "h2", text: "Vahingoittuneet tai puuttuvat toimitukset" },
    {
      type: "ul",
      items: [
        "Ilmoita näkyvästä kuljetusvauriosta 7 päivän kuluessa vastaanottamisesta ja liitä kuvat paketista ja tuotteista.",
        "Jos seuranta näyttää lähetyksen toimitetuksi mutta se puuttuu, tarkista ensin naapureilta ja noutopisteestä ja ota sitten yhteyttä meihin 14 päivän kuluessa.",
        "Lähetämme korvaavan toimituksen tai hyvitämme tilauksen heti, kun asia on vahvistettu.",
      ],
    },
    ...helpBlock,
  ],
};

/* ----------------------------- Palautukset ja vaihdot ---------------------------- */

const returns: LegalDoc = {
  slug: "returer-och-byten",
  title: "Palautukset ja vaihdot",
  updated,
  intro:
    "Sinulla on aina 30 päivän peruuttamisoikeus – pidempi kuin lain 14 päivää. Avaamattomat tuotteet alkuperäisessä kunnossa voi palauttaa tai vaihtaa.",
  metaTitle: "Palautukset ja vaihdot – 30 päivän peruuttamisoikeus",
  metaDescription:
    "Näin palautat tai vaihdat tuotteen Metildellä: 30 päivän peruuttamisoikeus, palautuksen postikulut, hyvitys 14 päivän kuluessa ja kolmen vuoden reklamaatio-oikeus.",
  blocks: [
    { type: "h2", text: "Peruuttamisoikeutesi" },
    {
      type: "p",
      text: "Kuluttajana EU:ssa sinulla on lakisääteinen 14 päivän peruuttamisoikeus siitä päivästä, jona vastaanotat tilauksesi. Me pidennämme sen 30 päivään. Peruuttamisoikeus koskee tuotteita, jotka ovat avaamattomia ja olennaisesti muuttumattomassa kunnossa – hygienia- ja elintarvikesyistä emme voi myydä avattuja ravintolisiä edelleen.",
    },
    { type: "h2", text: "Näin palautat" },
    {
      type: "ul",
      items: [
        `Ilmoita palautuksesta lähettämällä sähköpostia osoitteeseen {epost} ja kerro tilausnumero sekä palautettavat tuotteet.`,
        `Saat palautuslapun ja ohjeet yhden arkipäivän kuluessa. Palautukset lähetetään osoitteeseen {returadress}.`,
        "Pakkaa tuotteet alkuperäispakkaukseen tai vastaavaan suojaavaan pakkaukseen.",
        "Jätä paketti lähimpään toimipisteeseen ja säilytä kuitti, kunnes hyvitys on maksettu.",
      ],
    },
    { type: "h2", text: "Palautuksen postikulut ja hyvitys" },
    {
      type: "table",
      head: ["Tilanne", "Palautuksen postikulut", "Hyvitys"],
      rows: [
        ["Peruutettu ostos", "Maksat itse, hyvityksestä vähennetään 8,00 €", "Tilauksen arvo sekä alkuperäinen vakiotoimitusmaksu"],
        ["Väärä tuote lähetetty", "Maksuton, ennakkoon maksettu palautustarra meiltä", "Koko summa tai korvaava tuote"],
        ["Vahingoittunut tai virheellinen tuote", "Maksuton, ennakkoon maksettu palautustarra meiltä", "Koko summa tai korvaava tuote"],
        ["Vaihto toiseen tuotteeseen", "Maksetaan kuten palautus (8,00 €), ellei tuote ollut virheellinen", "Hintaero veloitetaan tai hyvitetään"],
      ],
    },
    {
      type: "p",
      text: "Hyvitys maksetaan samalla maksutavalla kuin ostos 14 päivän kuluessa siitä, kun olemme vastaanottaneet ja hyväksyneet palautuksen, yleensä 2–5 pankkipäivässä. Emme peri palautusmaksua yllä olevassa taulukossa mainittujen palautuksen postikulujen lisäksi.",
    },
    { type: "h2", text: "Reklamaatio" },
    {
      type: "p",
      text: "Sinulla on kolmen vuoden reklamaatio-oikeus virheellisistä tuotteista Ruotsin kuluttajankauppalain (konsumentköplagen) mukaisesti. Ilmoita virheestä kohtuullisessa ajassa sen havaitsemisesta – kahden kuukauden kuluessa tehty ilmoitus katsotaan aina tehdyksi kohtuullisessa ajassa. Liitä mukaan kuvat ja tuotteen etiketissä oleva eränumero.",
    },
    { type: "h2", text: "Poikkeukset" },
    {
      type: "ul",
      items: [
        "Avatut ravintolisät tai tuotteet, joiden sinetti on rikottu, hygienia- ja elintarvikesyistä.",
        "Tuotteet, joiden parasta ennen -päiväys on umpeutunut niiden ollessa hallussasi.",
      ],
    },
    { type: "h2", text: "Riitojen ratkaiseminen" },
    {
      type: "p",
      text: "Jos emme pääse yhteisymmärrykseen, voit kääntyä Kuluttajaneuvonnan puoleen (kkv.fi) ja saattaa asian Kuluttajariitalautakunnan käsiteltäväksi (kuluttajariita.fi). Noudatamme lautakunnan suosituksia. Sopimukseen sovelletaan Ruotsin lakia, mutta tämä ei rajoita Suomen lain mukaisia pakottavia kuluttajansuojaoikeuksiasi.",
    },
    ...helpBlock,
  ],
};

/* -------------------------------- Vastuullisuus ------------------------------ */

const sustainability: LegalDoc = {
  slug: "hallbarhet",
  title: "Vastuullisuus",
  updated,
  intro:
    "Vähemmän mutta parempia tuotteita, kierrätettävät pakkaukset ja toimitusketju, jonka osaamme selittää. Tältä tilanne näyttää tänään – ja tämän parissa jatkamme työtä.",
  metaTitle: "Vastuullisuus – pakkaukset, kuljetukset ja raaka-aineet",
  metaDescription:
    "Näin Metilde toimii vastuullisesti: kierrätettävät pakkaukset, keskitetyt lähetykset yhdestä varastosta Ruotsissa ja dokumentoidut raaka-aineet.",
  blocks: [
    { type: "h2", text: "Näin ajattelemme" },
    {
      type: "p",
      text: "Ravintolisäbrändin suurin jalanjälki syntyy raaka-aineista, pakkauksista ja kuljetuksista. Työskentelemme näiden kolmen parissa tässä järjestyksessä ja kerromme mieluummin rehellisesti, missä olemme, kuin esitämme väitteitä, joita emme voi dokumentoida.",
    },
    { type: "h2", text: "Pakkaukset" },
    {
      type: "ul",
      items: [
        "Ulkopakkaus ja täytemateriaali on valmistettu kierrätyspaperista, ja ne kierrätetään paperina.",
        "Kapselit toimitetaan kierrekannellisissa muovipurkeissa, jotka suojaavat kosteudelta ja valolta. Purkki lajitellaan muovipakkauksiin.",
        "Ulkopakkauksen ympärillä ei ole muovikalvoa, eikä mukana ole painettuja paperiliitteitä, joita et ole pyytänyt.",
      ],
    },
    { type: "h2", text: "Kuljetukset" },
    {
      type: "p",
      text: "Lähetämme kaikki tilaukset yhdestä varastosta Ruotsissa, ensisijaisesti kirjeinä ja noutopisteisiin, koska yhdistetyt reitit tarkoittavat vähemmän kilometrejä pakettia kohden. Kestotilaukset voidaan yhdistää yhdeksi toimitukseksi, jolloin useampi tuote kulkee yhdessä.",
    },
    { type: "h2", text: "Raaka-aineet ja sosiaalinen vastuu" },
    {
      type: "ul",
      items: [
        "Toimittajien on dokumentoitava alkuperä ja noudatettava sovellettavaa työ- ja ympäristölainsäädäntöä.",
        "Ostamme raaka-aineita viljelijöiltä, joiden sadonkorjuukäytännöt on dokumentoitu.",
        "Kasviperäiset raaka-aineet, jotka kasvavat vain Euroopan ulkopuolella, ostetaan mahdollisimman suurina erinä kuljetusten määrän vähentämiseksi.",
      ],
    },
    { type: "h2", text: "Mitä emme ole vielä ratkaisseet" },
    {
      type: "ul",
      items: [
        "Emme vielä julkaise täydellistä tuotekohtaista ilmastolaskelmaa.",
        "Joitakin kasviperäisiä raaka-aineita voidaan viljellä vain Euroopan ulkopuolella, mikä tarkoittaa pitkiä kuljetuksia.",
      ],
    },
    {
      type: "p",
      text: `Onko sinulla kysyttävää tai ehdotus vastuullisuustyöhömme liittyen? Kirjoita osoitteeseen {epost} – luemme kaikki viestit.`,
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
