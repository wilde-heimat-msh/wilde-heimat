import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/Section";
import { FadeIn, Stagger, StaggerItem } from "@/components/motion/FadeIn";
import {
  patenschaftAblauf,
  patenschaftIntro,
  patenschaftWirkung,
} from "@/data/site";

export function PatenschaftGuide() {
  return (
    <div className="max-w-5xl mx-auto space-y-12">
      <FadeIn className="text-center max-w-2xl mx-auto">
        <SectionHeader
          title={patenschaftIntro.title}
          subtitle={patenschaftIntro.subtitle}
          centered
        />
        <p className="mt-4 text-muted leading-relaxed">{patenschaftIntro.teaser}</p>
      </FadeIn>

      <div className="relative">
        <div
          className="hidden lg:block absolute top-5 left-[10%] right-[10%] h-px bg-border"
          aria-hidden
        />
        <Stagger
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-3"
          stagger={0.07}
        >
          {patenschaftAblauf.map((schritt) => (
            <StaggerItem key={schritt.nr}>
              <div className="relative h-full p-5 rounded-2xl border border-border bg-background/90 text-center shadow-soft">
                <span className="relative z-10 inline-flex h-10 w-10 items-center justify-center rounded-full bg-forest text-background text-sm font-medium shadow-sm">
                  {schritt.nr}
                </span>
                <h3 className="mt-4 font-medium">{schritt.title}</h3>
                <p className="mt-2 text-sm text-muted leading-relaxed">{schritt.text}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>

      <FadeIn>
        <Card hover={false} className="bg-cream/90 border-sand/60">
          <p className="text-sm uppercase tracking-wider text-muted text-center">
            Wofür dein Beitrag wirkt
          </p>
          <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
            {patenschaftWirkung.map((punkt) => (
              <div
                key={punkt.title}
                className="rounded-xl border border-border/80 bg-background/70 p-4 text-center md:text-left"
              >
                <p className="font-medium">{punkt.title}</p>
                <p className="mt-1.5 text-sm text-muted leading-relaxed">{punkt.text}</p>
              </div>
            ))}
          </div>
        </Card>
      </FadeIn>

      <FadeIn className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 [&_a]:w-full sm:[&_a]:w-auto [&_a]:justify-center">
        <Button href="#patenschaft-anfragen" variant="primary">
          Patenschaft anfragen
        </Button>
        <Button href="#waschbaeren-waehlen" variant="outline">
          Waschbär wählen
        </Button>
      </FadeIn>
    </div>
  );
}
