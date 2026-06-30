import { redirect } from "next/navigation";
import { PatenDashboard } from "@/components/paten/PatenDashboard";
import { Section } from "@/components/ui/Section";
import { getAuthenticatedPaten } from "@/lib/patenAuth";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Dein Paten-Bereich",
  description: "Persönliche Updates und Fotos von deinem Waschbär-Patentier.",
  path: "/paten/portal",
  noIndex: true,
});

export default async function PatenPortalPage() {
  const pate = await getAuthenticatedPaten();
  if (!pate) {
    redirect("/paten");
  }

  return (
    <Section soft className="py-8 sm:py-12 md:py-16">
      <div className="mx-auto max-w-3xl">
        <PatenDashboard />
      </div>
    </Section>
  );
}
