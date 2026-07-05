"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FormField } from "@/components/forms/FormFields";
import { patenschaftBank } from "@/data/patenschaftBank";
import {
  buildPatenEmailPlatzhalter,
  fillPatenEmailTemplate,
  getPatenEmailVorlage,
} from "@/data/patenEmailVorlagen";
import { patenschaftsStufen } from "@/data/site";
import { formatFormDateDe } from "@/lib/relativeTime";
import {
  buildMonatlicherVerwendungszweck,
  enrichPatenschaftMonatLive,
  PATENSCHAFT_FAELLIGKEIT_TAG,
  PATENSCHAFT_MONATE_VORAUS,
  toLocalDateString,
  toLocalPeriod,
  type PatenschaftMonatsStatus,
} from "@/lib/patenschaftPayment";
import type { PatenschaftPate, PatenschaftZahlung } from "@/types/patenschaftPortal";

type ZahlungenData = {
  accessCode: string;
  monatlicherBeitrag: number;
  verwendungszweck: string;
  monatlicherVerwendungszweck: string;
  currentPeriod: string;
  faelligAm: string;
  heute: string;
  zahlungen: PatenschaftZahlung[];
  monate: PatenschaftMonatsStatus[];
};

type PatenZahlungenPanelProps = {
  pateId: string;
  pate: PatenschaftPate;
  waschbaerName: string;
  recipientEmail?: string;
  mailConfigured: boolean;
  hasMultiplePatentiere?: boolean;
  onStatus?: (message: string | null) => void;
  onError?: (message: string | null) => void;
};

function countdownBadge(status: PatenschaftMonatsStatus["status"]) {
  switch (status) {
    case "bezahlt":
      return "bg-green-100 text-green-900 border-green-200";
    case "offen":
      return "bg-amber-100 text-amber-900 border-amber-200";
    case "überfällig":
      return "bg-red-100 text-red-900 border-red-200";
    default:
      return "bg-sky-100 text-sky-900 border-sky-200";
  }
}

function statusBadge(status: PatenschaftMonatsStatus["status"]) {
  switch (status) {
    case "bezahlt":
      return "bg-green-100 text-green-900 border-green-200";
    case "offen":
      return "bg-amber-100 text-amber-900 border-amber-200";
    case "überfällig":
      return "bg-red-100 text-red-900 border-red-200";
    default:
      return "bg-muted-light/60 text-muted border-border";
  }
}

function statusLabel(status: PatenschaftMonatsStatus["status"]) {
  switch (status) {
    case "bezahlt":
      return "Bezahlt";
    case "offen":
      return "Offen";
    case "überfällig":
      return "Überfällig";
    default:
      return "Zukünftig";
  }
}

function copyText(value: string, onDone: (message: string) => void) {
  navigator.clipboard.writeText(value);
  onDone("In Zwischenablage kopiert.");
}

export function PatenZahlungenPanel({
  pateId,
  pate,
  waschbaerName,
  recipientEmail,
  mailConfigured,
  hasMultiplePatentiere = false,
  onStatus,
  onError,
}: PatenZahlungenPanelProps) {
  const printRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<ZahlungenData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sending, setSending] = useState(false);
  const [period, setPeriod] = useState(toLocalPeriod());
  const [amount, setAmount] = useState("");
  const [paidAt, setPaidAt] = useState(toLocalDateString());
  const [note, setNote] = useState("");
  const [to, setTo] = useState(recipientEmail ?? pate.email ?? "");
  const [mailSubject, setMailSubject] = useState("");
  const [mailBody, setMailBody] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [now, setNow] = useState(() => new Date());
  const [markingPeriod, setMarkingPeriod] = useState<string | null>(null);

  const loadZahlungen = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/paten/${encodeURIComponent(pateId)}/zahlungen`, {
        credentials: "same-origin",
      });
      const json = (await res.json()) as ZahlungenData & { error?: string };
      if (!res.ok) {
        onError?.(json.error ?? "Zahlungsdaten konnten nicht geladen werden.");
        return;
      }
      setData(json);
      setPeriod(json.currentPeriod);
      const currentMonat = json.monate.find((item) => item.period === json.currentPeriod);
      setAmount(String(currentMonat?.expectedAmount ?? json.monatlicherBeitrag));
    } finally {
      setLoading(false);
    }
  }, [pateId, onError]);

  useEffect(() => {
    void loadZahlungen();
  }, [loadZahlungen]);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setTo(recipientEmail ?? pate.email ?? "");
  }, [recipientEmail, pate.email]);

  useEffect(() => {
    if (!data) return;
    const selected = data.monate.find((item) => item.period === period);
    if (selected) {
      setAmount(String(selected.expectedAmount));
    } else if (period >= data.currentPeriod) {
      setAmount(String(data.monatlicherBeitrag));
    }
  }, [period, data]);

  const stufe = patenschaftsStufen.find((item) => item.id === pate.stufeId);

  const liveMonate = useMemo(() => {
    if (!data) return [];
    return data.monate.map((monat) => enrichPatenschaftMonatLive(monat, now));
  }, [data, now]);

  const currentMonat = liveMonate.find((item) => item.period === period);
  const aktuellerMonat = data
    ? liveMonate.find((item) => item.period === data.currentPeriod)
    : undefined;
  const reminderAmount = currentMonat?.expectedAmount ?? data?.monatlicherBeitrag ?? 0;

  const reminderPlatzhalter = useMemo(() => {
    if (!data) return null;
    const monatLabel = new Date(`${period}-01T12:00:00`).toLocaleDateString("de-DE", {
      month: "long",
      year: "numeric",
    });
    return buildPatenEmailPlatzhalter({
      pateName: pate.name,
      waschbaerName,
      stufeName: stufe?.name ?? pate.stufeId,
      stufePreis: reminderAmount,
      accessCode: pate.accessCode,
      urkundenNr: pate.urkundenNr,
      siteOrigin: typeof window !== "undefined" ? window.location.origin : "",
      monatLabel,
      monatlicherVerwendungszweck: buildMonatlicherVerwendungszweck(pate.accessCode, period),
      period,
    });
  }, [data, pate, waschbaerName, stufe, period, reminderAmount]);

  useEffect(() => {
    if (!reminderPlatzhalter) return;
    const vorlage = getPatenEmailVorlage("monatliche-zahlungserinnerung");
    setMailSubject(fillPatenEmailTemplate(vorlage.subject, reminderPlatzhalter));
    setMailBody(fillPatenEmailTemplate(vorlage.body, reminderPlatzhalter));
  }, [reminderPlatzhalter]);

  function resetReminderTemplate() {
    if (!reminderPlatzhalter) return;
    const vorlage = getPatenEmailVorlage("monatliche-zahlungserinnerung");
    setMailSubject(fillPatenEmailTemplate(vorlage.subject, reminderPlatzhalter));
    setMailBody(fillPatenEmailTemplate(vorlage.body, reminderPlatzhalter));
    onStatus?.("E-Mail-Vorlage wurde zurückgesetzt.");
  }

  async function recordPayment(input: {
    period: string;
    amount: number;
    paidAt: string;
    note?: string;
    successMessage?: string;
  }) {
    onError?.(null);

    const res = await fetch(`/api/admin/paten/${encodeURIComponent(pateId)}/zahlungen`, {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        period: input.period,
        amount: input.amount,
        paidAt: input.paidAt,
        note: input.note,
      }),
    });
    const json = (await res.json()) as { error?: string };
    if (!res.ok) {
      onError?.(json.error ?? "Zahlung konnte nicht erfasst werden.");
      return false;
    }
    onStatus?.(input.successMessage ?? "Zahlung erfasst.");
    await loadZahlungen();
    return true;
  }

  async function handleRecordPayment(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);

    try {
      await recordPayment({
        period,
        amount: Number(amount.replace(",", ".")),
        paidAt,
        note: note.trim() || undefined,
      });
      setNote("");
    } finally {
      setSaving(false);
    }
  }

  async function handleQuickMarkPaid(monat: PatenschaftMonatsStatus) {
    const amountLabel = monat.expectedAmount.toFixed(2).replace(".", ",");
    if (
      !confirm(
        `Beitrag für ${monat.label} (${amountLabel} €) als erhalten markieren?\n\nDas System speichert den Eingang mit heutigem Datum.`
      )
    ) {
      return;
    }

    setMarkingPeriod(monat.period);
    try {
      await recordPayment({
        period: monat.period,
        amount: monat.expectedAmount,
        paidAt: toLocalDateString(),
        note: "Schnellerfassung: Beitrag erhalten",
        successMessage: `${monat.label}: Beitrag als erhalten markiert.`,
      });
    } finally {
      setMarkingPeriod(null);
    }
  }

  function canQuickMarkPaid(monat: PatenschaftMonatsStatus) {
    return monat.status === "offen" || monat.status === "überfällig";
  }

  async function handleDeletePayment(zahlungId: string) {
    if (!confirm("Erfassung für diesen Monat wirklich zurücksetzen? Der Beitrag gilt dann wieder als offen.")) return;

    const res = await fetch(
      `/api/admin/paten/${encodeURIComponent(pateId)}/zahlungen?zahlungId=${encodeURIComponent(zahlungId)}`,
      { method: "DELETE", credentials: "same-origin" }
    );
    const json = (await res.json()) as { error?: string };
    if (!res.ok) {
      onError?.(json.error ?? "Zahlung konnte nicht gelöscht werden.");
      return;
    }
    onStatus?.("Zahlung gelöscht.");
    await loadZahlungen();
  }

  async function handleSendReminder() {
    if (!mailConfigured) {
      onError?.("E-Mail-Versand ist noch nicht eingerichtet.");
      return;
    }
    if (!to.trim()) {
      onError?.("Bitte eine E-Mail-Adresse angeben.");
      return;
    }
    if (!data) return;
    if (!mailSubject.trim() || !mailBody.trim()) {
      onError?.("Bitte Betreff und E-Mail-Text ausfüllen.");
      return;
    }

    setSending(true);
    onError?.(null);

    try {
      const res = await fetch(`/api/admin/paten/${encodeURIComponent(pateId)}/send-mail`, {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: to.trim(),
          subject: mailSubject.trim(),
          text: mailBody.trim(),
          attachments: [],
        }),
      });
      const json = (await res.json()) as { error?: string; sentTo?: string };
      if (!res.ok) {
        onError?.(json.error ?? "Erinnerung konnte nicht gesendet werden.");
        return;
      }
      onStatus?.(`Monatliche Zahlungsanweisung wurde an ${json.sentTo ?? to} gesendet.`);
    } catch {
      onError?.("Erinnerung konnte nicht gesendet werden.");
    } finally {
      setSending(false);
    }
  }

  const periodVerwendungszweck = data
    ? buildMonatlicherVerwendungszweck(data.accessCode, period)
    : "";
  const reminderMonatLabel = new Date(`${period}-01T12:00:00`).toLocaleDateString("de-DE", {
    month: "long",
    year: "numeric",
  });

  return (
    <section className="rounded-2xl border border-border bg-background/90 p-5 sm:p-6 shadow-soft space-y-6">
      <div>
        <h2 className="font-medium text-forest">Zahlungen & Banküberweisung</h2>
        <p className="mt-1 text-sm text-muted">
          Monatlicher Beitrag per Banküberweisung für{" "}
          <strong className="font-medium text-forest">{pate.name}</strong>
          {hasMultiplePatentiere
            ? " – gilt für alle Patentiere mit diesem Zugangscode."
            : ""}{" "}
          Heute {data?.heute ?? "…"}, fällig ab dem {PATENSCHAFT_FAELLIGKEIT_TAG}. jedes Monats
          (Erinnerung wird am {PATENSCHAFT_FAELLIGKEIT_TAG}. versendet). Countdown aktualisiert
          sich automatisch.
          Die Übersicht enthält automatisch die nächsten {PATENSCHAFT_MONATE_VORAUS} Monate.
        </p>
      </div>

      {loading ? (
        <p className="text-sm text-muted">Lade Zahlungsdaten …</p>
      ) : data ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-border bg-muted-light/20 p-4 space-y-2">
              <p className="text-xs uppercase tracking-wide text-muted">Bankverbindung</p>
              <dl className="text-sm space-y-1">
                <div>
                  <dt className="text-muted">Kontoinhaber</dt>
                  <dd className="text-forest">{patenschaftBank.accountHolder}</dd>
                </div>
                <div>
                  <dt className="text-muted">IBAN</dt>
                  <dd className="font-mono text-forest">{patenschaftBank.iban}</dd>
                </div>
                <div>
                  <dt className="text-muted">BIC</dt>
                  <dd className="font-mono text-forest">{patenschaftBank.bic}</dd>
                </div>
                <div>
                  <dt className="text-muted">Bank</dt>
                  <dd className="text-forest">{patenschaftBank.bankName}</dd>
                </div>
              </dl>
            </div>

            <div className="rounded-xl border border-orange-200 bg-orange-50/60 p-4 space-y-3">
              <div>
                <p className="text-xs uppercase tracking-wide text-orange-900/70">
                  Monatlicher Beitrag
                </p>
                <p className="text-2xl font-medium text-orange-950">
                  {data.monatlicherBeitrag.toFixed(2).replace(".", ",")} €
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-orange-900/70">
                  Verwendungszweck (Dauer)
                </p>
                <p className="font-mono text-sm text-orange-950 break-all">{data.verwendungszweck}</p>
                <button
                  type="button"
                  onClick={() => copyText(data.verwendungszweck, (msg) => onStatus?.(msg))}
                  className="mt-2 min-h-8 px-3 text-xs rounded-lg border border-orange-300 bg-white hover:bg-orange-50"
                >
                  Kopieren
                </button>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-orange-900/70">
                  Verwendungszweck ({period})
                </p>
                <p className="font-mono text-sm text-orange-950 break-all">
                  {periodVerwendungszweck}
                </p>
                <button
                  type="button"
                  onClick={() => copyText(periodVerwendungszweck, (msg) => onStatus?.(msg))}
                  className="mt-2 min-h-8 px-3 text-xs rounded-lg border border-orange-300 bg-white hover:bg-orange-50"
                >
                  Kopieren
                </button>
              </div>
            </div>
          </div>

          {aktuellerMonat ? (
            <div
              className={`rounded-xl border px-4 py-3 text-sm ${countdownBadge(aktuellerMonat.status)}`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-medium">
                    Aktueller Monat ({aktuellerMonat.label}): {aktuellerMonat.countdownLabel}
                  </p>
                  <p className="text-xs mt-1 opacity-90">
                    Fällig am {formatFormDateDe(aktuellerMonat.faelligAm)} ·{" "}
                    {aktuellerMonat.expectedAmount.toFixed(2).replace(".", ",")} € · Status:{" "}
                    {statusLabel(aktuellerMonat.status)}
                  </p>
                </div>
                {canQuickMarkPaid(aktuellerMonat) ? (
                  <button
                    type="button"
                    onClick={() => handleQuickMarkPaid(aktuellerMonat)}
                    disabled={markingPeriod === aktuellerMonat.period}
                    className="shrink-0 min-h-9 px-4 text-xs font-medium rounded-lg bg-green-700 text-white hover:bg-green-800 disabled:opacity-60 print:hidden"
                  >
                    {markingPeriod === aktuellerMonat.period
                      ? "Wird gespeichert …"
                      : "Beitrag erhalten"}
                  </button>
                ) : aktuellerMonat.status === "bezahlt" ? (
                  <span className="shrink-0 inline-flex min-h-9 items-center px-3 text-xs font-medium rounded-lg border border-green-300 bg-white/70 print:hidden">
                    ✓ Beglichen
                  </span>
                ) : null}
              </div>
            </div>
          ) : null}

          <div className="rounded-xl border border-border p-4 space-y-4">
            <div>
              <h3 className="text-sm font-medium text-forest">
                Monatliche Zahlungsanweisung senden
              </h3>
              <p className="text-xs text-muted mt-1">
                Süße Erinnerung per E-Mail – manuell am {PATENSCHAFT_FAELLIGKEIT_TAG}. jedes Monats
                auslösen. Der Beitrag ist ab dem {PATENSCHAFT_FAELLIGKEIT_TAG}. fällig.
              </p>
            </div>

            {!mailConfigured ? (
              <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
                E-Mail-Versand ist noch nicht eingerichtet.
              </p>
            ) : null}

            <FormField label="Empfänger" name="zahlung-mail-to" required>
              <input
                id="zahlung-mail-to"
                type="email"
                value={to}
                onChange={(event) => setTo(event.target.value)}
                className="w-full min-w-0 px-4 py-3 border border-border bg-background input-base focus:border-foreground focus:outline-none"
              />
            </FormField>

            <FormField
              label="Abrechnungsmonat für die Erinnerung"
              name="zahlung-reminder-period"
              hint="Verwendungszweck und Betrag in der E-Mail beziehen sich auf diesen Monat"
            >
              <input
                id="zahlung-reminder-period"
                type="month"
                value={period}
                onChange={(event) => setPeriod(event.target.value)}
                className="w-full min-w-0 px-4 py-3 border border-border bg-background input-base focus:border-foreground focus:outline-none"
              />
            </FormField>

            {currentMonat ? (
              <p
                className={`rounded-lg border px-3 py-2 text-sm ${countdownBadge(currentMonat.status)}`}
              >
                {currentMonat.label}: {currentMonat.countdownLabel} (fällig am{" "}
                {formatFormDateDe(currentMonat.faelligAm)})
              </p>
            ) : null}

            <div className="rounded-xl border border-border overflow-hidden">
              <button
                type="button"
                onClick={() => setPreviewOpen((open) => !open)}
                className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm font-medium text-forest hover:bg-muted-light/30"
                aria-expanded={previewOpen}
              >
                <span>E-Mail-Vorschau & Text bearbeiten</span>
                <span className="text-muted text-xs shrink-0">
                  {previewOpen ? "▲ einklappen" : "▼ aufklappen"}
                </span>
              </button>

              {previewOpen ? (
                <div className="border-t border-border p-4 space-y-4 bg-muted-light/10">
                  <p className="text-xs text-muted">
                    Vorlage für <strong className="text-forest">{reminderMonatLabel}</strong> ·{" "}
                    {reminderAmount.toFixed(2).replace(".", ",")} € · Verwendungszweck:{" "}
                    <span className="font-mono">{periodVerwendungszweck}</span>
                  </p>

                  <FormField label="Betreff" name="zahlung-mail-subject" required>
                    <input
                      id="zahlung-mail-subject"
                      type="text"
                      required
                      value={mailSubject}
                      onChange={(event) => setMailSubject(event.target.value)}
                      className="w-full min-w-0 px-4 py-3 border border-border bg-background input-base focus:border-foreground focus:outline-none"
                    />
                  </FormField>

                  <FormField label="E-Mail-Text" name="zahlung-mail-body" required>
                    <textarea
                      id="zahlung-mail-body"
                      required
                      rows={14}
                      value={mailBody}
                      onChange={(event) => setMailBody(event.target.value)}
                      className="w-full px-4 py-3 border border-border bg-background input-base focus:border-foreground focus:outline-none resize-y font-mono text-sm"
                    />
                  </FormField>

                  <button
                    type="button"
                    onClick={resetReminderTemplate}
                    className="min-h-9 px-3 text-xs rounded-lg border border-border hover:bg-muted-light/60"
                  >
                    Vorlage zurücksetzen
                  </button>
                </div>
              ) : null}
            </div>

            <button
              type="button"
              onClick={handleSendReminder}
              disabled={sending || !mailConfigured || !mailSubject.trim() || !mailBody.trim()}
              className="min-h-11 px-5 py-3 text-sm font-medium rounded-xl bg-orange-600 text-white hover:bg-orange-700 disabled:opacity-60"
            >
              {sending ? "Wird gesendet …" : "Monatliche Zahlungsanweisung senden"}
            </button>
          </div>

          <form onSubmit={handleRecordPayment} className="rounded-xl border border-border p-4 space-y-4">
            <div>
              <h3 className="text-sm font-medium text-forest">Zahlung erfassen (intern)</h3>
              <p className="text-xs text-muted mt-1">
                Schnell: In der Übersicht unten auf „Beitrag erhalten“ klicken – oder hier
                manuell mit abweichendem Betrag/Datum erfassen.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Abrechnungsmonat" name="zahlung-period" required>
                <input
                  id="zahlung-period"
                  type="month"
                  required
                  value={period}
                  onChange={(event) => setPeriod(event.target.value)}
                  className="w-full min-w-0 px-4 py-3 border border-border bg-background input-base focus:border-foreground focus:outline-none"
                />
              </FormField>
              <FormField label="Betrag (€)" name="zahlung-amount" required>
                <input
                  id="zahlung-amount"
                  type="text"
                  inputMode="decimal"
                  required
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}
                  className="w-full min-w-0 px-4 py-3 border border-border bg-background input-base focus:border-foreground focus:outline-none"
                />
              </FormField>
              <FormField label="Zahlungseingang" name="zahlung-paid-at" required>
                <input
                  id="zahlung-paid-at"
                  type="date"
                  required
                  value={paidAt}
                  onChange={(event) => setPaidAt(event.target.value)}
                  className="w-full min-w-0 px-4 py-3 border border-border bg-background input-base focus:border-foreground focus:outline-none"
                />
              </FormField>
              <FormField label="Notiz (optional)" name="zahlung-note">
                <input
                  id="zahlung-note"
                  type="text"
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                  className="w-full min-w-0 px-4 py-3 border border-border bg-background input-base focus:border-foreground focus:outline-none"
                />
              </FormField>
            </div>
            {currentMonat ? (
              <p className="text-xs text-muted">
                Soll für {currentMonat.label}: {currentMonat.expectedAmount.toFixed(2).replace(".", ",")} €
                · {currentMonat.countdownLabel} · Status: {statusLabel(currentMonat.status)}
              </p>
            ) : null}
            <button
              type="submit"
              disabled={saving}
              className="min-h-10 px-4 text-sm font-medium rounded-lg bg-foreground text-background hover:bg-accent disabled:opacity-60"
            >
              {saving ? "Speichern …" : "Zahlung speichern"}
            </button>
          </form>

          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-sm font-medium text-forest">Zahlungsübersicht (intern)</h3>
              <button
                type="button"
                onClick={() => window.print()}
                className="min-h-9 px-3 text-xs rounded-lg border border-border hover:bg-muted-light/60 print:hidden"
              >
                Übersicht drucken
              </button>
            </div>

            <div ref={printRef} className="paten-zahlungen-print">
              <div className="hidden print:block mb-4">
                <h1 className="text-lg font-medium">Zahlungsübersicht – {pate.name}</h1>
                <p className="text-sm text-muted">
                  Zugangscode: {data.accessCode} · Erstellt am {formatFormDateDe(toLocalDateString())}
                </p>
              </div>

              {liveMonate.length === 0 ? (
                <p className="text-sm text-muted">Noch keine Abrechnungsmonate.</p>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-border">
                  <table className="w-full text-sm">
                    <thead className="bg-muted-light/40 text-left">
                      <tr>
                        <th className="px-3 py-2 font-medium">Monat</th>
                        <th className="px-3 py-2 font-medium">Fällig am</th>
                        <th className="px-3 py-2 font-medium">Countdown</th>
                        <th className="px-3 py-2 font-medium">Soll</th>
                        <th className="px-3 py-2 font-medium">Ist</th>
                        <th className="px-3 py-2 font-medium">Status</th>
                        <th className="px-3 py-2 font-medium print:hidden">Aktion</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {liveMonate.map((monat) => (
                        <tr key={monat.period}>
                          <td className="px-3 py-2">{monat.label}</td>
                          <td className="px-3 py-2">{formatFormDateDe(monat.faelligAm)}</td>
                          <td className="px-3 py-2">
                            <span
                              className={`inline-flex px-2 py-0.5 rounded-full text-xs border ${countdownBadge(monat.status)}`}
                            >
                              {monat.countdownLabel}
                            </span>
                          </td>
                          <td className="px-3 py-2">
                            {monat.expectedAmount.toFixed(2).replace(".", ",")} €
                          </td>
                          <td className="px-3 py-2">
                            {monat.paidAmount > 0
                              ? `${monat.paidAmount.toFixed(2).replace(".", ",")} €`
                              : "–"}
                          </td>
                          <td className="px-3 py-2">
                            <span
                              className={`inline-flex px-2 py-0.5 rounded-full text-xs border ${statusBadge(monat.status)}`}
                            >
                              {statusLabel(monat.status)}
                            </span>
                          </td>
                          <td className="px-3 py-2 print:hidden">
                            <div className="flex flex-wrap items-center gap-2">
                              {canQuickMarkPaid(monat) ? (
                                <button
                                  type="button"
                                  onClick={() => handleQuickMarkPaid(monat)}
                                  disabled={markingPeriod === monat.period}
                                  className="text-xs font-medium text-green-800 hover:underline disabled:opacity-60"
                                >
                                  {markingPeriod === monat.period
                                    ? "Speichern …"
                                    : "Beitrag erhalten"}
                                </button>
                              ) : monat.status === "bezahlt" ? (
                                <span className="text-xs text-green-800">Beglichen</span>
                              ) : null}
                              {monat.zahlung ? (
                                <button
                                  type="button"
                                  onClick={() => handleDeletePayment(monat.zahlung!.id)}
                                  className="text-xs text-red-700 hover:underline"
                                >
                                  Zurücksetzen
                                </button>
                              ) : null}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {data.zahlungen.length > 0 ? (
                <p className="text-xs text-muted mt-3">
                  Gesamt erhalten:{" "}
                  {data.zahlungen
                    .reduce((sum, z) => sum + z.amount, 0)
                    .toFixed(2)
                    .replace(".", ",")}{" "}
                  € ({data.zahlungen.length} Zahlung/en)
                </p>
              ) : null}
            </div>
          </div>
        </>
      ) : null}
    </section>
  );
}
