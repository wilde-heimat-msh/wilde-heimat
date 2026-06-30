import Image from "next/image";
import { FadeIn, Stagger, StaggerItem } from "@/components/motion/FadeIn";
import { SectionHeader } from "@/components/ui/Section";
import { PatenschaftUrkundePreview } from "@/components/PatenschaftUrkundePreview";
import { patenschaftBelohnungTassen } from "@/data/patenschaften";

export function PatenschaftBelohnungen() {
  return (
    <div className="max-w-5xl mx-auto">
      <FadeIn>
        <SectionHeader
          title="Das bekommst du als Pate"
          subtitle="Greifbare Dankeschöns – persönlich gestaltet und mit Liebe verschickt."
          centered
        />
      </FadeIn>

      <Stagger className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center" stagger={0.1}>
        <StaggerItem>
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-wider text-muted text-center lg:text-left">
              Persönliche Urkunde · alle Stufen
            </p>
            <PatenschaftUrkundePreview />
            <p className="text-sm text-muted text-center lg:text-left leading-relaxed">
              Jede Patenschaft beginnt mit einer persönlichen Urkunde im{" "}
              <strong className="text-foreground font-medium">DIN-A4-Format</strong> (210 × 297 mm)
              – mit deinem Namen, einem Foto deines Patentiers und der gewählten Stufe. Bei
              Geschenk-Patenschaften richten wir sie auf den Beschenkten aus.
            </p>
          </div>
        </StaggerItem>

        <StaggerItem>
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-wider text-muted text-center lg:text-left">
              Waschbär-Tasse · ab Silber
            </p>
            <div className="grid grid-cols-2 gap-4">
              {patenschaftBelohnungTassen.map((tasse) => (
                <div
                  key={tasse.id}
                  className="relative aspect-square rounded-2xl overflow-hidden border border-border bg-neutral-100 shadow-soft"
                >
                  <Image
                    src={tasse.src}
                    alt={tasse.label}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 45vw, 240px"
                  />
                </div>
              ))}
            </div>
            <p className="text-sm text-muted text-center lg:text-left leading-relaxed">
              Ab der Silber-Stufe erhältst du eine Tasse mit Waschbärmotiv – auf Wunsch auch
              personalisiert. Gold-Paten bekommen zusätzlich wöchentliche Updates von Juja.
            </p>
          </div>
        </StaggerItem>
      </Stagger>
    </div>
  );
}
