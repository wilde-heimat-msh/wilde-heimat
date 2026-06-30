"use client";

import { useCallback, useEffect, useState } from "react";
import { AdminLogoutButton, AdminNav } from "@/components/admin/AdminLogin";
import { formatAbsoluteDateDe } from "@/lib/relativeTime";
import type { FormSubmissionRecord } from "@/lib/supabase/formSubmissions";

const typeLabels: Record<string, string> = {
  kontakt: "Kontakt",
  patenschaft: "Patenschaft",
  fund: "Fundmeldung",
  pflegestelle: "Pflegestelle",
  vermittlung: "Vermittlung",
};

export function AdminAnfragenManager() {
  const [submissions, setSubmissions] = useState<FormSubmissionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  const loadSubmissions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/anfragen", { credentials: "same-origin" });
      const data = (await res.json()) as {
        submissions?: FormSubmissionRecord[];
        error?: string;
      };

      if (!res.ok) {
        setError(data.error ?? "Anfragen konnten nicht geladen werden.");
        setSubmissions([]);
        return;
      }

      setSubmissions(data.submissions ?? []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSubmissions();
  }, [loadSubmissions]);

  async function handleDelete(id: string) {
    if (!confirm("Anfrage wirklich löschen?")) return;

    const res = await fetch(`/api/admin/anfragen?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
      credentials: "same-origin",
    });

    if (!res.ok) {
      setError("Löschen fehlgeschlagen.");
      return;
    }

    setStatus("Anfrage gelöscht.");
    await loadSubmissions();
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-medium text-forest">Formular-Anfragen</h1>
          <p className="mt-1 text-sm text-muted max-w-2xl">
            Alle eingegangenen Kontakt-, Fund- und Patenschaftsanfragen aus der Website.
          </p>
        </div>
        <AdminLogoutButton />
      </div>

      <AdminNav />

      {error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
          {error}
        </p>
      ) : null}
      {status ? (
        <p className="text-sm text-muted" role="status">
          {status}
        </p>
      ) : null}

      <div className="rounded-2xl border border-border bg-background/90 shadow-soft overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between gap-4">
          <h2 className="font-medium text-forest">
            {loading ? "Lade …" : `${submissions.length} Anfragen`}
          </h2>
          <button
            type="button"
            onClick={loadSubmissions}
            className="min-h-9 px-3 text-xs rounded-lg border border-border hover:bg-muted-light/60"
          >
            Aktualisieren
          </button>
        </div>

        {submissions.length === 0 && !loading ? (
          <p className="p-5 text-sm text-muted">Noch keine Anfragen eingegangen.</p>
        ) : (
          <ul className="divide-y divide-border">
            {submissions.map((item) => (
              <li key={item.id} className="p-5 space-y-3">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="font-medium text-forest">
                      {typeLabels[item.type] ?? item.type}
                    </p>
                    <p className="text-xs text-muted">
                      {formatAbsoluteDateDe(item.createdAt)}
                      {item.replyTo ? ` · ${item.replyTo}` : ""}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {item.replyTo ? (
                      <a
                        href={`mailto:${item.replyTo}`}
                        className="min-h-9 inline-flex items-center px-3 text-xs rounded-lg border border-border hover:bg-muted-light/60"
                      >
                        Antworten
                      </a>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      className="min-h-9 px-3 text-xs rounded-lg border border-red-200 text-red-700 hover:bg-red-50"
                    >
                      Löschen
                    </button>
                  </div>
                </div>

                <dl className="grid gap-1 text-sm">
                  {Object.entries(item.payload).map(([key, value]) =>
                    value ? (
                      <div key={key}>
                        <dt className="text-xs uppercase tracking-wide text-muted">{key}</dt>
                        <dd className="text-foreground whitespace-pre-wrap">{value}</dd>
                      </div>
                    ) : null
                  )}
                </dl>

                {item.attachmentUrl ? (
                  <p className="text-sm">
                    <a
                      href={item.attachmentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:no-underline"
                    >
                      Foto-Anhang öffnen
                    </a>
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
