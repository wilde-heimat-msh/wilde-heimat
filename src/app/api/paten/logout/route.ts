import { NextResponse } from "next/server";
import { PATEN_SESSION_COOKIE } from "@/lib/patenAuth";

export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(PATEN_SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/paten",
  });
  return response;
}
