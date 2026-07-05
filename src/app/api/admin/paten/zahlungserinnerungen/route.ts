import { NextResponse } from "next/server";
import {
  buildPatenschaftErinnerungOverview,
  runPatenschaftZahlungserinnerungen,
} from "@/lib/patenschaftErinnerungService";
import { requireAdmin } from "@/lib/requireAdmin";
import { apiErrorResponse } from "@/lib/apiError";

export async function GET(request: Request) {
  const authError = await requireAdmin();
  if (authError) return authError;

  const { searchParams } = new URL(request.url);
  const period = searchParams.get("period")?.trim() || undefined;

  try {
    const overview = await buildPatenschaftErinnerungOverview({ period });
    return NextResponse.json({ overview });
  } catch (error) {
    return apiErrorResponse(error, "Zahlungserinnerungen konnten nicht geladen werden.");
  }
}

export async function POST(request: Request) {
  const authError = await requireAdmin();
  if (authError) return authError;

  let body: {
    period?: string;
    pateId?: string;
    force?: boolean;
    onlyFailedOrPending?: boolean;
  };

  try {
    body = (await request.json()) as typeof body;
  } catch {
    body = {};
  }

  try {
    const result = await runPatenschaftZahlungserinnerungen({
      period: body.period?.trim(),
      pateId: body.pateId?.trim(),
      trigger: "manual",
      force: body.force === true,
      onlyFailedOrPending: body.onlyFailedOrPending !== false,
    });

    return NextResponse.json({ result });
  } catch (error) {
    return apiErrorResponse(error, "Zahlungserinnerungen konnten nicht versendet werden.");
  }
}
