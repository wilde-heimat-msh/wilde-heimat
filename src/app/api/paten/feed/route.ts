import { NextResponse } from "next/server";
import { getAuthenticatedPatens } from "@/lib/patenAuth";
import { getUpdatesForPatenList, listUpdates } from "@/lib/patenschaftStore";
import { getPatenschaftStufe, patenStufeHatPortalFeed } from "@/data/patenschaften";
import type { PatenschaftStufeId } from "@/data/patenschaften";
import { getWaschbaerFeaturedFoto } from "@/data/photos";
import { getWaschbaerBySlug, getWaschbaerGalerie } from "@/lib/waschbaerStore";
import { apiErrorResponse } from "@/lib/apiError";

const STUFE_RANK: Record<PatenschaftStufeId, number> = {
  bronze: 1,
  silber: 2,
  gold: 3,
};

function getHighestStufe(stufen: PatenschaftStufeId[]): PatenschaftStufeId {
  return stufen.reduce(
    (best, stufe) => (STUFE_RANK[stufe] > STUFE_RANK[best] ? stufe : best),
    "bronze" as PatenschaftStufeId
  );
}

export async function GET() {
  const paten = await getAuthenticatedPatens();
  if (paten.length === 0) {
    return NextResponse.json({ error: "Nicht angemeldet." }, { status: 401 });
  }

  try {
    const primary = paten[0];
    const allUpdates = await listUpdates();
    const updates = getUpdatesForPatenList(allUpdates, paten);
    const highestStufe = getHighestStufe(paten.map((p) => p.stufeId));

    const patenschaften = await Promise.all(
      paten.map(async (pate) => {
        const waschbaer = await getWaschbaerBySlug(pate.waschbaerSlug);
        const galerie = waschbaer ? await getWaschbaerGalerie(waschbaer.slug) : [];
        const featuredFoto = getWaschbaerFeaturedFoto(galerie);

        return {
          id: pate.id,
          stufeId: pate.stufeId,
          stufeName: getPatenschaftStufe(pate.stufeId).name,
          waschbaer: waschbaer
            ? {
                name: waschbaer.name,
                slug: waschbaer.slug,
                kurztext: waschbaer.kurztext,
                foto: featuredFoto?.src ?? null,
              }
            : null,
        };
      })
    );

    const waschbaerNames = new Map(
      patenschaften
        .filter((p) => p.waschbaer)
        .map((p) => [p.waschbaer!.slug, p.waschbaer!.name])
    );

    return NextResponse.json({
      pate: {
        id: primary.id,
        name: primary.name,
        stufeId: highestStufe,
        stufeName: getPatenschaftStufe(highestStufe).name,
        patenschaftCount: paten.length,
        hasPortalFeed: paten.some((p) => patenStufeHatPortalFeed(p.stufeId)),
      },
      patenschaften,
      updates: updates.map((update) => ({
        ...update,
        waschbaerName: waschbaerNames.get(update.waschbaerSlug),
      })),
    });
  } catch (error) {
    return apiErrorResponse(error, "Feed konnte nicht geladen werden.");
  }
}
