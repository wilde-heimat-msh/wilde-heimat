import type { PatenDokumentId } from "@/data/patenDokumente";
import { patenschaftBank } from "@/data/patenschaftBank";
import { siteConfig } from "@/data/site";
import {
  buildMonatlicherVerwendungszweck,
  buildPatenschaftVerwendungszweck,
  getPatenschaftFaelligAm,
  PATENSCHAFT_FAELLIGKEIT_TAG,
  toLocalPeriod,
} from "@/lib/patenschaftPayment";
import { formatFormDateDe } from "@/lib/relativeTime";

export type PatenEmailVorlageId =
  | "urkunde-vorab"
  | "zahlungsinfo"
  | "monatliche-zahlungserinnerung"
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
  verwendungszweck: string;
  monatlicherVerwendungszweck: string;
  monatLabel: string;
  iban: string;
  bic: string;
  kontoinhaber: string;
  bankName: string;
  faelligAm: string;
  faelligkeitTag: string;
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
    description: "Banküberweisung, monatlicher Beitrag und Verwendungszweck.",
    subject: "Zahlungsinformationen zu deiner Patenschaft – {{waschbaer}}",
    body: `Liebe/r {{name}},

vielen Dank für deine Patenschaft für {{waschbaer}}!

Im Anhang findest du die Zahlungsinformationen zu deiner {{stufe}}-Patenschaft ({{preis}} €/Monat). Der monatliche Beitrag wird per Banküberweisung geleistet.

Kurzüberblick:
Kontoinhaber: {{kontoinhaber}}
IBAN: {{iban}}
BIC: {{bic}}
Bank: {{bankName}}
Verwendungszweck: {{verwendungszweck}}

Bitte gib den Verwendungszweck exakt so an, damit wir deine Zahlung zuordnen können.

Bei Fragen: ${siteConfig.email}

Herzliche Grüße
Julia Rothmann
Wilde Heimat`,
    dokumente: ["zahlungsinfo"],
  },
  {
    id: "monatliche-zahlungserinnerung",
    label: "Monatliche Zahlungsanweisung",
    description: "Freundliche Erinnerung an den fälligen Patenbeitrag per Banküberweisung.",
    subject: "Dein Patenbeitrag für {{monatLabel}} – {{waschbaer}} 🦝",
    body: `Liebe/r {{name}},

nur eine kleine, freundliche Erinnerung von uns: Für {{monatLabel}} ist dein monatlicher Patenbeitrag in Höhe von {{preis}} € ab dem {{faelligkeitTag}}. des Monats fällig ({{faelligAm}}). Das gilt jeden Monat erneut – wir senden dir die Zahlungsanweisung jeweils am {{faelligkeitTag}}.

Du hilfst damit direkt mit, dass unsere kleinen Waschbären gut versorgt werden. Dafür sagen wir von Herzen Danke! 💚

Bitte überweise den Betrag auf folgendes Konto:

Kontoinhaber: {{kontoinhaber}}
IBAN: {{iban}}
BIC: {{bic}}
Bank: {{bankName}}
Betrag: {{preis}} €
Verwendungszweck: {{monatlicherVerwendungszweck}}

Bitte gib den Verwendungszweck exakt so an – dann können wir deine Zahlung schnell zuordnen.

Falls du den Beitrag bereits überwiesen hast, kannst du diese Nachricht einfach ignorieren. Bei Fragen sind wir jederzeit für dich da: ${siteConfig.email}

Herzliche Grüße und vielen Dank für deine Treue
Julia Rothmann
Wilde Heimat`,
    dokumente: [],
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
• die Zahlungsinformationen zur monatlichen Banküberweisung

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
    .replace(/\{\{portalLink\}\}/g, vars.portalLink)
    .replace(/\{\{verwendungszweck\}\}/g, vars.verwendungszweck)
    .replace(/\{\{monatlicherVerwendungszweck\}\}/g, vars.monatlicherVerwendungszweck)
    .replace(/\{\{monatLabel\}\}/g, vars.monatLabel)
    .replace(/\{\{iban\}\}/g, vars.iban)
    .replace(/\{\{bic\}\}/g, vars.bic)
    .replace(/\{\{kontoinhaber\}\}/g, vars.kontoinhaber)
    .replace(/\{\{bankName\}\}/g, vars.bankName)
    .replace(/\{\{faelligAm\}\}/g, vars.faelligAm)
    .replace(/\{\{faelligkeitTag\}\}/g, vars.faelligkeitTag);
}

export function buildPatenEmailPlatzhalter(input: {
  pateName: string;
  waschbaerName: string;
  stufeName: string;
  stufePreis: number;
  accessCode: string;
  urkundenNr?: string;
  siteOrigin: string;
  monatLabel?: string;
  monatlicherVerwendungszweck?: string;
  period?: string;
}): PatenEmailPlatzhalter {
  const currentPeriod = input.period ?? toLocalPeriod();
  const monatLabel =
    input.monatLabel ??
    new Date(`${currentPeriod}-01T12:00:00`).toLocaleDateString("de-DE", {
      month: "long",
      year: "numeric",
    });
  const faelligAmRaw = getPatenschaftFaelligAm(currentPeriod);
  const faelligAm = formatFormDateDe(faelligAmRaw);

  return {
    name: input.pateName,
    waschbaer: input.waschbaerName,
    stufe: input.stufeName,
    preis: String(input.stufePreis),
    zugangscode: input.accessCode,
    urkundenNr: input.urkundenNr ?? "",
    portalLink: `${input.siteOrigin}/paten/zugang/${encodeURIComponent(input.accessCode)}`,
    verwendungszweck: buildPatenschaftVerwendungszweck(input.accessCode),
    monatlicherVerwendungszweck:
      input.monatlicherVerwendungszweck ??
      buildMonatlicherVerwendungszweck(input.accessCode, currentPeriod),
    monatLabel,
    iban: patenschaftBank.iban,
    bic: patenschaftBank.bic,
    kontoinhaber: patenschaftBank.accountHolder,
    bankName: patenschaftBank.bankName,
    faelligAm,
    faelligkeitTag: String(PATENSCHAFT_FAELLIGKEIT_TAG),
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
