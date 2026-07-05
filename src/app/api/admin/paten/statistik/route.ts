import { NextResponse } from "next/server";
import { computePatenschaftStatistik } from "@/lib/patenschaftPayment";
import { listPatenschaftZahlungen } from "@/lib/patenschaftZahlungenStore";
import { listPaten } from "@/lib/patenschaftStore";
import { requireAdmin } from "@/lib/requireAdmin";
import { apiErrorResponse } from "@/lib/apiError";

export async function GET() {
  const authError = await requireAdmin();
  if (authError) return authError;

  try {
    const [paten, zahlungen] = await Promise.all([listPaten(), listPatenschaftZahlungen()]);
    const statistik = computePatenschaftStatistik({ paten, zahlungen });
    return NextResponse.json({ statistik, zahlungenAnzahl: zahlungen.length });
  } catch (error) {
    return apiErrorResponse(error, "Statistik konnte nicht geladen werden.");
  }
}
