import { NextResponse } from "next/server";
import {
  createAdminSessionToken,
  getAdminSessionCookieOptions,
  isAdminPasswordConfigured,
  verifyAdminPassword,
  ADMIN_URKUNDEN_COOKIE,
} from "@/lib/adminAuth";

export async function POST(request: Request) {
  if (!isAdminPasswordConfigured()) {
    return NextResponse.json(
      { error: "Admin-Zugang ist nicht konfiguriert." },
      { status: 503 }
    );
  }

  const body = (await request.json()) as { password?: string };
  const password = body.password?.trim() ?? "";

  if (!verifyAdminPassword(password)) {
    return NextResponse.json({ error: "Passwort ungültig." }, { status: 401 });
  }

  const token = createAdminSessionToken();
  if (!token) {
    return NextResponse.json({ error: "Session konnte nicht erstellt werden." }, { status: 500 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_URKUNDEN_COOKIE, token, getAdminSessionCookieOptions());
  return response;
}
