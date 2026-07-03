import type { PatenDokumentId } from "@/data/patenDokumente";
import { siteConfig } from "@/data/site";

export type PatenEmailVorlageId =
  | "urkunde-vorab"
  | "zahlungsinfo"
  | "patenschaft-komplett"
  | "weiteres-patentier"
  | "freitext";

export type PatenEmailPlatzhalter = {
  name: string;
  waschbaer: string;
  stufe: string;
  preis: string;
  zugangscode: string;
  urkundenNr: string;
  portalLink: string;
};

export type PatenEmailVorlage = {
  id: PatenEmailVorlageId;
  label: string;
  description: string;
  subject: string;
  body: string;
  dokumente: PatenDokumentId[];
};

export const patenEmailVorlagen: PatenEmailVorlage[] = [
  {
    id: "urkunde-vorab",
    label: "Urkunde vorab (PDF)",
    description: "Digitale Urkunde vor dem Postversand – mit Hinweis auf die gedruckte Version.",
    subject: "Deine Patenschaftsurkunde für {{waschbaer}} – Wilde Heimat",
    body: `Liebe/r {{name}},

herzlichen Dank für deine Patenschaft für {{waschbaer}} in der {{stufe}}-Stufe ({{preis}} €/Monat)!

Im Anhang findest du deine personalisierte Patenschaftsurkunde als PDF. Die gedruckte Urkunde senden wir dir zusätzlich per Post an die von dir angegebene Adresse.

Dein Zugangscode für Paten-Updates: {{zugangscode}}
Paten-Bereich: {{portalLink}}

Bei Fragen erreichst du uns jederzeit unter ${siteConfig.email}.

Herzliche Grüße
Julia Rothmann
Wilde Heimat`,
    dokumente: ["urkunde"],
  },
  {
    id: "zahlungsinfo",
    label: "Zahlungsinformationen",
    description: "PayPal-Hinweise und monatlicher Beitrag.",
    subject: "Zahlungsinformationen zu deiner Patenschaft – {{waschbaer}}",
    body: `Liebe/r {{name}},

vielen Dank für deine Patenschaft für {{waschbaer}}!

Im Anhang findest du die Zahlungsinformationen zu deiner {{stufe}}-Patenschaft ({{preis}} €/Monat). Wir senden dir in Kürze den persönlichen PayPal-Link für die monatliche Unterstützung.

Bei Fragen: ${siteConfig.email}

Herzliche Grüße
Julia Rothmann
Wilde Heimat`,
    dokumente: ["zahlungsinfo"],
  },
  {
    id: "patenschaft-komplett",
    label: "Patenschaft komplett",
    description: "Urkunde, Bestätigung und Zahlungsinformationen in einer E-Mail.",
    subject: "Willkommen als Pate/Patin von {{waschbaer}} – Wilde Heimat",
    body: `Liebe/r {{name}},

willkommen in der Wilde-Heimat-Familie! Wir freuen uns sehr über deine Patenschaft für {{waschbaer}} ({{stufe}}, {{preis}} €/Monat).

Im Anhang findest du:
• deine Patenschaftsurkunde (PDF – die gedruckte Version folgt per Post)
• die Patenschaftsbestätigung
• die Zahlungsinformationen

Dein Zugangscode für Paten-Updates: {{zugangscode}}
Paten-Bereich: {{portalLink}}

Bei Fragen sind wir für dich da: ${siteConfig.email}

Herzliche Grüße
Julia Rothmann
Wilde Heimat`,
    dokumente: ["urkunde", "patenschaft-bestaetigung", "zahlungsinfo"],
  },
  {
    id: "weiteres-patentier",
    label: "Weiteres Patentier",
    description: "Urkunde und Unterlagen für ein zusätzliches Patentier (gleicher Zugangscode).",
    subject: "Deine zusätzliche Patenschaft für {{waschbaer}} – Wilde Heimat",
    body: `Liebe/r {{name}},

schön, dass du ein weiteres Patentier bei uns unterstützt! Im Anhang findest du die Unterlagen für deine Patenschaft für {{waschbaer}} ({{stufe}}, {{preis}} €/Monat).

Dein bestehender Zugangscode gilt weiterhin für alle deine Patentiere: {{zugangscode}}
Paten-Bereich: {{portalLink}}

Bei Fragen erreichst du uns unter ${siteConfig.email}.

Herzliche Grüße
Julia Rothmann
Wilde Heimat`,
    dokumente: ["urkunde", "patenschaft-bestaetigung", "zahlungsinfo"],
  },
  {
    id: "freitext",
    label: "Freitext",
    description: "Leere Vorlage – Betreff, Text und Anhänge selbst wählen.",
    subject: "Deine Patenschaft bei Wilde Heimat – {{waschbaer}}",
    body: `Liebe/r {{name}},

vielen Dank für deine Patenschaft für {{waschbaer}}.

[Dein Text hier]

Herzliche Grüße
Julia Rothmann
Wilde Heimat`,
    dokumente: ["urkunde"],
  },
];

export function getPatenEmailVorlage(id: PatenEmailVorlageId): PatenEmailVorlage {
  const vorlage = patenEmailVorlagen.find((item) => item.id === id);
  if (!vorlage) throw new Error(`Unbekannte E-Mail-Vorlage: ${id}`);
  return vorlage;
}

export function fillPatenEmailTemplate(
  template: string,
  vars: PatenEmailPlatzhalter
): string {
  return template
    .replace(/\{\{name\}\}/g, vars.name)
    .replace(/\{\{waschbaer\}\}/g, vars.waschbaer)
    .replace(/\{\{stufe\}\}/g, vars.stufe)
    .replace(/\{\{preis\}\}/g, vars.preis)
    .replace(/\{\{zugangscode\}\}/g, vars.zugangscode)
    .replace(/\{\{urkundenNr\}\}/g, vars.urkundenNr)
    .replace(/\{\{portalLink\}\}/g, vars.portalLink);
}

export function buildPatenEmailPlatzhalter(input: {
  pateName: string;
  waschbaerName: string;
  stufeName: string;
  stufePreis: number;
  accessCode: string;
  urkundenNr?: string;
  siteOrigin: string;
}): PatenEmailPlatzhalter {
  return {
    name: input.pateName,
    waschbaer: input.waschbaerName,
    stufe: input.stufeName,
    preis: String(input.stufePreis),
    zugangscode: input.accessCode,
    urkundenNr: input.urkundenNr ?? "",
    portalLink: `${input.siteOrigin}/paten/zugang/${encodeURIComponent(input.accessCode)}`,
  };
}

export function textToPatenEmailHtml(text: string): string {
  const paragraphs = text
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map(
      (block) =>
        `<p style="margin:0 0 14px;line-height:1.6;color:#111827;white-space:pre-wrap;">${escapeHtml(block)}</p>`
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="de">
<body style="font-family:system-ui,-apple-system,sans-serif;max-width:640px;margin:0;padding:0;color:#111827;">
  <p style="margin:0 0 20px;font-size:14px;font-weight:600;color:#2d5016;">Wilde Heimat</p>
  ${paragraphs}
  <p style="margin:24px 0 0;padding-top:16px;border-top:1px solid #e5e7eb;font-size:12px;color:#6b7280;">
    ${siteConfig.name} · ${siteConfig.email}
  </p>
</body>
</html>`;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
