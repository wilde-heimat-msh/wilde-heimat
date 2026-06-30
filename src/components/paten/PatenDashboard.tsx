"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { PatenschaftUpdateCard } from "@/components/paten/PatenschaftUpdateCard";
import { patenschaftUrkundeStufeStyles } from "@/data/patenschaften";
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
    foto: string;
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
      const res = await fetch("/api/paten/feed");
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
    await fetch("/api/paten/logout", { method: "POST" });
    router.replace("/paten");
    router.refresh();
  }

  if (loading) {
    return <p className="text-sm text-muted text-center py-12">Lade deinen Paten-Bereich …</p>;
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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm text-muted">Willkommen zurück</p>
          <h1 className="text-2xl font-medium text-forest">{feed.pate.name}</h1>
          <p className="mt-1 text-sm text-muted">
            Patenschaft · {feed.waschbaer?.name ?? "dein Patentier"}
          </p>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="min-h-11 shrink-0 px-4 py-2 text-sm rounded-xl border border-border hover:bg-muted-light/60 transition-colors"
        >
          Abmelden
        </button>
      </div>

      {feed.waschbaer ? (
        <section
          className={`rounded-2xl border p-5 sm:p-6 shadow-soft grid gap-5 sm:grid-cols-[7rem_1fr] items-center ${styles.panel}`}
        >
          <div className="relative mx-auto sm:mx-0 aspect-[3/4] w-full max-w-[7rem] overflow-hidden rounded-xl border-2 bg-neutral-200 shadow-sm">
            <Image
              src={feed.waschbaer.foto}
              alt={feed.waschbaer.name}
              fill
              className="object-cover"
              sizes="112px"
            />
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
          <p className="text-sm text-muted">
            {feed.pate.stufeId === "gold"
              ? "Hier findest du die wöchentlichen Neuigkeiten von Juja zu deinem Patentier."
              : "Hier findest du Fotos und Neuigkeiten zu deinem Patentier."}
          </p>
        </div>

        {feed.updates.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-8 text-center">
            <p className="text-sm text-muted">
              Noch keine Updates – schau bald wieder vorbei. Wir melden uns, sobald es Neues gibt.
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
