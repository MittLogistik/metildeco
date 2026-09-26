import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { getCatalog } from "@/lib/catalog";
import { getCustomer, intervalLabel, subscriptionStatusLabel } from "@/lib/customers";
import { formatPrice } from "@/lib/format";
import { RENEWAL_RELEASE_DAYS_BEFORE } from "@/lib/orders";
import { Card, StatusBadge } from "../../_components/fields";
import { AdminSubscriptionActions } from "../AdminSubscriptionActions";

const fmtDate = (iso: string | null | undefined) => (iso ? new Date(iso).toLocaleDateString("sv-SE", { dateStyle: "medium" }) : "–");
const fmtDateTime = (iso: string) => new Date(iso).toLocaleString("sv-SE", { dateStyle: "short", timeStyle: "short" });

export default async function CustomerPage({ params }: PageProps<"/admin/kunder/[key]">) {
  await requireAdmin();
  const { key } = await params;
  const [customer, catalog] = await Promise.all([getCustomer(decodeURIComponent(key)), getCatalog()]);
  if (!customer) notFound();
  const productName = (slug: string | null) => catalog.allProducts.find((p) => p.slug === slug)?.name ?? catalog.allBundles.find((b) => b.slug === slug)?.name ?? slug ?? "–";
  const { stats, address } = customer;
  const activeSubs = customer.subscriptions.filter((s) => s.status === "active" || s.status === "trialing" || s.status === "past_due");
  const nextScheduled = customer.orders.filter((o) => o.status === "scheduled" && o.deliver_at).sort((a, b) => (a.deliver_at ?? "").localeCompare(b.deliver_at ?? ""))[0];

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/kunder" className="text-sm text-muted hover:underline">
          ← Alla kunder
        </Link>
        <h1 className="mt-2 font-display text-3xl font-medium">{customer.name ?? customer.email}</h1>
        <p className="mt-1 text-sm text-muted">
          Kund sedan {fmtDate(stats.firstOrderAt)}
          {activeSubs.length ? ` · ${activeSubs.length === 1 ? "prenumerant" : `${activeSubs.length} prenumerationer`}` : ""}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-2xl border border-line bg-white p-4">
          <p className="text-xs text-muted">Ordrar</p>
          <p className="mt-1 font-display text-2xl font-medium tabular-nums">{stats.orders}</p>
          <p className="text-xs text-muted">{stats.scheduled ? `${stats.scheduled} planerad${stats.scheduled > 1 ? "e" : ""}` : "exkl. avbrutna"}</p>
        </div>
        <div className="rounded-2xl border border-line bg-white p-4">
          <p className="text-xs text-muted">Total intäkt</p>
          <p className="mt-1 font-display text-2xl font-medium tabular-nums">{formatPrice(Math.round(stats.revenue))}</p>
          <p className="text-xs text-muted">skarpa ordrar</p>
        </div>
        <div className="rounded-2xl border border-line bg-white p-4">
          <p className="text-xs text-muted">Snittorder</p>
          <p className="mt-1 font-display text-2xl font-medium tabular-nums">{stats.average ? formatPrice(Math.round(stats.average)) : "–"}</p>
          <p className="text-xs text-muted">intäkt per order</p>
        </div>
        <div className="rounded-2xl border border-line bg-white p-4">
          <p className="text-xs text-muted">Nästa leverans</p>
          <p className="mt-1 font-display text-2xl font-medium tabular-nums">{fmtDate(nextScheduled?.deliver_at ?? activeSubs[0]?.next_shipment_at)}</p>
          <p className="text-xs text-muted">{nextScheduled ? "planerad order finns" : activeSubs.length ? "enligt prenumerationen" : "ingen prenumeration"}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-6">
          <Card title="Prenumerationer">
            {customer.subscriptions.length === 0 ? (
              <p className="text-sm text-muted">Ingen prenumeration.</p>
            ) : (
              <ul className="divide-y divide-line text-sm">
                {customer.subscriptions.map((s) => (
                  <li key={s.id} className="py-3 first:pt-0 last:pb-0">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-medium">
                        {s.quantity} × {productName(s.product_slug)}
                        <span className="ml-2 text-muted">{intervalLabel(s.interval_days)}</span>
                      </p>
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${s.status === "active" ? "bg-primary-soft text-primary" : s.status === "canceled" ? "bg-danger/10 text-danger" : "bg-sand text-foreground"}`}>
                        {subscriptionStatusLabel[s.status] ?? s.status}
                        {s.cancel_at_period_end ? " · avslutas vid periodens slut" : ""}
                        {s.paused_at ? " · pausad" : ""}
                      </span>
                    </div>
                    <dl className="mt-2 grid gap-x-6 gap-y-1 text-xs text-muted sm:grid-cols-3">
                      <div>
                        <dt className="uppercase tracking-wider">Pris</dt>
                        <dd className="text-foreground">{s.amount ? `${formatPrice(Number(s.amount))} per förpackning` : "–"}</dd>
                      </div>
                      <div>
                        <dt className="uppercase tracking-wider">Nästa betalning</dt>
                        <dd className="text-foreground">{fmtDate(s.current_period_end)}</dd>
                      </div>
                      <div>
                        <dt className="uppercase tracking-wider">Nästa leverans</dt>
                        <dd className="text-foreground">{fmtDate(s.next_shipment_at)}</dd>
                      </div>
                    </dl>
                    {s.environment === "sandbox" ? <span className="mt-1 inline-block rounded bg-sand px-1 text-[10px] uppercase text-muted">test</span> : null}
                    <AdminSubscriptionActions id={s.stripe_subscription_id} status={s.status} paused={Boolean(s.paused_at)} cancelling={s.cancel_at_period_end} />
                  </li>
                ))}
              </ul>
            )}
            <p className="mt-3 text-xs text-muted">
              När Stripe bekräftat förnyelsen skapas en planerad order som släpps till packning {RENEWAL_RELEASE_DAYS_BEFORE} dagar före planerad leverans. Knapparna ändrar
              prenumerationen direkt i Stripe, till exempel när kunden mejlar en uppsägning.
            </p>
          </Card>

          <Card title="Ordrar">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-xs uppercase tracking-wider text-muted">
                  <tr>
                    <th className="py-2 pr-3">Order</th>
                    <th className="py-2 pr-3">Datum</th>
                    <th className="py-2 pr-3">Innehåll</th>
                    <th className="py-2 pr-3 text-right">Summa</th>
                    <th className="py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {customer.orders.map((o) => (
                    <tr key={o.id} className="border-t border-line align-top">
                      <td className="py-2 pr-3 whitespace-nowrap">
                        <Link href={`/admin/ordrar/${o.id}`} className="font-medium hover:underline">
                          {o.order_number}
                        </Link>
                        {o.kind === "renewal" ? <span className="block text-xs text-muted">förnyelse</span> : null}
                        {o.environment === "sandbox" ? <span className="ml-1 rounded bg-sand px-1 text-[10px] uppercase text-muted">test</span> : null}
                      </td>
                      <td className="py-2 pr-3 whitespace-nowrap text-muted">
                        {fmtDateTime(o.created_at)}
                        {o.status === "scheduled" && o.deliver_at ? <span className="block text-xs">leverans {fmtDate(o.deliver_at)}</span> : null}
                      </td>
                      <td className="py-2 pr-3">
                        {(customer.itemsByOrder.get(o.id) ?? []).map((i) => (
                          <span key={i.product_slug + i.plan} className="block">
                            {i.qty} × {i.name}
                            {i.plan.startsWith("sub") ? <span className="text-xs text-muted"> · {intervalLabel(Number(i.plan.split(":")[1]) || null)}</span> : null}
                          </span>
                        ))}
                      </td>
                      <td className="py-2 pr-3 text-right tabular-nums">{formatPrice(Number(o.total))}</td>
                      <td className="py-2">
                        <StatusBadge status={o.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card title="Kontakt">
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-xs uppercase tracking-wider text-muted">E-post</dt>
                <dd>
                  <a href={`mailto:${customer.email}`} className="break-all underline underline-offset-2">
                    {customer.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wider text-muted">Telefon</dt>
                <dd>
                  {customer.phone ? (
                    <a href={`tel:${customer.phone.replace(/\s/g, "")}`} className="underline underline-offset-2">
                      {customer.phone}
                    </a>
                  ) : (
                    "–"
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wider text-muted">Leveransadress</dt>
                <dd className="whitespace-pre-line">
                  {address ? [address.name, address.line, `${address.postalCode ?? ""} ${address.city ?? ""}`.trim(), address.country].filter(Boolean).join("\n") : "–"}
                </dd>
              </div>
            </dl>
          </Card>
        </div>
      </div>
    </div>
  );
}
