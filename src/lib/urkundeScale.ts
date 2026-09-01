/** DIN A4 Breite in CSS-Pixeln (96 dpi) */
export const URKUNDE_A4_WIDTH_PX = 210 * 3.7795275591;

/** Vorschau-Breite auf der Website */
export const URKUNDE_PREVIEW_WIDTH_PX = 360;

export const URKUNDE_PREVIEW_SCALE = URKUNDE_PREVIEW_WIDTH_PX / URKUNDE_A4_WIDTH_PX;

export const URKUNDE_PREVIEW_HEIGHT_PX = URKUNDE_PREVIEW_WIDTH_PX * (297 / 210);
