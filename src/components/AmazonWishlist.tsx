import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { InfoBox } from "@/components/ui/InfoBox";
import { FadeIn, Stagger, StaggerItem } from "@/components/motion/FadeIn";
import { amazonWishlist } from "@/data/site";

const schritte = [
  {
    nr: "1",
    title: "Wunschliste öffnen",
    text: "Du gelangst direkt zu unserer Amazon-Wunschliste mit allen benötigten Artikeln.",
  },
  {
    nr: "2",
    title: "Artikel auswählen",
    text: "Wähle einen oder mehrere Artikel – von Futter über Gehege-Material bis zu Leckerlis.",
  },
  {
    nr: "3",
    title: "Bezahlen & versenden",
    text: "Bezahle wie gewohnt bei Amazon. Die Lieferadresse ist in der Wunschliste hinterlegt – der Versand geht direkt zu uns.",
  },
];

export function AmazonWishlist() {
  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <FadeIn>
        <Card hover={false} className="bg-cream/90 border-sand/60">
          <div className="flex flex-col sm:flex-row sm:items-start gap-6">
            <div className="h-14 w-14 rounded-2xl bg-forest text-background flex items-center justify-center shrink-0 shadow-sm">
              <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M21 11.25v8.25a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 19.5v-8.25M12 4.875A2.437 2.437 0 0114.437 2.25c1.125 0 2.063.75 2.437 1.875M12 4.875C10.875 4.875 9.937 5.625 9.563 6.75M12 4.875V9m-6.75 2.25h13.5"
                />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm uppercase tracking-wider text-muted">Sachspenden</p>
              <h3 className="mt-1 text-2xl font-light">{amazonWishlist.title}</h3>
              <p className="mt-3 text-muted leading-relaxed">
                Über unsere Amazon-Wunschliste kannst du benötigte Artikel für unsere
                Waschbären direkt auswählen, bezahlen und an uns versenden lassen –
                ohne Umwege, ohne Abstimmung im Voraus.
              </p>
              <div className="mt-6 [&_a]:w-full sm:[&_a]:w-auto [&_a]:justify-center">
                <Button
                  href={amazonWishlist.url}
                  variant="primary"
                  external
                  className="inline-flex items-center gap-2"
                >
                  Zur Amazon-Wunschliste
                  <span aria-hidden>↗</span>
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </FadeIn>

      <Stagger className="grid grid-cols-1 sm:grid-cols-3 gap-4" stagger={0.08}>
        {schritte.map((schritt) => (
          <StaggerItem key={schritt.nr}>
            <div className="h-full p-5 rounded-2xl border border-border bg-background/80 text-center">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-sand-light text-sm font-medium text-forest">
                {schritt.nr}
              </span>
              <h4 className="mt-3 font-medium">{schritt.title}</h4>
              <p className="mt-2 text-sm text-muted leading-relaxed">{schritt.text}</p>
            </div>
          </StaggerItem>
        ))}
      </Stagger>

      <FadeIn>
        <p className="text-sm font-medium text-center mb-4">Auf der Wunschliste unter anderem</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {amazonWishlist.kategorien.map((kat) => (
            <div
              key={kat.label}
              className="px-4 py-3 rounded-xl border border-border bg-sand-light/40"
            >
              <p className="text-sm font-medium">{kat.label}</p>
              <p className="text-xs text-muted mt-0.5">{kat.beispiel}</p>
            </div>
          ))}
        </div>
      </FadeIn>

      <FadeIn>
        <InfoBox className="text-sm text-muted">
          Die Wunschliste wird regelmäßig aktualisiert. Beim Bestellen über Amazon wird
          die bei uns hinterlegte Lieferadresse automatisch verwendet – du musst keine
          Adresse selbst eingeben. Sachspenden sind freiwillig und unterstützen
          direkt die Versorgung unserer Waschbären.
        </InfoBox>
      </FadeIn>
    </div>
  );
}
