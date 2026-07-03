"use client";

import Link from "next/link";
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

const payloadKeyLabels: Record<string, string> = {
  datenschutz_einwilligung: "Datenschutz",
  datenschutz_einwilligung_zeitpunkt: "Datenschutz bestätigt am",
  widerrufsbelehrung_kenntnis: "Widerrufsbelehrung",
  widerrufsbelehrung_zeitpunkt: "Widerrufsbelehrung bestätigt am",
};

function isIsoDateTime(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(value);
}

function formatPayloadKey(key: string): string {
  return payloadKeyLabels[key.toLowerCase()] ?? key;
}

function formatPayloadValue(key: string, value: string): string {
  const keyLower = key.toLowerCase();

  if (keyLower === "datum") {
    return formatFormDateDe(value);
  }

  if (keyLower.endsWith("_zeitpunkt") || isIsoDateTime(value)) {
    return formatDateTimeDe(value);
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

function MailStatusBanner({
  mail,
  onTestMail,
  testingMail,
}: {
  mail: MailStatus | null;
  onTestMail: () => void;
  testingMail: boolean;
}) {
  if (!mail) return null;

  if (!mail.configured) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 space-y-2">
        <p>
          <strong>E-Mail-Benachrichtigungen sind noch nicht aktiv.</strong> Anfragen werden hier
          gespeichert, aber es geht keine E-Mail raus – die SMTP-Zugangsdaten fehlen in Vercel.
        </p>
        <p>
          Checkdomain-SMTP einrichten (Anleitung: <code className="text-xs">docs/email-setup.md</code>
          ): <code className="text-xs">SMTP_HOST</code>, <code className="text-xs">SMTP_USER</code>,{" "}
          <code className="text-xs">SMTP_PASS</code> und <code className="text-xs">FORM_MAIL_TO</code>{" "}
          in Vercel setzen, dann Redeploy.
        </p>
      </div>
    );
  }

  if (mail.provider === "resend" && !mail.domainVerified) {
    return (
      <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-900 space-y-2">
        <p>
          E-Mail-Versand vorbereitet an <strong>{mail.to}</strong> (Absender: {mail.from}).
          Nach Domain-Freischaltung <code className="text-xs">FORM_MAIL_DOMAIN_VERIFIED=true</code>{" "}
          setzen.
        </p>
        <button
          type="button"
          onClick={onTestMail}
          disabled={testingMail}
          className="min-h-9 px-3 text-xs rounded-lg border border-blue-300 bg-white hover:bg-blue-50 disabled:opacity-60"
        >
          {testingMail ? "Sende Test …" : "Test-E-Mail senden"}
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-900 space-y-2">
      <p>
        Neue Anfragen werden automatisch an <strong>{mail.to}</strong> per E-Mail gesendet und hier
        gespeichert (Kontakt, Patenschaft, Fundmeldung, Pflegestelle, Vermittlung).
      </p>
      <button
        type="button"
        onClick={onTestMail}
        disabled={testingMail}
        className="min-h-9 px-3 text-xs rounded-lg border border-green-300 bg-white hover:bg-green-50 disabled:opacity-60"
      >
        {testingMail ? "Sende Test …" : "Test-E-Mail senden"}
      </button>
    </div>
  );
}

export function AdminAnfragenManager() {
  const [submissions, setSubmissions] = useState<FormSubmissionRecord[]>([]);
  const [mail, setMail] = useState<MailStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [testingMail, setTestingMail] = useState(false);
  const [resendingId, setResendingId] = useState<string | null>(null);
  const [creatingPatenId, setCreatingPatenId] = useState<string | null>(null);
  const [patronBySubmissionId, setPatronBySubmissionId] = useState<Record<string, string>>({});

  const loadSubmissions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/anfragen", { credentials: "same-origin" });
      const data = (await res.json()) as {
        submissions?: FormSubmissionRecord[];
        mail?: MailStatus;
        patronBySubmissionId?: Record<string, string>;
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
      setPatronBySubmissionId(data.patronBySubmissionId ?? {});
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSubmissions();
  }, [loadSubmissions]);

  async function handleTestMail() {
    setTestingMail(true);
    setError(null);
    setStatus(null);
    try {
      const res = await fetch("/api/admin/anfragen/mail-test", {
        method: "POST",
        credentials: "same-origin",
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(data.error ?? "Test-E-Mail konnte nicht gesendet werden.");
        return;
      }
      setStatus(`Test-E-Mail wurde an ${mail?.to ?? "kontakt@wilde-heimat-msh.de"} gesendet.`);
    } finally {
      setTestingMail(false);
    }
  }

  async function handleResendMail(id: string) {
    setResendingId(id);
    setError(null);
    setStatus(null);
    try {
      const res = await fetch("/api/admin/anfragen/resend", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(data.error ?? "E-Mail konnte nicht erneut gesendet werden.");
        return;
      }
      setStatus("E-Mail-Benachrichtigung wurde erneut gesendet.");
    } finally {
      setResendingId(null);
    }
  }

  async function handleCreatePaten(submissionId: string) {
    setCreatingPatenId(submissionId);
    setError(null);
    setStatus(null);
    try {
      const res = await fetch("/api/admin/paten/from-anfrage", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ submissionId }),
      });
      const data = (await res.json()) as { error?: string; pate?: { id: string; name: string } };

      if (!res.ok) {
        if (res.status === 409 && data.pate?.id) {
          setPatronBySubmissionId((prev) => ({ ...prev, [submissionId]: data.pate!.id }));
          setError("Für diese Anfrage existiert bereits ein Pate.");
          return;
        }
        setError(data.error ?? "Pate konnte nicht angelegt werden.");
        return;
      }

      if (data.pate?.id) {
        setPatronBySubmissionId((prev) => ({ ...prev, [submissionId]: data.pate!.id }));
        window.location.href = `/admin/paten/${encodeURIComponent(data.pate.id)}`;
      }
    } finally {
      setCreatingPatenId(null);
    }
  }

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

      <MailStatusBanner mail={mail} onTestMail={handleTestMail} testingMail={testingMail} />

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
                      {item.type === "patenschaft" ? (
                        patronBySubmissionId[item.id] ? (
                          <Link
                            href={`/admin/paten/${encodeURIComponent(patronBySubmissionId[item.id])}`}
                            className="min-h-9 inline-flex items-center px-3 text-xs rounded-lg border border-green-300 bg-green-50 text-green-900 hover:bg-green-100"
                          >
                            Paten-Kartei öffnen
                          </Link>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleCreatePaten(item.id)}
                            disabled={creatingPatenId === item.id}
                            className="min-h-9 inline-flex items-center px-3 text-xs rounded-lg border border-forest/30 bg-forest/5 text-forest hover:bg-forest/10 disabled:opacity-60"
                          >
                            {creatingPatenId === item.id ? "Lege an …" : "Als Pate anlegen"}
                          </button>
                        )
                      ) : null}
                      {mail?.configured ? (
                        <button
                          type="button"
                          onClick={() => handleResendMail(item.id)}
                          disabled={resendingId === item.id}
                          className="min-h-9 inline-flex items-center px-3 text-xs rounded-lg border border-border hover:bg-muted-light/60 disabled:opacity-60"
                        >
                          {resendingId === item.id ? "Sende …" : "E-Mail erneut senden"}
                        </button>
                      ) : null}
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
                      if (key.startsWith("_")) return null;
                      if (isPhotoField(key, value)) return null;

                      return (
                        <div key={key} className={key === "Nachricht" || key === "Beschreibung" ? "sm:col-span-2" : undefined}>
                          <dt className="text-xs uppercase tracking-wide text-muted">
                            {formatPayloadKey(key)}
                          </dt>
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
