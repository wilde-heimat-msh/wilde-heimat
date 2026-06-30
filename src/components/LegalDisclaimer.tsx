import { unterstuetzungHinweis } from "@/data/site";

type LegalDisclaimerProps = {
  className?: string;
  variant?: "default" | "prominent";
};

export function LegalDisclaimer({
  className = "",
  variant = "default",
}: LegalDisclaimerProps) {
  if (variant === "prominent") {
    return (
      <div
        className={`p-4 rounded-xl border border-border bg-muted-light/30 text-sm text-muted leading-relaxed ${className}`}
        role="note"
      >
        {unterstuetzungHinweis}
      </div>
    );
  }

  return (
    <p className={`text-xs text-muted leading-relaxed ${className}`} role="note">
      {unterstuetzungHinweis}
    </p>
  );
}
