import type { Metadata } from "next";
import Link from "next/link";
import { formatPrice } from "@/lib/format";
import { routes } from "@/lib/routes";
import { company } from "@/lib/site";
import { stripe, stripeConfigured } from "@/lib/stripe";
import { ClearCart } from "@/components/checkout/ClearCart";
import { CheckIcon } from "@/components/icons";
import { ButtonLink, Container } from "@/components/ui";

export const metadata: Metadata = {
  title: "Tack för din beställning",
  robots: { index: false, follow: false },
};

export default async function ThankYouPage({ searchParams }: PageProps<"/sv/tack">) {
  const { session_id } = await searchParams;
  const id = typeof session_id === "string" ? session_id : null;

  if (!id || !stripeConfigured()) {
    return (
      <Container className="py-20 text-center">
        <h1 className="font-display text-3xl font-medium">Vi hittar ingen beställning</h1>
        <p className="mt-2 text-muted">Länken verkar ofullständig. Har du betalat får du ändå en bekräftelse via e-post.</p>
        <ButtonLink href={routes.home} className="mt-6">
          Till startsidan
        </ButtonLink>
      </Container>
    );
  }

  const session = await stripe().checkout.sessions.retrieve(id, { expand: ["line_items", "subscription"] });
  const paid = session.payment_status === "paid" || session.status === "complete";
  const lines = session.line_items?.data ?? [];
  const email = session.customer_details?.email ?? "";
  const reference = session.id.replace("cs_test_", "").replace("cs_live_", "").slice(-8).toUpperCase();
  const isSub = session.mode === "subscription";

  if (!paid) {
    return (
      <Container className="py-20 text-center">
        <h1 className="font-display text-3xl font-medium">Betalningen är inte slutförd</h1>
        <p className="mt-2 text-muted">Ingen order har lagts. Du kan gå tillbaka till kassan och försöka igen.</p>
        <ButtonLink href={routes.checkout} className="mt-6">
          Tillbaka till kassan
        </ButtonLink>
      </Container>
    );
  }

  return (
    <Container className="py-12 sm:py-16">
      <ClearCart />
      <div className="mx-auto max-w-2xl">
        <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary-soft text-primary">
          <CheckIcon size={28} />
        </span>
        <h1 className="mt-5 font-display text-4xl font-medium tracking-tight">Tack för din beställning!</h1>
        <p className="mt-3 text-lg text-muted">
          Vi har tagit emot din {isSub ? "prenumeration" : "order"} och skickar en bekräftelse till <strong className="text-foreground">{email}</strong>.
          Ordrar lagda före kl. 12 på vardagar skickas samma dag.
        </p>

        <section className="mt-10 rounded-card border border-line p-6">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted">Orderreferens</span>
            <span className="font-mono font-medium">{reference}</span>
          </div>
          <ul className="mt-4 divide-y divide-line border-t border-line">
            {lines.map((l) => (
              <li key={l.id} className="flex justify-between gap-4 py-3 text-sm">
                <span>
                  {l.quantity} × {l.description}
                </span>
                <span className="tabular-nums">{formatPrice((l.amount_total ?? 0) / 100)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-3 space-y-1 border-t border-line pt-3 text-sm">
            {session.total_details?.amount_discount ? (
              <div className="flex justify-between text-success">
                <dt>Rabatt</dt>
                <dd className="tabular-nums">−{formatPrice(session.total_details.amount_discount / 100)}</dd>
              </div>
            ) : null}
            {session.shipping_cost ? (
              <div className="flex justify-between">
                <dt className="text-muted">Frakt</dt>
                <dd className="tabular-nums">{session.shipping_cost.amount_total === 0 ? "Fri" : formatPrice(session.shipping_cost.amount_total / 100)}</dd>
              </div>
            ) : null}
            <div className="flex justify-between text-base font-semibold">
              <dt>Betalt</dt>
              <dd className="tabular-nums">{formatPrice((session.amount_total ?? 0) / 100)}</dd>
            </div>
          </dl>
        </section>

        {isSub ? (
          <p className="mt-6 rounded-2xl bg-sand-soft p-5 text-sm text-muted">
            Din prenumeration förnyas automatiskt med det intervall du valt. Du kan pausa eller avsluta när du vill genom att
            mejla{" "}
            <a href={`mailto:${company.email}`} className="underline">
              {company.email}
            </a>
            . Mitt konto med självservice kommer inom kort.
          </p>
        ) : null}

        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href={routes.products}>Fortsätt handla</ButtonLink>
          <Link href={routes.contact} className="inline-flex h-11 items-center px-2 text-sm font-medium underline underline-offset-2">
            Frågor om ordern? Kontakta oss
          </Link>
        </div>
      </div>
    </Container>
  );
}
