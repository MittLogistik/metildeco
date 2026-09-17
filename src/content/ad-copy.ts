/**
 * Annonstexter för Meta. Regel: inga hälsopåståenden, inga löften om effekt.
 * Vi beskriver botanik, extraktstyrka, dos, tillverkning, tester och villkor.
 * Varje vinkel ger en primärtext + rubrik; motorn kombinerar vinklar med bilder/video.
 */

export type AdAngle = {
  id: string;
  /** Primärtext (visas ovanför bilden). Använd {name} och {hook}. */
  text: string;
  /** Rubrik under bilden. */
  headline: string;
  description?: string;
};

/**
 * Produktspecifika "hooks": rena faktameningar om produkten, hämtade från produktdatan.
 * Saknas produkten här används produktens egen kortbeskrivning.
 */
export const productHooks: Record<string, string[]> = {
  "tongkat-ali-elite": [
    "200:1 rotextrakt av Eurycoma longifolia, 450 mg per kapsel.",
    "Koncentrerat 200:1-extrakt i vegansk kapsel, utan tillsatser. En kapsel om dagen.",
    "200 delar torkad rot blir 1 del extrakt. 450 mg per kapsel, 60 kapslar per burk.",
  ],
  "tongkat-premium": [
    "200:1-rotextrakt standardiserat till 4 % eurycomanon, 500 mg per kapsel.",
    "Ultra 4 % är den högsta standardiseringen i vårt sortiment: 20 mg eurycomanon per kapsel.",
  ],
  "black-tongkat": [
    "Black Tongkat är en annan växt än klassisk Tongkat Ali: Polyalthia bullata, 200:1-rotextrakt, 500 mg per kapsel.",
    "Handskördad svart rot, koncentrerad 200:1. Vegetabiliskt kapselskal, inga fyllnadsmedel.",
  ],
  "fadogia-agrestis": ["20:1-extrakt av Fadogia agrestis, 450 mg per kapsel.", "Fadogia agrestis som 20:1-extrakt i vegansk kapsel, 60 kapslar per burk."],
  "blue-lotus": ["Blå lotus (Nymphaea caerulea) som 200:1-extrakt, 400 mg per kapsel."],
  reishi: ["Reishiextrakt standardiserat till 40 % polysackarider, 350 mg per kapsel."],
  "lions-mane": ["Lion's Mane-extrakt med 60 % polysackarider, varav 45 % betaglukaner. 500 mg per kapsel."],
  cordyceps: ["Cordyceps militaris som 8:1-extrakt, 40 % polysackarider, 350 mg per kapsel."],
  chaga: ["30:1-extrakt av vildskördad chaga, 10 % polysackarider, 400 mg per kapsel."],
  maca: ["Macarot från Anderna i koncentrerat 20:1-extrakt, 470 mg per kapsel."],
};

export const angles: AdAngle[] = [
  {
    id: "extrakt",
    text: "{hook}\n\n{name} tillverkas i Sverige och varje batch analyseras av oberoende labb innan den packas. Inga bindemedel, fyllnadsmedel eller färgämnen.",
    headline: "{name}",
    description: "Tillverkad i Sverige · Tredjepartstestad",
  },
  {
    id: "jamfor",
    text: "Alla extrakt är inte likadana.\n\nVi visar extraktstyrka, dos per kapsel och analysresultat öppet, så att du kan jämföra innehållet i stället för etiketten.\n\n{hook}",
    headline: "Jämför innehållet, inte etiketten",
    description: "{name} från Metilde",
  },
  {
    id: "rutin",
    text: "En kapsel om dagen, klart.\n\n{name} kommer i vegansk kapsel utan onödiga tillsatser. {hook}",
    headline: "Enkel daglig rutin",
    description: "60 kapslar · Fri frakt över 499 kr",
  },
  {
    id: "prenumeration",
    text: "Prenumerera på {name} och spara 15 % på varje leverans.\n\nVälj var 30:e, 60:e eller 90:e dag. Pausa eller avsluta när du vill, direkt på Mitt konto.",
    headline: "Prenumerera och spara 15 %",
    description: "Pausa när du vill",
  },
  {
    id: "svenskt",
    text: "{hook}\n\nTillverkad i Sverige, skickas samma dag vid order före 12. Fri frakt över 499 kr och 30 dagars öppet köp.",
    headline: "Tillverkad i Sverige",
    description: "Skickas samma dag · 30 dagars öppet köp",
  },
];

export const fillCopy = (template: string, vars: { name: string; hook: string }) =>
  template.replace(/\{name\}/g, vars.name).replace(/\{hook\}/g, vars.hook).trim();
