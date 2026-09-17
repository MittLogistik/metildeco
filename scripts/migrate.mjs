// Kör SQL-migrationerna i supabase/migrations i filnamnsordning mot databasen.
// Redan körda filer hoppas över (bokförs i tabellen public._migrations).
// Kräver SUPABASE_DB_URL i .env.local (Session pooler-strängen från Supabase → Connect).
// Användning: node --env-file=.env.local scripts/migrate.mjs
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import pg from "pg";

const url = process.env.SUPABASE_DB_URL;
if (!url || url.includes("[YOUR-PASSWORD]")) {
  console.error("SUPABASE_DB_URL saknas eller innehåller platshållaren [YOUR-PASSWORD].");
  process.exit(1);
}

const dir = join(process.cwd(), "supabase", "migrations");
const files = readdirSync(dir).filter((f) => f.endsWith(".sql")).sort();

const client = new pg.Client({ connectionString: url, ssl: { rejectUnauthorized: false } });
await client.connect();
await client.query(
  "CREATE TABLE IF NOT EXISTS public._migrations (name text PRIMARY KEY, applied_at timestamptz NOT NULL DEFAULT now())",
);
const done = new Set((await client.query("SELECT name FROM public._migrations")).rows.map((r) => r.name));

let applied = 0;
for (const file of files) {
  if (done.has(file)) continue;
  const sql = readFileSync(join(dir, file), "utf8");
  process.stdout.write(`→ ${file} … `);
  try {
    await client.query("BEGIN");
    await client.query(sql);
    await client.query("INSERT INTO public._migrations (name) VALUES ($1)", [file]);
    await client.query("COMMIT");
    console.log("ok");
    applied++;
  } catch (e) {
    await client.query("ROLLBACK");
    console.log("FEL");
    console.error(e.message);
    await client.end();
    process.exit(1);
  }
}
console.log(`Klart. ${applied} nya migrationer körda, ${done.size} var redan gjorda.`);
await client.end();
