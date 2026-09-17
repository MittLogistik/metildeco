import type { Metadata } from "next";
import { routes } from "@/lib/routes";
import { site } from "@/lib/site";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CheckIcon } from "@/components/icons";
import { PaymentMethods } from "@/components/PaymentMethods";
import { Container, Eyebrow } from "@/components/ui";
import { GiftCardForm } from "./GiftCardForm";

export const metadata: Metadata = {
  title: "Presentkort",
  description: "Ett digitalt presentkort från Metilde – välj belopp och låt mottagaren välja själv. Skickas direkt via e-post, fraktfritt och giltigt i ett år.",
  alternates: { canonical: `${site.url}${routes.giftCard}` },
};

const facts = [
  "Giltigt i ett år från inköpsdatum",
  "Skickas via e-post direkt efter betalningen – till dig eller rakt till mottagaren",
  "Gäller hela sortimentet, även prenumerationer",
  "Fraktfritt, inga avgifter",
  "Kan inte lösas in mot kontanter eller återbetalas",
];

export default function GiftCardPage() {
  return (
    <Container className="py-8 sm:py-12">
      <Breadcrumbs items={[{ label: "Presentkort" }]} />
      <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,1fr)_420px] lg:gap-16">
        <div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-card bg-primary p-8 text-primary-fg sm:p-12">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary-fg/70">Presentkort</p>
            <p className="mt-3 font-display text-4xl font-medium sm:text-5xl">Metilde</p>
            <p className="mt-2 max-w-sm text-primary-fg/80">Rena botaniska extrakt, tillverkade i Sverige. Låt mottagaren välja själv.</p>
            <p className="absolute bottom-8 left-8 font-mono text-sm tracking-widest text-primary-fg/60 sm:bottom-12 sm:left-12">GIFT-XXXX-XXXX</p>
          </div>
          <h2 className="mt-10 font-display text-2xl font-medium">Produkt i korthet</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {facts.map((f) => (
              <li key={f} className="flex items-start gap-2.5">
                <CheckIcon size={16} className="mt-0.5 shrink-0 text-primary" /> {f}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <Eyebrow>Digitalt presentkort</Eyebrow>
          <h1 className="mt-3 font-display text-3xl font-medium leading-tight tracking-tight sm:text-4xl">Metilde presentkort</h1>
          <p className="mt-3 text-muted">Välj belopp, skriv en hälsning om du vill, och betala. Koden skickas via e-post och skrivs in i betalsteget.</p>
          <div className="mt-6">
            <GiftCardForm />
          </div>
          <PaymentMethods size="sm" className="mt-6" label="Betala med" only={["swish", "klarna", "visa", "mastercard", "amex", "applepay", "googlepay"]} />
        </div>
      </div>
    </Container>
  );
}
