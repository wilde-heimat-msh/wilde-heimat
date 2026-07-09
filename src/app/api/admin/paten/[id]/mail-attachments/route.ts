import { NextResponse } from "next/server";
import {
  createPatenMailPdfUploadSlot,
  MAX_PATEN_MAIL_PDF_BYTES,
} from "@/lib/patenMailStorage";
import { isSupabaseConfigured } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/requireAdmin";
import { apiErrorResponse } from "@/lib/apiError";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(request: Request, context: RouteContext) {
  const authError = await requireAdmin();
  if (authError) return authError;

  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      {
        error:
          "Supabase-Speicher ist nicht konfiguriert. PDF-Upload für große Anhänge nicht möglich.",
      },
      { status: 503 }
    );
  }

  const { id: pateId } = await context.params;

  let body: { filename?: string; sizeBytes?: number };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 400 });
  }

  const filename = body.filename?.trim();
  if (!filename) {
    return NextResponse.json({ error: "Dateiname fehlt." }, { status: 400 });
  }

  if (body.sizeBytes && body.sizeBytes > MAX_PATEN_MAIL_PDF_BYTES) {
    return NextResponse.json(
      {
        error: `PDF ist zu groß (max. ${Math.round(MAX_PATEN_MAIL_PDF_BYTES / 1024 / 1024)} MB pro Datei).`,
      },
      { status: 400 }
    );
  }

  try {
    const slot = await createPatenMailPdfUploadSlot(pateId, filename);
    if ("error" in slot) {
      return NextResponse.json({ error: slot.error }, { status: 503 });
    }

    return NextResponse.json({
      storagePath: slot.storagePath,
      signedUrl: slot.signedUrl,
      token: slot.token,
      maxBytes: MAX_PATEN_MAIL_PDF_BYTES,
    });
  } catch (error) {
    return apiErrorResponse(error, "Upload-Vorbereitung fehlgeschlagen.");
  }
}
