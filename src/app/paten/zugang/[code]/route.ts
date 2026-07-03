import { NextResponse } from "next/server";
import {
  createPatenSessionToken,
  getPatenSessionCookieOptions,
  PATEN_SESSION_COOKIE,
} from "@/lib/patenAuth";
import { normalizeAccessCode } from "@/lib/patenschaftTier";
import { listPatenByAccessCode } from "@/lib/patenschaftStore";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ code: string }>;
};

export async function GET(request: Request, context: RouteContext) {
  const { code } = await context.params;
  const origin = new URL(request.url).origin;

  try {
    const paten = await listPatenByAccessCode(decodeURIComponent(code));
    if (paten.length === 0) {
      return NextResponse.redirect(`${origin}/paten?fehler=code`);
    }

    const token = createPatenSessionToken(normalizeAccessCode(code));
    if (!token) {
      return NextResponse.redirect(`${origin}/paten?fehler=code`);
    }

    const response = NextResponse.redirect(`${origin}/paten/portal`);
    response.cookies.set(PATEN_SESSION_COOKIE, token, getPatenSessionCookieOptions());
    return response;
  } catch {
    return NextResponse.redirect(`${origin}/paten?fehler=code`);
  }
}
