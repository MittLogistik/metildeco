import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { customerHref, listCustomers } from "@/lib/customers";
import { formatPrice } from "@/lib/format";
import { Card } from "../_components/fields";

const fmtDate = (iso: string) => new Date(iso).toLocaleDateString("sv-SE", { dateStyle: "medium" });

export default async function CustomersPage({ searchParams }: PageProps<"/admin/kunder">) {
  await requireAdmin();
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q.trim().toLowerCase() : "";
  const all = await listCustomers();
  const customers = q ? all.filter((c) => c.email.includes(q) || (c.name ?? "").toLowerCase().includes(q) || (c.city ?? "").toLowerCase().includes(q)) : all;
  const subscribers = all.filter((c) => c.hasSubscription).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-medium">Kunder</h1>
          <p className="mt-1 text-sm text-muted">
            {all.length} kunder, {subscribers} med prenumeration. Intäkt räknas på skarpa ordrar som inte avbrutits.
          </p>
        </div>
        <form className="flex gap-2" action="/admin/kunder">
          <input
            name="q"
            defaultValue={q}
            placeholder="Sök namn, e-post eller ort"
            className="h-10 w-64 rounded-xl border border-line bg-white px-3 text-sm focus:border-primary focus:outline-none"
          />
          <button className="h-10 rounded-xl bg-foreground px-4 text-sm text-white">Sök</button>
        </form>
      </div>
      <Card>
        {customers.length === 0 ? (
          <p className="text-sm text-muted">Inga kunder{q ? " matchar sökningen" : " ännu"}.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-xs uppercase tracking-wider text-muted">
                <tr>
                  <th className="py-2 pr-3">Kund</th>
                  <th className="py-2 pr-3">Ort</th>
                  <th className="py-2 pr-3 text-right">Ordrar</th>
                  <th className="py-2 pr-3 text-right">Intäkt</th>
                  <th className="py-2 pr-3">Senaste order</th>
                  <th className="py-2">Prenumeration</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c) => (
                  <tr key={c.email} className="border-t border-line">
                    <td className="py-2 pr-3">
                      <Link href={customerHref(c.email)!} className="font-medium hover:underline">
                        {c.name ?? c.email}
                      </Link>
                      <span className="block text-xs text-muted">{c.email}</span>
                      {c.sandboxOnly ? <span className="rounded bg-sand px-1 text-[10px] uppercase text-muted">test</span> : null}
                    </td>
                    <td className="py-2 pr-3">{c.city}</td>
                    <td className="py-2 pr-3 text-right tabular-nums">{c.orders}</td>
                    <td className="py-2 pr-3 text-right tabular-nums">{formatPrice(Math.round(c.revenue))}</td>
                    <td className="py-2 pr-3 whitespace-nowrap text-muted">{fmtDate(c.lastOrderAt)}</td>
                    <td className="py-2">{c.hasSubscription ? <span className="rounded-full bg-primary-soft px-2.5 py-0.5 text-xs font-semibold text-primary">Ja</span> : <span className="text-muted">–</span>}</td>
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
