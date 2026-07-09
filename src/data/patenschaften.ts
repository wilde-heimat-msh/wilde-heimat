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

/**
 * Explizite Farben/Verläufe für PDF-Export und Druck.
 * html2canvas rendert Tailwind-Gradienten und Ring-Utilities oft nicht zuverlässig.
 */
export const patenschaftUrkundeStufeRender: Record<
  PatenschaftStufeId,
  {
    band: { background: string };
    medallion: {
      background: string;
      color: string;
      boxShadow: string;
      border: string;
      outline: string;
      outlineOffset: string;
    };
    panel: { backgroundColor: string; borderColor: string };
    fotoRahmen: { borderColor: string };
    nameColor: string;
    priceColor: string;
    perkDot: { backgroundColor: string };
    articleBorder: string;
    innerBorder: string;
    cornerBorder: string;
  }
> = {
  bronze: {
    band: { background: "linear-gradient(to right, #78350f, #b45309, #78350f)" },
    medallion: {
      background: "linear-gradient(to bottom right, #92400e, #b45309, #451a03)",
      color: "#fffbeb",
      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.15)",
      border: "2px solid rgba(217, 119, 6, 0.45)",
      outline: "2px solid #f5ede0",
      outlineOffset: "2px",
    },
    panel: { backgroundColor: "rgba(120, 53, 15, 0.06)", borderColor: "rgba(146, 64, 14, 0.25)" },
    fotoRahmen: { borderColor: "rgba(146, 64, 14, 0.35)" },
    nameColor: "#451a03",
    priceColor: "#78350f",
    perkDot: { backgroundColor: "#b45309" },
    articleBorder: "rgba(120, 53, 15, 0.35)",
    innerBorder: "rgba(146, 64, 14, 0.15)",
    cornerBorder: "rgba(146, 64, 14, 0.25)",
  },
  silber: {
    band: { background: "linear-gradient(to right, #78716c, #d6d3d1, #78716c)" },
    medallion: {
      background: "linear-gradient(to bottom right, #e7e5e4, #ffffff, #a8a29e)",
      color: "#292524",
      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.9)",
      border: "2px solid rgba(168, 162, 158, 0.55)",
      outline: "2px solid #f5ede0",
      outlineOffset: "2px",
    },
    panel: { backgroundColor: "rgba(120, 113, 108, 0.08)", borderColor: "rgba(168, 162, 158, 0.35)" },
    fotoRahmen: { borderColor: "rgba(120, 113, 108, 0.45)" },
    nameColor: "#292524",
    priceColor: "#44403c",
    perkDot: { backgroundColor: "#78716c" },
    articleBorder: "rgba(168, 162, 158, 0.55)",
    innerBorder: "rgba(168, 162, 158, 0.2)",
    cornerBorder: "rgba(168, 162, 158, 0.35)",
  },
  gold: {
    band: { background: "linear-gradient(to right, #d97706, #facc15, #d97706)" },
    medallion: {
      background: "linear-gradient(to bottom right, #fde047, #fbbf24, #ca8a04)",
      color: "#451a03",
      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.35)",
      border: "2px solid rgba(234, 179, 8, 0.5)",
      outline: "2px solid #f5ede0",
      outlineOffset: "2px",
    },
    panel: { backgroundColor: "rgba(234, 179, 8, 0.1)", borderColor: "rgba(202, 138, 4, 0.3)" },
    fotoRahmen: { borderColor: "rgba(202, 138, 4, 0.4)" },
    nameColor: "#451a03",
    priceColor: "#92400e",
    perkDot: { backgroundColor: "#ca8a04" },
    articleBorder: "rgba(217, 119, 6, 0.45)",
    innerBorder: "rgba(202, 138, 4, 0.2)",
    cornerBorder: "rgba(202, 138, 4, 0.3)",
  },
};

/** SVG-Medaille – zuverlässig in PDF/Druck (html2canvas rendert CSS-Gradienten auf divs oft nicht). */
export const patenschaftUrkundeMedallionSvg: Record<
  PatenschaftStufeId,
  {
    gradientStops: { offset: string; color: string }[];
    ringColor: string;
    borderColor: string;
    highlightColor: string;
    textColor: string;
  }
> = {
  bronze: {
    gradientStops: [
      { offset: "0%", color: "#b45309" },
      { offset: "45%", color: "#d97706" },
      { offset: "100%", color: "#451a03" },
    ],
    ringColor: "#f5ede0",
    borderColor: "#92400e",
    highlightColor: "rgba(255,255,255,0.18)",
    textColor: "#fffbeb",
  },
  silber: {
    gradientStops: [
      { offset: "0%", color: "#a8a29e" },
      { offset: "38%", color: "#e7e5e4" },
      { offset: "62%", color: "#fafaf9" },
      { offset: "100%", color: "#78716c" },
    ],
    ringColor: "#f5ede0",
    borderColor: "#a8a29e",
    highlightColor: "rgba(255,255,255,0.55)",
    textColor: "#292524",
  },
  gold: {
    gradientStops: [
      { offset: "0%", color: "#facc15" },
      { offset: "50%", color: "#fde047" },
      { offset: "100%", color: "#ca8a04" },
    ],
    ringColor: "#f5ede0",
    borderColor: "#eab308",
    highlightColor: "rgba(255,255,255,0.35)",
    textColor: "#451a03",
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
  text: "Du kannst eine Patenschaft auch für jemand anderen anfragen. Wir richten die Urkunde auf den Namen des Beschenkten aus und senden sie an die von dir angegebene Adresse. Die monatliche Unterstützung läuft per Banküberweisung über dein Konto – der Beschenkte erhält Updates und Extras je nach Stufe.",
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
      "Eine Patenschaft ist eine freiwillige monatliche Unterstützung für das Projekt Wilde Heimat. Du wählst einen Waschbären, der dir am Herzen liegt – ohne Eigentums- oder Besitzrechte am Tier. Andere Menschen können denselben Waschbären ebenfalls unterstützen; deine Patenschaft ist persönlich, aber nicht allein oder exklusiv. Es gibt keinen garantierten Besuch, keine Mitbestimmung bei tierärztlichen Entscheidungen und keine Freilassungsgarantie. Dein Beitrag fließt in Futter, Pflege, Tierarzt und Gehege – transparent und projektbezogen.",
  },
  {
    id: "mehrere-paten",
    question: "Können mehrere Personen denselben Waschbären unterstützen?",
    answer:
      "Ja. Jeder Waschbär kann von vielen Paten und Patinnen gleichzeitig unterstützt werden – wie bei einem Spendenprojekt mit persönlicher Note. Deine Urkunde, dein Zugangscode und deine Updates bleiben individuell; du teilst dir den Waschbären nicht mit anderen, sondern tragt gemeinsam zu seiner Versorgung bei.",
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
    question: "Wie zahle ich den monatlichen Beitrag?",
    answer:
      "Der monatliche Patenbeitrag wird per Banküberweisung auf unser Vereinskonto geleistet. Du erhältst nach Bestätigung deiner Patenschaft die Bankverbindung und deinen persönlichen Verwendungszweck – bitte exakt so angeben, damit wir deine Zahlung zuordnen können.",
  },
] as const;
