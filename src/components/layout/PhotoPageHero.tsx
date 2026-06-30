import { type ReactNode } from "react";
import { Section } from "@/components/ui/Section";
import { FadeIn } from "@/components/motion/FadeIn";
import type { StockPhotoCredit } from "@/data/photoCredits";

type BackgroundPhoto = {
  src: string;
  alt: string;
  objectPosition?: string;
  overlay?: "light" | "medium";
};

type PhotoPageHeroProps = {
  eyebrow: string;
  title: string;
  subtitle?: string;
  backgroundPhoto: BackgroundPhoto;
  photoCredit?: StockPhotoCredit;
  children?: ReactNode;
  className?: string;
};

export function PhotoPageHero({
  eyebrow,
  title,
  subtitle,
  backgroundPhoto,
  photoCredit,
  children,
  className = "",
}: PhotoPageHeroProps) {
  return (
    <Section
      dark
      className={`py-16 sm:py-20 md:py-28 ${className}`}
      backgroundPhoto={backgroundPhoto}
      photoCredit={photoCredit}
    >
      <FadeIn className="max-w-3xl">
        <p className="text-sm uppercase tracking-[0.2em] text-sand-light/80 mb-4">
          {eyebrow}
        </p>
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light tracking-tight leading-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl text-sand-light/90 leading-relaxed">
            {subtitle}
          </p>
        )}
        {children && (
          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row flex-wrap gap-3 [&_a]:w-full sm:[&_a]:w-auto [&_a]:justify-center">
            {children}
          </div>
        )}
      </FadeIn>
    </Section>
  );
}
