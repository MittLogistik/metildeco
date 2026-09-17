CREATE TABLE public.shipping_zones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  name text NOT NULL,
  countries text[] NOT NULL DEFAULT '{}',
  is_fallback boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.shipping_zones TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.shipping_zones TO authenticated;
GRANT ALL ON public.shipping_zones TO service_role;

ALTER TABLE public.shipping_zones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read shipping zones"
  ON public.shipping_zones FOR SELECT TO anon, authenticated
  USING (active = true);

CREATE POLICY "Admins manage shipping zones"
  ON public.shipping_zones FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER shipping_zones_set_updated_at
  BEFORE UPDATE ON public.shipping_zones
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.shipping_rates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  zone_code text NOT NULL REFERENCES public.shipping_zones(code) ON DELETE CASCADE ON UPDATE CASCADE,
  method text NOT NULL,
  currency text NOT NULL,
  price numeric NOT NULL DEFAULT 0,
  free_over numeric,
  sort_order integer NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT shipping_rates_unique UNIQUE (zone_code, method, currency)
);

GRANT SELECT ON public.shipping_rates TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.shipping_rates TO authenticated;
GRANT ALL ON public.shipping_rates TO service_role;

ALTER TABLE public.shipping_rates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read shipping rates"
  ON public.shipping_rates FOR SELECT TO anon, authenticated
  USING (active = true);

CREATE POLICY "Admins manage shipping rates"
  ON public.shipping_rates FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER shipping_rates_set_updated_at
  BEFORE UPDATE ON public.shipping_rates
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.shipping_zones (code, name, countries, is_fallback, sort_order) VALUES
  ('se', 'Sverige', ARRAY['SE'], false, 1),
  ('nordic', 'Norden', ARRAY['DK','NO','FI','IS'], false, 2),
  ('eu', 'EU', ARRAY['DE','NL','FR','ES','IT','PL','BE','AT','IE','PT','CZ','EE','LV','LT','SK','SI','HU','HR','RO','BG','GR','LU','CY','MT'], false, 3),
  ('world', 'Övriga världen', ARRAY[]::text[], true, 4);

INSERT INTO public.shipping_rates (zone_code, method, currency, price, free_over, sort_order) VALUES
  ('se','varubrev','SEK',39,499,1),
  ('se','varubrev','EUR',3.5,45,1),
  ('se','varubrev','DKK',26,349,1),
  ('se','varubrev','NOK',41,529,1),
  ('se','varubrev','GBP',2.9,38,1),
  ('se','varubrev','USD',4,52,1),
  ('se','varubrev','PLN',15,189,1),
  ('se','tracked-letter','SEK',49,499,2),
  ('se','tracked-letter','EUR',4.5,45,2),
  ('se','tracked-letter','DKK',33,349,2),
  ('se','tracked-letter','NOK',52,529,2),
  ('se','tracked-letter','GBP',3.7,38,2),
  ('se','tracked-letter','USD',5,52,2),
  ('se','tracked-letter','PLN',19,189,2),
  ('se','ombud','SEK',59,499,3),
  ('se','ombud','EUR',5.5,45,3),
  ('se','ombud','DKK',39,349,3),
  ('se','ombud','NOK',62,529,3),
  ('se','ombud','GBP',4.5,38,3),
  ('se','ombud','USD',6,52,3),
  ('se','ombud','PLN',22,189,3),
  ('nordic','tracked-letter','SEK',69,699,1),
  ('nordic','tracked-letter','EUR',6.5,65,1),
  ('nordic','tracked-letter','DKK',46,469,1),
  ('nordic','tracked-letter','NOK',73,739,1),
  ('nordic','tracked-letter','GBP',5.5,55,1),
  ('nordic','tracked-letter','USD',7,72,1),
  ('nordic','tracked-letter','PLN',27,269,1),
  ('eu','tracked-letter','SEK',89,899,1),
  ('eu','tracked-letter','EUR',8,79,1),
  ('eu','tracked-letter','DKK',59,599,1),
  ('eu','tracked-letter','NOK',94,949,1),
  ('eu','tracked-letter','GBP',7,69,1),
  ('eu','tracked-letter','USD',9,92,1),
  ('eu','tracked-letter','PLN',34,339,1),
  ('world','tracked-letter','SEK',149,1499,1),
  ('world','tracked-letter','EUR',13,132,1),
  ('world','tracked-letter','DKK',99,999,1),
  ('world','tracked-letter','NOK',157,1579,1),
  ('world','tracked-letter','GBP',11,113,1),
  ('world','tracked-letter','USD',15,155,1),
  ('world','tracked-letter','PLN',56,569,1);