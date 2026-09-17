import type { Metadata } from "next";
import Link from "next/link";
import { goalProductCount, goals, isGoalId, productsByGoals, type GoalId } from "@/content/goals";
import { routes } from "@/lib/routes";
import { site } from "@/lib/site";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CheckIcon } from "@/components/icons";
import { ProductCard } from "@/components/ProductCard";
import { Container, SectionHeading } from "@/components/ui";

export const metadata: Metadata = {
  title: "Handla efter mål",
  description:
    "Välj vad du vill fokusera på – energi, sömn, träning, fokus eller vitalitet – så visar vi de produkter i sortimentet som passar dina val.",
  alternates: { canonical: `${site.url}${routes.goals}` },
};

export default async function GoalsPage({ searchParams }: PageProps<"/sv/mal">) {
  const sp = await searchParams;
  const raw = typeof sp.mal === "string" ? sp.mal.split(",") : Array.isArray(sp.mal) ? sp.mal : [];
  const selected = raw.filter(isGoalId) as GoalId[];
  const list = productsByGoals(selected);

  const toggleHref = (id: GoalId) => {
    const next = selected.includes(id) ? selected.filter((g) => g !== id) : [...selected, id];
    return next.length ? `${routes.goals}?mal=${next.join(",")}` : routes.goals;
  };

  return (
    <Container className="py-8 sm:py-12">
      <Breadcrumbs items={[{ label: "Handla efter mål" }]} />
      <SectionHeading
        as="h1"
        eyebrow="Personligt"
        title="Handla efter mål"
        intro="Markera det du vill fokusera på just nu. Vi visar sortimentet som passar dina val – kombinera gärna flera mål. Det här är en sorteringshjälp, inga hälsopåståenden."
        className="mt-6"
      />
      <ul className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {goals.map((g, i) => {
          const active = selected.includes(g.id);
          const n = goalProductCount(g.id);
          return (
            <li key={g.id}>
              <Link
                href={toggleHref(g.id)}
                aria-pressed={active}
                className={`flex h-full flex-col rounded-2xl border p-4 transition-colors ${active ? "border-primary bg-primary-soft" : "border-line hover:border-foreground/40"}`}
              >
                <span className="flex items-center justify-between text-xs text-muted">
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  {active ? <CheckIcon size={16} className="text-primary" /> : null}
                </span>
                <span className="mt-2 font-display text-lg font-medium">{g.label}</span>
                <span className="mt-1 text-sm text-muted">{g.description}</span>
                <span className="mt-auto pt-3 text-xs font-medium text-primary">
                  {n} {n === 1 ? "produkt" : "produkter"}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-6 text-sm">
        <p className="text-muted">
          {selected.length === 0
            ? "Inget mål valt – visar hela sortimentet."
            : `Valda mål: ${selected.length} · ${list.length} produkter`}
        </p>
        {selected.length > 0 ? (
          <Link href={routes.goals} className="font-medium underline underline-offset-2">
            Rensa val
          </Link>
        ) : null}
      </div>

      {list.length === 0 ? (
        <div className="py-16 text-center">
          <h2 className="font-display text-2xl font-medium">Ingen produkt matchar alla dina val</h2>
          <p className="mt-2 text-muted">Prova att välja färre mål.</p>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
          {list.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      )}
    </Container>
  );
}
