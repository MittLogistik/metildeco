-- Merchant Center (felaktig framställning): rätta produktfakta, bilder, förpackning, kategorier och pakettexter.
-- Fakta bekräftade av Albin 2026-10-04: tillverkat i Sverige av rotextrakt från ursprungsländerna, plastburk,
-- Ultra 60 kapslar 520 mg varav 20 mg eurycomanon, Black = Eurycoma longifolia 1–2 kapslar/dag, Ashwagandha 10 %.

-- 1) En bild per produkt: första bilden som inte är en baksida (baksidorna visar "Distributed by: Nordic Wave LLC").
--    Baksidor tas också bort ur berättelsebilderna. Filerna ligger kvar i lagringen.
UPDATE public.products p
SET images = ARRAY[(
  SELECT i FROM unnest(p.images) WITH ORDINALITY u(i, n)
  WHERE lower(i) NOT LIKE '%back%'
  ORDER BY n LIMIT 1
)]
WHERE cardinality(p.images) > 1
  AND EXISTS (SELECT 1 FROM unnest(p.images) i WHERE lower(i) NOT LIKE '%back%');

UPDATE public.products p
SET images = '{}'
WHERE cardinality(p.images) > 0
  AND NOT EXISTS (SELECT 1 FROM unnest(p.images) i WHERE lower(i) NOT LIKE '%back%');

UPDATE public.products p
SET story_images = ARRAY(SELECT i FROM unnest(p.story_images) WITH ORDINALITY u(i, n) WHERE lower(i) NOT LIKE '%back%' ORDER BY n)
WHERE EXISTS (SELECT 1 FROM unnest(p.story_images) i WHERE lower(i) LIKE '%back%');

-- 2) Förpackning: kapselprodukterna ligger i plastburk, inte påse (elektrolytpåsarna är egna varianter och rörs inte).
UPDATE public.products p
SET description = ARRAY(
      SELECT regexp_replace(d, '(packad|förpackad) i (en )?återförslutningsbar,? (och )?återvinningsbar (pappersbaserad )?påse', '\1 i plastburk', 'g')
      FROM unnest(p.description) WITH ORDINALITY u(d, n) ORDER BY n),
    bullets = ARRAY(
      SELECT regexp_replace(b, '(packad|förpackad) i (en )?återförslutningsbar,? (och )?återvinningsbar (pappersbaserad )?påse', '\1 i plastburk', 'g')
      FROM unnest(p.bullets) WITH ORDINALITY u(b, n) ORDER BY n)
WHERE p.slug NOT LIKE 'electrolyte%';

-- 3) Produktfakta
UPDATE public.products SET
  short = '200:1-rotextrakt av Eurycoma longifolia, 520 mg per kapsel varav 20 mg eurycomanon.',
  bullets = ARRAY['200:1 rotextrakt av Eurycoma longifolia', '520 mg per kapsel, varav 20 mg eurycomanon', '1 kapsel dagligen', '60 kapslar – räcker 60 dagar'],
  description = ARRAY[
    'Tongkat Ali Ultra 4% är ett 200:1-rotextrakt av roten från Eurycoma longifolia, även kallad Malaysian Ginseng eller Longjack. Varje kapsel innehåller 520 mg extrakt, varav 20 mg eurycomanon.',
    'Rent rotextrakt i vegansk kapsel – utan bindemedel, fyllnadsmedel eller konstgjorda tillsatser. Tillverkad i Sverige och packad i plastburk med 60 kapslar.'
  ]
WHERE slug = 'tongkat-premium';

UPDATE public.products SET
  short = 'Eurycoma longifolia på mörk rot – 200:1-extrakt, 500 mg per kapsel.',
  bullets = ARRAY['200:1 rotextrakt av Eurycoma longifolia (mörk rot)', '500 mg per kapsel – 1–2 kapslar dagligen', 'Vegetabiliskt kapselskal, utan fyllnadsmedel', '60 kapslar per burk'],
  description = ARRAY[
    'Black Tongkat Ali är ett 200:1-rotextrakt av Eurycoma longifolia, samma art som vår gula Tongkat Ali, gjort på mörk rot.',
    '500 mg extrakt per kapsel i vegetabiliskt kapselskal, utan fyllnadsmedel. Rekommenderad dos är 1–2 kapslar om dagen. Tillverkad i Sverige och packad i plastburk.'
  ]
WHERE slug = 'black-tongkat';

UPDATE public.products SET
  short = 'Standardiserat ashwagandha-extrakt från rot, 10 % withanolider.',
  bullets = ARRAY(
    SELECT regexp_replace(b, '5 % withanolider', '10 % withanolider', 'g') FROM unnest(bullets) WITH ORDINALITY u(b, n) ORDER BY n),
  description = ARRAY(
    SELECT regexp_replace(d, '5 % withanolider', '10 % withanolider', 'g') FROM unnest(description) WITH ORDINALITY u(d, n) ORDER BY n)
WHERE slug = 'ashwagandha';

-- 4) Kategorier utan antydd effekt (visas i filter, på produktsidan och som product_type i feeden)
UPDATE public.products SET category = 'Örter' WHERE category IN ('Lugn & sömn', 'Träning', 'Maghälsa');
UPDATE public.products SET category = 'Växtextrakt' WHERE category = 'Hud & hår';

-- 5) Paket: inga effektord, inga superlativ, rätt art för Black
UPDATE public.bundles SET
  short = 'Tongkat Ali Elite och Ultra 4% i samma paket – två styrkor att välja mellan.',
  description = ARRAY[
    'Tongkat Ali Extract Duo innehåller en burk Tongkat Ali Elite (200:1, 450 mg per kapsel) och en burk Tongkat Ali Ultra 4% (200:1, 520 mg per kapsel varav 20 mg eurycomanon).',
    'Båda är rotextrakt av Eurycoma longifolia i vegansk kapsel, utan fyllnadsmedel. Tillverkade i Sverige och packade i plastburk. Paketet har alltid fri frakt.'
  ],
  seo_description = 'Tongkat Ali Extract Duo: Tongkat Ali Elite och Ultra 4% i samma paket. Rotextrakt av Eurycoma longifolia, tillverkade i Sverige, fri frakt.'
WHERE slug = 'tongkat-ali-extract-duo';

UPDATE public.bundles SET
  name = 'Dag & kväll-paketet',
  description = ARRAY[
    'Dag & kväll-paketet innehåller Tongkat Ali Elite och Fadogia Agrestis, som många tar på dagen, och Blue Lotus, som många tar på kvällen. Tre burkar i samma leverans.',
    'Tongkat Ali Elite är ett 200:1-rotextrakt, Fadogia Agrestis ett 20:1-extrakt och Blue Lotus ett 200:1-extrakt, alla i vegansk kapsel utan fyllnadsmedel. Tillverkade i Sverige och packade i plastburk. Paketet har alltid fri frakt.'
  ],
  seo_description = 'Dag & kväll-paketet: Tongkat Ali Elite 200:1, Fadogia Agrestis 20:1 och Blue Lotus 200:1. 3 × 60 veganska kapslar, tillverkade i Sverige, fri frakt.'
WHERE slug = 'performance-paketet';

UPDATE public.bundles SET
  description = ARRAY[
    'Tongkat Ali & Fadogia Duo innehåller en burk Tongkat Ali Elite (200:1-rotextrakt av Eurycoma longifolia, 450 mg per kapsel) och en burk Fadogia Agrestis (20:1-extrakt).',
    'Båda i vegansk kapsel utan fyllnadsmedel, tillverkade i Sverige och packade i plastburk. Paketet har alltid fri frakt.'
  ]
WHERE slug = 'tongkat-ali-fadogia-duo';

UPDATE public.bundles SET
  short = 'Tongkat Ali Elite och Tongkat Ali Black i samma paket – två rotextrakt av Eurycoma longifolia.',
  description = ARRAY[
    'Tongkat Ali Variety Duo innehåller en burk Tongkat Ali Elite och en burk Tongkat Ali Black. Båda är 200:1-rotextrakt av Eurycoma longifolia; Black görs på mörk rot.',
    'Elite har 450 mg per kapsel och tas 1 kapsel om dagen. Black har 500 mg per kapsel och tas 1–2 kapslar om dagen. Tillverkade i Sverige och packade i plastburk. Paketet har alltid fri frakt.'
  ],
  seo_description = 'Tongkat Ali Variety Duo: Tongkat Ali Elite och Tongkat Ali Black, båda rotextrakt av Eurycoma longifolia. Tillverkade i Sverige, fri frakt.'
WHERE slug = 'tongkat-ali-variety-duo';

UPDATE public.bundle_components SET blurb = '200:1-rotextrakt av Eurycoma longifolia med 450 mg per kapsel. En kapsel om dagen.'
WHERE bundle_slug = 'performance-paketet' AND product_slug = 'tongkat-ali-elite';

UPDATE public.bundle_components SET blurb = '200:1-rotextrakt av Eurycoma longifolia på mörk rot, 500 mg per kapsel, 1–2 kapslar om dagen.'
WHERE product_slug = 'black-tongkat' AND bundle_slug IN ('tongkat-ali-discovery-trio', 'tongkat-ali-variety-duo');
