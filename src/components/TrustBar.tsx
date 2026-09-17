import Link from "next/link";
import { routes } from "@/lib/routes";
import { site } from "@/lib/site";
import { FlaskIcon, LeafIcon, RefreshIcon, TruckIcon } from "@/components/icons";

const items = [
  { icon: FlaskIcon, title: "Tredjepartstestat", text: "Varje batch analyseras av oberoende labb.", href: routes.quality },
  { icon: LeafIcon, title: "Utan onödiga tillsatser", text: "Extrakt och kapselskal – inget annat.", href: routes.quality },
  { icon: TruckIcon, title: `Fri frakt över ${site.freeShippingOver} kr`, text: "Skickas samma dag vid order före 12.", href: routes.shipping },
  { icon: RefreshIcon, title: "30 dagars öppet köp", text: "Ångra köpet – längre än lagen kräver.", href: routes.returns },
];

/** Fyra löften som återkommer på start- och produktsidor. */
export function TrustBar({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <ul className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
        {items.map((it) => (
          <li key={it.title} className="flex items-start gap-2.5">
            <it.icon size={18} className="mt-0.5 shrink-0 text-primary" />
            <span>
              <Link href={it.href} className="font-medium hover:underline">
                {it.title}
              </Link>
            </span>
          </li>
        ))}
      </ul>
    );
  }
  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((it) => (
        <li key={it.title} className="flex gap-4">
          <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary">
            <it.icon size={22} />
          </span>
          <div>
            <h3 className="font-display text-base font-medium">
              <Link href={it.href} className="hover:underline">
                {it.title}
              </Link>
            </h3>
            <p className="mt-1 text-sm text-muted">{it.text}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
