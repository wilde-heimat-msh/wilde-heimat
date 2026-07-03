/** Eingebundene Unterschrift für PDF-Dokumente und Urkunden */
export const vereinUnterschrift = {
  /** SVG mit transparentem Hintergrund (bevorzugt) */
  imageSrc: "/signatures/unterschrift-julia-rothmann.svg",
  /** PNG-Fallback für PDF-Export (RGBA, transparent) */
  pngSrc: "/signatures/unterschrift-julia-rothmann.png",
  name: "Julia Rothmann",
  funktion: "Gründerin, Wilde Heimat",
  /** viewBox des SVG – Breite zu Höhe */
  aspectRatio: 2360 / 624,
} as const;
