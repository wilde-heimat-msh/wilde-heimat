const rtf = new Intl.RelativeTimeFormat("de", { numeric: "always" });

const BERLIN_TZ = "Europe/Berlin";

const dateFormatter = new Intl.DateTimeFormat("de-DE", {
  timeZone: BERLIN_TZ,
  day: "numeric",
  month: "long",
  year: "numeric",
});

const dateTimeFormatter = new Intl.DateTimeFormat("de-DE", {
  timeZone: BERLIN_TZ,
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

const monthFormatter = new Intl.DateTimeFormat("de-DE", {
  timeZone: BERLIN_TZ,
  month: "long",
  year: "numeric",
});

type DatePrecision = "day" | "month";

function toDate(value: string): Date {
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return new Date(`${value}T12:00:00`);
  }
  return new Date(value);
}

function isValidDate(date: Date): boolean {
  return !Number.isNaN(date.getTime());
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
  if (!isValidDate(date)) return dateInput;
  return precision === "month" ? monthFormatter.format(date) : dateFormatter.format(date);
}

/** Datum + Uhrzeit für Deutschland (Europe/Berlin), z. B. „30.06.2026, 14:35 Uhr“ */
export function formatDateTimeDe(dateInput: string): string {
  const date = toDate(dateInput);
  if (!isValidDate(date)) return dateInput;
  return `${dateTimeFormatter.format(date)} Uhr`;
}

/** Formular-Datum (yyyy-mm-dd) → 30.06.2026 */
export function formatFormDateDe(dateInput: string): string {
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateInput)) {
    const [year, month, day] = dateInput.split("-");
    return `${day}.${month}.${year}`;
  }
  return formatAbsoluteDateDe(dateInput);
}
