import type { SubscriptionMessages } from "../../subscription";

export const messages: SubscriptionMessages = {
  title: (pct: number) => `Subskrypcja – oszczędzasz ${pct}% na każdej dostawie`,
  description: (pct: number) =>
    `Subskrybuj swoje suplementy diety i oszczędzaj ${pct}% na każdej dostawie. Darmowa dostawa, dowolny odstęp między dostawami i rezygnacja, kiedy chcesz.`,
  breadcrumb: "Subskrypcja",
  eyebrow: (pct: number) => `Oszczędzasz ${pct}%`,
  h1: "Subskrypcja – suplementy dostarczane automatycznie",
  lead: (pct: number) =>
    `Koniec z pustymi opakowaniami i zapomnianymi zamówieniami. Subskrybuj to, czego używasz na co dzień, i oszczędzaj ${pct}% na każdej dostawie – z darmową dostawą i bez okresu zobowiązania.`,
  start: "Rozpocznij subskrypcję",
  how: "Jak to działa",
  checks: ["Bez okresu zobowiązania", "Darmowa dostawa", "Rezygnujesz, kiedy chcesz"],
  stepsEyebrow: "Krok po kroku",
  stepsIntro: "Cztery proste kroki – a kontrola cały czas zostaje po Twojej stronie.",
  steps: [
    ["Wybierz produkt", "Wybierz ekstrakty, których używasz regularnie, i zaznacz Subskrypcję na stronie produktu."],
    ["Wybierz odstęp", "Dostawa co 30, 60 lub 90 dni – dopasuj do tego, jak szybko kończy się Twoje opakowanie."],
    ["Odbieraj automatycznie", "Na początku każdego nowego okresu pobieramy płatność, a Ty dostajesz e-mail z przewidywaną datą dostawy. Zawsze darmowa dostawa, niezależnie od wartości zamówienia."],
    ["Wstrzymaj lub zakończ", "Chcesz wstrzymać, wznowić lub zakończyć subskrypcję albo zmienić odstęp czy produkt? Napisz do obsługi klienta, a wszystko załatwimy – zupełnie bez okresu zobowiązania."],
  ] as [string, string][],
  exampleEyebrow: "Przykładowe wyliczenie",
  exampleTitle: "Ile na tym zyskujesz?",
  exampleIntro: (pct: number) =>
    `${pct}% rabatu obowiązuje przy każdej dostawie, nie tylko przy pierwszej. Z darmową dostawą różnica jest widoczna już po kilku miesiącach.`,
  exampleChecks: (pct: number, zero: string) => [
    `Cena niższa o ${pct}% na każde opakowanie`,
    `${zero} za dostawę`,
    "Produkt nie skończy Ci się w połowie stosowania",
  ],
  example: (name: string) => `Przykład · ${name}`,
  oneTime: "Zakup jednorazowy",
  perDelivery: (price: string) => `${price} / dostawa`,
  subscriptionLabel: "Subskrypcja",
  shipping: "Dostawa",
  yearly: "Oszczędzasz rocznie (6 dostaw, co 60 dni)",
  exampleNote: "Bez uwzględnienia zaoszczędzonych kosztów dostawy. Twoja cena zależy od wybranych produktów i odstępu.",
  benefitsEyebrow: "Korzyści",
  benefitsTitle: "Korzyści z subskrypcji",
  benefits: (pct: number) =>
    [
      [`${pct}% rabatu za każdym razem`, "Rabat obowiązuje, dopóki subskrypcja jest aktywna – nie tylko przy pierwszym zamówieniu."],
      ["Zawsze darmowa dostawa", "Bez opłaty za dostawę zamówień w subskrypcji, bez względu na to, jak małe jest zamówienie."],
      ["Bez okresu zobowiązania", "Rezygnujesz, kiedy chcesz. Bez opłat, bez okresu wypowiedzenia."],
      ["Wstrzymaj, gdy potrzebujesz", "Wyjeżdżasz albo masz jeszcze zapas? Poproś obsługę klienta o wstrzymanie subskrypcji. Nie pobieramy żadnych płatności, dopóki jej nie wznowisz."],
      ["Bez niespodzianek", "Nigdy nie zmieniamy ceny trwającej subskrypcji bez wcześniejszej informacji, a Ty zawsze możesz zrezygnować, zanim zmiana wejdzie w życie."],
      ["Bezpieczna płatność", "Płać bezpiecznie kartą, przez Klarna, Apple Pay lub Google Pay. Potwierdzenie płatności e-mailem przy każdej dostawie."],
    ] as [string, string][],
  popularEyebrow: "Popularne w subskrypcji",
  popularTitle: "Ekstrakty, których wiele osób używa codziennie",
  faqTitle: "Najczęściej zadawane pytania",
  faq: [
    { q: "Jak zakończyć subskrypcję?", a: "Napisz do naszej obsługi klienta – zakończymy subskrypcję za Ciebie i potwierdzimy to na piśmie. Nie pobierzemy już żadnych płatności, a subskrypcja wygaśnie z końcem okresu, za który już zapłaciłeś(-aś)." },
    { q: "Czy mogę zmienić odstęp między dostawami lub adres?", a: "Przeprowadzasz się albo chcesz zmienić odstęp, liczbę opakowań lub produkt? Napisz do obsługi klienta, a załatwimy to przed kolejną dostawą." },
    { q: "Czy mogę mieć kilka produktów w jednej subskrypcji?", a: "Tak. Jeśli w jednym zakupie zamówisz kilka produktów z tym samym odstępem, trafią do tej samej subskrypcji i przyjdą w jednej paczce." },
    { q: "Kiedy pobierana jest płatność?", a: "Za pierwszą dostawę płacisz przy zakupie. Potem płatność jest pobierana automatycznie na początku każdego nowego okresu, co 30, 60 lub 90 dni licząc od zakupu. Paczkę wysyłamy kilka dni po pobraniu płatności, a Ty dostajesz e-mail z przewidywaną datą dostawy." },
  ],
};
