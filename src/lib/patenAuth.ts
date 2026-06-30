import { createHash, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { getPatenById } from "@/lib/patenschaftStore";
import type { PatenschaftPate } from "@/types/patenschaftPortal";

export const PATEN_SESSION_COOKIE = "wh-paten-session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

function getPatenSessionSecret(): string | null {
  return (
    process.env.PATEN_SESSION_SECRET ??
    process.env.ADMIN_SESSION_SECRET ??
    process.env.ADMIN_URKUNDEN_PASSWORD ??
    null
  );
}

export function createPatenSessionToken(patenId: string): string | null {
  const secret = getPatenSessionSecret();
  if (!secret) return null;

  const signature = createHash("sha256").update(`${patenId}:${secret}`).digest("hex");
  return `${patenId}.${signature}`;
}

export function verifyPatenSessionToken(token: string): string | null {
  const secret = getPatenSessionSecret();
  if (!secret) return null;

  const [patenId, signature] = token.split(".");
  if (!patenId || !signature) return null;

  const expected = createHash("sha256").update(`${patenId}:${secret}`).digest("hex");
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return null;
  if (!timingSafeEqual(a, b)) return null;

  return patenId;
}

export async function getAuthenticatedPaten(): Promise<PatenschaftPate | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(PATEN_SESSION_COOKIE)?.value;
  if (!token) return null;

  const patenId = verifyPatenSessionToken(token);
  if (!patenId) return null;

  const pate = await getPatenById(patenId);
  if (!pate || !pate.active) return null;
  return pate;
}

export function getPatenSessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: SESSION_MAX_AGE_SECONDS,
    path: "/",
  };
}
