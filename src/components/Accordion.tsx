import { ChevronDown } from "@/components/icons";

/** Fråga/svar utan JavaScript – native details/summary. */
export function Accordion({ items, name }: { items: { q: string; a: string }[]; name?: string }) {
  return (
    <div className="divide-y divide-line rounded-card border border-line bg-white">
      {items.map((item, i) => (
        <details key={i} name={name} className="group px-5">
          <summary className="flex cursor-pointer items-center justify-between gap-4 py-4 text-left text-base font-medium">
            {item.q}
            <ChevronDown size={18} className="shrink-0 text-muted transition-transform group-open:rotate-180" />
          </summary>
          <p className="pb-5 text-sm leading-relaxed text-muted">{item.a}</p>
        </details>
      ))}
    </div>
  );
}
