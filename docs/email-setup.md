# E-Mail-Benachrichtigungen für Formulare

Neue Formular-Anfragen werden **immer in Supabase gespeichert** und im Admin unter **Anfragen** angezeigt (inkl. Fotos).

Zusätzlich kann bei jedem Eingang eine **E-Mail an `kontakt@wilde-heimat-msh.de`** verschickt werden – über euer **Checkdomain-Postfach** (SMTP).

## Ablauf

1. Besucher sendet Formular (Kontakt, Patenschaft, Fundmeldung, …)
2. Daten landen in Supabase → sichtbar unter `/admin/anfragen`
3. Optional: E-Mail mit allen Feldern (+ Foto als Anhang bei Fundmeldungen) an euch

## Checkdomain SMTP einrichten (empfohlen)

### 1. Server-Daten aus Checkdomain holen

1. [checkdomain Kundenbereich](https://www.checkdomain.de) → **E-Mails**
2. Neben `kontakt@wilde-heimat-msh.de` auf das **Zahnrad** klicken
3. Unten **E-Mail-Server-Infos** öffnen
4. Notieren: **Postausgang (SMTP)** – Server-Adresse und Port (meist **587** mit STARTTLS oder **465** mit SSL)

### 2. Variablen in Vercel setzen

**Settings → Environment Variables → Production:**

```
SMTP_HOST=<Postausgangsserver aus Checkdomain>
SMTP_PORT=587
SMTP_USER=kontakt@wilde-heimat-msh.de
SMTP_PASS=<Postfach-Passwort>
FORM_MAIL_TO=kontakt@wilde-heimat-msh.de
```

Optional (Standard ist schon `Wilde Heimat <kontakt@wilde-heimat-msh.de>`):

```
FORM_MAIL_FROM=Wilde Heimat <kontakt@wilde-heimat-msh.de>
```

Bei Port **465** zusätzlich:

```
SMTP_SECURE=true
```

### 3. Redeploy

Nach dem Speichern der Variablen in Vercel ein **Redeploy** auslösen.

### 4. Test

1. Kontaktformular auf https://www.wilde-heimat-msh.de ausfüllen
2. Posteingang von `kontakt@wilde-heimat-msh.de` prüfen
3. Fundmeldung mit Foto testen → Foto als Anhang + Link im Admin
4. Admin → **Anfragen** → grüner Hinweis „E-Mail wird gesendet“

## Alle relevanten Variablen

| Variable | Beschreibung |
|----------|--------------|
| `SMTP_HOST` | Postausgangsserver von Checkdomain |
| `SMTP_PORT` | Meist `587` (STARTTLS) oder `465` (SSL) |
| `SMTP_SECURE` | `true` bei Port 465 |
| `SMTP_USER` | E-Mail-Adresse des Postfachs |
| `SMTP_PASS` | Passwort des Postfachs |
| `FORM_MAIL_TO` | Empfänger (Standard: `kontakt@wilde-heimat-msh.de`) |
| `FORM_MAIL_FROM` | Absender (optional) |

## Fehlerbehebung

- **Keine E-Mail, aber Admin zeigt Anfrage:** SMTP-Zugangsdaten prüfen – Supabase speichert trotzdem.
- **Verbindung schlägt fehl:** `SMTP_HOST` und `SMTP_PORT` mit Checkdomain-Server-Infos abgleichen.
- **Falsches Passwort:** Postfach-Passwort im Checkdomain-Kundenbereich zurücksetzen.
- **Foto fehlt in E-Mail:** Fundmeldung erneut testen; Anhang max. 8 MB (JPG, PNG, WebP, GIF).

## Alternative: Resend (optional)

Falls SMTP nicht funktionieren soll, kann alternativ `RESEND_API_KEY` gesetzt werden. SMTP hat Vorrang, wenn beides konfiguriert ist.
