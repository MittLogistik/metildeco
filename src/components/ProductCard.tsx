import Image from "next/image";
import Link from "next/link";
import { formatPrice, percentOff } from "@/lib/format";
import { isInStock, primaryImage, type Product } from "@/lib/products";
import { routes } from "@/lib/routes";
import { Badge } from "@/components/ui";
import { Stars } from "@/components/Stars";
import { QuickAddButton } from "@/components/cart/AddToCart";

export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const inStock = isInStock(product);
  const off = percentOff(product.price, product.oldPrice);
  const badge = !inStock
    ? { tone: "danger" as const, label: "Slutsåld" }
    : off
      ? { tone: "accent" as const, label: `−${off} %` }
      : product.tags.includes("Bästsäljare")
        ? { tone: "primary" as const, label: "Bästsäljare" }
        : product.tags.includes("Nyhet")
          ? { tone: "neutral" as const, label: "Nyhet" }
          : null;

  return (
    <article className="group flex flex-col">
      <Link href={routes.product(product.slug)} className="block">
        <div
          className="relative aspect-square overflow-hidden rounded-card"
          style={{ backgroundColor: product.bg || "#f2efe8" }}
        >
          <Image
            src={primaryImage(product)}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            priority={priority}
            className={`object-contain p-6 transition-transform duration-500 group-hover:scale-[1.04] ${inStock ? "" : "opacity-60"}`}
          />
          {badge ? (
            <div className="absolute left-3 top-3">
              <Badge tone={badge.tone}>{badge.label}</Badge>
            </div>
          ) : null}
        </div>
      </Link>
      <div className="mt-3.5 flex flex-1 flex-col">
        <p className="text-[11px] font-medium uppercase tracking-wider text-muted">{product.category}</p>
        <h3 className="mt-1 text-sm font-medium leading-snug">
          <Link href={routes.product(product.slug)} className="hover:underline">
            {product.name}
          </Link>
        </h3>
        {product.reviews > 0 ? (
          <div className="mt-1.5">
            <Stars rating={product.rating} count={product.reviews} size={13} />
          </div>
        ) : null}
        <div className="mt-auto flex items-end justify-between gap-3 pt-3">
          <div>
            <p className="text-base font-semibold tabular-nums">{formatPrice(product.price)}</p>
            {product.oldPrice ? (
              <p className="text-xs text-muted line-through tabular-nums">{formatPrice(product.oldPrice)}</p>
            ) : null}
          </div>
          <QuickAddButton slug={product.slug} disabled={!inStock} />
        </div>
      </div>
    </article>
  );
}
