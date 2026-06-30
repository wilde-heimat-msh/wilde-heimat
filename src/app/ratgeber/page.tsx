import Link from "next/link";
import { PhotoPageHero } from "@/components/layout/PhotoPageHero";
import { StatsBand } from "@/components/layout/StatsBand";
import { PageCta } from "@/components/layout/PageCta";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { FadeIn, Stagger, StaggerItem } from "@/components/motion/FadeIn";
import { pagePhotos } from "@/data/pagePhotos";
import { ratgeberArtikel } from "@/data/ratgeber";
import { regionStat, scopeStat } from "@/data/site";
import { createMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, itemListSchema, jsonLdGraph, webPageSchema } from "@/lib/jsonLd";

export const metadata = createMetadata({
  title: "Waschbär-Ratgeber – Aufklärung & Erste Hilfe",
  description:
    "Ratgeber zu Waschbärfunden, Erste Hilfe, Garten, Rechtliches und Irrtümern – verständlich erklärt von Wilde Heimat. Schwerpunkt Mansfeld-Südharz, gültig deutschlandweit.",
  path: "/ratgeber",
  keywords: [
    "Waschbär Ratgeber",
    "Waschbärbaby gefunden was tun",
    "Waschbär Erste Hilfe",
    "Waschbär Aufklärung",
  ],
});

export default function RatgeberPage() {
  const structuredData = jsonLdGraph([
    webPageSchema({
      title: "Waschbär-Ratgeber",
      description:
        "Ratgeber von Wilde Heimat zu Waschbärfunden, Erste Hilfe und Aufklärung.",
      path: "/ratgeber",
    }),
    breadcrumbSchema([
      { name: "Start", path: "/" },
      { name: "Ratgeber", path: "/ratgeber" },
    ]),
    itemListSchema(
      ratgeberArtikel.map((a) => ({
        name: a.title,
        path: `/ratgeber/${a.slug}`,
      }))
    ),
  ]);

  return (
    <>
      <JsonLd data={structuredData} />
      <PhotoPageHero
        eyebrow="Ratgeber"
        title="Aufklärung statt Vorurteile."
        subtitle="Verständliche Informationen für alle in Deutschland – von Fundtieren bis zu rechtlichen Hinweisen. Verwurzelt in Mansfeld-Südharz, gültig deutschlandweit."
        backgroundPhoto={pagePhotos.hero}
        photoCredit={pagePhotos.hero.credit}
      >
        <Button href="/hilfe#fund-melden" variant="secondary">
          Fund melden
        </Button>
        <Button href="#artikel" variant="inverse">
          Artikel lesen
        </Button>
      </PhotoPageHero>

      <StatsBand
        items={[
          { type: "counter", value: ratgeberArtikel.length, label: "Artikel" },
          regionStat,
          scopeStat,
        ]}
      />

      <Section id="artikel">
        <FadeIn>
          <SectionHeader
            title="Alle Artikel"
            subtitle="Von Fundtieren über Erste Hilfe bis zu rechtlichen Hinweisen."
          />
        </FadeIn>
        <Stagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ratgeberArtikel.map((artikel) => (
            <StaggerItem key={artikel.slug}>
              <Link
                href={`/ratgeber/${artikel.slug}`}
                className="group block rounded-2xl border border-border bg-background p-6 h-full shadow-soft hover:shadow-soft-hover hover:border-sage/30 hover:-translate-y-1 transition-all duration-300"
              >
                <h3 className="text-lg font-medium group-hover:underline underline-offset-4">
                  {artikel.title}
                </h3>
                <p className="mt-3 text-sm text-muted leading-relaxed line-clamp-3">
                  {artikel.excerpt}
                </p>
                <span className="mt-4 inline-block text-sm text-foreground">
                  Weiterlesen →
                </span>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      <PageCta
        title="Waschbär gefunden?"
        description="Im Notfall kontaktiere uns umgehend. Wir helfen dir einzuschätzen, ob und welche Hilfe nötig ist – einfühlsam und ohne Vorurteile."
        backgroundPhoto={pagePhotos.intro}
      >
        <Button href="/hilfe#fund-melden" variant="secondary">
          Fund melden
        </Button>
        <Button href="/kontakt" variant="inverse">
          Kontakt aufnehmen
        </Button>
      </PageCta>
    </>
  );
}
