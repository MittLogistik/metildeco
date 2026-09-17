// Kollar Marketing API-kopplingen och listar kampanjer/resultat.
// Användning: node scripts/meta-ads.mjs status | campaigns | insights [dagar] | pages
import fs from "node:fs";

const env = Object.fromEntries(
  fs
    .readFileSync(".env.local", "utf8")
    .split(/\r?\n/)
    .filter((l) => l.includes("=") && !l.startsWith("#"))
    .map((l) => [l.slice(0, l.indexOf("=")).trim(), l.slice(l.indexOf("=") + 1).trim()]),
);
const token = env.META_ADS_TOKEN;
const act = `act_${env.META_AD_ACCOUNT_ID}`;
if (!token) {
  console.error("META_ADS_TOKEN saknas i .env.local");
  process.exit(1);
}

const get = async (path, params = {}) => {
  const url = new URL(`https://graph.facebook.com/v21.0/${path}`);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  url.searchParams.set("access_token", token);
  const res = await fetch(url);
  const data = await res.json();
  if (!res.ok) throw new Error((data.error?.message ?? res.status).replace(token, "<token>"));
  return data;
};

const [cmd = "status", arg] = process.argv.slice(2);
const kr = (v) => `${Number(v ?? 0).toFixed(0)} kr`;

if (cmd === "status") {
  const d = (await get("debug_token", { input_token: token })).data;
  console.log("Token:", d.type, d.is_valid ? "giltig" : "OGILTIG", d.expires_at ? `går ut ${new Date(d.expires_at * 1000).toISOString()}` : "går aldrig ut");
  console.log("Rättigheter:", (d.scopes ?? []).join(", "));
  const need = ["ads_management", "ads_read"].filter((s) => !d.scopes?.includes(s));
  if (need.length) console.log("SAKNAS:", need.join(", "));
  const a = await get(act, { fields: "name,currency,account_status,timezone_name,amount_spent" });
  console.log("Annonskonto:", a.name, a.currency, "status", a.account_status, "tidszon", a.timezone_name, "spenderat totalt", kr(a.amount_spent / 100));
} else if (cmd === "campaigns") {
  const r = await get(`${act}/campaigns`, { fields: "name,status,effective_status,objective,daily_budget,created_time", limit: 100 });
  if (!r.data.length) console.log("Inga kampanjer.");
  for (const c of r.data) console.log(`${c.id}  ${c.effective_status.padEnd(10)}  ${c.objective.padEnd(16)}  ${c.daily_budget ? kr(c.daily_budget / 100) + "/dag" : "budget på annonsgrupp"}  ${c.name}`);
} else if (cmd === "insights") {
  const days = Number(arg ?? 7);
  const r = await get(`${act}/insights`, { level: "ad", date_preset: days <= 7 ? "last_7d" : days <= 14 ? "last_14d" : "last_30d", fields: "campaign_name,ad_name,impressions,clicks,spend,ctr,actions,action_values", limit: 500 });
  if (!r.data.length) console.log("Inga resultat senaste", days, "dagarna.");
  for (const i of r.data) {
    const n = (list, t) => Number(list?.find((a) => a.action_type === t)?.value ?? 0);
    const spend = Number(i.spend), buys = n(i.actions, "purchase") || n(i.actions, "omni_purchase"), rev = n(i.action_values, "purchase") || n(i.action_values, "omni_purchase");
    console.log(`${i.campaign_name} › ${i.ad_name}: ${i.impressions} visn, ${i.clicks} klick (CTR ${Number(i.ctr).toFixed(2)} %), ${kr(spend)}, ${buys} köp, ROAS ${spend ? (rev / spend).toFixed(2) : "–"}`);
  }
} else if (cmd === "pages") {
  const r = await get("me/accounts", { fields: "id,name,instagram_business_account", limit: 50 });
  if (!r.data.length) console.log("Systemanvändaren har inte tilldelats någon sida ännu.");
  for (const p of r.data) console.log(`${p.id}  ${p.name}${p.instagram_business_account ? `  (Instagram ${p.instagram_business_account.id})` : ""}`);
} else {
  console.log("Okänt kommando. Använd: status | campaigns | insights [dagar] | pages");
}
