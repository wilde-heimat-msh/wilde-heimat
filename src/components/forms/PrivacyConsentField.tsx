"use client";

import Link from "next/link";
import { useId } from "react";
import { FORM_PRIVACY_CONSENT_FIELD } from "@/data/privacy";

const PRIVACY_LINK_CLASS =
  "font-medium text-forest underline decoration-forest underline-offset-4 hover:text-forest-mid";

type PrivacyConsentFieldProps = {
  onConsentChange?: (accepted: boolean) => void;
};

export function PrivacyConsentField({ onConsentChange }: PrivacyConsentFieldProps) {
  const checkboxId = useId();

  return (
    <div className="space-y-2 rounded-xl border border-border/80 bg-muted-light/20 p-4">
      <div className="flex items-start gap-3">
        <input
          id={checkboxId}
          type="checkbox"
          name={FORM_PRIVACY_CONSENT_FIELD}
          value="ja"
          required
          onChange={(event) => onConsentChange?.(event.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 rounded border-border text-forest focus:ring-sage"
        />
        <div className="text-xs leading-relaxed text-muted">
          <label htmlFor={checkboxId} className="cursor-pointer">
            Ja, ich willige ein, dass meine Angaben zur Bearbeitung meiner Anfrage elektronisch
            verarbeitet und gespeichert werden. Die Einwilligung kann ich jederzeit per E-Mail
            widerrufen. <span className="text-foreground">*</span>
          </label>
          <p className="mt-2">
            Ich habe die{" "}
            <Link href="/datenschutz#formulare" className={PRIVACY_LINK_CLASS}>
              Datenschutzerklärung
            </Link>{" "}
            gelesen und zur Kenntnis genommen.
          </p>
        </div>
      </div>
      <p className="text-xs text-muted pl-7">
        Die Übertragung erfolgt verschlüsselt (SSL/TLS). Ohne Häkchen ist das Absenden nicht
        möglich.
      </p>
    </div>
  );
}
