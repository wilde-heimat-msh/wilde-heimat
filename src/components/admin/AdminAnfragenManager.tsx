"use client";

import { useCallback, useEffect, useState } from "react";
import { AdminLogoutButton, AdminNav } from "@/components/admin/AdminLogin";
import { formatDateTimeDe, formatFormDateDe } from "@/lib/relativeTime";
import type { FormSubmissionRecord } from "@/lib/supabase/formSubmissions";

const typeLabels: Record<string, string> = {
  kontakt: "Kontakt",
  patenschaft: "Patenschaft",
  fund: "Fundmeldung",
  pflegestelle: "Pflegestelle",
  vermittlung: "Vermittlung",
};

type MailStatus = {
  configured: boolean;
  domainVerified: boolean;
  provider: "smtp" | "resend" | null;
  to: string;
  from: string;
};

function isImageUrl(value: string): boolean {
  if (!value.startsWith("http")) return false;
  return (
    /\.(jpe?g|png|webp|gif|avif)(\?|$)/i.test(value) ||
    value.includes("supabase.co/storage")
  );
}

function formatPayloadValue(key: string, value: string): string {
  if (key.toLowerCase() === "datum") {
    return formatFormDateDe(value);
  }
  return value;
}

function isPhotoField(key: string, value: string): boolean {
  if (key.toLowerCase() === "foto") return true;
  return isImageUrl(value);
}

function getAttachmentUrl(item: FormSubmissionRecord): string | undefined {
  if (item.attachmentUrl && isImageUrl(item.attachmentUrl)) {
    return item.attachmentUrl;
  }

  for (const value of Object.values(item.payload)) {
    if (value && isImageUrl(value)) return value;
  }

  return undefined;
}

function FormAttachmentPreview({ url }: { url: string }) {
  return (
    <div className="rounded-xl border border-border bg-muted-light/20 p-3 sm:p-4">
      <p className="text-xs uppercase tracking-wide text-muted mb-3">Foto-Anhang</p>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-fit max-w-full"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={url}
          alt="Foto zur Anfrage"
          className="max-h-80 w-auto max-w-full rounded-lg border border-border object-contain bg-background"
        />
      </a>
      <p className="mt-2 text-xs text-muted">
        <a href={url} target="_blank" rel="noopener noreferrer" className="underline hover:no-underline">
          Bild in voller Größe öffnen
        </a>
      </p>
    </div>
  );
}

function MailStatusBanner({ mail }: { mail: MailStatus | null }) {
  if (!mail) return null;

  if (!mail.configured) {
    return (
      <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
        E-Mail-Benachrichtigungen sind noch nicht aktiv (SMTP-Zugangsdaten fehlen in Vercel).
        Anfragen werden hier gespeichert. Checkdomain-SMTP einrichten – siehe{" "}
        <code className="text-xs">docs/email-setup.md</code>.
      </p>
    );
  }

  if (mail.provider === "resend" && !mail.domainVerified) {
    return (
      <p className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-900">
        E-Mail-Versand vorbereitet an <strong>{mail.to}</strong> (Absender: {mail.from}).
        Nach Domain-Freischaltung <code className="text-xs">FORM_MAIL_DOMAIN_VERIFIED=true</code> setzen.
      </p>
    );
  }

  return (
    <p className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-900">
      Neue Anfragen werden an <strong>{mail.to}</strong> per E-Mail gesendet und hier gespeichert.
    </p>
  );
}

export function AdminAnfragenManager() {
  const [submissions, setSubmissions] = useState<FormSubmissionRecord[]>([]);
  const [mail, setMail] = useState<MailStatus | null>(null);
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
        mail?: MailStatus;
        error?: string;
      };

      if (!res.ok) {
        setError(data.error ?? "Anfragen konnten nicht geladen werden.");
        setSubmissions([]);
        setMail(null);
        return;
      }

      setSubmissions(data.submissions ?? []);
      setMail(data.mail ?? null);
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
            Alle eingegangenen Kontakt-, Fund- und Patenschaftsanfragen – inkl. Fotos. Zusätzlich
            E-Mail an kontakt@wilde-heimat-msh.de, sobald Checkdomain-SMTP in Vercel aktiv ist.
          </p>
        </div>
        <AdminLogoutButton />
      </div>

      <AdminNav />

      <MailStatusBanner mail={mail} />

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
            {submissions.map((item) => {
              const attachmentUrl = getAttachmentUrl(item);

              return (
                <li key={item.id} className="p-5 space-y-3">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="font-medium text-forest">
                        {typeLabels[item.type] ?? item.type}
                      </p>
                      <p className="text-xs text-muted">
                        <time dateTime={item.createdAt}>
                          Eingegangen am {formatDateTimeDe(item.createdAt)}
                        </time>
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

                  {attachmentUrl ? <FormAttachmentPreview url={attachmentUrl} /> : null}

                  <dl className="grid gap-2 text-sm sm:grid-cols-2">
                    {Object.entries(item.payload).map(([key, value]) => {
                      if (!value?.trim()) return null;
                      if (isPhotoField(key, value)) return null;

                      return (
                        <div key={key} className={key === "Nachricht" || key === "Beschreibung" ? "sm:col-span-2" : undefined}>
                          <dt className="text-xs uppercase tracking-wide text-muted">{key}</dt>
                          <dd className="text-foreground whitespace-pre-wrap">
                            {formatPayloadValue(key, value)}
                          </dd>
                        </div>
                      );
                    })}
                  </dl>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
