"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export function PatenLoginFormFallback() {
  return (
    <div
      className="rounded-2xl border border-border bg-background/95 p-6 sm:p-8 shadow-soft animate-pulse"
      aria-hidden
    >
      <div className="h-6 w-36 rounded bg-muted-light/60" />
      <div className="mt-4 h-4 w-full rounded bg-muted-light/40" />
      <div className="mt-6 h-11 w-full rounded bg-muted-light/50" />
      <div className="mt-4 h-11 w-full rounded bg-muted-light/60" />
    </div>
  );
}

export function PatenLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(
    searchParams.get("fehler") === "code" ? "Zugangscode ungültig oder inaktiv." : null
  );
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/paten/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      const data = (await res.json()) as { error?: string };

      if (!res.ok) {
        setError(data.error ?? "Anmeldung fehlgeschlagen.");
        return;
      }

      router.push("/paten/portal");
      router.refresh();
    } catch {
      setError("Verbindungsfehler. Bitte erneut versuchen.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-background/95 shadow-soft">
      <div
        className="h-1 bg-gradient-to-r from-sage/50 via-forest to-sage/50"
        aria-hidden
      />
      <div className="p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <div
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sage/15 text-forest"
            aria-hidden
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="1.75">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-medium text-forest">Bereits Pate?</h2>
            <p className="mt-1 text-sm text-muted leading-relaxed">
              Melde dich mit deinem persönlichen Zugangscode an – dort findest du Fotos und
              Neuigkeiten von deinem Patentier.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="paten-code" className="mb-2 block text-sm font-medium">
              Zugangscode
            </label>
            <input
              id="paten-code"
              type="text"
              autoComplete="off"
              spellCheck={false}
              value={code}
              onChange={(event) => setCode(event.target.value.toUpperCase())}
              required
              placeholder="z. B. PEDRO-GOLD-2026"
              className="input-base w-full min-w-0 border border-border bg-background px-4 py-3 font-mono text-sm uppercase focus:border-foreground focus:outline-none"
            />
          </div>

          {error ? (
            <p className="text-sm text-red-700" role="alert">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full min-h-11 rounded-xl bg-foreground px-4 py-3 text-sm font-medium text-background transition-all duration-200 hover:bg-accent disabled:opacity-60"
          >
            {loading ? "Wird geprüft …" : "Zu meinen Updates"}
          </button>
        </form>

        <p className="mt-5 text-center text-xs text-muted leading-relaxed">
          Den Code erhältst du nach deiner Patenschaft per E-Mail oder persönlich von uns.
        </p>
      </div>
    </div>
  );
}
