-- Polen (pl, PLN): priser omräknade från dagens europriser (beslut 2026-11-02): PLN ≈ EUR × 4,3,
-- uppåt till hela zloty som slutar på 9 (19,95 € → 89 zł, 21,95 € → 99 zł). Inga jämförpriser.
-- Gamla PLN-rader från förra butiken skrivs över.
INSERT INTO public.product_prices (product_slug, currency, price, old_price)
SELECT product_slug, 'PLN', ceil((price * 4.3 + 1) / 10) * 10 - 1, NULL
FROM public.product_prices
WHERE currency = 'EUR'
ON CONFLICT (product_slug, currency) DO UPDATE SET price = EXCLUDED.price, old_price = NULL, updated_at = now();

INSERT INTO public.bundle_prices (bundle_slug, currency, price, old_price)
SELECT bundle_slug, 'PLN', ceil((price * 4.3 + 1) / 10) * 10 - 1, NULL
FROM public.bundle_prices
WHERE currency = 'EUR'
ON CONFLICT (bundle_slug, currency) DO UPDATE SET price = EXCLUDED.price, old_price = NULL, updated_at = now();

-- Kurs för egna SEK-sammanställningar (statisk, som EUR 11,3 och DKK 1,52): 11,3 / 4,3 ≈ 2,63
INSERT INTO public.exchange_rates (currency, rate_to_sek)
VALUES ('PLN', 2.63)
ON CONFLICT (currency) DO UPDATE SET rate_to_sek = EXCLUDED.rate_to_sek, updated_at = now();
