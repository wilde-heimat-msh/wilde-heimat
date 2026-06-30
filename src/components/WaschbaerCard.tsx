"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import type { Waschbaer } from "@/data/waschbaeren";
import { waschbaerProfilPlatzhalter } from "@/data/photos";

type WaschbaerCardProps = {
  waschbaer: Waschbaer;
  compact?: boolean;
  /** Zeigt „Als Pate wählen“-Button (Patenschaften-Seite) */
  patenschaftSelect?: boolean;
};

function CardImage({ waschbaer, compact }: { waschbaer: Waschbaer; compact: boolean }) {
  return (
    <div className="aspect-[4/3] relative overflow-hidden bg-neutral-800">
      <Image
        src={waschbaerProfilPlatzhalter}
        alt={`${waschbaer.name} – Foto folgt`}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105 opacity-90"
        sizes={compact ? "200px" : "(max-width: 768px) 50vw, 33vw"}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
      <span className="absolute top-3 right-3 text-[10px] uppercase tracking-wider px-2 py-1 rounded-full bg-background/90 text-muted backdrop-blur-sm">
        Foto folgt
      </span>
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
        className={`font-medium group-hover:underline underline-offset-4 transition-all ${compact ? "text-base sm:text-lg" : "text-xl"}`}
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
  const reduced = useReducedMotion();
  const patenschaftHref = `/patenschaften?waschbaer=${waschbaer.slug}#patenschaft-anfragen`;

  const cardClass =
    "group overflow-hidden rounded-2xl border border-border bg-background shadow-soft hover:shadow-soft-hover hover:border-foreground/20 transition-all duration-300";

  if (patenschaftSelect) {
    return (
      <motion.div
        whileHover={reduced ? undefined : { y: -8 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className={`${cardClass} flex flex-col h-full`}
      >
        <Link href={`/waschbaeren/${waschbaer.slug}`} className="block flex-1">
          <CardImage waschbaer={waschbaer} compact={compact} />
          <div className={compact ? "p-3 sm:p-4" : "p-5 sm:p-6"}>
            <CardBody waschbaer={waschbaer} compact={compact} />
          </div>
        </Link>
        <div className="px-3 sm:px-4 pb-3 sm:pb-4 pt-0">
          <Link
            href={patenschaftHref}
            className="flex items-center justify-center min-h-11 w-full rounded-xl bg-forest text-background text-sm font-medium hover:bg-forest-mid transition-colors"
          >
            Als Pate wählen
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={reduced ? undefined : { y: -8 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link href={`/waschbaeren/${waschbaer.slug}`} className={`${cardClass} block`}>
        <CardImage waschbaer={waschbaer} compact={compact} />
        <div className={compact ? "p-3 sm:p-4" : "p-5 sm:p-6"}>
          <CardBody waschbaer={waschbaer} compact={compact} />
        </div>
      </Link>
    </motion.div>
  );
}
