import Link from "next/link";
import { Suspense } from "react";
import { PhotoPageHero } from "@/components/layout/PhotoPageHero";
import { PageCta } from "@/components/layout/PageCta";
import { PatenschaftQuote } from "@/components/PatenschaftQuote";
import { PatenLoginForm, PatenLoginFormFallback } from "@/components/paten/PatenLoginForm";
import { FadeIn, Stagger, StaggerItem } from "@/components/motion/FadeIn";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { pagePhotos } from "@/data/pagePhotos";
import { patenschaftUrkundeStufeStyles } from "@/data/patenschaften";
import { patenschaftsStufen } from "@/data/site";

const patenBenefits = [
  {
    title: "Exklusive Fotos",
    description: "Sieh deinen Waschbären wachsen – mit Bildern, die nur Paten erhalten.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth="1.5">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z"
        />
      </svg>
    ),
  },
  {
    title: "Persönliche Updates",
    description: "Neuigkeiten direkt von Juja – je nach Stufe regelmäßig oder wöchentlich.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth="1.5">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
        />
      </svg>
    ),
  },
  {
    title: "Deine Urkunde",
    description: "Jede Patenschaft beginnt mit einer persönlichen Urkunde – sichtbar und greifbar.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth="1.5">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
        />
      </svg>
    ),
  },
] as const;

export function PatenUpdatesLanding() {
  return (
    <>
      <PhotoPageHero
        eyebrow="Paten-Updates"
        title="Bleib nah an deinem Patentier."
        subtitle="Exklusive Fotos, Neuigkeiten und Einblicke aus der Pflege – nur für unsere Paten. Noch kein Pate? Entdecke unten, wie du dabei sein kannst."
        backgroundPhoto={pagePhotos.intro}
      >
        <Button href="#zugang" variant="inverse">
          Bereits Pate? Einloggen
        </Button>
        <Button href="/patenschaften" variant="secondary">
          Patenschaft entdecken
        </Button>
      </PhotoPageHero>

      <Section soft id="zugang" className="scroll-mt-20">
        <div className="grid items-start gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
          <div className="space-y-10">
            <FadeIn>
              <SectionHeader
                title="Dein persönlicher Paten-Bereich"
                subtitle="Mit deinem Zugangscode öffnest du einen geschützten Bereich – nur für dich und deinen Waschbären. Kein Social-Media-Feed, sondern echte Nähe."
              />
            </FadeIn>

            <Stagger className="grid gap-4 sm:grid-cols-3">
              {patenBenefits.map((benefit) => (
                <StaggerItem key={benefit.title}>
                  <div className="h-full rounded-2xl border border-border/80 bg-background/80 p-5 shadow-soft">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sage/15 text-forest">
                      {benefit.icon}
                    </div>
                    <h3 className="mt-4 text-base font-medium text-forest">{benefit.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{benefit.description}</p>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>

            <FadeIn>
              <div>
                <h3 className="text-lg font-medium text-forest">Was deine Stufe bietet</h3>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
                  Bronze, Silber oder Gold – jede Stufe bringt dich näher an deinen Waschbären.
                  Alle Paten erhalten eine Urkunde; ab Silber kommen Fotos und Extras dazu.
                </p>

                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  {patenschaftsStufen.map((stufe) => {
                    const styles = patenschaftUrkundeStufeStyles[stufe.id];
                    return (
                      <div
                        key={stufe.id}
                        className={`relative rounded-2xl border p-4 shadow-sm ${styles.panel}`}
                      >
                        {"badge" in stufe && stufe.badge ? (
                          <span className="absolute -top-2.5 right-3 rounded-full bg-forest px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-background">
                            {stufe.badge}
                          </span>
                        ) : null}
                        <p className="text-xs uppercase tracking-wide text-muted">{stufe.tagline}</p>
                        <p className={`mt-1 text-lg font-medium ${styles.nameColor}`}>{stufe.name}</p>
                        <p className="mt-1 text-sm text-muted">ab {stufe.preis} € / Monat</p>
                        <ul className="mt-3 space-y-1.5">
                          {stufe.leistungen.slice(0, 2).map((leistung) => (
                            <li key={leistung} className="flex gap-2 text-xs text-muted leading-snug">
                              <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${styles.perkDot}`} />
                              {leistung}
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>

                <p className="mt-6 text-sm text-muted">
                  Noch keine Patenschaft?{" "}
                  <Link
                    href="/patenschaften"
                    className="font-medium text-forest underline decoration-forest/30 underline-offset-4 hover:decoration-forest"
                  >
                    Alle Stufen und Waschbären ansehen
                  </Link>
                </p>
              </div>
            </FadeIn>
          </div>

          <FadeIn delay={0.1} className="lg:sticky lg:top-24">
            <Suspense fallback={<PatenLoginFormFallback />}>
              <PatenLoginForm />
            </Suspense>
          </FadeIn>
        </div>
      </Section>

      <Section className="py-12 md:py-20">
        <PatenschaftQuote />
      </Section>

      <PageCta
        title="Werde Teil der Wilde-Heimat-Familie"
        description="Wähle deinen Waschbären, entscheide dich für eine Stufe – und begleite ihn mit Herz. Dein Beitrag hilft direkt in der Pflege."
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
