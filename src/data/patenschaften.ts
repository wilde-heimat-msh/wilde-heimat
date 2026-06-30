import { einzelTassen } from "@/data/tassen";
import { patenschaftsStufen } from "@/data/site";

/** Persönliches Wort von Juja zur Patenschaft */
export const patenschaftJujaZitat = {
  text: "Jede Patenschaft bedeutet mir persönlich viel. Du wählst einen unserer Waschbären – und wir halten dich auf dem Laufenden, wofür dein Beitrag sorgt. Kein anonymer Spendenbeleg, sondern echte Nähe zu einem Tier, das eine Stimme braucht.",
  attribution: "Julia Rothmann",
  role: "Gründerin von Wilde Heimat",
} as const;

export type PatenschaftStufeId = (typeof patenschaftsStufen)[number]["id"];

/** Visuelles Erscheinungsbild der Stufe auf der Urkunde */
export const patenschaftUrkundeStufeStyles: Record<
  PatenschaftStufeId,
  {
    border: string;
    innerBorder: string;
    band: string;
    corner: string;
    medallion: string;
    medallionRing: string;
    panel: string;
    fotoRahmen: string;
    nameColor: string;
    priceColor: string;
    perkDot: string;
  }
> = {
  bronze: {
    border: "border-amber-900/35",
    innerBorder: "border-amber-800/15",
    band: "bg-gradient-to-r from-amber-900 via-amber-700 to-amber-900",
    corner: "border-amber-800/25",
    medallion:
      "bg-gradient-to-br from-amber-800 via-amber-700 to-amber-950 text-amber-50 shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]",
    medallionRing: "ring-2 ring-amber-600/40 ring-offset-2 ring-offset-[#f5ede0]",
    panel: "bg-amber-900/6 border-amber-800/25",
    fotoRahmen: "border-amber-800/35",
    nameColor: "text-amber-950",
    priceColor: "text-amber-900",
    perkDot: "bg-amber-700",
  },
  silber: {
    border: "border-stone-400/55",
    innerBorder: "border-stone-400/20",
    band: "bg-gradient-to-r from-stone-500 via-stone-300 to-stone-500",
    corner: "border-stone-400/35",
    medallion:
      "bg-gradient-to-br from-stone-200 via-white to-stone-400 text-stone-800 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]",
    medallionRing: "ring-2 ring-stone-400/50 ring-offset-2 ring-offset-[#f5ede0]",
    panel: "bg-stone-500/8 border-stone-400/35",
    fotoRahmen: "border-stone-500/45",
    nameColor: "text-stone-800",
    priceColor: "text-stone-700",
    perkDot: "bg-stone-500",
  },
  gold: {
    border: "border-amber-600/45",
    innerBorder: "border-yellow-600/20",
    band: "bg-gradient-to-r from-amber-600 via-yellow-400 to-amber-600",
    corner: "border-yellow-600/30",
    medallion:
      "bg-gradient-to-br from-yellow-300 via-amber-400 to-yellow-600 text-amber-950 shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]",
    medallionRing: "ring-2 ring-yellow-500/45 ring-offset-2 ring-offset-[#f5ede0]",
    panel: "bg-yellow-500/10 border-yellow-600/30",
    fotoRahmen: "border-yellow-600/40",
    nameColor: "text-amber-950",
    priceColor: "text-amber-800",
    perkDot: "bg-yellow-600",
  },
};

/** Inhalte einer personalisierten Patenschaftsurkunde */
export type PatenschaftUrkundeDaten = {
  pate: string;
  waschbaer: string;
  waschbaerSlug: string;
  waschbaerFoto: string;
  stufeId: PatenschaftStufeId;
  /** ISO-Datum (YYYY-MM-DD) */
  ausgestelltAm: string;
  urkundenNr: string;
  ort: string;
  unterzeichnerin: string;
  funktion: string;
  /** Optional – z. B. bei Geschenk-Patenschaften */
  grussbotschaft?: string;
};

/** Beispiel-Inhalte für die Urkunden-Vorschau */
export const patenschaftUrkundeBeispiel: PatenschaftUrkundeDaten = {
  pate: "Max Mustermann",
  waschbaer: "Pedro",
  waschbaerSlug: "pedro",
  waschbaerFoto: "/photos/waschbaeren/pedro.png",
  stufeId: "silber",
  ausgestelltAm: "2026-06-22",
  urkundenNr: "WH-2026-0042",
  ort: "Mansfeld-Südharz",
  unterzeichnerin: "Julia Rothmann",
  funktion: "Gründerin, Wilde Heimat",
};

/** Vorschlag für eine neue Urkunden-Nummer */
export function suggestUrkundenNr(
  year = new Date().getFullYear(),
  sequence = Math.floor(Math.random() * 9000) + 100
): string {
  return `WH-${year}-${String(sequence).padStart(4, "0")}`;
}

/** Standardwerte für den Admin-Editor */
export function createDefaultUrkundeDaten(
  overrides: Partial<PatenschaftUrkundeDaten> = {}
): PatenschaftUrkundeDaten {
  const today = new Date().toISOString().slice(0, 10);
  return {
    pate: "",
    waschbaer: patenschaftUrkundeBeispiel.waschbaer,
    waschbaerSlug: patenschaftUrkundeBeispiel.waschbaerSlug,
    waschbaerFoto: patenschaftUrkundeBeispiel.waschbaerFoto,
    stufeId: "silber",
    ausgestelltAm: today,
    urkundenNr: suggestUrkundenNr(),
    ort: patenschaftUrkundeBeispiel.ort,
    unterzeichnerin: patenschaftUrkundeBeispiel.unterzeichnerin,
    funktion: patenschaftUrkundeBeispiel.funktion,
    grussbotschaft: "",
    ...overrides,
  };
}

export function getPatenschaftStufe(id: PatenschaftStufeId) {
  return patenschaftsStufen.find((s) => s.id === id)!;
}

/** Erklärung im Paten-Dashboard – abgestimmt auf die Stufen-Leistungen */
export function getPatenPortalUpdatesText(stufeId: PatenschaftStufeId): string {
  if (stufeId === "bronze") {
    return "In der Bronze-Stufe erhältst du die persönliche Urkunde per Post. Fotos und Updates in diesem Bereich gibt es ab Silber.";
  }
  if (stufeId === "silber") {
    return "Hier findest du regelmäßige Fotos deines Patentiers – wie bei der Silber-Patenschaft beschrieben.";
  }
  return "Hier findest du die wöchentlichen Updates von Juja zu deinem Patentier – plus Fotos und alle Gold-Extras.";
}

export function getPatenPortalEmptyText(stufeId: PatenschaftStufeId): string {
  if (stufeId === "bronze") {
    return "Bei Bronze gibt es keinen Foto-Feed. Deine Urkunde senden wir dir per Post. Für Fotos im Paten-Bereich ist Silber die passende Stufe.";
  }
  if (stufeId === "silber") {
    return "Schau bald wieder vorbei – wir laden regelmäßig neue Fotos deines Patentiers hoch.";
  }
  return "Schau bald wieder vorbei – Juja meldet sich wöchentlich, sobald es Neues von deinem Patentier gibt.";
}

export function patenStufeHatPortalFeed(stufeId: PatenschaftStufeId): boolean {
  return stufeId !== "bronze";
}

/** Tassen-Bilder für die Belohnungs-Vorschau (Silber & Gold) */
export const patenschaftBelohnungTassen = [
  einzelTassen[4],
  einzelTassen[0],
] as const;

/** Geschenk-Patenschaft – Hinweise für Besucher */
export const patenschaftGeschenk = {
  title: "Patenschaft verschenken",
  subtitle: "Ein besonderes Geschenk für Tierliebhaber – zum Geburtstag, zu Weihnachten oder einfach so.",
  text: "Du kannst eine Patenschaft auch für jemand anderen anfragen. Wir richten die Urkunde auf den Namen des Beschenkten aus und senden sie an die von dir angegebene Adresse. Die monatliche Unterstützung läuft über dein PayPal-Konto – der Beschenkte erhält Updates und Extras je nach Stufe.",
  hinweise: [
    "Urkunde mit Name des Beschenkten",
    "Versand an eine separate Geschenkadresse möglich",
    "Optional: persönliche Grußbotschaft auf der Urkunde",
    "Du bleibst Ansprechpartner für Rückfragen zur Zahlung",
  ],
} as const;

/** Häufige Fragen zur Patenschaft */
export const patenschaftFaq = [
  {
    id: "bedeutung",
    question: "Was bedeutet Patenschaft – und was nicht?",
    answer:
      "Eine Patenschaft ist eine freiwillige monatliche Unterstützung für das Projekt Wilde Heimat. Du wählst einen Waschbären, der dir am Herzen liegt – ohne Eigentums- oder Besitzrechte am Tier. Es gibt keinen garantierten Besuch, keine Mitbestimmung bei tierärztlichen Entscheidungen und keine Freilassungsgarantie. Dein Beitrag fließt in Futter, Pflege, Tierarzt und Gehege – transparent und projektbezogen.",
  },
  {
    id: "kuendigung",
    question: "Kann ich jederzeit kündigen?",
    answer:
      "Ja. Die Patenschaft ist monatlich und ohne Mindestlaufzeit. Du kannst sie jederzeit per E-Mail an uns beenden – ohne Angabe von Gründen. Bereits geleistete Beiträge sind freiwillige Unterstützungen und werden nicht rückerstattet.",
  },
  {
    id: "bescheinigung",
    question: "Bekomme ich eine Spendenbescheinigung?",
    answer:
      "Aktuell können wir keine steuerlich absetzbaren Spendenbescheinigungen ausstellen. Wilde Heimat ist eine private Initiative – keine gemeinnützige Organisation. Deine Patenschaft ist eine freiwillige Unterstützung des Projekts.",
  },
  {
    id: "updates",
    question: "Wie oft kommen Fotos und Updates?",
    answer:
      "Bei Bronze erhältst du die Urkunde nach Start der Patenschaft. Silber-Paten bekommen regelmäßige Fotos des Patentiers – in der Regel mehrmals im Jahr, je nach Entwicklung und Möglichkeit. Gold-Paten erhalten wöchentliche Updates von Juja per Nachricht. Wir geben unser Bestes – manchmal bestimmen Pflege und Alltag das Tempo mit.",
  },
  {
    id: "wechsel",
    question: "Kann ich den Waschbären oder die Stufe wechseln?",
    answer:
      "Ja, schreib uns einfach. Wenn du einen anderen Waschbären unterstützen möchtest oder die Stufe anpassen willst, klären wir das persönlich per E-Mail – unkompliziert und ohne Umwege.",
  },
  {
    id: "zahlung",
    question: "Geht auch Überweisung statt PayPal?",
    answer:
      "Standardweg ist PayPal – du erhältst nach deiner Anfrage einen persönlichen Link für die monatliche Unterstützung. Wenn PayPal für dich keine Option ist, melde dich bei uns: Wir finden gemeinsam eine Lösung.",
  },
] as const;
