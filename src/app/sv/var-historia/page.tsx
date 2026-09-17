import type { Metadata } from "next";
import { routes } from "@/lib/routes";
import { company, site } from "@/lib/site";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ButtonLink, Container, Eyebrow, SectionHeading } from "@/components/ui";

export const metadata: Metadata = {
  title: "Vår historia – så startade Metilde",
  description:
    "Metilde startade av en enkel frustration: för få rena kosttillskott utan krångel. Läs om hur varumärket grundades och varför prenumeration blev självklart.",
  alternates: { canonical: `${site.url}${routes.story}` },
};

const sections = [
  {
    title: "Det saknades något på hyllan",
    body: [
      "Matilda hade länge använt kosttillskott, men ju mer hon läste på desto mer frustrerad blev hon. Många produkter var fulla av fyllnadsmedel, sötningsmedel och ingredienser som inte tillförde något. Samtidigt var priserna ofta höga för produkter som inte ens innehöll det de utlovade.",
      "Det fanns gott om varumärken som pratade om hälsa och välmående, men få som förklarade varför produkten faktiskt var värd sitt pris. Det var då idén om Metilde började växa: ett märke som satsar på renhet och transparens, där kunden får vad den betalar för och ingenting annat.",
    ],
  },
  {
    title: "Prenumeration som borde fungera bättre",
    body: [
      "En annan sak som irriterade var att det nästan inte fanns något sätt att prenumerera på kosttillskott. Det som fanns var antingen krångliga abonnemang med uppsägningstider, eller lösningar där man fick komma ihåg att beställa själv.",
      "Metilde byggde därför en prenumeration som faktiskt är schysst: 15 % lägre pris, fri frakt och möjlighet att pausa, byta eller avsluta när som helst. Ingen bindningstid, ingen dold avgift.",
    ],
  },
  {
    title: "Från Matilda till Metilde",
    body: [
      "När det var dags att välja namn var första alternativet självklart. Alla domäner med \"Matilda\" var redan upptagna, så det fick bli något som låg nära – lite enklare, lite renare. Metilde.com fanns ledigt, och namnet kändes direkt rätt.",
    ],
  },
  {
    title: "Nästa steg: växa sortimentet",
    body: [
      "Vi kommer inte att slänga på nya produkter bara för att det ser bra ut. Varje extrakt ska finnas där för att det fyller ett syfte, har riktig kvalitet och lever upp till samma krav som vi satte från dag ett.",
    ],
  },
];

const values = [
  ["Inget krångel", "Vi listar exakt vad varje produkt innehåller. Ingen fluff, inga dolda tillsatser."],
  ["Du får vad du betalar för", "Råvaror, kapslar, förpackning. Det är där vi lägger pengarna – inte på dyra reklamkampanjer."],
  ["Prenumeration på riktigt", "15 % rabatt, fri frakt och full kontroll. Pausa, byt eller avsluta när du vill."],
  ["Svensk tillverkning", "Extrakten tillverkas i Sverige i små batcher enligt europeiska krav på renhet och spårbarhet."],
];

export default function StoryPage() {
  return (
    <>
      <section className="bg-sand-soft">
        <Container className="py-12 sm:py-16">
          <Breadcrumbs items={[{ label: "Vår historia" }]} />
          <div className="mt-6 max-w-2xl">
            <Eyebrow>Om Metilde</Eyebrow>
            <h1 className="mt-3 font-display text-4xl font-medium leading-[1.1] tracking-tight sm:text-5xl">Vår historia</h1>
            <p className="mt-5 text-lg leading-relaxed text-muted">
              Metilde föddes ur en frustration som många känner igen: varför ska det vara så svårt att hitta rena kosttillskott
              utan krångel? Det var den frågan som fick Matilda att lägga allt annat åt sidan och bygga varumärket från grunden.
            </p>
          </div>
        </Container>
      </section>

      <Container className="py-16">
        <div className="mx-auto max-w-3xl space-y-14">
          {sections.map((s) => (
            <section key={s.title}>
              <h2 className="font-display text-3xl font-medium">{s.title}</h2>
              {s.body.map((p, i) => (
                <p key={i} className="mt-4 leading-relaxed text-muted">
                  {p}
                </p>
              ))}
            </section>
          ))}
        </div>
      </Container>

      <section className="bg-sand-soft">
        <Container className="py-16">
          <SectionHeading eyebrow="Värderingar" title="Vad vi står för" />
          <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map(([t, d]) => (
              <li key={t} className="rounded-card bg-white p-6 shadow-card">
                <h3 className="font-display text-lg font-medium">{t}</h3>
                <p className="mt-2 text-sm text-muted">{d}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <Container className="py-16">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow="Företaget" title="Om företaget" intro="Metilde drivs av Swedish Treats AB. Här hittar du våra fullständiga företagsuppgifter – vi vill att du alltid ska veta vem du handlar av." />
          </div>
          <dl className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
            {[
              ["Juridiskt namn", company.legalName],
              ["Organisationsnummer", company.orgNumber],
              ["Adress", company.address],
              ["E-post", company.email],
              ["Telefon", company.phone],
              ["Kundtjänst", company.hours],
            ].map(([k, v]) => (
              <div key={k} className="rounded-2xl border border-line p-4">
                <dt className="text-muted">{k}</dt>
                <dd className="mt-1 font-medium">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="mt-16 rounded-card bg-primary p-8 text-primary-fg sm:p-12">
          <h2 className="font-display text-3xl font-medium">Vi är bara i början</h2>
          <p className="mt-3 max-w-2xl text-primary-fg/80">
            Metilde är ett ungt varumärke, men ambitionen är tydlig: att växa sortimentet och bli en stor spelare på marknaden för
            rena, botaniska kosttillskott. Det gör vi genom att vara ärliga, hålla hög kvalitet och lyssna på våra kunder.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <ButtonLink href={routes.products} variant="white">
              Upptäck produkterna
            </ButtonLink>
            <ButtonLink href={routes.subscription} variant="ghost" className="text-primary-fg hover:bg-white/10">
              Läs om prenumeration
            </ButtonLink>
          </div>
        </div>
      </Container>
    </>
  );
}
