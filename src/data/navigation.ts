export type NavLink = {
  label: string;
  href: string;
  description?: string;
};

export type NavItem =
  | ({ type: "link" } & NavLink)
  | {
      type: "group";
      label: string;
      children: NavLink[];
    };

export const desktopNavigation: NavItem[] = [
  { type: "link", label: "Über uns", href: "/ueber-uns" },
  { type: "link", label: "Waschbären", href: "/waschbaeren" },
  { type: "link", label: "Patenschaften", href: "/patenschaften" },
  { type: "link", label: "Unterstützen", href: "/unterstuetzen" },
  { type: "link", label: "Ratgeber", href: "/ratgeber" },
  { type: "link", label: "Hilfe", href: "/hilfe" },
  { type: "link", label: "Kontakt", href: "/kontakt" },
  {
    type: "group",
    label: "Mein Bereich",
    children: [
      {
        label: "Paten-Updates",
        href: "/paten",
        description: "Neuigkeiten & Fotos deines Patentiers",
      },
      {
        label: "Verwaltung",
        href: "/admin",
        description: "Paten, Updates & Urkunden (Team)",
      },
    ],
  },
];

export const mobileNavigationGroups = [
  {
    title: "Wilde Heimat",
    items: [
      { label: "Startseite", href: "/" },
      { label: "Über Wilde Heimat", href: "/ueber-uns" },
      { label: "Unsere Waschbären", href: "/waschbaeren" },
      { label: "Kontakt", href: "/kontakt" },
    ],
  },
  {
    title: "Unterstützen",
    items: [
      { label: "Unterstützen", href: "/unterstuetzen" },
      { label: "Patenschaften", href: "/patenschaften" },
    ],
  },
  {
    title: "Wissen & Hilfe",
    items: [
      { label: "Waschbär-Ratgeber", href: "/ratgeber" },
      { label: "Hilfe & Vermittlung", href: "/hilfe" },
    ],
  },
  {
    title: "Paten & Team",
    items: [
      { label: "Paten-Updates", href: "/paten" },
      { label: "Verwaltung", href: "/admin" },
    ],
  },
] as const;

export const footerNavigation = {
  projekt: [
    { label: "Über Wilde Heimat", href: "/ueber-uns" },
    { label: "Unsere Waschbären", href: "/waschbaeren" },
    { label: "Kontakt", href: "/kontakt" },
  ],
  unterstuetzen: [
    { label: "Unterstützen", href: "/unterstuetzen" },
    { label: "Patenschaften", href: "/patenschaften" },
    { label: "Hilfe & Vermittlung", href: "/hilfe" },
    { label: "Waschbär-Ratgeber", href: "/ratgeber" },
  ],
  rechtliches: [
    { label: "Impressum", href: "/impressum" },
    { label: "Datenschutz", href: "/datenschutz" },
  ],
};

export const patenPortalNav = [
  { href: "/paten/portal", label: "Meine Updates" },
  { href: "/paten", label: "Zugangscode" },
] as const;

export const adminPortalNav = [
  { href: "/admin", label: "Übersicht" },
  { href: "/admin/paten", label: "Paten" },
  { href: "/admin/updates", label: "Updates" },
  { href: "/admin/urkunden", label: "Urkunden" },
] as const;
