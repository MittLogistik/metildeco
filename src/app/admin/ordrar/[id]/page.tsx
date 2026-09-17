import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { formatPrice } from "@/lib/format";
import { supabaseAdmin } from "@/lib/supabase";
import { updateOrder } from "../../actions";
import { ActionForm, SubmitButton } from "../../_components/ActionForm";
import { Card, Field, Input, orderStatuses, Select, StatusBadge, statusLabel } from "../../_components/fields";

export default async function OrderDetailPage({ params }: PageProps<"/admin/ordrar/[id]">) {
  await requireAdmin();
  const { id } = await params;
  const db = supabaseAdmin();
  const { data: o } = await db.from("orders").select("*").eq("id", id).maybeSingle();
  if (!o) notFound();
  const { data: items } = await db.from("order_items").select("*").eq("order_id", id);
  const isTest = o.environment === "sandbox";
  const stripeBase = `https://dashboard.stripe.com${isTest ? "/test" : ""}`;

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/ordrar" className="text-sm text-muted hover:underline">
          ← Alla ordrar
        </Link>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <h1 className="font-display text-3xl font-medium">{o.order_number}</h1>
          <StatusBadge status={o.status} />
          {isTest ? <span className="rounded bg-sand px-2 py-0.5 text-xs uppercase text-muted">testläge</span> : null}
        </div>
        <p className="mt-1 text-sm text-muted">
          {new Date(o.created_at).toLocaleString("sv-SE", { dateStyle: "long", timeStyle: "short" })}
          {o.kind === "renewal" ? " · prenumerationsförnyelse" : o.has_subscription ? " · innehåller prenumeration" : ""}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-6">
          <Card title="Innehåll">
            <table className="w-full text-sm">
              <tbody>
                {(items ?? []).map((i) => (
                  <tr key={i.id} className="border-b border-line last:border-0">
                    <td className="py-2">
                      {i.qty} × {i.name}
                      {String(i.plan).startsWith("sub") ? <span className="ml-1 text-xs text-muted">prenumeration</span> : null}
                      <span className="block text-xs text-muted">{i.product_slug}</span>
                    </td>
                    <td className="py-2 text-right tabular-nums">{formatPrice(Number(i.line_total))}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="text-sm">
                {Number(o.discount) > 0 ? (
                  <tr>
                    <td className="pt-2 text-muted">Rabatt {o.discount_code ? `(${o.discount_code})` : ""}</td>
                    <td className="pt-2 text-right tabular-nums text-success">−{formatPrice(Number(o.discount))}</td>
                  </tr>
                ) : null}
                <tr>
                  <td className="pt-2 text-muted">Frakt {o.shipping_method ? `– ${o.shipping_method}` : ""}</td>
                  <td className="pt-2 text-right tabular-nums">{Number(o.shipping) === 0 ? "Fri" : formatPrice(Number(o.shipping))}</td>
                </tr>
                <tr className="font-semibold">
                  <td className="pt-2">Totalt</td>
                  <td className="pt-2 text-right tabular-nums">{formatPrice(Number(o.total))}</td>
                </tr>
              </tfoot>
            </table>
          </Card>

          <Card title="Kund och leverans">
            <div className="grid gap-4 text-sm sm:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-wider text-muted">Kontakt</p>
                <p className="mt-1">{o.email}</p>
                <p>{o.phone}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-muted">Leveransadress</p>
                <p className="mt-1">{o.shipping_name}</p>
                <p>{o.shipping_address}</p>
                <p>
                  {o.shipping_postal_code} {o.shipping_city}
                </p>
                <p>{o.shipping_country}</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card title="Status och spårning">
            <ActionForm action={updateOrder} className="space-y-4">
              <input type="hidden" name="id" value={o.id} />
              <Field label="Status">
                <Select name="status" defaultValue={o.status} options={orderStatuses.map((s) => ({ value: s, label: statusLabel[s] ?? s }))} />
              </Field>
              <Field label="Kolli-id" hint="Fylls i automatiskt när Plocky är kopplat.">
                <Input name="tracking_number" defaultValue={o.tracking_number} />
              </Field>
              <Field label="Spårningslänk">
                <Input name="tracking_url" defaultValue={o.tracking_url} type="url" />
              </Field>
              <SubmitButton>Spara</SubmitButton>
            </ActionForm>
          </Card>
          <Card title="Stripe">
            <ul className="space-y-1 text-sm">
              {o.stripe_payment_intent ? (
                <li>
                  <a href={`${stripeBase}/payments/${o.stripe_payment_intent}`} target="_blank" rel="noopener" className="underline">
                    Betalning i Stripe
                  </a>
                </li>
              ) : null}
              {o.stripe_subscription_id ? (
                <li>
                  <a href={`${stripeBase}/subscriptions/${o.stripe_subscription_id}`} target="_blank" rel="noopener" className="underline">
                    Prenumeration i Stripe
                  </a>
                </li>
              ) : null}
              {o.stripe_customer_id ? (
                <li>
                  <a href={`${stripeBase}/customers/${o.stripe_customer_id}`} target="_blank" rel="noopener" className="underline">
                    Kund i Stripe
                  </a>
                </li>
              ) : null}
            </ul>
            <p className="mt-3 text-xs text-muted">Återbetalningar görs i Stripe. Sätt sedan status Återbetald här.</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
