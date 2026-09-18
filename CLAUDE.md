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

## Meta (pixel, Conversions API, katalogfeed)
- Pixeln laddas bara efter cookiesamtycke "all" (`src/components/consent/`, cookie `metilde_consent`). Utan `NEXT_PUBLIC_META_PIXEL_ID` är allt avstängt.
- Varje händelse skickas både via pixeln och `/api/meta` → Conversions API med samma `event_id` (avduplicering). Purchase skickas från servern i `saveOrderFromSession` med `event_id = Stripe-sessionens id`, och från tacksidan med samma id. Serverns Purchase skickas bara om `metadata.consent === "all"` (sätts i `/api/checkout`).
- Katalog-id (`metaContentId` i `src/lib/consent.ts`) = artikelnummer (MET-TKA-001), samma som gamla butikens feed och som Google-feeden; slug som reserv. Feeden `/feeds/meta.xml` och alla content_ids använder samma id.
- Metas katalog "Metilde Health Sverige" (id 1616122259871032) hämtar feeden varje timme från gamla sajten. Vid lansering byts adressen till `https://metilde.com/feeds/meta.xml` under Datakällor → Scheman (både uppdaterings- och ersättningsschemat).
- Pixeln 1606920894391393 har en Conversions API Gateway kopplad (openbridge, on.aws). Den och vår egen CAPI skickar samma event_id, så Meta avduplicerar. Pixeln skickar inget från headless Chrome, testa i ett riktigt fönster.
- `META_TEST_EVENT_CODE` sätts bara tillfälligt vid test i Events Manager → Testhändelser.

## Meta Marketing API (annonser)
- `src/lib/meta-ads.ts` – klient för kampanjer/annonsgrupper/annonser/insikter. Kräver `META_ADS_TOKEN` (systemanvändare "Conversions API System User" i portföljen Nordicsauna, token genererad via appen "Metilde Health" 1575304117393916 med ads_management + ads_read m.fl.) och `META_AD_ACCOUNT_ID` (928861056362107). Sidan som annonserar: `META_PAGE_ID`.
- `npm run meta-ads status|campaigns|insights|pages` verifierar kopplingen från .env.local.
- Allt som skapas via API:t skapas PAUSAT; aktivering är ett medvetet steg.
- Ändringar av rättigheter i Meta (use cases, resurstilldelning, tokens) måste användaren göra själv – autoläget stoppar sådana klick.
- Annonsmotorn: `src/lib/ads-engine.ts` (regler i `rules`, testkampanjer med prefix "Test · "), texter i `src/content/ad-copy.ts` (inga hälsopåståenden), adminvy `/admin/annonser`, daglig granskning `/api/cron/ads-review` (vercel.json, CRON_SECRET, ADS_AUTOPILOT). Beslut loggas i tabellen `ad_log`.
- Meta-appen "Metilde Health" måste vara i live-läge för att annonser ska kunna skapas via API. Bilder laddas upp som bytes (url-uppladdning kräver behörighet appen saknar). Läs kampanjträdet med `listTree()` – ett anrop – annars slår Metas anropskvot till.
- Annonsbilder: `src/lib/higgsfield.ts` (Marketing Studio Image, HF_CREDENTIALS, förskottssaldo på console.higgsfield.ai) + `src/lib/ad-images.ts` (scener runt packshoten = ALLTID `primaryImage`, dvs. framsidan; lagras i bucket product-media under `ads/<slug>/`, tabellen ad_creatives). Egna bilder via `/admin/annonser/bilder`.
- AI-granskning `src/lib/ad-qa.ts` (ANTHROPIC_API_KEY eller OPENAI_API_KEY): varje bild poängsätts mot packshoten (rätt burk, framsida, oförändrad etikett, ingen påhittad text), varje annons poängsätts för hälsopåståenden/fakta/koherens. Gränser AD_QA_MIN_IMAGE/AD_QA_MIN_AD (70). Underkända bilder döljs, underkända annonser skapas inte. Poäng i ad_creatives.image_score och ad_variants.ad_score.
- Meta-placeringar: `placements` i meta-ads.ts styr både annonsgruppens inriktning och bild-per-placering-reglerna. Avvecklade positioner: video_feeds, explore. Motorn använder bara framsidan som packshot.
- Engångsskript som behöver projektets TS-moduler körs med `npx tsx --env-file=.env.local scripts/x.mts` (ESM, relativa importer med .ts-ändelse). Granskaren (gpt-4o) drar gärna av för etikettens ord Energy/Performance/Vitality trots instruktion; poängen avgör, gränsen är 70.
