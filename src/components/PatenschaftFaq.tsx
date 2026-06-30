"use client";

import { useState } from "react";
import { FadeIn } from "@/components/motion/FadeIn";
import { SectionHeader } from "@/components/ui/Section";
import { patenschaftFaq } from "@/data/patenschaften";

export function PatenschaftFaq() {
  const [openId, setOpenId] = useState<string | null>(patenschaftFaq[0]?.id ?? null);

  return (
    <div className="max-w-3xl mx-auto">
      <FadeIn>
        <SectionHeader
          title="Häufige Fragen"
          subtitle="Alles Wichtige zur Patenschaft – ehrlich und auf den Punkt."
          centered
        />
      </FadeIn>

      <FadeIn className="space-y-3">
        {patenschaftFaq.map((item) => {
          const isOpen = openId === item.id;

          return (
            <div
              key={item.id}
              className="rounded-2xl border border-border bg-background/90 shadow-soft overflow-hidden"
            >
              <button
                type="button"
                id={`faq-${item.id}`}
                aria-expanded={isOpen}
                aria-controls={`faq-panel-${item.id}`}
                onClick={() => setOpenId(isOpen ? null : item.id)}
                className="flex w-full items-start justify-between gap-4 min-h-11 px-5 py-4 text-left hover:bg-muted-light/30 transition-colors"
              >
                <span className="font-medium leading-snug">{item.question}</span>
                <span
                  className={`shrink-0 mt-0.5 text-muted transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                  aria-hidden
                >
                  ▾
                </span>
              </button>
              <div
                id={`faq-panel-${item.id}`}
                role="region"
                aria-labelledby={`faq-${item.id}`}
                hidden={!isOpen}
                className={isOpen ? "block" : "hidden"}
              >
                <p className="px-5 pb-5 text-sm text-muted leading-relaxed border-t border-border/60 pt-4">
                  {item.answer}
                </p>
              </div>
            </div>
          );
        })}
      </FadeIn>
    </div>
  );
}
