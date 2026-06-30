import { siteConfig } from "@/data/site";

export type GoFundMeDonor = {
  name: string;
  amount: number;
  /** ISO-Datum (YYYY-MM-DD) – „vor X Tagen“ wird automatisch berechnet */
  date: string;
  anonym?: boolean;
};

export type GoFundMeUpdate = {
  id: string;
  /** ISO-Datum; bei Monats-Updates nur YYYY-MM-01 + precision month */
  date: string;
  precision?: "day" | "month";
  titel?: string;
  text: string;
};

export const gofundmeCampaign = {
  title: "Hilfe für gerettete Waschbären",
  organizer: "Julia Rothmann",
  url: siteConfig.gofundme,
  raised: 838,
  goal: 1500,
  donorCount: 16,
  /** Letzter Abgleich mit GoFundMe (ISO) – relative Anzeige automatisch */
  lastSynced: "2026-06-22",
  intro:
    "Mit eurer Unterstützung finanzieren wir Futter, Pflege und den Ausbau unserer Gehege für gerettete Waschbären in Mansfeld-Südharz. Jede Spende hilft direkt vor Ort – transparent und nachvollziehbar.",
} as const;

export function getGofundmeProgress(): number {
  return Math.min(100, Math.round((gofundmeCampaign.raised / gofundmeCampaign.goal) * 100));
}

export function formatEuro(amount: number): string {
  return amount.toLocaleString("de-DE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  });
}

/** Ausgewählte Spenden – vollständige Liste auf GoFundMe */
export const gofundmeTopDonors: GoFundMeDonor[] = [
  { name: "Nico Wüst", amount: 328, date: "2026-05-20" },
  { name: "Michael Bryks", amount: 70, date: "2026-05-18" },
  { name: "Nicole Zweidorf", amount: 50, date: "2026-05-31" },
  { name: "Jan Könneke", amount: 50, date: "2026-05-19" },
  { name: "Anonym", amount: 50, date: "2026-05-17", anonym: true },
  { name: "Antje Kühn", amount: 50, date: "2025-06-10" },
  { name: "Corinna F.", amount: 35, date: "2025-05-28" },
  { name: "Norman Arndt", amount: 25, date: "2025-06-05" },
];

/** Kampagnen-Updates von GoFundMe (Mai 2026) */
export const gofundmeUpdates: GoFundMeUpdate[] = [
  {
    id: "2026-05-30",
    date: "2026-05-30",
    titel: "Dank eurer Hilfe",
    text: "Das ist alles dank eurer Hilfe möglich – vielen, vielen Dank! Mit den gesammelten Spenden konnten wir unter anderem Futter und Pflegeartikel bei Fressnapf Eisleben und Aschersleben beschaffen. So kommt jede Unterstützung direkt bei unseren Waschbären an.",
  },
  {
    id: "2026-05-23",
    date: "2026-05-23",
    titel: "Neues Flaschenkind in Not",
    text: "Ich wollte dieses Jahr keine weiteren Bärchen mehr aufnehmen, da mir einfach die Kapazitäten fehlen. Plötzlich erhielt ich einen Anruf – kleines Bärchen einen Tag vor Männertag gefunden, seit heute plötzlich Krampfanfälle, Verdacht auf Staupe. Ich bat die Finderin, mir das Bärchen zu bringen, damit ich es anschauen kann. Auf den ersten Blick wirkte er fit, doch bereits nach fünf Minuten sein erster Krampfanfall auf meinem Arm. Die erste Nacht war der Horror – doch bereits am Abend darauf hatte er seinen letzten Anfall. Zum Glück war es nur die Unterversorgung, die die Anfälle ausgelöst hat. Nun ist er ein kleiner frecher Kerl, der tapsig die Welt entdeckt.",
  },
  {
    id: "2026-05",
    date: "2026-05-15",
    precision: "month",
    titel: "Fünf neue Bärchen & wachsender Bedarf",
    text: "Am Tag darauf brachte ein Jäger aus dem Nachbarort fünf weitere Babies – bei Dacharbeiten entdeckt, von den Hausbesitzern nicht zurückgewünscht. Nun stehe ich wieder da: Das Gehege muss erweitert werden, Holzbalken und Einrichtung kosten Geld. Dazu kommen sechs hungrige Flaschenkinder. Royal-Canin-Kittenmilch kostet 15–20 € pro Dose und reicht nur etwa zwei Tage. Wir sind dankbar für jeden Cent – allein ist das kaum noch zu schaffen, aber wie soll man Nein sagen, wenn man weiß, was jedes Nein für diese Seelen bedeutet?",
  },
];
