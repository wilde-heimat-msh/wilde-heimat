"use client";

import { type ReactNode } from "react";

type MarqueeProps = {
  children: ReactNode;
  speed?: "slow" | "normal" | "fast";
  reverse?: boolean;
  className?: string;
};

const speedMap = {
  slow: "animate-marquee-slow",
  normal: "animate-marquee",
  fast: "animate-marquee-fast",
};

export function Marquee({
  children,
  speed = "normal",
  reverse = false,
  className = "",
}: MarqueeProps) {
  return (
    <div className={`overflow-hidden ${className}`} aria-hidden>
      <div
        className={`flex w-max motion-marquee-track ${speedMap[speed]} ${reverse ? "[animation-direction:reverse]" : ""}`}
      >
        <div className="flex shrink-0 items-center gap-8 pr-8">{children}</div>
        <div className="flex shrink-0 items-center gap-8 pr-8" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}

export function MarqueeItem({ children }: { children: ReactNode }) {
  return (
    <span className="flex items-center gap-8 text-sm uppercase tracking-[0.2em] text-muted whitespace-nowrap">
      {children}
      <span className="h-1 w-1 rounded-full bg-sage/50" />
    </span>
  );
}
