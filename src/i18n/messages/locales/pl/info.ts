import type { InfoMessages } from "../../info";

export const messages: InfoMessages = {
  shippingTable: {
    destination: "Kraj dostawy",
    method: "Sposób dostawy",
    time: "Czas dostawy",
    cost: "Koszt",
    days: (from: number, to: number) => `${from}–${to} dni roboczych`,
    freeOver: (price: string, freeOver: string) => `${price} – darmowa dostawa od ${freeOver}`,
  },
  company: {
    legalEntity: "Podmiot prawny",
    orgNumber: "Numer rejestrowy spółki",
    vatId: "Numer VAT UE",
    address: "Adres",
    email: "E-mail",
    phone: "Telefon",
    hours: "pon.–pt. 9:00–17:00 (czasu szwedzkiego)",
    sweden: "Szwecja",
  },
  faq: {
    metaTitle: "Najczęściej zadawane pytania",
    metaDescription: "Odpowiedzi na najczęstsze pytania o zamówienia, płatności, dostawę, zwroty, subskrypcję i nasze produkty.",
    title: "Najczęściej zadawane pytania",
    eyebrow: "Obsługa klienta",
    intro: "Tutaj znajdziesz odpowiedzi na najczęstsze pytania o zamówienia, dostawę, subskrypcje i nasze produkty.",
    categories: "Kategorie",
    moreTitle: "Nie znalazłeś(-aś) odpowiedzi?",
    moreBefore: "Nasza obsługa klienta pracuje w dni robocze w godz. 9–17 (czasu szwedzkiego) i zwykle odpowiada w ciągu jednego dnia roboczego. Napisz na",
    moreOr: "lub zadzwoń pod",
    languages: "Nasza obsługa klienta odpowiada po szwedzku i po angielsku.",
    contact: "Skontaktuj się z nami",
    trackOrder: "Śledź zamówienie",
  },
  contact: {
    metaTitle: "Kontakt",
    metaDescription: "Masz pytanie o zamówienie, produkt lub subskrypcję? Obsługa klienta Metilde odpowiada w ciągu 1–2 dni roboczych.",
    title: "Skontaktuj się z nami",
    eyebrow: "Obsługa klienta",
    intro: "Zwykle odpowiadamy w ciągu 1–2 dni roboczych. Jeśli chodzi o bieżące zamówienie, podaj jego numer – wtedy pójdzie najszybciej.",
    languages: "Nasza obsługa klienta odpowiada po szwedzku i po angielsku.",
    formTitle: "Wyślij wiadomość",
    otherWays: "Inne sposoby kontaktu",
    email: "E-mail",
    phone: "Telefon",
    swedishTime: "czasu szwedzkiego",
    companyInfo: "Dane firmy",
    trackTitle: "Chcesz tylko wiedzieć, gdzie jest paczka?",
    trackText: "Śledź przesyłkę od razu za pomocą numeru zamówienia i adresu e-mail.",
    trackLink: "Śledź zamówienie",
    faqTitle: "Szybkie odpowiedzi",
    faqText: "Na wiele pytań o dostawę, zwroty i subskrypcję odpowiadamy już w najczęściej zadawanych pytaniach.",
    faqLink: "Do najczęstszych pytań",
  },
  story: {
    metaTitle: "Nasza historia – tak powstała Metilde",
    metaDescription:
      "Metilde zaczęła się od prostej frustracji: za mało czystych suplementów diety bez komplikacji. Przeczytaj, jak powstała marka i dlaczego subskrypcja była oczywistym wyborem.",
    title: "Nasza historia",
    eyebrow: "O Metilde",
    intro:
      "Metilde narodziła się z frustracji, którą zna wiele osób: dlaczego tak trudno znaleźć czyste suplementy diety bez komplikacji? To pytanie sprawiło, że Matilda odłożyła wszystko inne na bok i zbudowała markę od podstaw.",
    sections: [
      {
        title: "Na półce czegoś brakowało",
        body: [
          "Matilda od dawna stosowała suplementy diety, ale im więcej czytała, tym bardziej była sfrustrowana. Wiele produktów było pełnych wypełniaczy, słodzików i składników, które niczego nie wnosiły. Do tego ceny były często wysokie za produkty, które nie zawierały nawet tego, co obiecywały.",
          "Nie brakowało marek, które mówiły o zdrowiu i dobrym samopoczuciu, ale niewiele z nich wyjaśniało, dlaczego produkt naprawdę jest wart swojej ceny. Wtedy zaczął kiełkować pomysł na Metilde: markę, która stawia na czystość i przejrzystość, w której klient dostaje to, za co płaci, i nic więcej.",
        ],
      },
      {
        title: "Subskrypcja, która powinna działać lepiej",
        body: [
          "Irytowało też to, że praktycznie nie dało się subskrybować suplementów diety. To, co było dostępne, to albo skomplikowane abonamenty z okresem wypowiedzenia, albo rozwiązania, w których trzeba było samemu pamiętać o zamówieniu.",
          "Dlatego Metilde zbudowała subskrypcję, która naprawdę jest uczciwa: cena niższa o 15%, darmowa dostawa i możliwość wstrzymania, zmiany lub zakończenia w dowolnym momencie. Bez okresu zobowiązania, bez ukrytych opłat.",
        ],
      },
      {
        title: "Od Matildy do Metilde",
        body: [
          "Gdy przyszło do wyboru nazwy, pierwsza opcja była oczywista. Wszystkie domeny z \"Matilda\" były już zajęte, więc musiało to być coś bliskiego – trochę prostszego, trochę czystszego. Metilde.com była wolna, a nazwa od razu wydała się właściwa.",
        ],
      },
      {
        title: "Kolejny krok: rozwój oferty",
        body: [
          "Nie będziemy dokładać nowych produktów tylko dlatego, że dobrze to wygląda. Każdy ekstrakt ma być w ofercie, bo ma swój cel, prawdziwą jakość i spełnia te same wymagania, które postawiliśmy sobie od pierwszego dnia.",
        ],
      },
    ],
    valuesEyebrow: "Wartości",
    valuesTitle: "Co jest dla nas ważne",
    values: [
      ["Bez komplikacji", "Podajemy dokładnie, co zawiera każdy produkt. Bez ozdobników, bez ukrytych dodatków."],
      ["Dostajesz to, za co płacisz", "Surowce, kapsułki, opakowanie. Na to wydajemy pieniądze – nie na drogie kampanie reklamowe."],
      ["Prawdziwa subskrypcja", "15% rabatu, darmowa dostawa i pełna kontrola. Wstrzymaj, zmień lub zakończ, kiedy chcesz."],
      ["Szwedzka marka", "Ofertę tworzymy w Szwecji i stąd wysyłamy każde zamówienie."],
    ] as [string, string][],
    companyEyebrow: "Firma",
    companyTitle: "O firmie",
    companyIntro: (legalName: string) =>
      `Metilde prowadzi spółka ${legalName}. Tutaj znajdziesz nasze pełne dane firmowe – chcemy, żebyś zawsze wiedział(-a), od kogo kupujesz.`,
    legalName: "Nazwa prawna",
    customerService: "Obsługa klienta",
    ctaTitle: "To dopiero początek",
    ctaText:
      "Metilde to młoda marka, ale cel jest jasny: rozwijać ofertę i stać się dużym graczem na rynku czystych, roślinnych suplementów diety. Robimy to, będąc uczciwymi, dbając o wysoką jakość i słuchając naszych klientów.",
    ctaProducts: "Odkryj produkty",
    ctaSubscription: "Przeczytaj o subskrypcji",
  },
};
