-- Ein Zugangscode pro Person, mehrere Patentiere (Waschbären) pro Code
-- Supabase SQL Editor → Run

drop index if exists public.patenschaft_paten_access_code_idx;

create unique index if not exists patenschaft_paten_code_waschbaer_idx
  on public.patenschaft_paten (upper(trim(access_code)), waschbaer_slug);
