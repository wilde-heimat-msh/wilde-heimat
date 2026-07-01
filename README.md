# Wilde Heimat – Website (Private Initiative)

Website für **Wilde Heimat** – ein privates Herzensprojekt von Juja für Waschbärhilfe, Aufklärung und Vermittlung in Sachsen-Anhalt.

> **Hinweis:** Dies ist aktuell **kein Verein** und **keine gemeinnützige Organisation**. Vereinsunterlagen für eine spätere Gründung liegen separat in `verein-vorbereitung/` und gehören **nicht** zur öffentlichen Website.

## Technologie

- **Next.js 16** (App Router, TypeScript)
- **Tailwind CSS 4** + Framer Motion
- Mobile First, SEO-optimiert, DSGVO-vorbereitet

## Entwicklung

```bash
cd wilde-heimat
npm install
npm run dev
```

## Seiten

| Route | Inhalt |
|-------|--------|
| `/` | Startseite |
| `/ueber-uns` | Geschichte, Juja, Werte |
| `/waschbaeren` | 12 Waschbär-Profile |
| `/patenschaften` | Patenschaftsstufen + Formular |
| `/unterstuetzen` | Freiwillige Unterstützung |
| `/ratgeber` | 9 Aufklärungsartikel |
| `/hilfe` | Fund melden, Pflegestelle, Vermittlung |
| `/kontakt` | Kontaktformular |
| `/impressum` | Impressum (private Initiative) |
| `/datenschutz` | Datenschutzerklärung |

Alte URLs leiten weiter: `/spenden` → `/unterstuetzen`, `/vermittlung` → `/hilfe`

## Organisationsmodus

Siehe `src/data/organization.ts` – aktuell `mode: "private"`. Bei Vereinsgründung umstellen und `verein-vorbereitung/` nutzen.

## Build

```bash
npm run build
npm start
```

## Deployment auf Vercel

Die Website ist für Vercel vorbereitet. Zuerst mit der Vercel-URL online stellen, die eigene Domain später verbinden.

### Schritt 1: Projekt auf GitHub pushen

```bash
git add .
git commit -m "Website für Vercel-Deployment vorbereiten"
git push origin main
```

### Schritt 2: Vercel verbinden

1. [vercel.com](https://vercel.com) → **Add New Project**
2. GitHub-Repository auswählen
3. **Root Directory:** `wilde-heimat` (falls das Repo den Ordner enthält) oder Projektroot
4. Framework: **Next.js** (wird automatisch erkannt)
5. **Environment Variables** setzen:
   - `ADMIN_URKUNDEN_PASSWORD` = sicheres Passwort
   - `NEXT_PUBLIC_SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` (siehe `supabase/README.md`)
   - Optional: `RESEND_API_KEY` für E-Mail bei neuen Formularen
6. **Deploy**

Nach dem Deploy ist die Seite unter `https://<projekt>.vercel.app` erreichbar.

### Schritt 3: Eigene Domain (live)

Domain `wilde-heimat-msh.de` bei Checkdomain → Vercel:

1. Vercel → **Project Settings → Domains** → `wilde-heimat-msh.de` + `www.wilde-heimat-msh.de`
2. DNS bei Checkdomain:
   - **Haupt-IP (A):** `216.198.79.1` (oder aktuelle IP laut Vercel)
   - **CNAME www:** Wert aus Vercel (z. B. `….vercel-dns-017.com`)
   - **Inklusive www:** Nein
   - **E-Mail / MX / SPF:** unverändert lassen
3. In Vercel setzen:

```
NEXT_PUBLIC_SITE_URL=https://www.wilde-heimat-msh.de
```

4. **Redeploy** – kanonische URLs, Sitemap und OG-Tags nutzen dann `www`

> `wilde-heimat-msh.de` (ohne www) leitet bei Vercel per 308 auf `www` weiter.

### Backend (Supabase)

Formulare, Paten-Daten und Fotos laufen über **Supabase** (PostgreSQL + Storage). Einrichtung: `supabase/README.md`.

Optional: **Resend** für E-Mail-Benachrichtigungen an `kontakt@wilde-heimat-msh.de` – Anleitung: [`docs/email-setup.md`](docs/email-setup.md).

