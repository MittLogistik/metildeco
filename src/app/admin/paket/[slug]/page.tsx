import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { getCatalog } from "@/lib/catalog";
import { BundleForm } from "../BundleForm";

export default async function EditBundlePage({ params }: PageProps<"/admin/paket/[slug]">) {
  await requireAdmin();
  const { slug } = await params;
  const { allBundles, allProducts } = await getCatalog();
  const bundle = allBundles.find((b) => b.slug === slug);
  if (!bundle) notFound();
  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/paket" className="text-sm text-muted hover:underline">
          ← Alla paket
        </Link>
        <h1 className="mt-2 font-display text-3xl font-medium">{bundle.name}</h1>
      </div>
      <BundleForm bundle={bundle} productSlugs={allProducts.filter((p) => p.isActive).map((p) => p.slug)} />
    </div>
  );
}
