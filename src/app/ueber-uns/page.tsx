import { AboutBrandIntro } from "@/components/AboutBrandIntro";
import Image from "next/image";
import { PhotoPageHero } from "@/components/layout/PhotoPageHero";
import { StatsBand } from "@/components/layout/StatsBand";
import { PageCta } from "@/components/layout/PageCta";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { InfoBox } from "@/components/ui/InfoBox";
import { SocialLinks } from "@/components/SocialLinks";
import { DesignPhotoStrip } from "@/components/PhotoStrip";
import { FadeIn, Stagger, StaggerItem } from "@/components/motion/FadeIn";
import { jujaZitat, meilensteine, werte } from "@/data/about";
import { pagePhotos } from "@/data/pagePhotos";
import { sitePhotos } from "@/data/photos";
import { organization } from "@/data/organization";
import { projekte, regionStat, siteConfig } from "@/data/site";
import { waschbaeren } from "@/data/waschbaeren";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Über Wilde Heimat & Juja",
  description:
    "Wilde Heimat ist eine private Initiative von Juja für Waschbärhilfe und Aufklärung in Mansfeld-Südharz (Sachsen-Anhalt). Geschichte, Werte und Waschbär-Pflege – ehrlich und nahbar.",
  path: "/ueber-uns",
  keywords: [
    "Wilde Heimat Juja",
    "Waschbärhilfe Mansfeld-Südharz",
    "Waschbär Aufklärung Sachsen-Anhalt",
  ],
});

export default function UeberUnsPage() {
  return (
    <>
      <PhotoPageHero
        eyebrow="Über Wilde Heimat"
        title="Ein Herzensprojekt mit Mission."
        subtitle={`Authentisch, persönlich und mit viel Liebe zu Waschbären – in ${siteConfig.region}.`}
        backgroundPhoto={pagePhotos.hero}
        photoCredit={pagePhotos.hero.credit}
      >
        <Button href="/unterstuetzen" variant="secondary">
          Unterstützen
        </Button>
        <Button href="/kontakt" variant="inverse">
          Kontakt
        </Button>
      </PhotoPageHero>

      <StatsBand
        items={[
          { type: "static", value: "2024", label: "Beginn der Mission" },
          { type: "counter", value: waschbaeren.length, label: "Waschbären" },
          { type: "counter", value: 3, label: "Schwerpunkte" },
          regionStat,
        ]}
      />

      <Section soft className="py-12 md:py-20">
        <FadeIn>
          <AboutBrandIntro />
        </FadeIn>
      </Section>

      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          <FadeIn direction="left">
            <div className="relative">
              <div className="aspect-[4/5] rounded-2xl relative overflow-hidden shadow-soft animate-reveal">
                <Image
                  src={sitePhotos.about}
                  alt="Waschbär in der Hängematte"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 45vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest/40 via-transparent to-transparent" />
              </div>
              <div className="absolute -bottom-5 -right-5 hidden md:block h-32 w-32 rounded-2xl border-4 border-background bg-sage-light/30 -z-10" />
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <SectionHeader
              title="Wie alles begann"
              subtitle="Von der ersten Pflege bis zum wachsenden Netzwerk."
            />
            <div className="relative pl-8 border-l-2 border-sage/35 space-y-10">
              {meilensteine.map((schritt) => (
                <div key={schritt.title} className="relative">
                  <span
                    className="absolute -left-[calc(2rem+5px)] top-1.5 h-3 w-3 rounded-full bg-sage ring-4 ring-cream/80"
                    aria-hidden
                  />
                  <p className="text-xs uppercase tracking-[0.15em] text-sage font-medium">
                    {schritt.year}
                  </p>
                  <h3 className="mt-1 text-xl font-light text-foreground">
                    {schritt.title}
                  </h3>
                  <p className="mt-2 text-muted leading-relaxed">{schritt.text}</p>
                </div>
              ))}
            </div>
            <InfoBox className="mt-10 text-muted">
              <strong className="text-foreground">Wichtig zu wissen:</strong>{" "}
              Wilde Heimat ist keine eingetragene Organisation und kein
              Tierschutzverein – sondern ein privates Pflege- und
              Aufklärungsprojekt von {organization.operatorAlias} ({organization.operator}).
            </InfoBox>
          </FadeIn>
        </div>
      </Section>

      <Section soft>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          <FadeIn className="lg:col-span-5">
            <Card hover={false} padding="md" className="bg-background/90 backdrop-blur-sm">
              <div className="flex items-center gap-5">
                <div className="h-20 w-20 rounded-2xl bg-forest text-background flex items-center justify-center text-3xl font-light shrink-0 shadow-soft">
                  J
                </div>
                <div>
                  <h2 className="text-2xl font-light">Juja</h2>
                  <p className="text-muted">Initiatorin von Wilde Heimat</p>
                </div>
              </div>
              <p className="mt-6 text-muted leading-relaxed">
                Mit Wilde Heimat macht Juja Waschbär-Geschichten sichtbar – durch
                Aufklärung, Vermittlung und die liebevolle Betreuung jedes einzelnen
                Waschbären, der bei uns Hilfe findet.
              </p>
              <div className="mt-6 pt-6 border-t border-border flex flex-wrap items-center justify-between gap-4">
                <SocialLinks />
                <Button href="/kontakt" variant="outline" className="text-sm">
                  Nachricht schreiben
                </Button>
              </div>
            </Card>
          </FadeIn>

          <FadeIn delay={0.15} className="lg:col-span-7">
            <blockquote className="relative">
              <span
                className="absolute -top-6 -left-2 text-7xl md:text-8xl font-light text-sage/25 leading-none select-none"
                aria-hidden
              >
                „
              </span>
              <p className="relative text-xl md:text-2xl lg:text-3xl font-light leading-relaxed text-foreground pl-6 md:pl-10">
                {jujaZitat}
              </p>
            </blockquote>
          </FadeIn>
        </div>
      </Section>

      <Section>
        <FadeIn>
          <SectionHeader
            title="Was wir tun"
            subtitle="Drei Schwerpunkte, ein Ziel: Waschbären verstehen und helfen."
            centered
          />
        </FadeIn>
        <Stagger className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8" stagger={0.1}>
          {projekte.map((projekt, index) => (
            <StaggerItem key={projekt.title}>
              <Card className="relative overflow-hidden h-full">
                <span
                  className="absolute top-4 right-5 text-6xl font-light text-forest/10 tabular-nums select-none"
                  aria-hidden
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="text-xl font-light pr-12">{projekt.title}</h3>
                <p className="mt-4 text-muted leading-relaxed">{projekt.description}</p>
              </Card>
            </StaggerItem>
          ))}
        </Stagger>
        <FadeIn className="mt-10 flex flex-wrap justify-center gap-3">
          <Button href="/hilfe" variant="outline">
            Hilfe & Vermittlung
          </Button>
          <Button href="/ratgeber" variant="outline">
            Zum Ratgeber
          </Button>
        </FadeIn>
      </Section>

      <Section soft>
        <FadeIn>
          <SectionHeader
            title="Wofür wir stehen"
            subtitle="Die Werte, die Wilde Heimat leiten."
            centered
          />
        </FadeIn>
        <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5" stagger={0.06}>
          {werte.map((wert) => (
            <StaggerItem key={wert.title}>
              <div className="group p-6 rounded-2xl border border-border bg-background/80 backdrop-blur-sm text-left h-full shadow-soft hover:shadow-soft-hover hover:border-sage/30 hover:-translate-y-0.5 transition-all duration-300">
                <span className="inline-block h-2 w-2 rounded-full bg-sage mb-4 group-hover:scale-125 transition-transform" />
                <p className="font-medium text-foreground">{wert.title}</p>
                <p className="mt-2 text-sm text-muted leading-relaxed">
                  {wert.description}
                </p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      <Section className="py-12 md:py-16">
        <FadeIn>
          <SectionHeader
            title="Einblicke"
            subtitle="Momente aus dem Alltag bei Wilde Heimat – rein dekorativ, ohne Zuordnung zu einzelnen Tieren."
            centered
          />
        </FadeIn>
        <DesignPhotoStrip count={8} />
      </Section>

      <PageCta
        title="Unsere Vision"
        description="Wir möchten ein Netzwerk für Waschbärhilfe aufbauen und Menschen, Pflegestellen, Unterstützer und Interessierte miteinander verbinden – in Mansfeld-Südharz und deutschlandweit, wo wir können."
        backgroundPhoto={pagePhotos.intro}
        showLogo
      >
        <Button href="/unterstuetzen" variant="secondary">
          Jetzt unterstützen
        </Button>
        <Button href="/waschbaeren" variant="inverse">
          Waschbären kennenlernen
        </Button>
      </PageCta>
    </>
  );
}
