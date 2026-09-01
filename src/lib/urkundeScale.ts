/** DIN A4 Breite in CSS-Pixeln (96 dpi) */
export const URKUNDE_A4_WIDTH_PX = 210 * 3.7795275591;

/** DIN A4 Höhe in CSS-Pixeln (96 dpi) */
export const URKUNDE_A4_HEIGHT_PX = URKUNDE_A4_WIDTH_PX * (297 / 210);

/** ~300 DPI für Fotopapier-Druck (96 CSS-px × Skalierung). */
export const URKUNDE_PDF_EXPORT_SCALE = 4;

/** Vorschau-Breite auf der Website */
export const URKUNDE_PREVIEW_WIDTH_PX = 360;

export const URKUNDE_PREVIEW_SCALE = URKUNDE_PREVIEW_WIDTH_PX / URKUNDE_A4_WIDTH_PX;

export const URKUNDE_PREVIEW_HEIGHT_PX = URKUNDE_PREVIEW_WIDTH_PX * (297 / 210);
