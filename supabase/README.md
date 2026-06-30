# Supabase einrichten

Backend für Formulare, Paten-Daten und Foto-Uploads.

## 1. Projekt anlegen

1. [supabase.com](https://supabase.com) → **New project**
2. Region: **Frankfurt (eu-central-1)** (nah an DE)
3. Datenbank-Passwort notieren

## 2. Datenbank-Schema

1. Supabase → **SQL Editor** → New query
2. Inhalt von `supabase/schema.sql` einfügen → **Run**

## 3. Storage (Fotos)

1. Supabase → **Storage** → **New bucket**
2. Name: `uploads`
3. **Public bucket**: aktivieren
4. Ordner entstehen automatisch: `paten-updates/`, `form-uploads/`

## 4. API-Schlüssel für Vercel

Supabase → **Project Settings** → **API**:

| Variable | Woher |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | service_role (geheim, nur Server!) |

In **Vercel → Environment Variables** eintragen → **Redeploy**.

## 5. Formular-Eingänge ansehen

Supabase → **Table Editor** → `form_submissions`

Optional zusätzlich `RESEND_API_KEY` für E-Mail-Benachrichtigung bei neuen Anfragen.

## Lokal ohne Supabase

Ohne die Variablen läuft die Website mit lokalem Dateispeicher (`data/patenschaft/`).
