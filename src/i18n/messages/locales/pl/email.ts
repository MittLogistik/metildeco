import type { EmailText } from "@/lib/email-text";

export const messages: EmailText = {
  subjectOrder: (n: string) => `Dziękujemy za zamówienie ${n}`,
  subjectRenewal: (n: string) => `Dostawa ${n} w ramach subskrypcji jest zaplanowana`,
  headingOrder: "Dziękujemy za zamówienie!",
  headingRenewal: "Twoja kolejna dostawa jest zaplanowana",
  renewalWithDate: (d: string) =>
    `Twoja subskrypcja została odnowiona. Kolejne opakowanie wyślemy tak, aby dotarło do Ciebie około ${d}.`,
  renewalNoDate: "Twoja subskrypcja została odnowiona, a paczka jest właśnie pakowana.",
  orderNumber: "Numer zamówienia",
  received:
    "Otrzymaliśmy Twoją płatność. Zamówienia złożone w dni robocze do 12:00 (CET) wysyłamy tego samego dnia.",
  subscription: "subskrypcja",
  gift: "prezent",
  discount: "Rabat",
  shipping: "Dostawa",
  free: "Gratis",
  total: "Razem",
  deliverTo: "Adres dostawy",
  afterOrder: (returnsLink: string) =>
    `Gdy paczka opuści nasz magazyn, dostaniesz e-mail z linkiem do śledzenia. Na nieotwarte produkty masz 30 dni na odstąpienie od umowy – więcej na ${returnsLink}.`,
  returnsLinkText: "naszych stronach o zwrotach",
  questions: (phone: string, hours: string) =>
    `Pytania? Odpowiedz na tego e-maila lub zadzwoń pod ${phone} (${hours}). Nasza obsługa klienta odpowiada po szwedzku i po angielsku.`,
  questionsText: (phone: string) =>
    `Pytania? Odpowiedz na tego e-maila lub zadzwoń pod ${phone}. Nasza obsługa klienta odpowiada po szwedzku i po angielsku.`,
  shippedSubject: (n: string) => `Twoje zamówienie ${n} jest w drodze`,
  shippedHeading: "Twoja paczka jest w drodze",
  shippedBody: (n: string, carrier: string | null) =>
    `Zamówienie ${n} opuściło nasz magazyn${carrier ? ` (przewoźnik: ${carrier})` : ""}.`,
  parcelId: "Numer przesyłki",
  track: "Śledź paczkę",
  trackShort: "Śledź",
  trackingDelay: "Może minąć kilka godzin, zanim śledzenie pokaże pierwsze zdarzenie.",
};
