export type RatgeberSection = {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
};

export type RatgeberArtikel = {
  slug: string;
  title: string;
  excerpt: string;
  /** Einleitung unter der Überschrift */
  intro: string;
  sections: RatgeberSection[];
  keywords: string[];
};
