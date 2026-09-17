import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { ProductForm } from "../ProductForm";

export default async function NewProductPage() {
  await requireAdmin();
  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/produkter" className="text-sm text-muted hover:underline">
          ← Alla produkter
        </Link>
        <h1 className="mt-2 font-display text-3xl font-medium">Ny produkt</h1>
        <p className="mt-1 text-sm text-muted">Produkten skapas dold. Aktivera den när bilder och texter är på plats.</p>
      </div>
      <ProductForm product={null} />
    </div>
  );
}
