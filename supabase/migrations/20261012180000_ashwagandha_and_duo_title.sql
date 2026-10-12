-- Ashwagandha: punkten "600 mg per dagsdos" stämde inte med produktsidan (400 mg per kapsel, 2–3 kapslar dagligen).
update public.products
set bullets = array_replace(bullets, '600 mg per dagsdos', '400 mg per kapsel'), updated_at = now()
where slug = 'ashwagandha';

-- Extract Duo: SEO-titeln "Kombinera för Optimal Effekt" var ett effektpåstående.
update public.bundles
set seo_title = 'Tongkat Ali Extract Duo – två styrkor i ett paket | Metilde', updated_at = now()
where slug = 'tongkat-ali-extract-duo';
