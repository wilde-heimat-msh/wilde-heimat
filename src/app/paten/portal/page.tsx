import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { PatenDashboard } from "@/components/paten/PatenDashboard";
import { getAuthenticatedPaten } from "@/lib/patenAuth";

export const metadata: Metadata = {
  title: "Dein Paten-Bereich",
  robots: { index: false, follow: false },
};

export default async function PatenPortalPage() {
  const pate = await getAuthenticatedPaten();
  if (!pate) {
    redirect("/paten");
  }

  return (
    <div className="py-8 sm:py-12 px-4 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <PatenDashboard />
      </div>
    </div>
  );
}
