import { FadeIn } from "@/components/motion/FadeIn";
import { patenschaftJujaZitat } from "@/data/patenschaften";

export function PatenschaftQuote() {
  return (
    <FadeIn className="max-w-3xl mx-auto">
      <figure className="relative rounded-2xl border border-sand/60 bg-cream/90 px-6 py-8 sm:px-10 sm:py-10 shadow-soft">
        <span
          className="absolute top-4 left-5 sm:top-6 sm:left-8 text-5xl sm:text-6xl font-serif text-sage/25 leading-none select-none"
          aria-hidden
        >
          „
        </span>
        <blockquote className="relative text-lg sm:text-xl font-light leading-relaxed text-foreground">
          {patenschaftJujaZitat.text}
        </blockquote>
        <figcaption className="mt-6 pt-5 border-t border-border/60">
          <p className="font-medium">{patenschaftJujaZitat.attribution}</p>
          <p className="text-sm text-muted mt-0.5">{patenschaftJujaZitat.role}</p>
        </figcaption>
      </figure>
    </FadeIn>
  );
}
