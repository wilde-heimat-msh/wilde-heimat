export type PatenDokumentId =
  | "urkunde"
  | "patenschaft-bestaetigung"
  | "zahlungsinfo"
  | "widerruf-nachweis"
  | "datenschutz-nachweis"
  | "widerrufsformular";

export type PatenDokumentMeta = {
  id: PatenDokumentId;
  title: string;
  description: string;
  filenamePrefix: string;
};

export const patenDokumente: PatenDokumentMeta[] = [
  {
    id: "urkunde",
    title: "Patenschaftsurkunde",
    description: "Personalisierte Urkunde mit Waschbär, Stufe und ggf. Grußbotschaft.",
    filenamePrefix: "Patenschaftsurkunde",
  },
  {
    id: "patenschaft-bestaetigung",
    title: "Patenschaftsbestätigung",
    description: "Schriftliche Bestätigung der aufgenommenen Patenschaft mit allen Vertragsdaten.",
    filenamePrefix: "Patenschaftsbestaetigung",
  },
  {
    id: "zahlungsinfo",
    title: "Zahlungsinformationen",
    description: "Monatlicher Beitrag, Banküberweisung und persönlicher Verwendungszweck.",
    filenamePrefix: "Zahlungsinformationen",
  },
  {
    id: "widerruf-nachweis",
    title: "Widerrufsbelehrung – Nachweis",
    description: "Dokumentation der Kenntnisnahme der Widerrufsbelehrung zum Zeitpunkt der Anfrage.",
    filenamePrefix: "Widerruf-Nachweis",
  },
  {
    id: "datenschutz-nachweis",
    title: "Datenschutz – Einwilligungsnachweis",
    description: "Dokumentation der Datenschutz-Einwilligung zum Zeitpunkt der Anfrage.",
    filenamePrefix: "Datenschutz-Nachweis",
  },
  {
    id: "widerrufsformular",
    title: "Muster-Widerrufsformular",
    description: "Vorausgefülltes Widerrufsformular für die Unterlagen des Paten.",
    filenamePrefix: "Widerrufsformular",
  },
];

export function getPatenDokumentMeta(id: PatenDokumentId): PatenDokumentMeta {
  const meta = patenDokumente.find((doc) => doc.id === id);
  if (!meta) throw new Error(`Unbekanntes Dokument: ${id}`);
  return meta;
}

export function patenDokumentFilename(
  prefix: string,
  pateName: string,
  urkundenNr?: string
): string {
  const safeName =
    pateName.trim().replace(/\s+/g, "-").replace(/[^\w\-äöüÄÖÜß]/g, "") || "Pate";
  const safeNr = urkundenNr?.replace(/[^\w\-]/g, "") ?? "";
  return safeNr ? `${prefix}-${safeName}-${safeNr}.pdf` : `${prefix}-${safeName}.pdf`;
}
