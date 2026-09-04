import { createHmac, timingSafeEqual } from "crypto";
import {
  createDefaultUrkundeDaten,
  type PatenschaftUrkundeDaten,
  type PatenschaftStufeId,
} from "@/data/patenschaften";

const TOKEN_TTL_MS = 5 * 60 * 1000;

type SignedPayload = {
  data: PatenschaftUrkundeDaten;
  exp: number;
};

function getTokenSecret(): string {
  return (
    process.env.ADMIN_SESSION_SECRET ??
    process.env.ADMIN_URKUNDEN_PASSWORD ??
    "dev-urkunde-print-secret"
  );
}

function isStufeId(value: unknown): value is PatenschaftStufeId {
  return value === "bronze" || value === "silber" || value === "gold";
}

function normalizeUrkundeDaten(raw: unknown): PatenschaftUrkundeDaten | null {
  if (!raw || typeof raw !== "object") return null;
  const input = raw as Partial<PatenschaftUrkundeDaten>;
  if (typeof input.pate !== "string" || !input.pate.trim()) return null;
  if (typeof input.waschbaer !== "string" || !input.waschbaer.trim()) return null;
  if (!isStufeId(input.stufeId)) return null;
  if (typeof input.urkundenNr !== "string" || !input.urkundenNr.trim()) return null;

  return createDefaultUrkundeDaten({
    pate: input.pate.trim(),
    waschbaer: input.waschbaer.trim(),
    waschbaerSlug: typeof input.waschbaerSlug === "string" ? input.waschbaerSlug : "",
    waschbaerFoto: typeof input.waschbaerFoto === "string" ? input.waschbaerFoto : "",
    stufeId: input.stufeId,
    ausgestelltAm:
      typeof input.ausgestelltAm === "string" && input.ausgestelltAm
        ? input.ausgestelltAm
        : new Date().toISOString().slice(0, 10),
    urkundenNr: input.urkundenNr.trim(),
    ort: typeof input.ort === "string" && input.ort.trim() ? input.ort.trim() : "Mansfeld-Südharz",
    unterzeichnerin:
      typeof input.unterzeichnerin === "string" && input.unterzeichnerin.trim()
        ? input.unterzeichnerin.trim()
        : "Julia Rothmann",
    funktion:
      typeof input.funktion === "string" && input.funktion.trim()
        ? input.funktion.trim()
        : "Gründerin, Wilde Heimat",
    grussbotschaft:
      typeof input.grussbotschaft === "string" && input.grussbotschaft.trim()
        ? input.grussbotschaft.trim()
        : undefined,
  });
}

export function signUrkundePrintToken(data: PatenschaftUrkundeDaten): string {
  const payload: SignedPayload = {
    data,
    exp: Date.now() + TOKEN_TTL_MS,
  };
  const body = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
  const signature = createHmac("sha256", getTokenSecret()).update(body).digest("base64url");
  return `${body}.${signature}`;
}

export function verifyUrkundePrintToken(token: string): PatenschaftUrkundeDaten | null {
  const [body, signature] = token.split(".");
  if (!body || !signature) return null;

  const expected = createHmac("sha256", getTokenSecret()).update(body).digest("base64url");
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;

  try {
    const parsed = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as SignedPayload;
    if (!parsed?.exp || Date.now() > parsed.exp) return null;
    return normalizeUrkundeDaten(parsed.data);
  } catch {
    return null;
  }
}

export function parseUrkundeDatenBody(raw: unknown): PatenschaftUrkundeDaten | null {
  return normalizeUrkundeDaten(raw);
}
