"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { formatDateTimeDe } from "@/lib/relativeTime";
import { toLocalPeriod } from "@/lib/patenschaftPayment";
import type { PatenschaftErinnerungRecipient, PatenschaftErinnerungRunResult } from "@/lib/patenschaftErinnerungService";

type Overview = {
  period: string;
  periodLabel: string;
  isReminderDay: boolean;
  mailConfigured: boolean;
  bccCopyTo: string;
  recipients: PatenschaftErinnerungRecipient[];
  summary: {
    total: number;
    sent: number;
    failed: number;
    skipped: number;
    pending: number;
    noEmail: number;
    paid: number;
  };
};

function reminderBadge(status: PatenschaftErinnerungRecipient["reminderStatus"]) {
  switch (status) {
    case "sent":
      return "bg-green-100 text-green-900 border-green-200";
    case "failed":
      return "bg-red-100 text-red-900 border-red-200";
    case "pending":
      return "bg-amber-100 text-amber-900 border-amber-200";
    case "no_email":
      return "bg-orange-100 text-orange-900 border-orange-200";
    default:
      return "bg-muted-light/60 text-muted border-border";
  }
}

function reminderLabel(status: PatenschaftErinnerungRecipient["reminderStatus"]) {
  switch (status) {
    case "sent":
      return "Versendet";
    case "failed":
      return "Fehlgeschlagen";
    case "pending":
      return "Ausstehend";
    case "no_email":
      return "Keine E-Mail";
    case "skipped":
      return "Übersprungen";
    default:
      return status;
  }
}

export function AdminPatenZahlungserinnerungen() {
  const [period, setPeriod] = useState(toLocalPeriod());
  const [overview, setOverview] = useState<Overview | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [sendingPateId, setSendingPateId] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadOverview = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/admin/paten/zahlungserinnerungen?period=${encodeURIComponent(period)}`,
        { credentials: "same-origin" }
      );
      const json = (await res.json()) as { overview?: Overview; error?: string };
      if (!res.ok) {
        setError(json.error ?? "Übersicht konnte nicht geladen werden.");
        setOverview(null);
        return;
      }
      setOverview(json.overview ?? null);
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => {
    void loadOverview();
  }, [loadOverview]);

  async function sendReminders(input: { pateId?: string; force?: boolean }) {
    if (input.pateId) setSendingPateId(input.pateId);
    else setSending(true);
    setError(null);
    setStatus(null);

    try {
      const res = await fetch("/api/admin/paten/zahlungserinnerungen", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          period,
          pateId: input.pateId,
          force: input.force === true,
          onlyFailedOrPending: !input.force,
        }),
      });
      const json = (await res.json()) as {
        result?: PatenschaftErinnerungRunResult;
        error?: string;
      };

      if (!res.ok) {
        setError(json.error ?? "Versand fehlgeschlagen.");
        return;
      }

      const result = json.result;
      if (result?.run === false) {
        setStatus(result.reason);
      } else if (result?.run === true) {
        setStatus(
          `Versand abgeschlossen: ${result.sent} erfolgreich, ${result.failed} fehlgeschlagen, ${result.skipped} übersprungen.`
        );
      }
      await loadOverview();
    } finally {
      setSending(false);
      setSendingPateId(null);
    }
  }

  const needsAction =
    overview &&
    overview.recipients.some(
      (item) => item.reminderStatus === "failed" || item.reminderStatus === "pending"
    );

  return (
    <section className="rounded-2xl border border-border bg-background/90 p-5 sm:p-6 shadow-soft space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-medium text-forest">Automatische Zahlungserinnerungen</h2>
          <p className="text-sm text-muted mt-1">
            Am individuellen Zahlungsziel-Tag jedes Paten (Standard: 5.) werden Erinnerungen
            automatisch versendet (täglicher Cron). Eine Kopie jeder Paten-Mail geht per BCC an{" "}
            <strong className="font-medium text-forest">
              {overview?.bccCopyTo ?? "kontakt@wilde-heimat-msh.de"}
            </strong>
            .
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <label className="text-xs text-muted" htmlFor="erinnerung-period">
            Monat
          </label>
          <input
            id="erinnerung-period"
            type="month"
            value={period}
            onChange={(event) => setPeriod(event.target.value)}
            className="min-h-9 px-3 text-sm border border-border rounded-lg bg-background"
          />
        </div>
      </div>

      {!overview?.mailConfigured ? (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
          E-Mail-Versand ist noch nicht konfiguriert – automatische Erinnerungen können nicht
          versendet werden.
        </p>
      ) : null}

      {overview ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <SummaryCard label="Paten gesamt" value={String(overview.summary.total)} />
          <SummaryCard label="Versendet" value={String(overview.summary.sent)} tone="green" />
          <SummaryCard label="Ausstehend" value={String(overview.summary.pending)} tone="amber" />
          <SummaryCard label="Fehlgeschlagen" value={String(overview.summary.failed)} tone="red" />
          <SummaryCard label="Ohne E-Mail" value={String(overview.summary.noEmail)} />
        </div>
      ) : null}

      {status ? (
        <p className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-900">
          {status}
        </p>
      ) : null}
      {error ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-900">
          {error}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => sendReminders({})}
          disabled={sending || loading || !overview?.mailConfigured || !needsAction}
          className="min-h-10 px-4 text-sm font-medium rounded-lg bg-orange-600 text-white hover:bg-orange-700 disabled:opacity-60"
        >
          {sending ? "Sende …" : "Alle ausstehenden / fehlgeschlagenen senden"}
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-muted">Lade Versandstatus …</p>
      ) : overview && overview.recipients.length === 0 ? (
        <p className="text-sm text-muted">Keine aktiven Patenschaften.</p>
      ) : overview ? (
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted-light/40 text-left">
              <tr>
                <th className="px-3 py-2 font-medium">Pate/Patin</th>
                <th className="px-3 py-2 font-medium">E-Mail</th>
                <th className="px-3 py-2 font-medium">Zahlungsziel</th>
                <th className="px-3 py-2 font-medium">Beitrag</th>
                <th className="px-3 py-2 font-medium">Zahlung</th>
                <th className="px-3 py-2 font-medium">Erinnerung</th>
                <th className="px-3 py-2 font-medium">Details</th>
                <th className="px-3 py-2 font-medium">Aktion</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {overview.recipients.map((recipient) => (
                <tr key={recipient.pateId}>
                  <td className="px-3 py-2">
                    <Link
                      href={`/admin/paten/${recipient.pateId}`}
                      className="text-forest hover:underline"
                    >
                      {recipient.name}
                    </Link>
                    <p className="text-xs text-muted">{recipient.waschbaerLabel}</p>
                  </td>
                  <td className="px-3 py-2">{recipient.email ?? "–"}</td>
                  <td className="px-3 py-2">{recipient.zahlungszielTag}.</td>
                  <td className="px-3 py-2">
                    {recipient.monthlyAmount.toFixed(2).replace(".", ",")} €
                  </td>
                  <td className="px-3 py-2 capitalize">{recipient.paymentStatus}</td>
                  <td className="px-3 py-2">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded-full text-xs border ${reminderBadge(recipient.reminderStatus)}`}
                    >
                      {reminderLabel(recipient.reminderStatus)}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-xs text-muted max-w-xs">
                    {recipient.lastErinnerung?.sentAt
                      ? `${recipient.lastErinnerung.trigger === "auto" ? "Auto" : "Manuell"} · ${formatDateTimeDe(recipient.lastErinnerung.sentAt)}`
                      : recipient.skipReason ?? "–"}
                    {recipient.lastErinnerung?.errorMessage ? (
                      <span className="block text-red-700 mt-1">
                        {recipient.lastErinnerung.errorMessage}
                      </span>
                    ) : null}
                  </td>
                  <td className="px-3 py-2">
                    {recipient.reminderStatus === "no_email" ? (
                      <span className="text-xs text-muted">E-Mail in Kartei pflegen</span>
                    ) : recipient.paymentStatus === "bezahlt" ? (
                      <span className="text-xs text-green-800">Bezahlt</span>
                    ) : recipient.reminderStatus === "sent" ? (
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Erinnerung an ${recipient.name} erneut senden?`)) {
                            void sendReminders({ pateId: recipient.pateId, force: true });
                          }
                        }}
                        disabled={sendingPateId === recipient.pateId || sending}
                        className="text-xs text-muted hover:underline disabled:opacity-60"
                      >
                        Erneut senden
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => sendReminders({ pateId: recipient.pateId })}
                        disabled={
                          sendingPateId === recipient.pateId ||
                          sending ||
                          !overview.mailConfigured
                        }
                        className="text-xs font-medium text-orange-800 hover:underline disabled:opacity-60"
                      >
                        {sendingPateId === recipient.pateId ? "Sende …" : "Jetzt senden"}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </section>
  );
}

function SummaryCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "green" | "amber" | "red";
}) {
  const toneClass =
    tone === "green"
      ? "border-green-200 bg-green-50/50"
      : tone === "amber"
        ? "border-amber-200 bg-amber-50/50"
        : tone === "red"
          ? "border-red-200 bg-red-50/50"
          : "border-border bg-muted-light/20";

  return (
    <div className={`rounded-xl border p-4 ${toneClass}`}>
      <p className="text-xs uppercase tracking-wide text-muted">{label}</p>
      <p className="text-xl font-medium text-forest mt-1">{value}</p>
    </div>
  );
}
