/** Allgemeine Website-Fotos */
export const sitePhotos = {
  /** Hero – Pexels (Chris F), siehe src/data/photoCredits.ts */
  hero: "/photos/site/hero-pexels.jpg",
  /** Patenschaften – Pexels (Butwhosamy), siehe src/data/photoCredits.ts */
  patenschaften: "/photos/site/patenschaften-pexels.jpg",
  intro: "/photos/site/intro.png",
  about: "/photos/site/about.png",
} as const;

/**
 * Waschbär-Fotos nur für Gestaltung (Hintergründe, Collagen, Social-Vorschau).
 * Keine Zuordnung zu einzelnen Waschbären – echte Profilfotos kommen später.
 */
export const designWaschbaerPhotos = [
  "/photos/design/waschbaer-01.png",
  "/photos/design/waschbaer-02.png",
  "/photos/design/waschbaer-03.png",
  "/photos/design/waschbaer-04.png",
  "/photos/design/waschbaer-05.png",
  "/photos/design/waschbaer-06.png",
  "/photos/design/waschbaer-07.png",
  "/photos/design/waschbaer-08.png",
  "/photos/design/waschbaer-09.png",
  "/photos/design/waschbaer-10.png",
  "/photos/design/waschbaer-11.png",
  "/photos/design/waschbaer-12.png",
] as const;

/** Profilfoto eines Waschbären (falls vorhanden), sonst Platzhalter */
export function getWaschbaerProfilfoto(slug: string): string {
  return `/photos/waschbaeren/${slug}.png`;
}

/** Platzhalter für Waschbär-Profile, bis echte Fotos zugeordnet sind */
export const waschbaerProfilPlatzhalter = designWaschbaerPhotos[0];

/** Dekoratives Bild aus der Design-Galerie (nur Layout, kein Profilfoto) */
export function getDesignWaschbaerBild(index: number): string {
  const len = designWaschbaerPhotos.length;
  const i = ((index % len) + len) % len;
  return designWaschbaerPhotos[i];
}
