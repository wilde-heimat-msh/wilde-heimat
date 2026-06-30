import Image from "next/image";
import { FadeIn, Stagger, StaggerItem } from "@/components/motion/FadeIn";
import { einzelTassen, tassenPhotos } from "@/data/tassen";

type TassenShowcaseProps = {
  /** Kompakte Variante für die Startseite */
  compact?: boolean;
};

export function TassenShowcase({ compact = false }: TassenShowcaseProps) {
  const tassen = compact ? einzelTassen.slice(0, 4) : einzelTassen;

  return (
    <div className="space-y-8">
      <FadeIn>
        <div
          className={`relative w-full overflow-hidden rounded-2xl bg-neutral-900 ${
            compact
              ? "aspect-[2/1] md:aspect-[21/9] shadow-dark"
              : "aspect-[4/3] sm:aspect-[16/9] md:aspect-[21/9] shadow-soft"
          }`}
        >
          <Image
            src={tassenPhotos.panorama}
            alt="Waschbär-Tassen – Panorama mit mehreren Motiven"
            fill
            className="object-cover object-center"
            sizes="(max-width: 768px) 100vw, 1200px"
            priority={!compact}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/55 via-foreground/10 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 md:bottom-6 md:left-8 md:right-8">
            <p className="text-xs md:text-sm uppercase tracking-widest text-background/80">
              Dankeschön ab 15 € Unterstützung
            </p>
            <p className="mt-1 text-lg md:text-2xl font-light text-background">
              Waschbär-Tassen mit Herz
            </p>
          </div>
        </div>
      </FadeIn>

      {!compact && (
        <FadeIn>
          <p className="text-center text-muted leading-relaxed max-w-2xl mx-auto">
            Jede Tasse ist ein kleines Unikat – mit Waschbär-Motiv oder personalisiert
            mit einem Namen. Auf Wunsch gegen Übernahme der Versandkosten.
          </p>
        </FadeIn>
      )}

      <Stagger
        className={`grid gap-3 sm:gap-4 ${
          compact
            ? "grid-cols-2 sm:grid-cols-4"
            : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7"
        }`}
        stagger={0.06}
      >
        {tassen.map((tasse) => (
          <StaggerItem key={tasse.id}>
            <TasseCard tasse={tasse} compact={compact} />
          </StaggerItem>
        ))}
      </Stagger>
    </div>
  );
}

function TasseCard({
  tasse,
  compact,
}: {
  tasse: (typeof einzelTassen)[number];
  compact?: boolean;
}) {
  if (compact) {
    return (
      <div className="group card-elevated-dark rounded-xl overflow-hidden ring-1 ring-white/5 hover:ring-white/10">
        <div className="relative aspect-[3/4]">
          <Image
            src={tasse.src}
            alt={tasse.label}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            sizes="150px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-white/5 opacity-80 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        </div>
      </div>
    );
  }

  return (
    <div className="group rounded-xl border border-border bg-background shadow-soft overflow-hidden hover:shadow-soft-hover hover:border-foreground/20 hover:-translate-y-0.5 transition-all duration-300">
      <div className="relative overflow-hidden bg-neutral-100 aspect-[3/4]">
        <Image
          src={tasse.src}
          alt={tasse.label}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="200px"
        />
      </div>
      <div className="p-3 bg-background border-t border-border">
        <p className="font-medium truncate text-sm">{tasse.label}</p>
      </div>
    </div>
  );
}
