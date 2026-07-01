export const siteConfig = {
  name: "Wilde Heimat",
  subtitle: "Private Initiative für Waschbärhilfe und Aufklärung",
  tagline: "Eine Stimme für Waschbären.",
  /** Sichtbar unter der H1 – regionale & thematische Keywords */
  seoHeadline: "Waschbärhilfe, Patenschaften & Ratgeber in Mansfeld-Südharz",
  description:
    "Wilde Heimat ist ein privates Pflege- und Aufklärungsprojekt von Juja – verwurzelt in Mansfeld-Südharz, mit Hilfe und Aufklärung, wo wir können.",
  /** Schwerpunkt vor Ort */
  operatingArea: "Mansfeld-Südharz",
  state: "Sachsen-Anhalt",
  region: "Mansfeld-Südharz, Sachsen-Anhalt",
  /** Kurzform für Stat-Karten */
  operatingAreaShort: "MSH",
  helpScope:
    "Verwurzelt in Mansfeld-Südharz – unser Ratgeber und unsere Hilfe gelten deutschlandweit, wo wir können.",
  url: "https://www.wilde-heimat-msh.de",
  email: "kontakt@wilde-heimat-msh.de",
  /** Ansprechperson der privaten Initiative (Impressum & Datenschutz) */
  contact: {
    name: "Julia Rothmann",
    street: "Diesterwegstraße 16",
    postalCode: "06295",
    city: "Lutherstadt Eisleben",
    country: "Deutschland",
  },
  instagram: "https://www.instagram.com/ju.ja91",
  tiktok: "https://www.tiktok.com/@juja030691",
  amazonWishlist: "https://www.amazon.de/hz/wishlist/ls/1X783S2NRRZ",
  gofundme: "https://www.gofundme.com/f/Hilfe-fuer-gerettete-waschbaeren",
  keywords: [
    "Waschbärhilfe Sachsen-Anhalt",
    "Waschbär gefunden",
    "Waschbärbaby gefunden",
    "Waschbär Hilfe Mansfeld-Südharz",
    "Waschbär Ratgeber",
    "Waschbär Patenschaft",
    "Waschbär Aufklärung",
    "Waschbär Hilfe Deutschland",
    "Waschbär Notfall",
    "Waschbär Pflegestelle vermitteln",
    "Waschbär Patenschaft verschenken",
    "Wilde Heimat Waschbär",
    "Waschbär Sachsen-Anhalt",
    "Fundtier Waschbär",
  ],
};

/**
 * Footer-Links zu Admin & Paten-Bereich – während der Entwicklung sichtbar.
 * In Produktion: NEXT_PUBLIC_SHOW_INTERNAL_LINKS=true oder vor Launch false.
 */
export const showInternalLinks =
  process.env.NEXT_PUBLIC_SHOW_INTERNAL_LINKS === "true" ||
  process.env.NEXT_PUBLIC_SHOW_ADMIN_LINK === "true" ||
  (process.env.NODE_ENV === "development" &&
    process.env.NEXT_PUBLIC_SHOW_INTERNAL_LINKS !== "false" &&
    process.env.NEXT_PUBLIC_SHOW_ADMIN_LINK !== "false");

/** Stat-Karte: regionales Schwerpunktgebiet */
export const regionStat = {
  type: "static" as const,
  value: siteConfig.operatingAreaShort,
  label: siteConfig.operatingArea,
};

/** Stat-Karte: überregionale Reichweite */
export const scopeStat = {
  type: "static" as const,
  value: "DE",
  label: "Hilfe deutschlandweit",
};

/** Rechtlicher Hinweis zu freiwilliger Unterstützung */
export const unterstuetzungHinweis =
  "Alle Unterstützungen erfolgen freiwillig. Aktuell können keine steuerlich absetzbaren Bescheinigungen für Unterstützungen ausgestellt werden.";

/** Hinweis zu Patenschaften */
export const patenschaftHinweis =
  "Patenschaften sind freiwillige Unterstützungsprogramme und begründen kein Eigentums- oder Besitzverhältnis am Tier. Sie dienen ausschließlich der Unterstützung des Projekts Wilde Heimat.";

/** Hinweis Hilfe & Vermittlung */
export const vermittlungHinweis =
  "Wilde Heimat nimmt aktuell keine Waschbären selbst auf. Stattdessen vermitteln wir Kontakte zu geeigneten Ansprechpartnern und Pflegestellen.";

export const patenschaftsStufen = [
  {
    id: "bronze",
    name: "Bronze",
    preis: 10,
    tagline: "Der Einstieg mit Herz",
    beschreibung:
      "Du hilfst zuverlässig mit – und bekommst eine persönliche Urkunde als Dankeschön.",
    leistungen: ["Persönliche Urkunde mit Namensnennung"],
    accentClass: "from-amber-700/80 to-amber-600/40",
  },
  {
    id: "silber",
    name: "Silber",
    preis: 20,
    tagline: "Näher dran",
    beschreibung:
      "Regelmäßige Fotos und eine Tasse – so bleibst du sichtbar mit deinem Patentier verbunden.",
    leistungen: [
      "Persönliche Urkunde mit Namensnennung",
      "Fotos deines Patentiers",
      "Tasse mit Waschbärmotiv",
    ],
    accentClass: "from-stone-500/70 to-stone-400/30",
    badge: "Beliebteste Wahl",
  },
  {
    id: "gold",
    name: "Gold",
    preis: 50,
    tagline: "Voll dabei",
    beschreibung:
      "Wöchentliche Updates und alle Extras – für alle, die ganz nah am Geschehen sein wollen.",
    leistungen: [
      "Persönliche Urkunde mit Namensnennung",
      "Fotos deines Patentiers",
      "Wöchentliche Updates von Juja",
      "Tasse mit Waschbärmotiv",
    ],
    accentClass: "from-amber-500/80 to-yellow-400/40",
  },
] as const;

/** Ablauf Patenschaft – Schritt-für-Schritt für Besucher */
export const patenschaftIntro = {
  title: "So funktioniert deine Patenschaft",
  subtitle:
    "In fünf Schritten von der Idee zur festen Begleitung – persönlich, transparent und unkompliziert.",
  teaser:
    "Eine Patenschaft ist mehr als eine monatliche Spende: Du wählst einen Waschbären, der dir besonders wichtig ist, und wirst Teil seines Wegs – mit Urkunde, Fotos und Updates, ganz nach deiner Stufe.",
} as const;

export const patenschaftAblauf = [
  {
    nr: "1",
    title: "Waschbär wählen",
    text: "Such dir einen unserer Waschbären aus – der dir am Herzen liegt.",
  },
  {
    nr: "2",
    title: "Stufe festlegen",
    text: "Bronze, Silber oder Gold: Du entscheidest, wie nah du dabei sein möchtest.",
  },
  {
    nr: "3",
    title: "Anfrage senden",
    text: "Kurzes Formular ausfüllen – Name, Kontakt, Waschbär und Stufe reichen.",
  },
  {
    nr: "4",
    title: "Bestätigung erhalten",
    text: "Wir melden uns persönlich und schicken dir den PayPal-Link für deine monatliche Unterstützung.",
  },
  {
    nr: "5",
    title: "Dabei bleiben",
    text: "Urkunde, Fotos und Updates – je nach Stufe begleitest du dein Patentier von nun an.",
  },
] as const;

/** Wirkung der Patenschaft – emotionaler Kontext */
export const patenschaftWirkung = [
  {
    title: "Futter & Pflege",
    text: "Dein Beitrag sichert tägliches Futter, Leckerlis und artgerechte Versorgung.",
  },
  {
    title: "Tierarzt & Medikamente",
    text: "Vom Check-up bis zur Behandlung – damit unsere Waschbären gesund bleiben.",
  },
  {
    title: "Gehege & Einrichtung",
    text: "Material, Ausstattung und laufender Unterhalt für sichere Rückzugsorte.",
  },
] as const;

/** Amazon-Wunschliste für direkte Sachspenden */
export const amazonWishlist = {
  title: "Bärchen-Wishlist",
  subtitle: "Sachspenden für unsere Waschbären",
  url: siteConfig.amazonWishlist,
  /** Beispiel-Kategorien aus der Wunschliste – zur Orientierung */
  kategorien: [
    { label: "Futter & Leckerlis", beispiel: "Hühnerfüße, Insektenmix, Trockenfutter" },
    { label: "Gehege & Ausstattung", beispiel: "Juteseil, Schutznetz, Laufrad" },
    { label: "Pflege & Sicherheit", beispiel: "Lebendfalle, Schutznetze" },
    { label: "Leckereien", beispiel: "Cashewkerne, Löffelbiskuits" },
  ],
} as const;

export const projekte = [
  {
    title: "Aufklärungsarbeit",
    description:
      "Wir informieren über das richtige Verhalten bei Waschbärfunden und entkräften Vorurteile – regional in Mansfeld-Südharz und online deutschlandweit.",
  },
  {
    title: "Vernetzung",
    description:
      "Wir vernetzen Menschen, Pflegestellen und Interessierte, um hilfsbedürftigen Waschbären schneller helfen zu können.",
  },
  {
    title: "Hilfe & Vermittlung",
    description:
      "Bei Funden und Notfällen vermitteln wir Kontakte zu geeigneten Ansprechpartnern – fachgerecht und einfühlsam.",
  },
];
