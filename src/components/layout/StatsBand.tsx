"use client";

import { AnimatedCounter } from "@/components/motion/AnimatedCounter";
import { Section } from "@/components/ui/Section";

export type StatItem =
  | { type: "counter"; value: number; label: string; suffix?: string }
  | { type: "static"; value: string; label: string };

type StatsBandProps = {
  items: StatItem[];
  className?: string;
};

function StaticStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center p-4 sm:p-6 rounded-2xl bg-sand-light/50 border border-sand/60 shadow-soft">
      <p className="text-3xl sm:text-4xl md:text-5xl font-light tabular-nums">{value}</p>
      <p className="mt-2 text-xs sm:text-sm text-muted uppercase tracking-wider text-balance">{label}</p>
    </div>
  );
}

export function StatsBand({ items, className = "" }: StatsBandProps) {
  return (
    <Section className={`py-12 md:py-16 ${className}`}>
      <div
        className={`grid gap-3 sm:gap-4 md:gap-6 ${
          items.length === 2
            ? "grid-cols-1 sm:grid-cols-2"
            : items.length === 3
              ? "grid-cols-1 sm:grid-cols-3"
              : "grid-cols-1 sm:grid-cols-2 md:grid-cols-4"
        }`}
      >
        {items.map((item) =>
          item.type === "counter" ? (
            <AnimatedCounter
              key={item.label}
              value={item.value}
              suffix={item.suffix}
              label={item.label}
            />
          ) : (
            <StaticStat key={item.label} value={item.value} label={item.label} />
          )
        )}
      </div>
    </Section>
  );
}
