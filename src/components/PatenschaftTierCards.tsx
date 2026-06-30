import Link from "next/link";
import { patenschaftsStufen } from "@/data/site";
import { Stagger, StaggerItem } from "@/components/motion/FadeIn";

type PatenschaftTierCardsProps = {
  /** Glas-Karten auf dunklem Hintergrund (Startseite) */
  variant?: "dark" | "light";
  className?: string;
  /** CTAs zu #patenschaft-anfragen (Patenschaften-Seite) */
  showCta?: boolean;
};

export function PatenschaftTierCards({
  variant = "light",
  className = "",
  showCta = false,
}: PatenschaftTierCardsProps) {
  const isDark = variant === "dark";

  return (
    <Stagger
      className={`grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 ${className}`}
      stagger={0.12}
    >
      {patenschaftsStufen.map((stufe) => (
        <StaggerItem key={stufe.id}>
          <div
            className={`relative overflow-hidden rounded-2xl border text-center h-full hover-lift ${
              isDark
                ? "border-background/25 bg-background/10 hover:bg-background/15 shadow-sm hover:shadow-md backdrop-blur-md"
                : "border-border bg-background shadow-soft hover:shadow-soft-hover hover:border-sage/30"
            } ${"badge" in stufe && stufe.badge ? "md:scale-[1.02] md:-translate-y-0.5" : ""}`}
          >
            <div
              className={`h-1.5 bg-gradient-to-r ${stufe.accentClass}`}
              aria-hidden
            />
            <div className="p-5 sm:p-6 md:p-8">
              {"badge" in stufe && stufe.badge && (
                <span
                  className={`inline-block mb-3 px-3 py-1 rounded-full text-xs font-medium tracking-wide ${
                    isDark
                      ? "bg-background/20 text-background border border-background/30"
                      : "bg-sage/15 text-forest border border-sage/25"
                  }`}
                >
                  {stufe.badge}
                </span>
              )}
              <p
                className={`text-sm uppercase tracking-wider ${
                  isDark ? "text-muted-light" : "text-muted"
                }`}
              >
                {stufe.name}
              </p>
              <p
                className={`mt-1 text-sm italic ${
                  isDark ? "text-background/80" : "text-sage"
                }`}
              >
                {stufe.tagline}
              </p>
              <p
                className={`mt-3 text-3xl sm:text-4xl md:text-5xl font-light ${
                  isDark ? "text-background" : "text-foreground"
                }`}
              >
                {stufe.preis} €
              </p>
              <p className={`text-sm ${isDark ? "text-muted-light" : "text-muted"}`}>
                monatlich
              </p>
              <p
                className={`mt-4 text-sm leading-relaxed ${
                  isDark ? "text-muted-light" : "text-muted"
                }`}
              >
                {stufe.beschreibung}
              </p>
              <ul
                className={`mt-6 space-y-2 text-sm ${
                  isDark ? "text-muted-light" : "text-muted"
                } ${isDark ? "" : "text-left"}`}
              >
                {stufe.leistungen.map((l) => (
                  <li key={l} className={isDark ? "" : "flex items-start gap-2"}>
                    {!isDark && <span className="text-sage mt-0.5 shrink-0">✓</span>}
                    {isDark && <span className="text-sage-light mr-1.5">✓</span>}
                    {l}
                  </li>
                ))}
              </ul>
              {showCta && (
                <Link
                  href={`/patenschaften?stufe=${stufe.id}#patenschaft-anfragen`}
                  className={`mt-6 inline-flex items-center justify-center min-h-11 w-full sm:w-auto rounded-full px-5 py-2.5 text-sm font-medium transition-colors ${
                    isDark
                      ? "bg-background text-forest hover:bg-background/90"
                      : "bg-forest text-background hover:bg-forest-mid"
                  }`}
                >
                  {stufe.name} wählen
                </Link>
              )}
            </div>
          </div>
        </StaggerItem>
      ))}
    </Stagger>
  );
}
