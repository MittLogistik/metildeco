import "server-only";
import { formatPrice } from "./format";
import { routes, routesOf } from "./routes";
import { emailText } from "./email-text";
import { isLocale, markets, type Locale } from "./i18n";
import { company, site } from "./site";
import type { OrderItemRecord, OrderRecord } from "./orders";

const from = () => process.env.RESEND_FROM ?? `Metilde <${company.email}>`;

export const emailConfigured = () => {
  const key = process.env.RESEND_API_KEY;
  return Boolean(key && key.startsWith("re_") && !key.endsWith("..."));
};

/** Skickar e-post via Resend. Saknas nyckel loggas mejlet bara. */
export async function sendEmail(to: string, subject: string, html: string, text: string, opts: { replyTo?: string } = {}) {
  if (!emailConfigured()) {
    console.log(`[email] (ej skickat – RESEND_API_KEY saknas) till ${to}: ${subject}`);
    return;
  }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: from(), to: [to], reply_to: opts.replyTo ?? company.email, subject, html, text }),
  });
  if (!res.ok) throw new Error(`Resend svarade ${res.status}: ${await res.text()}`);
}

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Orderbekräftelse på orderns språk (orders.locale), belopp i orderns valuta. */
export async function sendOrderConfirmation(order: OrderRecord, items: OrderItemRecord[]) {
  if (!order.email) return;
  const locale: Locale = isLocale(order.locale) ? order.locale : "sv";
  const t = emailText[locale];
  const money = (n: number) => formatPrice(n, order.currency);
  const isRenewal = order.kind === "renewal";
  const deliverAt = order.deliver_at ? new Date(order.deliver_at).toLocaleDateString(markets[locale].intl, { day: "numeric", month: "long" }) : null;
  const subject = isRenewal ? t.subjectRenewal(order.order_number) : t.subjectOrder(order.order_number);
  const renewalIntro = deliverAt ? t.renewalWithDate(deliverAt) : t.renewalNoDate;
  const heading = isRenewal ? t.headingRenewal : t.headingOrder;

  const rowsHtml = items
    .map(
      (i) =>
        `<tr><td style="padding:8px 0;border-bottom:1px solid #eee">${i.qty} × ${esc(i.name)}${i.plan.startsWith("sub") ? ` <span style="color:#666">(${t.subscription})</span>` : i.plan === "gift" ? ` <span style="color:#2a7a4b">(${t.gift})</span>` : ""}</td><td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right;white-space:nowrap">${money(i.plan === "gift" ? 0 : i.line_total)}</td></tr>`,
    )
    .join("");
  const rowsText = items.map((i) => `${i.qty} × ${i.name} – ${money(i.line_total)}`).join("\n");

  const address = [order.shipping_name, order.shipping_address, `${order.shipping_postal_code ?? ""} ${order.shipping_city ?? ""}`.trim()]
    .filter(Boolean)
    .join("<br>");
  const returnsLink = `<a href="${site.url}${routesOf(locale).returns}" style="color:#2f5445">${t.returnsLinkText}</a>`;

  const html = `<!doctype html><html lang="${locale}"><body style="margin:0;background:#f7f5f0;font-family:Helvetica,Arial,sans-serif;color:#222">
<div style="max-width:560px;margin:0 auto;padding:32px 20px">
  <p style="font-size:22px;font-weight:600;margin:0 0 24px">Metilde</p>
  <div style="background:#fff;border-radius:16px;padding:28px">
    <h1 style="font-size:22px;margin:0 0 8px">${heading}</h1>
    <p style="margin:0 0 20px;color:#555">${t.orderNumber} <strong style="color:#222">${order.order_number}</strong>. ${isRenewal ? renewalIntro : t.received}</p>
    <table style="width:100%;border-collapse:collapse;font-size:15px">${rowsHtml}
      ${order.discount > 0 ? `<tr><td style="padding:8px 0;color:#2a7a4b">${t.discount}</td><td style="padding:8px 0;text-align:right;color:#2a7a4b">−${money(order.discount)}</td></tr>` : ""}
      <tr><td style="padding:8px 0;color:#555">${t.shipping}${order.shipping_method ? ` – ${esc(order.shipping_method)}` : ""}</td><td style="padding:8px 0;text-align:right">${order.shipping === 0 ? t.free : money(order.shipping)}</td></tr>
      <tr><td style="padding:12px 0;font-weight:600;border-top:2px solid #222">${t.total}</td><td style="padding:12px 0;text-align:right;font-weight:600;border-top:2px solid #222">${money(order.total)}</td></tr>
    </table>
    ${address ? `<p style="margin:20px 0 0;font-size:14px;color:#555"><strong style="color:#222">${t.deliverTo}</strong><br>${address}</p>` : ""}
    <p style="margin:20px 0 0;font-size:14px;color:#555">${t.afterOrder(returnsLink)}</p>
  </div>
  <p style="font-size:12px;color:#888;margin:24px 0 0;line-height:1.6">${company.legalName} · ${company.idLabel} ${company.orgNumber} · ${company.address}<br>
  ${t.questions(company.phone, hoursFor(locale))}</p>
</div></body></html>`;

  const text = `${heading}
${t.orderNumber} ${order.order_number}
${isRenewal ? renewalIntro + "\n" : ""}
${rowsText}
${t.shipping}: ${order.shipping === 0 ? t.free : money(order.shipping)}
${t.total}: ${money(order.total)}

${company.legalName} · ${company.idLabel} ${company.orgNumber} · ${company.address}
${t.questionsText(company.phone)}`;

  await sendEmail(order.email, subject, html, text);
}

/** Kundtjänstens öppettider på mejlets språk. */
const hoursFor = (locale: Locale) => ({ sv: company.hours, fi: "ma–pe 9.00–17.00 (Ruotsin aikaa)", da: "man.–fre. 9.00–17.00", nl: "ma–vr 9.00–17.00 (Zweedse tijd)" })[locale];

/** Presentkortsmejl – till köparen och, om angivet, mottagaren. */
export async function sendGiftCardEmail(
  to: string,
  code: string,
  amount: number,
  expires: Date,
  opts: { recipientCopy: boolean; fromName: string | null; message: string | null },
) {
  const subject = opts.recipientCopy ? `Du har fått ett presentkort på ${formatPrice(amount)} hos Metilde` : `Ditt presentkort på ${formatPrice(amount)}`;
  const intro = opts.recipientCopy
    ? `${opts.fromName ? esc(opts.fromName) : "Någon"} har skickat dig ett presentkort hos Metilde.`
    : "Tack för ditt köp! Här är ditt presentkort.";
  const validTo = expires.toLocaleDateString("sv-SE", { dateStyle: "long" });
  const html = `<!doctype html><html lang="sv"><body style="margin:0;background:#f7f5f0;font-family:Helvetica,Arial,sans-serif;color:#222">
<div style="max-width:560px;margin:0 auto;padding:32px 20px">
  <p style="font-size:22px;font-weight:600;margin:0 0 24px">Metilde</p>
  <div style="background:#fff;border-radius:16px;padding:28px">
    <h1 style="font-size:22px;margin:0 0 8px">Presentkort ${formatPrice(amount)}</h1>
    <p style="margin:0 0 20px;color:#555">${intro}</p>
    ${opts.message ? `<p style="margin:0 0 20px;padding:14px;background:#f7f5f0;border-radius:12px;font-style:italic">“${esc(opts.message)}”</p>` : ""}
    <p style="margin:0;font-size:13px;color:#555">Din kod</p>
    <p style="margin:4px 0 16px;font-size:26px;font-weight:700;letter-spacing:2px;font-family:monospace">${code}</p>
    <p style="margin:0;font-size:14px;color:#555">Skriv in koden i fältet <strong>Lägg till kod</strong> i betalsteget på <a href="${site.url}${routes.products}" style="color:#2f5445">metilde.com</a>. Gäller hela sortimentet, även prenumerationer, till och med ${validTo}. Presentkortet kan inte lösas in mot kontanter.</p>
  </div>
  <p style="font-size:12px;color:#888;margin:24px 0 0;line-height:1.6">${company.legalName} · ${company.idLabel} ${company.orgNumber} · ${company.address}<br>Frågor? Svara på det här mejlet.</p>
</div></body></html>`;
  const text = `${subject}\n\n${intro}\n${opts.message ? `\n"${opts.message}"\n` : ""}\nKod: ${code}\nSkriv in koden i betalsteget på metilde.com. Gäller till och med ${validTo}.\n\n${company.legalName} · ${company.address}`;
  await sendEmail(to, subject, html, text);
}

const frame = (title: string, body: string) => `<!doctype html><html lang="sv"><body style="margin:0;background:#f7f5f0;font-family:Helvetica,Arial,sans-serif;color:#222">
<div style="max-width:560px;margin:0 auto;padding:32px 20px">
  <p style="font-size:22px;font-weight:600;margin:0 0 24px">Metilde</p>
  <div style="background:#fff;border-radius:16px;padding:28px">
    <h1 style="font-size:22px;margin:0 0 8px">${title}</h1>
    ${body}
  </div>
  <p style="font-size:12px;color:#888;margin:24px 0 0;line-height:1.6">${company.legalName} · ${company.idLabel} ${company.orgNumber} · ${company.address}<br>
  Frågor? Svara på det här mejlet eller ring ${company.phone} (${company.hours}).</p>
</div></body></html>`;

/** Engångskod för inloggning på Mitt konto. */
export async function sendLoginCodeEmail(to: string, code: string) {
  const subject = `Din inloggningskod: ${code}`;
  const html = frame(
    "Din inloggningskod",
    `<p style="margin:0 0 20px;color:#555">Skriv in koden på metilde.com för att logga in på Mitt konto. Koden gäller en kort stund och kan bara användas en gång.</p>
    <p style="margin:0;font-size:13px;color:#555">Kod</p>
    <p style="margin:4px 0 16px;font-size:30px;font-weight:700;letter-spacing:6px;font-family:monospace">${esc(code)}</p>
    <p style="margin:0;font-size:14px;color:#555">Har du inte försökt logga in kan du bortse från det här mejlet. Ingen kommer åt ditt konto utan koden.</p>`,
  );
  const text = `Din inloggningskod: ${code}\n\nSkriv in koden på metilde.com för att logga in på Mitt konto. Har du inte försökt logga in kan du bortse från mejlet.`;
  await sendEmail(to, subject, html, text);
}

type CartEmailItem = { name: string; qty: number; plan: string; lineTotal: number };

/**
 * Påminnelse om övergiven korg, steg 1–4. Steg 1 är en ren påminnelse, från steg 2 följer
 * rabattkoden med och läggs på automatiskt via länken. Inga hälsopåståenden, inga påhittade
 * tidsgränser: koden gäller tills vidare och sägs inte vara något annat.
 */
export async function sendAbandonedCartEmail(o: { to: string; firstName: string | null; step: number; items: CartEmailItem[]; subtotal: number; recoveryUrl: string; unsubscribeUrl: string; code: string | null; percent: number }) {
  const hi = o.firstName ? `Hej ${esc(o.firstName)}!` : "Hej!";
  const first = o.items[0]?.name ?? "din varukorg";
  const copy: Record<number, { subject: string; title: string; intro: string; cta: string }> = {
    1: {
      subject: `Din varukorg väntar – ${first}`,
      title: "Du glömde något i varukorgen",
      intro: `${hi} Vi har sparat din varukorg så att du kan fortsätta där du slutade. Order före kl. 12 på vardagar skickas samma dag.`,
      cta: "Tillbaka till varukorgen",
    },
    2: {
      subject: `${o.percent} % på din varukorg – koden ${o.code ?? ""}`,
      title: `Ta ${o.percent} % på det som ligger i korgen`,
      intro: `${hi} Din varukorg finns kvar. Vill du slutföra köpet får du ${o.percent} % rabatt med koden nedan. Den läggs på automatiskt när du klickar på knappen.`,
      cta: `Slutför köpet med ${o.percent} % rabatt`,
    },
    3: {
      subject: `Fortfarande intresserad av ${first}?`,
      title: "Din varukorg finns kvar",
      intro: `${hi} Rabattkoden gäller fortfarande. Har du frågor om produkterna, doseringen eller leveransen svarar du bara på det här mejlet så hjälper vi dig.`,
      cta: `Till varukorgen med ${o.percent} % rabatt`,
    },
    4: {
      subject: `Sista påminnelsen om din varukorg`,
      title: "Vi skickar inga fler påminnelser",
      intro: `${hi} Det här är vårt sista mejl om varukorgen. Koden nedan fungerar om du vill slutföra köpet, annars hörs vi inte mer om den här korgen.`,
      cta: `Slutför köpet med ${o.percent} % rabatt`,
    },
  };
  const c = copy[o.step] ?? copy[1]!;
  const rows = o.items.map((i) => `<tr><td style="padding:8px 0;border-bottom:1px solid #eee">${i.qty} × ${esc(i.name)}${i.plan.startsWith("sub") ? ' <span style="color:#666">(prenumeration)</span>' : ""}</td><td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right;white-space:nowrap">${formatPrice(i.lineTotal)}</td></tr>`).join("");
  const codeHtml = o.code
    ? `<p style="margin:20px 0 0;font-size:13px;color:#555">Rabattkod (${o.percent} % på hela ordern)</p><p style="margin:4px 0 0;font-size:26px;font-weight:700;letter-spacing:3px;font-family:monospace">${esc(o.code)}</p>`
    : "";
  const html = frame(
    c.title,
    `<p style="margin:0 0 20px;color:#555">${c.intro}</p>
    <table style="width:100%;border-collapse:collapse;font-size:15px">${rows}
      <tr><td style="padding:12px 0;font-weight:600;border-top:2px solid #222">Summa</td><td style="padding:12px 0;text-align:right;font-weight:600;border-top:2px solid #222">${formatPrice(o.subtotal)}</td></tr>
    </table>
    ${codeHtml}
    <p style="margin:24px 0 0"><a href="${esc(o.recoveryUrl)}" style="display:inline-block;background:#2f5445;color:#fff;text-decoration:none;border-radius:999px;padding:14px 24px;font-weight:600">${esc(c.cta)}</a></p>
    <p style="margin:20px 0 0;font-size:13px;color:#888">Fri frakt över ${site.freeShippingOver} kr och 30 dagars ångerrätt på oöppnade produkter. Vill du inte ha fler påminnelser om varukorgen? <a href="${esc(o.unsubscribeUrl)}" style="color:#888">Avregistrera dig här</a>.</p>`,
  );
  const text = `${c.title}\n\n${c.intro.replace(/<[^>]+>/g, "")}\n\n${o.items.map((i) => `${i.qty} × ${i.name} – ${formatPrice(i.lineTotal)}`).join("\n")}\nSumma: ${formatPrice(o.subtotal)}\n${o.code ? `\nRabattkod: ${o.code} (${o.percent} %)\n` : ""}\n${c.cta}: ${o.recoveryUrl}\n\nInga fler påminnelser: ${o.unsubscribeUrl}`;
  await sendEmail(o.to, c.subject, html, text);
}

/** Leveransbesked med spårningslänk när Plocky bokat frakten (på orderns språk). */
export async function sendShippingConfirmation(order: OrderRecord, tracking: { number: string | null; url: string | null; carrier: string | null }) {
  if (!order.email) return;
  const locale: Locale = isLocale(order.locale) ? order.locale : "sv";
  const t = emailText[locale];
  const carrierName: Record<string, string> = { postnord: "PostNord", dhl: "DHL", bring: "Bring", gls: "GLS" };
  const carrier = tracking.carrier ? (carrierName[tracking.carrier] ?? tracking.carrier) : null;
  const subject = t.shippedSubject(order.order_number);
  const trackHtml = tracking.url
    ? `<p style="margin:16px 0 0"><a href="${esc(tracking.url)}" style="display:inline-block;background:#2f5445;color:#fff;text-decoration:none;border-radius:999px;padding:12px 22px;font-weight:600">${t.track}</a></p>`
    : "";
  const body = `<p style="margin:0 0 12px;color:#555">${esc(t.shippedBody(order.order_number, carrier))}${
      tracking.number ? ` ${t.parcelId}: <strong style="color:#222">${esc(tracking.number)}</strong>.` : ""
    }</p>
    ${trackHtml}
    <p style="margin:20px 0 0;font-size:14px;color:#555">${t.trackingDelay}</p>`;
  const html = locale === "sv" ? frame(t.shippedHeading, body) : frameFor(locale, t.shippedHeading, body);
  const text = `${t.shippedHeading}\n${t.shippedBody(order.order_number, carrier)}${tracking.number ? ` ${t.parcelId}: ${tracking.number}.` : ""}${tracking.url ? `\n${t.trackShort}: ${tracking.url}` : ""}`;
  await sendEmail(order.email, subject, html, text);
}

/** Samma ram som frame(), med sidfot på mejlets språk. */
const frameFor = (locale: Locale, title: string, body: string) => `<!doctype html><html lang="${locale}"><body style="margin:0;background:#f7f5f0;font-family:Helvetica,Arial,sans-serif;color:#222">
<div style="max-width:560px;margin:0 auto;padding:32px 20px">
  <p style="font-size:22px;font-weight:600;margin:0 0 24px">Metilde</p>
  <div style="background:#fff;border-radius:16px;padding:28px">
    <h1 style="font-size:22px;margin:0 0 8px">${title}</h1>
    ${body}
  </div>
  <p style="font-size:12px;color:#888;margin:24px 0 0;line-height:1.6">${company.legalName} · ${company.idLabel} ${company.orgNumber} · ${company.address}<br>
  ${emailText[locale].questions(company.phone, hoursFor(locale))}</p>
</div></body></html>`;
