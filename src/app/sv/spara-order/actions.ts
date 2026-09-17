"use server";

import { supabaseAdmin, supabaseConfigured } from "@/lib/supabase";

export type TrackedOrder = {
  orderNumber: string;
  status: string;
  createdAt: string;
  shippingMethod: string | null;
  trackingNumber: string | null;
  trackingUrl: string | null;
  items: { name: string; qty: number; lineTotal: number }[];
  total: number;
  shipping: number;
  address: string;
};

export type TrackResult = { ok: true; order: TrackedOrder } | { ok: false; error: string };

/** Slår upp en order på ordernummer + e-post. Båda måste stämma. */
export async function trackOrder(formData: FormData): Promise<TrackResult> {
  const orderNumber = String(formData.get("orderNumber") ?? "").trim().toUpperCase();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!/^M[OSE]-\d{4,}$/.test(orderNumber)) return { ok: false, error: "Ordernumret ser ut som MO-0001. Du hittar det i orderbekräftelsen." };
  if (!email.includes("@")) return { ok: false, error: "Ange en giltig e-postadress." };
  if (!supabaseConfigured()) return { ok: false, error: "Orderspårning är inte tillgänglig just nu." };

  const db = supabaseAdmin();
  const { data: o } = await db.from("orders").select("*").eq("order_number", orderNumber).maybeSingle();
  if (!o || String(o.email ?? "").toLowerCase() !== email) {
    return { ok: false, error: "Vi hittar ingen order med den kombinationen. Kontrollera ordernumret och e-postadressen." };
  }
  const { data: items } = await db.from("order_items").select("name,qty,line_total").eq("order_id", o.id);
  return {
    ok: true,
    order: {
      orderNumber: o.order_number,
      status: o.status,
      createdAt: o.created_at,
      shippingMethod: o.shipping_method,
      trackingNumber: o.tracking_number,
      trackingUrl: o.tracking_url,
      items: (items ?? []).map((i) => ({ name: i.name, qty: i.qty, lineTotal: Number(i.line_total) })),
      total: Number(o.total),
      shipping: Number(o.shipping),
      address: [o.shipping_name, o.shipping_address, `${o.shipping_postal_code ?? ""} ${o.shipping_city ?? ""}`.trim()].filter(Boolean).join(", "),
    },
  };
}
