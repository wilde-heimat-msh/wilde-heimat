import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/Button";
import { PhotoPageHero } from "@/components/layout/PhotoPageHero";
import { pagePhotos } from "@/data/pagePhotos";
import { FadeIn } from "@/components/motion/FadeIn";
import { Section } from "@/components/ui/Section";

export default function NotFound() {
  return (
    <>
      <PhotoPageHero
        eyebrow="404"
        title="Seite nicht gefunden"
        subtitle="Die gesuchte Seite existiert leider nicht oder wurde verschoben – aber unsere Waschbären warten auf dich."
        backgroundPhoto={pagePhotos.heroLight}
        photoCredit={pagePhotos.heroLight.credit}
      >
        <Button href="/" variant="secondary">
          Zur Startseite
        </Button>
        <Button href="/waschbaeren" variant="inverse">
          Waschbären ansehen
        </Button>
      </PhotoPageHero>

      <Section soft className="py-12">
        <FadeIn className="text-center max-w-md mx-auto">
          <Logo size={48} className="h-12 w-12 mx-auto mb-4 opacity-80" />
          <p className="text-muted leading-relaxed">
            Vielleicht findest du, was du suchst, auf einer unserer Hauptseiten.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button href="/hilfe" variant="outline">
              Hilfe & Vermittlung
            </Button>
            <Button href="/kontakt" variant="outline">
              Kontakt
            </Button>
          </div>
        </FadeIn>
      </Section>
    </>
  );
}
