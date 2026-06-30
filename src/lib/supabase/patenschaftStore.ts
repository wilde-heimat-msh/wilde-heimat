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

export async function supabaseGetPatenByAccessCode(
  code: string
): Promise<PatenschaftPate | null> {
  const normalized = normalizeAccessCode(code);
  const paten = await supabaseListPaten();
  return (
    paten.find(
      (p) => p.active && normalizeAccessCode(p.accessCode) === normalized
    ) ?? null
  );
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

export async function supabaseIsAccessCodeTaken(
  code: string,
  excludeId?: string
): Promise<boolean> {
  const normalized = normalizeAccessCode(code);
  const paten = await supabaseListPaten();
  return paten.some(
    (p) =>
      p.id !== excludeId && normalizeAccessCode(p.accessCode) === normalized
  );
}

export async function supabaseCreatePaten(
  input: Omit<PatenschaftPate, "id" | "createdAt" | "updatedAt">
): Promise<PatenschaftPate> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("patenschaft_paten")
    .insert({
      name: input.name,
      access_code: normalizeAccessCode(input.accessCode),
      waschbaer_slug: input.waschbaerSlug,
      stufe_id: input.stufeId,
      active: input.active,
      email: input.email ?? null,
      notiz: input.notiz ?? null,
    })
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

  const { data, error } = await supabase
    .from("patenschaft_paten")
    .update(patch)
    .eq("id", id)
    .select("*")
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data ? mapPate(data as PateRow) : null;
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
