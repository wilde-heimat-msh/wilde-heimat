-- Protokoll für automatische und manuelle Patenschafts-Zahlungserinnerungen
-- In Supabase SQL Editor ausführen

CREATE TABLE IF NOT EXISTS patenschaft_zahlungserinnerungen (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  access_code text NOT NULL,
  pate_id text,
  period text NOT NULL CHECK (period ~ '^\d{4}-\d{2}$'),
  recipient_email text NOT NULL DEFAULT '',
  recipient_name text NOT NULL DEFAULT '',
  subject text NOT NULL DEFAULT '',
  status text NOT NULL CHECK (status IN ('sent', 'failed', 'skipped')),
  trigger text NOT NULL CHECK (trigger IN ('auto', 'manual')) DEFAULT 'auto',
  error_message text,
  sent_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_patenschaft_erinnerungen_access_period
  ON patenschaft_zahlungserinnerungen (upper(trim(access_code)), period DESC);

CREATE INDEX IF NOT EXISTS idx_patenschaft_erinnerungen_period
  ON patenschaft_zahlungserinnerungen (period DESC, created_at DESC);
