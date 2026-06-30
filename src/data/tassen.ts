export type Tasse = {
  id: string;
  label: string;
  src: string;
};

export const tassenPhotos = {
  panorama: "/photos/tassen/panorama.png",
} as const;

/** Einzelne Tassen – nur Gestaltung, keine Zuordnung zu Waschbären */
export const einzelTassen: Tasse[] = [
  { id: "personalized-1", label: "Personalisierte Tasse", src: "/photos/tassen/personalized-1.png" },
  { id: "personalized-2", label: "Personalisierte Tasse", src: "/photos/tassen/personalized-2.png" },
  { id: "personalized-3", label: "Personalisierte Tasse", src: "/photos/tassen/personalized-3.png" },
  { id: "personalized-4", label: "Personalisierte Tasse", src: "/photos/tassen/personalized-4.png" },
  { id: "waschbaer-1", label: "Waschbär-Motiv", src: "/photos/tassen/waschbaer-1.png" },
  { id: "waschbaer-2", label: "Waschbär-Motiv", src: "/photos/tassen/waschbaer-2.png" },
  { id: "waschbaer-3", label: "Waschbär-Motiv", src: "/photos/tassen/waschbaer-3.png" },
];
