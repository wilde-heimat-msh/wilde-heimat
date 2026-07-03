export type Waschbaer = {
  slug: string;
  name: string;
  aufgenommen: string;
  eigenschaften: string[];
  kurztext: string;
  geschichte: string;
  charakter: string;
  farbe: string;
};

export const waschbaeren: Waschbaer[] = [
  {
    slug: "pedro",
    name: "Pedro",
    aufgenommen: "Juli 2024",
    eigenschaften: ["Kuschelbär", "Chef der Gruppe", "neugierig", "aufgeschlossen"],
    kurztext: "Pedro ist der Kuschelbär und unbestrittener Chef der Gruppe.",
    geschichte:
      "Pedro kam im Juli 2024 zu uns – klein, hungrig und voller Neugier. Von Anfang an zeigte er eine besondere Führungsqualität: Er war der Erste, der neue Umgebungen erkundete, und der Letzte, der sich abends noch eine Kuscheleinheit gönnte. Heute sorgt Pedro mit seiner ruhigen, selbstbewussten Art für Stabilität in unserer Gruppe.",
    charakter:
      "Pedro ist der Kuschelkönig. Er liebt Nähe, sucht bewusst Kontakt zu Menschen und zu seinen Artgenossen. Seine Neugier treibt ihn an, neue Dinge zu entdecken – aber immer mit der Gelassenheit eines echten Anführers.",
    farbe: "from-neutral-800 to-neutral-600",
  },
  {
    slug: "mausi",
    name: "Mausi",
    aufgenommen: "Juni 2024",
    eigenschaften: ["Queen der Gruppe", "verspielt", "verschmust", "verfressen"],
    kurztext: "Mausi ist die Queen – verspielt, verschmust und immer hungrig.",
    geschichte:
      "Mausi war der erste Waschbär, der zu uns kam – und damit der Beginn von Wilde Heimat. Im Juni 2024 wurde sie bei uns aufgenommen, winzig, schwach und doch voller Lebensfreude. Aus ihrer Geschichte entstand die Idee, Waschbären eine Stimme zu geben und Menschen für ihr Wohl zu sensibilisieren.",
    charakter:
      "Mausi regiert mit Charme statt mit Strenge. Sie ist verspielt bis ins Detail, verschmust wie kaum ein anderer und wenn es ums Futter geht, kennt sie kein Halten. Ihre Queen-Energie hält die ganze Gruppe zusammen.",
    farbe: "from-neutral-700 to-neutral-500",
  },
  {
    slug: "lotti",
    name: "Lotti",
    aufgenommen: "Mai 2025",
    eigenschaften: ["verspielt", "aufgeschlossen", "anhänglich", "Süßzahn"],
    kurztext: "Lotti ist anhänglich, verspielt und voller Vertrauen – der Süßzahn der Gruppe.",
    geschichte:
      "Lotti kam im Mai 2025 zu uns und brachte von Anfang an eine besondere Anhänglichkeit mit. Sie suchte Nähe, Vertrauen und Geborgenheit – und fand all das in unserer Pflege. Ihr offenes Wesen macht sie zu einer der herzlichsten Waschbären bei Wilde Heimat.",
    charakter:
      "Lotti ist der Süßzahn der Gruppe mit dem großen Herzen. Sie ist verspielt, aufgeschlossen gegenüber Neuem und hängt an den Menschen und Tieren, die sie liebt. Wer Lotti kennt, versteht, warum Waschbären so faszinierend sein können.",
    farbe: "from-neutral-600 to-neutral-400",
  },
  {
    slug: "minnie",
    name: "Minnie",
    aufgenommen: "Juni 2025",
    eigenschaften: ["verschmust", "kleiner Engel", "Schlafmütze"],
    kurztext: "Minnie ist verschmust und eine echte Schlafmütze – der kleine Engel der Gruppe.",
    geschichte:
      "Minnie kam im Juni 2025 zu uns und überzeugte von Anfang an mit ihrer sanften Art. Sie ist klein, zart und hat eine Vorliebe für lange Nickerchen an den gemütlichsten Plätzen. Ihre ruhige Präsenz wirkt beruhigend auf die ganze Gruppe.",
    charakter:
      "Minnie ist der kleine Engel der Gruppe. Verschmust, geduldig und mit einem ausgeprägten Schlafbedürfnis. Sie zeigt, dass Waschbären nicht immer laut und wild sein müssen – manchmal reicht ein sanftes Schnurren und ein warmes Plätzchen.",
    farbe: "from-neutral-500 to-neutral-300",
  },
  {
    slug: "mika",
    name: "Mika",
    aufgenommen: "Juni 2025",
    eigenschaften: ["schreckhaft", "verspielt", "verfressen", "Waffelliebhaber"],
    kurztext: "Mika ist schreckhaft, verspielt – und ein leidenschaftlicher Waffelliebhaber.",
    geschichte:
      "Mika wurde im Juni 2025 bei uns aufgenommen und brauchte zunächst viel Geduld und Ruhe. Anfangs schreckhaft und zurückhaltend, öffnete sie sich mit der Zeit und zeigte ihr wahres, verspieltes Wesen. Besonders Waffeln haben es ihr angetan.",
    charakter:
      "Mika braucht Zeit, um Vertrauen aufzubauen – aber wer dieses Vertrauen gewinnt, erlebt einen Waschbären voller Lebensfreude. Sie ist verspielt, verfressen und hat eine Schwäche für Waffeln, die legendär ist.",
    farbe: "from-neutral-800 to-neutral-500",
  },
  {
    slug: "charlie",
    name: "Charlie",
    aufgenommen: "November 2025",
    eigenschaften: ["verspielt", "aufmüpfig", "aufgeschlossen", "Sportskanone"],
    kurztext: "Charlie ist die Sportskanone – verspielt, aufmüpfig und voller Energie.",
    geschichte:
      "Charlie kam im November 2025 zu uns und brachte sofort Action mit. Kein Klettergerüst ist ihr zu hoch, kein Spiel zu wild. Ihre Energie steckt die ganze Gruppe an und sorgt für Bewegung und gute Laune.",
    charakter:
      "Charlie ist die Sportskanone. Aufmüpfig, verspielt und immer in Bewegung. Sie liebt es zu klettern, zu rennen und neue Herausforderungen anzunehmen. Ihr offenes Wesen macht sie zum Mittelpunkt jeder Spielrunde.",
    farbe: "from-neutral-700 to-neutral-400",
  },
  {
    slug: "boba",
    name: "Boba",
    aufgenommen: "Mai 2026",
    eigenschaften: ["frech", "verspielt", "neugierig"],
    kurztext: "Boba ist frech, neugierig und immer für ein Abenteuer zu haben.",
    geschichte:
      "Boba kam im Mai 2026 zu uns – klein, frech und mit einer Neugier, die keine Grenzen kennt. Er erkundet jeden Winkel, jedes Spielzeug und jede Ecke mit dem Enthusiasmus eines echten Entdeckers.",
    charakter:
      "Boba ist der freche Entdecker. Verspielt, neugierig und mit einem Schuss Schelmerei. Er bringt Schwung in die Gruppe und zeigt uns täglich, dass Neugier eine der schönsten Eigenschaften ist.",
    farbe: "from-neutral-600 to-neutral-500",
  },
  {
    slug: "pablo",
    name: "Pablo",
    aufgenommen: "Mai 2026",
    eigenschaften: ["verschmust", "lieb", "Anführer der Kindergartengruppe"],
    kurztext: "Pablo führt die Kindergartengruppe mit Liebe und Geduld an.",
    geschichte:
      "Pablo kam im Mai 2026 zu uns und übernahm schnell eine besondere Rolle: Er wurde zum Anführer der jüngeren Waschbären. Mit seiner lieben, verschmusten Art sorgt er dafür, dass sich die Kleinen sicher und geborgen fühlen.",
    charakter:
      "Pablo ist verschmust, lieb und ein natürlicher Anführer. Er kümmert sich um die Jüngeren mit einer Geduld und Fürsorge, die beeindruckt. Wer Pablo beobachtet, sieht Führung in ihrer schönsten Form.",
    farbe: "from-neutral-800 to-neutral-600",
  },
  {
    slug: "loki",
    name: "Loki",
    aufgenommen: "Mai 2026",
    eigenschaften: ["sehr lieb", "sehr verspielt", "sehr verfressen"],
    kurztext: "Loki ist sehr lieb, sehr verspielt – und sehr verfressen.",
    geschichte:
      "Loki kam im Mai 2026 zu uns und brachte eine Energie mit, die sofort ansteckend war. Sein Name passt: Er ist verspielt wie ein kleiner Gott des Schabernacks – und dabei von Herzen lieb.",
    charakter:
      "Loki steht für alles in Extremen: sehr lieb, sehr verspielt, sehr verfressen. Er liebt Spiel, Nähe und gutes Futter gleichermaßen. Mit Loki wird es nie langweilig.",
    farbe: "from-neutral-700 to-neutral-500",
  },
  {
    slug: "luna",
    name: "Luna",
    aufgenommen: "Mai 2026",
    eigenschaften: ["aufgeschlossen", "verschmust", "neugierig"],
    kurztext: "Luna ist aufgeschlossen, verschmust und voller Neugier.",
    geschichte:
      "Luna kam im Mai 2026 zu uns und öffnete sich schnell ihrer neuen Umgebung. Ihre Neugier und ihr verschmustes Wesen machen sie zu einem Waschbären, der bei uns und bei Besuchern gleichermaßen gut ankommt.",
    charakter:
      "Luna verbindet Offenheit mit Zärtlichkeit. Sie ist neugierig auf alles Neue, aber braucht auch ihre Kuscheleinheiten. Ein ausgewogenes Wesen mit einem großen Herzen.",
    farbe: "from-neutral-500 to-neutral-400",
  },
  {
    slug: "oskar",
    name: "Oskar",
    aufgenommen: "Mai 2026",
    eigenschaften: ["zurückhaltend", "sehr lieb", "verschmust", "liebt Kuscheln"],
    kurztext: "Oskar ist zurückhaltend, aber sehr lieb – und er liebt Kuscheln.",
    geschichte:
      "Oskar kam im Mai 2026 zu uns und brauchte anfangs etwas Zeit, um Vertrauen zu fassen. Mit Geduld und Ruhe zeigte er sein wahres Ich: einen sehr lieben, verschmusten Waschbären, der Kuscheln über alles liebt.",
    charakter:
      "Oskar ist der sanfte Riese. Zurückhaltend auf den ersten Blick, aber sehr lieb und verschmust, sobald das Vertrauen da ist. Kuscheln ist seine Lieblingssprache.",
    farbe: "from-neutral-600 to-neutral-400",
  },
  {
    slug: "mila",
    name: "Mila",
    aufgenommen: "Mai 2026",
    eigenschaften: ["sehr lieb", "verspielt", "tollpatschig"],
    kurztext: "Mila ist sehr lieb, verspielt – und ein kleiner Tollpatsch.",
    geschichte:
      "Mila kam im Mai 2026 zu uns und begeisterte von Anfang an mit ihrem tollpatschigen Charme. Sie stolpert, rappelt sich auf und macht einfach weiter – immer mit einer Lebensfreude, die man förmlich spüren kann.",
    charakter:
      "Mila ist sehr lieb und verspielt, mit einer Tollpatschigkeit, die sie unwiderstehlich macht. Sie zeigt, dass Perfektion nicht nötig ist – manchmal ist das Tolle am schönsten.",
    farbe: "from-neutral-700 to-neutral-600",
  },
];

export function getWaschbaerBySlug(slug: string): Waschbaer | undefined {
  return waschbaeren.find((w) => w.slug === slug);
}
