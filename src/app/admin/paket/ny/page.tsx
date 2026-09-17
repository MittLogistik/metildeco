import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { getCatalog } from "@/lib/catalog";
import { BundleForm } from "../BundleForm";

export default async function NewBundlePage() {
  await requireAdmin();
  const { allProducts } = await getCatalog();
  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/paket" className="text-sm text-muted hover:underline">
          ← Alla paket
        </Link>
        <h1 className="mt-2 font-display text-3xl font-medium">Nytt paket</h1>
      </div>
      <BundleForm bundle={null} productSlugs={allProducts.filter((p) => p.isActive).map((p) => p.slug)} />
    </div>
  );
}
