"use client";

import { useActionState } from "react";
import { formatPrice } from "@/lib/format";
import { Button } from "@/components/ui";
import { CheckIcon } from "@/components/icons";
import { trackOrder, type TrackResult } from "./actions";

const stages = [
  { id: "paid", label: "Order mottagen" },
  { id: "packed", label: "Packad i lager" },
  { id: "shipped", label: "Skickad" },
  { id: "delivered", label: "Levererad" },
];

const field = "h-12 w-full rounded-xl border border-line bg-white px-3.5 text-base placeholder:text-muted-soft focus:border-primary focus:outline-none";

export function TrackForm() {
  const [state, action, pending] = useActionState(async (_prev: TrackResult | null, fd: FormData) => trackOrder(fd), null);

  if (state?.ok) {
    const o = state.order;
    const stageIndex = o.status === "cancelled" || o.status === "refunded" ? -1 : stages.findIndex((s) => s.id === o.status);
    return (
      <div className="rounded-card border border-line p-6 sm:p-8">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="font-display text-2xl font-medium">Order {o.orderNumber}</h2>
          <p className="text-sm text-muted">Beställd {new Date(o.createdAt).toLocaleDateString("sv-SE", { dateStyle: "long" })}</p>
        </div>

        {stageIndex === -1 ? (
          <p className="mt-6 rounded-xl bg-sand-soft p-4 text-sm">Ordern är {o.status === "refunded" ? "återbetald" : "avbruten"}. Hör av dig till kundservice om du har frågor.</p>
        ) : (
          <ol className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {stages.map((s, i) => {
              const reached = i <= stageIndex;
              return (
                <li key={s.id} className="flex items-center gap-2 text-sm">
                  <span className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${reached ? "bg-primary text-primary-fg" : "border border-line text-muted"}`}>
                    {reached ? <CheckIcon size={14} /> : i + 1}
                  </span>
                  <span className={reached ? "font-medium" : "text-muted"}>{s.label}</span>
                </li>
              );
            })}
          </ol>
        )}

        {o.trackingNumber || o.trackingUrl ? (
          <div className="mt-6 rounded-xl bg-sand-soft p-4 text-sm">
            <p>
              <span className="text-muted">Kolli-id:</span> <span className="font-mono">{o.trackingNumber ?? "–"}</span>
            </p>
            {o.trackingUrl ? (
              <a href={o.trackingUrl} target="_blank" rel="noopener" className="mt-1 inline-block font-medium underline underline-offset-2">
                Öppna hos transportören
              </a>
            ) : null}
          </div>
        ) : stageIndex >= 0 && stageIndex < 2 ? (
          <p className="mt-6 text-sm text-muted">Spårningslänken visas här så snart paketet lämnat vårt lager.</p>
        ) : null}

        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <div>
            <h3 className="text-sm font-semibold">Innehåll</h3>
            <ul className="mt-2 divide-y divide-line text-sm">
              {o.items.map((i, idx) => (
                <li key={idx} className="flex justify-between py-2">
                  <span>
                    {i.qty} × {i.name}
                  </span>
                  <span className="tabular-nums">{formatPrice(i.lineTotal)}</span>
                </li>
              ))}
              <li className="flex justify-between py-2 text-muted">
                <span>Frakt {o.shippingMethod ? `– ${o.shippingMethod}` : ""}</span>
                <span className="tabular-nums">{o.shipping === 0 ? "Fri" : formatPrice(o.shipping)}</span>
              </li>
              <li className="flex justify-between py-2 font-semibold">
                <span>Totalt</span>
                <span className="tabular-nums">{formatPrice(o.total)}</span>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold">Leveransadress</h3>
            <p className="mt-2 text-sm text-muted">{o.address}</p>
          </div>
        </div>
        <form action={action} className="mt-6">
          <button type="submit" formAction={() => window.location.reload()} className="text-sm underline underline-offset-2">
            Spåra en annan order
          </button>
        </form>
      </div>
    );
  }

  return (
    <form action={action} className="rounded-card border border-line p-6 sm:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm">
          <span className="mb-1.5 block font-medium">Ordernummer</span>
          <input name="orderNumber" required placeholder="MO-0001" className={field} />
        </label>
        <label className="text-sm">
          <span className="mb-1.5 block font-medium">E-postadress</span>
          <input name="email" type="email" required placeholder="du@exempel.se" className={field} />
        </label>
      </div>
      {state && !state.ok ? (
        <p role="alert" className="mt-4 text-sm text-danger">
          {state.error}
        </p>
      ) : null}
      <Button type="submit" size="lg" className="mt-5 w-full sm:w-auto" disabled={pending}>
        {pending ? "Söker …" : "Spåra order"}
      </Button>
    </form>
  );
}
