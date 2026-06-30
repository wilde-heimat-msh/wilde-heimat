/** Schlüssel für die Einwilligung im Browser (localStorage, kein Tracking-Cookie) */
export const CONSENT_STORAGE_KEY = "wilde-heimat-cookie-consent";

/** Pflichtfeld in allen öffentlichen Formularen (Art. 6 Abs. 1 lit. a DSGVO) */
export const FORM_PRIVACY_CONSENT_FIELD = "datenschutz_einwilligung";

/** Urkunde: physisches Format */
export const patenschaftUrkundeFormat = {
  label: "DIN A4",
  description: "Hochformat · 210 × 297 mm",
  /** Seitenverhältnis Breite : Höhe */
  aspectRatio: "210 / 297",
} as const;
