-- Annonsbilder (genererade via Higgsfield, packshots eller egna uppladdningar) och vilka annonser som byggts av dem.
CREATE TABLE IF NOT EXISTS public.ad_creatives (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  product_slug text NOT NULL,
  -- scene = AI-genererad scen, upload = egen bild
  kind text NOT NULL DEFAULT 'scene',
  scene_id text,
  prompt text,
  -- Alla format som hör till samma scen delar group_id (1:1 för flöde, 9:16 för stories)
  group_id uuid NOT NULL,
  format text NOT NULL,          -- '1:1' | '9:16' | '3:4'
  url text NOT NULL,
  storage_path text,
  parent_group_id uuid,          -- scenen den itererades från
  active boolean NOT NULL DEFAULT true
);
CREATE INDEX IF NOT EXISTS ad_creatives_product_idx ON public.ad_creatives (product_slug, created_at DESC);
CREATE INDEX IF NOT EXISTS ad_creatives_group_idx ON public.ad_creatives (group_id);
ALTER TABLE public.ad_creatives ENABLE ROW LEVEL SECURITY;
GRANT ALL ON public.ad_creatives TO service_role;

-- Vilken textvinkel och bildgrupp varje Meta-annons består av, så att vinnare kan itereras.
CREATE TABLE IF NOT EXISTS public.ad_variants (
  ad_id text PRIMARY KEY,
  created_at timestamptz NOT NULL DEFAULT now(),
  campaign_id text NOT NULL,
  adset_id text NOT NULL,
  product_slug text NOT NULL,
  angle_id text NOT NULL,
  group_id uuid,                 -- null = packshot
  media_label text NOT NULL,
  parent_ad_id text,             -- vinnaren den itererades från
  iterated_at timestamptz
);
ALTER TABLE public.ad_variants ENABLE ROW LEVEL SECURITY;
GRANT ALL ON public.ad_variants TO service_role;
