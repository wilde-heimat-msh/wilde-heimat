import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createMetadata } from "@/lib/seo";
import {
  createPatenSessionToken,
  getPatenSessionCookieOptions,
  PATEN_SESSION_COOKIE,
} from "@/lib/patenAuth";
import { normalizeAccessCode } from "@/lib/patenschaftTier";
import { listPatenByAccessCode } from "@/lib/patenschaftStore";

type PageProps = {
  params: Promise<{ code: string }>;
};

export const metadata = createMetadata({
  title: "Paten-Zugang",
  description: "Interner Zugang für Paten von Wilde Heimat.",
  path: "/paten/zugang",
  noIndex: true,
});

export default async function PatenZugangPage({ params }: PageProps) {
  const { code } = await params;
  const paten = await listPatenByAccessCode(decodeURIComponent(code));

  if (paten.length === 0) {
    redirect("/paten?fehler=code");
  }

  const token = createPatenSessionToken(normalizeAccessCode(code));
  if (!token) {
    redirect("/paten?fehler=code");
  }

  const cookieStore = await cookies();
  cookieStore.set(PATEN_SESSION_COOKIE, token, getPatenSessionCookieOptions());

  redirect("/paten/portal");
}
