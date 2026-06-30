"use client";

import { motion, useReducedMotion } from "framer-motion";
import { type ReactNode } from "react";
import { AnimatedBackground } from "@/components/motion/AnimatedBackground";

type PageHeroProps = {
  title: string;
  subtitle?: string;
  children?: ReactNode;
};

export function PageHero({ title, subtitle, children }: PageHeroProps) {
  const reduced = useReducedMotion();

  return (
    <section className="relative bg-forest text-background py-16 sm:py-20 md:py-28 overflow-hidden">
      <AnimatedBackground variant="page" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <motion.h1
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light tracking-tight leading-tight"
            initial={reduced ? false : { opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            {title}
          </motion.h1>
          {subtitle && (
            <motion.p
              className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl text-sand-light/90 leading-relaxed"
              initial={reduced ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            >
              {subtitle}
            </motion.p>
          )}
          {children && (
            <motion.div
              className="mt-6 sm:mt-8 flex flex-col sm:flex-row flex-wrap gap-3 [&_a]:w-full sm:[&_a]:w-auto [&_a]:justify-center"
              initial={reduced ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              {children}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
