-- Individuelles Zahlungsziel (Tag im Monat, 1–28) pro Patenschaft/Person
-- In Supabase SQL Editor ausführen

alter table public.patenschaft_paten
  add column if not exists zahlungsziel_tag smallint
    check (zahlungsziel_tag is null or (zahlungsziel_tag >= 1 and zahlungsziel_tag <= 28));

comment on column public.patenschaft_paten.zahlungsziel_tag is
  'Tag im Monat für Fälligkeit und Erinnerung (Standard: 5). Gilt pro Zugangscode/Person.';
