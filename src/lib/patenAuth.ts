import { createHash, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { normalizeAccessCode } from "@/lib/patenschaftTier";
import { getPatenById, listPatenByAccessCode } from "@/lib/patenschaftStore";
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

function signSessionPayload(payload: string): string | null {
  const secret = getPatenSessionSecret();
  if (!secret) return null;
  return createHash("sha256").update(`${payload}:${secret}`).digest("hex");
}

function verifySessionSignature(payload: string, signature: string): boolean {
  const expected = signSessionPayload(payload);
  if (!expected) return false;
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

/** Session an Zugangscode binden – ein Login für alle Patentiere desselben Codes. */
export function createPatenSessionToken(accessCode: string): string | null {
  const normalized = normalizeAccessCode(accessCode);
  const signature = signSessionPayload(`paten:${normalized}`);
  if (!signature) return null;
  const encoded = Buffer.from(normalized, "utf8").toString("base64url");
  return `paten.${encoded}.${signature}`;
}

function decodeAccessCodeFromToken(encoded: string): string | null {
  try {
    return Buffer.from(encoded, "base64url").toString("utf8");
  } catch {
    return null;
  }
}

function verifyLegacyPatenSessionToken(token: string): string | null {
  const dotIndex = token.indexOf(".");
  if (dotIndex <= 0) return null;

  const patenId = token.slice(0, dotIndex);
  const signature = token.slice(dotIndex + 1);
  if (!patenId || !signature) return null;
  if (!verifySessionSignature(patenId, signature)) return null;
  return patenId;
}

async function resolveAccessCodeFromToken(token: string): Promise<string | null> {
  if (token.startsWith("paten.")) {
    const lastDot = token.lastIndexOf(".");
    if (lastDot <= 5) return null;

    const encoded = token.slice(6, lastDot);
    const signature = token.slice(lastDot + 1);
    if (!encoded || !signature) return null;

    const decoded = decodeAccessCodeFromToken(encoded);
    if (decoded && verifySessionSignature(`paten:${decoded}`, signature)) {
      return decoded;
    }

    // Legacy: Klartext-Code im Token (vor base64-Umstellung)
    if (verifySessionSignature(`paten:${encoded}`, signature)) {
      return encoded;
    }

    return null;
  }

  const patenId = verifyLegacyPatenSessionToken(token);
  if (!patenId) return null;

  const pate = await getPatenById(patenId);
  if (!pate || !pate.active) return null;
  return normalizeAccessCode(pate.accessCode);
}

export async function getAuthenticatedAccessCode(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(PATEN_SESSION_COOKIE)?.value;
  if (!token) return null;
  return resolveAccessCodeFromToken(token);
}

export async function getAuthenticatedPatens(): Promise<PatenschaftPate[]> {
  const accessCode = await getAuthenticatedAccessCode();
  if (!accessCode) return [];
  return listPatenByAccessCode(accessCode);
}

export async function getAuthenticatedPaten(): Promise<PatenschaftPate | null> {
  const paten = await getAuthenticatedPatens();
  return paten[0] ?? null;
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
