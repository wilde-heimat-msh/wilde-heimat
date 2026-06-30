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
   - `ADMIN_URKUNDEN_PASSWORD` = sicheres Passwort (für `/admin/urkunden`)
6. **Deploy**

Nach dem Deploy ist die Seite unter `https://<projekt>.vercel.app` erreichbar.

### Schritt 3: Eigene Domain (später)

Wenn `wilde-heimat-msh.de` registriert ist:

1. Vercel → **Project Settings → Domains** → Domain hinzufügen
2. DNS beim Domain-Anbieter wie von Vercel angegeben eintragen
3. In Vercel setzen: `NEXT_PUBLIC_SITE_URL=https://wilde-heimat-msh.de`
4. Neu deployen

### Hinweis Paten-Portal & Admin

Auf Vercel sind Datei-Uploads und Patendaten **nicht dauerhaft** gespeichert (serverless). Öffentliche Seiten, Ratgeber, Patenschaften und Urkunden-Druck funktionieren. Paten-Verwaltung mit persistenten Daten braucht später einen VPS oder Vercel Blob/KV.

