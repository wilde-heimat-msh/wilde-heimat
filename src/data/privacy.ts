/** Schlüssel für die Einwilligung im Browser (localStorage, kein Tracking-Cookie) */
export const CONSENT_STORAGE_KEY = "wilde-heimat-cookie-consent";

/** Urkunde: physisches Format */
export const patenschaftUrkundeFormat = {
  label: "DIN A4",
  description: "Hochformat · 210 × 297 mm",
  /** Seitenverhältnis Breite : Höhe */
  aspectRatio: "210 / 297",
} as const;
