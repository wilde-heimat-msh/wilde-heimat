import { NextResponse } from "next/server";
import { apiErrorResponse } from "@/lib/apiError";
import { requireAdmin } from "@/lib/requireAdmin";
import { parseUrkundeDatenBody } from "@/lib/urkundePrintToken";
import { renderUrkundeVectorPdf } from "@/lib/urkundePdfServer";
import { urkundePdfFilename } from "@/lib/urkundeScale";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: Request) {
  const authError = await requireAdmin();
  if (authError) return authError;

  let body: { data?: unknown };
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
    const pdf = await renderUrkundeVectorPdf(data);
    const filename = urkundePdfFilename(data.pate, data.urkundenNr);

    return new NextResponse(new Uint8Array(pdf), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    return apiErrorResponse(error, "Vektor-PDF konnte nicht erzeugt werden.");
  }
}
