"use client";

import { useEffect, useMemo, useState } from "react";
import { formatFormDateDe } from "@/lib/relativeTime";
import {
  getPatenschaftCountdown,
  getPatenschaftPeriodStatus,
  type PatenschaftStatistik,
} from "@/lib/patenschaftPayment";

export function AdminPatenStatistik() {
  const [statistik, setStatistik] = useState<PatenschaftStatistik | null>(null);
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/admin/paten/statistik", { credentials: "same-origin" });
        const json = (await res.json()) as { statistik?: PatenschaftStatistik };
        setStatistik(json.statistik ?? null);
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(timer);
  }, []);

  const liveCountdown = useMemo(() => {
    if (!statistik) return null;
    const { aktuellerMonat } = statistik;
    const status = getPatenschaftPeriodStatus({
      period: aktuellerMonat.period,
      paidAmount: aktuellerMonat.erhalten,
      expectedAmount: aktuellerMonat.erwartet,
      now,
    });
    return {
      status,
      ...getPatenschaftCountdown({
        faelligAm: aktuellerMonat.faelligAm,
        status,
        now,
      }),
    };
  }, [statistik, now]);

  function countdownBannerClass(status: NonNullable<typeof liveCountdown>["status"]) {
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

  if (loading) {
    return (
      <section className="rounded-2xl border border-border bg-background/90 p-5 shadow-soft">
        <p className="text-sm text-muted">Lade Beitragsstatistik …</p>
      </section>
    );
  }

  if (!statistik) return null;

  return (
    <section className="rounded-2xl border border-border bg-background/90 p-5 sm:p-6 shadow-soft space-y-5">
      <div>
        <h2 className="font-medium text-forest">Beitragsstatistik</h2>
        <p className="text-sm text-muted mt-1">
          Übersicht aller aktiven Patenschaften und monatlicher Beiträge –{" "}
          {statistik.aktuellerMonat.label}
          {liveCountdown ? ` · ${liveCountdown.countdownLabel}` : ""}
        </p>
      </div>

      {liveCountdown ? (
        <div
          className={`rounded-xl border px-4 py-3 text-sm ${countdownBannerClass(liveCountdown.status)}`}
        >
          <p className="font-medium">
            {statistik.aktuellerMonat.label}: {liveCountdown.countdownLabel}
          </p>
          <p className="text-xs mt-1 opacity-90">
            Fällig am {formatFormDateDe(statistik.aktuellerMonat.faelligAm)} ·{" "}
            {statistik.aktuellerMonat.offenCount} offen ·{" "}
            {statistik.aktuellerMonat.ueberfaelligCount} überfällig · Countdown aktualisiert sich
            automatisch
          </p>
        </div>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Aktive Patenschaften"
          value={String(statistik.activePatenschaften)}
          hint={`${statistik.activePatenPersonen} Paten/Patroninnen`}
        />
        <StatCard
          label="Monatlicher Soll-Umsatz"
          value={`${statistik.monatlicherSollUmsatz.toFixed(2).replace(".", ",")} €`}
          hint="Summe aller aktiven Stufen"
        />
        <StatCard
          label={`Eingegangen (${statistik.aktuellerMonat.label})`}
          value={`${statistik.aktuellerMonat.erhalten.toFixed(2).replace(".", ",")} €`}
          hint={
            liveCountdown
              ? `${liveCountdown.countdownLabel} · ${statistik.aktuellerMonat.bezahltCount} vollständig · ${statistik.aktuellerMonat.offenCount} offen · ${statistik.aktuellerMonat.ueberfaelligCount} überfällig`
              : `${statistik.aktuellerMonat.bezahltCount} vollständig · ${statistik.aktuellerMonat.offenCount} offen · ${statistik.aktuellerMonat.ueberfaelligCount} überfällig`
          }
        />
        <StatCard
          label="Gesamt erhalten"
          value={`${statistik.gesamtErhalten.toFixed(2).replace(".", ",")} €`}
          hint={`${statistik.zahlungenAnzahl} erfasste Zahlungen`}
        />
      </div>

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted-light/40 text-left">
            <tr>
              <th className="px-3 py-2 font-medium">Stufe</th>
              <th className="px-3 py-2 font-medium">Patenschaften</th>
              <th className="px-3 py-2 font-medium">Monatlich</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {statistik.nachStufe.map((row) => (
              <tr key={row.stufeId}>
                <td className="px-3 py-2">{row.name}</td>
                <td className="px-3 py-2">{row.count}</td>
                <td className="px-3 py-2">{row.monatlich.toFixed(2).replace(".", ",")} €</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-muted-light/20 p-4">
      <p className="text-xs uppercase tracking-wide text-muted">{label}</p>
      <p className="text-xl font-medium text-forest mt-1">{value}</p>
      <p className="text-xs text-muted mt-1">{hint}</p>
    </div>
  );
}
