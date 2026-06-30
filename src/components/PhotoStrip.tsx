import Image from "next/image";
import Link from "next/link";
import { getDesignWaschbaerBild, waschbaerProfilPlatzhalter } from "@/data/photos";
import { waschbaeren } from "@/data/waschbaeren";
import { FadeIn } from "@/components/motion/FadeIn";

/** Horizontale Foto-Streifen für Unterseiten */
export function PhotoStrip({ count = 6 }: { count?: number }) {
  const items = waschbaeren.slice(0, count);

  return (
    <FadeIn>
      <p className="text-xs text-muted mb-2 sm:hidden">Wischen zum Entdecken →</p>
      <div className="-mx-4 px-4 flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide">
        {items.map((w) => (
          <Link
            key={w.slug}
            href={`/waschbaeren/${w.slug}`}
            className="relative shrink-0 w-36 sm:w-44 aspect-[3/4] rounded-2xl overflow-hidden shadow-soft snap-start group"
          >
            <Image
              src={waschbaerProfilPlatzhalter}
              alt={`${w.name} – Foto folgt`}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105 opacity-90"
              sizes="180px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
            <span className="absolute bottom-2 left-2 text-xs font-medium text-background">
              {w.name}
            </span>
          </Link>
        ))}
      </div>
    </FadeIn>
  );
}

/** Dekorativer Streifen ohne Namenszuordnung – nur Gestaltung */
export function DesignPhotoStrip({ count = 6 }: { count?: number }) {
  return (
    <FadeIn>
      <div className="-mx-4 px-4 flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide">
        {Array.from({ length: count }, (_, index) => (
          <div
            key={index}
            className="relative shrink-0 w-36 sm:w-44 aspect-[3/4] rounded-2xl overflow-hidden shadow-soft snap-start"
          >
            <Image
              src={getDesignWaschbaerBild(index)}
              alt="Waschbär-Impression"
              fill
              className="object-cover"
              sizes="180px"
            />
          </div>
        ))}
      </div>
    </FadeIn>
  );
}
