/** Usein kysytyt kysymykset (fi-FI). Vastaukset noudattavat toimitusehtoja, toimitussivua ja palautussivua. */
import type { FaqGroup } from "@/content/faq";
import { company } from "@/lib/site";

export const faqGroups: FaqGroup[] = [
  {
    id: "bestallning",
    title: "Tilaus ja maksaminen",
    items: [
      {
        q: "Mitä maksutapoja voin käyttää?",
        a: "Voit maksaa Klarnalla, Visalla, Mastercardilla, American Expressillä, Apple Paylla, Google Paylla ja MobilePaylla (MobilePay ei ole käytettävissä kestotilauksissa). Maksut käsittelee Stripe – emme koskaan tallenna korttitietojasi.",
      },
      {
        q: "Voinko muuttaa tai perua tilaukseni?",
        a: `Ota yhteyttä osoitteeseen ${company.email} mahdollisimman pian ja kerro tilausnumerosi. Jos tilausta ei ole vielä pakattu, muutamme tai peruutamme sen. Jos se on jo lähetetty, voit käyttää peruuttamisoikeuttasi, kun paketti saapuu.`,
      },
      {
        q: "Saanko kuitin?",
        a: "Kyllä, tilausvahvistus ja kuitti lähetetään sähköpostiisi heti, kun maksu on suoritettu.",
      },
      {
        q: "Voinko tilata yrityksenä?",
        a: `Kyllä. Kirjoita yrityksen nimi ja Y-tunnus osoitekenttään tai lähetä sähköpostia osoitteeseen ${company.email}, jos haluat laskun.`,
      },
    ],
  },
  {
    id: "frakt",
    title: "Toimitus",
    items: [
      {
        q: "Paljonko toimitus maksaa?",
        a: "Toimitus Suomeen maksaa 6,50 €, ja yli 65 € tilaukset toimitetaan ilmaiseksi. Kestotilaukset ja tuotepaketit toimitetaan aina ilmaiseksi. Ajantasaiset hinnat löydät Toimitus-sivulta.",
      },
      {
        q: "Kuinka kauan toimitus kestää?",
        a: "Arkipäivisin ennen klo 12.00 (Ruotsin aikaa) tehdyt tilaukset lähetetään samana päivänä varastostamme Ruotsista. Toimitus Suomeen kestää yleensä 2–5 arkipäivää.",
      },
      {
        q: "Mihin maihin toimitatte?",
        a: "Toimitamme Ruotsiin, Suomeen ja Tanskaan. Suomeen tilaukset lähetetään PostNordin kautta kirjeenä seurannalla varastostamme Ruotsista. EU:n sisäisistä toimituksista ei peritä tulleja eikä tuontimaksuja.",
      },
      {
        q: "Miten seuraan pakettiani?",
        a: "Saat seurantalinkin sähköpostitse, kun lähetys lähtee varastosta. Voit myös syöttää tilausnumerosi ja sähköpostiosoitteesi Seuraa tilausta -sivulla.",
      },
    ],
  },
  {
    id: "retur",
    title: "Palautukset ja reklamaatiot",
    items: [
      {
        q: "Millainen peruuttamisoikeus minulla on?",
        a: "30 päivää siitä, kun olet vastaanottanut tilauksen – pidempi kuin lain 14 päivää. Tuotteen on oltava avaamaton, koska hygienia- ja elintarvikesyistä emme voi myydä avattuja ravintolisiä edelleen.",
      },
      {
        q: "Miten palautan tuotteen?",
        a: `Lähetä sähköpostia osoitteeseen ${company.email} ja kerro tilausnumero sekä palautettavat tuotteet. Saat palautuslapun ja ohjeet yhden arkipäivän kuluessa. Kun peruutat ostoksen, maksat palautuksen postikulut (hyvityksestä vähennetään 8,00 €). Hyvitys maksetaan 14 päivän kuluessa siitä, kun olemme vastaanottaneet palautuksen.`,
      },
      {
        q: "Mitä teen, jos tuote on vahingoittunut?",
        a: "Ilmoita vahingosta 7 päivän kuluessa ja liitä kuvat paketista ja tuotteesta. Lähetämme korvaavan tuotteen tai hyvitämme ostoksen, ja me maksamme palautuksen postikulut.",
      },
    ],
  },
  {
    id: "prenumeration",
    title: "Kestotilaus",
    items: [
      {
        q: "Miten kestotilaus toimii?",
        a: "Valitse tuotesivulla Kestotilaus, niin saat 15 % alennuksen ja ilmaisen toimituksen jokaiseen toimitukseen. Valitset toimitusvälin (30, 60 tai 90 päivää) ja voit keskeyttää tai lopettaa tilauksen milloin haluat.",
      },
      {
        q: "Milloin maksu veloitetaan?",
        a: "Ensimmäinen toimitus maksetaan ostohetkellä. Sen jälkeen maksu veloitetaan automaattisesti uuden jakson alkaessa, 30, 60 tai 90 päivän välein ostopäivästä laskien. Paketti lähetetään muutaman päivän kuluttua veloituksesta, ja saat sähköpostin, jossa kerrotaan arvioitu toimituspäivä.",
      },
      {
        q: "Miten keskeytän tai lopetan kestotilaukseni?",
        a: "Kirjaudu Oma tili -sivulle ja valitse Keskeytä tai Lopeta. Keskeytys tulee voimaan heti, eikä maksuja veloiteta ennen kuin jatkat tilausta. Jos lopetat tilauksen, uusia veloituksia ei tehdä ja kestotilaus päättyy, kun maksettu jakso on päättynyt. Ei sitoutumisaikaa eikä maksuja. Jos et pääse kirjautumaan, lähetä sähköpostia asiakaspalveluun, niin autamme sinua.",
      },
      {
        q: "Voinko vaihtaa tuotetta tai toimitusväliä?",
        a: "Kyllä. Lähetä sähköpostia asiakaspalveluun, niin vaihdamme toimitusvälin, määrän, tuotteen tai toimitusosoitteen ennen seuraavaa toimitusta. Keskeyttää ja lopettaa voit itse Oma tili -sivulla. Asiakaspalvelumme palvelee ruotsiksi ja englanniksi.",
      },
    ],
  },
  {
    id: "produkter",
    title: "Tuotteet ja laatu",
    items: [
      {
        q: "Mistä tuotteenne tulevat?",
        a: "Metilde on ruotsalainen tuotemerkki, ja valikoima kehitetään Ruotsissa. Raaka-aineet ja uutteet tulevat maista, joissa kasvit luonnostaan kasvavat, esimerkiksi Tongkat Ali Kaakkois-Aasiasta ja maca Andeilta.",
      },
      {
        q: "Mistä tiedän, minkä erän olen saanut?",
        a: "Eränumero ja parasta ennen -päiväys on merkitty purkkiin. Kerro eränumero, jos otat meihin yhteyttä tuotteeseen liittyen, niin voimme jäljittää sen.",
      },
      {
        q: "Sisältävätkö tuotteet turhia lisäaineita?",
        a: "Eivät. Kapselimme sisältävät uutetta ja kasvipohjaisen kapselikuoren – ei sideaineita, täyteaineita, väriaineita eikä makeutusaineita.",
      },
      {
        q: "Miten säilytän tuotteita?",
        a: "Kuivassa huoneenlämmössä, kansi hyvin suljettuna jokaisen käyttökerran jälkeen ja pienten lasten ulottumattomissa.",
      },
    ],
  },
  {
    id: "konto",
    title: "Tili ja tietosuoja",
    items: [
      {
        q: "Täytyykö minun luoda tili tehdäkseni ostoksia?",
        a: "Ei, voit tehdä ostoksia vieraana. Tiliä tarvitaan vain kestotilausten hallintaan ja tilaushistorian katseluun.",
      },
      {
        q: "Miten käsittelette henkilötietojani?",
        a: "Käytämme tietojasi tilauksesi ja tilisi hoitamiseen. Jos olet hyväksynyt markkinointievästeet, jaamme myös tiettyjä tietoja Metan ja Googlen kanssa mainostemme tulosten mittaamiseksi. Emme koskaan myy tietojasi. Lue lisää tietosuojaselosteestamme.",
      },
    ],
  },
];
