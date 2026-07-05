"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/Section";
import { FadeIn } from "@/components/motion/FadeIn";
import { PatenschaftForm } from "@/components/forms/PatenschaftForm";
import { patenschaftBank } from "@/data/patenschaftBank";

function PatenschaftAnfrageInner() {
  const searchParams = useSearchParams();
  const waschbaer = searchParams.get("waschbaer") ?? undefined;
  const stufe = searchParams.get("stufe") ?? undefined;

  return (
    <PatenschaftForm preselectedWaschbaer={waschbaer} preselectedStufe={stufe} />
  );
}

function FormFallback() {
  return (
    <Card hover={false} padding="md" className="bg-muted-light/20 animate-pulse">
      <div className="h-64 rounded-xl bg-muted-light/50" />
    </Card>
  );
}

export function PatenschaftAnfrageSection() {
  return (
    <FadeIn className="max-w-2xl mx-auto">
      <SectionHeader
        title="Schritt 3: Patenschaft anfragen"
        subtitle={`Fülle das Formular aus – ${patenschaftBank.afterAnfrageNote}`}
        centered
      />
      <Card hover={false} padding="md" className="bg-muted-light/20">
        <Suspense fallback={<FormFallback />}>
          <PatenschaftAnfrageInner />
        </Suspense>
      </Card>
    </FadeIn>
  );
}
