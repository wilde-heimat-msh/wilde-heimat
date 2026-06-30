import { heroPhotoCredit, patenschaftenPhotoCredit } from "@/data/photoCredits";
import { sitePhotos } from "@/data/photos";

/** Einheitliche Hintergrundbilder für Seiten-Heroes und CTAs */
export const pagePhotos = {
  hero: {
    src: sitePhotos.hero,
    alt: "Waschbär zwischen grünem Laub",
    objectPosition: "center 35%",
    overlay: "medium" as const,
    credit: heroPhotoCredit,
  },
  heroLight: {
    src: sitePhotos.hero,
    alt: "Waschbär zwischen grünem Laub",
    objectPosition: "center 40%",
    overlay: "light" as const,
    credit: heroPhotoCredit,
  },
  patenschaften: {
    src: sitePhotos.patenschaften,
    alt: "Waschbär hängt spielerisch an einem Ast",
    objectPosition: "center 35%",
    overlay: "light" as const,
    credit: patenschaftenPhotoCredit,
  },
  intro: {
    src: sitePhotos.intro,
    alt: "Waschbär in der Pflege",
    objectPosition: "center center",
    overlay: "light" as const,
  },
  about: {
    src: sitePhotos.about,
    alt: "Waschbär in der Hängematte",
    objectPosition: "center center",
    overlay: "medium" as const,
  },
} as const;
