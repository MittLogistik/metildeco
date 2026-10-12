import type { Metadata } from "next";
import { getProducts } from "@/lib/catalog";
import { isInStock } from "@/lib/products";
import { routes } from "@/lib/routes";
import { site } from "@/lib/site";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Container, SectionHeading } from "@/components/ui";
import { Quiz } from "./Quiz";

export const metadata: Metadata = {
  title: "Hitta rätt tillskott – quiz",
  description:
    "Svara på sex korta frågor om din vardag, träning och sömn så guidar vi dig till de produkter i Metildes sortiment som passar dina mål.",
  alternates: { canonical: `${site.url}${routes.quiz}` },
};

export default async function QuizPage() {
  const products = (await getProducts()).filter(isInStock);
  return (
    <Container className="py-8 sm:py-12">
      <Breadcrumbs items={[{ label: "Hitta rätt tillskott" }]} />
      <SectionHeading
        as="h1"
        eyebrow="Guide"
        title="Hitta rätt tillskott"
        intro="Sex frågor, ungefär en minut. Du får ett förslag baserat på dina svar – inga uppgifter sparas."
        className="mt-6"
      />
      <div className="mt-10">
        <Quiz products={products} />
      </div>
      <p className="mt-12 max-w-3xl text-xs leading-relaxed text-muted">
        Quizen är en vägledning i vårt sortiment och ersätter inte rådgivning från vård eller apotek. Kosttillskott ersätter inte en varierad kost.
      </p>
    </Container>
  );
}
