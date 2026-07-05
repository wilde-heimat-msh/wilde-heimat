-- Patenschafts-Zahlungen (Banküberweisungen) erfassen
-- In Supabase SQL Editor ausführen

CREATE TABLE IF NOT EXISTS patenschaft_zahlungen (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  access_code text NOT NULL,
  period text NOT NULL CHECK (period ~ '^\d{4}-\d{2}$'),
  amount numeric(10, 2) NOT NULL CHECK (amount > 0),
  paid_at date NOT NULL,
  note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (access_code, period)
);

CREATE INDEX IF NOT EXISTS idx_patenschaft_zahlungen_access_code
  ON patenschaft_zahlungen (upper(trim(access_code)));

CREATE INDEX IF NOT EXISTS idx_patenschaft_zahlungen_period
  ON patenschaft_zahlungen (period DESC);
