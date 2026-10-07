import { company, logistics } from "./site";

/**
 * Platshållare i sidtexter (villkor, policyer, informationssidor). Fylls i när sidan visas,
 * så att texter som sparats i admin alltid visar aktuella företagsuppgifter från lib/site.
 */
export const placeholders: { key: string; label: string; value: () => string }[] = [
  { key: "företag", label: "Säljarens juridiska namn", value: () => company.legalName },
  { key: "orgnr", label: "Organisationsnummer / EIN", value: () => company.orgNumber },
  { key: "adress", label: "Säljarens adress", value: () => company.address },
  { key: "epost", label: "Kundtjänstens e-post", value: () => company.email },
  { key: "telefon", label: "Telefon", value: () => company.phone },
  { key: "öppettider", label: "Kundtjänstens öppettider", value: () => company.hours },
  { key: "returadress", label: "Adress för returer (lagret)", value: () => `${logistics.legalName}, ${logistics.address.replace(/, Sverige$/, "")}` },
];

const byKey = new Map(placeholders.map((p) => [p.key, p.value]));

/** Byter {nyckel} mot aktuellt värde. Okända nycklar lämnas orörda. */
export const fillPlaceholders = (text: string) => text.replace(/\{([a-zåäö]+)\}/g, (m, key: string) => byKey.get(key)?.() ?? m);

/** Raderna i blocket "Företagsuppgifter". */
export function companyInfoItems(): string[] {
  return [
    `Juridisk enhet: ${company.legalName}`,
    `${company.idLabel === "Org.nr" ? "Organisationsnummer" : company.idLabel}: ${company.orgNumber}`,
    ...(company.vatId ? [`Momsregistreringsnummer: ${company.vatId}`] : []),
    `Adress: ${company.address}`,
    `E-post: ${company.email}`,
    `Telefon: ${company.phone} (${company.hours})`,
    ...(company.separateLogistics
      ? [`Lager, packning, leveranser och returer sköts av ${logistics.legalName} (org.nr ${logistics.orgNumber}), ${logistics.address}, för ${company.legalName}s räkning.`]
      : []),
  ];
}
