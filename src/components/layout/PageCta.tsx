import { type ReactNode } from "react";
import { Section } from "@/components/ui/Section";
import { FadeIn } from "@/components/motion/FadeIn";
import { Logo } from "@/components/Logo";

type BackgroundPhoto = {
  src: string;
  alt: string;
  objectPosition?: string;
  overlay?: "light" | "medium";
};

type PageCtaProps = {
  title: string;
  description: string;
  backgroundPhoto?: BackgroundPhoto;
  showLogo?: boolean;
  extra?: ReactNode;
  children: ReactNode;
  className?: string;
};

export function PageCta({
  title,
  description,
  backgroundPhoto,
  showLogo = false,
  extra,
  children,
  className = "",
}: PageCtaProps) {
  return (
    <Section dark backgroundPhoto={backgroundPhoto} className={className}>
      <FadeIn className="text-center max-w-2xl mx-auto">
        {showLogo && (
          <Logo
            surface="dark"
            size={64}
            className="h-16 w-16 mx-auto mb-6 animate-float-slow"
          />
        )}
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-light">{title}</h2>
        <p className="mt-3 md:mt-4 text-muted-light leading-relaxed text-base md:text-lg">{description}</p>
        {extra && <div className="mt-6">{extra}</div>}
        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row sm:flex-wrap justify-center gap-3 [&_a]:w-full sm:[&_a]:w-auto [&_a]:justify-center">
          {children}
        </div>
      </FadeIn>
    </Section>
  );
}
