"use client";

import { useEffect, useState } from "react";
import { formatAbsoluteDateDe, formatRelativeTimeDe } from "@/lib/relativeTime";

type RelativeTimeProps = {
  date: string;
  /** Nur Monat/Jahr anzeigen (für ungenaue Update-Daten) */
  precision?: "day" | "month";
  className?: string;
};

/** Aktualisiert relative Zeitangaben automatisch (stündlich). */
export function RelativeTime({
  date,
  precision = "day",
  className = "",
}: RelativeTimeProps) {
  const [label, setLabel] = useState(() => formatRelativeTimeDe(date));

  useEffect(() => {
    const update = () => setLabel(formatRelativeTimeDe(date));
    update();

    const interval = window.setInterval(update, 60 * 60 * 1000);
    return () => window.clearInterval(interval);
  }, [date]);

  const absolute = formatAbsoluteDateDe(date, precision);

  return (
    <time dateTime={date} title={absolute} className={className}>
      {label}
    </time>
  );
}
