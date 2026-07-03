import type { PatenschaftStufeId } from "@/data/patenschaften";
import {
  createDefaultUrkundeDaten,
  suggestUrkundenNr,
  type PatenschaftUrkundeDaten,
} from "@/data/patenschaften";
import { patenschaftsStufen } from "@/data/site";
import type { PatenschaftPate } from "@/types/patenschaftPortal";
import type { FormSubmissionRecord } from "@/lib/supabase/formSubmissions";

export type ParsedPatenschaftAnfrage = {
  name: string;
  email?: string;
  anschrift?: string;
  telefon?: string;
  waschbaerSlug: string;
  waschbaerName: string;
  stufeId: PatenschaftStufeId;
  isGift: boolean;
  beschenkterName?: string;
  beschenkterAnschrift?: string;
  grussbotschaft?: string;
  widerrufBestaetigtAt?: string;
  datenschutzBestaetigtAt?: string;
};

type WaschbaerRef = { slug: string; name: string };

function pick(payload: Record<string, string | undefined>, ...keys: string[]): string | undefined {
  for (const key of keys) {
    const direct = payload[key]?.trim();
    if (direct) return direct;

    const lower = key.toLowerCase();
    for (const [k, v] of Object.entries(payload)) {
      if (k.toLowerCase() === lower && v?.trim()) return v.trim();
    }
  }
  return undefined;
}

function parseStufeId(payload: Record<string, string | undefined>): PatenschaftStufeId | null {
  const rawId = pick(payload, "_stufe_id", "stufe_id");
  if (rawId && patenschaftsStufen.some((s) => s.id === rawId)) {
    return rawId as PatenschaftStufeId;
  }

  const label = pick(payload, "Stufe", "stufe");
  if (!label) return null;

  const byName = patenschaftsStufen.find((s) =>
    label.toLowerCase().startsWith(s.name.toLowerCase())
  );
  return byName?.id ?? null;
}

function parseWaschbaer(
  payload: Record<string, string | undefined>,
  waschbaeren: WaschbaerRef[]
): { slug: string; name: string } | null {
  const slug = pick(payload, "_waschbaer_slug", "waschbaer_slug");
  if (slug) {
    const match = waschbaeren.find((w) => w.slug === slug);
    return match ?? { slug, name: pick(payload, "Waschbär", "waschbaer") ?? slug };
  }

  const name = pick(payload, "Waschbär", "waschbaer");
  if (!name) return null;

  const byName = waschbaeren.find((w) => w.name.toLowerCase() === name.toLowerCase());
  if (byName) return byName;

  const bySlug = waschbaeren.find((w) => w.slug.toLowerCase() === name.toLowerCase());
  if (bySlug) return bySlug;

  return { slug: name.toLowerCase().replace(/\s+/g, "-"), name };
}

export function parsePatenschaftSubmission(
  payload: Record<string, string | undefined>,
  waschbaeren: WaschbaerRef[]
): ParsedPatenschaftAnfrage | { error: string } {
  const name = pick(payload, "Name", "name");
  if (!name) return { error: "Name fehlt in der Anfrage." };

  const stufeId = parseStufeId(payload);
  if (!stufeId) return { error: "Patenschaftsstufe konnte nicht ermittelt werden." };

  const waschbaer = parseWaschbaer(payload, waschbaeren);
  if (!waschbaer) return { error: "Waschbär konnte nicht ermittelt werden." };

  const giftRaw = pick(payload, "Geschenk", "geschenk")?.toLowerCase();

  return {
    name,
    email: pick(payload, "E-Mail", "email"),
    anschrift: pick(payload, "Anschrift", "anschrift"),
    telefon: pick(payload, "Telefon", "telefon"),
    waschbaerSlug: waschbaer.slug,
    waschbaerName: waschbaer.name,
    stufeId,
    isGift: giftRaw === "ja",
    beschenkterName: pick(payload, "Name Beschenkter", "beschenkter_name"),
    beschenkterAnschrift: pick(payload, "Anschrift Beschenkter", "beschenkter_anschrift"),
    grussbotschaft: pick(payload, "Grußbotschaft", "grussbotschaft"),
    widerrufBestaetigtAt: pick(payload, "widerrufsbelehrung_zeitpunkt"),
    datenschutzBestaetigtAt: pick(payload, "datenschutz_einwilligung_zeitpunkt"),
  };
}

export function suggestAccessCodeFromAnfrage(
  parsed: ParsedPatenschaftAnfrage,
  year = new Date().getFullYear()
): string {
  const waschbaerPart = parsed.waschbaerSlug.replace(/-/g, "").slice(0, 8).toUpperCase();
  const stufePart = parsed.stufeId.toUpperCase();
  const namePart = parsed.name
    .trim()
    .split(/\s+/)
    .map((part) => part[0] ?? "")
    .join("")
    .toUpperCase()
    .slice(0, 4);
  return `${waschbaerPart}-${stufePart}-${namePart || "PATE"}-${year}`;
}

export function buildPatenFromAnfrage(
  submission: FormSubmissionRecord,
  parsed: ParsedPatenschaftAnfrage,
  options: { accessCode: string; notiz?: string }
): Omit<PatenschaftPate, "id" | "createdAt" | "updatedAt"> {
  const startDate = submission.createdAt.slice(0, 10);

  return {
    name: parsed.isGift && parsed.beschenkterName ? parsed.beschenkterName : parsed.name,
    accessCode: options.accessCode,
    waschbaerSlug: parsed.waschbaerSlug,
    stufeId: parsed.stufeId,
    active: true,
    email: parsed.email,
    notiz:
      options.notiz ??
      (parsed.isGift ? `Besteller: ${parsed.name}` : undefined),
    formSubmissionId: submission.id,
    anschrift: parsed.isGift
      ? parsed.beschenkterAnschrift ?? parsed.anschrift
      : parsed.anschrift,
    telefon: parsed.telefon,
    urkundenNr: suggestUrkundenNr(),
    ausgestelltAm: startDate,
    isGift: parsed.isGift,
    beschenkterName: parsed.beschenkterName,
    beschenkterAnschrift: parsed.beschenkterAnschrift,
    grussbotschaft: parsed.grussbotschaft,
    widerrufBestaetigtAt: parsed.widerrufBestaetigtAt,
    datenschutzBestaetigtAt: parsed.datenschutzBestaetigtAt,
    patenschaftStart: startDate,
  };
}

export function buildUrkundeFromPate(
  pate: PatenschaftPate,
  waschbaer?: { name: string; slug: string; profilFoto?: string; hasEchteFotos?: boolean }
): PatenschaftUrkundeDaten {
  return createDefaultUrkundeDaten({
    pate: pate.name,
    waschbaer: waschbaer?.name ?? pate.waschbaerSlug,
    waschbaerSlug: pate.waschbaerSlug,
    waschbaerFoto:
      waschbaer?.hasEchteFotos && waschbaer.profilFoto ? waschbaer.profilFoto : "",
    stufeId: pate.stufeId,
    ausgestelltAm: pate.ausgestelltAm ?? pate.patenschaftStart ?? new Date().toISOString().slice(0, 10),
    urkundenNr: pate.urkundenNr ?? suggestUrkundenNr(),
    grussbotschaft: pate.grussbotschaft,
  });
}
