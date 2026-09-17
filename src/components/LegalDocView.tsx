import type { LegalBlock, LegalDoc } from "@/content/legal";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ShippingTable } from "@/components/ShippingTable";
import { Container } from "@/components/ui";

function Block({ block }: { block: LegalBlock }) {
  switch (block.type) {
    case "h2":
      return <h2>{block.text}</h2>;
    case "h3":
      return <h3>{block.text}</h3>;
    case "p":
      return <p>{block.text}</p>;
    case "ul":
      return (
        <ul>
          {block.items.map((it, i) => (
            <li key={i}>{it}</li>
          ))}
        </ul>
      );
    case "table":
      return (
        <div className="overflow-x-auto">
        <table>
          <thead>
            <tr>
              {block.head.map((h) => (
                <th key={h}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {block.rows.map((row, i) => (
              <tr key={i}>
                {row.map((cell, j) => (
                  <td key={j}>{cell}</td>
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
          <ShippingTable />
        </div>
      );
  }
}

export function LegalDocView({ doc }: { doc: LegalDoc }) {
  return (
    <Container className="py-10 sm:py-14">
      <Breadcrumbs items={[{ label: doc.title }]} />
      <div className="mx-auto mt-8 max-w-3xl">
        <h1 className="font-display text-4xl font-medium leading-tight tracking-tight sm:text-5xl">{doc.title}</h1>
        <p className="mt-5 text-lg leading-relaxed text-muted">{doc.intro}</p>
        <p className="mt-3 text-xs text-muted">{doc.updated}</p>
        <div className="prose-metilde mt-10">
          {doc.blocks.map((b, i) => (
            <Block key={i} block={b} />
          ))}
        </div>
      </div>
    </Container>
  );
}
