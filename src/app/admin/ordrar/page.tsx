import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { formatPrice } from "@/lib/format";
import { supabaseAdmin } from "@/lib/supabase";
import { Card, StatusBadge, statusLabel } from "../_components/fields";

type OrderRow = {
  id: string;
  order_number: string;
  created_at: string;
  email: string | null;
  shipping_name: string | null;
  shipping_city: string | null;
  total: number;
  status: string;
  kind: string;
  has_subscription: boolean;
  environment: string;
};

const filters = ["alla", "scheduled", "paid", "packed", "shipped", "delivered", "cancelled"] as const;

export default async function OrdersPage({ searchParams }: PageProps<"/admin/ordrar">) {
  await requireAdmin();
  const sp = await searchParams;
  const status = typeof sp.status === "string" && (filters as readonly string[]).includes(sp.status) ? sp.status : "alla";
  let q = supabaseAdmin()
    .from("orders")
    .select("id,order_number,created_at,email,shipping_name,shipping_city,total,status,kind,environment")
    .order("created_at", { ascending: false })
    .limit(200);
  if (status !== "alla") q = q.eq("status", status);
  const { data } = await q;
  const orders = (data ?? []) as OrderRow[];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="font-display text-3xl font-medium">Ordrar</h1>
        <nav className="flex gap-1 overflow-x-auto scrollbar-none">
          {filters.map((f) => (
            <Link
              key={f}
              href={f === "alla" ? "/admin/ordrar" : `/admin/ordrar?status=${f}`}
              className={`shrink-0 rounded-full px-3 py-1.5 text-sm ${status === f ? "bg-primary text-primary-fg" : "border border-line bg-white hover:bg-sand"}`}
            >
              {f === "alla" ? "Alla" : statusLabel[f]}
            </Link>
          ))}
        </nav>
      </div>
      <Card>
        {orders.length === 0 ? (
          <p className="text-sm text-muted">Inga ordrar.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-xs uppercase tracking-wider text-muted">
                <tr>
                  <th className="py-2 pr-3">Order</th>
                  <th className="py-2 pr-3">Datum</th>
                  <th className="py-2 pr-3">Kund</th>
                  <th className="py-2 pr-3">Ort</th>
                  <th className="py-2 pr-3 text-right">Summa</th>
                  <th className="py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id} className="border-t border-line">
                    <td className="py-2 pr-3 whitespace-nowrap">
                      <Link href={`/admin/ordrar/${o.id}`} className="font-medium hover:underline">
                        {o.order_number}
                      </Link>
                      {o.kind === "renewal" ? <span className="ml-1 text-xs text-muted">förnyelse</span> : o.has_subscription ? <span className="ml-1 text-xs text-muted">prenumeration</span> : null}
                      {o.environment === "sandbox" ? <span className="ml-1 rounded bg-sand px-1 text-[10px] uppercase text-muted">test</span> : null}
                    </td>
                    <td className="py-2 pr-3 whitespace-nowrap text-muted">
                      {new Date(o.created_at).toLocaleString("sv-SE", { dateStyle: "short", timeStyle: "short" })}
                    </td>
                    <td className="py-2 pr-3">
                      <span className="block">{o.shipping_name}</span>
                      <span className="block text-xs text-muted">{o.email}</span>
                    </td>
                    <td className="py-2 pr-3">{o.shipping_city}</td>
                    <td className="py-2 pr-3 text-right tabular-nums">{formatPrice(Number(o.total))}</td>
                    <td className="py-2">
                      <StatusBadge status={o.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
