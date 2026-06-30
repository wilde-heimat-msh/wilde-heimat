import { NextResponse } from "next/server";
import { getPatenByAccessCode } from "@/lib/patenschaftStore";
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

  const pate = await getPatenByAccessCode(code);
  if (!pate) {
    return NextResponse.json({ error: "Zugangscode ungültig oder inaktiv." }, { status: 401 });
  }

  const token = createPatenSessionToken(pate.id);
  if (!token) {
    return NextResponse.json({ error: "Session konnte nicht erstellt werden." }, { status: 500 });
  }

  const response = NextResponse.json({
    ok: true,
    pate: {
      id: pate.id,
      name: pate.name,
      waschbaerSlug: pate.waschbaerSlug,
      stufeId: pate.stufeId,
      accessCode: pate.accessCode,
    },
  });
  response.cookies.set(PATEN_SESSION_COOKIE, token, getPatenSessionCookieOptions());
  return response;
}
