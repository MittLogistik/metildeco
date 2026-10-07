"use client";

import { useState } from "react";
import type { LegalBlock } from "@/content/legal";
import { ActionForm, SubmitButton } from "../../_components/ActionForm";
import { resetPageAction, savePageAction } from "../actions";

type Draft = {
  title: string;
  intro: string;
  updated: string;
  metaTitle: string;
  metaDescription: string;
  blocks: LegalBlock[];
};

/** Block i editorn: samma typer som på sajten, men listor och tabeller som redigerbar text. */
type EditBlock = { id: number; type: LegalBlock["type"]; text: string };

const typeLabel: Record<LegalBlock["type"], string> = {
  h2: "Rubrik",
  h3: "Underrubrik",
  p: "Stycke",
  ul: "Punktlista",
  table: "Tabell",
  shippingTable: "Frakttabell (automatisk)",
  companyInfo: "Företagsuppgifter (automatiska)",
};

const addable: LegalBlock["type"][] = ["h2", "h3", "p", "ul", "table", "shippingTable", "companyInfo"];

let nextId = 1;
const toEdit = (b: LegalBlock): EditBlock => {
  const id = nextId++;
  switch (b.type) {
    case "h2":
    case "h3":
    case "p":
      return { id, type: b.type, text: b.text };
    case "ul":
      return { id, type: "ul", text: b.items.join("\n") };
    case "table":
      return { id, type: "table", text: [b.head, ...b.rows].map((r) => r.join(" | ")).join("\n") };
    default:
      return { id, type: b.type, text: "" };
  }
};

const fromEdit = (b: EditBlock): LegalBlock => {
  const lines = b.text.split("\n").map((l) => l.trim()).filter(Boolean);
  switch (b.type) {
    case "h2":
    case "h3":
    case "p":
      return { type: b.type, text: b.text.trim() };
    case "ul":
      return { type: "ul", items: lines };
    case "table": {
      const [head = [], ...rows] = lines.map((l) => l.split("|").map((c) => c.trim()));
      return { type: "table", head, rows };
    }
    default:
      return { type: b.type } as LegalBlock;
  }
};

const inputCls = "h-10 w-full rounded-xl border border-line bg-white px-3 text-sm focus:border-primary focus:outline-none";
const areaCls = "w-full rounded-xl border border-line bg-white p-3 text-sm leading-relaxed focus:border-primary focus:outline-none";
const smallBtn = "inline-flex h-8 items-center rounded-full border border-line bg-white px-3 text-xs font-medium hover:bg-sand disabled:opacity-40";

function TextField({ label, value, onChange, hint, rows }: { label: string; value: string; onChange: (v: string) => void; hint?: string; rows?: number }) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-medium">{label}</span>
      {rows ? <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={rows} className={areaCls} /> : <input value={value} onChange={(e) => onChange(e.target.value)} className={inputCls} />}
      {hint ? <span className="mt-1 block text-xs text-muted">{hint}</span> : null}
    </label>
  );
}

export function PageEditor({
  slug,
  initial,
  edited,
  placeholders,
}: {
  slug: string;
  initial: Draft;
  edited: boolean;
  placeholders: { key: string; label: string; value: string }[];
}) {
  const [title, setTitle] = useState(initial.title);
  const [intro, setIntro] = useState(initial.intro);
  const [updated, setUpdated] = useState(initial.updated);
  const [metaTitle, setMetaTitle] = useState(initial.metaTitle);
  const [metaDescription, setMetaDescription] = useState(initial.metaDescription);
  const [blocks, setBlocks] = useState<EditBlock[]>(() => initial.blocks.map(toEdit));
  const [addType, setAddType] = useState<LegalBlock["type"]>("p");

  const setText = (id: number, text: string) => setBlocks((bs) => bs.map((b) => (b.id === id ? { ...b, text } : b)));
  const move = (i: number, d: -1 | 1) =>
    setBlocks((bs) => {
      const j = i + d;
      if (j < 0 || j >= bs.length) return bs;
      const copy = [...bs];
      [copy[i], copy[j]] = [copy[j]!, copy[i]!];
      return copy;
    });
  const remove = (id: number) => setBlocks((bs) => bs.filter((b) => b.id !== id));
  const insertAfter = (i: number, type: LegalBlock["type"]) =>
    setBlocks((bs) => [...bs.slice(0, i + 1), { id: nextId++, type, text: "" }, ...bs.slice(i + 1)]);

  const payload = JSON.stringify({ title, intro, updated, metaTitle, metaDescription, blocks: blocks.map(fromEdit) });
  const today = new Date().toLocaleDateString("sv-SE", { day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
      <div className="space-y-6">
        <section className="space-y-4 rounded-card border border-line bg-white p-5">
          <TextField label="Rubrik" value={title} onChange={setTitle} />
          <TextField label="Ingress" value={intro} onChange={setIntro} rows={3} hint="Texten under rubriken." />
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <TextField label="Datumrad" value={updated} onChange={setUpdated} />
            </div>
            <button type="button" className={`${smallBtn} mb-1 h-10`} onClick={() => setUpdated(`Senast uppdaterad: ${today}`)}>
              Sätt dagens datum
            </button>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-lg font-medium">Innehåll</h2>
          {blocks.map((b, i) => (
            <div key={b.id} className="rounded-card border border-line bg-white p-4">
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <span className="rounded-full bg-sand px-2.5 py-0.5 text-xs font-semibold text-muted">{typeLabel[b.type]}</span>
                <div className="flex flex-wrap gap-1">
                  <button type="button" className={smallBtn} onClick={() => move(i, -1)} disabled={i === 0} aria-label="Flytta upp">
                    ↑
                  </button>
                  <button type="button" className={smallBtn} onClick={() => move(i, 1)} disabled={i === blocks.length - 1} aria-label="Flytta ned">
                    ↓
                  </button>
                  <button type="button" className={smallBtn} onClick={() => insertAfter(i, "p")}>
                    + Stycke under
                  </button>
                  <button type="button" className={`${smallBtn} text-danger`} onClick={() => remove(b.id)}>
                    Ta bort
                  </button>
                </div>
              </div>
              {b.type === "h2" || b.type === "h3" ? (
                <input value={b.text} onChange={(e) => setText(b.id, e.target.value)} className={`${inputCls} ${b.type === "h2" ? "font-display text-base font-medium" : "font-medium"}`} />
              ) : b.type === "p" ? (
                <textarea value={b.text} onChange={(e) => setText(b.id, e.target.value)} rows={Math.max(3, Math.ceil(b.text.length / 90))} className={areaCls} />
              ) : b.type === "ul" ? (
                <>
                  <textarea value={b.text} onChange={(e) => setText(b.id, e.target.value)} rows={Math.max(3, b.text.split("\n").length + 1)} className={areaCls} />
                  <p className="mt-1 text-xs text-muted">En punkt per rad.</p>
                </>
              ) : b.type === "table" ? (
                <>
                  <textarea value={b.text} onChange={(e) => setText(b.id, e.target.value)} rows={Math.max(3, b.text.split("\n").length + 1)} className={`${areaCls} font-mono text-xs`} />
                  <p className="mt-1 text-xs text-muted">Första raden är kolumnrubriker. En rad per tabellrad, celler skiljs med |.</p>
                </>
              ) : (
                <p className="text-sm text-muted">
                  {b.type === "shippingTable" ? "Fraktpriserna hämtas från fraktinställningarna, samma som i kassan." : "Säljarens namn, nummer, adress, e-post och telefon hämtas från företagsuppgifterna."} Innehållet redigeras inte här.
                </p>
              )}
            </div>
          ))}
          <div className="flex flex-wrap items-center gap-2 rounded-card border border-dashed border-line p-4">
            <select value={addType} onChange={(e) => setAddType(e.target.value as LegalBlock["type"])} className={`${inputCls} w-auto`}>
              {addable.map((t) => (
                <option key={t} value={t}>
                  {typeLabel[t]}
                </option>
              ))}
            </select>
            <button type="button" className={`${smallBtn} h-10`} onClick={() => insertAfter(blocks.length - 1, addType)}>
              Lägg till sist
            </button>
          </div>
        </section>

        <section className="space-y-4 rounded-card border border-line bg-white p-5">
          <h2 className="font-display text-lg font-medium">Sökmotorer</h2>
          <TextField label="Titel i Google" value={metaTitle} onChange={setMetaTitle} hint={`${metaTitle.length} tecken – helst under 60.`} />
          <TextField label="Beskrivning i Google" value={metaDescription} onChange={setMetaDescription} rows={2} hint={`${metaDescription.length} tecken – helst under 160.`} />
        </section>
      </div>

      <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
        <ActionForm action={savePageAction} className="rounded-card border border-line bg-white p-5">
          <input type="hidden" name="slug" value={slug} />
          <input type="hidden" name="page" value={payload} />
          <SubmitButton>Spara och publicera</SubmitButton>
          <p className="mt-3 text-xs text-muted">Ändringen syns på sajten direkt efter att du sparat.</p>
        </ActionForm>
        {edited ? (
          <ActionForm action={resetPageAction} confirm="Ta bort dina ändringar och visa standardtexten igen?" className="rounded-card border border-line bg-white p-5">
            <input type="hidden" name="slug" value={slug} />
            <SubmitButton variant="outline">Återställ standardtext</SubmitButton>
          </ActionForm>
        ) : null}
        <div className="rounded-card border border-line bg-white p-5 text-sm">
          <h2 className="font-medium">Platshållare</h2>
          <p className="mt-1 text-xs text-muted">Skriv dem i texten, så fylls aktuella uppgifter i automatiskt.</p>
          <ul className="mt-3 space-y-2">
            {placeholders.map((p) => (
              <li key={p.key}>
                <code className="rounded bg-sand px-1.5 py-0.5 text-xs">{`{${p.key}}`}</code>
                <span className="block text-xs text-muted">
                  {p.label}: {p.value}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
}
