import { PhotoPageHero } from "@/components/layout/PhotoPageHero";
import { PageCta } from "@/components/layout/PageCta";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { InfoBox } from "@/components/ui/InfoBox";
import {
  PflegestelleForm,
  WaschbaerGefundenForm,
  VermittlungsForm,
} from "@/components/forms/VermittlungForms";
import { DesignPhotoStrip } from "@/components/PhotoStrip";
import { FadeIn, Stagger, StaggerItem } from "@/components/motion/FadeIn";
import { pagePhotos } from "@/data/pagePhotos";
import { vermittlungHinweis, siteConfig } from "@/data/site";
import { hilfeFaq } from "@/data/hilfeFaq";
import { createMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, faqPageSchema, jsonLdGraph, webPageSchema } from "@/lib/jsonLd";

export const metadata = createMetadata({
  title: "Waschbär gefunden – Hilfe & Vermittlung",
  description:
    "Waschbär oder Waschbärbaby gefunden? Melde den Fund bei Wilde Heimat – wir beraten einfühlsam, vermitteln Pflegestellen und helfen bei der Einschätzung. Schwerpunkt Mansfeld-Südharz, deutschlandweit.",
  path: "/hilfe",
  keywords: [
    "Waschbär gefunden",
    "Waschbärbaby gefunden",
    "Waschbär Hilfe Mansfeld-Südharz",
    "Waschbär Notfall",
    "Fundtier melden",
  ],
});

const formSections = [
  {
    id: "fund-melden",
    title: "Waschbär gefunden",
    subtitle:
      "Melde einen Fund – wir helfen dir bei der richtigen Einschätzung und vermitteln Ansprechpartner.",
    form: <WaschbaerGefundenForm />,
  },
  {
    id: "pflegestelle",
    title: "Pflegestelle werden",
    subtitle:
      "Du möchtest Pflegestelle werden? Wir nehmen deine Anfrage auf und vernetzen dich im Netzwerk.",
    form: <PflegestelleForm />,
  },
  {
    id: "vermittlung",
    title: "Vermittlungsanfrage",
    subtitle: "Hast du ein Anliegen rund um Waschbärhilfe oder Vermittlung?",
    form: <VermittlungsForm />,
  },
] as const;

export default function HilfePage() {
  const structuredData = jsonLdGraph([
    webPageSchema({
      title: "Waschbär gefunden – Hilfe & Vermittlung",
      description:
        "Fund melden, Pflegestelle finden, Vermittlung – Wilde Heimat hilft bei Waschbärfunden.",
      path: "/hilfe",
    }),
    breadcrumbSchema([
      { name: "Start", path: "/" },
      { name: "Hilfe", path: "/hilfe" },
    ]),
    faqPageSchema([...hilfeFaq]),
  ]);

  return (
    <>
      <JsonLd data={structuredData} />
      <PhotoPageHero
        eyebrow="Hilfe & Vermittlung"
        title="Wir helfen dir, das Richtige zu tun."
        subtitle={`Schwerpunkt ${siteConfig.operatingArea} – wir vermitteln Kontakte und unterstützen deutschlandweit, wo wir können.`}
        backgroundPhoto={pagePhotos.hero}
        photoCredit={pagePhotos.hero.credit}
      >
        <Button href="#fund-melden" variant="secondary">
          Fund melden
        </Button>
        <Button href="/ratgeber" variant="inverse">
          Zum Ratgeber
        </Button>
      </PhotoPageHero>

      <Section>
        <FadeIn className="max-w-2xl mx-auto space-y-4 mb-16">
          <InfoBox variant="prominent" className="text-muted">
            <strong className="text-foreground">Wichtig:</strong> {vermittlungHinweis}
          </InfoBox>
          <InfoBox className="text-muted">
            <strong className="text-foreground">Notfall?</strong> Wenn ein Waschbär
            sichtbar verletzt, unterkühlt oder in unmittelbarer Gefahr ist,
            kontaktiere uns umgehend per E-Mail. Füttere das Tier nicht
            eigenständig.
          </InfoBox>
        </FadeIn>

        <Stagger className="space-y-20" stagger={0.15}>
          {formSections.map((section, index) => (
            <StaggerItem key={section.id}>
              <div
                id={section.id}
                className={index > 0 ? "pt-12 border-t border-border" : undefined}
              >
                <SectionHeader title={section.title} subtitle={section.subtitle} />
                <div className="max-w-2xl min-w-0">
                  <Card hover={false} padding="md" className="min-w-0 overflow-x-clip">
                    {section.form}
                  </Card>
                </div>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      <Section soft>
        <FadeIn>
          <SectionHeader
            title="Häufige Fragen"
            subtitle="Kurz und klar – besonders wenn du einen Waschbärfund melden möchtest."
            centered
          />
        </FadeIn>
        <FadeIn className="max-w-3xl mx-auto">
          <dl className="space-y-6">
            {hilfeFaq.map((item) => (
              <div
                key={item.question}
                className="rounded-2xl border border-border bg-background/90 p-5 sm:p-6 shadow-soft"
              >
                <dt className="font-medium text-forest">{item.question}</dt>
                <dd className="mt-2 text-sm text-muted leading-relaxed">{item.answer}</dd>
              </div>
            ))}
          </dl>
        </FadeIn>
      </Section>

      <Section soft>
        <FadeIn>
          <SectionHeader
            title="Einblicke"
            subtitle="Dekorative Waschbär-Impressionen – ohne Zuordnung zu einzelnen Tieren."
            centered
          />
        </FadeIn>
        <DesignPhotoStrip count={6} />
      </Section>

      <PageCta
        title="Dringender Fall?"
        description="Schreib uns direkt per E-Mail – wir melden uns so schnell wie möglich bei dir zurück."
        backgroundPhoto={pagePhotos.intro}
      >
        <Button href="/kontakt" variant="secondary">
          Kontakt aufnehmen
        </Button>
        <Button href="/ratgeber" variant="inverse">
          Ratgeber lesen
        </Button>
      </PageCta>
    </>
  );
}
