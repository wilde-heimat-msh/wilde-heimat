"use client";

import Image from "next/image";
import { useEffect, useId, useState } from "react";
import { formatAbsoluteDateDe } from "@/lib/relativeTime";
import type { PatenschaftUpdate } from "@/types/patenschaftPortal";

function UpdateImageLightbox({
  src,
  alt,
  onClose,
}: {
  src: string;
  alt: string;
  onClose: () => void;
}) {
  const titleId = useId();

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-forest/90 p-3 sm:p-6"
      onClick={onClose}
    >
      <p id={titleId} className="sr-only">
        {alt}
      </p>
      <button
        type="button"
        onClick={onClose}
        className="absolute top-[max(0.75rem,env(safe-area-inset-top))] right-[max(0.75rem,env(safe-area-inset-right))] min-h-11 min-w-11 rounded-full bg-background/95 text-forest text-sm font-medium shadow-soft"
        aria-label="Schließen"
      >
        ✕
      </button>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className="max-h-[min(92dvh,100%)] max-w-full object-contain rounded-lg shadow-soft"
        onClick={(event) => event.stopPropagation()}
      />
    </div>
  );
}

export function PatenschaftUpdateCard({
  update,
  waschbaerName,
}: {
  update: PatenschaftUpdate;
  waschbaerName?: string;
}) {
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null);

  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-background/90 shadow-soft transition-shadow duration-300 hover:shadow-soft-hover">
      {update.imageUrls.length > 0 ? (
        <div className="grid gap-1 sm:grid-cols-2">
          {update.imageUrls.map((url, index) => {
            const alt = index === 0 ? update.title : `${update.title} – Bild ${index + 1}`;
            return (
              <button
                key={url}
                type="button"
                onClick={() => setLightbox({ src: url, alt })}
                className={`relative block w-full bg-muted-light/50 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest/40 focus-visible:ring-inset ${
                  update.imageUrls.length === 1 ? "sm:col-span-2" : ""
                }`}
                aria-label={`${alt} in großer Ansicht öffnen`}
              >
                <span className="relative block min-h-[12rem] w-full">
                  <Image
                    src={url}
                    alt={alt}
                    width={1200}
                    height={900}
                    className="h-auto w-full object-contain"
                    sizes="(max-width: 640px) 100vw, 480px"
                  />
                </span>
              </button>
            );
          })}
        </div>
      ) : null}

      <div className="p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <time
            dateTime={update.publishedAt}
            className="text-xs uppercase tracking-wide text-muted"
          >
            {formatAbsoluteDateDe(update.publishedAt)}
          </time>
          {waschbaerName ? (
            <span className="text-xs font-medium text-forest/80">{waschbaerName}</span>
          ) : null}
        </div>
        <h3 className="mt-1 text-lg font-medium text-forest">{update.title}</h3>
        <p className="mt-3 text-sm text-muted leading-relaxed whitespace-pre-wrap">
          {update.body}
        </p>
      </div>

      {lightbox ? (
        <UpdateImageLightbox
          src={lightbox.src}
          alt={lightbox.alt}
          onClose={() => setLightbox(null)}
        />
      ) : null}
    </article>
  );
}
