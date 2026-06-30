import { NextResponse } from "next/server";

export function apiErrorResponse(
  error: unknown,
  fallback = "Ein unerwarteter Fehler ist aufgetreten."
): NextResponse {
  const message = error instanceof Error ? error.message : fallback;
  const status = message.includes("nicht konfiguriert") ? 503 : 500;
  return NextResponse.json({ error: message }, { status });
}
