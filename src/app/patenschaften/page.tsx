import { PhotoPageHero } from "@/components/layout/PhotoPageHero";
import { StatsBand } from "@/components/layout/StatsBand";
import { PageCta } from "@/components/layout/PageCta";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { InfoBox } from "@/components/ui/InfoBox";
import { WaschbaerCard } from "@/components/WaschbaerCard";
import { PatenschaftTierCards } from "@/components/PatenschaftTierCards";
import { PatenschaftGuide } from "@/components/PatenschaftGuide";
import { PatenschaftQuote } from "@/components/PatenschaftQuote";
import { PatenschaftBelohnungen } from "@/components/PatenschaftBelohnungen";
import { PatenschaftGeschenk } from "@/components/PatenschaftGeschenk";
import { PatenschaftFaq } from "@/components/PatenschaftFaq";
import { PatenschaftAnfrageSection } from "@/components/PatenschaftAnfrageSection";
import { LegalDisclaimer } from "@/components/LegalDisclaimer";
import { DesignPhotoStrip } from "@/components/PhotoStrip";
import { FadeIn, Stagger, StaggerItem } from "@/components/motion/FadeIn";
import { pagePhotos } from "@/data/pagePhotos";
import { paypalDonation } from "@/data/paypal";
import { patenschaftAblauf, patenschaftHinweis } from "@/data/site";
import { patenschaftFaq } from "@/data/patenschaften";
import { waschbaeren } from "@/data/waschbaeren";
import { createMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  breadcrumbSchema,
  faqPageSchema,
  jsonLdGraph,
  webPageSchema,
} from "@/lib/jsonLd";

export const metadata = createMetadata({
  title: "Waschbär-Patenschaften",
  description:
    "Waschbär-Patenschaft bei Wilde Heimat: Bronze ab 10 €, Silber mit Fotos & Tasse, Gold mit wöchentlichen Updates. Freiwillige Unterstützung – auch als Geschenk. Mansfeld-Südharz, deutschlandweit.",
  path: "/patenschaften",
  keywords: [
    "Waschbär Patenschaft",
    "Patenschaft verschenken",
    "Waschbär adoptieren",
    "Waschbär unterstützen",
  ],
  ogImage: pagePhotos.patenschaften.src,
  ogImageAlt: "Waschbär-Patenschaft bei Wilde Heimat",
});

export default function PatenschaftenPage() {
  const structuredData = jsonLdGraph([
    webPageSchema({
      title: "Waschbär-Patenschaften",
      description:
        "Waschbär-Patenschaft bei Wilde Heimat – Bronze, Silber oder Gold. Freiwillige monatliche Unterstützung.",
      path: "/patenschaften",
    }),
    breadcrumbSchema([
      { name: "Start", path: "/" },
      { name: "Patenschaften", path: "/patenschaften" },
    ]),
    faqPageSchema(
      patenschaftFaq.map((item) => ({
        question: item.question,
        answer: item.answer,
      }))
    ),
  ]);

  return (
    <>
      <JsonLd data={structuredData} />
      <PhotoPageHero
        eyebrow="Patenschaften"
        title="Gib einem Waschbären eine Stimme."
        subtitle="Wähle deinen Waschbären, entscheide dich für eine Stufe – und begleite ihn monatlich mit Urkunde, Fotos und Updates."
        backgroundPhoto={pagePhotos.patenschaften}
        photoCredit={pagePhotos.patenschaften.credit}
      >
        <Button href="#ablauf" variant="secondary">
          So funktioniert&apos;s
        </Button>
        <Button href="#patenschaft-anfragen" variant="inverse">
          Patenschaft anfragen
        </Button>
      </PhotoPageHero>

      <StatsBand
        items={[
          { type: "counter", value: waschbaeren.length, label: "Waschbären" },
          { type: "static", value: String(patenschaftAblauf.length), label: "Schritte zum Start" },
          { type: "static", value: "ab 10 €", label: "Monatlich" },
        ]}
      />

      <Section soft id="ablauf">
        <PatenschaftGuide />
      </Section>

      <Section>
        <PatenschaftQuote />
      </Section>

      <Section soft id="stufen">
        <FadeIn>
          <SectionHeader
            title="Schritt 2: Patenschaftsstufen"
            subtitle="Drei Stufen, ein Ziel: Dein Patentier sicher versorgt – und du nah am Geschehen."
            centered
          />
        </FadeIn>
        <PatenschaftTierCards variant="light" showCta />
        <LegalDisclaimer className="max-w-2xl mx-auto mt-10 text-center" />
      </Section>

      <Section>
        <PatenschaftBelohnungen />
      </Section>

      <Section soft id="waschbaeren-waehlen">
        <FadeIn>
          <SectionHeader
            title="Schritt 1: Wähle deinen Waschbären"
            subtitle="Jeder unserer Waschbären freut sich über eine Patenschaft – such dir deinen Favoriten aus."
            centered
          />
        </FadeIn>
        <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6" stagger={0.06}>
          {waschbaeren.map((w) => (
            <StaggerItem key={w.slug}>
              <WaschbaerCard waschbaer={w} compact patenschaftSelect />
            </StaggerItem>
          ))}
        </Stagger>
        <FadeIn className="mt-8 text-center [&_a]:w-full sm:[&_a]:w-auto [&_a]:justify-center flex flex-col sm:flex-row flex-wrap justify-center gap-3">
          <Button href="#stufen" variant="outline">
            Stufe wählen
          </Button>
          <Button href="#patenschaft-anfragen" variant="primary">
            Weiter zur Anfrage
          </Button>
        </FadeIn>
      </Section>

      <Section className="py-12 md:py-16">
        <DesignPhotoStrip count={8} />
      </Section>

      <Section soft id="geschenk">
        <PatenschaftGeschenk />
      </Section>

      <Section id="patenschaft-anfragen">
        <PatenschaftAnfrageSection />
      </Section>

      <Section soft id="faq">
        <PatenschaftFaq />
      </Section>

      <Section>
        <FadeIn className="max-w-3xl mx-auto space-y-4">
          <InfoBox className="text-muted">{patenschaftHinweis}</InfoBox>
          <InfoBox className="text-muted">{paypalDonation.patenschaftNote}</InfoBox>
        </FadeIn>
      </Section>

      <PageCta
        title="Noch unsicher?"
        description="Schreib uns – wir erklären dir gerne, wie Patenschaften funktionieren und was du erwarten kannst."
        backgroundPhoto={pagePhotos.heroLight}
      >
        <Button href="/kontakt" variant="secondary">
          Kontakt aufnehmen
        </Button>
        <Button href="#faq" variant="inverse">
          FAQ lesen
        </Button>
      </PageCta>
    </>
  );
}
