import type { Metadata } from "next";
import { site } from "@/lib/site";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CheckIcon } from "@/components/icons";
import { Container, SectionHeading } from "@/components/ui";
import { PartnerForm } from "./PartnerForm";

export const metadata: Metadata = {
  title: "Samarbeten – bli kreatör för Metilde",
  description: "Skicka in en förfrågan om betalt samarbete med Metilde. Välj kanal och antal följare och se direkt vilken ersättningsnivå du hamnar i.",
  alternates: { canonical: `${site.url}/sv/samarbeten` },
};

const perks = [
  "Fast ersättning enligt nivåerna – utbetalning 30 dagar efter publicering",
  "Produkter skickas alltid kostnadsfritt inför samarbetet",
  "Egen rabattkod till dina följare och provision på sålda ordrar",
  "Du äger materialet – vi frågar alltid innan vi återanvänder det",
];

export default function PartnersPage() {
  return (
    <Container className="py-8 sm:py-12">
      <Breadcrumbs items={[{ label: "Samarbeten" }]} />
      <SectionHeading
        as="h1"
        eyebrow="Kreatörer och content"
        title="Samarbeten"
        intro="Vi jobbar löpande med kreatörer som gillar rena produkter och ärlig kommunikation. Välj din kanal och följarnivå så ser du direkt vilken ersättning som gäller, och skicka sedan in din förfrågan."
        className="mt-6"
      />
      <ul className="mt-8 grid gap-3 sm:grid-cols-2">
        {perks.map((p) => (
          <li key={p} className="flex items-start gap-2.5 text-sm">
            <CheckIcon size={16} className="mt-0.5 shrink-0 text-primary" /> {p}
          </li>
        ))}
      </ul>
      <div className="mt-10">
        <PartnerForm />
      </div>
      <p className="mt-6 max-w-3xl text-xs text-muted">
        Vi samarbetar bara med kreatörer som följer marknadsföringslagen: samarbeten märks tydligt som reklam och inga hälsopåståenden görs om produkterna.
      </p>
    </Container>
  );
}
