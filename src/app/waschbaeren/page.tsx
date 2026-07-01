import { PhotoPageHero } from "@/components/layout/PhotoPageHero";
import { StatsBand } from "@/components/layout/StatsBand";
import { PageCta } from "@/components/layout/PageCta";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { InfoBox } from "@/components/ui/InfoBox";
import { WaschbaerCard } from "@/components/WaschbaerCard";
import { DesignPhotoStrip } from "@/components/PhotoStrip";
import { FadeIn, Stagger, StaggerItem } from "@/components/motion/FadeIn";
import { pagePhotos } from "@/data/pagePhotos";
import { patenschaftHinweis } from "@/data/site";
import { waschbaeren } from "@/data/waschbaeren";
import { createMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, itemListSchema, jsonLdGraph, webPageSchema } from "@/lib/jsonLd";

export const metadata = createMetadata({
  title: "Unsere Waschbären – Patenschaft übernehmen",
  description: `${waschbaeren.length} Waschbären bei Wilde Heimat: Pedro, Mausi, Lotti und mehr. Eigene Geschichte, Steckbrief & Patenschaft ab 10 € – Mansfeld-Südharz, Sachsen-Anhalt.`,
  path: "/waschbaeren",
  keywords: [
    "Waschbär Patenschaft",
    "Waschbären Mansfeld-Südharz",
    "Waschbär adoptieren",
  ],
});

const profilHinweis =
  "Profilfotos werden nach und nach ergänzt. Luna, Oskar, Mila, Pablo und Loki haben bereits echte Bilder – weitere Tiere folgen, sobald die Fotos fest zugeordnet sind.";

export default function WaschbaerenPage() {
  const structuredData = jsonLdGraph([
    webPageSchema({
      title: "Unsere Waschbären",
      description: "Alle Waschbären von Wilde Heimat – Patenschaft und Profile.",
      path: "/waschbaeren",
    }),
    breadcrumbSchema([
      { name: "Start", path: "/" },
      { name: "Waschbären", path: "/waschbaeren" },
    ]),
    itemListSchema(
      waschbaeren.map((w) => ({
        name: w.name,
        path: `/waschbaeren/${w.slug}`,
      }))
    ),
  ]);

  return (
    <>
      <JsonLd data={structuredData} />
      <PhotoPageHero
        eyebrow="Unsere Waschbären"
        title={`${waschbaeren.length} Geschichten, eine Stimme.`}
        subtitle="Hinter jedem Waschbär steckt eine eigene Geschichte. Lerne sie kennen – mit Steckbrief, Charakter und persönlicher Patenschaft."
        backgroundPhoto={pagePhotos.patenschaften}
        photoCredit={pagePhotos.patenschaften.credit}
      >
        <Button href="/patenschaften" variant="secondary">
          Patenschaft übernehmen
        </Button>
        <Button href="#alle-waschbaeren" variant="inverse">
          Alle ansehen
        </Button>
      </PhotoPageHero>

      <StatsBand
        items={[
          { type: "counter", value: waschbaeren.length, label: "Waschbären" },
          { type: "counter", value: waschbaeren.length, label: "Profile & Geschichten" },
          { type: "static", value: "2024", label: "Beginn der Mission" },
          { type: "static", value: "3", label: "Patenschaftsstufen" },
        ]}
      />

      <Section id="alle-waschbaeren">
        <FadeIn>
          <SectionHeader
            title={`${waschbaeren.length} Waschbären bei Wilde Heimat`}
            subtitle="Jeder Waschbär hat eine eigene Profilseite mit Galerie, Steckbrief und Charakterbeschreibung."
          />
        </FadeIn>
        <FadeIn delay={0.05}>
          <InfoBox className="max-w-3xl mb-10 text-muted">{profilHinweis}</InfoBox>
        </FadeIn>
        <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8" stagger={0.06}>
          {waschbaeren.map((w) => (
            <StaggerItem key={w.slug}>
              <WaschbaerCard waschbaer={w} />
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      <Section soft>
        <FadeIn>
          <SectionHeader
            title="Einblicke"
            subtitle="Dekorative Waschbär-Impressionen – ohne Zuordnung zu einzelnen Tieren."
            centered
          />
        </FadeIn>
        <DesignPhotoStrip count={10} />
      </Section>

      <PageCta
        title="Werde Teil einer Geschichte"
        description="Mit einer Patenschaft begleitest du einen Waschbären – persönlich, transparent und freiwillig. Du erhältst Updates, Fotos und eine Urkunde."
        backgroundPhoto={pagePhotos.heroLight}
        extra={
          <InfoBox className="text-left text-muted-light border-background/20 bg-background/10 backdrop-blur-sm">
            {patenschaftHinweis}
          </InfoBox>
        }
      >
        <Button href="/patenschaften" variant="secondary">
          Patenschaft übernehmen
        </Button>
        <Button href="/unterstuetzen" variant="inverse">
          Andere Wege unterstützen
        </Button>
      </PageCta>
    </>
  );
}
