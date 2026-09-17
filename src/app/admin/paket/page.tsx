import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { getCatalog } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { Card } from "../_components/fields";

export default async function AdminBundlesPage() {
  await requireAdmin();
  const { allBundles, bundles } = await getCatalog();
  const visible = new Set(bundles.map((b) => b.slug));
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-3xl font-medium">Paket</h1>
        <Link href="/admin/paket/ny" className="inline-flex h-10 items-center rounded-full bg-primary px-4 text-sm font-medium text-primary-fg">
          Nytt paket
        </Link>
      </div>
      <Card>
        <table className="w-full text-sm">
          <thead className="text-left text-xs uppercase tracking-wider text-muted">
            <tr>
              <th className="py-2 pr-3">Paket</th>
              <th className="py-2 pr-3">Innehåll</th>
              <th className="py-2 pr-3 text-right">Pris</th>
              <th className="py-2 pr-3 text-right">Delarnas värde</th>
              <th className="py-2">Visas</th>
            </tr>
          </thead>
          <tbody>
            {allBundles.map((b) => {
              const shown = visible.has(b.slug);
              const reason = !b.isActive ? "Dold (inaktiv)" : b.price >= b.value ? "Dold: pris ≥ delarna" : b.items.some((i) => !i.product.isActive) ? "Dold: inaktiv produkt" : "Visas";
              return (
                <tr key={b.slug} className="border-t border-line">
                  <td className="py-2 pr-3">
                    <Link href={`/admin/paket/${b.slug}`} className="font-medium hover:underline">
                      {b.name}
                    </Link>
                    <span className="block text-xs text-muted">{b.slug}</span>
                  </td>
                  <td className="py-2 pr-3 text-xs text-muted">{b.items.map((i) => `${i.qty}× ${i.product.name.split(" | ")[0]}`).join(", ")}</td>
                  <td className="py-2 pr-3 text-right tabular-nums">{formatPrice(b.price)}</td>
                  <td className="py-2 pr-3 text-right tabular-nums">{formatPrice(b.value)}</td>
                  <td className={`py-2 text-xs ${shown ? "text-success" : "text-danger"}`}>{reason}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
