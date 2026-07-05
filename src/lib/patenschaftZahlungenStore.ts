import { randomUUID } from "crypto";
import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";
import { isSupabaseConfigured, getSupabaseAdmin } from "@/lib/supabase/admin";
import { normalizeAccessCode } from "@/lib/patenschaftTier";
import type { PatenschaftZahlung } from "@/types/patenschaftPortal";

type ZahlungRow = {
  id: string;
  access_code: string;
  period: string;
  amount: number;
  paid_at: string;
  note: string | null;
  created_at: string;
};

const DATA_DIR = path.join(process.cwd(), "data/patenschaft");
const ZAHLUNGEN_FILE = path.join(DATA_DIR, "zahlungen.json");

function mapZahlung(row: ZahlungRow): PatenschaftZahlung {
  return {
    id: row.id,
    accessCode: row.access_code,
    period: row.period,
    amount: Number(row.amount),
    paidAt: row.paid_at,
    note: row.note ?? undefined,
    createdAt: row.created_at,
  };
}

async function loadLocalZahlungen(): Promise<PatenschaftZahlung[]> {
  await mkdir(DATA_DIR, { recursive: true });
  try {
    const raw = await readFile(ZAHLUNGEN_FILE, "utf8");
    const parsed = JSON.parse(raw) as PatenschaftZahlung[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    await writeFile(ZAHLUNGEN_FILE, "[]", "utf8");
    return [];
  }
}

async function saveLocalZahlungen(zahlungen: PatenschaftZahlung[]): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(ZAHLUNGEN_FILE, JSON.stringify(zahlungen, null, 2), "utf8");
}

export async function listPatenschaftZahlungen(): Promise<PatenschaftZahlung[]> {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("patenschaft_zahlungen")
      .select("*")
      .order("period", { ascending: false });

    if (error) throw new Error(error.message);
    return (data as ZahlungRow[]).map(mapZahlung);
  }

  const zahlungen = await loadLocalZahlungen();
  return [...zahlungen].sort((a, b) => b.period.localeCompare(a.period, "de"));
}

export async function listZahlungenByAccessCode(
  accessCode: string
): Promise<PatenschaftZahlung[]> {
  const normalized = normalizeAccessCode(accessCode);
  const all = await listPatenschaftZahlungen();
  return all.filter((z) => normalizeAccessCode(z.accessCode) === normalized);
}

export async function createPatenschaftZahlung(input: {
  accessCode: string;
  period: string;
  amount: number;
  paidAt: string;
  note?: string;
}): Promise<PatenschaftZahlung> {
  const accessCode = normalizeAccessCode(input.accessCode);

  if (!/^\d{4}-\d{2}$/.test(input.period)) {
    throw new Error("Ungültiger Abrechnungsmonat (YYYY-MM).");
  }
  if (input.amount <= 0) {
    throw new Error("Betrag muss größer als 0 sein.");
  }

  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("patenschaft_zahlungen")
      .insert({
        access_code: accessCode,
        period: input.period,
        amount: input.amount,
        paid_at: input.paidAt,
        note: input.note ?? null,
      })
      .select("*")
      .single();

    if (error) {
      if (error.code === "23505") {
        throw new Error("Für diesen Monat ist bereits eine Zahlung erfasst.");
      }
      throw new Error(error.message);
    }

    return mapZahlung(data as ZahlungRow);
  }

  const zahlungen = await loadLocalZahlungen();
  if (
    zahlungen.some(
      (z) => normalizeAccessCode(z.accessCode) === accessCode && z.period === input.period
    )
  ) {
    throw new Error("Für diesen Monat ist bereits eine Zahlung erfasst.");
  }

  const zahlung: PatenschaftZahlung = {
    id: randomUUID(),
    accessCode,
    period: input.period,
    amount: input.amount,
    paidAt: input.paidAt,
    note: input.note,
    createdAt: new Date().toISOString(),
  };

  zahlungen.push(zahlung);
  await saveLocalZahlungen(zahlungen);
  return zahlung;
}

export async function deletePatenschaftZahlung(id: string): Promise<boolean> {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("patenschaft_zahlungen")
      .delete()
      .eq("id", id)
      .select("id");

    if (error) throw new Error(error.message);
    return (data?.length ?? 0) > 0;
  }

  const zahlungen = await loadLocalZahlungen();
  const before = zahlungen.length;
  const filtered = zahlungen.filter((z) => z.id !== id);
  if (filtered.length === before) return false;
  await saveLocalZahlungen(filtered);
  return true;
}
