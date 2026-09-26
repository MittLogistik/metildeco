import { unsubscribeFromCart } from "@/lib/abandoned";

const page = (title: string, body: string) => `<!doctype html><html lang="sv"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>${title}</title></head>
<body style="margin:0;background:#f7f5f0;font-family:Helvetica,Arial,sans-serif;color:#222"><div style="max-width:520px;margin:0 auto;padding:48px 20px"><p style="font-size:22px;font-weight:600">Metilde</p><div style="background:#fff;border-radius:16px;padding:28px"><h1 style="font-size:22px;margin:0 0 8px">${title}</h1><p style="margin:0;color:#555">${body}</p></div></div></body></html>`;

/** Avregistrering från påminnelser om övergiven korg. Länken i mejlet bär en signatur, inget konto krävs. */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const c = url.searchParams.get("c") ?? "";
  const t = url.searchParams.get("t") ?? "";
  const ok = /^[0-9a-f-]{36}$/i.test(c) && (await unsubscribeFromCart(c, t).catch(() => false));
  const html = ok
    ? page("Du får inga fler påminnelser", "Vi skickar inga fler mejl om din varukorg till den här adressen. Orderbekräftelser och leveransbesked påverkas inte.")
    : page("Länken fungerar inte", "Länken är ogiltig eller har redan använts. Mejla support@metilde.com så hjälper vi dig.");
  return new Response(html, { status: ok ? 200 : 400, headers: { "content-type": "text/html; charset=utf-8" } });
}
