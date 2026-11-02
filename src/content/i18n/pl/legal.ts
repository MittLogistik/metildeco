/**
 * Juridiskt innehåll och informationssidor på polska (pl-PL), lokaliserat för Polen.
 * Samma nycklar och blockstruktur som src/content/legal.ts. `slug` är det interna id:t (svenskt).
 * Platshållare som {epost} och {företag} fylls i när sidan visas (lib/page-text).
 */
import type { LegalBlock, LegalDoc } from "@/content/legal";

const updated = "Ostatnia aktualizacja: 2 listopada 2026";

const contactBlock: LegalBlock[] = [
  { type: "h2", text: "Dane kontaktowe i dane firmy" },
  { type: "companyInfo" },
];

const helpBlock: LegalBlock[] = [
  { type: "h2", text: "Potrzebujesz pomocy?" },
  {
    type: "p",
    text: `Napisz na {epost} albo zadzwoń pod numer {telefon} ({öppettider}). Zawsze podawaj numer zamówienia – wtedy pomożemy Ci szybciej. Nasz dział obsługi klienta odpowiada po szwedzku i po angielsku.`,
  },
];

const disputeText =
  "Jeśli nie dojdziemy do porozumienia, informacje o swoich prawach i możliwościach uzyskasz w Europejskim Centrum Konsumenckim w Polsce, które pomaga w sporach z przedsiębiorcami z innych krajów UE. Spór możesz też skierować do właściwego sądu w Polsce. Do umowy stosuje się prawo szwedzkie. Nie ogranicza to bezwzględnie obowiązujących praw, które przysługują Ci jako konsumentowi na podstawie prawa polskiego.";

/* ------------------------------ Prywatność ------------------------------ */

const privacy: LegalDoc = {
  slug: "integritetspolicy",
  title: "Polityka prywatności",
  updated,
  intro:
    "Ta polityka wyjaśnia, jakie dane osobowe Metilde zbiera, gdy odwiedzasz metilde.com, składasz zamówienie lub zarządzasz subskrypcją, dlaczego je przetwarzamy, jak długo je przechowujemy i jakie prawa przysługują Ci na podstawie RODO.",
  metaTitle: "Polityka prywatności",
  metaDescription:
    "Jak Metilde zbiera, wykorzystuje, udostępnia i chroni Twoje dane osobowe, jak długo je przechowujemy i jak możesz korzystać ze swoich praw na podstawie RODO.",
  blocks: [
    ...contactBlock,
    {
      type: "p",
      text: `{företag} jest administratorem danych osobowych w zakresie opisanego tu przetwarzania. Skontaktuj się z nami pod adresem {epost}, jeśli masz pytania lub chcesz skorzystać ze swoich praw.`,
    },
    { type: "h2", text: "Jakie dane zbieramy" },
    {
      type: "ul",
      items: [
        "Dane zamówienia: imię i nazwisko, adres dostawy i adres rozliczeniowy, adres e-mail, numer telefonu, zawartość zamówienia, historia zamówień i zwroty.",
        "Dane konta: adres e-mail i ustawienia subskrypcji. Logujesz się jednorazowym kodem wysyłanym na Twój e-mail, więc nie przechowujemy żadnego hasła.",
        "Dane płatności: metoda płatności, identyfikator transakcji i status płatności. Pełnych numerów kart nigdy nie przechowujemy – obsługuje je nasz dostawca płatności.",
        "Dane z obsługi klienta: wiadomości, zgłoszenia i załączniki, które wysyłasz do działu obsługi klienta.",
        "Dane marketingowe: adres e-mail i status zgody, jeśli zapiszesz się do newslettera.",
        "Dane koszyka: adres e-mail i zawartość koszyka, gdy rozpoczniesz składanie zamówienia, abyśmy mogli zapisać koszyk i przypomnieć Ci o nim e-mailem (maksymalnie cztery razy w ciągu dziesięciu dni). Każde przypomnienie zawiera link, za pomocą którego zrezygnujesz z kolejnych.",
        "Dane techniczne: adres IP, rodzaj urządzenia i przeglądarki, odwiedzone strony i interakcje, zbierane za pomocą plików cookie i podobnych technologii.",
      ],
    },
    { type: "h2", text: "Cele i podstawa prawna" },
    {
      type: "table",
      head: ["Cel", "Podstawa prawna", "Okres przechowywania"],
      rows: [
        ["Realizacja i dostawa zamówienia, obsługa zwrotów i refundacji", "Wykonanie umowy", "W trakcie realizacji zamówienia oraz przez okres reklamacyjny"],
        ["Zarządzanie Twoim kontem i subskrypcjami", "Wykonanie umowy", "Do usunięcia konta"],
        ["Księgowość i obowiązki podatkowe", "Obowiązek prawny (szwedzka ustawa o rachunkowości)", "7 lat"],
        ["Obsługa klienta i reklamacje", "Prawnie uzasadniony interes", "36 miesięcy od zamknięcia sprawy"],
        ["Newsletter i marketing", "Zgoda", "Do wycofania zgody"],
        ["Analiza i ulepszanie strony", "Zgoda (pliki cookie inne niż niezbędne)", "Do 24 miesięcy"],
        ["Zapobieganie oszustwom i bezpieczeństwo IT", "Prawnie uzasadniony interes", "12 miesięcy"],
      ],
    },
    { type: "h2", text: "Komu udostępniamy dane" },
    {
      type: "p",
      text: "Nigdy nie sprzedajemy Twoich danych osobowych. Udostępniamy je wyłącznie podmiotom przetwarzającym, które pomagają nam prowadzić sklep, i tylko w niezbędnym zakresie:",
    },
    {
      type: "ul",
      items: [
        "Dostawcom płatności – w celu realizacji płatności i kontroli nadużyć.",
        "Partnerom logistycznym i przewoźnikom – w celu dostawy i obsługi zwrotów.",
        "Dostawcom hostingu, bazy danych i poczty e-mail – aby strona działała i abyśmy mogli wysyłać e-maile dotyczące zamówień.",
        "Płatności przez Stripe (karta, Klarna, Apple Pay, Google Pay), magazyn i wysyłka przez MittLogistik i PostNord, e-maile przez Resend, hosting i baza danych przez Vercel i Supabase.",
        "Meta (Facebook, Instagram), Google Ads i Microsoft Advertising – w celu mierzenia skuteczności naszych reklam. Jeśli zgodzisz się na marketingowe pliki cookie, otrzymują one dane o Twojej wizycie i zakupie oraz Twój adres e-mail w postaci zaszyfrowanej funkcją skrótu (hash), aby powiązać zakup z reklamą. Bez Twojej zgody tag Google wysyła wyłącznie anonimowe sygnały bez plików cookie.",
        "AddRevenue – jeśli trafiłeś do nas przez link afiliacyjny: numer i wartość zamówienia, aby wypłacić prowizję osobie, która zamieściła link.",
        "Organom publicznym – gdy przepisy prawa zobowiązują nas do przekazania informacji.",
      ],
    },
    {
      type: "p",
      text: "Ze wszystkimi podmiotami przetwarzającymi zawarliśmy umowy powierzenia przetwarzania danych. Jeśli konieczne jest przekazanie danych poza UE/EOG, jest ono zabezpieczone standardowymi klauzulami umownymi Komisji Europejskiej wraz z dodatkowymi środkami ochrony.",
    },
    { type: "h2", text: "Twoje prawa" },
    {
      type: "ul",
      items: [
        "Dostęp – możesz poprosić o informację, jakie dane o Tobie posiadamy.",
        "Sprostowanie – możesz poprosić o poprawienie nieprawidłowych danych.",
        "Usunięcie – możesz poprosić o usunięcie danych, gdy nie są nam już potrzebne.",
        "Ograniczenie i sprzeciw – możesz ograniczyć określone przetwarzanie lub się mu sprzeciwić, w tym marketingowi bezpośredniemu.",
        "Przenoszenie danych – możesz otrzymać swoje dane w formacie nadającym się do odczytu maszynowego.",
        "Wycofanie zgody – w dowolnym momencie, bez wpływu na przetwarzanie, które już miało miejsce.",
      ],
    },
    {
      type: "p",
      text: `Aby skorzystać z któregoś z tych praw, napisz na {epost}. Odpowiadamy w ciągu 30 dni. Jeśli nie podoba Ci się sposób, w jaki postępujemy z Twoimi danymi, możesz złożyć skargę do Prezesa Urzędu Ochrony Danych Osobowych (UODO), uodo.gov.pl, lub do naszego organu nadzorczego w Szwecji, Integritetsskyddsmyndigheten (IMY), imy.se.`,
    },
    { type: "h2", text: "Bezpieczeństwo" },
    {
      type: "p",
      text: "Strona działa przez szyfrowane połączenie TLS, logowanie odbywa się za pomocą jednorazowych kodów, dostęp do danych osobowych mają tylko pracownicy, którzy go potrzebują, a nasze systemy są chronione rejestrowaniem zdarzeń i uprawnieniami opartymi na rolach.",
    },
    { type: "h2", text: "Dzieci" },
    { type: "p", text: "Sklep nie jest przeznaczony dla dzieci. Aby złożyć zamówienie lub założyć konto, musisz mieć ukończone 18 lat." },
    { type: "h2", text: "Zmiany polityki" },
    {
      type: "p",
      text: "Możemy aktualizować tę politykę, gdy zmieniają się nasze usługi lub wymogi prawne. Data powyżej zawsze wskazuje obowiązującą wersję, a o istotnych zmianach informujemy zarejestrowanych klientów e-mailem.",
    },
  ],
};

/* ------------------------------- Regulamin ------------------------------- */

const terms: LegalDoc = {
  slug: "kopvillkor",
  title: "Regulamin sklepu",
  updated,
  intro:
    "Regulamin dotyczy wszystkich zamówień składanych przez konsumentów na metilde.com. Obejmuje ceny, płatności, dostawę, subskrypcje, prawo odstąpienia od umowy, zwroty, refundacje i reklamacje.",
  metaTitle: "Regulamin sklepu",
  metaDescription:
    "Regulamin sklepu Metilde: ceny i płatności, czas i koszty dostawy, subskrypcje, prawo odstąpienia od umowy, zwroty, refundacje i reklamacje.",
  blocks: [
    ...contactBlock,
    { type: "h2", text: "Zamówienie i umowa" },
    {
      type: "p",
      text: "Wiążąca umowa zostaje zawarta, gdy potwierdzimy Twoje zamówienie e-mailem. Aby złożyć zamówienie, musisz mieć ukończone 18 lat. Jeśli produkt jest niedostępny lub cena jest w oczywisty sposób błędna, możemy anulować zamówienie i zwrócić pobraną kwotę. Cała komunikacja odbywa się po szwedzku lub po angielsku.",
    },
    { type: "h2", text: "Ceny, VAT i płatności" },
    {
      type: "ul",
      items: [
        "Wszystkie ceny podawane są w złotych (PLN) i zawierają VAT. Łączną kwotę wraz z kosztem wysyłki zobaczysz przed potwierdzeniem zamówienia.",
        "Akceptowane metody płatności: Klarna, Visa, Mastercard, American Express, Apple Pay i Google Pay.",
        "Przy jednorazowym zakupie płatność jest pobierana w momencie złożenia zamówienia.",
        "W tym sklepie dostarczamy zamówienia na adresy w Polsce. Przesyłki do Polski nie opuszczają UE, więc nigdy nie doliczamy cła ani opłat importowych.",
      ],
    },
    { type: "h2", text: "Dostawa" },
    { type: "shippingTable" },
    {
      type: "p",
      text: "Zamówienia złożone w dzień roboczy przed godziną 12:00 zwykle wysyłamy tego samego dnia z naszego magazynu w Szwecji. Zamówienia do Polski wysyłamy przez PostNord jako przesyłkę listową z możliwością śledzenia; czas dostawy wynosi zwykle 3–6 dni roboczych. Link do śledzenia przesyłki otrzymasz e-mailem, gdy tylko paczka od nas wyjedzie. Za przesyłki nieodebrane pobieramy faktyczny koszt wysyłki w obie strony.",
    },
    { type: "h2", text: "Subskrypcja" },
    {
      type: "ul",
      items: [
        "Subskrypcja daje 15% rabatu od ceny regularnej, a dostawy realizujemy w wybranym przez Ciebie odstępie czasu.",
        "Za pierwszą dostawę płacisz od razu przy zakupie. Następnie płatność jest pobierana automatycznie na początku każdego nowego okresu – co 30, 60 lub 90 dni, licząc od zakupu. Paczka jest wysyłana kilka dni po pobraniu płatności, a Ty otrzymujesz e-mail z przewidywaną datą dostawy.",
        "Subskrypcję możesz w każdej chwili wstrzymać lub zakończyć – najpóźniej w dniu poprzedzającym kolejne odnowienie – samodzielnie w zakładce Moje konto albo pisząc do działu obsługi klienta. Jeśli chcesz zmienić odstęp między dostawami, liczbę opakowań lub produkt, napisz do działu obsługi klienta. Zmiany zgłoszone później obowiązują od kolejnej dostawy.",
        "Subskrypcja trwa do momentu, aż ją zakończysz. Bez minimalnego okresu i bez opłat za rezygnację.",
      ],
    },
    { type: "h2", text: "Prawo odstąpienia od umowy" },
    {
      type: "p",
      text: `Jako konsument masz ustawowe prawo do odstąpienia od umowy w ciągu 14 dni od dnia otrzymania produktu – my wydłużamy ten termin do 30 dni. Skontaktuj się z nami pod adresem {epost} lub skorzystaj z europejskiego wzoru formularza odstąpienia od umowy. Produkt należy odesłać nieużywany, w nienaruszonym oryginalnym opakowaniu. Ze względów higienicznych i bezpieczeństwa żywności suplementów diety z naruszonym zabezpieczeniem nie można zwrócić.`,
    },
    { type: "h2", text: "Zwrot i refundacja" },
    {
      type: "ul",
      items: [
        "Poinformuj nas w ciągu 30 dni od otrzymania produktu i odeślij go w ciągu 14 dni od swojego zgłoszenia.",
        "Przy odstąpieniu od umowy koszt odesłania pokrywasz Ty (34 zł odliczamy od zwracanej kwoty). Jeśli produkt jest wadliwy lub wysłaliśmy niewłaściwy, koszt odesłania pokrywamy my.",
        "Zwracamy cenę zakupu wraz z zapłaconym przez Ciebie standardowym kosztem wysyłki w ciągu 14 dni od otrzymania zwrotu lub dowodu jego nadania.",
        "Zwrot środków następuje tą samą metodą płatności, której użyto przy zakupie.",
        "Jeśli wartość produktu zmniejszyła się w wyniku korzystania z niego w sposób wykraczający poza konieczny do stwierdzenia jego charakteru, możemy potrącić odpowiednią kwotę.",
      ],
    },
    { type: "h2", text: "Reklamacje i wadliwe produkty" },
    {
      type: "p",
      text: `Na złożenie reklamacji masz trzy lata zgodnie ze szwedzką ustawą o sprzedaży konsumenckiej (konsumentköplagen). Napisz na {epost}, podając numer zamówienia, i dołącz zdjęcie wady. Uznaną reklamację rozpatrujemy, wysyłając nowy produkt lub zwracając pieniądze, a koszt odesłania pokrywamy my.`,
    },
    { type: "h2", text: "Informacje o produktach" },
    {
      type: "p",
      text: "Nasze produkty są suplementami diety i nie są przeznaczone do zapobiegania chorobom, ich leczenia ani wyleczenia. Suplement diety nie może być stosowany jako substytut zróżnicowanej diety i zdrowego stylu życia. Zawsze czytaj etykietę, nie przekraczaj zalecanej dziennej porcji i przechowuj produkt w miejscu niedostępnym dla dzieci. Jeśli jesteś w ciąży, karmisz piersią lub przyjmujesz leki, skonsultuj się z lekarzem.",
    },
    { type: "h2", text: "Spory" },
    { type: "p", text: disputeText },
  ],
};

/* -------------------------------- Cookies -------------------------------- */

const cookies: LegalDoc = {
  slug: "cookies",
  title: "Polityka plików cookie",
  updated,
  intro:
    "Pliki cookie to małe pliki tekstowe zapisywane na Twoim urządzeniu, gdy odwiedzasz metilde.com. Używamy ich, aby sklep działał, aby zapamiętać Twoje wybory i aby zrozumieć, jak korzystasz ze strony.",
  metaTitle: "Polityka plików cookie",
  metaDescription:
    "Jakich plików cookie używa Metilde, do czego służą, jak długo są przechowywane i jak zmienić lub wycofać zgodę.",
  blocks: [
    { type: "h2", text: "Zgoda" },
    {
      type: "p",
      text: "Niezbędne pliki cookie są zapisywane automatycznie, ponieważ bez nich sklep nie działa. Analityczne i marketingowe pliki cookie zapisujemy dopiero po Twojej zgodzie. Zgodę możesz w każdej chwili zmienić lub wycofać w ustawieniach plików cookie u dołu strony albo usuwając pliki cookie w przeglądarce.",
    },
    { type: "h2", text: "Pliki cookie, których używamy" },
    { type: "h3", text: "Niezbędne" },
    {
      type: "table",
      head: ["Plik cookie", "Cel", "Okres przechowywania"],
      rows: [
        ["metilde_consent", "Zapisuje Twoje wybory dotyczące plików cookie", "12 miesięcy"],
        ["sb-access-token", "Utrzymuje Cię zalogowanym w Moim koncie", "1 godzina"],
      ],
    },
    {
      type: "p",
      text: "Koszyk jest zapisywany w pamięci lokalnej przeglądarki (metilde_cart), a nie w pliku cookie. Nie korzystamy z osobnego narzędzia analitycznego – statystyki odwiedzin liczymy na własnym serwerze, bez plików cookie.",
    },
    { type: "h3", text: "Marketingowe (wymagają zgody)" },
    {
      type: "table",
      head: ["Plik cookie", "Cel", "Okres przechowywania"],
      rows: [
        ["_fbp", "Mierzy skuteczność naszych reklam", "3 miesiące"],
        ["_gcl_au", "Przypisuje konwersje do Google Ads", "3 miesiące"],
        ["_uetsid, _uetvid, MUID", "Przypisuje konwersje do Microsoft Advertising (Bing)", "1 dzień – 13 miesięcy"],
      ],
    },
    { type: "h2", text: "Podmioty zewnętrzne" },
    {
      type: "p",
      text: "Analityczne i marketingowe pliki cookie zapisują Google, Microsoft i Meta jako niezależni dostawcy. Przetwarzają one dane zgodnie z własnymi politykami, a pliki cookie są aktywowane dopiero po Twojej zgodzie. Tag reklamowy Google korzysta z trybu zgody (Consent Mode): bez Twojej zgody nie zapisuje plików cookie i wysyła tylko anonimowe sygnały o wyświetleniach stron i zakupach, bez danych osobowych takich jak adres e-mail. Google wykorzystuje je do szacowania wyników reklam.",
    },
    { type: "h2", text: "Zarządzanie plikami cookie w przeglądarce" },
    {
      type: "p",
      text: "Pliki cookie możesz zablokować lub usunąć w ustawieniach przeglądarki. Pamiętaj, że jeśli zablokujesz niezbędne pliki cookie, koszyk, składanie zamówienia i logowanie nie będą działać.",
    },
    { type: "p", text: `Masz pytania o pliki cookie? Napisz na {epost}.` },
  ],
};

/* ---------------------------- Jakość ---------------------------- */

const quality: LegalDoc = {
  slug: "kvalitetsgaranti",
  title: "Jakość i oznakowanie",
  updated,
  intro: "Tak oznaczamy nasze kapsułki – i to obowiązuje, jeśli nie jesteś zadowolony.",
  metaTitle: "Jakość i oznakowanie – skład, etykieta i zwroty",
  metaDescription:
    "Kapsułki Metilde mają na etykiecie stopień koncentracji ekstraktu, dawkę i numer partii, a nieotwarte można zwrócić w ciągu 30 dni.",
  blocks: [
    { type: "h2", text: "To dotyczy wszystkich naszych kapsułek" },
    {
      type: "ul",
      items: [
        "Wegańska kapsułka bez wypełniaczy.",
        "Stopień koncentracji ekstraktu, ilość w kapsułce i nazwa łacińska są podane na opakowaniu.",
        "Kapsułki dostarczamy w plastikowym pojemniku. Surowce pochodzą z krajów, w których rośliny naturalnie występują.",
        "Numer partii i data minimalnej trwałości na każdym opakowaniu.",
      ],
    },
    { type: "h2", text: "Identyfikowalność" },
    {
      type: "p",
      text: "Każde opakowanie ma numer partii i datę minimalnej trwałości („najlepiej spożyć przed”). Podaj numer partii, gdy kontaktujesz się z nami w sprawie produktu – wtedy sprawdzimy, z której produkcji pochodzi.",
    },
    { type: "h2", text: "Jeśli nie jesteś zadowolony" },
    {
      type: "p",
      text: "Nieotwarte produkty możesz zwrócić w ciągu 30 dni zgodnie z naszymi zasadami zwrotów i wymian. Jeśli produkt jest wadliwy lub uszkodzony, obowiązuje prawo do reklamacji, nawet jeśli opakowanie zostało otwarte. Daj nam znać, jeśli coś jest nie tak – przejrzymy to razem.",
    },
    { type: "h2", text: "Przepisy" },
    {
      type: "p",
      text: "Nasze produkty są suplementami diety i są oznakowane zgodnie z przepisami UE dotyczącymi suplementów diety. Suplementy diety nie zastępują zróżnicowanej diety i zdrowego stylu życia i nie są przeznaczone do diagnozowania, leczenia ani wyleczenia chorób. Jeśli jesteś w ciąży, karmisz piersią lub przyjmujesz leki, skonsultuj się z lekarzem.",
    },
    ...helpBlock,
  ],
};

/* ---------------------------- Wysyłka i dostawa ---------------------------- */

const shipping: LegalDoc = {
  slug: "frakt-och-leverans",
  title: "Wysyłka i dostawa",
  updated,
  intro:
    "Zamówienia złożone w dni robocze przed godziną 12:00 pakujemy i wysyłamy tego samego dnia z naszego magazynu w Szwecji. Darmowa wysyłka przy zamówieniach powyżej 339 zł.",
  metaTitle: "Wysyłka i dostawa – koszty, czas dostawy i śledzenie",
  metaDescription:
    "Koszty i czas dostawy Metilde do Polski, darmowa wysyłka powyżej 339 zł, śledzenie przesyłki, nieodebrane paczki i co zrobić w razie uszkodzenia przesyłki.",
  blocks: [
    { type: "h2", text: "Czas realizacji" },
    {
      type: "p",
      text: "Zamówienia pakujemy w dni robocze. Zamówienia, które wpłyną przed godziną 12:00, wysyłamy tego samego dnia, późniejsze – w następnym dniu roboczym. W czasie promocji i w okolicach świąt pakowanie może potrwać dzień dłużej.",
    },
    { type: "h2", text: "Koszty i czas dostawy" },
    { type: "shippingTable" },
    {
      type: "p",
      text: "Wszystkie ceny zawierają VAT. W tym sklepie dostarczamy zamówienia na adresy w Polsce. Zamówienia do Polski wysyłamy przez PostNord jako przesyłkę listową z możliwością śledzenia, z naszego magazynu w Szwecji; czas dostawy wynosi zwykle 3–6 dni roboczych. Wysyłka kosztuje 34 zł, a przy zamówieniach powyżej 339 zł jest darmowa. Subskrypcje i zestawy zawsze wysyłamy za darmo. Przesyłka nie opuszcza UE, więc nie płacisz cła ani opłat importowych.",
    },
    { type: "h2", text: "Śledzenie zamówienia" },
    {
      type: "p",
      text: "Po złożeniu zamówienia otrzymasz jego potwierdzenie, a gdy paczka opuści nasz magazyn – link do śledzenia przesyłki. Dostawę możesz też śledzić w zakładce Śledź zamówienie.",
    },
    { type: "h2", text: "Nieodebrane przesyłki" },
    {
      type: "p",
      text: "Przesyłki czekają w punkcie odbioru przez 14 dni. Nieodebrane przesyłki wracają do nas, a wtedy pobieramy faktyczny koszt wysyłki w obie strony. Jeśli nie zdążysz odebrać paczki na czas, lepiej daj nam znać – chętnie pomożemy.",
    },
    { type: "h2", text: "Uszkodzone lub brakujące przesyłki" },
    {
      type: "ul",
      items: [
        "Widoczne uszkodzenia w transporcie zgłoś w ciągu 7 dni od otrzymania przesyłki i dołącz zdjęcia paczki oraz produktów.",
        "Jeśli według śledzenia przesyłka została doręczona, ale nic nie otrzymałeś, najpierw zapytaj sąsiadów i w punkcie odbioru, a potem skontaktuj się z nami w ciągu 14 dni.",
        "Gdy tylko sprawa zostanie potwierdzona, wyślemy przesyłkę zastępczą lub zwrócimy pieniądze za zamówienie.",
      ],
    },
    ...helpBlock,
  ],
};

/* ----------------------------- Zwroty i wymiany ---------------------------- */

const returns: LegalDoc = {
  slug: "returer-och-byten",
  title: "Zwroty i wymiany",
  updated,
  intro:
    "Zawsze masz 30 dni na odstąpienie od umowy – dłużej niż ustawowe 14 dni. Nieotwarte produkty w oryginalnym stanie możesz zwrócić lub wymienić.",
  metaTitle: "Zwroty i wymiany – 30 dni na odstąpienie od umowy",
  metaDescription:
    "Jak zwrócić lub wymienić produkt w Metilde: 30 dni na odstąpienie od umowy, koszt odesłania, zwrot pieniędzy w ciągu 14 dni i trzy lata na reklamację.",
  blocks: [
    { type: "h2", text: "Twoje prawo odstąpienia od umowy" },
    {
      type: "p",
      text: "Jako konsument w UE masz ustawowe prawo do odstąpienia od umowy w ciągu 14 dni od dnia otrzymania zamówienia. My wydłużamy ten termin do 30 dni. Prawo odstąpienia dotyczy produktów nieotwartych i w zasadniczo niezmienionym stanie – ze względów higienicznych i bezpieczeństwa żywności nie możemy ponownie sprzedawać otwartych suplementów diety.",
    },
    { type: "h2", text: "Jak dokonać zwrotu" },
    {
      type: "ul",
      items: [
        `Zgłoś zwrot, pisząc na {epost} – podaj numer zamówienia i produkty, których dotyczy. Możesz też skorzystać z europejskiego wzoru formularza odstąpienia od umowy.`,
        `W ciągu jednego dnia roboczego otrzymasz etykietę zwrotną z adresem zwrotu i instrukcjami.`,
        "Zapakuj produkty w oryginalne opakowanie lub w podobne opakowanie ochronne.",
        "Nadaj przesyłkę i zachowaj dowód nadania do czasu zakończenia zwrotu pieniędzy.",
      ],
    },
    { type: "h2", text: "Koszt odesłania i zwrot pieniędzy" },
    {
      type: "table",
      head: ["Sytuacja", "Koszt odesłania", "Zwrot"],
      rows: [
        ["Odstąpienie od umowy (rezygnacja z zakupu)", "Pokrywasz Ty, 34 zł odliczamy od zwracanej kwoty", "Wartość zamówienia wraz z pierwotnym standardowym kosztem wysyłki"],
        ["Wysłano niewłaściwy produkt", "Bezpłatnie, z opłaconą przez nas etykietą", "Pełna kwota lub produkt zastępczy"],
        ["Uszkodzony lub wadliwy produkt", "Bezpłatnie, z opłaconą przez nas etykietą", "Pełna kwota lub produkt zastępczy"],
        ["Wymiana na inny produkt", "Pokrywasz Ty, jak przy zwrocie (34 zł), chyba że produkt był wadliwy", "Różnica jest dopłacana lub zwracana"],
      ],
    },
    {
      type: "p",
      text: "Zwrot pieniędzy następuje tą samą metodą płatności, której użyto przy zakupie, w ciągu 14 dni od otrzymania i zaakceptowania zwrotu – zwykle w ciągu 2–5 dni roboczych. Poza kosztem odesłania podanym w tabeli powyżej nie pobieramy żadnej dodatkowej opłaty za zwrot.",
    },
    { type: "h2", text: "Reklamacje" },
    {
      type: "p",
      text: "Na reklamację wadliwych produktów masz trzy lata zgodnie ze szwedzką ustawą o sprzedaży konsumenckiej (konsumentköplagen). Zgłoś wadę w rozsądnym terminie od jej wykrycia – termin dwóch miesięcy zawsze uznaje się za rozsądny. Dołącz zdjęcia i numer partii podany na etykiecie.",
    },
    { type: "h2", text: "Wyjątki" },
    {
      type: "ul",
      items: [
        "Otwarte suplementy diety lub produkty z naruszonym zabezpieczeniem – ze względów higienicznych i bezpieczeństwa żywności.",
        "Produkty, których data minimalnej trwałości upłynęła, gdy były w Twoim posiadaniu.",
      ],
    },
    { type: "h2", text: "Rozwiązywanie sporów" },
    { type: "p", text: disputeText },
    ...helpBlock,
  ],
};

/* -------------------------------- Zrównoważony rozwój ------------------------------ */

const sustainability: LegalDoc = {
  slug: "hallbarhet",
  title: "Zrównoważony rozwój",
  updated,
  intro:
    "Mniej, ale lepszych produktów, opakowania nadające się do recyklingu i łańcuch dostaw, który potrafimy wyjaśnić. Tak to wygląda dziś – i nad tym pracujemy dalej.",
  metaTitle: "Zrównoważony rozwój – opakowania, wysyłka i surowce",
  metaDescription:
    "Jak Metilde dba o zrównoważony rozwój: opakowania nadające się do recyklingu, zbiorcza wysyłka z jednego magazynu w Szwecji i udokumentowane surowce.",
  blocks: [
    { type: "h2", text: "Nasze podejście" },
    {
      type: "p",
      text: "Największy ślad marki suplementów diety to surowce, opakowania i transport. Pracujemy nad tymi trzema obszarami, w tej kolejności, i wolimy uczciwie mówić, gdzie jesteśmy, niż składać deklaracje, których nie potrafimy udokumentować.",
    },
    { type: "h2", text: "Opakowania" },
    {
      type: "ul",
      items: [
        "Karton zewnętrzny i wypełnienie są wykonane z papieru z recyklingu i trafiają do pojemnika na papier.",
        "Kapsułki dostarczamy w plastikowych pojemnikach z zakrętką, które chronią przed wilgocią i światłem. Pojemnik wyrzuć do odpadów z tworzyw sztucznych.",
        "Bez folii wokół opakowania zewnętrznego i bez drukowanych ulotek, o które nie prosiłeś.",
      ],
    },
    { type: "h2", text: "Wysyłka" },
    {
      type: "p",
      text: "Wysyłamy z jednego magazynu w Szwecji, przede wszystkim jako przesyłki listowe i do punktów odbioru, ponieważ zbiorcze trasy oznaczają mniej kilometrów na paczkę. Subskrypcje można łączyć w jedną dostawę, aby kilka produktów podróżowało razem.",
    },
    { type: "h2", text: "Surowce i odpowiedzialność społeczna" },
    {
      type: "ul",
      items: [
        "Dostawcy muszą dokumentować pochodzenie surowców i przestrzegać obowiązujących przepisów prawa pracy i ochrony środowiska.",
        "Kupujemy surowce od plantatorów z udokumentowanymi procedurami zbioru.",
        "Surowce botaniczne, które rosną wyłącznie poza Europą, kupujemy w możliwie dużych partiach, aby ograniczyć liczbę transportów.",
      ],
    },
    { type: "h2", text: "Czego jeszcze nie rozwiązaliśmy" },
    {
      type: "ul",
      items: [
        "Nie publikujemy jeszcze pełnego śladu węglowego dla każdego produktu.",
        "Niektóre surowce botaniczne można uprawiać wyłącznie poza Europą, co oznacza długie transporty.",
      ],
    },
    {
      type: "p",
      text: `Masz pytanie lub sugestię dotyczącą naszych działań na rzecz zrównoważonego rozwoju? Napisz na {epost} – czytamy wszystko.`,
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
