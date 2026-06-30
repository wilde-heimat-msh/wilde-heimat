import { createHash, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

export const ADMIN_URKUNDEN_COOKIE = "wh-admin-urkunden";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

function getSessionSecret(): string | null {
  return process.env.ADMIN_SESSION_SECRET ?? process.env.ADMIN_URKUNDEN_PASSWORD ?? null;
}

export function isAdminPasswordConfigured(): boolean {
  return Boolean(process.env.ADMIN_URKUNDEN_PASSWORD);
}

export function createAdminSessionToken(): string | null {
  const secret = getSessionSecret();
  if (!secret) return null;

  const issuedAt = Date.now().toString();
  const signature = createHash("sha256").update(`${issuedAt}:${secret}`).digest("hex");
  return `${issuedAt}.${signature}`;
}

export function verifyAdminSessionToken(token: string): boolean {
  const secret = getSessionSecret();
  if (!secret) return false;

  const [issuedAt, signature] = token.split(".");
  if (!issuedAt || !signature || !/^\d+$/.test(issuedAt)) return false;

  const expected = createHash("sha256").update(`${issuedAt}:${secret}`).digest("hex");
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;

  const ageMs = Date.now() - Number(issuedAt);
  if (Number.isNaN(ageMs) || ageMs < 0 || ageMs > SESSION_MAX_AGE_SECONDS * 1000) {
    return false;
  }

  return timingSafeEqual(a, b);
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_URKUNDEN_COOKIE)?.value;
  if (!token) return false;
  return verifyAdminSessionToken(token);
}

export function getAdminSessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: SESSION_MAX_AGE_SECONDS,
    path: "/admin",
  };
}

export function verifyAdminPassword(password: string): boolean {
  const expected = process.env.ADMIN_URKUNDEN_PASSWORD;
  if (!expected) return false;

  const a = Buffer.from(password);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
