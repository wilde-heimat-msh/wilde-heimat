import { NextResponse } from "next/server";
import { runPatenschaftZahlungserinnerungen } from "@/lib/patenschaftErinnerungService";
import { apiErrorResponse } from "@/lib/apiError";

function isAuthorizedCron(request: Request): boolean {
  const cronSecret = process.env.CRON_SECRET?.trim();
  if (!cronSecret) return process.env.NODE_ENV !== "production";

  const authHeader = request.headers.get("authorization");
  return authHeader === `Bearer ${cronSecret}`;
}

export async function GET(request: Request) {
  if (!isAuthorizedCron(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await runPatenschaftZahlungserinnerungen({ trigger: "auto" });
    return NextResponse.json(result);
  } catch (error) {
    return apiErrorResponse(error, "Automatische Zahlungserinnerungen fehlgeschlagen.");
  }
}
