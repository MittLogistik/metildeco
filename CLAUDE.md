@AGENTS.md

# Metilde – projektanteckningar

Svensk e-handel för botaniska kosttillskott (Swedish Treats AB). Återuppbyggd från en Lovable-export
för att få full kontroll över SEO, structured data och Google Merchant Center-krav.

## Struktur
- `data/*.json` – produkter, priser, paket, artiklar, fraktzoner (exporterade från gamla butiken; källa tills Supabase kopplas på).
- `public/media/` – alla produkt-, paket- och artikelbilder. Gamla sökvägar `/api/public/media/x` mappas till `/media/x` via `src/lib/media.ts`.
- `src/lib/` – datalager (`products.ts`, `bundles.ts`, `articles.ts`, `shipping.ts`), `site.ts` (företagsuppgifter och alla "påståenden"), `routes.ts` (slugs per språk), `i18n.ts` (marknader).
- `src/content/` – produktberättelser (`product-content.ts`), juridiska sidor (`legal.ts`), FAQ, mål.
- `src/app/[lang]/` – alla sidor (rotlayout, `<html lang>`). Språk sv, fi, da, nl – se Marknader nedan. Admin har egen rotlayout, 404 utanför dem i `global-not-found.tsx`.
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
- Övergivna korgar (`src/lib/abandoned.ts`): kassan samlar in e-post före Stripe och sparar korgen i `abandoned_carts` när kunden trycker Till betalning (`recordCheckoutStart` i `/api/checkout`). Stripes `checkout.session.expired` är bara reserv för kunder som skrev e-posten först hos Stripe. Fyra påminnelser (3 h, 24 h, 3 d, 10 d, `REMINDER_HOURS`) via cron `/api/cron/abandoned` var 15:e minut; stoppas vid köp (`markRecovered` + kontroll mot orders), avregistrering (`/api/unsubscribe`, signerad länk, tabell `email_optouts`) eller admin. Från mejl 2 följer rabattkoden `ABANDONED_DISCOUNT_CODE` (KORG10, `ABANDONED_DISCOUNT_PERCENT` 10) med; länken `/sv/kassa?korg=<id>&kod=KORG10` fyller korgen (`/api/cart/<id>`) och kassan skickar koden så att `/api/checkout` lägger på den som `discounts` (då utan `allow_promotion_codes`). Koden skapas och testas skarpt från `/admin/korgar`.
- Adminöversikten (`/admin`, data i `src/lib/dashboard.ts` + `lib/stats`): nyckeltal, säljtratt, källor (besökare + ordrar), länder (topp 10 + övriga), Meta-annonser med länk-CTR (`accountCampaignInsights`, ett anrop), lagervarningar med dagar kvar (sålt 30 d, paket upplösta; slut sedan länge listas utan varning), senaste ordrar med källa. Ett diagram per mått – aldrig flera serier på samma axel.
- Besökarnas källa: `track()` skickar `src` (classifyLanding) med page_view; `/api/track` räknar den i `visitor_sources_daily` (rpc `track_visitor_source`) bara för dygnets första besök. Källetikett i admin: `_components/SourceBadge`.

## Mitt konto och prenumerationer
- Inloggning med engångskod: koden skapas med `auth.admin.generateLink({ type: "magiclink" })` och skickas med Resend (`sendLoginCodeEmail`), inte med Supabases inbyggda utskick (hårt begränsat, hamnar i skräppost). Utan `RESEND_API_KEY` faller den tillbaka på Supabase.
- `src/lib/subscriptions.ts` är enda stället som ändrar prenumerationer i Stripe (pausa, återuppta, avsluta vid periodens slut, avsluta direkt) och speglar svaret i `subscriptions`. Kund via Mitt konto, admin via `/admin/kunder/<e-post>` (för uppsägningar som kommer via mejl).
- Webhooken tar emot `customer.subscription.updated/deleted` så att avslut i Stripes portal/Dashboard syns här. Händelserna måste vara påslagna i Stripes webhook-destination.

## Plocky (WMS, lager och frakt)
- Plocky är MittLogistik-WMS:et i syskonrepot `../wms`; Metilde är en butik under kunden **Swedish Treats AB** (inte Herbwell AB) och kopplas via Plockys generiska **Webshop-API** (`wms/docs/WEBSHOP-API.md`). Ingen kod behövs på Plocky-sidan.
- `src/lib/plocky.ts`: betalda ordrar köas i `wms_queue` och POSTas till `${PLOCKY_URL}/orders` med `X-Api-Key: PLOCKY_API_KEY` (201/409 = klart, 422/401/404 = stopp, annars backoff 1–720 min via cron `/api/cron/plocky` var 10:e minut). Anropas från `saveOrderFromSession`, `releaseScheduledOrders` (förnyelser) och admin när en planerad order sätts till Betald. Presentkort skickas aldrig.
- `external_id` = orderns uuid, `order_number` = vårt ordernummer. Paket skickas som paketrad (`is_bundle`) plus innehållet som egna rader; Plocky plockar bara innehållet. Artikelnummer måste vara identiska (MET-…); saknas sku skickas slugen och ordern hamnar på paus i Plocky (varning i kön).
- Inkommande `/api/plocky/wms-inbound` (header `X-Wms-Key: PLOCKY_INBOUND_KEY`): `ping`, `stock.update` (absolut säljbart saldo, skriver `products.stock`; Plocky skickar ALLA kundens artiklar, bara SKU:er med prefixet `PLOCKY_SKU_PREFIX` (MET-) rapporteras som okända) och `shipment.created` (status Skickad, kolli-id, spårningslänk, leveransmejl `sendShippingConfirmation`). Artiklar till Plocky: `/api/plocky/wms-catalog?resource=products`. Loggas i `wms_events`.
- Adminvy `/admin/plocky`: status, test, kö med "Skicka igen", händelser från Plocky, produkter utan artikelnummer och stegen för att koppla butiken. Bas-URL på Plockys kort = `https://metilde.com/api/plocky`.

## Meta (pixel, Conversions API, katalogfeed)
- Pixeln laddas bara efter cookiesamtycke "all" (`src/components/consent/`, cookie `metilde_consent`). Utan `NEXT_PUBLIC_META_PIXEL_ID` är allt avstängt.
- Varje händelse skickas både via pixeln och `/api/meta` → Conversions API med samma `event_id` (avduplicering). Purchase skickas från servern i `saveOrderFromSession` med `event_id = Stripe-sessionens id`, och från tacksidan med samma id. Serverns Purchase skickas bara om `metadata.consent === "all"` (sätts i `/api/checkout`).
- Katalog-id (`metaContentId` i `src/lib/consent.ts`) = artikelnummer (MET-TKA-001), samma som gamla butikens feed och som Google-feeden; slug som reserv. Feeden `/feeds/meta.xml` och alla content_ids använder samma id.
- Metas katalog "Metilde Health Sverige" (id 1616122259871032) hämtar feeden varje timme från gamla sajten. Vid lansering byts adressen till `https://metilde.com/feeds/meta.xml` under Datakällor → Scheman (både uppdaterings- och ersättningsschemat).
- Pixeln 1606920894391393 har en Conversions API Gateway kopplad (openbridge, on.aws). Den och vår egen CAPI skickar samma event_id, så Meta avduplicerar. Pixeln skickar inget från headless Chrome, testa i ett riktigt fönster.
- `META_TEST_EVENT_CODE` sätts bara tillfälligt vid test i Events Manager → Testhändelser.

## Google Ads (tagg)
- `src/components/consent/GoogleTag.tsx` laddar gtag.js för alla besökare i **avancerat samtyckesläge** (Consent Mode v2, sedan 2026-09-30): utgångsläge nekat (inga cookies, cookiefria pingar gcs=G100 som Google modellerar), uppdateras till beviljat vid "Acceptera alla" (gcs=G111, cookie _gcl_au). `ads_data_redaction` och `url_passthrough` är på. `NEXT_PUBLIC_GOOGLE_ADS_ID` (AW-18480599377) slår på den; tomt = avstängt.
- **gtag-kön måste få `arguments`-objekt**, inte arrayer (`dataLayer.push(arguments)` som i Googles snippet). Före 2026-09-30 pushades arrayer och inga händelser nådde Google.
- Köp skickas från tacksidan (`GooglePurchase`) som `conversion` med `send_to = <tagg-id>/<NEXT_PUBLIC_GOOGLE_ADS_PURCHASE_LABEL>`, ordernummer som `transaction_id` och totalbelopp i SEK. Utan etikett skickas bara standardhändelsen `purchase`. Förbättrade konverteringar är på i Google Ads: tacksidan ger kundens e-post som `user_data` (bara med samtycke), taggen hashar den i webbläsaren. Konverteringen skickas även utan samtycke, då som cookiefri signal. Etiketten hämtas i Google Ads under Mål → Konverteringar → Köp → "Ställ in manuellt via kod".
- Googles egen "Testa installation" hittar inte taggen (crawlern ger inget samtycke). Testa i ett riktigt fönster efter Acceptera alla, med Tag Assistant.
- Google-feederna har `custom_label_0` (paket/singel) och `custom_label_1` (tongkat/ovrigt) för budgivning; paket vars namn inte nämner någon ingående produkt får innehållet i titeln (`bundleTitle`).
- Google-feeden (`/feeds/google.xml`) skickar jämförpris: `unit_pricing_measure` = antal kapslar (`unitCount` från namnet) och `unit_pricing_base_measure` = 1 ct. Paket = summan av innehållet.

## Microsoft Advertising (UET-tagg)
- `src/components/consent/MicrosoftTag.tsx` laddar UET (`NEXT_PUBLIC_MS_UET_ID`, tomt = avstängt) först efter "Acceptera alla" – inget cookiefritt läge som hos Google. SPA-sidvisningar via `enableAutoSpaTracking`. Köp från tacksidan som händelsen `purchase` med `revenue_value` och orderns valuta; konverteringsmålet i Microsoft Ads = händelse, åtgärd "purchase", variabelt intäktsvärde. Cookies (_uetsid, _uetvid, MUID) står i cookiepolicyn på alla språk.

## Meta Marketing API (annonser)
- `src/lib/meta-ads.ts` – klient för kampanjer/annonsgrupper/annonser/insikter. Kräver `META_ADS_TOKEN` (systemanvändare "Conversions API System User" i portföljen Nordicsauna, token genererad via appen "Metilde Health" 1575304117393916 med ads_management + ads_read m.fl.) och `META_AD_ACCOUNT_ID` (928861056362107). Sidan som annonserar: `META_PAGE_ID`.
- `npm run meta-ads status|campaigns|insights|pages` verifierar kopplingen från .env.local.
- Allt som skapas via API:t skapas PAUSAT; aktivering är ett medvetet steg.
- Ändringar av rättigheter i Meta (use cases, resurstilldelning, tokens) måste användaren göra själv – autoläget stoppar sådana klick.
- Annonsmotorn: `src/lib/ads-engine.ts` (regler i `rules`, testkampanjer med prefix "Test · "), texter i `src/content/ad-copy.ts` (inga hälsopåståenden), adminvy `/admin/annonser`, daglig granskning `/api/cron/ads-review` (vercel.json, CRON_SECRET, ADS_AUTOPILOT). Beslut loggas i tabellen `ad_log`; ej utförda förslag har en knapp på loggraden (`applyLogSuggestion`) så att de kan utföras från mobilen.
- Iteration från en vinnare (`iterateFromAd`) använder **bara befintliga bilder** (egna uppladdade och godkända i Creative Studio). Albin gör bilderna själv, så motorn genererar aldrig nya scener.
- Retargeting (`buildRetargeting`, prefix "Retargeting · "): målgrupper från pixeln (Besökare 30 d, Varukorg 7 d, Köpare 30 d, återanvänds på namn), två annonsgrupper med `advantage_audience: 0`, vinklar `retargetingAngles` i ad-copy.ts. Granskningsreglerna rör inte retargeting.
- Utkast från valda bildset (`buildFromGroups`, knapp på /admin/annonser/bilder, kryssrutor med `form="from-groups"`): en annons per valt bildset, texten skrivs av `writeAdCopyFromImage` som ser bilden (vinkel-id "bild"). Valda bilder används även med låg granskningspoäng.
- Meta-appen "Metilde Health" måste vara i live-läge för att annonser ska kunna skapas via API. Bilder laddas upp som bytes (url-uppladdning kräver behörighet appen saknar). Läs kampanjträdet med `listTree()` – ett anrop – annars slår Metas anropskvot till.
- Annonsbilder: `src/lib/higgsfield.ts` (Marketing Studio Image, HF_CREDENTIALS, förskottssaldo på console.higgsfield.ai) + `src/lib/ad-images.ts` (scener runt packshoten = ALLTID `primaryImage`, dvs. framsidan; lagras i bucket product-media under `ads/<slug>/`, tabellen ad_creatives). Egna bilder via `/admin/annonser/bilder`.
- AI-granskning `src/lib/ad-qa.ts` (ANTHROPIC_API_KEY eller OPENAI_API_KEY): varje bild poängsätts mot packshoten (rätt burk, framsida, oförändrad etikett, ingen påhittad text), varje annons poängsätts för hälsopåståenden/fakta/koherens. Gränser AD_QA_MIN_IMAGE/AD_QA_MIN_AD (70). Underkända bilder döljs, underkända annonser skapas inte. Poäng i ad_creatives.image_score och ad_variants.ad_score. Admin kan köra över bildgranskningen med "Godkänn ändå" (`ad_creatives.approved_override`, `groupScore` ignorerar då poängen).
- Meta-placeringar: `placements` i meta-ads.ts styr både annonsgruppens inriktning och bild-per-placering-reglerna. Avvecklade positioner: video_feeds, explore. Motorn använder bara framsidan som packshot.
- Egna annonsbilder laddas upp direkt från webbläsaren till lagringen via `/api/admin/ad-uploads` (sign → PUT → commit). Serveraktioner tar bara emot 1 MB (höjt till 4 MB i next.config.ts), så filer får aldrig gå genom dem. Flera filer i samma omgång delar group_id: 1:1 eller 3:4 blir flöde, 9:16 blir story.
- Engångsskript som behöver projektets TS-moduler körs med `npx tsx --env-file=.env.local scripts/x.mts` (ESM, relativa importer med .ts-ändelse). Granskaren (gpt-4o) drar gärna av för etikettens ord Energy/Performance/Vitality trots instruktion; poängen avgör, gränsen är 70.

## Prenumerationer och förnyelser
- Intervallet lagras i `subscriptions.interval_days` (från `order_items.plan` "sub:30"). Visas på ordersidan, kundsidan och Mitt konto.
- Förnyelse: Stripe `invoice.paid` (subscription_cycle) → `saveRenewalFromInvoice` skapar ordern med status `scheduled`, `deliver_at` = betaldatum + 8 dagar, `release_at` = 4 dagar före leverans. Cron `/api/cron/orders-release` (04:00 UTC) sätter status `paid` när `release_at` passerats; här kopplas Plocky på.
- Kunder i admin (`/admin/kunder`) nycklas på e-post i gemener (`src/lib/customers.ts`), intäkt = skarpa ordrar som inte är avbrutna/återbetalda.
- Annonstexter skrivs av AI (`src/lib/ad-writer.ts`, OpenAI i första hand, annars Anthropic; `AD_COPY_AI=false` stänger av, `AD_COPY_MODEL` byter modell). Säljande ton med emojis, men bara påståenden som går att styrka – hälsopåståenden stoppas av en ordlista i skrivaren och av `reviewAd`. Underkänd text skrivs om en gång med granskarens motivering och faller sedan tillbaka på mallarna i `src/content/ad-copy.ts`. Förhandsvisning: `/admin/annonser/texter`. Källan sparas i `ad_variants.copy_source`.

## Creative Studio (annonsbilder)
- `/admin/annonser/bilder` → välj koncept och format, en bilduppsättning per koncept. Fem koncept i `src/content/ad-concepts.ts`: notification, simple-routine, product-facts, comparison, social-proof. Internt namn `<slug>-<concept>-1x1`.
- Bilden skapas i **en genomkörning**: `images/edits` med packshoten som referens och `input_fidelity: high`. Modellen ritar miljö, produkt, badges, pilar och all typografi. Vi provade att lägga text ovanpå i efterhand – det blev platt och såg klistrat ut. Modellen bygger in typografin i scenen med rätt ljus och djup.
- Priset för det: etikettens finstilta blir ibland påhittad (500 mg kan bli 800 ng) och enstaka svenska ord felstavas. Prompten säger åt modellen att hellre lämna finstilt i mjukt fokus än att hitta på, och granskningen (reviewImage) jämför etiketten mot packshoten och läser stavningen i annonstexten. Underkända bilder döljs och kan göras om.
- **Art director** (`src/lib/ad-art-director.ts`): en språkmodell ser packshoten och skriver regin till bildmodellen, som i ChatGPT-chatten. Den skriver bara scen, komposition och typografi – reglerna om produkten, tillåten text, format och hälsopåståenden läggs på efteråt och kan inte tummas på. Stängs av med `AD_ART_DIRECTOR=false`, modell via `AD_ART_MODEL`. Faller tillbaka på konceptets egen beskrivning.
- Prompten byggs modulärt i `src/lib/ad-prompt.ts` (varumärke + produkt + koncept + format + egna instruktioner + rensning). `brand` där styr den visuella riktningen.
- Exakta format: 1:1 = 1080×1080, 9:16 = 1080×1920, komponerade var för sig. Story håller text inom safe areas (topp 14 %, botten 19 %).
- Textlagret vet var burken står (Geo) och lägger aldrig text ovanpå den.
- Omdömeskonceptet visar bara ett citat om det finns en publicerad recension i `product_reviews` eller om admin skriver in en äkta. Annars kort utan stjärnor.
- Leverantör byts med `AD_IMAGE_PROVIDER` (openai|higgsfield), modell med `AD_IMAGE_MODEL`, kvalitet med `AD_IMAGE_QUALITY`. `getApprovedCreatives(slug)` ger kampanjbyggaren de godkända bilderna.

## Katalogannonser (karusell)
- `/admin/annonser/katalog`. Bilderna görs **utanför systemet** och laddas upp: ett kort i taget, eller en bred bild som delas i lika stora kvadrater. Genereringen togs bort – resultatet höll inte.
- Bred bild skalas med `fit: "fill"`, inte `cover`. Beskärning skulle flytta en bakgrund som riktats upp mot kortgränserna. Rätt mått är N × 1080 brett och 1080 högt.
- Ordningen styrs i gränssnittet och avgör hur skarvarna möts. Positionerna är unika per katalog, så bytet görs i två pass (negativa tillfälliga värden först).
- Titel, beskrivning och länk per kort hämtas från produkten. Bara varor i lager kan väljas.
- Annonstexten föreslås av `writeCatalogText`, redigeras och **godkänns** innan kampanjen kan startas. `publishCatalog` vägrar utan godkänd text.
- Kampanjen skapas alltid pausad, via `createCarouselCreative` (`child_attachments`, `multi_share_end_card` av).
- Tabeller: `ad_catalogs` + `ad_catalog_cards`.
## Affiliate (AddRevenue)
- Klick fångas i `src/components/affiliate/ClickTracker.tsx`. AddRevenue lägger på **`clickId`, `channelId`, `advertiserId`** (camelCase) på landningsadressen (äldre: adt_id, arid); uppslagningen är skiftlägesokänslig sedan 2026-09-29, innan dess fångades inga klick alls. Besökar-id i localStorage `metilde_vid`. AddRevenues eget skript (track.js) används inte; deras "spårningsskript saknas"-kontroll är därför väntad. Testverktyg (testlänk, senaste klick, testkonvertering TEST-…) finns på `/admin/affiliate`. Klicket skickas till `/api/affiliate/click` och sparas i `visitor_tracking` med `expires_at` = nu + attributionsdagar. Webbläsaren pratar aldrig med AddRevenue.
- Attributionen **fryses i kassan**: `/api/checkout` slår upp senaste giltiga klicket och lägger `aff_src/aff_click/aff_ref` i Stripe-sessionens metadata. `saveOrderFromSession` skriver dem på ordern tillsammans med `exchange_rate_to_sek`.
- När ordern är betald köas konverteringen i `postback_queue` (unikt på order_id + source). Cron `/api/cron/affiliate` var tionde minut skickar kön med backoff 1, 5, 15, 60, 180, 720 minuter, hämtar provision och rensar utgångna klick. Låset ligger i `job_locks`.
- **Två endpoints med olika regler**: trackern `https://addrevenue.io/t` tar emot konverteringen och får INTE ha Authorization-header. `https://addrevenue.io/api/v2/conversions` hämtar provision och kräver `Bearer ADDREVENUE_API_TOKEN`. Samma token finns bara på det andra stället.
- Provisionsgrundande värde = `orders.subtotal` (redan efter rabatt, utan frakt) delat med (1 + momssats för leveranslandet). Beloppet skickas alltid i **ordervalutan** – räkna aldrig om det. Kursen på ordern används bara för våra egna SEK-sammanställningar.
- Momssatser per land ligger i `integration_settings.affiliate_addrevenue.vatRates` och ändras i `/admin/affiliate`. SE = 0,12 för kosttillskott; `default` gäller övriga länder och måste stämmas av innan en ny marknad öppnas.
- Förnyelseordrar ärver inte attributionen och köar ingen konvertering.

## Köperbjudande och A/B-test av köprutan
- Per produkt (admin → Produkter → Erbjudande): `offer_enabled`, `offer_pack_qty` (2–6), `offer_gift_slug`, `offer_gift_choices[]` (kunden väljer). Variant B (`src/components/cart/OfferBuyBox.tsx`) visar tre val: prenumerera på 1 (15 %, fri frakt, 30 d), prenumerera på flerpack (15 %, gåva, 60/90 d) och köp en gång. Besparingen räknas mot fullt värde inkl. gåvans pris.
- Gåvan är en egen korgrad `plan: "gift"` (nyckel `gift:<slug>`, 0 kr, `listPrice` = gåvans pris så den syns som rabatt). Den gäller bara om korgen har en kvalificerande prenumerationsrad (`giftQualifies` i CartProvider, samma kontroll i `priceLines`). Går till Stripe som engångsrad 0 kr, sparas i `order_items` med plan `gift`, dras från lagret och skickas till Plocky som vanlig rad. Bara första leveransen; förnyelser har ingen gåva.
- A/B: `src/lib/experiments.ts` (inställning `experiment_buybox` i integration_settings: mode off/ab/on + split), klient `src/lib/experiment-client.ts` (lottas en gång per webbläsare i localStorage `metilde_ab_buybox`, `?ab=a|b` tvingar). `BuyBoxSwitch` renderar A på servern och byter till B efter hydrering. Händelser med variant loggas i `experiment_events` via `/api/track` (ab_view, add_to_cart, begin_checkout), ordern får `orders.experiment_variant` från kassans `variant` → Stripe-metadata `ab`. Rapport och läge: `/admin/annonser/abtest`.

## Källa på order
- `src/lib/attribution.ts` klassar landningen (affiliate, Google/Meta/Microsoft/TikTok Ads, e-post, organisk sökning, organiskt socialt, hänvisning, direkt). `ClickTracker` sparar den i localStorage `metilde_src` (första besöket + senaste icke-direkta, ingen cookie); kassan skickar den, `/api/checkout` lägger `src/src_d/src_f` i Stripe-metadata och `saveOrderFromSession` skriver `orders.source/source_detail/first_source`. Ett giltigt affiliateklick vinner alltid. Förnyelser = `renewal`, ordrar före 2026-10-06 = okänd.
- Modell: senaste källan som inte är direkt inom 30 dagar (`ATTRIBUTION_DAYS`). `fbclid` utan UTM räknas som Meta Ads (Meta lägger det även på vanliga inlägg); nya Meta-annonser får `url_tags` (`META_URL_TAGS`, utm_medium=paid).
- `/` → `/sv` görs i next.config (behåller parametrarna). En `redirect()` i app/page.tsx tappade gclid/utm.
- Syns i orderlistan (filter `?kalla=`), på ordersidan, i rapporten ("Per källa") och i CSV-exporten.

## Redigerbara sidor (villkor och policyer)
- `/admin/sidor`: alla sidor i `src/content/legal.ts` (köpvillkor, integritet, cookies, kvalitet, frakt, returer, hållbarhet) kan redigeras block för block. Sparat ligger i tabellen `page_overrides` och vinner över standardtexten; "Återställ standardtext" tar bort raden. `src/lib/pages.ts` (`getPage`, `cleanBlocks`, cache-tagg `PAGES_TAG`). Designen är densamma – `LegalDocView` renderar båda.
- Platshållare `{företag}`, `{orgnr}`, `{adress}`, `{epost}`, `{telefon}`, `{öppettider}`, `{returadress}` fylls i vid visning (`src/lib/page-text.ts`), så sparade texter följer `company`/`logistics` i site.ts. Blocken `companyInfo` (företagsuppgifter) och `shippingTable` (fraktpriser) är automatiska och redigeras inte.

## Rapporter (försäljning)
- `/admin/rapporter` (`src/lib/reports.ts`): vad som sålts per period – denna/förra månaden, i år, förra året, allt eller egna datum (svensk tid). Räknar allt utom `pending`, `cancelled` och `refunded` (`countsAsSale`), skarpt och test var för sig.
- Visar omsättning (inkl. moms och frakt), varor (`subtotal`, efter rabatt), frakt, rabatt, nya/återkommande kunder, sålt per produkt (paket som egna rader), "burkar som lämnat lagret" (paketinnehåll upplöst), per land, fraktsätt, ordertyp och rabattkod. Diagram per dag upp till 62 dagar, annars per månad (`TrendChart` tolkar nyckeln YYYY-MM).
- CSV: `/admin/rapporter/export?typ=produkter|ordrar` med samma period- och env-parametrar.

## Marknader (sv, fi, da, nl sedan 2026-10-12; de, fr, en, pl byggda 2026-11-02)
- Ett språk = en marknad (`src/lib/i18n.ts`): sv → SE/SEK, fi → FI/EUR, da → DK/DKK, nl → NL+BE/EUR (samma eurpriser som Finland), de → DE+AT+LU/EUR, fr → FR+BE+LU/EUR, en → IE/EUR, pl → PL/PLN. Ett språk kan ha flera länder (`extraCountries`, `extraHreflangs`; hjälpare `countriesOf`, `hreflangsOf`, `localeForCountry`): Belgien finns på både /nl och /fr, Luxemburg på /de och /fr. Kassan levererar bara till språkets länder (`shipping_address_collection` = `countriesOf`), hreflang, JSON-LD och `g:shipping` följer samma lista. /at → /de och /ie → /en (permanent, `countryAliases` i next.config), Stripe-språk och valuta följer. Ordern får `locale` (Stripe-metadata), mejlen skickas på det språket (`src/lib/email-text.ts`); förnyelser ärver språket.
- Adresser: mapparna heter som på svenska; fi/da har egna slugar (gamla butikens) i `routeSlugs` som skrivs om i next.config (`localizedRewrites`, beforeFiles). Den svenska slugen under /fi omdirigeras till den finska. `translatePath` = språkväljaren och hreflang (`alternates()` i `src/i18n/server.ts`).
- Artiklar (Journalen) finns på alla språk: svenska i `data/articles.json`, fi/da i `src/content/i18n/<språk>/articles.ts` med samma slug (`articlesFor(locale)`). Produktlänkar i texten skrivs `[text](product:slug)` och leder till produkten på artikelns språk. Ny svensk artikel = översätt den också, annars syns den bara på /sv.
- Bara på svenska (404 på fi/da via layout i mappen, länkar döljs med `hasPage`): mål, quiz, tongkat-ali, presentkort, mitt konto, spåra order, samarbeten, jobba hos oss. Påminnelser om övergiven korg bara för sv.
- Språket i serverkomponenter: `getI18n()` (läser rotparametern via `next/root-params`), i klientkomponenter `useI18n()`. UI-texter i `src/i18n/messages/*.ts` (sv/fi/da/nl i filen, de/fr/en/pl i `messages/locales/<språk>/<namnrymd>.ts` med typen `<Ns>Messages`). Översatt innehåll i `src/content/i18n/<språk>/` (katalog, produktsidor, villkor, FAQ); `getCatalog(locale)` visar bara produkter/paket med både översättning och pris i valutan. Ändras en svensk produkttext i admin måste översättningen uppdateras här.
- På engelska (/en, Irland) skrivs euro "€16.46": skicka med sidans språk till `formatPrice(belopp, valuta, locale)`. Övriga språk följer valutans marknad ("16,46 €").
- Priser i EUR/DKK i `product_prices`/`bundle_prices` (omräknade från SEK: EUR ≈ SEK/11 till ,95, DKK ≈ SEK×0,69 till …9). `roundPrice` avrundar euro till cent – använd `subscriptionUnitPrice`/`tieredUnitPrice` med valuta, aldrig Math.round.
- Frakt NL/DE/FR/IE: zon `eu` (spårbart brev 8 €, fri över 79 €, 3–6 arbetsdagar, returavgift 8 €). PL: zon `eu` i PLN (34 zł, fri över 339 zł, returavgift 34 zł). PLN-priser = EUR × 4,3 uppåt till …9 zł (migration 20261102120000_pln_prices.sql), `formatPrice` skriver "99 zł".
- Frakt FI/DK: zon `nordic` i `data/shipping_rates.json` (spårbart brev 6,50 €/46 kr, fri över 65 €/469 kr, 2–5 arbetsdagar). Returavgift i villkoren 8 €/59 kr = `markets[l].returnFee`. Plocky får alltid det svenska fraktnamnet (`swedishShippingMethod`), mallarna mappas på namnet.
- Val av marknad: bara rotadressen `/` väljer efter land (`x-vercel-ip-country` i `src/proxy.ts`: FI → /fi, DK → /da, NL/BE → /nl, DE/AT/LU → /de, FR → /fr, IE → /en, PL → /pl, övriga → /sv, parametrarna följer med). Djuplänkar rörs aldrig. Hamnar någon från SE/FI/DK/NL på fel marknad visas en diskret rad på besökarens språk (`MarketHint`, land från `/api/geo`, stängd = localStorage `metilde_market_hint`). Ingen popup.
- Google Ads: Tongkat Ali (även Fadogia, Blue Lotus) räknas som "otillåtet ämne" – annonser underkänns om målsidan nämner det, även i sidfot eller korgdata. Kampanjsidor utan dem: `/sv/kampanj`, `/fi/kampanja`, `/da/kampagne`, `/nl/actie` (egen rotlayout `src/app/kampanj/[lang]`, filtrerad korgdata, `Footer adSafe`, noindex, urval i `src/lib/ad-safe.ts`). Använd dem som slutlig webbadress med utökning av webbadress avstängd.
- Novel food (Tongkat Ali ×4, Fadogia, Blue Lotus) är stängt i Sverige sedan 2026-10-23: `src/lib/novel-foods.ts` (`CLOSED_IN`). `getCatalog` tar bort dem ur `products` (paketen med dem döljs automatiskt, feeds, sitemap, kassa), artiklarna om dem döljs, Tongkat Ali-sidan och sidfotslänken är borta. Admin och ordrar ser dem som vanligt. Övriga marknader oförändrade.
- Lagret (bolag, ort, adress) nämns aldrig utåt – kunder ska inte söka upp lagerlokalen. Texterna säger bara "vårt lager", returadressen står bara på retursedeln.
- Sverige nämns aldrig som ursprung (beslut 2026-11-02): inte "utvecklat i Sverige", "svenskt varumärke", "lager i Sverige", "skickas från Sverige", "svensk tid" (tidszon = CET) eller "svensk lag". Kvar: Sverige som leveransland för /sv, de svenska kundernas ARN/IMY/konsumentköplagen på /sv, och att kundservice svarar på svenska och engelska. Annonsskrivaren (ad-writer) har samma förbud. Platshållaren `{returadress}` och raden om logistikbolaget i Företagsuppgifter är borttagna. Avsändarort skrivs "från vårt lager i EU" (Microsoft Merchant Center kräver att det framgår varifrån varan skickas; köprutans leveransrad, frakt, villkor, FAQ på alla språk, 2026-11-03).
- Feeds per marknad: `/feeds/google-fi.xml`, `/feeds/google-dk.xml`, `/feeds/meta-fi.xml`, `/feeds/meta-dk.xml`, `/feeds/google-nl.xml`, `/feeds/meta-nl.xml`, `google|meta-de|fr|ie|pl.xml` (Google-feederna med `g:shipping` per land). Svenska feeden oförändrad.
- Rapporter, statistik och kundintäkt räknas i SEK med orderns `exchange_rate_to_sek` (tabellen exchange_rates uppdateras inte automatiskt). Affiliatemoms: FI 13,5 %, DK 25 %, NL 9 %; DE 7, AT 10, FR 5,5, BE 6, LU 3, IE 23, PL 8 % (standardvärden, ej avstämda med revisor).
- Paket- och produktsidornas `generateStaticParams` returnerar en platshållare (`saknas`, ger 404) när ett språk saknar varor. En tom lista för ett språk (svenska paket efter novel food-stängningen) gjorde att Next inte förrenderade några paketsidor alls – alla gav 404 på alla språk.
- Novel food är öppet på de nya marknaderna (Albins beslut 2026-11-02, stängs per land via `CLOSED_IN`).

## Kampanjer (Black Week)
- `src/lib/campaign.ts`: tidsstyrd kampanj (`BLACK_WEEK`, 25 %, 2026-11-19 00:00 – 2026-11-30 23:59 CET). `getCatalog` sänker alla produkt- och paketpriser medan den pågår; ordinarie pris blir `oldPrice` (= lägsta pris senaste 30 dagarna, visas på produkt- och paketsidan). Före och efter är butiken som vanligt – inget att återställa. `CAMPAIGN_OFF=true` stänger av direkt.
- `regularPrice` på produkt och paket = pris utan kampanj. Admin läser katalogen med `getCatalog(locale, true)` (ordinarie priser) så att formulär aldrig sparar ett kampanjpris; annonsskrivaren använder också `regularPrice`.
- Inga andra rabatter under kampanjen: mängdrabatt och köperbjudande (variant B, A/B-testet pausas) stängs av i katalogen, kassan tar inte emot rabattkoder och påminnelsemejlen skickar ingen KORG10.
- Prenumeration: första leveransen får kampanjpriset, därefter vanliga 15 % på ordinarie pris (`subscriptionPrices`). Stripe-priset är det återkommande; mellanskillnaden dras som en engångskupong (`firstDeliveryDiscount`, `duration: once`) på första fakturan.
- Design: svart topprad med nedräkning (`components/campaign/CampaignBar`), svart banner överst på startsidan (`BlackWeekHero`, sidans h1), svarta märken (`Badge tone="campaign"`), kampanjpris i `text-sale`. Texter på alla språk i `src/i18n/messages/blackweek.ts`.
- Feeds: `g:price` = ordinarie, `g:sale_price` + `g:sale_price_effective_date`. Cron `/api/cron/campaign` (var 10:e min) förnyar katalogen inom 30 min efter start/slut, så att statiska sidor inte visar kampanjpris när kassan tagit ordinarie.
- Ny kampanj: lägg till i `campaigns` med nytt id och datum. Texterna i blackweek.ts är Black Week-specifika.

## Kampanjannonser per marknad (Meta)
- `buildSaleCampaign` (ads-engine.ts) skapar en PAUSAD kampanj per marknad under en pågående kampanj: prefix "Black Week · ", annonsgrupp med `countriesOf(locale)`, språkinriktning där länder delas (`adLocales`: nl 14, fr 1003, de 5), `end_time` = kampanjens slut, två annonser per produkt (pris/produkt). `addSaleVideoAd` lägger en video i marknadens befintliga annonsgrupp. Granskningsregeln (reviewAds) rör dem inte.
- Texten skrivs på marknadens språk av `writeSaleCopy` (gpt-5.4 via `AD_SALE_MODEL`, gpt-4o skrev stel finska) med kampanjens riktiga priser; spärrlista på alla språk (`bannedAnyLanguage`, även "effektiv/tehokas" och Sverige). Reserv = mall av `blackweek.ts`.
- Bilden: `src/lib/ad-sale-image.ts` (packshot på svart, rabatt och slutdatum på språket), renderas i Chrome och lagras i `ads/<kampanj-id>/<språk>/`.
- Körs lokalt: `npx tsx --env-file=.env.local --import ./scripts/server-shim.mjs scripts/meta-sale.mts [fi,da,…] [--budget=10] [--products=a,b] [--images-only]`. `server-shim.mjs` gör servermoduler (server-only, next/cache) körbara i tsx.
- Video: `scripts/meta-sale-video.mts <slug> "<mp4>" [språk] [--thumb=s]` – laddar upp en gång, väntar på Metas bearbetning, en annons per marknad i befintlig annonsgrupp.
- Black Week 2026: 7 kampanjer (fi, da, nl, de, fr, en, pl), 10 USD/dag var, skapade 2026-11-19. Bildannonser för allt i lager (Ashwagandha, Pine Pollen, Tongkat Ali Elite/Black, Fadogia, Blue Lotus; Ultra utelämnad, 3 i lager) + videon för Tongkat Ali Elite. Novel food annonseras på alla marknader utom sv (Albins beslut). `--add` lägger annonser i befintlig kampanj.
