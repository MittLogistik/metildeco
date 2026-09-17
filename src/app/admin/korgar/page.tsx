import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { formatPrice } from "@/lib/format";
import { supabaseAdmin } from "@/lib/supabase";
import { markCartHandled } from "../actions";
import { ActionForm } from "../_components/ActionForm";

type Cart = {
  id: string;
  email: string;
  first_name: string | null;
  items: { name: string; qty: number; plan: string; lineTotal: number }[];
  subtotal: number;
  status: string;
  recovery_url: string | null;
  source: string;
  created_at: string;
  recovered_at: string | null;
};

const statusLabel: Record<string, string> = { open: "Öppen", recovered: "Återvunnen", handled: "Hanterad" };

export default async function AbandonedCartsPage({ searchParams }: PageProps<"/admin/korgar">) {
  await requireAdmin();
  const sp = await searchParams;
  const status = typeof sp.status === "string" ? sp.status : "open";
  let q = supabaseAdmin().from("abandoned_carts").select("*").order("created_at", { ascending: false }).limit(300);
  if (status !== "alla") q = q.eq("status", status);
  const { data } = await q;
  const carts = (data ?? []) as Cart[];
  const emails = Array.from(new Set(carts.map((c) => c.email)));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-medium">Övergivna korgar</h1>
          <p className="mt-1 text-sm text-muted">
            Kunder som gått till betalsteget, skrivit in sin e-post och lämnat. Stripes återställningslänk öppnar samma korg igen och gäller i 30 dagar.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <nav className="inline-flex rounded-full border border-line bg-white p-1">
            {[
              ["open", "Öppna"],
              ["recovered", "Återvunna"],
              ["handled", "Hanterade"],
              ["alla", "Alla"],
            ].map(([id, label]) => (
              <Link key={id} href={`/admin/korgar?status=${id}`} className={`rounded-full px-3 py-1.5 text-sm ${status === id ? "bg-foreground text-white" : "text-muted hover:text-foreground"}`}>
                {label}
              </Link>
            ))}
          </nav>
          {emails.length ? (
            <a href={`/admin/korgar/export?status=${status}`} className="rounded-full border border-line bg-white px-4 py-2 text-sm hover:bg-sand">
              Exportera CSV ({emails.length} e-postadresser)
            </a>
          ) : null}
        </div>
      </div>

      <section className="rounded-2xl border border-line bg-white">
        {carts.length === 0 ? (
          <p className="p-5 text-sm text-muted">Inga korgar med den här statusen.</p>
        ) : (
          <ul className="divide-y divide-line">
            {carts.map((c) => (
              <li key={c.id} className="grid gap-3 p-5 sm:grid-cols-[minmax(0,1fr)_auto]">
                <div className="min-w-0">
                  <p className="flex flex-wrap items-center gap-2">
                    <span className="font-medium">{c.email}</span>
                    {c.first_name ? <span className="text-muted">({c.first_name})</span> : null}
                    <span className="rounded-full bg-sand px-2 py-0.5 text-[11px] font-semibold">{statusLabel[c.status] ?? c.status}</span>
                    {c.source === "giftcard" ? <span className="text-xs text-muted">presentkort</span> : null}
                  </p>
                  <p className="mt-1 text-sm text-muted">
                    {new Date(c.created_at).toLocaleString("sv-SE", { dateStyle: "short", timeStyle: "short" })} · {formatPrice(Number(c.subtotal))}
                  </p>
                  <p className="mt-1 text-sm">{(c.items ?? []).map((i) => `${i.qty} × ${i.name}`).join(", ")}</p>
                </div>
                <div className="flex flex-wrap items-start gap-2 sm:justify-end">
                  {c.recovery_url ? (
                    <a href={c.recovery_url} target="_blank" rel="noopener" className="rounded-full border border-line px-3 py-1.5 text-xs hover:bg-sand">
                      Återställningslänk
                    </a>
                  ) : null}
                  <a href={`mailto:${c.email}?subject=${encodeURIComponent("Din varukorg hos Metilde")}`} className="rounded-full border border-line px-3 py-1.5 text-xs hover:bg-sand">
                    Mejla
                  </a>
                  {c.status === "open" ? (
                    <ActionForm action={markCartHandled} inline>
                      <input type="hidden" name="id" value={c.id} />
                      <button type="submit" className="rounded-full border border-line px-3 py-1.5 text-xs hover:bg-sand">
                        Markera hanterad
                      </button>
                    </ActionForm>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
