import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { isValidWaschbaerSlug } from "@/lib/waschbaerSlug";
import {
  createWaschbaer,
  deleteWaschbaer,
  getWaschbaerWithGallery,
  importStaticWaschbaeren,
  isWaschbaerSlugTaken,
  listWaschbaerenWithGallery,
  replaceWaschbaerGallery,
  updateWaschbaer,
} from "@/lib/waschbaerStore";
import { isSupabaseConfigured } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/requireAdmin";
import { apiErrorResponse } from "@/lib/apiError";
import type { WaschbaerGalleryInput, WaschbaerInput } from "@/types/waschbaer";

function revalidateWaschbaerPages(slug?: string) {
  revalidatePath("/waschbaeren");
  revalidatePath("/");
  revalidatePath("/patenschaften");
  revalidatePath("/sitemap.xml");
  if (slug) {
    revalidatePath(`/waschbaeren/${slug}`);
  }
}

function parseWaschbaerInput(body: Record<string, unknown>): WaschbaerInput | { error: string } {
  const slug = typeof body.slug === "string" ? body.slug.trim() : "";
  const name = typeof body.name === "string" ? body.name.trim() : "";

  if (!slug || !name) {
    return { error: "Name und URL-Kürzel sind Pflichtfelder." };
  }

  if (!isValidWaschbaerSlug(slug)) {
    return { error: "URL-Kürzel: nur Kleinbuchstaben, Zahlen und Bindestriche." };
  }

  const eigenschaften = Array.isArray(body.eigenschaften)
    ? body.eigenschaften.map(String).map((s) => s.trim()).filter(Boolean)
    : typeof body.eigenschaften === "string"
      ? body.eigenschaften
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : [];

  return {
    slug,
    name,
    aufgenommen: typeof body.aufgenommen === "string" ? body.aufgenommen.trim() : "",
    eigenschaften,
    kurztext: typeof body.kurztext === "string" ? body.kurztext.trim() : "",
    geschichte: typeof body.geschichte === "string" ? body.geschichte.trim() : "",
    charakter: typeof body.charakter === "string" ? body.charakter.trim() : "",
    farbe:
      typeof body.farbe === "string" && body.farbe.trim()
        ? body.farbe.trim()
        : "from-neutral-700 to-neutral-500",
    published: body.published !== false,
    sortOrder: typeof body.sortOrder === "number" ? body.sortOrder : 0,
  };
}

function parseGallery(photos: unknown): WaschbaerGalleryInput[] | { error: string } {
  if (!Array.isArray(photos)) return [];

  const parsed: WaschbaerGalleryInput[] = [];
  for (const [index, item] of photos.entries()) {
    if (!item || typeof item !== "object") continue;
    const photo = item as Record<string, unknown>;
    const src = typeof photo.src === "string" ? photo.src.trim() : "";
    if (!src) continue;

    parsed.push({
      src,
      alt: typeof photo.alt === "string" ? photo.alt.trim() : "",
      width: typeof photo.width === "number" ? photo.width : 768,
      height: typeof photo.height === "number" ? photo.height : 1024,
      caption: typeof photo.caption === "string" ? photo.caption.trim() : undefined,
      featured: photo.featured === true,
      objectPosition:
        typeof photo.objectPosition === "string" ? photo.objectPosition : "center center",
      sortOrder: typeof photo.sortOrder === "number" ? photo.sortOrder : index,
    });
  }

  return parsed;
}

export async function GET() {
  const authError = await requireAdmin();
  if (authError) return authError;

  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Waschbär-Verwaltung erfordert Supabase.", waschbaeren: [], usesDatabase: false },
      { status: 503 }
    );
  }

  try {
    const waschbaeren = await listWaschbaerenWithGallery(true);
    return NextResponse.json({ waschbaeren, usesDatabase: true });
  } catch (error) {
    return apiErrorResponse(error, "Waschbären konnten nicht geladen werden.");
  }
}

export async function POST(request: Request) {
  const authError = await requireAdmin();
  if (authError) return authError;

  const body = (await request.json()) as Record<string, unknown>;
  const parsed = parseWaschbaerInput(body);
  if ("error" in parsed) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  if (await isWaschbaerSlugTaken(parsed.slug)) {
    return NextResponse.json({ error: "Dieses URL-Kürzel ist bereits vergeben." }, { status: 409 });
  }

  try {
    const waschbaer = await createWaschbaer(parsed);
    const galleryParsed = parseGallery(body.gallery);
    if (!("error" in galleryParsed) && galleryParsed.length > 0) {
      await replaceWaschbaerGallery(waschbaer.id, galleryParsed);
    }

    const saved = await getWaschbaerWithGallery(waschbaer.slug, true);
    revalidateWaschbaerPages(waschbaer.slug);
    return NextResponse.json({ waschbaer: saved }, { status: 201 });
  } catch (error) {
    return apiErrorResponse(error, "Waschbär konnte nicht angelegt werden.");
  }
}

export async function PUT(request: Request) {
  const authError = await requireAdmin();
  if (authError) return authError;

  const body = (await request.json()) as Record<string, unknown>;
  const id = typeof body.id === "string" ? body.id : "";
  if (!id) {
    return NextResponse.json({ error: "ID fehlt." }, { status: 400 });
  }

  const parsed = parseWaschbaerInput(body);
  if ("error" in parsed) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  if (await isWaschbaerSlugTaken(parsed.slug, id)) {
    return NextResponse.json({ error: "Dieses URL-Kürzel ist bereits vergeben." }, { status: 409 });
  }

  try {
    const waschbaer = await updateWaschbaer(id, parsed);
    if (!waschbaer) {
      return NextResponse.json({ error: "Waschbär nicht gefunden." }, { status: 404 });
    }

    if (body.gallery !== undefined) {
      const galleryParsed = parseGallery(body.gallery);
      if ("error" in galleryParsed) {
        return NextResponse.json({ error: galleryParsed.error }, { status: 400 });
      }
      await replaceWaschbaerGallery(waschbaer.id, galleryParsed);
    }

    const saved = await getWaschbaerWithGallery(waschbaer.slug, true);
    revalidateWaschbaerPages(waschbaer.slug);
    return NextResponse.json({ waschbaer: saved });
  } catch (error) {
    return apiErrorResponse(error, "Waschbär konnte nicht gespeichert werden.");
  }
}

export async function DELETE(request: Request) {
  const authError = await requireAdmin();
  if (authError) return authError;

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "ID fehlt." }, { status: 400 });
  }

  try {
    const ok = await deleteWaschbaer(id);
    if (!ok) {
      return NextResponse.json({ error: "Waschbär nicht gefunden." }, { status: 404 });
    }

    revalidateWaschbaerPages();
    return NextResponse.json({ ok: true });
  } catch (error) {
    return apiErrorResponse(error, "Waschbär konnte nicht gelöscht werden.");
  }
}
