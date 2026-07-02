import { waschbaeren as staticWaschbaeren } from "@/data/waschbaeren";
import {
  getStaticWaschbaerGalerie,
  getStaticWaschbaerProfilfoto,
  getWaschbaerFeaturedFoto,
  hasStaticWaschbaerEchteFotos,
  normalizeWaschbaerGalerie,
  staticWaschbaerGalerien,
} from "@/data/photos";
import { isSupabaseConfigured } from "@/lib/supabase/admin";
import * as db from "@/lib/supabase/waschbaerStore";
import type { Waschbaer } from "@/data/waschbaeren";
import type { WaschbaerGalerieFoto } from "@/data/photos";
import type {
  WaschbaerGalleryInput,
  WaschbaerGalleryItem,
  WaschbaerInput,
  WaschbaerPublic,
  WaschbaerRecord,
  WaschbaerWithGallery,
} from "@/types/waschbaer";

function galleryToPublic(items: WaschbaerGalleryItem[]): WaschbaerGalerieFoto[] {
  return normalizeWaschbaerGalerie(
    items.map(({ id: _id, waschbaerId: _wid, sortOrder: _sort, ...foto }) => foto)
  );
}

function resolveProfilfoto(slug: string, gallery: WaschbaerGalerieFoto[]): string {
  const featured = getWaschbaerFeaturedFoto(gallery);
  if (featured) return featured.src;
  return getStaticWaschbaerProfilfoto(slug);
}

function hasEchteFotos(slug: string, gallery: WaschbaerGalerieFoto[]): boolean {
  return gallery.length > 0 || hasStaticWaschbaerEchteFotos(slug);
}

async function useDatabase(): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  try {
    return (await db.supabaseWaschbaerCount()) > 0;
  } catch {
    return false;
  }
}

function staticRecord(w: Waschbaer, index: number): WaschbaerRecord {
  return {
    ...w,
    id: `static-${w.slug}`,
    published: true,
    sortOrder: index,
  };
}

function staticWithGallery(w: Waschbaer, index: number): WaschbaerWithGallery {
  const gallery = getStaticWaschbaerGalerie(w.slug).map((foto, photoIndex) => ({
    ...foto,
    id: `static-${w.slug}-${photoIndex}`,
    waschbaerId: `static-${w.slug}`,
    sortOrder: photoIndex,
  }));

  return {
    ...staticRecord(w, index),
    gallery,
  };
}

export async function listWaschbaeren(includeUnpublished = false): Promise<WaschbaerRecord[]> {
  if (await useDatabase()) {
    return db.supabaseListWaschbaeren(includeUnpublished);
  }
  return staticWaschbaeren.map(staticRecord);
}

export async function getWaschbaerBySlug(
  slug: string,
  includeUnpublished = false
): Promise<WaschbaerRecord | null> {
  if (await useDatabase()) {
    return db.supabaseGetWaschbaerBySlug(slug, includeUnpublished);
  }
  const index = staticWaschbaeren.findIndex((w) => w.slug === slug);
  if (index < 0) return null;
  return staticRecord(staticWaschbaeren[index], index);
}

export async function getWaschbaerGalerie(slug: string): Promise<WaschbaerGalerieFoto[]> {
  if (await useDatabase()) {
    const waschbaer = await db.supabaseGetWaschbaerBySlug(slug, true);
    if (!waschbaer) return getStaticWaschbaerGalerie(slug);
    const gallery = await db.supabaseListGallery(waschbaer.id);
    if (gallery.length > 0) return galleryToPublic(gallery);
    return getStaticWaschbaerGalerie(slug);
  }
  return getStaticWaschbaerGalerie(slug);
}

export async function getWaschbaerWithGallery(
  slug: string,
  includeUnpublished = false
): Promise<WaschbaerWithGallery | null> {
  if (await useDatabase()) {
    const fromDb = await db.supabaseGetWaschbaerWithGallery(slug, includeUnpublished);
    if (!fromDb) {
      const index = staticWaschbaeren.findIndex((w) => w.slug === slug);
      if (index < 0) return null;
      return staticWithGallery(staticWaschbaeren[index], index);
    }
    if (fromDb.gallery.length === 0) {
      return {
        ...fromDb,
        gallery: getStaticWaschbaerGalerie(slug).map((foto, photoIndex) => ({
          ...foto,
          id: `static-${slug}-${photoIndex}`,
          waschbaerId: fromDb.id,
          sortOrder: photoIndex,
        })),
      };
    }
    return fromDb;
  }

  const index = staticWaschbaeren.findIndex((w) => w.slug === slug);
  if (index < 0) return null;
  return staticWithGallery(staticWaschbaeren[index], index);
}

export async function listWaschbaerenPublic(): Promise<WaschbaerPublic[]> {
  const list = await listWaschbaeren();
  return Promise.all(
    list.map(async (waschbaer) => {
      const gallery = await getWaschbaerGalerie(waschbaer.slug);
      return {
        ...waschbaer,
        profilFoto: resolveProfilfoto(waschbaer.slug, gallery),
        hasEchteFotos: hasEchteFotos(waschbaer.slug, gallery),
      };
    })
  );
}

export async function listWaschbaerenWithGallery(
  includeUnpublished = false
): Promise<WaschbaerWithGallery[]> {
  if (await useDatabase()) {
    return db.supabaseListWaschbaerenWithGallery(includeUnpublished);
  }
  return staticWaschbaeren.map(staticWithGallery);
}

export async function isWaschbaerSlugTaken(slug: string, excludeId?: string): Promise<boolean> {
  if (await useDatabase()) {
    return db.supabaseIsSlugTaken(slug, excludeId);
  }
  return staticWaschbaeren.some((w) => w.slug === slug && `static-${w.slug}` !== excludeId);
}

export async function createWaschbaer(input: WaschbaerInput): Promise<WaschbaerRecord> {
  if (!isSupabaseConfigured()) {
    throw new Error("Waschbär-Verwaltung erfordert Supabase.");
  }
  return db.supabaseCreateWaschbaer(input);
}

export async function updateWaschbaer(
  id: string,
  input: Partial<WaschbaerInput>
): Promise<WaschbaerRecord | null> {
  if (!isSupabaseConfigured()) {
    throw new Error("Waschbär-Verwaltung erfordert Supabase.");
  }
  return db.supabaseUpdateWaschbaer(id, input);
}

export async function deleteWaschbaer(id: string): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    throw new Error("Waschbär-Verwaltung erfordert Supabase.");
  }
  return db.supabaseDeleteWaschbaer(id);
}

export async function addWaschbaerGalleryPhoto(
  waschbaerId: string,
  input: WaschbaerGalleryInput
): Promise<WaschbaerGalleryItem> {
  if (!isSupabaseConfigured()) {
    throw new Error("Waschbär-Verwaltung erfordert Supabase.");
  }
  return db.supabaseAddGalleryPhoto(waschbaerId, input);
}

export async function updateWaschbaerGalleryPhoto(
  id: string,
  input: Partial<WaschbaerGalleryInput>
): Promise<WaschbaerGalleryItem | null> {
  if (!isSupabaseConfigured()) {
    throw new Error("Waschbär-Verwaltung erfordert Supabase.");
  }
  return db.supabaseUpdateGalleryPhoto(id, input);
}

export async function deleteWaschbaerGalleryPhoto(id: string): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    throw new Error("Waschbär-Verwaltung erfordert Supabase.");
  }
  return db.supabaseDeleteGalleryPhoto(id);
}

export async function replaceWaschbaerGallery(
  waschbaerId: string,
  photos: WaschbaerGalleryInput[]
): Promise<WaschbaerGalleryItem[]> {
  if (!isSupabaseConfigured()) {
    throw new Error("Waschbär-Verwaltung erfordert Supabase.");
  }
  return db.supabaseReplaceGallery(waschbaerId, photos);
}

export async function importStaticWaschbaeren(): Promise<{ imported: number }> {
  if (!isSupabaseConfigured()) {
    throw new Error("Waschbär-Import erfordert Supabase.");
  }

  const existing = await db.supabaseWaschbaerCount();
  if (existing > 0) {
    throw new Error("Es sind bereits Waschbär-Profile in der Datenbank. Import nur bei leerer Tabelle.");
  }

  let imported = 0;
  for (const [index, waschbaer] of staticWaschbaeren.entries()) {
    const created = await db.supabaseCreateWaschbaer({
      slug: waschbaer.slug,
      name: waschbaer.name,
      aufgenommen: waschbaer.aufgenommen,
      eigenschaften: waschbaer.eigenschaften,
      kurztext: waschbaer.kurztext,
      geschichte: waschbaer.geschichte,
      charakter: waschbaer.charakter,
      farbe: waschbaer.farbe,
      published: true,
      sortOrder: index,
    });

    const gallery = staticWaschbaerGalerien[waschbaer.slug] ?? [];
    if (gallery.length > 0) {
      await db.supabaseReplaceGallery(
        created.id,
        gallery.map((foto, photoIndex) => ({
          src: foto.src,
          alt: foto.alt,
          width: foto.width,
          height: foto.height,
          caption: foto.caption,
          featured: foto.featured ?? false,
          objectPosition: foto.objectPosition,
          sortOrder: photoIndex,
        }))
      );
    }

    imported += 1;
  }

  return { imported };
}

export { staticWaschbaerGalerien };
