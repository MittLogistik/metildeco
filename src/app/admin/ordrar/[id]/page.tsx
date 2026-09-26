import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { customerHref, intervalLabel, subscriptionStatusLabel, type SubscriptionRecord } from "@/lib/customers";
import { formatPrice } from "@/lib/format";
import { intervalDaysOf, RENEWAL_RELEASE_DAYS_BEFORE } from "@/lib/orders";
import { plockyConfigured } from "@/lib/plocky";
import { supabaseAdmin } from "@/lib/supabase";
import { updateOrder } from "../../actions";
import { resendToPlocky } from "../../plocky/actions";
import { ActionForm, SubmitButton } from "../../_components/ActionForm";
import { Card, Field, Input, orderStatuses, Select, StatusBadge, statusLabel } from "../../_components/fields";

const fmtDate = (iso: string | null | undefined) => (iso ? new Date(iso).toLocaleDateString("sv-SE", { dateStyle: "long" }) : "–");

export default async function OrderDetailPage({ params }: PageProps<"/admin/ordrar/[id]">) {
  await requireAdmin();
  const { id } = await params;
  const db = supabaseAdmin();
  const { data: o } = await db.from("orders").select("*").eq("id", id).maybeSingle();
  if (!o) notFound();
  const [{ data: items }, subRes, wmsRes] = await Promise.all([
    db.from("order_items").select("*").eq("order_id", id),
    o.stripe_subscription_id ? db.from("subscriptions").select("*").eq("stripe_subscription_id", o.stripe_subscription_id).maybeSingle() : Promise.resolve({ data: null }),
    db.from("wms_queue").select("status,attempts,last_error,warning,wms_order_id,sent_at,next_attempt_at").eq("order_id", id).maybeSingle(),
  ]);
  const wms = (wmsRes.data ?? null) as { status: string; attempts: number; last_error: string | null; warning: string | null; wms_order_id: string | null; sent_at: string | null; next_attempt_at: string } | null;
  const wmsStatusLabel: Record<string, string> = { pending: "Väntar på att skickas", retrying: "Försöker igen", sent: "Skickad till Plocky", failed: "Misslyckades" };
  const sub = (subRes.data ?? null) as SubscriptionRecord | null;
  const subItem = (items ?? []).find((i) => String(i.plan).startsWith("sub"));
  const intervalDays = sub?.interval_days ?? intervalDaysOf(subItem?.plan);
  const isTest = o.environment === "sandbox";
  const stripeBase = `https://dashboard.stripe.com${isTest ? "/test" : ""}`;
  const customerLink = customerHref(o.email);
  const addressLines = [o.shipping_name, o.shipping_address, `${o.shipping_postal_code ?? ""} ${o.shipping_city ?? ""}`.trim(), o.shipping_country === "SE" ? "Sverige" : o.shipping_country].filter(Boolean);

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
          {o.kind === "renewal" ? " · prenumerationsförnyelse" : o.has_subscription ? ` · prenumeration ${intervalLabel(intervalDays)}` : ""}
        </p>
      </div>

      {o.status === "scheduled" ? (
        <div className="rounded-2xl border border-line bg-sand-soft p-4 text-sm">
          <p className="font-medium">Planerad leverans {fmtDate(o.deliver_at)}</p>
          <p className="mt-1 text-muted">
            Betalningen är bekräftad av Stripe. Ordern släpps till packning {fmtDate(o.release_at)}, {RENEWAL_RELEASE_DAYS_BEFORE} dagar före leverans. Vill du skicka
            tidigare: sätt status Betald nedan.
          </p>
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-6">
          <Card title="Innehåll">
            <table className="w-full text-sm">
              <tbody>
                {(items ?? []).map((i) => (
                  <tr key={i.id} className="border-b border-line last:border-0">
                    <td className="py-2">
                      {i.qty} × {i.name}
                      {String(i.plan).startsWith("sub") ? <span className="ml-1 text-xs text-muted">prenumeration {intervalLabel(intervalDaysOf(i.plan) ?? intervalDays)}</span> : null}
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
                <p className="mt-1">
                  {o.email ? (
                    <a href={`mailto:${o.email}`} className="break-all underline underline-offset-2">
                      {o.email}
                    </a>
                  ) : (
                    "–"
                  )}
                </p>
                <p>
                  {o.phone ? (
                    <a href={`tel:${String(o.phone).replace(/\s/g, "")}`} className="underline underline-offset-2">
                      {o.phone}
                    </a>
                  ) : (
                    <span className="text-muted">Telefon saknas</span>
                  )}
                </p>
                {customerLink ? (
                  <Link href={customerLink} className="mt-2 inline-block text-xs font-medium underline underline-offset-2">
                    Kundsida: alla ordrar och prenumerationer
                  </Link>
                ) : null}
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-muted">Leveransadress</p>
                <p className="mt-1 whitespace-pre-line select-all">{addressLines.length ? addressLines.join("\n") : "Adress saknas"}</p>
                {o.shipping_method ? <p className="mt-2 text-xs text-muted">{o.shipping_method}</p> : null}
              </div>
            </div>
          </Card>

          {sub || o.has_subscription ? (
            <Card title="Prenumeration">
              {sub ? (
                <dl className="grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
                  <div>
                    <dt className="text-xs uppercase tracking-wider text-muted">Leveransintervall</dt>
                    <dd className="mt-0.5 font-medium">{intervalLabel(intervalDays)}</dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-wider text-muted">Status</dt>
                    <dd className="mt-0.5">
                      {subscriptionStatusLabel[sub.status] ?? sub.status}
                      {sub.cancel_at_period_end ? " · avslutas vid periodens slut" : ""}
                      {sub.paused_at ? " · pausad" : ""}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-wider text-muted">Pris</dt>
                    <dd className="mt-0.5">{sub.amount ? `${formatPrice(Number(sub.amount))} per förpackning, ${sub.quantity} st` : "–"}</dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-wider text-muted">Nästa betalning</dt>
                    <dd className="mt-0.5">{fmtDate(sub.current_period_end)}</dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-wider text-muted">Nästa planerade leverans</dt>
                    <dd className="mt-0.5">{fmtDate(sub.next_shipment_at)}</dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-wider text-muted">Startad</dt>
                    <dd className="mt-0.5">{fmtDate(sub.created_at)}</dd>
                  </div>
                </dl>
              ) : (
                <p className="text-sm text-muted">Prenumeration {intervalLabel(intervalDays)}. Prenumerationsraden saknas i databasen, se Stripe.</p>
              )}
            </Card>
          ) : null}
        </div>

        <div className="space-y-6">
          <Card title="Status och spårning">
            <ActionForm action={updateOrder} className="space-y-4">
              <input type="hidden" name="id" value={o.id} />
              <Field label="Status">
                <Select name="status" defaultValue={o.status} options={orderStatuses.map((s) => ({ value: s, label: statusLabel[s] ?? s }))} />
              </Field>
              <Field label="Kolli-id" hint="Fylls i av Plocky när frakten bokas.">
                <Input name="tracking_number" defaultValue={o.tracking_number} />
              </Field>
              <Field label="Spårningslänk">
                <Input name="tracking_url" defaultValue={o.tracking_url} type="url" />
              </Field>
              <SubmitButton>Spara</SubmitButton>
            </ActionForm>
          </Card>
          {o.kind !== "giftcard" ? (
            <Card title="Plocky (lager)">
              {wms ? (
                <dl className="space-y-2 text-sm">
                  <div>
                    <dt className="text-xs uppercase tracking-wider text-muted">Status</dt>
                    <dd className={wms.status === "failed" ? "text-danger" : ""}>
                      {wmsStatusLabel[wms.status] ?? wms.status}
                      {wms.sent_at ? ` ${new Date(wms.sent_at).toLocaleString("sv-SE", { dateStyle: "short", timeStyle: "short" })}` : ""}
                    </dd>
                  </div>
                  {wms.wms_order_id || o.wms_order_id ? (
                    <div>
                      <dt className="text-xs uppercase tracking-wider text-muted">Plockys ordernummer</dt>
                      <dd className="tabular-nums">{wms.wms_order_id ?? o.wms_order_id}</dd>
                    </div>
                  ) : null}
                  {wms.last_error ? <p className="text-xs text-danger">{wms.last_error}</p> : null}
                  {wms.warning ? <p className="text-xs text-muted">{wms.warning}</p> : null}
                </dl>
              ) : (
                <p className="text-sm text-muted">
                  {o.status === "scheduled" ? "Skickas till Plocky när ordern släpps till packning." : plockyConfigured() ? "Inte skickad till Plocky." : "Plocky är inte kopplat ännu."}
                </p>
              )}
              {plockyConfigured() && o.status !== "scheduled" && o.status !== "cancelled" && o.status !== "refunded" ? (
                <ActionForm action={resendToPlocky} className="mt-3" confirm={wms?.status === "sent" ? "Ordern är redan skickad till Plocky. Skicka igen ändå? Plocky svarar då att den redan finns." : undefined}>
                  <input type="hidden" name="order_id" value={o.id} />
                  <SubmitButton variant="outline">{wms?.status === "sent" ? "Skicka igen" : "Skicka till Plocky"}</SubmitButton>
                </ActionForm>
              ) : null}
            </Card>
          ) : null}
          <Card title="Stripe">
            <ul className="space-y-1 text-sm">
              {o.stripe_payment_intent ? (
                <li>
                  <a href={`${stripeBase}/payments/${o.stripe_payment_intent}`} target="_blank" rel="noopener" className="underline">
                    Betalning i Stripe
                  </a>
                </li>
              ) : null}
              {o.stripe_invoice_id ? (
                <li>
                  <a href={`${stripeBase}/invoices/${o.stripe_invoice_id}`} target="_blank" rel="noopener" className="underline">
                    Faktura i Stripe
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
