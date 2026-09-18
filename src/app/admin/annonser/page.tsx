import { requireAdmin } from "@/lib/auth";
import { rules, TEST_PREFIX } from "@/lib/ads-engine";
import { getCatalog } from "@/lib/catalog";
import * as meta from "@/lib/meta-ads";
import { site } from "@/lib/site";
import { supabaseAdmin, supabaseConfigured } from "@/lib/supabase";
import { ActionForm, SubmitButton } from "../_components/ActionForm";
import { Card, Field, Input, Select } from "../_components/fields";
import { createTestCampaign, iterateAd, runReview, setAdSetBudget, setObjectStatus } from "./actions";
import Link from "next/link";

type LogRow = { id: string; created_at: string; name: string; action: string; reason: string; applied: boolean; source: string };

const actionLabel: Record<string, string> = { create: "Skapad", pause: "Pausad", activate: "Aktiverad", budget: "Budget", keep: "Behåll", iterate: "Itererad", note: "Info" };

function money(v: number, cur: string) {
  return `${v.toFixed(2)} ${cur}`;
}

function StatusPill({ status }: { status: string }) {
  const active = status === "ACTIVE";
  return <span className={`rounded-full px-2 py-0.5 text-xs ${active ? "bg-success/10 text-success" : "bg-sand text-muted"}`}>{active ? "Aktiv" : status === "PAUSED" || status === "CAMPAIGN_PAUSED" || status === "ADSET_PAUSED" ? "Pausad" : status}</span>;
}

function ToggleStatus({ id, name, level, status }: { id: string; name: string; level: "campaign" | "adset" | "ad"; status: string }) {
  const next = status === "ACTIVE" ? "PAUSED" : "ACTIVE";
  return (
    <ActionForm action={setObjectStatus} inline confirm={next === "ACTIVE" ? `Aktivera ${name}? Då börjar den kosta pengar.` : undefined}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="name" value={name} />
      <input type="hidden" name="level" value={level} />
      <input type="hidden" name="status" value={next} />
      <SubmitButton variant={next === "ACTIVE" ? "primary" : "outline"}>{next === "ACTIVE" ? "Aktivera" : "Pausa"}</SubmitButton>
    </ActionForm>
  );
}

export default async function AdsPage() {
  await requireAdmin();
  const configured = meta.adsConfigured();
  const catalog = await getCatalog();
  const products = catalog.products.filter((p) => p.isActive);
  const logRes = supabaseConfigured() ? await supabaseAdmin().from("ad_log").select("id,created_at,name,action,reason,applied,source").order("created_at", { ascending: false }).limit(40) : null;
  const logs = (logRes?.data ?? []) as LogRow[];

  let error: string | null = null;
  let cur = "USD";
  type Metrics = ReturnType<typeof meta.summarize> | null;
  type AdRow = meta.Ad & { m: Metrics };
  type AdSetRow = meta.AdSet & { ads: AdRow[]; m: Metrics };
  type CampaignRow = meta.Campaign & { adsets: AdSetRow[] };
  const tree: CampaignRow[] = [];
  if (configured) {
    try {
      // Tre anrop totalt oavsett antal kampanjer – Meta begränsar anrop per annonskonto
      const [currency, nodes, adInsights, adsetInsights] = await Promise.all([meta.accountCurrency(), meta.listTree(), meta.adInsights(meta.adAccount(), 7, "ad"), meta.adInsights(meta.adAccount(), 7, "adset")]);
      cur = currency;
      const byAd = new Map(adInsights.map((i) => [i.ad_id, meta.summarize(i)]));
      const byAdSet = new Map(adsetInsights.map((i) => [i.adset_id, meta.summarize(i)]));
      for (const c of nodes) {
        const { adsets, ...campaign } = c;
        tree.push({
          ...campaign,
          adsets: (adsets?.data ?? []).map((s) => {
            const { ads, ...adset } = s;
            return { ...adset, ads: (ads?.data ?? []).map((a) => ({ ...a, m: byAd.get(a.id) ?? null })), m: byAdSet.get(s.id) ?? null };
          }),
        });
      }
    } catch (e) {
      error = e instanceof Error ? e.message : "Kunde inte läsa från Meta.";
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-medium">Annonser</h1>
        <p className="mt-1 text-sm text-muted">
          Meta-kampanjer via Marketing API. Allt som skapas här är pausat tills du aktiverar det. Belopp i annonskontots valuta ({cur}).{" "}
          <Link href="/admin/annonser/bilder" className="underline">
            Annonsbilder
          </Link>
        </p>
      </div>

      {!configured ? (
        <Card title="Inte kopplat">
          <p className="text-sm text-muted">META_ADS_TOKEN och META_AD_ACCOUNT_ID saknas i miljön.</p>
        </Card>
      ) : null}
      {error ? (
        <Card title="Fel från Meta">
          <p className="text-sm text-danger">{error}</p>
        </Card>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Skapa testkampanj">
          <p className="mb-4 text-sm text-muted">
            Upp till 10 annonser för en produkt: fem textvinklar kombinerade med produktens annonsbilder (genererade scener, egna bilder, packshots). Varje annons har en flödesbild och en storybild. Skapas pausad. Efter {rules.testDays} dagar behålls de {rules.keepWinners} bästa och de itereras.
          </p>
          <ActionForm action={createTestCampaign} className="space-y-4">
            <Field label="Produkt">
              <Select name="slug" options={products.map((p) => ({ value: p.slug, label: p.name }))} />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label={`Daglig budget (${cur})`} hint="Minst 1. Tio annonser behöver runt 10 per dag för att få data.">
                <Input name="daily_budget" type="number" defaultValue="10" />
              </Field>
              <Field label="Antal annonser">
                <Input name="ads_count" type="number" defaultValue="10" />
              </Field>
            </div>
            <Field label="Bas-URL för packshots" hint="Måste vara nåbar för Meta. Byt till https://metilde.com efter lanseringen.">
              <Input name="media_base" defaultValue={site.indexable ? site.url : "https://metildeco.vercel.app"} />
            </Field>
            <Field label="Annonserna länkar till" hint="Lämna tomt för https://metilde.com.">
              <Input name="link_base" defaultValue="" placeholder="https://metilde.com" />
            </Field>
            <SubmitButton>Skapa pausad testkampanj</SubmitButton>
          </ActionForm>
        </Card>

        <Card title="Granskning">
          <p className="mb-4 text-sm text-muted">
            Reglerna: under testet pausas annonser som kostat minst {rules.killMinSpend} {cur} med CTR under {rules.killMaxCtr} % och inga varukorgar, eller 2× mål-CPA ({rules.targetCpa} {cur}) utan köp. Efter {rules.testDays} dagar behålls de {rules.keepWinners} bästa. Budget höjs {Math.round(rules.scaleStep * 100)} % vid ROAS över {rules.targetRoas} (tak {rules.scaleMaxDaily} {cur}/dag) och sänks {Math.round(rules.shrinkStep * 100)} % efter en vecka utan köp.
          </p>
          <div className="flex flex-wrap gap-3">
            <ActionForm action={runReview} inline>
              <input type="hidden" name="apply" value="0" />
              <SubmitButton variant="outline">Visa förslag</SubmitButton>
            </ActionForm>
            <ActionForm action={runReview} inline confirm="Utför alla föreslagna åtgärder i Meta nu?">
              <input type="hidden" name="apply" value="1" />
              <SubmitButton>Kör och tillämpa</SubmitButton>
            </ActionForm>
          </div>
          <p className="mt-4 text-xs text-muted">
            Den dagliga granskningen körs 07:00 via Vercel Cron. Med ADS_AUTOPILOT=true utförs åtgärderna automatiskt, annars loggas de bara som förslag här.
          </p>
        </Card>
      </div>

      <section className="space-y-4">
        <h2 className="font-display text-xl font-medium">Kampanjer</h2>
        {tree.length === 0 && configured && !error ? <p className="text-sm text-muted">Inga kampanjer i kontot.</p> : null}
        {tree.map((c) => (
          <Card key={c.id}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="font-medium">
                  {c.name} <StatusPill status={c.effective_status} />
                </h3>
                <p className="text-xs text-muted">
                  {c.objective} · skapad {c.created_time.slice(0, 10)} · {c.name.startsWith(TEST_PREFIX) ? "styrs av motorn" : "manuell kampanj"}
                </p>
              </div>
              <ToggleStatus id={c.id} name={c.name} level="campaign" status={c.effective_status} />
            </div>
            {c.adsets.map((s) => (
              <div key={s.id} className="mt-5 rounded-xl border border-line p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-medium">
                      {s.name} <StatusPill status={s.effective_status} />
                    </p>
                    <p className="text-xs text-muted">
                      {s.daily_budget ? `${money(Number(s.daily_budget) / 100, cur)}/dag` : "ingen daglig budget"}
                      {s.m ? ` · 7 dagar: ${money(s.m.spend, cur)}, ${s.m.purchases} köp, ROAS ${s.m.roas.toFixed(2)}` : ""}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <ActionForm action={setAdSetBudget} inline className="flex items-center gap-2">
                      <input type="hidden" name="id" value={s.id} />
                      <input type="hidden" name="name" value={s.name} />
                      <input name="budget" type="number" min={1} step="0.5" defaultValue={s.daily_budget ? Number(s.daily_budget) / 100 : 10} className="h-10 w-24 rounded-xl border border-line px-3 text-sm" aria-label="Daglig budget" />
                      <SubmitButton variant="outline">Sätt budget</SubmitButton>
                    </ActionForm>
                    <ToggleStatus id={s.id} name={s.name} level="adset" status={s.effective_status} />
                  </div>
                </div>
                <div className="mt-3 overflow-x-auto">
                  <table className="w-full min-w-[720px] text-sm">
                    <thead className="text-left text-xs text-muted">
                      <tr>
                        <th className="py-1 pr-3 font-normal">Annons</th>
                        <th className="py-1 pr-3 font-normal">Status</th>
                        <th className="py-1 pr-3 text-right font-normal">Visningar</th>
                        <th className="py-1 pr-3 text-right font-normal">Klick</th>
                        <th className="py-1 pr-3 text-right font-normal">CTR</th>
                        <th className="py-1 pr-3 text-right font-normal">Kostnad</th>
                        <th className="py-1 pr-3 text-right font-normal">Varukorg</th>
                        <th className="py-1 pr-3 text-right font-normal">Köp</th>
                        <th className="py-1 pr-3 text-right font-normal">ROAS</th>
                        <th className="py-1 font-normal"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {s.ads.map((a) => (
                        <tr key={a.id} className="border-t border-line">
                          <td className="py-2 pr-3">
                            <span className="flex items-center gap-2">
                              {a.creative?.thumbnail_url ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={a.creative.thumbnail_url} alt="" width={32} height={32} className="h-8 w-8 rounded object-cover" />
                              ) : null}
                              {a.name}
                            </span>
                          </td>
                          <td className="py-2 pr-3">
                            <StatusPill status={a.effective_status} />
                          </td>
                          <td className="py-2 pr-3 text-right tabular-nums">{a.m?.impressions ?? "–"}</td>
                          <td className="py-2 pr-3 text-right tabular-nums">{a.m?.clicks ?? "–"}</td>
                          <td className="py-2 pr-3 text-right tabular-nums">{a.m ? `${a.m.ctr.toFixed(2)} %` : "–"}</td>
                          <td className="py-2 pr-3 text-right tabular-nums">{a.m ? money(a.m.spend, cur) : "–"}</td>
                          <td className="py-2 pr-3 text-right tabular-nums">{a.m?.addToCart ?? "–"}</td>
                          <td className="py-2 pr-3 text-right tabular-nums">{a.m?.purchases ?? "–"}</td>
                          <td className="py-2 pr-3 text-right tabular-nums">{a.m ? a.m.roas.toFixed(2) : "–"}</td>
                          <td className="py-2 text-right">
                            <span className="inline-flex gap-1">
                              {c.name.startsWith(TEST_PREFIX) ? (
                                <ActionForm action={iterateAd} inline confirm={`Skapa ${rules.iterationsPerWinner} nya varianter från ${a.name}? Nya scener kan genereras via Higgsfield.`}>
                                  <input type="hidden" name="ad_id" value={a.id} />
                                  <input type="hidden" name="status" value={a.effective_status === "ACTIVE" ? "ACTIVE" : "PAUSED"} />
                                  <SubmitButton variant="outline">Iterera</SubmitButton>
                                </ActionForm>
                              ) : null}
                              <ToggleStatus id={a.id} name={a.name} level="ad" status={a.effective_status} />
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </Card>
        ))}
      </section>

      <Card title="Logg">
        {logs.length === 0 ? <p className="text-sm text-muted">Inget loggat ännu.</p> : null}
        <ul className="divide-y divide-line text-sm">
          {logs.map((l) => (
            <li key={l.id} className="flex flex-wrap items-baseline gap-x-3 gap-y-1 py-2">
              <span className="w-32 shrink-0 text-xs text-muted tabular-nums">{new Date(l.created_at).toLocaleString("sv-SE", { dateStyle: "short", timeStyle: "short" })}</span>
              <span className={`rounded px-1.5 text-xs ${l.applied ? "bg-primary-soft text-primary" : "bg-sand text-muted"}`}>{actionLabel[l.action] ?? l.action}{l.applied ? "" : " (förslag)"}</span>
              <span className="font-medium">{l.name}</span>
              <span className="text-muted">{l.reason}</span>
              <span className="text-xs text-muted">{l.source}</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
