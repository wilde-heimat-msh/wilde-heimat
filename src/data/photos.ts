/** Open Graph / WhatsApp / Social-Media Vorschau (1200×630) */
export const siteShareImage = "/og/share.png";

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

export type WaschbaerGalerieFoto = {
  src: string;
  alt: string;
  caption?: string;
  featured?: boolean;
  objectPosition?: string;
  aspect?: "landscape" | "portrait" | "square";
};

/** Echte Galerie-Fotos pro Waschbär (Reihenfolge = Anzeige) */
const waschbaerGalerien: Partial<Record<string, WaschbaerGalerieFoto[]>> = {
  luna: [
    {
      src: "/photos/waschbaeren/luna-flasche.jpg",
      alt: "Luna bekommt Milch aus der Flasche",
      caption: "Luna bei der Flaschenfütterung – behutsam und mit viel Geduld.",
      featured: true,
      objectPosition: "center 20%",
      aspect: "portrait",
    },
    {
      src: "/photos/waschbaeren/luna-ankunft.jpg",
      alt: "Luna schaut neugierig aus ihrer Transportbox",
      caption: "Neugierig und aufgeschlossen – so kam Luna zu uns.",
      objectPosition: "center center",
      aspect: "square",
    },
  ],
  oskar: [
    {
      src: "/photos/waschbaeren/oskar-portrait.jpg",
      alt: "Oskar schaut neugierig in die Kamera",
      caption:
        "Oskar – zurückhaltend auf den ersten Blick, aber sehr lieb und verschmust, sobald das Vertrauen da ist.",
      featured: true,
      objectPosition: "center 25%",
      aspect: "portrait",
    },
  ],
  mila: [
    {
      src: "/photos/waschbaeren/mila-portrait.jpg",
      alt: "Mila schaut neugierig von ihrem Kletterbaum",
      caption:
        "Mila – lieb, verspielt und mit dem tollpatschigen Charme, der sie so besonders macht.",
      featured: true,
      objectPosition: "center 20%",
      aspect: "portrait",
    },
  ],
  pablo: [
    {
      src: "/photos/waschbaeren/pablo-portrait.jpg",
      alt: "Pablo ruht den Kopf liebevoll auf dem Schoß",
      caption:
        "Pablo – verschmust, lieb und der geduldige Anführer der jüngeren Waschbären.",
      featured: true,
      objectPosition: "center 30%",
      aspect: "portrait",
    },
  ],
  loki: [
    {
      src: "/photos/waschbaeren/loki-portrait.jpg",
      alt: "Loki schaut neugierig in die Kamera",
      caption:
        "Loki – sehr lieb, sehr verspielt und mit der Energie eines kleinen Schabernacks.",
      featured: true,
      objectPosition: "center 25%",
      aspect: "portrait",
    },
  ],
};

const waschbaerMitEchtenFotos = new Set(Object.keys(waschbaerGalerien));

/** Profilfoto eines Waschbären (falls vorhanden), sonst Platzhalter */
export function getWaschbaerProfilfoto(slug: string): string {
  return `/photos/waschbaeren/${slug}.png`;
}

export function hasWaschbaerEchteFotos(slug: string): boolean {
  return waschbaerMitEchtenFotos.has(slug);
}

export function getWaschbaerGalerie(slug: string): WaschbaerGalerieFoto[] {
  return waschbaerGalerien[slug] ?? [];
}

export function getWaschbaerCardFoto(slug: string): string {
  return hasWaschbaerEchteFotos(slug)
    ? getWaschbaerProfilfoto(slug)
    : waschbaerProfilPlatzhalter;
}

/** Platzhalter für Waschbär-Profile, bis echte Fotos zugeordnet sind */
export const waschbaerProfilPlatzhalter = designWaschbaerPhotos[0];

/** Dekoratives Bild aus der Design-Galerie (nur Layout, kein Profilfoto) */
export function getDesignWaschbaerBild(index: number): string {
  const len = designWaschbaerPhotos.length;
  const i = ((index % len) + len) % len;
  return designWaschbaerPhotos[i];
}
