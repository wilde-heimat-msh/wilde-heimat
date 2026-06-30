import { NextResponse } from "next/server";
import { PATEN_SESSION_COOKIE, getPatenSessionCookieOptions } from "@/lib/patenAuth";

export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(PATEN_SESSION_COOKIE, "", {
    ...getPatenSessionCookieOptions(),
    maxAge: 0,
  });
  return response;
}
