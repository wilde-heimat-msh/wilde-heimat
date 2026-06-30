"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

type CounterProps = {
  value: number;
  suffix?: string;
  label: string;
};

export function AnimatedCounter({ value, suffix = "", label }: CounterProps) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (reduced) {
      setCount(value);
      return;
    }

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const duration = 1800;
          const start = performance.now();

          const tick = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.round(eased * value));
            if (progress < 1) requestAnimationFrame(tick);
          };

          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [value, reduced]);

  return (
    <div ref={ref} className="text-center p-4 sm:p-6 rounded-2xl bg-sand-light/50 border border-sand/60 shadow-soft">
      <p className="text-3xl sm:text-4xl md:text-5xl font-light tabular-nums">
        {count}
        {suffix}
      </p>
      <p className="mt-2 text-xs sm:text-sm text-muted uppercase tracking-wider text-balance">{label}</p>
    </div>
  );
}
