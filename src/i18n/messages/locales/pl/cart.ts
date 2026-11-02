import type { CartMessages } from "../../cart";

/** Polska odmiana: 1 / 2–4 (bez 12–14) / 5+. */
const plural = (n: number, one: string, few: string, many: string) => {
  if (n === 1) return one;
  const d = n % 10;
  const h = n % 100;
  return d >= 2 && d <= 4 && (h < 12 || h > 14) ? few : many;
};

export const messages: CartMessages = {
  // Rabaty na pozycjach koszyka
  bundleDiscount: (pct: number) => `Zestaw −${pct}%`,
  giftValue: (value: string) => `Prezent · wartość ${value}`,
  subDiscount: (pct: number) => `Subskrypcja −${pct}%`,
  tierDiscount: (pct: number) => `Rabat ilościowy −${pct}%`,

  // Sumy
  subtotal: "Suma częściowa",
  discount: "Rabat",
  shipping: "Dostawa",
  free: "Gratis",
  shippingFrom: (price: string) => `od ${price}`,
  toPay: "Do zapłaty",
  totalsNote: "Zawiera VAT. Sposób dostawy i ewentualny kod rabatowy wybierzesz w kroku płatności.",

  // Wspólne
  pcs: (n: number) => `${n} szt.`,
  perPcs: "/szt.",
  capsules: (n: number) => `${n} ${plural(n, "kapsułka", "kapsułki", "kapsułek")}`,
  save: (amount: string) => `Oszczędzasz ${amount}`,
  decrease: "Zmniejsz ilość",
  increase: "Zwiększ ilość",
  remove: "Usuń",
  soldOut: "Wyprzedane",
  tempOut: "Chwilowo niedostępne",
  added: "Dodano",
  addedToCart: "Dodano do koszyka",
  addToCart: "Dodaj do koszyka",
  addBundle: "Dodaj zestaw do koszyka",
  buy: "Kup",
  freeShipping: "Darmowa dostawa",
  gift: "Prezent",
  once: "Zakup jednorazowy",

  // Panel zakupu na stronie produktu (wariant A)
  planLegend: "Sposób zakupu",
  onceNote: "Płacisz raz, bez zobowiązań",
  subTitle: (pct: number) => `Subskrypcja – oszczędzasz ${pct}%`,
  subNote: "Darmowa dostawa, dowolny odstęp, rezygnujesz, kiedy chcesz",
  delivery: "Dostawa",
  deliveryHint: "– jak często chcesz otrzymywać dostawę?",
  everyDays: (d: number) => `Co ${d} ${plural(d, "dzień", "dni", "dni")}`,
  chooseQty: "Wybierz ilość",
  chooseQtyHint: "– więcej opakowań, niższa cena",

  // Panel oferty (wariant B)
  chooseOption: "Wybierz opcję zakupu",
  bestValue: "Najlepsza wartość",
  sub1Title: "Subskrypcja 1 opakowania",
  sub1Sub: (caps: number | null) =>
    `Zapas na 1 miesiąc${caps ? ` · ${caps} ${plural(caps, "kapsułka", "kapsułki", "kapsułek")}` : ""}`,
  freeEvery: (d: number) => `Darmowa dostawa · co ${d} ${plural(d, "dzień", "dni", "dni")}`,
  cancelAnytime: "Rezygnujesz, kiedy chcesz",
  packTitle: (n: number) => `Subskrypcja ${n} ${plural(n, "opakowania", "opakowań", "opakowań")}`,
  packSub: (n: number, caps: number | null) =>
    `Zapas na ${n} ${plural(n, "miesiąc", "miesiące", "miesięcy")}${caps ? ` · ${caps} ${plural(caps, "kapsułka", "kapsułki", "kapsułek")}` : ""}`,
  giftPoint: (name: string, value: string) => `+ ${name} w prezencie (wartość ${value})`,
  chooseGift: "Wybierz prezent",
  onceTitle: "Kup 1 opakowanie",
  onceSub: "Zakup jednorazowy, cena regularna",
  freeOver: (amount: string) => `Darmowa dostawa od ${amount}`,
  saveOffer: (pct: number, amount: string) => `Oszczędzasz ${pct}% · ${amount}`,
  onceFootnote: "Płacisz raz. Rabat i darmową dostawę dostajesz w subskrypcji.",
  subFootnote: "Bez okresu zobowiązania. Subskrypcję wstrzymasz lub zakończysz, kiedy chcesz.",
  giftFootnote: " Prezent dołączymy do pierwszej dostawy.",

  // Pozycja w koszyku
  giftNote: "Dołączymy go do Twojego zestawu wielopaku w pierwszej dostawie.",
  subscribeToggle: (pct: number) => `Subskrybuj −${pct}%`,
  deliveryEvery: "Dostawa co",
  dayN: (d: number) => `${d} ${plural(d, "dzień", "dni", "dni")}`,
  subHint: (price: string) => `Subskrypcja: ${price}/szt. i darmowa dostawa, rezygnujesz, kiedy chcesz.`,

  // Panel koszyka
  close: "Zamknij koszyk",
  title: "Twój koszyk",
  empty: "Twój koszyk jest pusty.",
  explore: "Poznaj naszą ofertę",
  remainingBefore: "Jeszcze ",
  remainingAfter: " do darmowej dostawy",
  haveFreeShipping: "To zamówienie ma darmową dostawę",
  toCheckout: "Do kasy",
  continueShopping: "Kontynuuj zakupy",
};
