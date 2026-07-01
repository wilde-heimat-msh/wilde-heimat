import { notFound } from "next/navigation";
import { getWaschbaerBySlug, waschbaeren } from "@/data/waschbaeren";
import {
  getWaschbaerGalerie,
  getWaschbaerProfilfoto,
  hasWaschbaerEchteFotos,
  waschbaerProfilPlatzhalter,
} from "@/data/photos";
import { PhotoPageHero } from "@/components/layout/PhotoPageHero";
import { BackLink } from "@/components/layout/BackLink";
import { PageCta } from "@/components/layout/PageCta";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { PatenschaftForm } from "@/components/forms/PatenschaftForm";
import { WaschbaerGallery } from "@/components/WaschbaerGallery";
import { WaschbaerFotoFolgt } from "@/components/WaschbaerFotoFolgt";
import { FadeIn, Stagger, StaggerItem } from "@/components/motion/FadeIn";
import { pagePhotos } from "@/data/pagePhotos";
import { createMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, jsonLdGraph, webPageSchema } from "@/lib/jsonLd";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return waschbaeren.map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const waschbaer = getWaschbaerBySlug(slug);
  if (!waschbaer) return {};

  const hatEchteFotos = hasWaschbaerEchteFotos(slug);

  return createMetadata({
    title: `${waschbaer.name} – Waschbär-Patenschaft`,
    description: `${waschbaer.kurztext} Patenschaft für ${waschbaer.name} bei Wilde Heimat – private Waschbärhilfe in Mansfeld-Südharz, Sachsen-Anhalt.`,
    path: `/waschbaeren/${slug}`,
    keywords: [
      "Waschbär Patenschaft",
      `${waschbaer.name} Waschbär`,
      "Waschbär Patenschaft Sachsen-Anhalt",
    ],
    ...(hatEchteFotos
      ? {
          ogImage: getWaschbaerProfilfoto(waschbaer.slug),
          ogImageAlt: `${waschbaer.name} – Patentier bei Wilde Heimat`,
        }
      : {}),
  });
}

export default async function WaschbaerDetailPage({ params }: Props) {
  const { slug } = await params;
  const waschbaer = getWaschbaerBySlug(slug);

  if (!waschbaer) {
    notFound();
  }

  const hatEchteFotos = hasWaschbaerEchteFotos(slug);
  const galerie = getWaschbaerGalerie(slug);

  const structuredData = jsonLdGraph([
    webPageSchema({
      title: `${waschbaer.name} – Waschbär bei Wilde Heimat`,
      description: waschbaer.kurztext,
      path: `/waschbaeren/${slug}`,
    }),
    breadcrumbSchema([
      { name: "Start", path: "/" },
      { name: "Waschbären", path: "/waschbaeren" },
      { name: waschbaer.name, path: `/waschbaeren/${slug}` },
    ]),
  ]);

  return (
    <>
      <JsonLd data={structuredData} />
      <PhotoPageHero
        eyebrow="Unsere Waschbären"
        title={waschbaer.name}
        subtitle={`Aufgenommen ${waschbaer.aufgenommen} – ${waschbaer.kurztext}`}
        backgroundPhoto={{
          src: hatEchteFotos ? getWaschbaerProfilfoto(slug) : waschbaerProfilPlatzhalter,
          alt: hatEchteFotos
            ? `${waschbaer.name} – bei Wilde Heimat`
            : `${waschbaer.name} – Foto folgt`,
          objectPosition: "center center",
          overlay: "medium",
        }}
      >
        <BackLink href="/waschbaeren" label="Alle Waschbären" />
        <div className="w-full mt-4 flex flex-wrap gap-2">
          {waschbaer.eigenschaften.map((e) => (
            <span
              key={e}
              className="text-sm px-3 py-1 rounded-full bg-background/20 text-background backdrop-blur-sm border border-background/20"
            >
              {e}
            </span>
          ))}
        </div>
      </PhotoPageHero>

      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          <FadeIn direction="left">
            <h2 className="text-2xl font-light mb-6">Galerie</h2>
            {galerie.length > 0 ? (
              <WaschbaerGallery fotos={galerie} />
            ) : (
              <>
                <div className="overflow-hidden rounded-2xl border border-border shadow-soft aspect-[16/10]">
                  <WaschbaerFotoFolgt name={waschbaer.name} className="h-full min-h-[220px]" />
                </div>
                <p className="mt-4 text-xs text-muted">
                  Für {waschbaer.name} liegen noch keine Profilfotos vor – Bilder
                  folgen, sobald sie fest zugeordnet sind.
                </p>
              </>
            )}
          </FadeIn>

          <FadeIn delay={0.1}>
            <Stagger className="space-y-6" stagger={0.1}>
              <StaggerItem>
                <Card hover={false}>
                  <h2 className="text-2xl font-light mb-4">Steckbrief</h2>
                  <dl className="space-y-3 text-sm">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 border-b border-border pb-3">
                      <dt className="text-muted shrink-0">Name</dt>
                      <dd className="font-medium sm:text-right">{waschbaer.name}</dd>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 border-b border-border pb-3">
                      <dt className="text-muted shrink-0">Aufgenommen</dt>
                      <dd className="font-medium sm:text-right">{waschbaer.aufgenommen}</dd>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 border-b border-border pb-3">
                      <dt className="text-muted shrink-0">Eigenschaften</dt>
                      <dd className="font-medium sm:text-right sm:max-w-[60%]">
                        {waschbaer.eigenschaften.join(", ")}
                      </dd>
                    </div>
                  </dl>
                </Card>
              </StaggerItem>

              <StaggerItem>
                <Card hover={false}>
                  <h2 className="text-2xl font-light mb-4">Geschichte</h2>
                  <p className="text-muted leading-relaxed">{waschbaer.geschichte}</p>
                </Card>
              </StaggerItem>

              <StaggerItem>
                <Card hover={false}>
                  <h2 className="text-2xl font-light mb-4">Charakter</h2>
                  <p className="text-muted leading-relaxed">{waschbaer.charakter}</p>
                </Card>
              </StaggerItem>

              <StaggerItem>
                <Button href={`/patenschaften?waschbaer=${waschbaer.slug}`}>
                  Patenschaft für {waschbaer.name}
                </Button>
              </StaggerItem>
            </Stagger>
          </FadeIn>
        </div>
      </Section>

      <Section soft>
        <FadeIn className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-light mb-2 text-center">
            Patenschaft für {waschbaer.name}
          </h2>
          <p className="text-muted text-center mb-8">
            Werde Pate und begleite {waschbaer.name} auf seinem Weg.
          </p>
          <Card hover={false} padding="md" className="bg-background/80 backdrop-blur-sm">
            <PatenschaftForm preselectedWaschbaer={waschbaer.slug} />
          </Card>
        </FadeIn>
      </Section>

      <PageCta
        title={`${waschbaer.name}s Geschichte teilen`}
        description="Mit einer Patenschaft unterstützt du nicht nur ein einzelnes Tier – du hilfst dem gesamten Herzensprojekt Wilde Heimat weiterzuwachsen."
        backgroundPhoto={pagePhotos.patenschaften}
      >
        <Button href={`/patenschaften?waschbaer=${waschbaer.slug}`} variant="secondary">
          Patenschaft übernehmen
        </Button>
        <Button href="/waschbaeren" variant="inverse">
          Alle Waschbären
        </Button>
      </PageCta>
    </>
  );
}
