import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { getCatalog } from "@/lib/catalog";
import { ProductForm } from "../ProductForm";

export default async function EditProductPage({ params }: PageProps<"/admin/produkter/[slug]">) {
  await requireAdmin();
  const { slug } = await params;
  const { allProducts } = await getCatalog();
  const product = allProducts.find((p) => p.slug === slug);
  if (!product) notFound();
  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/produkter" className="text-sm text-muted hover:underline">
          ← Alla produkter
        </Link>
        <h1 className="mt-2 font-display text-3xl font-medium">{product.name}</h1>
      </div>
      <ProductForm product={product} />
    </div>
  );
}
