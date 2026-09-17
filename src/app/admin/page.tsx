import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { getCatalog } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { supabaseAdmin } from "@/lib/supabase";
import { Card, StatusBadge } from "./_components/fields";

/** ISO-tidpunkt 30 dagar bakåt (utanför renderingen för renhetsregeln). */
const thirtyDaysAgo = () => new Date(Date.now() - 30 * 864e5).toISOString();

type OrderRow = { id: string; order_number: string; created_at: string; email: string | null; shipping_name: string | null; total: number; status: string; kind: string };

export default async function AdminDashboard() {
  await requireAdmin();
  const db = supabaseAdmin();
  const since = thirtyDaysAgo();
  const [latest, month, catalog] = await Promise.all([
    db.from("orders").select("id,order_number,created_at,email,shipping_name,total,status,kind").order("created_at", { ascending: false }).limit(8),
    db.from("orders").select("total,status").gte("created_at", since).not("status", "in", "(cancelled,refunded)"),
    getCatalog(),
  ]);
  const orders = (latest.data ?? []) as OrderRow[];
  const monthRows = (month.data ?? []) as { total: number; status: string }[];
  const revenue = monthRows.reduce((s, o) => s + Number(o.total), 0);
  const toPack = monthRows.filter((o) => o.status === "paid").length;
  const lowStock = catalog.allProducts.filter((p) => p.isActive && p.trackStock && p.stock <= 10).sort((a, b) => a.stock - b.stock);

  return (
    <div className="space-y-8">
      <h1 className="font-display text-3xl font-medium">Översikt</h1>
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <p className="text-xs uppercase tracking-wider text-muted">Försäljning 30 dagar</p>
          <p className="mt-1 font-display text-2xl font-medium">{formatPrice(revenue)}</p>
          <p className="text-xs text-muted">{monthRows.length} ordrar</p>
        </Card>
        <Card>
          <p className="text-xs uppercase tracking-wider text-muted">Att packa</p>
          <p className="mt-1 font-display text-2xl font-medium">{toPack}</p>
          <p className="text-xs text-muted">betalda ordrar som inte skickats</p>
        </Card>
        <Card>
          <p className="text-xs uppercase tracking-wider text-muted">Lågt lager</p>
          <p className="mt-1 font-display text-2xl font-medium">{lowStock.length}</p>
          <p className="text-xs text-muted">aktiva produkter med ≤ 10 i lager</p>
        </Card>
      </div>

      <Card title="Senaste ordrarna">
        {orders.length === 0 ? (
          <p className="text-sm text-muted">Inga ordrar ännu.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="text-left text-xs uppercase tracking-wider text-muted">
              <tr>
                <th className="py-2">Order</th>
                <th className="py-2">Datum</th>
                <th className="py-2">Kund</th>
                <th className="py-2 text-right">Summa</th>
                <th className="py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-t border-line">
                  <td className="py-2">
                    <Link href={`/admin/ordrar/${o.id}`} className="font-medium hover:underline">
                      {o.order_number}
                    </Link>
                    {o.kind === "renewal" ? <span className="ml-1 text-xs text-muted">förnyelse</span> : null}
                  </td>
                  <td className="py-2 text-muted">{new Date(o.created_at).toLocaleString("sv-SE", { dateStyle: "short", timeStyle: "short" })}</td>
                  <td className="py-2">{o.shipping_name ?? o.email}</td>
                  <td className="py-2 text-right tabular-nums">{formatPrice(Number(o.total))}</td>
                  <td className="py-2">
                    <StatusBadge status={o.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

      <Card title="Lågt lager">
        {lowStock.length === 0 ? (
          <p className="text-sm text-muted">Alla aktiva produkter har mer än 10 i lager.</p>
        ) : (
          <ul className="divide-y divide-line text-sm">
            {lowStock.map((p) => (
              <li key={p.slug} className="flex items-center justify-between py-2">
                <Link href={`/admin/produkter/${p.slug}`} className="hover:underline">
                  {p.name}
                </Link>
                <span className={`tabular-nums ${p.stock === 0 ? "font-semibold text-danger" : ""}`}>{p.stock} st</span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
