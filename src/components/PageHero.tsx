"use client";

import { motion, useReducedMotion } from "framer-motion";
import { type ReactNode } from "react";
import { AnimatedBackground } from "@/components/motion/AnimatedBackground";
import { useMotionProfile } from "@/hooks/useMotionProfile";
import { MOTION_DURATION, MOTION_EASE } from "@/lib/motion";

type PageHeroProps = {
  title: string;
  subtitle?: string;
  children?: ReactNode;
};

export function PageHero({ title, subtitle, children }: PageHeroProps) {
  const reduced = useReducedMotion();
  const { lite } = useMotionProfile();
  const duration = lite ? MOTION_DURATION.fast : MOTION_DURATION.slow;
  const offset = lite ? 16 : 24;

  return (
    <section className="relative overflow-hidden bg-forest py-16 text-background sm:py-20 md:py-28">
      <AnimatedBackground variant="page" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <motion.h1
            className="text-3xl font-light leading-tight tracking-tight sm:text-4xl md:text-5xl lg:text-6xl"
            initial={reduced ? false : { opacity: 0, y: offset }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration, ease: MOTION_EASE }}
          >
            {title}
          </motion.h1>
          {subtitle && (
            <motion.p
              className="mt-4 text-base leading-relaxed text-sand-light/90 sm:mt-6 sm:text-lg md:text-xl"
              initial={reduced ? false : { opacity: 0, y: offset - 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration, delay: 0.12, ease: MOTION_EASE }}
            >
              {subtitle}
            </motion.p>
          )}
          {children && (
            <motion.div
              className="mt-6 flex flex-col flex-wrap gap-3 sm:mt-8 sm:flex-row [&_a]:w-full sm:[&_a]:w-auto [&_a]:justify-center"
              initial={reduced ? false : { opacity: 0, y: offset - 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration, delay: 0.24, ease: MOTION_EASE }}
            >
              {children}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
