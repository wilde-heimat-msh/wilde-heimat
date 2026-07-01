"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { WaschbaerFotoFolgt } from "@/components/WaschbaerFotoFolgt";
import { PatenschaftUpdateCard } from "@/components/paten/PatenschaftUpdateCard";
import { PatenLogoutButton, PatenPortalNav } from "@/components/paten/PatenPortalNav";
import {
  getPatenPortalEmptyText,
  getPatenPortalUpdatesText,
  patenschaftUrkundeStufeStyles,
  patenStufeHatPortalFeed,
} from "@/data/patenschaften";
import type { PatenschaftStufeId } from "@/data/patenschaften";
import type { PatenschaftUpdate } from "@/types/patenschaftPortal";

type FeedResponse = {
  pate: {
    name: string;
    stufeId: PatenschaftStufeId;
    stufeName: string;
  };
  waschbaer: {
    name: string;
    slug: string;
    kurztext: string;
    foto: string | null;
  } | null;
  updates: PatenschaftUpdate[];
};

export function PatenDashboard() {
  const router = useRouter();
  const [feed, setFeed] = useState<FeedResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadFeed = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/paten/feed", { credentials: "same-origin" });
      if (res.status === 401) {
        router.replace("/paten");
        return;
      }

      const data = (await res.json()) as FeedResponse & { error?: string };
      if (!res.ok) {
        setError(data.error ?? "Feed konnte nicht geladen werden.");
        return;
      }

      setFeed(data);
    } catch {
      setError("Verbindungsfehler.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    loadFeed();
  }, [loadFeed]);

  async function handleLogout() {
    await fetch("/api/paten/logout", { method: "POST", credentials: "same-origin" });
    router.replace("/paten");
    router.refresh();
  }

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse" aria-busy="true" aria-label="Paten-Bereich wird geladen">
        <div className="h-8 w-48 rounded bg-muted-light/60" />
        <div className="h-28 rounded-2xl bg-muted-light/40" />
        <div className="h-64 rounded-2xl bg-muted-light/50" />
      </div>
    );
  }

  if (error || !feed) {
    return (
      <p className="text-sm text-red-700 text-center py-12" role="alert">
        {error ?? "Ein Fehler ist aufgetreten."}
      </p>
    );
  }

  const styles = patenschaftUrkundeStufeStyles[feed.pate.stufeId];

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-2xl border border-forest/15 bg-gradient-to-br from-sage/10 via-background to-cream/80 p-5 sm:p-6 shadow-soft">
        <div
          className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-sage/10 blur-2xl"
          aria-hidden
        />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-wide text-muted">Willkommen zurück</p>
            <h1 className="mt-1 text-2xl font-medium text-forest sm:text-3xl">{feed.pate.name}</h1>
            <p className="mt-2 text-sm text-muted">
              Patenschaft · {feed.waschbaer?.name ?? "dein Patentier"} · Stufe {feed.pate.stufeName}
            </p>
          </div>
          <PatenLogoutButton onLogout={handleLogout} />
        </div>
      </div>

      <PatenPortalNav />

      {feed.waschbaer ? (
        <section
          className={`rounded-2xl border p-5 sm:p-6 shadow-soft grid gap-5 sm:grid-cols-[7rem_1fr] items-center ${styles.panel}`}
        >
          <div className="relative mx-auto sm:mx-0 aspect-[3/4] w-full max-w-[7rem] overflow-hidden rounded-xl border-2 bg-neutral-200 shadow-sm">
            {feed.waschbaer.foto ? (
              <Image
                src={feed.waschbaer.foto}
                alt={feed.waschbaer.name}
                fill
                className="object-cover"
                sizes="112px"
              />
            ) : (
              <WaschbaerFotoFolgt name={feed.waschbaer.name} compact className="h-full w-full" />
            )}
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-muted">Dein Patentier</p>
            <h2 className="text-xl font-medium text-forest">{feed.waschbaer.name}</h2>
            <p className="mt-1 text-sm text-muted leading-relaxed">{feed.waschbaer.kurztext}</p>
            <p className="mt-3 inline-flex items-center rounded-full px-3 py-1 text-xs font-medium border border-current/20">
              Stufe {feed.pate.stufeName}
            </p>
          </div>
        </section>
      ) : null}

      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-medium text-forest">Updates</h2>
          <p className="text-sm text-muted">{getPatenPortalUpdatesText(feed.pate.stufeId)}</p>
        </div>

        {!patenStufeHatPortalFeed(feed.pate.stufeId) ? (
          <div className="rounded-2xl border border-border bg-background/60 px-6 py-8">
            <p className="text-sm leading-relaxed text-muted">
              {getPatenPortalEmptyText(feed.pate.stufeId)}
            </p>
            <ul className="mt-4 space-y-2 text-sm text-muted">
              <li>✓ Silber: Fotos deines Patentiers und Tasse mit Waschbärmotiv</li>
              <li>✓ Gold: wöchentliche Updates von Juja plus alle Extras</li>
            </ul>
            <Link
              href="/patenschaften#stufen"
              className="mt-5 inline-flex min-h-11 items-center rounded-xl border border-border px-4 py-2 text-sm font-medium hover:bg-muted-light/60"
            >
              Stufen vergleichen
            </Link>
          </div>
        ) : feed.updates.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-background/60 px-6 py-10 text-center">
            <div
              className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-sage/15 text-forest"
              aria-hidden
            >
              <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth="1.5">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
            </div>
            <p className="mt-4 text-base font-medium text-forest">Noch keine Updates</p>
            <p className="mt-2 text-sm text-muted leading-relaxed">
              {getPatenPortalEmptyText(feed.pate.stufeId)}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {feed.updates.map((update) => (
              <PatenschaftUpdateCard key={update.id} update={update} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
