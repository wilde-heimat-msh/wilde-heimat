import { redirect } from "next/navigation";
import { PatenUpdatesLanding } from "@/components/paten/PatenUpdatesLanding";
import { pagePhotos } from "@/data/pagePhotos";
import { getAuthenticatedPaten } from "@/lib/patenAuth";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Paten-Updates",
  description:
    "Exklusiver Zugang für Paten: Fotos und Neuigkeiten von deinem Waschbär. Noch kein Pate? Entdecke unsere Patenschaften bei Wilde Heimat.",
  path: "/paten",
  keywords: ["Paten-Updates", "Waschbär Patenschaft", "Paten-Bereich"],
  ogImage: pagePhotos.intro.src,
  ogImageAlt: "Paten-Bereich bei Wilde Heimat",
});

export default async function PatenLoginPage() {
  const pate = await getAuthenticatedPaten();
  if (pate) {
    redirect("/paten/portal");
  }

  return <PatenUpdatesLanding />;
}
