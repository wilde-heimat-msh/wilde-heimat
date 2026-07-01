"use client";

import Link from "next/link";
import Image from "next/image";
import type { Waschbaer } from "@/data/waschbaeren";
import { getWaschbaerCardFoto, hasWaschbaerEchteFotos } from "@/data/photos";

type WaschbaerCardProps = {
  waschbaer: Waschbaer;
  compact?: boolean;
  /** Zeigt „Als Pate wählen“-Button (Patenschaften-Seite) */
  patenschaftSelect?: boolean;
};

function CardImage({ waschbaer, compact }: { waschbaer: Waschbaer; compact: boolean }) {
  const hatEchtesFoto = hasWaschbaerEchteFotos(waschbaer.slug);
  const src = getWaschbaerCardFoto(waschbaer.slug);

  return (
    <div className="aspect-[4/3] relative overflow-hidden bg-neutral-800">
      <Image
        src={src}
        alt={hatEchtesFoto ? `${waschbaer.name} – bei Wilde Heimat` : `${waschbaer.name} – Foto folgt`}
        fill
        className={`group-hover-zoom object-cover ${hatEchtesFoto ? "" : "opacity-90"}`}
        sizes={compact ? "200px" : "(max-width: 768px) 50vw, 33vw"}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 via-transparent to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-80" />
      {!hatEchtesFoto ? (
        <span className="absolute top-3 right-3 text-[10px] uppercase tracking-wider px-2 py-1 rounded-full bg-background/90 text-muted backdrop-blur-sm">
          Foto folgt
        </span>
      ) : null}
    </div>
  );
}

function CardBody({
  waschbaer,
  compact,
}: {
  waschbaer: Waschbaer;
  compact: boolean;
}) {
  return (
    <>
      <h3
        className={`font-medium group-hover:underline underline-offset-4 transition-colors ${compact ? "text-base sm:text-lg" : "text-xl"}`}
      >
        {waschbaer.name}
      </h3>
      <p className="mt-1 text-sm text-muted">Aufgenommen {waschbaer.aufgenommen}</p>
      {!compact && (
        <p className="mt-3 text-sm leading-relaxed text-muted line-clamp-2">
          {waschbaer.kurztext}
        </p>
      )}
      <div className="mt-2 sm:mt-3 flex flex-wrap gap-1.5 sm:gap-2">
        {waschbaer.eigenschaften.slice(0, 3).map((e) => (
          <span
            key={e}
            className="text-[11px] sm:text-xs px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-muted-light text-muted"
          >
            {e}
          </span>
        ))}
      </div>
    </>
  );
}

export function WaschbaerCard({
  waschbaer,
  compact = false,
  patenschaftSelect = false,
}: WaschbaerCardProps) {
  const patenschaftHref = `/patenschaften?waschbaer=${waschbaer.slug}#patenschaft-anfragen`;

  const cardClass =
    "group hover-lift overflow-hidden rounded-2xl border border-border bg-background shadow-soft hover:shadow-soft-hover hover:border-foreground/20";

  if (patenschaftSelect) {
    return (
      <div className={`${cardClass} flex h-full flex-col`}>
        <Link href={`/waschbaeren/${waschbaer.slug}`} className="block flex-1">
          <CardImage waschbaer={waschbaer} compact={compact} />
          <div className={compact ? "p-3 sm:p-4" : "p-5 sm:p-6"}>
            <CardBody waschbaer={waschbaer} compact={compact} />
          </div>
        </Link>
        <div className="px-3 pb-3 pt-0 sm:px-4 sm:pb-4">
          <Link
            href={patenschaftHref}
            className="btn-hover flex min-h-11 w-full items-center justify-center rounded-xl bg-forest text-sm font-medium text-background hover:bg-forest-mid"
          >
            Als Pate wählen
          </Link>
        </div>
      </div>
    );
  }

  return (
    <Link href={`/waschbaeren/${waschbaer.slug}`} className={`${cardClass} block`}>
      <CardImage waschbaer={waschbaer} compact={compact} />
      <div className={compact ? "p-3 sm:p-4" : "p-5 sm:p-6"}>
        <CardBody waschbaer={waschbaer} compact={compact} />
      </div>
    </Link>
  );
}
