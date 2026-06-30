import { PhotoPageHero } from "@/components/layout/PhotoPageHero";
import { PageCta } from "@/components/layout/PageCta";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { InfoBox } from "@/components/ui/InfoBox";
import { KontaktForm } from "@/components/forms/KontaktForm";
import { SocialLinks } from "@/components/SocialLinks";
import { FadeIn } from "@/components/motion/FadeIn";
import { pagePhotos } from "@/data/pagePhotos";
import { siteConfig } from "@/data/site";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Kontakt – Wilde Heimat",
  description:
    "Kontakt zu Wilde Heimat: Fragen, Waschbärfund melden, Patenschaft anfragen. E-Mail kontakt@wilde-heimat-msh.de – Antwort aus Lutherstadt Eisleben / Mansfeld-Südharz.",
  path: "/kontakt",
  keywords: ["Waschbär Hilfe Kontakt", "Wilde Heimat Kontakt"],
});

export default function KontaktPage() {
  return (
    <>
      <PhotoPageHero
        eyebrow="Kontakt"
        title="Wir freuen uns auf deine Nachricht."
        subtitle="Ob Frage, Fundmeldung, Patenschaft oder Anregung – schreib uns, wir melden uns bei dir."
        backgroundPhoto={pagePhotos.about}
      >
        <Button href="/hilfe#fund-melden" variant="secondary">
          Fund melden
        </Button>
        <Button href={`mailto:${siteConfig.email}`} variant="inverse" external>
          E-Mail schreiben
        </Button>
      </PhotoPageHero>

      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          <FadeIn>
            <SectionHeader title="Schreib uns" />
            <Card hover={false} padding="md">
              <KontaktForm />
            </Card>
          </FadeIn>

          <FadeIn delay={0.1}>
            <SectionHeader title="Direkt erreichen" />
            <div className="space-y-4">
              <Card hover={false} padding="md">
                <p className="text-sm text-muted">E-Mail</p>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="mt-1 block text-lg hover:underline"
                >
                  {siteConfig.email}
                </a>
              </Card>
              <Card hover={false} padding="md">
                <p className="text-sm text-muted">Region</p>
                <p className="mt-1 text-lg">{siteConfig.region}</p>
              </Card>
              <Card hover={false} padding="md">
                <p className="text-sm text-muted mb-4">Social Media</p>
                <SocialLinks />
              </Card>
              <InfoBox className="text-muted">
                <strong className="text-foreground">Waschbär-Notfall?</strong>{" "}
                Nutze bei dringenden Fällen das{" "}
                <a href="/hilfe#fund-melden" className="underline hover:no-underline">
                  Fundmelde-Formular
                </a>{" "}
                oder kontaktiere uns direkt per E-Mail.
              </InfoBox>
            </div>
          </FadeIn>
        </div>
      </Section>

      <PageCta
        title="Mehr über Wilde Heimat"
        description="Erfahre, wie alles begann, wer hinter dem Projekt steht und wie du Waschbären unterstützen kannst."
        backgroundPhoto={pagePhotos.heroLight}
      >
        <Button href="/ueber-uns" variant="secondary">
          Über uns
        </Button>
        <Button href="/unterstuetzen" variant="inverse">
          Unterstützen
        </Button>
      </PageCta>
    </>
  );
}
