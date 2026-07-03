import { NextResponse } from "next/server";
import { buildUrkundeFromPate } from "@/lib/patenschaftFromAnfrage";
import { getPatenById, listPatenschaftenForPatron } from "@/lib/patenschaftStore";
import { isFormMailConfigured } from "@/lib/formMail";
import { requireAdmin } from "@/lib/requireAdmin";
import { apiErrorResponse } from "@/lib/apiError";
import { getFormSubmissionById } from "@/lib/supabase/formSubmissions";
import { getWaschbaerWithGallery, listWaschbaerenPublic } from "@/lib/waschbaerStore";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const authError = await requireAdmin();
  if (authError) return authError;

  const { id } = await context.params;

  try {
    const pate = await getPatenById(id);
    if (!pate) {
      return NextResponse.json({ error: "Pate nicht gefunden." }, { status: 404 });
    }

    const waschbaerPublic = (await listWaschbaerenPublic()).find(
      (w) => w.slug === pate.waschbaerSlug
    );
    const waschbaerRecord = await getWaschbaerWithGallery(pate.waschbaerSlug, true);
    const submission = pate.formSubmissionId
      ? await getFormSubmissionById(pate.formSubmissionId)
      : null;
    const urkunde = buildUrkundeFromPate(
      pate,
      waschbaerPublic
        ? {
            name: waschbaerPublic.name,
            slug: waschbaerPublic.slug,
            profilFoto: waschbaerPublic.profilFoto,
            hasEchteFotos: waschbaerPublic.hasEchteFotos,
          }
        : waschbaerRecord
          ? { name: waschbaerRecord.name, slug: waschbaerRecord.slug }
          : undefined
    );

    const patenschaften = await listPatenschaftenForPatron(id);
    const waschbaeren = await listWaschbaerenPublic();

    const patenschaftOverview = patenschaften.map((entry) => {
      const tier = waschbaeren.find((w) => w.slug === entry.waschbaerSlug);
      return {
        id: entry.id,
        waschbaerSlug: entry.waschbaerSlug,
        waschbaerName: tier?.name ?? entry.waschbaerSlug,
        stufeId: entry.stufeId,
        active: entry.active,
        urkundenNr: entry.urkundenNr,
        patenschaftStart: entry.patenschaftStart,
      };
    });

    return NextResponse.json({
      pate,
      waschbaer: waschbaerPublic ?? waschbaerRecord,
      submission,
      urkunde,
      patenschaften: patenschaftOverview,
      mail: { configured: isFormMailConfigured() },
    });
  } catch (error) {
    return apiErrorResponse(error, "Paten-Kartei konnte nicht geladen werden.");
  }
}
