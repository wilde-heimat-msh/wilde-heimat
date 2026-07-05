"use client";

import Link from "next/link";
import { useId } from "react";
import { FORM_WIDERRUF_CONSENT_FIELD } from "@/data/legal";

const LINK_CLASS =
  "font-medium text-forest underline decoration-forest underline-offset-4 hover:text-forest-mid";

type WiderrufConsentFieldProps = {
  onConsentChange?: (accepted: boolean) => void;
};

export function WiderrufConsentField({ onConsentChange }: WiderrufConsentFieldProps) {
  const checkboxId = useId();

  return (
    <div className="space-y-2 rounded-xl border border-border/80 bg-background/60 p-4">
      <div className="flex items-start gap-3">
        <input
          id={checkboxId}
          type="checkbox"
          name={FORM_WIDERRUF_CONSENT_FIELD}
          value="ja"
          required
          onChange={(event) => onConsentChange?.(event.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 rounded border-border text-forest focus:ring-sage"
        />
        <div className="text-xs leading-relaxed text-muted">
          <label htmlFor={checkboxId} className="cursor-pointer">
            Ich habe die{" "}
            <Link href="/widerruf" className={LINK_CLASS} target="_blank">
              Widerrufsbelehrung
            </Link>{" "}
            zur Kenntnis genommen. <span className="text-foreground">*</span>
          </label>
          <p className="mt-2">
            Die Patenschaft ist ein entgeltliches Angebot mit monatlicher Unterstützung per
            Banküberweisung und ggf. personalisierter Urkunde. Details zum Widerrufsrecht findest
            du in der Widerrufsbelehrung.
          </p>
        </div>
      </div>
    </div>
  );
}
