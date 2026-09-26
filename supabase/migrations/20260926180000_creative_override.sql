-- "Godkänn ändå": admin kan köra över AI-granskningens underkännande av en annonsbild.
-- Bilden aktiveras och poängen ignoreras av annonsmotorn.
ALTER TABLE public.ad_creatives ADD COLUMN IF NOT EXISTS approved_override boolean NOT NULL DEFAULT false;
