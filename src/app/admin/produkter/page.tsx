import Image from "next/image";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { getCatalog } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { primaryImage, type Product } from "@/lib/products";
import { toggleProductActive } from "../actions";
import { ActionForm } from "../_components/ActionForm";
import { Card } from "../_components/fields";

function ProductTable({ list }: { list: Product[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="text-left text-xs uppercase tracking-wider text-muted">
          <tr>
            <th className="py-2 pr-3">Produkt</th>
            <th className="py-2 pr-3">Kategori</th>
            <th className="py-2 pr-3 text-right">Pris</th>
            <th className="py-2 pr-3 text-right">Lager</th>
            <th className="py-2 pr-3">Antal-väljare</th>
            <th className="py-2"></th>
          </tr>
        </thead>
        <tbody>
          {list.map((p) => (
            <tr key={p.slug} className="border-t border-line">
              <td className="py-2 pr-3">
                <Link href={`/admin/produkter/${p.slug}`} className="flex items-center gap-3 hover:underline">
                  <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg" style={{ backgroundColor: p.bg }}>
                    <Image src={primaryImage(p)} alt="" fill sizes="40px" unoptimized className="object-contain p-0.5" />
                  </span>
                  <span>
                    <span className="block font-medium">{p.name}</span>
                    <span className="block text-xs text-muted">{p.slug}</span>
                  </span>
                </Link>
              </td>
              <td className="py-2 pr-3">{p.category}</td>
              <td className="py-2 pr-3 text-right tabular-nums">{formatPrice(p.price)}</td>
              <td className={`py-2 pr-3 text-right tabular-nums ${p.trackStock && p.stock === 0 ? "font-semibold text-danger" : ""}`}>
                {p.trackStock ? p.stock : "–"}
              </td>
              <td className="py-2 pr-3 text-xs">{p.tieredPricing ? `Ja (−${p.tier2Discount} % / −${p.tier3Discount} %)` : "Nej"}</td>
              <td className="py-2 text-right">
                <ActionForm action={toggleProductActive} inline>
                  <input type="hidden" name="slug" value={p.slug} />
                  <input type="hidden" name="active" value={p.isActive ? "false" : "true"} />
                  <button type="submit" className="rounded-full border border-line px-3 py-1 text-xs hover:bg-sand">
                    {p.isActive ? "Dölj" : "Aktivera"}
                  </button>
                </ActionForm>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default async function AdminProductsPage() {
  await requireAdmin();
  const { allProducts } = await getCatalog();
  const active = allProducts.filter((p) => p.isActive);
  const inactive = allProducts.filter((p) => !p.isActive);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-3xl font-medium">Produkter</h1>
        <Link href="/admin/produkter/ny" className="inline-flex h-10 items-center rounded-full bg-primary px-4 text-sm font-medium text-primary-fg">
          Ny produkt
        </Link>
      </div>
      <Card title={`Aktiva (${active.length})`}>
        <ProductTable list={active} />
      </Card>
      <Card title={`Dolda (${inactive.length})`}>
        {inactive.length ? <ProductTable list={inactive} /> : <p className="text-sm text-muted">Inga dolda produkter.</p>}
      </Card>
    </div>
  );
}
