export type NavLink = {
  label: string;
  href: string;
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
