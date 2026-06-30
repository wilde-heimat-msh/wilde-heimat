import { NextResponse } from "next/server";
import { ADMIN_URKUNDEN_COOKIE, getAdminSessionCookieOptions } from "@/lib/adminAuth";

export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_URKUNDEN_COOKIE, "", {
    ...getAdminSessionCookieOptions(),
    maxAge: 0,
  });
  return response;
}
