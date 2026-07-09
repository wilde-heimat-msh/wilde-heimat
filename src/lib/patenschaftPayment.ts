import { patenschaftBank } from "@/data/patenschaftBank";
import { patenschaftsStufen } from "@/data/site";
import { normalizeAccessCode } from "@/lib/patenschaftTier";
import type { PatenschaftPate, PatenschaftZahlung } from "@/types/patenschaftPortal";
import type { PatenschaftStufeId } from "@/data/patenschaften";

/** Standard-Zahlungsziel, wenn nichts individuell gesetzt ist */
export const PATENSCHAFT_FAELLIGKEIT_TAG = 5;

/** Max. Tag (Februar-sicher) */
export const PATENSCHAFT_ZAHLUNGSZIEL_MAX = 28;

/** Normalisiert den Zahlungsziel-Tag (1–28, Standard 5) */
export function normalizeZahlungszielTag(tag?: number | null): number {
  if (tag === undefined || tag === null || Number.isNaN(tag)) {
    return PATENSCHAFT_FAELLIGKEIT_TAG;
  }
  return Math.min(PATENSCHAFT_ZAHLUNGSZIEL_MAX, Math.max(1, Math.round(tag)));
}

/** Zahlungsziel für eine Person (alle Patentiere mit gleichem Zugangscode) */
export function getPatenschaftZahlungszielTag(paten: PatenschaftPate[]): number {
  const sorted = [...paten].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );
  for (const pate of sorted) {
    if (pate.zahlungszielTag !== undefined) {
      return normalizeZahlungszielTag(pate.zahlungszielTag);
    }
  }
  return PATENSCHAFT_FAELLIGKEIT_TAG;
}

/** Anzahl kommender Monate in der Übersicht (ab aktuellem Monat) */
export const PATENSCHAFT_MONATE_VORAUS = 3;

const SEPA_REFERENCE_MAX = 140;

function sanitizeSepaReference(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[^\w\s+\-?:().,'/]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, SEPA_REFERENCE_MAX);
}

/** Dauerhafter Verwendungszweck pro Pate/Person (über access_code) */
export function buildPatenschaftVerwendungszweck(accessCode: string): string {
  const code = normalizeAccessCode(accessCode);
  return sanitizeSepaReference(`Patenschaft WH-${code}`);
}

/** Monatlicher Verwendungszweck inkl. Abrechnungsmonat */
export function buildMonatlicherVerwendungszweck(
  accessCode: string,
  period: string
): string {
  const [year, month] = period.split("-");
  return sanitizeSepaReference(
    `Patenschaft WH-${normalizeAccessCode(accessCode)} ${month}-${year}`
  );
}

export function getPatenschaftStufePreis(stufeId: PatenschaftStufeId): number {
  return patenschaftsStufen.find((item) => item.id === stufeId)?.preis ?? 0;
}

export function getMonthlyPatenschaftTotal(paten: PatenschaftPate[]): number {
  return paten
    .filter((pate) => pate.active)
    .reduce((sum, pate) => sum + getPatenschaftStufePreis(pate.stufeId), 0);
}

export function getPatenschaftStartDate(paten: PatenschaftPate[]): string | undefined {
  const dates = paten
    .map((pate) => pate.patenschaftStart ?? pate.createdAt.slice(0, 10))
    .sort();
  return dates[0];
}

export type PatenschaftMonatsStatus = {
  period: string;
  label: string;
  expectedAmount: number;
  paidAmount: number;
  status: "bezahlt" | "offen" | "überfällig" | "zukünftig";
  /** ISO-Datum YYYY-MM-DD – Fälligkeit in diesem Monat */
  faelligAm: string;
  /** Tag im Monat für dieses Zahlungsziel */
  zahlungszielTag: number;
  /** Positiv = Tage bis fällig, 0 = heute, negativ = Tage überfällig */
  daysUntilDue: number;
  /** Automatisch berechneter Countdown-Text */
  countdownLabel: string;
  zahlung?: PatenschaftZahlung;
};

/** Lokales Datum als YYYY-MM-DD (kein UTC-Shift) */
export function toLocalDateString(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/** Lokaler Abrechnungsmonat YYYY-MM */
export function toLocalPeriod(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

function parsePeriod(period: string): { year: number; month: number } {
  const [year, month] = period.split("-").map(Number);
  return { year, month };
}

/** Fälligkeitsdatum für einen Abrechnungsmonat */
export function getPatenschaftFaelligAm(
  period: string,
  zahlungszielTag: number = PATENSCHAFT_FAELLIGKEIT_TAG
): string {
  const { year, month } = parsePeriod(period);
  const normalizedTag = normalizeZahlungszielTag(zahlungszielTag);
  const lastDayOfMonth = new Date(year, month, 0).getDate();
  const day = Math.min(normalizedTag, lastDayOfMonth);
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

/** Fester Monatsbeitrag – anteilig nur bei manuell erfassten Abweichungen in der Kartei */
export function getExpectedAmountForPeriod(
  _period: string,
  monthlyTotal: number,
  _patenschaftStart?: string
): number {
  return monthlyTotal;
}

export function getPatenschaftPeriodStatus(input: {
  period: string;
  paidAmount: number;
  expectedAmount: number;
  now?: Date;
  zahlungszielTag?: number;
}): PatenschaftMonatsStatus["status"] {
  const now = input.now ?? new Date();
  const currentPeriod = toLocalPeriod(now);

  if (input.period > currentPeriod) return "zukünftig";
  if (input.paidAmount >= input.expectedAmount) return "bezahlt";

  if (input.period < currentPeriod) return "überfällig";

  const faelligAm = getPatenschaftFaelligAm(
    input.period,
    input.zahlungszielTag ?? PATENSCHAFT_FAELLIGKEIT_TAG
  );
  const today = toLocalDateString(now);
  if (today > faelligAm) return "überfällig";

  return "offen";
}

function diffLocalDays(fromDate: string, toDate: string): number {
  const from = new Date(`${fromDate}T12:00:00`);
  const to = new Date(`${toDate}T12:00:00`);
  return Math.round((to.getTime() - from.getTime()) / 86_400_000);
}

/** Countdown-Text und Tage bis/zur Fälligkeit (automatisch aus heutigem Datum) */
export function getPatenschaftCountdown(input: {
  faelligAm: string;
  status: PatenschaftMonatsStatus["status"];
  now?: Date;
}): { daysUntilDue: number; countdownLabel: string } {
  const today = toLocalDateString(input.now);
  const daysUntilDue = diffLocalDays(today, input.faelligAm);

  if (input.status === "bezahlt") {
    return { daysUntilDue: 0, countdownLabel: "Bezahlt" };
  }

  if (daysUntilDue > 0) {
    return {
      daysUntilDue,
      countdownLabel:
        daysUntilDue === 1 ? "Noch 1 Tag bis fällig" : `Noch ${daysUntilDue} Tage bis fällig`,
    };
  }

  if (daysUntilDue === 0) {
    return { daysUntilDue: 0, countdownLabel: "Heute fällig" };
  }

  const overdueDays = Math.abs(daysUntilDue);
  return {
    daysUntilDue,
    countdownLabel:
      overdueDays === 1 ? "1 Tag überfällig" : `${overdueDays} Tage überfällig`,
  };
}

export function enrichPatenschaftMonatLive(
  monat: Omit<PatenschaftMonatsStatus, "status" | "daysUntilDue" | "countdownLabel"> & {
    status?: PatenschaftMonatsStatus["status"];
  },
  now = new Date()
): PatenschaftMonatsStatus {
  const status =
    monat.status ??
    getPatenschaftPeriodStatus({
      period: monat.period,
      paidAmount: monat.paidAmount,
      expectedAmount: monat.expectedAmount,
      now,
      zahlungszielTag: monat.zahlungszielTag,
    });
  const countdown = getPatenschaftCountdown({ faelligAm: monat.faelligAm, status, now });

  return {
    ...monat,
    status,
    daysUntilDue: countdown.daysUntilDue,
    countdownLabel: countdown.countdownLabel,
  };
}

function formatPeriodLabel(period: string): string {
  const [year, month] = period.split("-").map(Number);
  const date = new Date(year, month - 1, 1);
  return date.toLocaleDateString("de-DE", { month: "long", year: "numeric" });
}

function addMonths(date: Date, count: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + count, 1);
}

function toPeriod(date: Date): string {
  return toLocalPeriod(date);
}

export function listPatenschaftMonate(input: {
  paten: PatenschaftPate[];
  zahlungen: PatenschaftZahlung[];
  now?: Date;
  /** Kommende Monate ab heute (Standard: 3) */
  monthsAhead?: number;
}): PatenschaftMonatsStatus[] {
  const activePaten = input.paten.filter((pate) => pate.active);
  if (activePaten.length === 0) return [];

  const startRaw = getPatenschaftStartDate(activePaten);
  if (!startRaw) return [];

  const now = input.now ?? new Date();
  const monthsAhead = input.monthsAhead ?? PATENSCHAFT_MONATE_VORAUS;
  const startDate = new Date(`${startRaw.slice(0, 7)}-01T12:00:00`);
  const endDate = addMonths(
    new Date(now.getFullYear(), now.getMonth(), 1),
    monthsAhead
  );
  const endPeriod = toPeriod(endDate);
  const monthlyTotal = getMonthlyPatenschaftTotal(activePaten);
  const patenschaftStart = getPatenschaftStartDate(activePaten);
  const zahlungszielTag = getPatenschaftZahlungszielTag(activePaten);

  const zahlungenByPeriod = new Map(
    input.zahlungen.map((zahlung) => [zahlung.period, zahlung])
  );

  const rows: PatenschaftMonatsStatus[] = [];
  let cursor = startDate;

  while (toPeriod(cursor) <= endPeriod) {
    const period = toPeriod(cursor);
    const zahlung = zahlungenByPeriod.get(period);
    const paidAmount = zahlung?.amount ?? 0;
    const expectedAmount = getExpectedAmountForPeriod(
      period,
      monthlyTotal,
      patenschaftStart
    );
    const faelligAm = getPatenschaftFaelligAm(period, zahlungszielTag);
    const status = getPatenschaftPeriodStatus({
      period,
      paidAmount,
      expectedAmount,
      now,
      zahlungszielTag,
    });
    const countdown = getPatenschaftCountdown({ faelligAm, status, now });

    rows.push({
      period,
      label: formatPeriodLabel(period),
      expectedAmount,
      paidAmount,
      status,
      faelligAm,
      zahlungszielTag,
      daysUntilDue: countdown.daysUntilDue,
      countdownLabel: countdown.countdownLabel,
      zahlung,
    });

    cursor = addMonths(cursor, 1);
  }

  return rows.reverse();
}

export type PatenschaftStatistik = {
  activePatenschaften: number;
  activePatenPersonen: number;
  monatlicherSollUmsatz: number;
  nachStufe: { stufeId: PatenschaftStufeId; name: string; count: number; monatlich: number }[];
  aktuellerMonat: {
    period: string;
    label: string;
    erwartet: number;
    erhalten: number;
    offen: number;
    bezahltCount: number;
    offenCount: number;
    ueberfaelligCount: number;
    faelligAm: string;
    daysUntilDue: number;
    countdownLabel: string;
  };
  gesamtErhalten: number;
  zahlungenAnzahl: number;
};

export function computePatenschaftStatistik(input: {
  paten: PatenschaftPate[];
  zahlungen: PatenschaftZahlung[];
  now?: Date;
}): PatenschaftStatistik {
  const now = input.now ?? new Date();
  const currentPeriod = toLocalPeriod(now);
  const activePaten = input.paten.filter((pate) => pate.active);

  const personCodes = new Set(
    activePaten.map((pate) => normalizeAccessCode(pate.accessCode))
  );

  const nachStufe = patenschaftsStufen.map((stufe) => {
    const count = activePaten.filter((pate) => pate.stufeId === stufe.id).length;
    return {
      stufeId: stufe.id,
      name: stufe.name,
      count,
      monatlich: count * stufe.preis,
    };
  });

  const monatlicherSollUmsatz = getMonthlyPatenschaftTotal(activePaten);

  const personStatuses = [...personCodes].map((code) => {
    const group = activePaten.filter(
      (pate) => normalizeAccessCode(pate.accessCode) === code
    );
    const groupZahlungen = input.zahlungen.filter(
      (zahlung) => normalizeAccessCode(zahlung.accessCode) === code
    );
    const monate = listPatenschaftMonate({
      paten: group,
      zahlungen: groupZahlungen,
      now,
    });
    const current = monate.find((item) => item.period === currentPeriod);
    const groupZahlungszielTag = getPatenschaftZahlungszielTag(group);
    return {
      expected: current?.expectedAmount ?? getMonthlyPatenschaftTotal(group),
      paid: current?.paidAmount ?? 0,
      status: current?.status ?? "offen",
      faelligAm: getPatenschaftFaelligAm(currentPeriod, groupZahlungszielTag),
    };
  });

  const erwartet = personStatuses.reduce((sum, item) => sum + item.expected, 0);
  const erhalten = personStatuses.reduce((sum, item) => sum + item.paid, 0);

  const openFaelligDates = personStatuses
    .filter((item) => item.status !== "bezahlt")
    .map((item) => item.faelligAm)
    .sort();
  const currentFaelligAm =
    openFaelligDates[0] ?? getPatenschaftFaelligAm(currentPeriod, PATENSCHAFT_FAELLIGKEIT_TAG);

  const aggregateStatus = getPatenschaftPeriodStatus({
    period: currentPeriod,
    paidAmount: erhalten,
    expectedAmount: erwartet,
    now,
    zahlungszielTag: normalizeZahlungszielTag(
      Number(currentFaelligAm.slice(8, 10))
    ),
  });
  const currentCountdown = getPatenschaftCountdown({
    faelligAm: currentFaelligAm,
    status: aggregateStatus,
    now,
  });

  return {
    activePatenschaften: activePaten.length,
    activePatenPersonen: personCodes.size,
    monatlicherSollUmsatz,
    nachStufe,
    aktuellerMonat: {
      period: currentPeriod,
      label: formatPeriodLabel(currentPeriod),
      erwartet,
      erhalten,
      offen: Math.max(0, erwartet - erhalten),
      bezahltCount: personStatuses.filter((item) => item.status === "bezahlt").length,
      offenCount: personStatuses.filter((item) => item.status === "offen").length,
      ueberfaelligCount: personStatuses.filter((item) => item.status === "überfällig").length,
      faelligAm: currentFaelligAm,
      daysUntilDue: currentCountdown.daysUntilDue,
      countdownLabel: currentCountdown.countdownLabel,
    },
    gesamtErhalten: input.zahlungen.reduce((sum, z) => sum + z.amount, 0),
    zahlungenAnzahl: input.zahlungen.length,
  };
}

export function buildBankDetailsBlock(accessCode: string, amount: number, period?: string): string {
  const verwendungszweck = period
    ? buildMonatlicherVerwendungszweck(accessCode, period)
    : buildPatenschaftVerwendungszweck(accessCode);

  return [
    `Kontoinhaber: ${patenschaftBank.accountHolder}`,
    `IBAN: ${patenschaftBank.iban}`,
    `BIC: ${patenschaftBank.bic}`,
    `Bank: ${patenschaftBank.bankName}`,
    `Betrag: ${amount.toFixed(2).replace(".", ",")} €`,
    `Verwendungszweck: ${verwendungszweck}`,
  ].join("\n");
}
