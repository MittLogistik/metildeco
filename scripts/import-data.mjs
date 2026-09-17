// Importerar butiksdatan i data/*.json till Supabase (upsert på primärnyckel).
// Ordning: locales → products → product_prices → bundles → bundle_components → bundle_prices
//          → articles → shipping_zones → shipping_rates.
// Användning: node --env-file=.env.local scripts/import-data.mjs
import { readFileSync } from "node:fs";
import { join } from "node:path";
import pg from "pg";

const url = process.env.SUPABASE_DB_URL;
const m = url?.match(/^postgres(?:ql)?:\/\/([^:]+):(.*)@([^@:/]+):(\d+)\/(.+)$/);
if (!m) {
  console.error("SUPABASE_DB_URL saknas eller har fel format.");
  process.exit(1);
}
const [, user, password, host, port, database] = m;
const client = new pg.Client({ user, password: decodeURIComponent(password), host, port: Number(port), database, ssl: { rejectUnauthorized: false } });
await client.connect();

const load = (name) => JSON.parse(readFileSync(join(process.cwd(), "data", `${name}.json`), "utf8"));

/** Kolumner som finns i tabellen just nu – så att exportfält som saknas hoppas över. */
const columnsOf = async (table) =>
  new Map(
    (await client.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = $1", [table])).rows.map(
      (r) => [r.column_name, r.data_type],
    ),
  );

const isJson = (type) => type === "json" || type === "jsonb";

async function upsert(table, rows, keyCols, { skip = [] } = {}) {
  if (rows.length === 0) return 0;
  const cols = await columnsOf(table);
  const fields = Object.keys(rows[0]).filter((f) => cols.has(f) && !skip.includes(f));
  const missing = Object.keys(rows[0]).filter((f) => !cols.has(f));
  if (missing.length) console.log(`   (${table}: hoppar över fält som saknas i tabellen: ${missing.join(", ")})`);
  const updates = fields.filter((f) => !keyCols.includes(f)).map((f) => `${f} = EXCLUDED.${f}`);
  let n = 0;
  for (const row of rows) {
    const values = fields.map((f) => (isJson(cols.get(f)) && row[f] !== null ? JSON.stringify(row[f]) : row[f]));
    const params = fields.map((_, i) => `$${i + 1}`).join(", ");
    await client.query(
      `INSERT INTO public.${table} (${fields.join(", ")}) VALUES (${params}) ON CONFLICT (${keyCols.join(", ")}) DO UPDATE SET ${updates.join(", ")}`,
      values,
    );
    n++;
  }
  return n;
}

const steps = [
  ["locales", () => load("locales"), ["code"]],
  ["products", () => load("products"), ["slug"]],
  ["product_prices", () => load("product_prices"), ["id"]],
  ["bundles", () => load("bundles"), ["slug"]],
  ["bundle_components", () => load("bundle_components"), ["id"]],
  ["bundle_prices", () => load("bundle_prices"), ["id"]],
  ["articles", () => load("articles"), ["id"]],
  ["shipping_zones", () => load("shipping_zones"), ["id"], "DELETE FROM public.shipping_rates; DELETE FROM public.shipping_zones"],
  ["shipping_rates", () => load("shipping_rates"), ["id"]],
];

try {
  await client.query("BEGIN");
  for (const [table, rows, keys, before] of steps) {
    // Fraktzoner/priser från migrationernas startdata ersätts helt av exportens rader.
    if (before) await client.query(before);
    const n = await upsert(table, rows(), keys);
    console.log(`✓ ${table}: ${n} rader`);
  }
  await client.query("COMMIT");
} catch (e) {
  await client.query("ROLLBACK");
  console.error("FEL:", e.message);
  process.exit(1);
} finally {
  await client.end();
}
