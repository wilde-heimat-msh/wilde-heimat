"use client";

import Image from "next/image";
import { formatAbsoluteDateDe } from "@/lib/relativeTime";
import type { PatenschaftUpdate } from "@/types/patenschaftPortal";

export function PatenschaftUpdateCard({ update }: { update: PatenschaftUpdate }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-background/90 shadow-soft transition-shadow duration-300 hover:shadow-soft-hover">
      {update.imageUrls.length > 0 ? (
        <div className="grid gap-1 sm:grid-cols-2">
          {update.imageUrls.map((url, index) => (
            <div
              key={url}
              className={`relative aspect-[4/3] bg-muted-light/40 ${
                update.imageUrls.length === 1 ? "sm:col-span-2" : ""
              }`}
            >
              <Image
                src={url}
                alt={index === 0 ? update.title : ""}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 480px"
              />
            </div>
          ))}
        </div>
      ) : null}

      <div className="p-5 sm:p-6">
        <time
          dateTime={update.publishedAt}
          className="text-xs uppercase tracking-wide text-muted"
        >
          {formatAbsoluteDateDe(update.publishedAt)}
        </time>
        <h3 className="mt-1 text-lg font-medium text-forest">{update.title}</h3>
        <p className="mt-3 text-sm text-muted leading-relaxed whitespace-pre-wrap">
          {update.body}
        </p>
      </div>
    </article>
  );
}
