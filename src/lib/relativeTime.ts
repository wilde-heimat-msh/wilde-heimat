const rtf = new Intl.RelativeTimeFormat("de", { numeric: "always" });

const dateFormatter = new Intl.DateTimeFormat("de-DE", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

const monthFormatter = new Intl.DateTimeFormat("de-DE", {
  month: "long",
  year: "numeric",
});

type DatePrecision = "day" | "month";

function toDate(value: string): Date {
  return new Date(value.includes("T") ? value : `${value}T12:00:00`);
}

/** Relative Zeit auf Deutsch, z. B. „vor 3 Monaten“ */
export function formatRelativeTimeDe(
  dateInput: string,
  now: Date = new Date()
): string {
  const date = toDate(dateInput);
  const diffMs = date.getTime() - now.getTime();
  const diffSec = Math.round(diffMs / 1000);

  const divisions: { amount: number; unit: Intl.RelativeTimeFormatUnit }[] = [
    { amount: 60, unit: "second" },
    { amount: 60, unit: "minute" },
    { amount: 24, unit: "hour" },
    { amount: 7, unit: "day" },
    { amount: 4.34524, unit: "week" },
    { amount: 12, unit: "month" },
    { amount: Number.POSITIVE_INFINITY, unit: "year" },
  ];

  let duration = diffSec;
  for (const division of divisions) {
    if (Math.abs(duration) < division.amount) {
      return rtf.format(Math.round(duration), division.unit);
    }
    duration /= division.amount;
  }

  return rtf.format(0, "day");
}

/** Absolutes Datum für `<time>` und Tooltip */
export function formatAbsoluteDateDe(
  dateInput: string,
  precision: DatePrecision = "day"
): string {
  const date = toDate(dateInput);
  return precision === "month" ? monthFormatter.format(date) : dateFormatter.format(date);
}
