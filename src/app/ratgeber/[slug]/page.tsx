import { notFound } from "next/navigation";
import Link from "next/link";
import { sitePhotos } from "@/data/photos";
import { getArtikelBySlug, ratgeberArtikel } from "@/data/ratgeber";
import { RatgeberArtikelContent } from "@/components/ratgeber/RatgeberArtikelContent";
import { PhotoPageHero } from "@/components/layout/PhotoPageHero";
import { BackLink } from "@/components/layout/BackLink";
import { PageCta } from "@/components/layout/PageCta";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { FadeIn, Stagger, StaggerItem } from "@/components/motion/FadeIn";
import { pagePhotos } from "@/data/pagePhotos";
import { createMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  articleSchema,
  breadcrumbSchema,
  jsonLdGraph,
  webPageSchema,
} from "@/lib/jsonLd";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return ratgeberArtikel.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const artikel = getArtikelBySlug(slug);
  if (!artikel) return {};

  return createMetadata({
    title: artikel.title,
    description: artikel.excerpt,
    path: `/ratgeber/${slug}`,
    keywords: artikel.keywords,
    type: "article",
    ogImage: sitePhotos.hero,
    ogImageAlt: `${artikel.title} – Ratgeber Wilde Heimat`,
    publishedTime: "2025-06-01",
    modifiedTime: "2025-06-01",
  });
}

export default async function RatgeberArtikelPage({ params }: Props) {
  const { slug } = await params;
  const artikel = getArtikelBySlug(slug);

  if (!artikel) {
    notFound();
  }

  const related = ratgeberArtikel.filter((a) => a.slug !== slug).slice(0, 3);

  const structuredData = jsonLdGraph([
    webPageSchema({
      title: artikel.title,
      description: artikel.excerpt,
      path: `/ratgeber/${slug}`,
    }),
    articleSchema({
      title: artikel.title,
      description: artikel.excerpt,
      path: `/ratgeber/${slug}`,
      keywords: artikel.keywords,
      datePublished: "2025-06-01",
      dateModified: "2025-06-01",
      image: sitePhotos.hero,
    }),
    breadcrumbSchema([
      { name: "Start", path: "/" },
      { name: "Ratgeber", path: "/ratgeber" },
      { name: artikel.title, path: `/ratgeber/${slug}` },
    ]),
  ]);

  return (
    <>
      <JsonLd data={structuredData} />
      <PhotoPageHero
        eyebrow="Ratgeber"
        title={artikel.title}
        subtitle={artikel.excerpt}
        backgroundPhoto={pagePhotos.heroLight}
        photoCredit={pagePhotos.heroLight.credit}
      >
        <BackLink href="/ratgeber" label="Zum Ratgeber" />
      </PhotoPageHero>

      <Section>
        <FadeIn>
          <Card hover={false} className="max-w-4xl mx-auto p-6 sm:p-8 md:p-10">
            <RatgeberArtikelContent artikel={artikel} />
          </Card>
        </FadeIn>
      </Section>

      {related.length > 0 && (
        <Section soft>
          <FadeIn>
            <h2 className="text-2xl font-light mb-8 text-center">Weitere Artikel</h2>
          </FadeIn>
          <Stagger className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {related.map((a) => (
              <StaggerItem key={a.slug}>
                <Link
                  href={`/ratgeber/${a.slug}`}
                  className="group block rounded-2xl border border-border bg-background p-6 h-full shadow-soft hover:shadow-soft-hover hover:-translate-y-1 transition-all duration-300"
                >
                  <h3 className="font-medium group-hover:underline underline-offset-4">
                    {a.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted line-clamp-2">{a.excerpt}</p>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        </Section>
      )}

      <PageCta
        title="Brauchst du Hilfe?"
        description="Wir beraten dich gerne bei Waschbärfunden und Notfällen – schnell, einfühlsam und fachlich fundiert."
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
