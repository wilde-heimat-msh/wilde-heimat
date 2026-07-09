import { getSupabaseAdmin } from "@/lib/supabase/admin";
import type {
  PatenschaftPate,
  PatenschaftUpdate,
} from "@/types/patenschaftPortal";
import { normalizeAccessCode } from "@/lib/patenschaftTier";
import type { PatenschaftStufeId } from "@/data/patenschaften";

type PateRow = {
  id: string;
  name: string;
  access_code: string;
  waschbaer_slug: string;
  stufe_id: PatenschaftStufeId;
  active: boolean;
  email: string | null;
  notiz: string | null;
  form_submission_id: string | null;
  anschrift: string | null;
  telefon: string | null;
  urkunden_nr: string | null;
  ausgestellt_am: string | null;
  is_gift: boolean;
  beschenkter_name: string | null;
  beschenkter_anschrift: string | null;
  grussbotschaft: string | null;
  widerruf_bestaetigt_at: string | null;
  datenschutz_bestaetigt_at: string | null;
  patenschaft_start: string | null;
  zahlungsziel_tag: number | null;
  created_at: string;
  updated_at: string;
};

type UpdateRow = {
  id: string;
  waschbaer_slug: string;
  min_stufe: PatenschaftStufeId;
  patron_id: string | null;
  title: string;
  body: string;
  image_urls: string[];
  published_at: string;
  created_at: string;
  updated_at: string;
};

function mapPate(row: PateRow): PatenschaftPate {
  return {
    id: row.id,
    name: row.name,
    accessCode: row.access_code,
    waschbaerSlug: row.waschbaer_slug,
    stufeId: row.stufe_id,
    active: row.active,
    email: row.email ?? undefined,
    notiz: row.notiz ?? undefined,
    formSubmissionId: row.form_submission_id ?? undefined,
    anschrift: row.anschrift ?? undefined,
    telefon: row.telefon ?? undefined,
    urkundenNr: row.urkunden_nr ?? undefined,
    ausgestelltAm: row.ausgestellt_am ?? undefined,
    isGift: row.is_gift ?? undefined,
    beschenkterName: row.beschenkter_name ?? undefined,
    beschenkterAnschrift: row.beschenkter_anschrift ?? undefined,
    grussbotschaft: row.grussbotschaft ?? undefined,
    widerrufBestaetigtAt: row.widerruf_bestaetigt_at ?? undefined,
    datenschutzBestaetigtAt: row.datenschutz_bestaetigt_at ?? undefined,
    patenschaftStart: row.patenschaft_start ?? undefined,
    zahlungszielTag: row.zahlungsziel_tag ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapUpdate(row: UpdateRow): PatenschaftUpdate {
  return {
    id: row.id,
    waschbaerSlug: row.waschbaer_slug,
    minStufe: row.min_stufe,
    patronId: row.patron_id ?? undefined,
    title: row.title,
    body: row.body,
    imageUrls: row.image_urls ?? [],
    publishedAt: row.published_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function supabaseListPaten(): Promise<PatenschaftPate[]> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("patenschaft_paten")
    .select("*")
    .order("name");

  if (error) throw new Error(error.message);
  return (data as PateRow[]).map(mapPate);
}

export async function supabaseListPatenByAccessCode(
  code: string
): Promise<PatenschaftPate[]> {
  const normalized = normalizeAccessCode(code);
  const paten = await supabaseListPaten();
  return paten.filter(
    (p) => p.active && normalizeAccessCode(p.accessCode) === normalized
  );
}

export async function supabaseGetPatenByAccessCode(
  code: string
): Promise<PatenschaftPate | null> {
  const paten = await supabaseListPatenByAccessCode(code);
  return paten[0] ?? null;
}

export async function supabaseGetPatenById(id: string): Promise<PatenschaftPate | null> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("patenschaft_paten")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data ? mapPate(data as PateRow) : null;
}

export async function supabaseIsPatenschaftSlotTaken(
  code: string,
  waschbaerSlug: string,
  excludeId?: string
): Promise<boolean> {
  const normalized = normalizeAccessCode(code);
  const paten = await supabaseListPaten();
  return paten.some(
    (p) =>
      p.id !== excludeId &&
      normalizeAccessCode(p.accessCode) === normalized &&
      p.waschbaerSlug === waschbaerSlug
  );
}

export async function supabaseFindAccessCodeForPatron(
  email?: string
): Promise<string | null> {
  const normalizedEmail = email?.trim().toLowerCase();
  if (!normalizedEmail) return null;

  const paten = await supabaseListPaten();
  const match = paten.find((p) => p.email?.trim().toLowerCase() === normalizedEmail);
  return match?.accessCode ?? null;
}

export async function supabaseGetPatenLinksBySubmissionIds(
  submissionIds: string[]
): Promise<Record<string, string>> {
  if (submissionIds.length === 0) return {};

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("patenschaft_paten")
    .select("id, form_submission_id")
    .in("form_submission_id", submissionIds);

  if (error) throw new Error(error.message);

  const links: Record<string, string> = {};
  for (const row of data ?? []) {
    if (row.form_submission_id) {
      links[row.form_submission_id] = row.id;
    }
  }
  return links;
}

export async function supabaseGetPatenByFormSubmissionId(
  submissionId: string
): Promise<PatenschaftPate | null> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("patenschaft_paten")
    .select("*")
    .eq("form_submission_id", submissionId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data ? mapPate(data as PateRow) : null;
}

function buildPateInsert(input: Omit<PatenschaftPate, "id" | "createdAt" | "updatedAt">) {
  return {
    name: input.name,
    access_code: normalizeAccessCode(input.accessCode),
    waschbaer_slug: input.waschbaerSlug,
    stufe_id: input.stufeId,
    active: input.active,
    email: input.email ?? null,
    notiz: input.notiz ?? null,
    form_submission_id: input.formSubmissionId ?? null,
    anschrift: input.anschrift ?? null,
    telefon: input.telefon ?? null,
    urkunden_nr: input.urkundenNr ?? null,
    ausgestellt_am: input.ausgestelltAm ?? null,
    is_gift: input.isGift ?? false,
    beschenkter_name: input.beschenkterName ?? null,
    beschenkter_anschrift: input.beschenkterAnschrift ?? null,
    grussbotschaft: input.grussbotschaft ?? null,
    widerruf_bestaetigt_at: input.widerrufBestaetigtAt ?? null,
    datenschutz_bestaetigt_at: input.datenschutzBestaetigtAt ?? null,
    patenschaft_start: input.patenschaftStart ?? null,
    zahlungsziel_tag: input.zahlungszielTag ?? null,
  };
}

function buildPatePatch(input: Partial<Omit<PatenschaftPate, "id" | "createdAt">>) {
  const patch: Record<string, unknown> = {};

  if (input.name !== undefined) patch.name = input.name;
  if (input.accessCode !== undefined) {
    patch.access_code = normalizeAccessCode(input.accessCode);
  }
  if (input.waschbaerSlug !== undefined) patch.waschbaer_slug = input.waschbaerSlug;
  if (input.stufeId !== undefined) patch.stufe_id = input.stufeId;
  if (input.active !== undefined) patch.active = input.active;
  if (input.email !== undefined) patch.email = input.email ?? null;
  if (input.notiz !== undefined) patch.notiz = input.notiz ?? null;
  if (input.formSubmissionId !== undefined) {
    patch.form_submission_id = input.formSubmissionId ?? null;
  }
  if (input.anschrift !== undefined) patch.anschrift = input.anschrift ?? null;
  if (input.telefon !== undefined) patch.telefon = input.telefon ?? null;
  if (input.urkundenNr !== undefined) patch.urkunden_nr = input.urkundenNr ?? null;
  if (input.ausgestelltAm !== undefined) patch.ausgestellt_am = input.ausgestelltAm ?? null;
  if (input.isGift !== undefined) patch.is_gift = input.isGift;
  if (input.beschenkterName !== undefined) {
    patch.beschenkter_name = input.beschenkterName ?? null;
  }
  if (input.beschenkterAnschrift !== undefined) {
    patch.beschenkter_anschrift = input.beschenkterAnschrift ?? null;
  }
  if (input.grussbotschaft !== undefined) patch.grussbotschaft = input.grussbotschaft ?? null;
  if (input.widerrufBestaetigtAt !== undefined) {
    patch.widerruf_bestaetigt_at = input.widerrufBestaetigtAt ?? null;
  }
  if (input.datenschutzBestaetigtAt !== undefined) {
    patch.datenschutz_bestaetigt_at = input.datenschutzBestaetigtAt ?? null;
  }
  if (input.patenschaftStart !== undefined) {
    patch.patenschaft_start = input.patenschaftStart ?? null;
  }
  if (input.zahlungszielTag !== undefined) {
    patch.zahlungsziel_tag = input.zahlungszielTag ?? null;
  }

  return patch;
}

export async function supabaseCreatePaten(
  input: Omit<PatenschaftPate, "id" | "createdAt" | "updatedAt">
): Promise<PatenschaftPate> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("patenschaft_paten")
    .insert(buildPateInsert(input))
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return mapPate(data as PateRow);
}

export async function supabaseUpdatePaten(
  id: string,
  input: Partial<Omit<PatenschaftPate, "id" | "createdAt">>
): Promise<PatenschaftPate | null> {
  const supabase = getSupabaseAdmin();
  const patch = buildPatePatch(input);

  const { data, error } = await supabase
    .from("patenschaft_paten")
    .update(patch)
    .eq("id", id)
    .select("*")
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data ? mapPate(data as PateRow) : null;
}

export async function supabaseUpdateZahlungszielForAccessCode(
  accessCode: string,
  zahlungszielTag: number
): Promise<void> {
  const supabase = getSupabaseAdmin();
  const normalized = normalizeAccessCode(accessCode);
  const { data: paten, error: loadError } = await supabase
    .from("patenschaft_paten")
    .select("id, access_code");

  if (loadError) throw new Error(loadError.message);

  const ids = (paten as { id: string; access_code: string }[])
    .filter((pate) => normalizeAccessCode(pate.access_code) === normalized)
    .map((pate) => pate.id);

  if (ids.length === 0) return;

  const { error } = await supabase
    .from("patenschaft_paten")
    .update({ zahlungsziel_tag: zahlungszielTag })
    .in("id", ids);

  if (error) throw new Error(error.message);
}

export async function supabaseDeletePaten(id: string): Promise<boolean> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("patenschaft_paten")
    .delete()
    .eq("id", id)
    .select("id");

  if (error) throw new Error(error.message);
  return (data?.length ?? 0) > 0;
}

export async function supabaseListUpdates(): Promise<PatenschaftUpdate[]> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("patenschaft_updates")
    .select("*")
    .order("published_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data as UpdateRow[]).map(mapUpdate);
}

export async function supabaseCreateUpdate(
  input: Omit<PatenschaftUpdate, "id" | "createdAt" | "updatedAt">
): Promise<PatenschaftUpdate> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("patenschaft_updates")
    .insert({
      waschbaer_slug: input.waschbaerSlug,
      min_stufe: input.minStufe,
      patron_id: input.patronId ?? null,
      title: input.title,
      body: input.body,
      image_urls: input.imageUrls,
      published_at: input.publishedAt,
    })
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return mapUpdate(data as UpdateRow);
}

export async function supabaseUpdatePatenschaftUpdate(
  id: string,
  input: Partial<Omit<PatenschaftUpdate, "id" | "createdAt">>
): Promise<PatenschaftUpdate | null> {
  const supabase = getSupabaseAdmin();
  const patch: Record<string, unknown> = {};

  if (input.waschbaerSlug !== undefined) patch.waschbaer_slug = input.waschbaerSlug;
  if (input.minStufe !== undefined) patch.min_stufe = input.minStufe;
  if (input.patronId !== undefined) patch.patron_id = input.patronId ?? null;
  if (input.title !== undefined) patch.title = input.title;
  if (input.body !== undefined) patch.body = input.body;
  if (input.imageUrls !== undefined) patch.image_urls = input.imageUrls;
  if (input.publishedAt !== undefined) patch.published_at = input.publishedAt;

  const { data, error } = await supabase
    .from("patenschaft_updates")
    .update(patch)
    .eq("id", id)
    .select("*")
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data ? mapUpdate(data as UpdateRow) : null;
}

export async function supabaseDeleteUpdate(id: string): Promise<boolean> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("patenschaft_updates")
    .delete()
    .eq("id", id)
    .select("id");

  if (error) throw new Error(error.message);
  return (data?.length ?? 0) > 0;
}
