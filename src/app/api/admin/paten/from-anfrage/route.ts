import { NextResponse } from "next/server";
import {
  buildPatenFromAnfrage,
  parsePatenschaftSubmission,
  suggestAccessCodeFromAnfrage,
} from "@/lib/patenschaftFromAnfrage";
import {
  createPaten,
  findAccessCodeForPatron,
  getPatenByFormSubmissionId,
  isPatenschaftSlotTaken,
} from "@/lib/patenschaftStore";
import { requireAdmin } from "@/lib/requireAdmin";
import { apiErrorResponse } from "@/lib/apiError";
import { getFormSubmissionById } from "@/lib/supabase/formSubmissions";
import { isSupabaseConfigured } from "@/lib/supabase/admin";
import { listWaschbaeren } from "@/lib/waschbaerStore";

export async function POST(request: Request) {
  const authError = await requireAdmin();
  if (authError) return authError;

  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Paten aus Anfragen erfordert Supabase." },
      { status: 503 }
    );
  }

  let body: { submissionId?: string; accessCode?: string; notiz?: string };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 400 });
  }

  const submissionId = body.submissionId?.trim();
  if (!submissionId) {
    return NextResponse.json({ error: "Anfrage-ID fehlt." }, { status: 400 });
  }

  try {
    const existing = await getPatenByFormSubmissionId(submissionId);
    if (existing) {
      return NextResponse.json(
        { error: "Für diese Anfrage existiert bereits ein Pate.", pate: existing },
        { status: 409 }
      );
    }

    const submission = await getFormSubmissionById(submissionId);
    if (!submission) {
      return NextResponse.json({ error: "Anfrage nicht gefunden." }, { status: 404 });
    }

    if (submission.type !== "patenschaft") {
      return NextResponse.json(
        { error: "Nur Patenschafts-Anfragen können als Pate angelegt werden." },
        { status: 400 }
      );
    }

    const waschbaeren = await listWaschbaeren();
    const parsed = parsePatenschaftSubmission(
      submission.payload,
      waschbaeren.map((w) => ({ slug: w.slug, name: w.name }))
    );

    if ("error" in parsed) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    let accessCode = body.accessCode?.trim().toUpperCase();
    if (!accessCode) {
      const existingCode = await findAccessCodeForPatron(parsed.email);
      accessCode = existingCode ?? suggestAccessCodeFromAnfrage(parsed);
    }

    if (await isPatenschaftSlotTaken(accessCode, parsed.waschbaerSlug)) {
      return NextResponse.json(
        {
          error:
            "Für diese Person existiert bereits eine Patenschaft für diesen Waschbären mit diesem Zugangscode.",
        },
        { status: 409 }
      );
    }

    const pateInput = buildPatenFromAnfrage(submission, parsed, {
      accessCode,
      notiz: body.notiz?.trim() || undefined,
    });

    const pate = await createPaten(pateInput);
    return NextResponse.json({ pate, parsed }, { status: 201 });
  } catch (error) {
    return apiErrorResponse(error, "Pate konnte nicht aus der Anfrage erstellt werden.");
  }
}
