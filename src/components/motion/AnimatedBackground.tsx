type AnimatedBackgroundProps = {
  variant?: "hero" | "hero-photo" | "page" | "soft" | "ambient";
};

function Blob({
  className,
  drift,
}: {
  className: string;
  drift: "a" | "b" | "c";
}) {
  return (
    <div
      className={`motion-blob motion-blob-${drift} absolute rounded-full blur-xl md:blur-2xl lg:blur-3xl ${className}`}
      aria-hidden
    />
  );
}

export function AnimatedBackground({ variant = "hero" }: AnimatedBackgroundProps) {
  if (variant === "ambient") {
    return (
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="mesh-ambient absolute inset-0 opacity-80" />
      </div>
    );
  }

  if (variant === "soft") {
    return (
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="mesh-soft absolute inset-0" />
        <Blob
          drift="a"
          className="-top-24 -right-24 h-56 w-56 bg-honey-light/25 md:h-80 md:w-80"
        />
        <Blob
          drift="b"
          className="-bottom-32 -left-24 h-64 w-64 bg-sage-light/22 md:h-96 md:w-96"
        />
        <div
          className="motion-blob-pulse absolute top-1/2 left-1/2 h-48 w-48 rounded-full bg-sand/30 blur-xl md:h-64 md:w-64 md:blur-2xl"
          aria-hidden
        />
      </div>
    );
  }

  if (variant === "hero-photo") {
    return (
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <Blob
          drift="a"
          className="-top-24 -right-24 h-56 w-56 bg-honey/10 md:h-80 md:w-80"
        />
        <Blob
          drift="c"
          className="bottom-0 left-0 h-48 w-48 bg-sage/10 md:h-64 md:w-64"
        />
      </div>
    );
  }

  const isHero = variant === "hero";

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div
        className={`absolute inset-0 bg-gradient-to-br from-forest via-forest-mid to-forest-light ${
          isHero ? "" : "opacity-95"
        }`}
      />
      <div className="hero-gradient absolute inset-0 opacity-60" />
      <div className="mesh-dark absolute inset-0 opacity-40" />
      <Blob
        drift="a"
        className={
          isHero
            ? "-top-32 -right-32 h-72 w-72 bg-honey/20 md:h-96 md:w-96"
            : "top-0 right-0 h-48 w-48 bg-honey/15 md:h-64 md:w-64"
        }
      />
      <Blob
        drift="b"
        className={
          isHero
            ? "-bottom-48 -left-32 h-80 w-80 bg-sage-light/18 md:h-[28rem] md:w-[28rem]"
            : "bottom-0 left-1/4 h-40 w-40 bg-sage/15 md:h-48 md:w-48"
        }
      />
      {isHero ? (
        <div
          className="motion-blob-pulse-x absolute top-1/3 left-1/2 h-48 w-48 rounded-full bg-honey-light/10 blur-xl md:h-64 md:w-64 md:blur-2xl"
          aria-hidden
        />
      ) : null}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,transparent_0%,rgba(42,51,38,0.5)_70%)]" />
    </div>
  );
}
