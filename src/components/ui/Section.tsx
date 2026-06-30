import Image from "next/image";
import { type ReactNode } from "react";
import { PhotoCredit } from "@/components/PhotoCredit";
import { AnimatedBackground } from "@/components/motion/AnimatedBackground";
import type { StockPhotoCredit } from "@/data/photoCredits";

type SectionBackgroundPhoto = {
  src: string;
  alt: string;
  objectPosition?: string;
  /** Wie stark das Foto durchscheint – Standard: medium */
  overlay?: "light" | "medium";
};

type SectionProps = {
  children: ReactNode;
  className?: string;
  id?: string;
  dark?: boolean;
  soft?: boolean;
  backgroundPhoto?: SectionBackgroundPhoto;
  photoCredit?: StockPhotoCredit;
};

export function Section({
  children,
  className = "",
  id,
  dark = false,
  soft = false,
  backgroundPhoto,
  photoCredit,
}: SectionProps) {
  const isLight = !dark && !soft;
  const hasPhoto = Boolean(backgroundPhoto);

  return (
    <section
      id={id}
      className={`relative py-12 md:py-24 overflow-hidden ${
        dark && !hasPhoto ? "bg-forest text-background" : ""
      } ${dark && hasPhoto ? "text-background" : ""} ${soft ? "bg-sand-light/55" : ""} ${
        isLight ? "bg-cream/40" : ""
      } ${className}`}
    >
      {hasPhoto && backgroundPhoto && (
        <div className="absolute inset-0">
          <Image
            src={backgroundPhoto.src}
            alt={backgroundPhoto.alt}
            fill
            className="object-cover md:scale-105"
            style={{ objectPosition: backgroundPhoto.objectPosition ?? "center center" }}
            sizes="100vw"
          />
          {backgroundPhoto.overlay === "light" ? (
            <>
              <div className="absolute inset-0 bg-gradient-to-b from-forest/68 via-forest/38 to-forest/62" />
              <div className="absolute inset-0 bg-gradient-to-t from-forest/58 via-transparent to-forest/45" />
            </>
          ) : (
            <>
              <div className="absolute inset-0 bg-forest/55" />
              <div className="absolute inset-0 bg-gradient-to-b from-forest/75 via-forest/45 to-forest/65" />
            </>
          )}
        </div>
      )}
      {dark && (hasPhoto ? <AnimatedBackground variant="hero-photo" /> : <AnimatedBackground variant="page" />)}
      {soft && <AnimatedBackground variant="soft" />}
      {photoCredit && (
        <div className="absolute bottom-3 right-4 sm:right-6 lg:right-8 z-10">
          <PhotoCredit credit={photoCredit} variant="hero" />
        </div>
      )}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </section>
  );
}

type SectionHeaderProps = {
  title: string;
  subtitle?: string;
  centered?: boolean;
  light?: boolean;
};

export function SectionHeader({
  title,
  subtitle,
  centered = false,
  light = false,
}: SectionHeaderProps) {
  return (
    <div
      className={`mb-8 md:mb-16 ${centered ? "text-center max-w-3xl mx-auto" : "max-w-2xl"}`}
    >
      <h2
        className={`text-2xl sm:text-3xl md:text-4xl font-light tracking-tight ${light ? "text-background" : "text-foreground"}`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`mt-3 md:mt-4 text-base md:text-lg leading-relaxed ${light ? "text-sand-light/90" : "text-muted"}`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
