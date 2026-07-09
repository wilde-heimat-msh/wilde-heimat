import {
  buildPatenEmailPlatzhalter,
  fillPatenEmailTemplate,
  getPatenEmailVorlage,
  textToPatenEmailHtml,
} from "@/data/patenEmailVorlagen";
import { patenschaftsStufen } from "@/data/site";
import {
  getFormMailTo,
  isFormMailConfigured,
  sendPatenMail,
} from "@/lib/formMail";
import {
  createPatenschaftZahlungserinnerung,
  hasSuccessfulErinnerung,
  listErinnerungenByPeriod,
} from "@/lib/patenschaftErinnerungenStore";
import {
  getMonthlyPatenschaftTotal,
  getPatenschaftPeriodStatus,
  getPatenschaftZahlungszielTag,
  listPatenschaftMonate,
  PATENSCHAFT_FAELLIGKEIT_TAG,
  toLocalDateString,
  toLocalPeriod,
} from "@/lib/patenschaftPayment";
import { listPatenByAccessCode, listPaten } from "@/lib/patenschaftStore";
import { listZahlungenByAccessCode } from "@/lib/patenschaftZahlungenStore";
import { normalizeAccessCode } from "@/lib/patenschaftTier";
import { getSiteUrl } from "@/lib/siteUrl";
import { listWaschbaerenPublic } from "@/lib/waschbaerStore";
import type { PatenschaftPate, PatenschaftZahlungserinnerung } from "@/types/patenschaftPortal";

export type PatenschaftErinnerungRecipient = {
  accessCode: string;
  pateId: string;
  name: string;
  email?: string;
  waschbaerLabel: string;
  monthlyAmount: number;
  stufeId: PatenschaftPate["stufeId"];
  zahlungszielTag: number;
  paymentStatus: "bezahlt" | "offen" | "überfällig" | "zukünftig";
  reminderStatus: "sent" | "failed" | "skipped" | "pending" | "no_email";
  lastErinnerung?: PatenschaftZahlungserinnerung;
  skipReason?: string;
};

export type PatenschaftErinnerungRunResult =
  | {
      run: false;
      reason: string;
    }
  | {
      run: true;
      period: string;
      trigger: "auto" | "manual";
      sent: number;
      failed: number;
      skipped: number;
      results: {
        accessCode: string;
        pateId: string;
        name: string;
        status: "sent" | "failed" | "skipped";
        error?: string;
        skipReason?: string;
      }[];
    };

function isReminderDayForPatron(paten: PatenschaftPate[], now = new Date()): boolean {
  return now.getDate() === getPatenschaftZahlungszielTag(paten);
}

function pickPrimaryPate(patenschaften: PatenschaftPate[]): PatenschaftPate {
  return [...patenschaften].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  )[0];
}

function buildWaschbaerLabel(
  patenschaften: PatenschaftPate[],
  waschbaerNames: Map<string, string>
): string {
  const names = patenschaften
    .filter((pate) => pate.active)
    .map((pate) => waschbaerNames.get(pate.waschbaerSlug) ?? pate.waschbaerSlug);
  const unique = [...new Set(names)];
  if (unique.length <= 2) return unique.join(" & ");
  return `${unique.slice(0, -1).join(", ")} & ${unique.at(-1)}`;
}

export async function groupActivePatenByAccessCode(): Promise<
  { accessCode: string; patenschaften: PatenschaftPate[]; primary: PatenschaftPate }[]
> {
  const allPaten = await listPaten();
  const groups = new Map<string, PatenschaftPate[]>();

  for (const pate of allPaten.filter((item) => item.active)) {
    const code = normalizeAccessCode(pate.accessCode);
    const existing = groups.get(code) ?? [];
    existing.push(pate);
    groups.set(code, existing);
  }

  return [...groups.entries()].map(([accessCode, patenschaften]) => ({
    accessCode,
    patenschaften,
    primary: pickPrimaryPate(patenschaften),
  }));
}

export async function buildPatenschaftErinnerungOverview(input?: {
  period?: string;
  now?: Date;
}): Promise<{
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
}> {
  const now = input?.now ?? new Date();
  const period = input?.period ?? toLocalPeriod(now);
  const periodLabel = new Date(`${period}-01T12:00:00`).toLocaleDateString("de-DE", {
    month: "long",
    year: "numeric",
  });
  const [groups, waschbaeren, erinnerungen] = await Promise.all([
    groupActivePatenByAccessCode(),
    listWaschbaerenPublic(),
    listErinnerungenByPeriod(period),
  ]);
  const waschbaerNames = new Map(waschbaeren.map((item) => [item.slug, item.name]));

  const recipients: PatenschaftErinnerungRecipient[] = [];

  for (const group of groups) {
    const zahlungen = await listZahlungenByAccessCode(group.accessCode);
    const monate = listPatenschaftMonate({
      paten: group.patenschaften,
      zahlungen,
      now,
    });
    const currentMonat = monate.find((item) => item.period === period);
    const paymentStatus = currentMonat?.status ?? "offen";
    const lastErinnerung = erinnerungen
      .filter((item) => normalizeAccessCode(item.accessCode) === group.accessCode)
      .sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )[0];

    let reminderStatus: PatenschaftErinnerungRecipient["reminderStatus"] = "pending";
    let skipReason: string | undefined;

    if (!group.primary.email?.trim()) {
      reminderStatus = "no_email";
      skipReason = "Keine E-Mail-Adresse hinterlegt";
    } else if (paymentStatus === "bezahlt") {
      reminderStatus = "skipped";
      skipReason = "Beitrag bereits beglichen";
    } else if (lastErinnerung?.status === "sent") {
      reminderStatus = "sent";
    } else if (lastErinnerung?.status === "failed") {
      reminderStatus = "failed";
    } else if (lastErinnerung?.status === "skipped") {
      reminderStatus = "skipped";
      skipReason = lastErinnerung.errorMessage ?? "Übersprungen";
    }

    recipients.push({
      accessCode: group.accessCode,
      pateId: group.primary.id,
      name: group.primary.name,
      email: group.primary.email,
      waschbaerLabel: buildWaschbaerLabel(group.patenschaften, waschbaerNames),
      monthlyAmount: getMonthlyPatenschaftTotal(group.patenschaften),
      stufeId: group.primary.stufeId,
      zahlungszielTag: getPatenschaftZahlungszielTag(group.patenschaften),
      paymentStatus,
      reminderStatus,
      lastErinnerung,
      skipReason,
    });
  }

  recipients.sort((a, b) => a.name.localeCompare(b.name, "de"));

  return {
    period,
    periodLabel,
    isReminderDay: groups.some((group) => isReminderDayForPatron(group.patenschaften, now)),
    mailConfigured: isFormMailConfigured(),
    bccCopyTo: getFormMailTo(),
    recipients,
    summary: {
      total: recipients.length,
      sent: recipients.filter((item) => item.reminderStatus === "sent").length,
      failed: recipients.filter((item) => item.reminderStatus === "failed").length,
      skipped: recipients.filter((item) => item.reminderStatus === "skipped").length,
      pending: recipients.filter((item) => item.reminderStatus === "pending").length,
      noEmail: recipients.filter((item) => item.reminderStatus === "no_email").length,
      paid: recipients.filter((item) => item.paymentStatus === "bezahlt").length,
    },
  };
}

async function buildReminderMail(input: {
  primary: PatenschaftPate;
  patenschaften: PatenschaftPate[];
  waschbaerLabel: string;
  period: string;
  monthlyAmount: number;
  siteOrigin: string;
}) {
  const stufe = patenschaftsStufen.find((item) => item.id === input.primary.stufeId);
  const zahlungszielTag = getPatenschaftZahlungszielTag(input.patenschaften);
  const monatLabel = new Date(`${input.period}-01T12:00:00`).toLocaleDateString("de-DE", {
    month: "long",
    year: "numeric",
  });
  const platzhalter = buildPatenEmailPlatzhalter({
    pateName: input.primary.name,
    waschbaerName: input.waschbaerLabel,
    stufeName: stufe?.name ?? input.primary.stufeId,
    stufePreis: input.monthlyAmount,
    accessCode: input.primary.accessCode,
    urkundenNr: input.primary.urkundenNr,
    siteOrigin: input.siteOrigin,
    monatLabel,
    period: input.period,
    zahlungszielTag,
  });
  const vorlage = getPatenEmailVorlage("monatliche-zahlungserinnerung");
  const subject = fillPatenEmailTemplate(vorlage.subject, platzhalter);
  const text = fillPatenEmailTemplate(vorlage.body, platzhalter);
  return { subject, text, html: textToPatenEmailHtml(text) };
}

export async function sendPatenschaftZahlungserinnerungForGroup(input: {
  accessCode: string;
  period: string;
  trigger: "auto" | "manual";
  force?: boolean;
  siteOrigin?: string;
}): Promise<{
  status: "sent" | "failed" | "skipped";
  pateId: string;
  name: string;
  error?: string;
  skipReason?: string;
  erinnerung?: PatenschaftZahlungserinnerung;
}> {
  const siteOrigin = input.siteOrigin ?? getSiteUrl();
  const patenschaften = (await listPatenByAccessCode(input.accessCode)).filter(
    (pate) => pate.active
  );
  if (patenschaften.length === 0) {
    return {
      status: "skipped",
      pateId: "",
      name: "",
      skipReason: "Keine aktive Patenschaft",
    };
  }

  const primary = pickPrimaryPate(patenschaften);
  const waschbaeren = await listWaschbaerenPublic();
  const waschbaerNames = new Map(waschbaeren.map((item) => [item.slug, item.name]));
  const waschbaerLabel = buildWaschbaerLabel(patenschaften, waschbaerNames);
  const monthlyAmount = getMonthlyPatenschaftTotal(patenschaften);
  const recipientEmail = primary.email?.trim() ?? "";

  const erinnerungen = await listErinnerungenByPeriod(input.period);
  if (hasSuccessfulErinnerung(erinnerungen, input.accessCode, input.period) && !input.force) {
    return {
      status: "skipped",
      pateId: primary.id,
      name: primary.name,
      skipReason: "Erinnerung wurde bereits erfolgreich versendet",
    };
  }

  const zahlungen = await listZahlungenByAccessCode(input.accessCode);
  const paymentStatus = getPatenschaftPeriodStatus({
    period: input.period,
    paidAmount:
      zahlungen.find((zahlung) => zahlung.period === input.period)?.amount ?? 0,
    expectedAmount: monthlyAmount,
    zahlungszielTag: getPatenschaftZahlungszielTag(patenschaften),
  });
  if (paymentStatus === "bezahlt") {
    const erinnerung = await createPatenschaftZahlungserinnerung({
      accessCode: input.accessCode,
      pateId: primary.id,
      period: input.period,
      recipientEmail,
      recipientName: primary.name,
      subject: "",
      status: "skipped",
      trigger: input.trigger,
      errorMessage: "Beitrag bereits beglichen",
    });
    return {
      status: "skipped",
      pateId: primary.id,
      name: primary.name,
      skipReason: "Beitrag bereits beglichen",
      erinnerung,
    };
  }

  if (!recipientEmail) {
    const erinnerung = await createPatenschaftZahlungserinnerung({
      accessCode: input.accessCode,
      pateId: primary.id,
      period: input.period,
      recipientEmail: "",
      recipientName: primary.name,
      subject: "",
      status: "skipped",
      trigger: input.trigger,
      errorMessage: "Keine E-Mail-Adresse hinterlegt",
    });
    return {
      status: "skipped",
      pateId: primary.id,
      name: primary.name,
      skipReason: "Keine E-Mail-Adresse hinterlegt",
      erinnerung,
    };
  }

  if (!isFormMailConfigured()) {
    const erinnerung = await createPatenschaftZahlungserinnerung({
      accessCode: input.accessCode,
      pateId: primary.id,
      period: input.period,
      recipientEmail,
      recipientName: primary.name,
      subject: "",
      status: "failed",
      trigger: input.trigger,
      errorMessage: "E-Mail-Versand ist nicht konfiguriert",
    });
    return {
      status: "failed",
      pateId: primary.id,
      name: primary.name,
      error: "E-Mail-Versand ist nicht konfiguriert",
      erinnerung,
    };
  }

  const mail = await buildReminderMail({
    primary,
    patenschaften,
    waschbaerLabel,
    period: input.period,
    monthlyAmount,
    siteOrigin,
  });

  const sendResult = await sendPatenMail({
    to: recipientEmail,
    subject: mail.subject,
    text: mail.text,
    html: mail.html,
    bccCopy: true,
  });

  if (!sendResult.ok) {
    const erinnerung = await createPatenschaftZahlungserinnerung({
      accessCode: input.accessCode,
      pateId: primary.id,
      period: input.period,
      recipientEmail,
      recipientName: primary.name,
      subject: mail.subject,
      status: "failed",
      trigger: input.trigger,
      errorMessage: sendResult.error,
    });
    return {
      status: "failed",
      pateId: primary.id,
      name: primary.name,
      error: sendResult.error,
      erinnerung,
    };
  }

  const erinnerung = await createPatenschaftZahlungserinnerung({
    accessCode: input.accessCode,
    pateId: primary.id,
    period: input.period,
    recipientEmail,
    recipientName: primary.name,
    subject: mail.subject,
    status: "sent",
    trigger: input.trigger,
  });

  return {
    status: "sent",
    pateId: primary.id,
    name: primary.name,
    erinnerung,
  };
}

export async function runPatenschaftZahlungserinnerungen(input: {
  period?: string;
  trigger: "auto" | "manual";
  force?: boolean;
  onlyFailedOrPending?: boolean;
  pateId?: string;
  now?: Date;
}): Promise<PatenschaftErinnerungRunResult> {
  const now = input.now ?? new Date();
  const period = input.period ?? toLocalPeriod(now);

  const overview = await buildPatenschaftErinnerungOverview({ period, now });
  let targets = overview.recipients;

  if (input.trigger === "auto") {
    const groups = await groupActivePatenByAccessCode();
    const patenschaftenByCode = new Map(
      groups.map((group) => [group.accessCode, group.patenschaften])
    );
    targets = targets.filter((recipient) => {
      const patenschaften = patenschaftenByCode.get(recipient.accessCode) ?? [];
      return isReminderDayForPatron(patenschaften, now);
    });

    if (targets.length === 0) {
      return {
        run: false,
        reason: `Heute (${toLocalDateString(now)}) ist für keine aktive Patenschaft der individuelle Erinnerungstag.`,
      };
    }
  }

  if (input.pateId) {
    targets = targets.filter((item) => item.pateId === input.pateId);
  }

  if (input.onlyFailedOrPending) {
    targets = targets.filter(
      (item) =>
        item.reminderStatus === "failed" ||
        item.reminderStatus === "pending" ||
        (input.force && item.reminderStatus !== "sent")
    );
  } else if (!input.force) {
    targets = targets.filter(
      (item) => item.reminderStatus === "pending" || item.reminderStatus === "failed"
    );
  }

  targets = targets.filter(
    (item) => item.reminderStatus !== "no_email" && item.paymentStatus !== "bezahlt"
  );

  const results: Extract<PatenschaftErinnerungRunResult, { run: true }>["results"] = [];
  let sent = 0;
  let failed = 0;
  let skipped = 0;

  for (const target of targets) {
    const result = await sendPatenschaftZahlungserinnerungForGroup({
      accessCode: target.accessCode,
      period,
      trigger: input.trigger,
      force: input.force,
    });
    results.push({
      accessCode: target.accessCode,
      pateId: result.pateId,
      name: result.name,
      status: result.status,
      error: result.error,
      skipReason: result.skipReason,
    });
    if (result.status === "sent") sent += 1;
    else if (result.status === "failed") failed += 1;
    else skipped += 1;
  }

  return { run: true, period, trigger: input.trigger, sent, failed, skipped, results };
}

export async function logManualPatenschaftZahlungserinnerung(input: {
  accessCode: string;
  pateId: string;
  period: string;
  recipientEmail: string;
  recipientName: string;
  subject: string;
  status: "sent" | "failed";
  errorMessage?: string;
}) {
  return createPatenschaftZahlungserinnerung({
    ...input,
    trigger: "manual",
  });
}
