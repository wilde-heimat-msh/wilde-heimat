# E-Mail-Benachrichtigungen für Formulare

Neue Formular-Anfragen werden **immer in Supabase gespeichert** und im Admin unter **Anfragen** angezeigt (inkl. Fotos).

Zusätzlich kann bei jedem Eingang eine **E-Mail an `kontakt@wilde-heimat-msh.de`** verschickt werden – sobald Resend eingerichtet ist.

## Ablauf

1. Besucher sendet Formular (Kontakt, Patenschaft, Fundmeldung, …)
2. Daten landen in Supabase → sichtbar unter `/admin/anfragen`
3. Optional: E-Mail mit allen Feldern (+ Foto als Anhang bei Fundmeldungen) an euch

## Phase 1 – Jetzt (ohne eigene Domain)

Formulare funktionieren über Supabase. E-Mails können schon getestet werden, solange Resend nur an die **verifizierte Test-Adresse** sendet.

### Resend einrichten

1. Konto auf [resend.com](https://resend.com) anlegen
2. **API Keys** → neuen Key erstellen
3. In **Vercel → Environment Variables** eintragen:

```
RESEND_API_KEY=re_xxxxxxxx
FORM_MAIL_TO=kontakt@wilde-heimat-msh.de
```

4. **Ohne Domain-Verifizierung** muss der Absender vorerst sein:

```
FORM_MAIL_FROM=Wilde Heimat <onboarding@resend.dev>
```

5. Vercel neu deployen

> Resend erlaubt ohne Domain nur Versand **an die E-Mail-Adresse eures Resend-Kontos**. Zum Testen reicht das. Alle Anfragen seht ihr trotzdem im Admin.

## Phase 2 – Sobald `wilde-heimat-msh.de` freigeschaltet ist

### Domain bei Resend verifizieren

1. Resend → **Domains** → **Add Domain** → `wilde-heimat-msh.de`
2. Die angezeigten **DNS-Einträge** (SPF, DKIM, ggf. MX) beim Domain-Anbieter eintragen
3. Warten bis Resend „Verified“ anzeigt

### Vercel-Umgebungsvariablen anpassen

```
RESEND_API_KEY=re_xxxxxxxx
FORM_MAIL_TO=kontakt@wilde-heimat-msh.de
FORM_MAIL_FROM=Wilde Heimat <kontakt@wilde-heimat-msh.de>
FORM_MAIL_DOMAIN_VERIFIED=true
```

Alternativ nur `FORM_MAIL_DOMAIN_VERIFIED=true` setzen – dann wird `kontakt@wilde-heimat-msh.de` automatisch als Absender verwendet.

### Test

1. Kontaktformular auf der Live-Website ausfüllen
2. E-Mail an `kontakt@wilde-heimat-msh.de` prüfen
3. Fundmeldung mit Foto testen → Foto als Anhang + Vorschau-Link
4. Admin → **Anfragen** → Eintrag mit Bildvorschau prüfen

## Alle relevanten Variablen

| Variable | Beschreibung |
|----------|--------------|
| `RESEND_API_KEY` | API-Schlüssel von Resend (aktiviert E-Mail-Versand) |
| `FORM_MAIL_TO` | Empfänger (Standard: `kontakt@wilde-heimat-msh.de`) |
| `FORM_MAIL_FROM` | Absender (überschreibt automatische Logik) |
| `FORM_MAIL_DOMAIN_VERIFIED` | `true` → Absender `kontakt@wilde-heimat-msh.de` |

## Fehlerbehebung

- **Keine E-Mail, aber Admin zeigt Anfrage:** `RESEND_API_KEY` fehlt oder ist falsch – Supabase speichert trotzdem.
- **E-Mail kommt nicht an:** Domain noch nicht verifiziert und `FORM_MAIL_FROM` nicht `onboarding@resend.dev`.
- **Foto fehlt in E-Mail:** Fundmeldung erneut testen; Anhang max. 8 MB (JPG, PNG, WebP, GIF).
