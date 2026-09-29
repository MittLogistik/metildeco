import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { getCatalog } from "@/lib/catalog";
import { ProductForm } from "../ProductForm";

export default async function NewProductPage() {
  await requireAdmin();
  const { allProducts } = await getCatalog();
  const giftCandidates = allProducts.map((g) => ({ slug: g.slug, name: g.name, price: g.price, stock: g.stock, trackStock: g.trackStock, isActive: g.isActive, image: g.images[0] ?? null }));
  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/produkter" className="text-sm text-muted hover:underline">
          ← Alla produkter
        </Link>
        <h1 className="mt-2 font-display text-3xl font-medium">Ny produkt</h1>
        <p className="mt-1 text-sm text-muted">Produkten skapas dold. Aktivera den när bilder och texter är på plats.</p>
      </div>
      <ProductForm product={null} giftCandidates={giftCandidates} />
    </div>
  );
}
