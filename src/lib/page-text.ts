import { info } from "@/i18n/messages/info";
import type { Locale } from "./i18n";
import { company } from "./site";

/** Adresser i site.ts slutar på ", Sverige" – landsnamnet på sidans språk. */
const localizeCountry = (address: string, locale: Locale) => address.replace(/, Sverige$/, `, ${info[locale].company.sweden}`);

/** Kundtjänstens öppettider på sidans språk (svenska = company.hours). */
export const hoursFor = (locale: Locale = "sv"): string => (locale === "sv" ? company.hours : info[locale].company.hours);

/**
 * Platshållare i sidtexter (villkor, policyer, informationssidor). Fylls i när sidan visas,
 * så att texter som sparats i admin alltid visar aktuella företagsuppgifter från lib/site.
 * `label` visas i admin (svenska); `value` får sidans språk.
 */
export const placeholders: { key: string; label: string; value: (locale?: Locale) => string }[] = [
  { key: "företag", label: "Säljarens juridiska namn", value: () => company.legalName },
  { key: "orgnr", label: "Organisationsnummer / EIN", value: () => company.orgNumber },
  { key: "adress", label: "Säljarens adress", value: (l = "sv") => localizeCountry(company.address, l) },
  { key: "epost", label: "Kundtjänstens e-post", value: () => company.email },
  { key: "telefon", label: "Telefon", value: () => company.phone },
  { key: "öppettider", label: "Kundtjänstens öppettider", value: (l = "sv") => hoursFor(l) },
];

const byKey = new Map(placeholders.map((p) => [p.key, p.value]));

/** Byter {nyckel} mot aktuellt värde. Okända nycklar lämnas orörda. */
export const fillPlaceholders = (text: string, locale: Locale = "sv") =>
  text.replace(/\{([a-zåäö]+)\}/g, (m, key: string) => byKey.get(key)?.(locale) ?? m);

/** Raderna i blocket "Företagsuppgifter". */
export function companyInfoItems(locale: Locale = "sv"): string[] {
  const t = info[locale].company;
  return [
    `${t.legalEntity}: ${company.legalName}`,
    `${company.idLabel === "Org.nr" ? t.orgNumber : company.idLabel}: ${company.orgNumber}`,
    ...(company.vatId ? [`${t.vatId}: ${company.vatId}`] : []),
    `${t.address}: ${localizeCountry(company.address, locale)}`,
    `${t.email}: ${company.email}`,
    `${t.phone}: ${company.phone} (${hoursFor(locale)})`,
  ];
}
