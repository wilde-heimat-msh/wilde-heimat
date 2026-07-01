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
  width: number;
  height: number;
  caption?: string;
  featured?: boolean;
  objectPosition?: string;
};

/** Echte Galerie-Fotos pro Waschbär (Reihenfolge = Anzeige) */
const waschbaerGalerien: Partial<Record<string, WaschbaerGalerieFoto[]>> = {
  luna: [
    {
      src: "/photos/waschbaeren/luna-flasche.jpg",
      width: 668,
      height: 1024,
      alt: "Luna bekommt Milch aus der Flasche",
      caption: "Luna bei der Flaschenfütterung – behutsam und mit viel Geduld.",
      featured: true,
      objectPosition: "center 20%",
    },
    {
      src: "/photos/waschbaeren/luna-ankunft.jpg",
      width: 862,
      height: 674,
      alt: "Luna schaut neugierig aus ihrer Transportbox",
      caption: "Neugierig und aufgeschlossen – so kam Luna zu uns.",
      objectPosition: "center center",
    },
  ],
  oskar: [
    {
      src: "/photos/waschbaeren/oskar-portrait.jpg",
      width: 939,
      height: 1024,
      alt: "Oskar schaut neugierig in die Kamera",
      caption:
        "Oskar – zurückhaltend auf den ersten Blick, aber sehr lieb und verschmust, sobald das Vertrauen da ist.",
      featured: true,
      objectPosition: "center 25%",
    },
  ],
  mila: [
    {
      src: "/photos/waschbaeren/mila-portrait.jpg",
      width: 829,
      height: 1024,
      alt: "Mila schaut neugierig von ihrem Kletterbaum",
      caption:
        "Mila – lieb, verspielt und mit dem tollpatschigen Charme, der sie so besonders macht.",
      featured: true,
      objectPosition: "center 20%",
    },
  ],
  minnie: [
    {
      src: "/photos/waschbaeren/minnie-portrait.jpg",
      width: 576,
      height: 1024,
      alt: "Minnie steht neugierig auf Stroh und Holzspänen",
      caption:
        "Minnie – der kleine Engel, verschmust und mit einem neugierigen Blick voller Sanftheit.",
      featured: true,
      objectPosition: "center 30%",
    },
    {
      src: "/photos/waschbaeren/minnie-neugierig.jpg",
      width: 576,
      height: 1024,
      alt: "Minnie schaut neugierig zur Seite",
      caption: "Neugierig und zart – Minnie entdeckt die Welt in ihrem eigenen Tempo.",
      objectPosition: "center 35%",
    },
  ],
  mika: [
    {
      src: "/photos/waschbaeren/mika-portrait.jpg",
      width: 576,
      height: 1024,
      alt: "Mika läuft neugierig auf die Kamera zu",
      caption:
        "Mika – verspielt und neugierig, mit dem Charme eines echten Waffelliebhabers.",
      featured: true,
      objectPosition: "center 30%",
    },
    {
      src: "/photos/waschbaeren/mika-holz.jpg",
      width: 575,
      height: 1024,
      alt: "Mika sitzt auf einem Holzbalken und schaut in die Kamera",
      caption: "Zurückhaltend auf den ersten Blick – aber voller Lebensfreude, wenn das Vertrauen da ist.",
      objectPosition: "center 25%",
    },
    {
      src: "/photos/waschbaeren/mika-stroh.jpg",
      width: 576,
      height: 1024,
      alt: "Mika schreitet neugierig über Stroh",
      caption: "Unterwegs mit Neugier – Mika entdeckt jeden Winkel.",
      objectPosition: "center 35%",
    },
  ],
  pablo: [
    {
      src: "/photos/waschbaeren/pablo-portrait.jpg",
      width: 816,
      height: 1024,
      alt: "Pablo ruht den Kopf liebevoll auf dem Schoß",
      caption:
        "Pablo – verschmust, lieb und der geduldige Anführer der jüngeren Waschbären.",
      featured: true,
      objectPosition: "center 30%",
    },
  ],
  boba: [
    {
      src: "/photos/waschbaeren/boba-aufgestanden.jpg",
      width: 768,
      height: 1024,
      alt: "Boba lugt verschlafen aus seiner Kuscheldecke hervor",
      caption:
        "Gerade aufgestanden – Boba schaut neugierig aus seiner Kuschelhöhle.",
      featured: true,
      objectPosition: "center 35%",
    },
    {
      src: "/photos/waschbaeren/boba-portrait.jpg",
      width: 646,
      height: 1024,
      alt: "Boba schaut neugierig von unten in die Kamera",
      caption:
        "Boba – frech, neugierig und immer bereit für das nächste Abenteuer.",
      objectPosition: "center 30%",
    },
  ],
  loki: [
    {
      src: "/photos/waschbaeren/loki-portrait.jpg",
      width: 794,
      height: 1024,
      alt: "Loki schaut neugierig in die Kamera",
      caption:
        "Loki – sehr lieb, sehr verspielt und mit der Energie eines kleinen Schabernacks.",
      featured: true,
      objectPosition: "center 25%",
    },
  ],
  pedro: [
    {
      src: "/photos/waschbaeren/pedro-portrait.jpg",
      width: 768,
      height: 1024,
      alt: "Pedro genießt einen Snack in seiner Hängematte",
      caption:
        "Pedro – der Kuschelkönig in seiner Hängematte, mit vollem Genuss und dem Lächeln eines echten Anführers.",
      featured: true,
      objectPosition: "center 25%",
    },
    {
      src: "/photos/waschbaeren/pedro-reifen.jpg",
      width: 682,
      height: 1024,
      alt: "Pedro schaut neugierig hinter einem Reifen hervor",
      caption: "Neugierig und aufgeschlossen – Pedro entdeckt seine Umgebung.",
      objectPosition: "center 25%",
    },
    {
      src: "/photos/waschbaeren/pedro-kratzbaum.jpg",
      width: 682,
      height: 1024,
      alt: "Pedro lugt neugierig hinter dem Kratzbaum hervor",
      caption: "Mit der Gelassenheit eines echten Anführers – immer wachsam, immer neugierig.",
      objectPosition: "center 25%",
    },
  ],
  mausi: [
    {
      src: "/photos/waschbaeren/mausi-portrait.jpg",
      width: 576,
      height: 1024,
      alt: "Mausi läuft neugierig über Holzspäne",
      caption:
        "Mausi – die Queen der Gruppe, unterwegs mit verspielter Neugier und vollem Charme.",
      featured: true,
      objectPosition: "center 35%",
    },
    {
      src: "/photos/waschbaeren/mausi-holz.jpg",
      width: 575,
      height: 1024,
      alt: "Mausi lehnt sich entspannt an einem Holzbalken",
      caption: "Verschmust und neugierig – so kennt man Mausi.",
      objectPosition: "center center",
    },
    {
      src: "/photos/waschbaeren/mausi-sitzt.jpg",
      width: 576,
      height: 1024,
      alt: "Mausi sitzt selbstbewusst auf einem Steinsockel",
      caption: "Selbstbewusst und voller Charme – Mausi regiert mit Herz.",
      objectPosition: "center 30%",
    },
  ],
  lotti: [
    {
      src: "/photos/waschbaeren/lotti-schulter.jpg",
      width: 660,
      height: 1024,
      alt: "Lotti sitzt vertrauensvoll auf einer Schulter unter blauem Himmel",
      caption:
        "Lotti – der Süßzahn mit großem Vertrauen und anhänglichem Wesen.",
      featured: true,
      objectPosition: "center 30%",
    },
    {
      src: "/photos/waschbaeren/lotti-portrait.jpg",
      width: 588,
      height: 1024,
      alt: "Lotti schaut sanft in die Kamera",
      caption:
        "Verspielt und verschmust – Lotti mit ihrem offenen, herzlichen Blick.",
      objectPosition: "center 35%",
    },
  ],
  charlie: [
    {
      src: "/photos/waschbaeren/charlie-klettergelaende.jpg",
      width: 587,
      height: 1024,
      alt: "Charlie steht auf dem Klettergerüst in seinem Gehege",
      caption:
        "Immer in Bewegung – Charlie erobert jedes Klettergerüst mit Schwung.",
      featured: true,
      objectPosition: "center 35%",
    },
    {
      src: "/photos/waschbaeren/charlie-portrait.jpg",
      width: 629,
      height: 1024,
      alt: "Charlie schaut neugierig in die Kamera",
      caption:
        "Charlie – die Sportskanone mit offenem Blick und voller Energie.",
      objectPosition: "center 30%",
    },
  ],
};

const waschbaerMitEchtenFotos = new Set(Object.keys(waschbaerGalerien));

/** Bestes verfügbares Profilbild (Galerie-Highlight oder Karten-PNG) */
export function getWaschbaerProfilfoto(slug: string): string {
  const galerie = waschbaerGalerien[slug];
  if (galerie?.length) {
    const featured = galerie.find((foto) => foto.featured) ?? galerie[0];
    return featured.src;
  }
  return `/photos/waschbaeren/${slug}.png`;
}

export function hasWaschbaerEchteFotos(slug: string): boolean {
  return waschbaerMitEchtenFotos.has(slug);
}

export function getWaschbaerGalerie(slug: string): WaschbaerGalerieFoto[] {
  return waschbaerGalerien[slug] ?? [];
}

export function getWaschbaerCardFoto(slug: string): string {
  if (!hasWaschbaerEchteFotos(slug)) {
    return waschbaerProfilPlatzhalter;
  }
  return getWaschbaerProfilfoto(slug);
}

/** Platzhalter für Waschbär-Profile, bis echte Fotos zugeordnet sind */
export const waschbaerProfilPlatzhalter = designWaschbaerPhotos[0];

/** Dekoratives Bild aus der Design-Galerie (nur Layout, kein Profilfoto) */
export function getDesignWaschbaerBild(index: number): string {
  const len = designWaschbaerPhotos.length;
  const i = ((index % len) + len) % len;
  return designWaschbaerPhotos[i];
}
