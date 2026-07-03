-- Paten-Kartei: erweiterte Felder + Verknüpfung mit Patenschafts-Anfragen
-- Supabase SQL Editor → Run

alter table public.patenschaft_paten
  add column if not exists form_submission_id uuid references public.form_submissions (id) on delete set null,
  add column if not exists anschrift text,
  add column if not exists telefon text,
  add column if not exists urkunden_nr text,
  add column if not exists ausgestellt_am date,
  add column if not exists is_gift boolean not null default false,
  add column if not exists beschenkter_name text,
  add column if not exists beschenkter_anschrift text,
  add column if not exists grussbotschaft text,
  add column if not exists widerruf_bestaetigt_at timestamptz,
  add column if not exists datenschutz_bestaetigt_at timestamptz,
  add column if not exists patenschaft_start date;

create unique index if not exists patenschaft_paten_form_submission_idx
  on public.patenschaft_paten (form_submission_id)
  where form_submission_id is not null;
