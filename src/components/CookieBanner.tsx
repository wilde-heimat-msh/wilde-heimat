"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { CONSENT_STORAGE_KEY } from "@/data/privacy";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!consent) {
      setVisible(true);
    }
  }, []);

  function accept() {
    localStorage.setItem(CONSENT_STORAGE_KEY, "accepted");
    setVisible(false);
  }

  function decline() {
    localStorage.setItem(CONSENT_STORAGE_KEY, "declined");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Datenschutz-Hinweis"
      className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] left-4 right-4 md:left-auto md:right-6 md:max-w-xl z-50 bg-forest text-background p-4 sm:p-5 md:p-6 rounded-2xl shadow-soft-hover"
    >
      <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="text-sm leading-relaxed max-w-2xl space-y-2">
          <p>
            <strong className="font-medium">Datenschutz-Hinweis:</strong> Diese Website setzt{" "}
            <strong className="font-medium">keine Tracking- oder Marketing-Cookies</strong> ein.
            Wir speichern deine Auswahl zu diesem Hinweis lokal im Browser (localStorage), damit
            er nicht bei jedem Besuch erneut erscheint.
          </p>
          <p className="text-background/85 text-xs sm:text-sm">
            Beim Absenden von Formularen werden personenbezogene Daten verarbeitet. Externe
            Spendenlinks (PayPal, GoFundMe, Amazon) haben eigene Datenschutzregeln.
          </p>
          <p>
            Details in der{" "}
            <Link href="/datenschutz#cookies" className="underline hover:no-underline">
              Datenschutzerklärung
            </Link>
            .
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 shrink-0 w-full md:w-auto">
          <button
            type="button"
            onClick={decline}
            className="min-h-11 px-4 py-3 text-sm rounded-xl border border-muted-light hover:bg-accent transition-all duration-200 w-full sm:w-auto"
          >
            Hinweis schließen
          </button>
          <button
            type="button"
            onClick={accept}
            className="min-h-11 px-4 py-3 text-sm rounded-xl bg-background text-foreground hover:bg-muted-light transition-all duration-200 w-full sm:w-auto"
          >
            Verstanden
          </button>
        </div>
      </div>
    </div>
  );
}
