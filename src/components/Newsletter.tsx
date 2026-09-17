"use client";

import Link from "next/link";
import { useState } from "react";
import { routes } from "@/lib/routes";
import { site } from "@/lib/site";
import { Button, Container, Eyebrow } from "@/components/ui";

/**
 * Nyhetsbrevsblock. Formuläret sparar ännu inte adressen – koppling till
 * e-postverktyg (t.ex. Resend/Klaviyo) läggs till när backend finns.
 */
export function Newsletter() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  if (site.newsletterDiscount === null) return null;

  return (
    <section className="bg-primary text-primary-fg">
      <Container className="grid gap-8 py-16 lg:grid-cols-2 lg:items-center">
        <div>
          <Eyebrow className="text-primary-fg/70">Nyhetsbrev</Eyebrow>
          <h2 className="mt-3 font-display text-3xl font-medium tracking-tight sm:text-4xl">
            Få {site.newsletterDiscount} % rabatt på din första order
          </h2>
          <p className="mt-4 max-w-md text-primary-fg/80">
            Nyheter, guider från Journalen och erbjudanden – ungefär två mejl i månaden. Rabattkoden skickas direkt till din inkorg.
          </p>
        </div>
        {done ? (
          <p className="rounded-2xl bg-white/10 p-6 text-base">
            Tack! Kolla din inkorg – rabattkoden är på väg.
          </p>
        ) : (
          <form
            className="flex flex-col gap-3 sm:flex-row"
            onSubmit={(e) => {
              e.preventDefault();
              if (email.includes("@")) setDone(true);
            }}
          >
            <label className="sr-only" htmlFor="newsletter-email">
              E-postadress
            </label>
            <input
              id="newsletter-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Din e-postadress"
              className="h-13 flex-1 rounded-full border border-white/20 bg-white/10 px-5 text-base text-white placeholder:text-white/50 focus:bg-white/15 focus:outline-none"
            />
            <Button type="submit" size="lg" variant="white">
              Prenumerera
            </Button>
            <p className="text-xs text-primary-fg/60 sm:hidden">
              Genom att prenumerera godkänner du vår{" "}
              <Link href={routes.privacy} className="underline">
                integritetspolicy
              </Link>
              .
            </p>
          </form>
        )}
        <p className="hidden text-xs text-primary-fg/60 sm:block lg:col-start-2">
          Genom att prenumerera godkänner du vår{" "}
          <Link href={routes.privacy} className="underline">
            integritetspolicy
          </Link>
          . Avsluta när du vill.
        </p>
      </Container>
    </section>
  );
}
