import { type ReactNode } from "react";

type InfoBoxProps = {
  children: ReactNode;
  className?: string;
  variant?: "default" | "prominent";
};

export function InfoBox({
  children,
  className = "",
  variant = "default",
}: InfoBoxProps) {
  return (
    <div
      className={`rounded-2xl border border-border text-sm leading-relaxed shadow-soft ${
        variant === "prominent"
          ? "p-6 bg-muted-light/40"
          : "p-5 bg-muted-light/25"
      } ${className}`}
    >
      {children}
    </div>
  );
}
