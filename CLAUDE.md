@AGENTS.md

# Metilde – projektanteckningar

Svensk e-handel för botaniska kosttillskott (Swedish Treats AB). Återuppbyggd från en Lovable-export
för att få full kontroll över SEO, structured data och Google Merchant Center-krav.

## Struktur
- `data/*.json` – produkter, priser, paket, artiklar, fraktzoner (exporterade från gamla butiken; källa tills Supabase kopplas på).
- `public/media/` – alla produkt-, paket- och artikelbilder. Gamla sökvägar `/api/public/media/x` mappas till `/media/x` via `src/lib/media.ts`.
- `src/lib/` – datalager (`products.ts`, `bundles.ts`, `articles.ts`, `shipping.ts`), `site.ts` (företagsuppgifter och alla "påståenden"), `routes.ts` (svenska slugs).
- `src/content/` – produktberättelser (`product-content.ts`), juridiska sidor (`legal.ts`), FAQ, mål.
- `src/app/sv/` – alla sidor. Bara svenska är aktivt; övriga språk läggs till som egna segment senare.
- `src/components/cart/` – varukorg i localStorage via `useSyncExternalStore` (`cartStore.ts`).

## Regler
- Inga hälsopåståenden i texter. Beskriv botanik, extrakt, dosering, tester.
- Visa aldrig siffror eller kampanjer som inte kan styrkas (styrs i `src/lib/site.ts`).
- Fraktpriser, villkor och kassa ska alltid visa samma siffror – frakttabellen genereras från `data/shipping_rates.json`.
- Priser i SEK från `product_prices` (valuta SEK); `products.price` är reserv.

## Verifiering
- `npm run typecheck`, `npm run lint`, `npm run build`.
- `npm run shots <url> <prefix> [mobile|desktop|both]` – skärmdumpar med mobilemulering (kräver Chrome).
- `npm run overflow <url> [bredd]` – hittar horisontellt överflöd på mobil.

## Kvar att bygga
Stripe-betalning i kassan, Supabase (ordrar, konton, prenumerationer, recensioner), Google/Meta-produktfeeds,
quiz, presentkort, spåra order, mitt konto, samarbeten/jobba hos oss, fler språk.

## Statistik och övergivna korgar
- `/api/track` räknar sidvisningar, unika besökare per dag (hashad IP, `visitors_daily`) och korghändelser (`cart_events_hourly`). Inga cookies.
- Övergivna korgar kommer från Stripes `checkout.session.expired` (sessionen har 24 h giltighet och återställningslänk). Kräver att händelsen är påslagen i Stripes webhook-destination.
- Adminöversikten (`/admin`) visar ett diagram per mått – aldrig flera serier på samma axel.
