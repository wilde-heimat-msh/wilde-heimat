/**
 * Bildnachweise und Lizenzinformationen für Stock-Fotos.
 * Pexels-Lizenz: https://www.pexels.com/license/
 */

export const pexelsLicense = {
  name: "Pexels License",
  url: "https://www.pexels.com/license/",
  summary:
    "Kostenlose Nutzung für Websites und soziale Medien. Bearbeitung erlaubt. Keine Pflicht zur Namensnennung – wir geben Quellen trotzdem an.",
  allowed: [
    "Nutzung auf dieser Website und in Social-Media-Kanälen von Wilde Heimat",
    "Bearbeitung (z. B. Zuschnitt, Farbverlauf, Überlagerung für Lesbarkeit)",
    "Keine exklusive Rechte – das Bild bleibt frei lizenzierbar über Pexels",
  ],
  notAllowed: [
    "Weiterverkauf oder Verbreitung des unveränderten Fotos als eigenes Stock-Material",
    "Nutzung, die den Eindruck erweckt, Personen oder Marken im Bild würden das Projekt offiziell unterstützen",
  ],
} as const;

export type StockPhotoCredit = {
  id: string;
  title: string;
  photographer: string;
  photographerUrl: string;
  source: "Pexels";
  sourceUrl: string;
  license: typeof pexelsLicense.name;
  licenseUrl: string;
  localPath: string;
  usedOn: string[];
};

export const stockPhotoCredits: StockPhotoCredit[] = [
  {
    id: "pexels-16819607",
    title: "Waschbär zwischen Blättern (Raccoon among Leaves)",
    photographer: "Chris F",
    photographerUrl: "https://www.pexels.com/@chris-f-38966/",
    source: "Pexels",
    sourceUrl: "https://www.pexels.com/photo/16819607/",
    license: "Pexels License",
    licenseUrl: pexelsLicense.url,
    localPath: "/photos/site/hero-pexels.jpg",
    usedOn: [
      "Startseite – Hero-Hintergrund",
      "Waschbären – Patenschafts-CTA",
      "Hilfe – Hero",
      "Ratgeber – Hero",
    ],
  },
  {
    id: "pexels-36494820",
    title: "Waschbär hängt spielerisch an einem Ast (Raccoon on Tree Branch)",
    photographer: "Butwhosamy",
    photographerUrl: "https://www.pexels.com/@butwhosamy-2156042921/",
    source: "Pexels",
    sourceUrl: "https://www.pexels.com/photo/36494820/",
    license: "Pexels License",
    licenseUrl: pexelsLicense.url,
    localPath: "/photos/site/patenschaften-pexels.jpg",
    usedOn: [
      "Startseite – Patenschaften-Bereich",
      "Waschbären – Hero-Hintergrund",
      "Patenschaften – Hero",
      "Unterstützen – CTA",
      "Waschbär-Profile – CTA",
    ],
  },
];

export const heroPhotoCredit = stockPhotoCredits[0];
export const patenschaftenPhotoCredit = stockPhotoCredits[1];
