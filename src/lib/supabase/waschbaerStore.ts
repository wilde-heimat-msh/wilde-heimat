import { getSupabaseAdmin } from "@/lib/supabase/admin";
import type {
  WaschbaerGalleryInput,
  WaschbaerGalleryItem,
  WaschbaerInput,
  WaschbaerRecord,
  WaschbaerWithGallery,
} from "@/types/waschbaer";

type WaschbaerRow = {
  id: string;
  slug: string;
  name: string;
  aufgenommen: string;
  eigenschaften: string[];
  kurztext: string;
  geschichte: string;
  charakter: string;
  farbe: string;
  published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

type GalleryRow = {
  id: string;
  waschbaer_id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  caption: string | null;
  featured: boolean;
  object_position: string;
  sort_order: number;
  created_at: string;
};

function mapWaschbaer(row: WaschbaerRow): WaschbaerRecord {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    aufgenommen: row.aufgenommen,
    eigenschaften: row.eigenschaften ?? [],
    kurztext: row.kurztext,
    geschichte: row.geschichte,
    charakter: row.charakter,
    farbe: row.farbe,
    published: row.published,
    sortOrder: row.sort_order,
  };
}

function mapGallery(row: GalleryRow): WaschbaerGalleryItem {
  return {
    id: row.id,
    waschbaerId: row.waschbaer_id,
    src: row.src,
    alt: row.alt,
    width: row.width,
    height: row.height,
    caption: row.caption ?? undefined,
    featured: row.featured,
    objectPosition: row.object_position,
    sortOrder: row.sort_order,
  };
}

export async function supabaseWaschbaerCount(): Promise<number> {
  const supabase = getSupabaseAdmin();
  const { count, error } = await supabase
    .from("waschbaeren")
    .select("*", { count: "exact", head: true });

  if (error) throw new Error(error.message);
  return count ?? 0;
}

export async function supabaseListWaschbaeren(
  includeUnpublished = false
): Promise<WaschbaerRecord[]> {
  const supabase = getSupabaseAdmin();
  let query = supabase.from("waschbaeren").select("*").order("sort_order").order("name");

  if (!includeUnpublished) {
    query = query.eq("published", true);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data as WaschbaerRow[]).map(mapWaschbaer);
}

export async function supabaseGetWaschbaerBySlug(
  slug: string,
  includeUnpublished = false
): Promise<WaschbaerRecord | null> {
  const supabase = getSupabaseAdmin();
  let query = supabase.from("waschbaeren").select("*").eq("slug", slug);

  if (!includeUnpublished) {
    query = query.eq("published", true);
  }

  const { data, error } = await query.maybeSingle();
  if (error) throw new Error(error.message);
  return data ? mapWaschbaer(data as WaschbaerRow) : null;
}

export async function supabaseGetWaschbaerById(id: string): Promise<WaschbaerRecord | null> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.from("waschbaeren").select("*").eq("id", id).maybeSingle();

  if (error) throw new Error(error.message);
  return data ? mapWaschbaer(data as WaschbaerRow) : null;
}

export async function supabaseListGallery(waschbaerId: string): Promise<WaschbaerGalleryItem[]> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("waschbaer_gallery")
    .select("*")
    .eq("waschbaer_id", waschbaerId)
    .order("sort_order")
    .order("created_at");

  if (error) throw new Error(error.message);
  return (data as GalleryRow[]).map(mapGallery);
}

export async function supabaseGetWaschbaerWithGallery(
  slug: string,
  includeUnpublished = false
): Promise<WaschbaerWithGallery | null> {
  const waschbaer = await supabaseGetWaschbaerBySlug(slug, includeUnpublished);
  if (!waschbaer) return null;

  const gallery = await supabaseListGallery(waschbaer.id);
  return { ...waschbaer, gallery };
}

export async function supabaseListWaschbaerenWithGallery(
  includeUnpublished = false
): Promise<WaschbaerWithGallery[]> {
  const waschbaeren = await supabaseListWaschbaeren(includeUnpublished);
  return Promise.all(
    waschbaeren.map(async (waschbaer) => ({
      ...waschbaer,
      gallery: await supabaseListGallery(waschbaer.id),
    }))
  );
}

export async function supabaseIsSlugTaken(slug: string, excludeId?: string): Promise<boolean> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.from("waschbaeren").select("id").eq("slug", slug);

  if (error) throw new Error(error.message);
  return (data ?? []).some((row) => row.id !== excludeId);
}

export async function supabaseCreateWaschbaer(input: WaschbaerInput): Promise<WaschbaerRecord> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("waschbaeren")
    .insert({
      slug: input.slug,
      name: input.name,
      aufgenommen: input.aufgenommen,
      eigenschaften: input.eigenschaften,
      kurztext: input.kurztext,
      geschichte: input.geschichte,
      charakter: input.charakter,
      farbe: input.farbe,
      published: input.published ?? true,
      sort_order: input.sortOrder ?? 0,
    })
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return mapWaschbaer(data as WaschbaerRow);
}

export async function supabaseUpdateWaschbaer(
  id: string,
  input: Partial<WaschbaerInput>
): Promise<WaschbaerRecord | null> {
  const supabase = getSupabaseAdmin();
  const patch: Record<string, unknown> = {};

  if (input.slug !== undefined) patch.slug = input.slug;
  if (input.name !== undefined) patch.name = input.name;
  if (input.aufgenommen !== undefined) patch.aufgenommen = input.aufgenommen;
  if (input.eigenschaften !== undefined) patch.eigenschaften = input.eigenschaften;
  if (input.kurztext !== undefined) patch.kurztext = input.kurztext;
  if (input.geschichte !== undefined) patch.geschichte = input.geschichte;
  if (input.charakter !== undefined) patch.charakter = input.charakter;
  if (input.farbe !== undefined) patch.farbe = input.farbe;
  if (input.published !== undefined) patch.published = input.published;
  if (input.sortOrder !== undefined) patch.sort_order = input.sortOrder;

  const { data, error } = await supabase
    .from("waschbaeren")
    .update(patch)
    .eq("id", id)
    .select("*")
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data ? mapWaschbaer(data as WaschbaerRow) : null;
}

export async function supabaseDeleteWaschbaer(id: string): Promise<boolean> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.from("waschbaeren").delete().eq("id", id).select("id");

  if (error) throw new Error(error.message);
  return (data?.length ?? 0) > 0;
}

export async function supabaseAddGalleryPhoto(
  waschbaerId: string,
  input: WaschbaerGalleryInput
): Promise<WaschbaerGalleryItem> {
  const supabase = getSupabaseAdmin();

  if (input.featured) {
    await supabase
      .from("waschbaer_gallery")
      .update({ featured: false })
      .eq("waschbaer_id", waschbaerId);
  }

  const { data, error } = await supabase
    .from("waschbaer_gallery")
    .insert({
      waschbaer_id: waschbaerId,
      src: input.src,
      alt: input.alt,
      width: input.width,
      height: input.height,
      caption: input.caption ?? null,
      featured: input.featured ?? false,
      object_position: input.objectPosition ?? "center center",
      sort_order: input.sortOrder ?? 0,
    })
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return mapGallery(data as GalleryRow);
}

export async function supabaseUpdateGalleryPhoto(
  id: string,
  input: Partial<WaschbaerGalleryInput>
): Promise<WaschbaerGalleryItem | null> {
  const supabase = getSupabaseAdmin();

  if (input.featured) {
    const { data: existing } = await supabase
      .from("waschbaer_gallery")
      .select("waschbaer_id")
      .eq("id", id)
      .maybeSingle();

    if (existing?.waschbaer_id) {
      await supabase
        .from("waschbaer_gallery")
        .update({ featured: false })
        .eq("waschbaer_id", existing.waschbaer_id);
    }
  }

  const patch: Record<string, unknown> = {};
  if (input.src !== undefined) patch.src = input.src;
  if (input.alt !== undefined) patch.alt = input.alt;
  if (input.width !== undefined) patch.width = input.width;
  if (input.height !== undefined) patch.height = input.height;
  if (input.caption !== undefined) patch.caption = input.caption ?? null;
  if (input.featured !== undefined) patch.featured = input.featured;
  if (input.objectPosition !== undefined) patch.object_position = input.objectPosition;
  if (input.sortOrder !== undefined) patch.sort_order = input.sortOrder;

  const { data, error } = await supabase
    .from("waschbaer_gallery")
    .update(patch)
    .eq("id", id)
    .select("*")
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data ? mapGallery(data as GalleryRow) : null;
}

export async function supabaseDeleteGalleryPhoto(id: string): Promise<boolean> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.from("waschbaer_gallery").delete().eq("id", id).select("id");

  if (error) throw new Error(error.message);
  return (data?.length ?? 0) > 0;
}

export async function supabaseReplaceGallery(
  waschbaerId: string,
  photos: WaschbaerGalleryInput[]
): Promise<WaschbaerGalleryItem[]> {
  const supabase = getSupabaseAdmin();
  const { error: deleteError } = await supabase
    .from("waschbaer_gallery")
    .delete()
    .eq("waschbaer_id", waschbaerId);

  if (deleteError) throw new Error(deleteError.message);

  const results: WaschbaerGalleryItem[] = [];
  for (const [index, photo] of photos.entries()) {
    const item = await supabaseAddGalleryPhoto(waschbaerId, {
      ...photo,
      sortOrder: photo.sortOrder ?? index,
    });
    results.push(item);
  }

  return results;
}
