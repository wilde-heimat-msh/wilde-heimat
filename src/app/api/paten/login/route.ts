import { NextResponse } from "next/server";
import { normalizeAccessCode } from "@/lib/patenschaftTier";
import { listPatenByAccessCode } from "@/lib/patenschaftStore";
import {
  createPatenSessionToken,
  getPatenSessionCookieOptions,
  PATEN_SESSION_COOKIE,
} from "@/lib/patenAuth";

export async function POST(request: Request) {
  const body = (await request.json()) as { code?: string };
  const code = body.code?.trim();

  if (!code) {
    return NextResponse.json({ error: "Zugangscode fehlt." }, { status: 400 });
  }

  const paten = await listPatenByAccessCode(code);
  if (paten.length === 0) {
    return NextResponse.json({ error: "Zugangscode ungültig oder inaktiv." }, { status: 401 });
  }

  const normalized = normalizeAccessCode(code);
  const token = createPatenSessionToken(normalized);
  if (!token) {
    return NextResponse.json({ error: "Session konnte nicht erstellt werden." }, { status: 500 });
  }

  const primary = paten[0];
  const response = NextResponse.json({
    ok: true,
    pate: {
      id: primary.id,
      name: primary.name,
      waschbaerSlug: primary.waschbaerSlug,
      stufeId: primary.stufeId,
      accessCode: primary.accessCode,
      patenschaftCount: paten.length,
    },
  });
  response.cookies.set(PATEN_SESSION_COOKIE, token, getPatenSessionCookieOptions());
  return response;
}
