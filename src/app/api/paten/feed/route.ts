import { NextResponse } from "next/server";
import { getAuthenticatedPaten } from "@/lib/patenAuth";
import { getUpdatesForPaten, listUpdates } from "@/lib/patenschaftStore";
import { getWaschbaerBySlug } from "@/data/waschbaeren";
import { getPatenschaftStufe } from "@/data/patenschaften";
import { getWaschbaerProfilfoto } from "@/data/photos";

export async function GET() {
  const pate = await getAuthenticatedPaten();
  if (!pate) {
    return NextResponse.json({ error: "Nicht angemeldet." }, { status: 401 });
  }

  const waschbaer = getWaschbaerBySlug(pate.waschbaerSlug);
  const updates = getUpdatesForPaten(await listUpdates(), pate);

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
          foto: getWaschbaerProfilfoto(waschbaer.slug),
        }
      : null,
    updates,
  });
}
