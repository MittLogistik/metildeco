import { createHash } from "node:crypto";
import { supabaseAdmin, supabaseConfigured } from "@/lib/supabase";

/**
 * Enkel, cookiefri statistik. Sidvisningar räknas per dag; en IP-adress räknas
 * som högst en besökare per dygn via en daglig hash (IP:n sparas aldrig).
 * Händelser: page_view, add_to_cart, begin_checkout.
 */
const EVENTS = new Set(["page_view", "add_to_cart", "begin_checkout"]);

const dailyHash = (ip: string) => {
  const day = new Date().toISOString().slice(0, 10);
  const salt = process.env.TRACK_SALT ?? process.env.SUPABASE_SECRET_KEY ?? "metilde";
  return createHash("sha256").update(`${salt}:${day}:${ip}`).digest("hex").slice(0, 32);
};

export async function POST(request: Request) {
  if (!supabaseConfigured()) return new Response(null, { status: 204 });
  let event = "";
  try {
    const body = (await request.json()) as { event?: unknown };
    event = String(body.event ?? "");
  } catch {
    return new Response(null, { status: 204 });
  }
  if (!EVENTS.has(event)) return new Response(null, { status: 204 });

  // Bots räknas inte
  const ua = request.headers.get("user-agent") ?? "";
  if (/bot|crawl|spider|slurp|headless|lighthouse|preview/i.test(ua)) return new Response(null, { status: 204 });

  const country = request.headers.get("x-vercel-ip-country") ?? "SE";
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? request.headers.get("x-real-ip") ?? "0";
  const db = supabaseAdmin();
  try {
    if (event === "page_view") {
      await db.rpc("track_unique_visitor", { _country: country, _visitor_hash: dailyHash(ip) });
      await db.rpc("track_page_view", { _country: country, _locale: "sv" });
    } else {
      await db.rpc("track_cart_event", { _event: event, _locale: "sv", _country: country });
    }
  } catch (e) {
    console.error("[track]", e instanceof Error ? e.message : e);
  }
  return new Response(null, { status: 204 });
}
