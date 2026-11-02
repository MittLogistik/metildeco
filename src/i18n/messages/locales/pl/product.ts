import type { ProductMessages } from "../../product";

export const messages: ProductMessages = {
  notFound: "Nie znaleziono produktu",
  products: "Produkty",
  vegan: "Wegański",
  inclVat: "z VAT",
  soldOut: "Wyprzedane – kolejna dostawa w drodze",
  lowStock: (n: number) => `Dostępny – ostatnie ${n} szt.`,
  inStock: "Dostępny – zamówienia złożone w dni robocze do 12:00 (czasu szwedzkiego) wysyłamy tego samego dnia",
  shippingFrom: (from: string, freeOver: string) => `Dostawa od ${from}, darmowa dostawa od ${freeOver}.`,
  deliveryTime: (min: number, max: number) => `Czas dostawy ${min}–${max} dni roboczych`,
  returnRight: "30 dni na odstąpienie od umowy",
  securePayment: "Bezpieczna płatność przez",
  summary: "Produkt w skrócie",
  description: "Opis",
  facts: "Specyfikacja",
  sku: "Numer artykułu",
  ingredients: "Skład",
  usage: "Sposób użycia",
  qualityTitle: "Jak dbamy o jakość",
  quality: [
    { t: "Nazwa łacińska", d: "Gatunek i część rośliny są podane na każdym opakowaniu." },
    { t: "Jasne dawkowanie", d: "Moc ekstraktu i ilość na kapsułkę są podane na etykiecie." },
    { t: "Opracowane w Szwecji", d: "Wegańska kapsułka bez wypełniaczy, pakowana w plastikowy słoik." },
  ],
  faq: "Najczęściej zadawane pytania",
  disclaimer:
    "Suplement diety nie może być stosowany jako substytut zróżnicowanej diety i zdrowego stylu życia. Nie należy przekraczać zalecanej porcji do spożycia w ciągu dnia. Przechowywać w miejscu niedostępnym dla małych dzieci.",
  related: "Może Ci się też spodobać",
};
