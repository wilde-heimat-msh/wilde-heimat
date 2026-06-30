import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Section, SectionHeader } from "@/components/ui/Section";
import { WaschbaerCard } from "@/components/WaschbaerCard";
import { SocialFeed } from "@/components/SocialFeed";
import { TassenShowcase } from "@/components/TassenShowcase";
import { HeroSection } from "@/components/motion/HeroSection";
import { AnimatedBackground } from "@/components/motion/AnimatedBackground";
import { FadeIn, Stagger, StaggerItem } from "@/components/motion/FadeIn";
import { Marquee, MarqueeItem } from "@/components/motion/Marquee";
import { ratgeberArtikel } from "@/data/ratgeber";
import { waschbaeren } from "@/data/waschbaeren";
import { projekte, regionStat, siteConfig } from "@/data/site";
import { sitePhotos } from "@/data/photos";
import { PatenschaftTierCards } from "@/components/PatenschaftTierCards";
import { StatsBand } from "@/components/layout/StatsBand";
import { pagePhotos } from "@/data/pagePhotos";
import { patenschaftenPhotoCredit } from "@/data/photoCredits";

const marqueeItems = [
  "Tierwohl",
  "Aufklärung statt Vorurteile",
  "Waschbärhilfe Mansfeld-Südharz",
  "Gemeinschaft",
  "Transparenz",
  "Regionalität",
  "Verantwortung",
];

export default function HomePage() {
  const featuredWaschbaeren = waschbaeren.slice(0, 4);
  const neuesteArtikel = ratgeberArtikel.slice(0, 3);

  return (
    <>
      <HeroSection />

      {/* Marquee */}
      <div className="relative border-y border-sand/60 py-5 bg-sand-light/50 overflow-hidden">
        <AnimatedBackground variant="soft" />
        <div className="relative">
          <Marquee speed="slow">
            {marqueeItems.map((item) => (
              <MarqueeItem key={item}>{item}</MarqueeItem>
            ))}
          </Marquee>
        </div>
      </div>

      {/* Stats */}
      <StatsBand
        items={[
          { type: "counter", value: 12, label: "Waschbären" },
          { type: "counter", value: 9, label: "Ratgeber-Artikel" },
          { type: "counter", value: 3, label: "Patenschaftsstufen" },
          regionStat,
        ]}
      />

      {/* Vorstellung */}
      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <FadeIn>
            <SectionHeader
              title="Waschbären eine Stimme geben"
              subtitle={siteConfig.subtitle}
            />
            <p className="text-muted leading-relaxed mb-4">
              Wilde Heimat ist ein privates Pflege- und Aufklärungsprojekt –
              verwurzelt in {siteConfig.operatingArea}. Durch Aufklärung,
              Vermittlung und Unterstützung tragen wir dazu bei, dass Waschbären besser
              verstanden werden und Hilfe erhalten, wenn sie diese benötigen.
            </p>
            <p className="text-muted leading-relaxed mb-8">
              {siteConfig.helpScope} Unser Ziel: Menschen, Pflegestellen,
              Unterstützer und Interessierte vernetzen – für Waschbären, die eine Stimme
              brauchen.
            </p>
            <Button href="/ueber-uns" variant="outline">
              Mehr erfahren
            </Button>
          </FadeIn>
          <FadeIn delay={0.2} direction="left">
            <div className="aspect-[4/3] rounded-2xl relative overflow-hidden shadow-soft animate-reveal">
              <Image
                src={sitePhotos.intro}
                alt="Waschbär in der Pflege"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest/30 to-transparent" />
            </div>
          </FadeIn>
        </div>
      </Section>

      {/* Projekte */}
      <Section soft>
        <FadeIn>
          <SectionHeader
            title="Aktuelle Schwerpunkte"
            subtitle="Wir arbeiten daran, Waschbären in Not schneller und fachgerechter helfen zu können."
            centered
          />
        </FadeIn>
        <Stagger className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {projekte.map((projekt) => (
            <StaggerItem key={projekt.title}>
              <Card>
                <h3 className="text-xl font-medium">{projekt.title}</h3>
                <p className="mt-4 text-muted leading-relaxed">{projekt.description}</p>
              </Card>
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      {/* Waschbären */}
      <Section>
        <FadeIn>
          <SectionHeader
            title="Unsere Waschbären"
            subtitle="Jeder Waschbär hat eine eigene Geschichte. Lerne sie kennen."
            centered
          />
        </FadeIn>
        <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" stagger={0.08}>
          {featuredWaschbaeren.map((w) => (
            <StaggerItem key={w.slug}>
              <WaschbaerCard waschbaer={w} compact />
            </StaggerItem>
          ))}
        </Stagger>
        <FadeIn className="mt-10 text-center">
          <Button href="/waschbaeren" variant="outline">
            Alle Waschbären ansehen
          </Button>
        </FadeIn>
      </Section>

      {/* Patenschaften */}
      <Section
        dark
        backgroundPhoto={{
          src: pagePhotos.patenschaften.src,
          alt: pagePhotos.patenschaften.alt,
          objectPosition: "center 40%",
          overlay: pagePhotos.patenschaften.overlay,
        }}
        photoCredit={patenschaftenPhotoCredit}
      >
        <FadeIn>
          <SectionHeader
            title="Patenschaften"
            subtitle="Übernimm eine Patenschaft und begleite einen der Waschbären."
            centered
            light
          />
        </FadeIn>
        <PatenschaftTierCards variant="dark" />
        <FadeIn className="mt-10 text-center">
          <Button href="/patenschaften" variant="secondary">
            Patenschaft übernehmen
          </Button>
        </FadeIn>
      </Section>

      {/* Ratgeber */}
      <Section>
        <FadeIn>
          <SectionHeader
            title="Neueste Beiträge"
            subtitle="Aufklärung statt Vorurteile – unser Waschbär-Ratgeber."
            centered
          />
        </FadeIn>
        <Stagger className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {neuesteArtikel.map((artikel) => (
            <StaggerItem key={artikel.slug}>
              <Link
                href={`/ratgeber/${artikel.slug}`}
                className="group block rounded-2xl border border-border bg-background p-6 h-full shadow-soft hover:shadow-soft-hover hover:border-foreground/20 transition-all duration-300 hover:-translate-y-1"
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
        <FadeIn className="mt-10 text-center">
          <Button href="/ratgeber" variant="outline">
            Zum Ratgeber
          </Button>
        </FadeIn>
      </Section>

      <SocialFeed />

      {/* Unterstützungsaufruf */}
      <Section dark>
        <div className="max-w-5xl mx-auto space-y-10">
          <FadeIn className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-light tracking-tight">
              Jede Unterstützung zählt
            </h2>
            <p className="mt-4 text-muted-light leading-relaxed">
              Mit deiner freiwilligen Unterstützung hilfst du uns, Aufklärung zu
              betreiben, Kontakte zu vermitteln und Waschbären in Not zu helfen.
              Ab 15 € Unterstützung erhältst du auf Wunsch eine Tasse mit
              Projektmotiv.
            </p>
            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row flex-wrap justify-center gap-4 [&_a]:w-full sm:[&_a]:w-auto [&_a]:justify-center">
              <Button href="/unterstuetzen#tassen" variant="secondary">
                Jetzt unterstützen
              </Button>
              <Button href="/patenschaften" variant="inverse">
                Patenschaft übernehmen
              </Button>
            </div>
          </FadeIn>
          <TassenShowcase compact />
        </div>
      </Section>
    </>
  );
}
