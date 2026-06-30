import { type ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  padding?: "sm" | "md" | "lg";
};

const paddingMap = {
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export function Card({
  children,
  className = "",
  hover = true,
  padding = "lg",
}: CardProps) {
  return (
    <div
      className={`rounded-2xl border border-border bg-cream/90 shadow-soft ${
        hover ? "hover-lift hover:shadow-soft-hover hover:border-sage/25" : ""
      } ${paddingMap[padding]} ${className}`}
    >
      {children}
    </div>
  );
}
