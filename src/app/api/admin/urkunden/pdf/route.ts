import { NextResponse } from "next/server";
import { apiErrorResponse } from "@/lib/apiError";
import { requireAdmin } from "@/lib/requireAdmin";
import {
  parseUrkundeDatenBody,
  signUrkundePrintToken,
  verifyUrkundePrintToken,
} from "@/lib/urkundePrintToken";
import { renderUrkundeVectorPdf } from "@/lib/urkundePdfServer";
import { urkundePdfFilename } from "@/lib/urkundeScale";

export const runtime = "nodejs";
export const maxDuration = 60;

function pdfResponse(pdf: Buffer, filename: string) {
  return new NextResponse(new Uint8Array(pdf), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}

/** Safari-sicherer Download: Token in der URL, Browser lädt die PDF nativ. */
export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get("t")?.trim();
  if (!token) {
    return NextResponse.json({ error: "Token fehlt." }, { status: 400 });
  }

  const data = verifyUrkundePrintToken(token);
  if (!data) {
    return NextResponse.json({ error: "Token ungültig oder abgelaufen." }, { status: 401 });
  }

  try {
    const pdf = await renderUrkundeVectorPdf(data);
    return pdfResponse(pdf, urkundePdfFilename(data.pate, data.urkundenNr));
  } catch (error) {
    return apiErrorResponse(error, "Vektor-PDF konnte nicht erzeugt werden.");
  }
}

export async function POST(request: Request) {
  const authError = await requireAdmin();
  if (authError) return authError;

  let body: { data?: unknown; prepare?: boolean };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 400 });
  }

  const data = parseUrkundeDatenBody(body.data);
  if (!data) {
    return NextResponse.json(
      { error: "Urkundendaten unvollständig (Pate, Tier, Stufe, Nummer)." },
      { status: 400 }
    );
  }

  try {
    // Prepare-Modus: Token für iframe-/Safari-Download
    if (body.prepare) {
      const token = signUrkundePrintToken(data);
      return NextResponse.json({
        token,
        filename: urkundePdfFilename(data.pate, data.urkundenNr),
        downloadUrl: `/api/admin/urkunden/pdf?t=${encodeURIComponent(token)}`,
      });
    }

    const pdf = await renderUrkundeVectorPdf(data);
    return pdfResponse(pdf, urkundePdfFilename(data.pate, data.urkundenNr));
  } catch (error) {
    return apiErrorResponse(error, "Vektor-PDF konnte nicht erzeugt werden.");
  }
}
