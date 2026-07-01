import { PhotoPageHero } from "@/components/layout/PhotoPageHero";
import { StatsBand } from "@/components/layout/StatsBand";
import { PageCta } from "@/components/layout/PageCta";
import { AmazonWishlist } from "@/components/AmazonWishlist";
import { GoFundMeCampaign } from "@/components/GoFundMeCampaign";
import { PayPalDonate } from "@/components/PayPalDonate";
import { TassenShowcase } from "@/components/TassenShowcase";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { LegalDisclaimer } from "@/components/LegalDisclaimer";
import { FadeIn, Stagger, StaggerItem } from "@/components/motion/FadeIn";
import { gofundmeCampaign } from "@/data/gofundme";
import { isPayPalConfigured, paypalDonation } from "@/data/paypal";
import { pagePhotos } from "@/data/pagePhotos";
import { amazonWishlist, siteConfig } from "@/data/site";
import { createMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, jsonLdGraph, webPageSchema } from "@/lib/jsonLd";

export const metadata = createMetadata({
  title: "Wilde Heimat unterstützen",
  description:
    "Waschbärhilfe unterstützen: PayPal-Spende, GoFundMe, Amazon-Wunschliste oder Patenschaft. Wilde Heimat – private Initiative in Mansfeld-Südharz für Futter, Pflege und Gehege.",
  path: "/unterstuetzen",
  keywords: [
    "Waschbärhilfe spenden",
    "Waschbär unterstützen Sachsen-Anhalt",
    "Waschbär Spende",
  ],
});

const unterstuetzungsArten = [
  {
    title: "GoFundMe-Spende",
    description:
      "Unterstütze unsere laufende Kampagne für Futter, Pflege und Gehege-Ausbau – mit transparenten Updates.",
    cta: "Jetzt spenden",
    href: "#gofundme",
  },
  {
    title: "PayPal-Spende",
    description:
      "Spontane Einmalspende per PayPal – sicher, schnell und ohne Konto auf unserer Website.",
    cta: "Zum PayPal-Pool",
    href: isPayPalConfigured() ? paypalDonation.donateUrl : "#paypal",
    external: isPayPalConfigured(),
  },
  {
    title: "Patenschaft",
    description:
      "Werde Pate für einen der Waschbären und erhalte persönliche Updates, Fotos und eine Urkunde.",
    cta: "Patenschaft übernehmen",
    href: "/patenschaften",
  },
  {
    title: "Sachspende",
    description:
      "Futter, Ausstattung, Gehege-Material – wähle Artikel direkt aus unserer Amazon-Wunschliste und lass sie zu uns liefern.",
    cta: "Zur Wunschliste",
    href: "#amazon-wishlist",
  },
];

const plattformen = [
  {
    name: "GoFundMe",
    description: "Spenden für Futter, Pflege und Gehege – mit Updates.",
    href: siteConfig.gofundme,
    external: true,
    highlight: true,
    ctaLabel: "Jetzt spenden",
  },
  {
    name: "PayPal",
    description: "Einmalspenden direkt über den PayPal-Pool „Spenden für die Waschbären“.",
    href: isPayPalConfigured() ? paypalDonation.donateUrl : undefined,
    external: true,
    highlight: true,
    ctaLabel: "Zum PayPal-Pool",
    status: isPayPalConfigured() ? undefined : "Link wird eingerichtet",
  },
  {
    name: "Amazon Wunschliste",
    description: "Artikel auswählen, bezahlen – Versand direkt an uns.",
    href: siteConfig.amazonWishlist,
    external: true,
    highlight: true,
    ctaLabel: "Wunschliste öffnen",
  },
];

export default function UnterstuetzenPage() {
  const structuredData = jsonLdGraph([
    webPageSchema({
      title: "Wilde Heimat unterstützen",
      description:
        "Waschbärhilfe unterstützen durch Spende, Patenschaft oder Sachspende.",
      path: "/unterstuetzen",
    }),
    breadcrumbSchema([
      { name: "Start", path: "/" },
      { name: "Unterstützen", path: "/unterstuetzen" },
    ]),
  ]);

  return (
    <>
      <JsonLd data={structuredData} />
      <PhotoPageHero
        eyebrow="Unterstützen"
        title="Jede Unterstützung zählt."
        subtitle="Deine freiwillige Hilfe ermöglicht Pflege, Aufklärung und Vernetzung – für Waschbären, die eine Stimme brauchen."
        backgroundPhoto={pagePhotos.intro}
      >
        <Button href="#gofundme" variant="secondary">
          GoFundMe spenden
        </Button>
        <Button
          href={isPayPalConfigured() ? paypalDonation.donateUrl : "#paypal"}
          variant="inverse"
          external={isPayPalConfigured()}
        >
          PayPal-Pool
        </Button>
      </PhotoPageHero>

      <StatsBand
        items={[
          {
            type: "static",
            value: `${gofundmeCampaign.raised} €`,
            label: "GoFundMe gesammelt",
          },
          { type: "static", value: `${gofundmeCampaign.goal} €`, label: "GoFundMe Ziel" },
          { type: "static", value: "PayPal", label: "Einmalspenden" },
          { type: "static", value: "ab 10 €", label: "Patenschaft" },
        ]}
      />

      <Section>
        <FadeIn>
          <LegalDisclaimer variant="prominent" className="max-w-3xl mx-auto mb-12" />
        </FadeIn>
        <Stagger className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {unterstuetzungsArten.map((art, index) => (
            <StaggerItem key={art.title}>
              <Card className="relative overflow-hidden h-full">
                <span
                  className="absolute top-4 right-5 text-5xl font-light text-forest/10 tabular-nums select-none"
                  aria-hidden
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="text-xl font-medium pr-10">{art.title}</h3>
                <p className="mt-4 text-muted leading-relaxed">{art.description}</p>
                <div className="mt-6">
                  <Button
                    href={art.href}
                    variant="outline"
                    external={"external" in art && art.external}
                  >
                    {art.cta}
                  </Button>
                </div>
              </Card>
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      <Section id="gofundme" soft>
        <FadeIn>
          <SectionHeader
            title="GoFundMe-Kampagne"
            subtitle="Hilfe für gerettete Waschbären – spende direkt und verfolge unsere Updates."
            centered
          />
        </FadeIn>
        <GoFundMeCampaign />
      </Section>

      <Section id="paypal">
        <FadeIn>
          <SectionHeader
            title="PayPal-Spende"
            subtitle="Einmalspenden sicher über PayPal – ohne Zahlungsdaten auf dieser Website."
            centered
          />
        </FadeIn>
        <PayPalDonate />
      </Section>

      <Section id="amazon-wishlist" soft>
        <FadeIn>
          <SectionHeader
            title="Sachspenden über Amazon"
            subtitle="Unsere Bärchen-Wishlist – du wählst, bezahlst, und Amazon liefert direkt zu uns."
            centered
          />
        </FadeIn>
        <AmazonWishlist />
      </Section>

      <Section id="unterstuetzen-optionen">
        <FadeIn>
          <SectionHeader
            title="Alle Unterstützungswege"
            subtitle="GoFundMe, PayPal und Amazon – wähle den Weg, der für dich passt."
            centered
          />
        </FadeIn>
        <Stagger className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plattformen.map((plattform) => (
            <StaggerItem key={plattform.name}>
              <Card
                className={`text-center bg-background/80 backdrop-blur-sm h-full ${
                  plattform.highlight ? "border-sage/30" : ""
                }`}
              >
                <h3 className="font-medium">{plattform.name}</h3>
                <p className="mt-2 text-sm text-muted">{plattform.description}</p>
                {plattform.href ? (
                  <div className="mt-4">
                    <Button
                      href={plattform.href}
                      variant="outline"
                      external={plattform.external}
                      className="w-full sm:w-auto"
                    >
                      {plattform.ctaLabel ?? "Öffnen"}
                    </Button>
                  </div>
                ) : (
                  <span className="mt-4 inline-block text-xs px-3 py-1 rounded-full bg-muted-light text-muted">
                    {plattform.status}
                  </span>
                )}
              </Card>
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      <Section id="tassen" soft>
        <FadeIn>
          <SectionHeader
            title="Besonderes Dankeschön"
            subtitle="Ab einer Unterstützung von 15 € erhältst du auf Wunsch eine Tasse mit Projektmotiv gegen Übernahme der Versandkosten – als kleines Zeichen unserer Wertschätzung."
            centered
          />
        </FadeIn>
        <div className="mt-10 max-w-5xl mx-auto">
          <TassenShowcase />
        </div>
        <FadeIn className="mt-8 max-w-2xl mx-auto">
          <LegalDisclaimer />
        </FadeIn>
      </Section>

      <PageCta
        title="Fragen zur Unterstützung?"
        description="Wenn du Fragen hast oder wissen möchtest, wofür deine Hilfe verwendet wird – melde dich gerne bei uns."
        backgroundPhoto={pagePhotos.patenschaften}
      >
        <Button href="/kontakt" variant="secondary">
          Kontakt aufnehmen
        </Button>
        {isPayPalConfigured() && (
          <Button href={paypalDonation.donateUrl} variant="inverse" external>
            PayPal-Pool
          </Button>
        )}
        <Button href={gofundmeCampaign.url} variant="inverse" external>
          GoFundMe spenden
        </Button>
        <Button href={amazonWishlist.url} variant="inverse" external>
          Amazon-Wunschliste
        </Button>
      </PageCta>
    </>
  );
}
