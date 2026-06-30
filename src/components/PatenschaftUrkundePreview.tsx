"use client";

import { useState } from "react";
import { PatenschaftUrkunde } from "@/components/PatenschaftUrkunde";
import {
  getPatenschaftStufe,
  patenschaftUrkundeBeispiel,
  patenschaftUrkundeStufeStyles,
  type PatenschaftStufeId,
} from "@/data/patenschaften";
import { patenschaftUrkundeFormat } from "@/data/privacy";
import { patenschaftsStufen } from "@/data/site";

export function PatenschaftUrkundePreview() {
  const [stufeId, setStufeId] = useState<PatenschaftStufeId>(
    patenschaftUrkundeBeispiel.stufeId
  );

  const data = { ...patenschaftUrkundeBeispiel, stufeId };

  return (
    <div className="space-y-3">
      <div
        className="flex rounded-xl border border-border bg-background/80 p-1 gap-1"
        role="tablist"
        aria-label="Patenschaftsstufe auf der Urkunde anzeigen"
      >
        {patenschaftsStufen.map((stufe) => {
          const active = stufeId === stufe.id;
          const tierStyle = patenschaftUrkundeStufeStyles[stufe.id];

          return (
            <button
              key={stufe.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setStufeId(stufe.id)}
              className={`flex-1 min-h-11 rounded-lg px-2 py-2 text-center transition-all duration-200 ${
                active
                  ? `${tierStyle.panel} shadow-sm font-medium`
                  : "text-muted hover:bg-muted-light/50"
              }`}
            >
              <span className="block text-xs sm:text-sm">{stufe.name}</span>
              <span className="block text-[10px] text-muted tabular-nums">{stufe.preis} €</span>
            </button>
          );
        })}
      </div>

      <PatenschaftUrkunde data={data} mode="preview" showBeispielHinweis />

      <p className="text-xs text-center text-muted">
        {patenschaftUrkundeFormat.label} · {patenschaftUrkundeFormat.description} – wähle eine
        Stufe für die Vorschau ({getPatenschaftStufe(stufeId).name}).
      </p>
    </div>
  );
}
