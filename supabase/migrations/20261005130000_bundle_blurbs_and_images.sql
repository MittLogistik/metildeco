-- Merchant Center, andra omgången: produkttexterna i paketen (bundle_components.blurb) utan effektord,
-- superlativ eller fel art, och AI-bilden med förvrängd etikett bort från Tongkat Ali Black.

UPDATE public.bundle_components SET blurb = CASE product_slug
  WHEN 'tongkat-ali-elite' THEN '200:1-rotextrakt av Eurycoma longifolia, 450 mg per kapsel. 1 kapsel om dagen.'
  WHEN 'tongkat-premium' THEN '200:1-rotextrakt av Eurycoma longifolia, 520 mg per kapsel varav 20 mg eurycomanon. 1 kapsel om dagen.'
  WHEN 'black-tongkat' THEN '200:1-rotextrakt av Eurycoma longifolia på mörk rot, 500 mg per kapsel. 1–2 kapslar om dagen.'
  WHEN 'fadogia-agrestis' THEN '20:1-extrakt av Fadogia agrestis i vegansk kapsel, utan fyllnadsmedel.'
  WHEN 'blue-lotus' THEN '200:1-extrakt av blå lotus (Nymphaea caerulea), 400 mg per kapsel. Många tar den på kvällen.'
  ELSE blurb END
WHERE product_slug IN ('tongkat-ali-elite', 'tongkat-premium', 'black-tongkat', 'fadogia-agrestis', 'blue-lotus');

UPDATE public.products p
SET images = ARRAY(SELECT i FROM unnest(p.images) WITH ORDINALITY u(i, n) WHERE lower(i) NOT LIKE '%gemini%' ORDER BY n),
    story_images = ARRAY(SELECT i FROM unnest(p.story_images) WITH ORDINALITY u(i, n) WHERE lower(i) NOT LIKE '%gemini%' ORDER BY n),
    story_hero_image = CASE WHEN lower(coalesce(p.story_hero_image, '')) LIKE '%gemini%' THEN NULL ELSE p.story_hero_image END
WHERE EXISTS (SELECT 1 FROM unnest(p.images || p.story_images) i WHERE lower(i) LIKE '%gemini%')
   OR lower(coalesce(p.story_hero_image, '')) LIKE '%gemini%';
