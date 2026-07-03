import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getWaschbaerWithGalleryById, replaceWaschbaerGallery } from "@/lib/waschbaerStore";
import { parseWaschbaerGallery } from "@/lib/waschbaerGalleryParse";
import { requireAdmin } from "@/lib/requireAdmin";
import { apiErrorResponse } from "@/lib/apiError";

function revalidateWaschbaerPages(slug?: string) {
  revalidatePath("/waschbaeren");
  revalidatePath("/");
  revalidatePath("/patenschaften");
  revalidatePath("/sitemap.xml");
  if (slug) {
    revalidatePath(`/waschbaeren/${slug}`);
  }
}

export async function PUT(request: Request) {
  const authError = await requireAdmin();
  if (authError) return authError;

  const body = (await request.json()) as Record<string, unknown>;
  const waschbaerId = typeof body.waschbaerId === "string" ? body.waschbaerId.trim() : "";
  if (!waschbaerId) {
    return NextResponse.json({ error: "Waschbär-ID fehlt." }, { status: 400 });
  }

  try {
    const gallery = parseWaschbaerGallery(body.gallery);
    await replaceWaschbaerGallery(waschbaerId, gallery);

    const waschbaer = await getWaschbaerWithGalleryById(waschbaerId);
    if (!waschbaer) {
      return NextResponse.json({ error: "Waschbär nicht gefunden." }, { status: 404 });
    }

    revalidateWaschbaerPages(waschbaer.slug);
    return NextResponse.json({ waschbaer });
  } catch (error) {
    return apiErrorResponse(error, "Galerie konnte nicht gespeichert werden.");
  }
}
