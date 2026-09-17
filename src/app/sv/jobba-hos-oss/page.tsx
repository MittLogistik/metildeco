import type { Metadata } from "next";
import { routes } from "@/lib/routes";
import { company, site } from "@/lib/site";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ButtonLink, Container, SectionHeading } from "@/components/ui";

export const metadata: Metadata = {
  title: "Jobba hos oss",
  description: "Just nu tar vi inte emot några ansökningar eller spontanförfrågningar. Nya tjänster publiceras på den här sidan.",
  alternates: { canonical: `${site.url}/sv/jobba-hos-oss` },
};

const values = [
  ["Renhet i allt", "Samma krav som vi ställer på våra råvaror ställer vi på vårt sätt att arbeta – transparent, enkelt och utan genvägar."],
  ["Litet team, stort ansvar", "Vi är få personer som gör mycket. Du får äga dina frågor från idé till lansering."],
  ["Hantverk och detaljer", "Från etikett till kundmejl – vi bryr oss om hur saker känns, inte bara att de blir gjorda."],
  ["Kunden först", "Alla i teamet läser kundfeedback varje vecka. Det är där våra bästa beslut börjar."],
];

export default function CareersPage() {
  return (
    <Container className="py-8 sm:py-12">
      <Breadcrumbs items={[{ label: "Jobba hos oss" }]} />
      <SectionHeading
        as="h1"
        eyebrow="Karriär"
        title="Jobba hos oss"
        intro="Metilde är ett litet svenskt team som bygger rena botaniska extrakt med hög kvalitet. Vi växer i lugn takt och rekryterar sällan – men när vi gör det gör vi det här."
        className="mt-6"
      />
      <section className="mt-10 max-w-3xl rounded-card bg-sand-soft p-6 sm:p-8">
        <h2 className="font-display text-2xl font-medium">Vi tar just nu inte emot några förfrågningar</h2>
        <p className="mt-3 text-muted">
          I dagsläget har vi inga lediga tjänster och tar inte emot ansökningar eller spontanansökningar. Vi vill vara ärliga med det i stället för att låta ansökningar bli liggande.
        </p>
        <p className="mt-3 text-muted">
          Håll gärna utkik – så fort vi öppnar upp en roll publiceras den här på sidan och i vårt nyhetsbrev. Alla tjänster annonseras öppet.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <ButtonLink href={routes.home + "#nyhetsbrev"} variant="outline">
            Håll utkik via nyhetsbrevet
          </ButtonLink>
          <ButtonLink href="/sv/samarbeten" variant="ghost">
            Vill du samarbeta i stället?
          </ButtonLink>
        </div>
      </section>
      <section className="mt-14">
        <SectionHeading eyebrow="Så är det hos oss" title="Det här värderar vi" intro="Om du funderar på att söka när vi öppnar upp." />
        <ul className="mt-8 grid gap-6 sm:grid-cols-2">
          {values.map(([t, d]) => (
            <li key={t} className="rounded-card border border-line p-6">
              <h3 className="font-display text-lg font-medium">{t}</h3>
              <p className="mt-2 text-sm text-muted">{d}</p>
            </li>
          ))}
        </ul>
        <p className="mt-8 text-sm text-muted">
          Har du en fråga som inte handlar om jobb når du oss på{" "}
          <a href={`mailto:${company.email}`} className="underline">
            {company.email}
          </a>
          .
        </p>
      </section>
    </Container>
  );
}
