-- Merchant Center, andra omgången: pakettexter utan antydd effekt, superlativ eller ostyrkta påståenden
-- ("mest populära", "kraftfulla", "potenta", "förstklassig", "hur din kropp reagerar").

UPDATE public.bundles SET
  short = 'Tongkat Ali Elite, Ultra 4% och Black i samma paket – hela vårt Tongkat Ali-sortiment.',
  description = ARRAY[
    'Tongkat Ali Discovery Trio innehåller en burk av var och en av våra tre Tongkat Ali-varianter. Alla är 200:1-rotextrakt av Eurycoma longifolia.',
    'Elite har 450 mg per kapsel och tas 1 kapsel om dagen. Ultra 4% har 520 mg per kapsel, varav 20 mg eurycomanon, och tas 1 kapsel om dagen. Black görs på mörk rot, har 500 mg per kapsel och tas 1–2 kapslar om dagen.',
    'Alla i vegansk kapsel utan fyllnadsmedel, tillverkade i Sverige och packade i plastburk med 60 kapslar. Följ den rekommenderade dosen för varje produkt och ta en produkt i taget. Paketet har alltid fri frakt.'
  ],
  seo_description = 'Tongkat Ali Discovery Trio: Elite, Ultra 4% och Black i samma paket. 200:1-rotextrakt av Eurycoma longifolia, tillverkade i Sverige, fri frakt.'
WHERE slug = 'tongkat-ali-discovery-trio';

UPDATE public.bundles SET
  short = 'Fyra av våra extrakt i samma paket: Tongkat Ali Elite, Ultra 4%, Fadogia Agrestis och Blue Lotus.',
  description = ARRAY[
    'Metilde Botanical Collection innehåller en burk vardera av Tongkat Ali Elite (200:1, 450 mg per kapsel), Tongkat Ali Ultra 4% (200:1, 520 mg per kapsel varav 20 mg eurycomanon), Fadogia Agrestis (20:1) och Blue Lotus (200:1).',
    'Alla i vegansk kapsel utan fyllnadsmedel, tillverkade i Sverige och packade i plastburk med 60 kapslar. Följ den rekommenderade dosen på varje burk och börja med en produkt i taget. Paketet har alltid fri frakt.'
  ],
  seo_description = 'Metilde Botanical Collection: Tongkat Ali Elite, Ultra 4%, Fadogia Agrestis och Blue Lotus i samma paket. Tillverkade i Sverige, fri frakt.'
WHERE slug = 'metilde-botanical-collection';

UPDATE public.bundles SET
  short = 'Tongkat Ali Elite och Fadogia Agrestis i samma paket – två extrakt i vegansk kapsel.'
WHERE slug = 'tongkat-ali-fadogia-duo';
