import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { getCatalog } from "@/lib/catalog";
import { experimentReport, getExperimentSettings } from "@/lib/experiments";
import { formatPrice } from "@/lib/format";
import { site } from "@/lib/site";
import { ActionForm, SubmitButton } from "../../_components/ActionForm";
import { Card, Field, Input, Select } from "../../_components/fields";
import { saveExperimentAction } from "./actions";

const pct = (n: number) => `${n.toFixed(1).replace(".", ",")} %`;

export default async function AbTestPage({ searchParams }: PageProps<"/admin/annonser/abtest">) {
  await requireAdmin();
  const sp = await searchParams;
  const days = Math.min(365, Math.max(1, Number(sp.dagar ?? 30) || 30));
  const [settings, report, catalog] = await Promise.all([getExperimentSettings(), experimentReport(days), getCatalog()]);
  const withOffer = catalog.allProducts.filter((p) => p.offerEnabled);
  const [a, b] = report.variants;
  const rows: { label: string; a: string; b: string; hint?: string }[] = [
    { label: "Visningar av köprutan", a: String(a!.views), b: String(b!.views) },
    { label: "Unika besökare", a: String(a!.visitors), b: String(b!.visitors), hint: "per dag och IP" },
    { label: "Lagt i varukorgen", a: String(a!.addToCart), b: String(b!.addToCart) },
    { label: "Gått till betalning", a: String(a!.beginCheckout), b: String(b!.beginCheckout) },
    { label: "Ordrar", a: String(a!.orders), b: String(b!.orders) },
    { label: "Konvertering", a: pct(a!.conversion), b: pct(b!.conversion), hint: "ordrar per unik besökare" },
    { label: "Omsättning", a: formatPrice(Math.round(a!.revenue)), b: formatPrice(Math.round(b!.revenue)) },
    { label: "Snittorder", a: a!.orders ? formatPrice(Math.round(a!.averageOrder)) : "–", b: b!.orders ? formatPrice(Math.round(b!.averageOrder)) : "–" },
    { label: "Andel prenumerationer", a: pct(a!.subscriptionShare), b: pct(b!.subscriptionShare) },
  ];

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/annonser" className="text-sm text-muted hover:underline">
          ← Annonser
        </Link>
        <h1 className="mt-2 font-display text-3xl font-medium">A/B-test: köprutan</h1>
        <p className="mt-1 text-sm text-muted">
          A = nuvarande köpruta (engångsköp eller prenumeration, antal). B = erbjudandet: prenumerera på 1, prenumerera på flerpack med gåva, eller köp en gång. Varje
          webbläsare lottas en gång och ser samma variant tills testet stängs. Ordern får varianten stämplad på sig.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <Card title={`Utfall senaste ${days} dagarna`}>
          <div className="mb-3 flex gap-2 text-xs">
            {[7, 14, 30, 90].map((d) => (
              <Link key={d} href={`/admin/annonser/abtest?dagar=${d}`} className={`rounded-full px-3 py-1 ${d === days ? "bg-foreground text-white" : "border border-line hover:bg-sand"}`}>
                {d} dagar
              </Link>
            ))}
          </div>
          <table className="w-full text-sm">
            <thead className="text-left text-xs uppercase tracking-wider text-muted">
              <tr>
                <th className="py-2 pr-3">Mått</th>
                <th className="py-2 pr-3 text-right">A · nuvarande</th>
                <th className="py-2 text-right">B · erbjudandet</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.label} className="border-t border-line">
                  <td className="py-2 pr-3">
                    {r.label}
                    {r.hint ? <span className="block text-xs text-muted">{r.hint}</span> : null}
                  </td>
                  <td className="py-2 pr-3 text-right tabular-nums">{r.a}</td>
                  <td className="py-2 text-right tabular-nums font-medium">{r.b}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-3 text-xs text-muted">
            Vänta med slutsatser tills båda varianterna har åtminstone ett hundratal unika besökare och ett tiotal ordrar. Skillnader under det är brus. Testordrar (sandbox)
            räknas inte.
          </p>
        </Card>

        <div className="space-y-6">
          <Card title="Läge">
            <ActionForm action={saveExperimentAction} className="space-y-4">
              <Field label="Vad ser kunderna?">
                <Select
                  name="mode"
                  defaultValue={settings.mode}
                  options={[
                    { value: "off", label: "Av: alla ser nuvarande köpruta (A)" },
                    { value: "ab", label: "Test: lotta mellan A och B" },
                    { value: "on", label: "På: alla ser erbjudandet (B)" },
                  ]}
                />
              </Field>
              <Field label="Andel som ser B i testläget (%)">
                <Input name="split" type="number" defaultValue={settings.split} />
              </Field>
              <SubmitButton>Spara</SubmitButton>
            </ActionForm>
            <p className="mt-3 text-xs text-muted">
              Titta själv: lägg till <code className="rounded bg-sand px-1">?ab=b</code> eller <code className="rounded bg-sand px-1">?ab=a</code> efter en produktadress, t.ex.{" "}
              <a href={`${site.url}/sv/produkt/${withOffer[0]?.slug ?? "tongkat-ali-elite"}?ab=b`} target="_blank" rel="noopener" className="underline">
                {withOffer[0]?.name.replace(/ \|.*$/, "") ?? "en produkt"} som B
              </a>
              . Valet sparas i webbläsaren, byt tillbaka med ?ab=a.
            </p>
          </Card>

          <Card title={`Produkter med erbjudande (${withOffer.length})`}>
            {withOffer.length === 0 ? (
              <p className="text-sm text-muted">Ingen produkt har erbjudandet påslaget ännu. Slå på det under Produkter → produkten → Erbjudande.</p>
            ) : (
              <ul className="space-y-1 text-sm">
                {withOffer.map((p) => {
                  const gifts = p.offerGiftChoices.length ? p.offerGiftChoices : p.offerGiftSlug ? [p.offerGiftSlug] : [];
                  const giftNames = gifts.map((g) => catalog.allProducts.find((x) => x.slug === g)?.name.replace(/ \|.*$/, "") ?? `${g} (finns inte)`);
                  return (
                    <li key={p.slug}>
                      <Link href={`/admin/produkter/${p.slug}`} className="font-medium hover:underline">
                        {p.name.replace(/ \|.*$/, "")}
                      </Link>
                      <span className="block text-xs text-muted">
                        {p.offerPackQty}-pack · gåva: {giftNames.join(", ") || "ingen"}
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
            <p className="mt-3 text-xs text-muted">Produkter utan erbjudande visar alltid den nuvarande köprutan, även för B-besökare.</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
