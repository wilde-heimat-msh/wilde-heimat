"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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

  async function handleRecordPayment(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    onError?.(null);

    try {
      const res = await fetch(`/api/admin/paten/${encodeURIComponent(pateId)}/zahlungen`, {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          period,
          amount: Number(amount.replace(",", ".")),
          paidAt,
          note: note.trim() || undefined,
        }),
      });
      const json = (await res.json()) as { error?: string };
      if (!res.ok) {
        onError?.(json.error ?? "Zahlung konnte nicht erfasst werden.");
        return;
      }
      onStatus?.("Zahlung erfasst.");
      setNote("");
      await loadZahlungen();
    } finally {
      setSaving(false);
    }
  }

  async function handleDeletePayment(zahlungId: string) {
    if (!confirm("Diese Zahlung wirklich löschen?")) return;

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

    setSending(true);
    onError?.(null);

    const stufe = patenschaftsStufen.find((item) => item.id === pate.stufeId);
    const monatLabel = new Date(`${period}-01T12:00:00`).toLocaleDateString("de-DE", {
      month: "long",
      year: "numeric",
    });
    const monatlicherVerwendungszweck = buildMonatlicherVerwendungszweck(
      pate.accessCode,
      period
    );
    const platzhalter = buildPatenEmailPlatzhalter({
      pateName: pate.name,
      waschbaerName,
      stufeName: stufe?.name ?? pate.stufeId,
      stufePreis: data.monatlicherBeitrag,
      accessCode: pate.accessCode,
      urkundenNr: pate.urkundenNr,
      siteOrigin: window.location.origin,
      monatLabel,
      monatlicherVerwendungszweck,
      period,
    });

    const vorlage = getPatenEmailVorlage("monatliche-zahlungserinnerung");
    const subject = fillPatenEmailTemplate(vorlage.subject, platzhalter);
    const text = fillPatenEmailTemplate(vorlage.body, platzhalter);

    try {
      const res = await fetch(`/api/admin/paten/${encodeURIComponent(pateId)}/send-mail`, {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: to.trim(),
          subject,
          text,
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

  const currentMonat = data?.monate.find((item) => item.period === period);
  const periodVerwendungszweck = data
    ? buildMonatlicherVerwendungszweck(data.accessCode, period)
    : "";

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
          Heute {data?.heute ?? "…"}, fällig jeweils am {PATENSCHAFT_FAELLIGKEIT_TAG}. des Monats.
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

          <div className="rounded-xl border border-border p-4 space-y-4">
            <div>
              <h3 className="text-sm font-medium text-forest">
                Monatliche Zahlungsanweisung senden
              </h3>
              <p className="text-xs text-muted mt-1">
                Süße Erinnerung per E-Mail – manuell jeden Monat auslösen.
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

            <button
              type="button"
              onClick={handleSendReminder}
              disabled={sending || !mailConfigured}
              className="min-h-11 px-5 py-3 text-sm font-medium rounded-xl bg-orange-600 text-white hover:bg-orange-700 disabled:opacity-60"
            >
              {sending ? "Wird gesendet …" : "Monatliche Zahlungsanweisung senden"}
            </button>
          </div>

          <form onSubmit={handleRecordPayment} className="rounded-xl border border-border p-4 space-y-4">
            <h3 className="text-sm font-medium text-forest">Zahlung erfassen (intern)</h3>
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
                · Fällig am {formatFormDateDe(currentMonat.faelligAm)} · Status:{" "}
                {statusLabel(currentMonat.status)}
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

              {data.monate.length === 0 ? (
                <p className="text-sm text-muted">Noch keine Abrechnungsmonate.</p>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-border">
                  <table className="w-full text-sm">
                    <thead className="bg-muted-light/40 text-left">
                      <tr>
                        <th className="px-3 py-2 font-medium">Monat</th>
                        <th className="px-3 py-2 font-medium">Fällig am</th>
                        <th className="px-3 py-2 font-medium">Soll</th>
                        <th className="px-3 py-2 font-medium">Ist</th>
                        <th className="px-3 py-2 font-medium">Status</th>
                        <th className="px-3 py-2 font-medium print:hidden">Aktion</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {data.monate.map((monat) => (
                        <tr key={monat.period}>
                          <td className="px-3 py-2">{monat.label}</td>
                          <td className="px-3 py-2">{formatFormDateDe(monat.faelligAm)}</td>
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
                            {monat.zahlung ? (
                              <button
                                type="button"
                                onClick={() => handleDeletePayment(monat.zahlung!.id)}
                                className="text-xs text-red-700 hover:underline"
                              >
                                Löschen
                              </button>
                            ) : null}
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
