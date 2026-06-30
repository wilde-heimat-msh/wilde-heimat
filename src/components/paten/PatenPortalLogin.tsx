"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export function PatenPortalLogin() {
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
    <div className="mx-auto max-w-md">
      <div className="rounded-2xl border border-border bg-background/90 p-6 sm:p-8 shadow-soft">
        <h1 className="text-xl font-medium text-forest">Paten-Bereich</h1>
        <p className="mt-2 text-sm text-muted leading-relaxed">
          Hier siehst du Neuigkeiten und Fotos von deinem Patentier. Gib den persönlichen
          Zugangscode ein, den du von uns erhalten hast.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="paten-code" className="block text-sm font-medium mb-2">
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
              className="w-full min-w-0 px-4 py-3 border border-border bg-background input-base focus:border-foreground focus:outline-none font-mono text-sm uppercase"
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
            className="w-full min-h-11 px-4 py-3 text-sm font-medium bg-foreground text-background hover:bg-accent rounded-xl transition-all duration-200 disabled:opacity-60"
          >
            {loading ? "Wird geprüft …" : "Zum Paten-Bereich"}
          </button>
        </form>
      </div>
    </div>
  );
}
