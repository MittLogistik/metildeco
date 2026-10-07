import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { listPages } from "@/lib/pages";
import { Card } from "../_components/fields";

export default async function AdminPagesPage() {
  await requireAdmin();
  const pages = await listPages();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-medium">Sidor</h1>
        <p className="mt-1 text-sm text-muted">Villkor, policyer och informationssidor. Du ändrar texten – designen är densamma som på sajten.</p>
      </div>
      <Card>
        <table className="w-full text-sm">
          <thead className="text-left text-xs uppercase tracking-wider text-muted">
            <tr>
              <th className="py-2 pr-3">Sida</th>
              <th className="py-2 pr-3">Adress</th>
              <th className="py-2">Text</th>
            </tr>
          </thead>
          <tbody>
            {pages.map((p) => (
              <tr key={p.slug} className="border-t border-line">
                <td className="py-2.5 pr-3">
                  <Link href={`/admin/sidor/${p.slug}`} className="font-medium hover:underline">
                    {p.title}
                  </Link>
                </td>
                <td className="py-2.5 pr-3">
                  <a href={`/sv/${p.slug}`} target="_blank" rel="noopener" className="text-muted hover:underline">
                    /sv/{p.slug}
                  </a>
                </td>
                <td className="py-2.5 text-muted">
                  {p.edited ? `Redigerad ${new Date(p.editedAt!).toLocaleString("sv-SE", { dateStyle: "short", timeStyle: "short" })}` : "Standardtext"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
