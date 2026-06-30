import { NextResponse } from "next/server";
import { ADMIN_URKUNDEN_COOKIE } from "@/lib/adminAuth";

export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_URKUNDEN_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/admin",
  });
  return response;
}
