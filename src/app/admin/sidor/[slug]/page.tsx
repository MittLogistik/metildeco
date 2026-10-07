import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { placeholders } from "@/lib/page-text";
import { getPage } from "@/lib/pages";
import { PageEditor } from "./PageEditor";

export default async function AdminPageEditor({ params }: PageProps<"/admin/sidor/[slug]">) {
  await requireAdmin();
  const { slug } = await params;
  const page = await getPage(slug);
  if (!page) notFound();
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Link href="/admin/sidor" className="text-sm text-muted hover:underline">
            ← Sidor
          </Link>
          <h1 className="mt-1 font-display text-3xl font-medium">{page.title}</h1>
          <p className="mt-1 text-sm text-muted">
            {page.edited ? `Redigerad ${new Date(page.editedAt!).toLocaleString("sv-SE", { dateStyle: "short", timeStyle: "short" })}` : "Standardtext – inget har ändrats här ännu."}
          </p>
        </div>
        <a href={`/sv/${slug}`} target="_blank" rel="noopener" className="inline-flex h-10 items-center rounded-full border border-line bg-white px-4 text-sm font-medium hover:bg-sand">
          Visa sidan
        </a>
      </div>
      <PageEditor
        slug={slug}
        edited={page.edited}
        initial={{ title: page.title, intro: page.intro, updated: page.updated, metaTitle: page.metaTitle, metaDescription: page.metaDescription, blocks: page.blocks }}
        placeholders={placeholders.map((p) => ({ key: p.key, label: p.label, value: p.value() }))}
      />
    </div>
  );
}
