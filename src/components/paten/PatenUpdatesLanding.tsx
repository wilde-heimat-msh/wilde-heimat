import Link from "next/link";
import { Suspense } from "react";
import { PhotoPageHero } from "@/components/layout/PhotoPageHero";
import { PageCta } from "@/components/layout/PageCta";
import { PatenschaftQuote } from "@/components/PatenschaftQuote";
import { PatenschaftTierCards } from "@/components/PatenschaftTierCards";
import { PatenLoginForm, PatenLoginFormFallback } from "@/components/paten/PatenLoginForm";
import { FadeIn } from "@/components/motion/FadeIn";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { pagePhotos } from "@/data/pagePhotos";
import { patenschaftsStufen } from "@/data/site";

export function PatenUpdatesLanding() {
  return (
    <>
      <PhotoPageHero
        eyebrow="Paten-Updates"
        title="Bleib nah an deinem Patentier."
        subtitle="Bronze bringt die Urkunde per Post. Ab Silber siehst du hier Fotos deines Waschbären – Gold-Paten erhalten zusätzlich wöchentliche Updates von Juja."
        backgroundPhoto={pagePhotos.intro}
      >
        <Button href="#zugang" variant="inverse">
          Bereits Pate? Einloggen
        </Button>
        <Button href="#stufen" variant="secondary">
          Stufen vergleichen
        </Button>
      </PhotoPageHero>

      <Section soft id="zugang" className="scroll-mt-20">
        <div className="grid items-start gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
          <FadeIn>
            <SectionHeader
              title="Dein persönlicher Paten-Bereich"
              subtitle="Mit deinem Zugangscode öffnest du einen geschützten Bereich – ab Silber mit Fotos, ab Gold mit wöchentlichen Updates von Juja. Bronze-Paten erhalten die Urkunde klassisch per Post."
            />
            <ul className="mt-6 space-y-3 text-sm leading-relaxed text-muted">
              {patenschaftsStufen.map((stufe) => (
                <li key={stufe.id} className="flex gap-3 rounded-xl border border-border/70 bg-background/70 px-4 py-3">
                  <span className="shrink-0 font-medium text-forest">{stufe.name}</span>
                  <span>{stufe.beschreibung}</span>
                </li>
              ))}
            </ul>
          </FadeIn>

          <FadeIn delay={0.1} className="lg:sticky lg:top-24">
            <Suspense fallback={<PatenLoginFormFallback />}>
              <PatenLoginForm />
            </Suspense>
          </FadeIn>
        </div>
      </Section>

      <Section id="stufen" className="scroll-mt-20">
        <FadeIn>
          <SectionHeader
            title="Was deine Stufe bietet"
            subtitle="Genauso wie auf unserer Patenschaften-Seite – transparent und nachvollziehbar."
            centered
          />
        </FadeIn>
        <PatenschaftTierCards showCta className="mt-8" />
        <FadeIn className="mt-8 text-center">
          <p className="text-sm text-muted">
            Noch keine Patenschaft?{" "}
            <Link
              href="/patenschaften"
              className="font-medium text-forest underline decoration-forest/40 underline-offset-4 hover:decoration-forest"
            >
              Alle Waschbären und Stufen ansehen
            </Link>
          </p>
        </FadeIn>
      </Section>

      <Section soft className="py-12 md:py-20">
        <PatenschaftQuote />
      </Section>

      <PageCta
        title="Werde Teil der Wilde-Heimat-Familie"
        description="Wähle deinen Waschbären und die Stufe, die zu dir passt – von der Urkunde bis zu wöchentlichen Updates."
        backgroundPhoto={pagePhotos.patenschaften}
      >
        <Button href="/patenschaften" variant="inverse">
          Patenschaften entdecken
        </Button>
        <Button href="/patenschaften#patenschaft-anfragen" variant="outline">
          Patenschaft anfragen
        </Button>
      </PageCta>
    </>
  );
}
