/** Najczęściej zadawane pytania (pl-PL). Svaren följer köpvillkor, fraktsida och retursida för Polen. */
import type { FaqGroup } from "@/content/faq";
import { company } from "@/lib/site";

export const faqGroups: FaqGroup[] = [
  {
    id: "bestallning",
    title: "Zamówienie i płatność",
    items: [
      {
        q: "Jakie metody płatności mogę wybrać?",
        a: "Możesz zapłacić przez Klarna, kartą Visa, Mastercard lub American Express, a także przez Apple Pay i Google Pay. Płatności obsługuje Stripe – nigdy nie przechowujemy danych Twojej karty.",
      },
      {
        q: "Czy mogę zmienić lub anulować zamówienie?",
        a: `Napisz jak najszybciej na ${company.email} i podaj numer zamówienia. Jeśli zamówienie nie zostało jeszcze spakowane, zmienimy je lub anulujemy. Jeśli zostało już wysłane, możesz skorzystać z prawa odstąpienia od umowy po otrzymaniu przesyłki.`,
      },
      {
        q: "Czy dostanę potwierdzenie zakupu?",
        a: "Tak, potwierdzenie zamówienia z dowodem zakupu wyślemy na Twój adres e-mail od razu po zakończeniu płatności.",
      },
      {
        q: "Czy mogę kupować jako firma?",
        a: `Tak. Podaj nazwę firmy i NIP w polu adresu albo napisz na ${company.email}, jeśli potrzebujesz faktury.`,
      },
    ],
  },
  {
    id: "frakt",
    title: "Wysyłka i dostawa",
    items: [
      {
        q: "Ile kosztuje dostawa?",
        a: "Dostawa do Polski kosztuje 34 zł, a przy wszystkich zamówieniach powyżej 339 zł jest darmowa. Subskrypcje i zestawy zawsze wysyłamy z darmową dostawą. Aktualne ceny znajdziesz na stronie Wysyłka i dostawa.",
      },
      {
        q: "Jak długo trwa dostawa?",
        a: "Zamówienia złożone w dni robocze do 12:00 (czasu szwedzkiego) wysyłamy tego samego dnia z naszego magazynu w Szwecji. Dostawa do Polski trwa zwykle 3–6 dni roboczych.",
      },
      {
        q: "Czy dostarczacie do Polski?",
        a: "Tak. Zamówienia do Polski wysyłamy z naszego magazynu w Szwecji przez PostNord jako list ze śledzeniem. Przesyłka nie opuszcza UE, więc nie płacisz cła ani opłat importowych.",
      },
      {
        q: "Jak śledzić paczkę?",
        a: "Gdy paczka opuści magazyn, dostaniesz e-mailem link do śledzenia. Możesz też podać numer zamówienia i adres e-mail w zakładce Śledź zamówienie.",
      },
    ],
  },
  {
    id: "retur",
    title: "Zwroty i reklamacje",
    items: [
      {
        q: "Jakie prawo odstąpienia od umowy obowiązuje?",
        a: "30 dni od otrzymania zamówienia – dłużej niż ustawowe 14 dni. Produkt musi być nieotwarty, ponieważ ze względów higienicznych i bezpieczeństwa żywności nie możemy ponownie sprzedawać otwartych suplementów diety.",
      },
      {
        q: "Jak zwrócić produkt?",
        a: `Napisz na ${company.email}, podając numer zamówienia i produkty, których dotyczy zwrot. W ciągu jednego dnia roboczego otrzymasz etykietę zwrotną i instrukcje. Przy odstąpieniu od umowy koszt odesłania pokrywasz Ty – od zwracanej kwoty odejmujemy 34 zł. Zwrot pieniędzy następuje w ciągu 14 dni od otrzymania przez nas zwrotu.`,
      },
      {
        q: "Co zrobić, jeśli produkt jest uszkodzony?",
        a: "Zgłoś uszkodzenie w ciągu 7 dni i dołącz zdjęcia przesyłki i produktu. Wyślemy produkt zastępczy albo zwrócimy pieniądze, a koszt odesłania pokrywamy my.",
      },
    ],
  },
  {
    id: "prenumeration",
    title: "Subskrypcja",
    items: [
      {
        q: "Jak działa subskrypcja?",
        a: "Wybierz Subskrypcję na stronie produktu – otrzymasz 15% rabatu i darmową dostawę przy każdej dostawie. Sam(-a) wybierasz odstęp (30, 60 lub 90 dni) i możesz wstrzymać lub zakończyć subskrypcję, kiedy chcesz.",
      },
      {
        q: "Kiedy pobierana jest płatność?",
        a: "Za pierwszą dostawę płacisz przy zakupie. Potem płatność jest pobierana automatycznie na początku każdego nowego okresu, co 30, 60 lub 90 dni licząc od zakupu. Paczkę wysyłamy kilka dni po pobraniu płatności, a Ty dostajesz e-mail z przewidywaną datą dostawy.",
      },
      {
        q: "Jak wstrzymać lub zakończyć subskrypcję?",
        a: "Napisz do naszej obsługi klienta, a wstrzymamy lub zakończymy subskrypcję za Ciebie i potwierdzimy to na piśmie. Wstrzymanie działa od razu i nie pobieramy płatności, dopóki nie wznowisz subskrypcji. Po zakończeniu nie pobieramy już płatności, a subskrypcja wygasa z końcem opłaconego okresu. Bez okresu zobowiązania i bez opłat.",
      },
      {
        q: "Czy mogę zmienić produkt lub odstęp między dostawami?",
        a: "Tak. Napisz do obsługi klienta, a przed kolejną dostawą zmienimy odstęp, liczbę opakowań, produkt lub adres dostawy.",
      },
    ],
  },
  {
    id: "produkter",
    title: "Produkty i jakość",
    items: [
      {
        q: "Skąd pochodzą wasze produkty?",
        a: "Surowce i ekstrakty pochodzą z krajów, w których rośliny naturalnie występują, na przykład maca z Andów.",
      },
      {
        q: "Skąd mam wiedzieć, jaką partię otrzymałem(-am)?",
        a: "Numer partii i data minimalnej trwałości są podane na opakowaniu. Podaj numer partii, jeśli kontaktujesz się z nami w sprawie produktu – wtedy możemy go zidentyfikować.",
      },
      {
        q: "Czy produkty zawierają zbędne dodatki?",
        a: "Nie. Nasze kapsułki zawierają ekstrakt i roślinną otoczkę – bez substancji wiążących, wypełniaczy, barwników i słodzików.",
      },
      {
        q: "Jak przechowywać produkty?",
        a: "W suchym miejscu w temperaturze pokojowej, z dobrze zakręconą pokrywką po każdym użyciu, w miejscu niedostępnym dla małych dzieci.",
      },
    ],
  },
  {
    id: "konto",
    title: "Konto i prywatność",
    items: [
      {
        q: "Czy muszę założyć konto, żeby robić zakupy?",
        a: "Nie, możesz kupować jako gość. Konto jest potrzebne tylko do zarządzania subskrypcjami i przeglądania historii zamówień.",
      },
      {
        q: "Jak przetwarzacie moje dane osobowe?",
        a: "Twoich danych używamy do realizacji zamówienia i obsługi konta. Jeśli zaakceptujesz marketingowe pliki cookie, udostępniamy też niektóre informacje firmom Meta i Google, aby mierzyć skuteczność naszych reklam. Nigdy nie sprzedajemy Twoich danych. Więcej w naszej polityce prywatności.",
      },
    ],
  },
];
