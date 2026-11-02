import type { CommonMessages } from "../../common";

export const messages: CommonMessages = {
  siteTitle: "Metilde – Czyste suplementy diety z roślin, opracowane w Szwecji",
  siteDescription: (freeOver: string) =>
    `Standaryzowane ekstrakty z ziół i grzybów bez wypełniaczy, opracowane w Szwecji. Darmowa dostawa od ${freeOver}.`,
  notFound: {
    title: "Nie znaleziono strony",
    text: "Adres mógł się zmienić albo produktu nie ma już w ofercie.",
    home: "Na stronę główną",
  },
};
