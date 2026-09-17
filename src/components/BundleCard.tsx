import Image from "next/image";
import Link from "next/link";
import { bundleInStock, type Bundle } from "@/lib/bundles";
import { formatPrice } from "@/lib/format";
import { routes } from "@/lib/routes";
import { Badge } from "@/components/ui";

export function BundleCard({ bundle }: { bundle: Bundle }) {
  const inStock = bundleInStock(bundle);
  return (
    <article className="group flex flex-col">
      <Link href={routes.bundle(bundle.slug)} className="block">
        <div className="relative aspect-square overflow-hidden rounded-card" style={{ backgroundColor: bundle.bg || "#f2efe8" }}>
          <Image
            src={bundle.images[0] ?? "/media/placeholder.svg"}
            alt={bundle.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className={`object-contain p-4 transition-transform duration-500 group-hover:scale-[1.04] ${inStock ? "" : "opacity-60"}`}
          />
          <div className="absolute left-3 top-3 flex gap-1.5">
            {!inStock ? <Badge tone="danger">Tillfälligt slut</Badge> : bundle.discount > 0 ? <Badge tone="primary">Spara {bundle.discount} %</Badge> : null}
          </div>
        </div>
      </Link>
      <div className="mt-3.5 flex flex-1 flex-col">
        <p className="text-[11px] font-medium uppercase tracking-wider text-muted">Paket · {bundle.items.length} produkter</p>
        <h3 className="mt-1 text-sm font-medium leading-snug">
          <Link href={routes.bundle(bundle.slug)} className="hover:underline">
            {bundle.name}
          </Link>
        </h3>
        <div className="mt-auto pt-3">
          <p className="text-base font-semibold tabular-nums">{formatPrice(bundle.price)}</p>
          {bundle.value > bundle.price ? (
            <p className="text-xs text-muted tabular-nums">
              Värde styckvis <span className="line-through">{formatPrice(bundle.value)}</span>
            </p>
          ) : null}
        </div>
      </div>
    </article>
  );
}
