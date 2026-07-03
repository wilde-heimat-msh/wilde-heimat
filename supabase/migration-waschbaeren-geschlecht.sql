-- Geschlechtskorrekturen in Waschbär-Texten (Pronomen & Formulierungen)
-- Im Supabase Dashboard: SQL Editor → Run

-- Lotti
update public.waschbaeren set
  kurztext = 'Lotti ist anhänglich, verspielt und voller Vertrauen – der Süßzahn der Gruppe.',
  charakter = 'Lotti ist der Süßzahn der Gruppe mit dem großen Herzen. Sie ist verspielt, aufgeschlossen gegenüber Neuem und hängt an den Menschen und Tieren, die sie liebt. Wer Lotti kennt, versteht, warum Waschbären so faszinierend sein können.'
where slug = 'lotti';

-- Minnie
update public.waschbaeren set
  kurztext = 'Minnie ist verschmust und eine echte Schlafmütze – der kleine Engel der Gruppe.',
  charakter = 'Minnie ist der kleine Engel der Gruppe. Verschmust, geduldig und mit einem ausgeprägten Schlafbedürfnis. Sie zeigt, dass Waschbären nicht immer laut und wild sein müssen – manchmal reicht ein sanftes Schnurren und ein warmes Plätzchen.'
where slug = 'minnie';

-- Mika
update public.waschbaeren set
  geschichte = 'Mika wurde im Juni 2025 bei uns aufgenommen und brauchte zunächst viel Geduld und Ruhe. Anfangs schreckhaft und zurückhaltend, öffnete sie sich mit der Zeit und zeigte ihr wahres, verspieltes Wesen. Besonders Waffeln haben es ihr angetan.',
  charakter = 'Mika braucht Zeit, um Vertrauen aufzubauen – aber wer dieses Vertrauen gewinnt, erlebt einen Waschbären voller Lebensfreude. Sie ist verspielt, verfressen und hat eine Schwäche für Waffeln, die legendär ist.'
where slug = 'mika';

-- Charlie
update public.waschbaeren set
  geschichte = 'Charlie kam im November 2025 zu uns und brachte sofort Action mit. Kein Klettergerüst ist ihr zu hoch, kein Spiel zu wild. Ihre Energie steckt die ganze Gruppe an und sorgt für Bewegung und gute Laune.',
  charakter = 'Charlie ist die Sportskanone. Aufmüpfig, verspielt und immer in Bewegung. Sie liebt es zu klettern, zu rennen und neue Herausforderungen anzunehmen. Ihr offenes Wesen macht sie zum Mittelpunkt jeder Spielrunde.'
where slug = 'charlie';

-- Charlie: Alt-Text Galerie
update public.waschbaer_gallery g
set alt = 'Charlie steht auf dem Klettergerüst in ihrem Gehege'
from public.waschbaeren w
where g.waschbaer_id = w.id
  and w.slug = 'charlie'
  and g.src like '%charlie-klettergelaende%';
