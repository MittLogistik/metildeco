-- Om annonstexten skrevs av AI eller kom från mallen i src/content/ad-copy.ts
ALTER TABLE public.ad_variants ADD COLUMN IF NOT EXISTS copy_source text;
