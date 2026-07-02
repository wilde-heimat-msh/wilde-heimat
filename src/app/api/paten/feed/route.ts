import { NextResponse } from "next/server";
import { getAuthenticatedPaten } from "@/lib/patenAuth";
import { getUpdatesForPaten, listUpdates } from "@/lib/patenschaftStore";
import { getPatenschaftStufe } from "@/data/patenschaften";
import { getWaschbaerFeaturedFoto } from "@/data/photos";
import { getWaschbaerBySlug, getWaschbaerGalerie } from "@/lib/waschbaerStore";
import { apiErrorResponse } from "@/lib/apiError";

export async function GET() {
  const pate = await getAuthenticatedPaten();
  if (!pate) {
    return NextResponse.json({ error: "Nicht angemeldet." }, { status: 401 });
  }

  try {
    const waschbaer = await getWaschbaerBySlug(pate.waschbaerSlug);
    const updates = getUpdatesForPaten(await listUpdates(), pate);
    const galerie = waschbaer ? await getWaschbaerGalerie(waschbaer.slug) : [];
    const featuredFoto = getWaschbaerFeaturedFoto(galerie);

    return NextResponse.json({
    pate: {
      id: pate.id,
      name: pate.name,
      waschbaerSlug: pate.waschbaerSlug,
      stufeId: pate.stufeId,
      stufeName: getPatenschaftStufe(pate.stufeId).name,
    },
    waschbaer: waschbaer
      ? {
          name: waschbaer.name,
          slug: waschbaer.slug,
          kurztext: waschbaer.kurztext,
          foto: featuredFoto?.src ?? null,
        }
      : null,
    updates,
  });
  } catch (error) {
    return apiErrorResponse(error, "Feed konnte nicht geladen werden.");
  }
}
