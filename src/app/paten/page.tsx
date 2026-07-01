import { redirect } from "next/navigation";
import { PatenUpdatesLanding } from "@/components/paten/PatenUpdatesLanding";
import { getAuthenticatedPaten } from "@/lib/patenAuth";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Paten-Updates",
  description:
    "Exklusiver Zugang für Paten: Fotos und Neuigkeiten von deinem Waschbär. Noch kein Pate? Entdecke unsere Patenschaften bei Wilde Heimat.",
  path: "/paten",
  keywords: ["Paten-Updates", "Waschbär Patenschaft", "Paten-Bereich"],
  noIndex: true,
});

export default async function PatenLoginPage() {
  const pate = await getAuthenticatedPaten();
  if (pate) {
    redirect("/paten/portal");
  }

  return <PatenUpdatesLanding />;
}
