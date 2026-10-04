import type { Metadata } from "next";
import { getProducts } from "@/lib/catalog";
import { isInStock } from "@/lib/products";
import { formatPrice } from "@/lib/format";
import { routes } from "@/lib/routes";
import { site } from "@/lib/site";
import { Accordion } from "@/components/Accordion";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CheckIcon } from "@/components/icons";
import { ProductCard } from "@/components/ProductCard";
import { ButtonLink, Container, Eyebrow, SectionHeading } from "@/components/ui";

export const metadata: Metadata = {
  title: `Prenumeration – spara ${site.subscriptionDiscount} % på varje leverans`,
  description:
    "Prenumerera på dina kosttillskott och spara 15 % på varje leverans. Fri frakt, valfritt intervall och avsluta när du vill.",
  alternates: { canonical: `${site.url}${routes.subscription}` },
};

const steps = [
  ["Välj produkt", "Välj de extrakt du använder regelbundet och klicka i Prenumerera på produktsidan."],
  ["Välj intervall", "Leverans var 30:e, 60:e eller 90:e dag – anpassa efter hur snabbt din förpackning tar slut."],
  ["Få hem den automatiskt", "Vid varje ny period dras betalningen och du får ett mejl med beräknad leveransdag. Alltid fri frakt, oavsett ordervärde."],
  ["Pausa eller avsluta", "Pausa, återuppta eller avsluta på Mitt konto – helt utan bindningstid. Vill du byta intervall eller produkt hjälper kundservice dig."],
];

const benefits = [
  ["15 % rabatt varje gång", "Rabatten gäller så länge prenumerationen är aktiv – inte bara första ordern."],
  ["Alltid fri frakt", "Ingen fraktavgift på prenumerationsordrar, oavsett hur liten ordern är."],
  ["Ingen bindningstid", "Avsluta när du vill. Inga avgifter, ingen uppsägningstid."],
  ["Pausa vid behov", "Åker du bort eller har en förpackning kvar? Pausa prenumerationen på Mitt konto. Inga pengar dras förrän du återupptar den."],
  ["Inga överraskningar", "Vi ändrar aldrig priset på en pågående prenumeration utan att meddela dig i förväg, och du kan alltid avsluta innan ändringen gäller."],
  ["Trygg betalning", "Betala tryggt med kort, Klarna, Apple Pay eller Google Pay. Kvitto via e-post vid varje leverans."],
];

const faq = [
  { q: "Hur avslutar jag min prenumeration?", a: "Logga in på Mitt konto, gå till Prenumerationer och välj Avsluta. Inga fler dragningar görs och prenumerationen upphör när den period du redan betalat är slut. Du kan också mejla kundservice så avslutar vi den åt dig och bekräftar skriftligen." },
  { q: "Kan jag ändra leveransintervall eller adress?", a: "Adress och betalsätt ändrar du själv under Mitt konto. Vill du byta intervall, antal eller produkt mejlar du kundservice så ordnar vi det före nästa dragning." },
  { q: "Kan jag ha flera produkter i samma prenumeration?", a: "Ja. Lägger du flera produkter med samma intervall i samma köp ingår de i samma prenumeration och kommer i samma paket." },
  { q: "När dras pengarna?", a: "Första leveransen betalas vid köpet. Därefter dras betalningen automatiskt när en ny period börjar, var 30:e, 60:e eller 90:e dag räknat från köpet. Paketet skickas några dagar efter dragningen och du får ett mejl med beräknad leveransdag." },
];

export default async function SubscriptionPage() {
  const products = await getProducts();
  const example = products.find((p) => p.slug === "tongkat-ali-elite") ?? products[0]!;
  const subPrice = Math.round(example.price * (1 - site.subscriptionDiscount / 100));
  // Leveranser per år med en förpackning per leverans och ett intervall som räcker hela förpackningen (60 kapslar = 60 dagar)
  const yearly = (example.price - subPrice) * 6;
  const popular = products.filter(isInStock).slice(0, 4);

  return (
    <>
      <section className="bg-sand-soft">
        <Container className="py-12 sm:py-16">
          <Breadcrumbs items={[{ label: "Prenumeration" }]} />
          <div className="mt-6 max-w-2xl">
            <Eyebrow>Spara {site.subscriptionDiscount} %</Eyebrow>
            <h1 className="mt-3 font-display text-4xl font-medium leading-[1.1] tracking-tight sm:text-5xl">
              Prenumeration – dina tillskott hem, automatiskt
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-muted">
              Slipp tomma förpackningar och glömda beställningar. Prenumerera på det du använder varje dag och spara{" "}
              {site.subscriptionDiscount} % på varje leverans – med fri frakt och utan bindningstid.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href={routes.products} size="lg">
                Starta en prenumeration
              </ButtonLink>
              <ButtonLink href="#sa-fungerar-det" size="lg" variant="outline">
                Så fungerar det
              </ButtonLink>
            </div>
            <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm">
              {["Ingen bindningstid", "Fri frakt", "Avsluta när du vill"].map((t) => (
                <li key={t} className="flex items-center gap-1.5">
                  <CheckIcon size={15} className="text-primary" /> {t}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      <Container className="py-16" id="sa-fungerar-det">
        <SectionHeading eyebrow="Steg för steg" title="Så fungerar det" intro="Fyra enkla steg – och du behåller kontrollen hela vägen." />
        <ol className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map(([t, d], i) => (
            <li key={t} className="rounded-card border border-line p-6">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-fg">{i + 1}</span>
              <h3 className="mt-4 font-display text-lg font-medium">{t}</h3>
              <p className="mt-2 text-sm text-muted">{d}</p>
            </li>
          ))}
        </ol>
      </Container>

      <section className="bg-sand-soft">
        <Container className="grid gap-10 py-16 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionHeading
              eyebrow="Räkneexempel"
              title="Vad tjänar du på det?"
              intro={`${site.subscriptionDiscount} % rabatt gäller varje leverans, inte bara den första. Med fri frakt blir skillnaden tydlig redan efter några månader.`}
            />
            <ul className="mt-6 space-y-2 text-sm">
              {[`${site.subscriptionDiscount} % lägre pris på varje förpackning`, "0 kr i frakt", "Ingen risk att bli utan mitt i en kur"].map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <CheckIcon size={15} className="text-primary" /> {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-card bg-white p-6 shadow-card sm:p-8">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">Exempel · {example.name}</p>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between">
                <dt>Engångsköp</dt>
                <dd className="tabular-nums">{formatPrice(example.price)} / leverans</dd>
              </div>
              <div className="flex justify-between font-medium">
                <dt>Prenumeration</dt>
                <dd className="tabular-nums">
                  <span className="mr-2 text-muted line-through">{formatPrice(example.price)}</span>
                  {formatPrice(subPrice)} / leverans
                </dd>
              </div>
              <div className="flex justify-between">
                <dt>Frakt</dt>
                <dd className="tabular-nums">0 kr</dd>
              </div>
              <div className="flex justify-between border-t border-line pt-3 text-base font-semibold">
                <dt>Du sparar per år (6 leveranser, var 60:e dag)</dt>
                <dd className="tabular-nums">{formatPrice(yearly)}</dd>
              </div>
            </dl>
            <p className="mt-3 text-xs text-muted">Exklusive sparad frakt. Ditt pris beror på valda produkter och intervall.</p>
          </div>
        </Container>
      </section>

      <Container className="py-16">
        <SectionHeading eyebrow="Fördelar" title="Fördelar med prenumeration" />
        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map(([t, d]) => (
            <li key={t} className="rounded-card bg-sand-soft p-6">
              <h3 className="font-display text-lg font-medium">{t}</h3>
              <p className="mt-2 text-sm text-muted">{d}</p>
            </li>
          ))}
        </ul>
      </Container>

      <Container className="pb-16">
        <SectionHeading eyebrow="Populära att prenumerera på" title="Vardagsextrakt många använder varje dag" />
        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-x-6">
          {popular.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </Container>

      <Container className="pb-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center font-display text-3xl font-medium">Vanliga frågor</h2>
          <div className="mt-8">
            <Accordion items={faq} name="sub-faq" />
          </div>
        </div>
      </Container>
    </>
  );
}
