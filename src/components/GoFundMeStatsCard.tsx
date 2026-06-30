"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { formatEuro } from "@/data/gofundme";

type GoFundMeStatsCardProps = {
  raised: number;
  goal: number;
  donorCount: number;
  url: string;
};

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

function AnimatedProgressRing({ percent }: { percent: number }) {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className="relative h-28 w-28 shrink-0">
      <svg className="h-28 w-28 -rotate-90" viewBox="0 0 96 96" aria-hidden>
        <circle
          cx="48"
          cy="48"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="6"
          className="text-sand"
        />
        <circle
          cx="48"
          cy="48"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="text-sage"
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-xl font-light text-forest tabular-nums">
        {percent}%
      </span>
    </div>
  );
}

export function GoFundMeStatsCard({
  raised,
  goal,
  donorCount,
  url,
}: GoFundMeStatsCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const hasAnimated = useRef(false);
  const [stats, setStats] = useState({ percent: 0, raised: 0, donors: 0 });

  const targetPercent = Math.min(100, Math.round((raised / goal) * 100));

  useEffect(() => {
    if (reduced) {
      setStats({ percent: targetPercent, raised, donors: donorCount });
      return;
    }

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hasAnimated.current) return;
        hasAnimated.current = true;

        const duration = 2000;
        const start = performance.now();

        const tick = (now: number) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = easeOutCubic(progress);

          setStats({
            percent: Math.round(eased * targetPercent),
            raised: Math.round(eased * raised),
            donors: Math.round(eased * donorCount),
          });

          if (progress < 1) requestAnimationFrame(tick);
        };

        requestAnimationFrame(tick);
      },
      { threshold: 0.35 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [raised, donorCount, targetPercent, reduced]);

  return (
    <Card hover={false} className="lg:col-span-2 bg-cream/90 border-sand/60">
      <div ref={ref} className="flex flex-col items-center text-center">
        <AnimatedProgressRing percent={stats.percent} />

        <p className="mt-5 text-xl sm:text-2xl md:text-3xl font-light tabular-nums flex flex-col sm:flex-row sm:items-baseline sm:justify-center gap-0.5 sm:gap-2">
          <span>{formatEuro(stats.raised)}</span>
          <span className="text-sm sm:text-base text-muted">gesammelt</span>
        </p>

        <div className="mt-3 w-full max-w-xs">
          <div className="h-1.5 rounded-full bg-sand overflow-hidden">
            <div
              className="h-full rounded-full bg-sage"
              style={{ width: `${stats.percent}%` }}
            />
          </div>
        </div>

        <p className="mt-3 text-sm text-muted tabular-nums">
          Spendenziel: {formatEuro(goal)} · {stats.donors} Spenden
        </p>

        <div className="mt-6 w-full space-y-3">
          <Button href={url} variant="primary" external className="w-full">
            Jetzt spenden
          </Button>
          <Button href={url} variant="outline" external className="w-full">
            Kampagne auf GoFundMe
          </Button>
        </div>

        <p className="mt-4 text-xs text-muted flex items-center justify-center gap-1.5">
          <svg className="h-3.5 w-3.5 text-sage" fill="currentColor" viewBox="0 0 20 20" aria-hidden>
            <path
              fillRule="evenodd"
              d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          Spende geschützt durch GoFundMe
        </p>
      </div>
    </Card>
  );
}
