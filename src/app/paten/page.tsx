import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { PatenPortalLogin } from "@/components/paten/PatenPortalLogin";
import { getAuthenticatedPaten } from "@/lib/patenAuth";

export const metadata: Metadata = {
  title: "Paten-Bereich",
  description: "Persönlicher Zugang zu Updates deines Patentiers.",
  robots: { index: false, follow: false },
};

export default async function PatenLoginPage() {
  const pate = await getAuthenticatedPaten();
  if (pate) {
    redirect("/paten/portal");
  }

  return (
    <div className="py-12 sm:py-16 px-4">
      <Suspense fallback={<p className="text-center text-sm text-muted">Lade …</p>}>
        <PatenPortalLogin />
      </Suspense>
    </div>
  );
}
