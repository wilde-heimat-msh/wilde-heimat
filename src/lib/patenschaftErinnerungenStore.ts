import { randomUUID } from "crypto";
import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";
import { isSupabaseConfigured, getSupabaseAdmin } from "@/lib/supabase/admin";
import { normalizeAccessCode } from "@/lib/patenschaftTier";
import type { PatenschaftZahlungserinnerung } from "@/types/patenschaftPortal";

type ErinnerungRow = {
  id: string;
  access_code: string;
  pate_id: string | null;
  period: string;
  recipient_email: string;
  recipient_name: string;
  subject: string;
  status: "sent" | "failed" | "skipped";
  trigger: "auto" | "manual";
  error_message: string | null;
  sent_at: string | null;
  created_at: string;
};

const DATA_DIR = path.join(process.cwd(), "data/patenschaft");
const ERINNERUNGEN_FILE = path.join(DATA_DIR, "zahlungserinnerungen.json");

function mapErinnerung(row: ErinnerungRow): PatenschaftZahlungserinnerung {
  return {
    id: row.id,
    accessCode: row.access_code,
    pateId: row.pate_id ?? undefined,
    period: row.period,
    recipientEmail: row.recipient_email,
    recipientName: row.recipient_name,
    subject: row.subject,
    status: row.status,
    trigger: row.trigger,
    errorMessage: row.error_message ?? undefined,
    sentAt: row.sent_at ?? undefined,
    createdAt: row.created_at,
  };
}

async function loadLocalErinnerungen(): Promise<PatenschaftZahlungserinnerung[]> {
  await mkdir(DATA_DIR, { recursive: true });
  try {
    const raw = await readFile(ERINNERUNGEN_FILE, "utf8");
    const parsed = JSON.parse(raw) as PatenschaftZahlungserinnerung[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    await writeFile(ERINNERUNGEN_FILE, "[]", "utf8");
    return [];
  }
}

async function saveLocalErinnerungen(
  erinnerungen: PatenschaftZahlungserinnerung[]
): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(ERINNERUNGEN_FILE, JSON.stringify(erinnerungen, null, 2), "utf8");
}

export async function listPatenschaftZahlungserinnerungen(): Promise<
  PatenschaftZahlungserinnerung[]
> {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("patenschaft_zahlungserinnerungen")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return (data as ErinnerungRow[]).map(mapErinnerung);
  }

  const erinnerungen = await loadLocalErinnerungen();
  return [...erinnerungen].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function listErinnerungenByPeriod(
  period: string
): Promise<PatenschaftZahlungserinnerung[]> {
  const all = await listPatenschaftZahlungserinnerungen();
  return all.filter((item) => item.period === period);
}

export function hasSuccessfulErinnerung(
  erinnerungen: PatenschaftZahlungserinnerung[],
  accessCode: string,
  period: string
): boolean {
  const normalized = normalizeAccessCode(accessCode);
  return erinnerungen.some(
    (item) =>
      normalizeAccessCode(item.accessCode) === normalized &&
      item.period === period &&
      item.status === "sent"
  );
}

export async function createPatenschaftZahlungserinnerung(input: {
  accessCode: string;
  pateId?: string;
  period: string;
  recipientEmail: string;
  recipientName: string;
  subject: string;
  status: PatenschaftZahlungserinnerung["status"];
  trigger: PatenschaftZahlungserinnerung["trigger"];
  errorMessage?: string;
  sentAt?: string;
}): Promise<PatenschaftZahlungserinnerung> {
  const accessCode = normalizeAccessCode(input.accessCode);
  const sentAt = input.status === "sent" ? input.sentAt ?? new Date().toISOString() : undefined;

  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("patenschaft_zahlungserinnerungen")
      .insert({
        access_code: accessCode,
        pate_id: input.pateId ?? null,
        period: input.period,
        recipient_email: input.recipientEmail,
        recipient_name: input.recipientName,
        subject: input.subject,
        status: input.status,
        trigger: input.trigger,
        error_message: input.errorMessage ?? null,
        sent_at: sentAt ?? null,
      })
      .select("*")
      .single();

    if (error) throw new Error(error.message);
    return mapErinnerung(data as ErinnerungRow);
  }

  const erinnerung: PatenschaftZahlungserinnerung = {
    id: randomUUID(),
    accessCode,
    pateId: input.pateId,
    period: input.period,
    recipientEmail: input.recipientEmail,
    recipientName: input.recipientName,
    subject: input.subject,
    status: input.status,
    trigger: input.trigger,
    errorMessage: input.errorMessage,
    sentAt,
    createdAt: new Date().toISOString(),
  };

  const erinnerungen = await loadLocalErinnerungen();
  erinnerungen.push(erinnerung);
  await saveLocalErinnerungen(erinnerungen);
  return erinnerung;
}
