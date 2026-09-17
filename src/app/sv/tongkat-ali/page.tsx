import type { Metadata } from "next";
import { getProducts } from "@/lib/catalog";
import { routes } from "@/lib/routes";
import { site } from "@/lib/site";
import { Accordion } from "@/components/Accordion";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CheckIcon } from "@/components/icons";
import { Newsletter } from "@/components/Newsletter";
import { ProductCard } from "@/components/ProductCard";
import { ButtonLink, Container, Eyebrow, SectionHeading } from "@/components/ui";

export const metadata: Metadata = {
  title: "Tongkat Ali – rot, renhet och rätt styrka",
  description:
    "Tongkat Ali (Eurycoma longifolia) som standardiserat 200:1-rotextrakt, tillverkat i Sverige och tredjepartstestat. Jämför Elite, Ultra 4% och Black.",
  alternates: { canonical: `${site.url}/sv/tongkat-ali` },
};

const faq = [
  { q: "Vilken variant ska jag börja med?", a: "Är det första gången rekommenderar vi Elite. Har du använt Tongkat Ali tidigare passar Ultra 4% eller Black, som har en högre koncentration per dagsdos." },
  { q: "Hur tar jag kapslarna?", a: "Följ doseringen på förpackningen, vanligtvis en dagsdos på morgonen tillsammans med mat och vatten." },
  { q: "Hur snabbt får jag min order?", a: "Ordrar packas normalt samma eller nästa arbetsdag. Leveranstiden inom Sverige är 1–3 arbetsdagar." },
  { q: "Vad är skillnaden mellan gul och svart Tongkat Ali?", a: "Det är två olika växter. Gul Tongkat Ali är Eurycoma longifolia, Black Tongkat Ali är Polyalthia bullata. Vi anger alltid det latinska namnet på förpackningen." },
];

export default async function TongkatPage() {
  const products = (await getProducts()).filter((p) => p.category === "Tongkat Ali");
  return (
    <>
      <section className="bg-sand-soft">
        <Container className="py-12 sm:py-16">
          <Breadcrumbs items={[{ href: routes.products, label: "Produkter" }, { label: "Tongkat Ali" }]} />
          <div className="mt-6 max-w-2xl">
            <Eyebrow>Örtextrakt · Eurycoma longifolia</Eyebrow>
            <h1 className="mt-3 font-display text-4xl font-medium leading-[1.1] tracking-tight sm:text-5xl">Tongkat Ali – rot, renhet och rätt styrka för dig</h1>
            <p className="mt-5 text-lg leading-relaxed text-muted">
              Eurycoma longifolia, eller Tongkat Ali, är en av Sydostasiens mest använda rötter. Vi använder enbart roten, vattenbaserad extraktion och standardiserade extrakt som testas av tredje part inför varje batch.
            </p>
            <ul className="mt-6 grid gap-2 text-sm sm:grid-cols-2">
              {["Standardiserat rotextrakt", "Tredjepartstestat varje batch", "Inga fyllnadsmedel", `Fri frakt över ${site.freeShippingOver} kr`].map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <CheckIcon size={15} className="text-primary" /> {t}
                </li>
              ))}
            </ul>
            <ButtonLink href="#varianter" size="lg" className="mt-8">
              Välj din variant
            </ButtonLink>
          </div>
        </Container>
      </section>

      <Container className="py-16" id="varianter">
        <SectionHeading eyebrow="Sortimentet" title="Välj din Tongkat Ali" intro="Alla varianter bygger på samma rena råvara – skillnaden ligger i rotens typ och koncentrationen per dagsdos." />
        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-3 lg:gap-x-6">
          {products.map((p, i) => (
            <ProductCard key={p.slug} product={p} priority={i < 3} />
          ))}
        </div>
      </Container>

      <section className="bg-sand-soft">
        <Container className="grid gap-10 py-16 lg:grid-cols-2">
          <SectionHeading eyebrow="Råvaran" title="Så jobbar vi med råvaran" />
          <div className="space-y-4 text-muted">
            <p>Roten skördas i Sydostasien och extraheras med vatten – utan lösningsmedel och utan onödiga tillsatser. Det ger ett extrakt som ligger nära den traditionella användningen.</p>
            <p>Varje batch analyseras av ett oberoende laboratorium för tungmetaller, mikrobiologi och standardisering innan den packas och skickas.</p>
            <ul className="flex flex-wrap gap-x-6 gap-y-2 pt-2 text-sm text-foreground">
              {["Tredjepartstestat", "Vegansk kapsel", "Snabb leverans"].map((t) => (
                <li key={t} className="flex items-center gap-1.5">
                  <CheckIcon size={15} className="text-primary" /> {t}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      <Container className="py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center font-display text-3xl font-medium">Vanliga frågor</h2>
          <div className="mt-8">
            <Accordion items={faq} name="tongkat-faq" />
          </div>
        </div>
      </Container>
      <Newsletter />
    </>
  );
}
