import type { LegalBlock, LegalDoc } from "@/content/legal";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ShippingTable } from "@/components/ShippingTable";
import { Container } from "@/components/ui";
import type { Locale } from "@/lib/i18n";
import { companyInfoItems, fillPlaceholders } from "@/lib/page-text";

function Block({ block, locale }: { block: LegalBlock; locale: Locale }) {
  const f = (text: string) => fillPlaceholders(text, locale);
  switch (block.type) {
    case "h2":
      return <h2>{f(block.text)}</h2>;
    case "h3":
      return <h3>{f(block.text)}</h3>;
    case "p":
      return <p>{f(block.text)}</p>;
    case "ul":
      return (
        <ul>
          {block.items.map((it, i) => (
            <li key={i}>{f(it)}</li>
          ))}
        </ul>
      );
    case "table":
      return (
        <div className="overflow-x-auto">
        <table>
          <thead>
            <tr>
              {block.head.map((h, i) => (
                <th key={i}>{f(h)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {block.rows.map((row, i) => (
              <tr key={i}>
                {row.map((cell, j) => (
                  <td key={j}>{f(cell)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      );
    case "shippingTable":
      return (
        <div className="overflow-x-auto">
          <ShippingTable locale={locale} />
        </div>
      );
    case "companyInfo":
      return (
        <ul>
          {companyInfoItems(locale).map((it, i) => (
            <li key={i}>{it}</li>
          ))}
        </ul>
      );
  }
}

/** Villkor, policyer och informationssidor. `locale` styr platshållare, frakttabell och företagsuppgifter. */
export function LegalDocView({ doc, locale = "sv" }: { doc: LegalDoc; locale?: Locale }) {
  return (
    <Container className="py-10 sm:py-14">
      <Breadcrumbs items={[{ label: doc.title }]} />
      <div className="mx-auto mt-8 max-w-3xl">
        <h1 className="font-display text-4xl font-medium leading-tight tracking-tight sm:text-5xl">{doc.title}</h1>
        <p className="mt-5 text-lg leading-relaxed text-muted">{fillPlaceholders(doc.intro, locale)}</p>
        <p className="mt-3 text-xs text-muted">{doc.updated}</p>
        <div className="prose-metilde mt-10">
          {doc.blocks.map((b, i) => (
            <Block key={i} block={b} locale={locale} />
          ))}
        </div>
      </div>
    </Container>
  );
}
