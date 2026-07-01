import { siteConfig, vermittlungHinweis } from "@/data/site";

/** FAQ für /hilfe – strukturierte Daten & Auffindbarkeit bei „Waschbär gefunden“ */
export const hilfeFaq = [
  {
    question: "Waschbär gefunden – was soll ich tun?",
    answer:
      "Tier in Ruhe lassen, nicht anfassen oder füttern, wenn es nicht in unmittelbarer Gefahr ist. Melde den Fund über unser Formular unter „Waschbär gefunden“ oder per E-Mail – wir helfen bei der Einschätzung und vermitteln Ansprechpartner.",
  },
  {
    question: "Nehmt ihr gefundene Waschbären bei euch auf?",
    answer: vermittlungHinweis,
  },
  {
    question: "In welcher Region seid ihr aktiv?",
    answer: `Unser Schwerpunkt liegt in ${siteConfig.operatingArea} (${siteConfig.state}). Ratgeber und Vermittlung gelten deutschlandweit, soweit wir helfen können.`,
  },
  {
    question: "Waschbärbaby gefunden – ist das ein Notfall?",
    answer:
      "Ein alleiniges, kleines Waschbärbaby kann Hilfe brauchen – aber nicht jedes Tier ist ein Notfall. Beschreibe Fundort, Zustand und Verhalten im Formular. Bei sichtbarer Verletzung oder Unterkühlung kontaktiere uns umgehend per E-Mail.",
  },
  {
    question: "Kostet die Hilfe etwas?",
    answer:
      "Die Erstberatung und Vermittlung ist für dich kostenfrei. Wilde Heimat ist eine private Initiative – freiwillige Unterstützung über Patenschaft oder Spende hilft uns, Tiere und Aufklärung langfristig zu tragen.",
  },
] as const;
