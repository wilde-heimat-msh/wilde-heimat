"use client";

import { motion, useReducedMotion } from "framer-motion";

type AnimatedBackgroundProps = {
  variant?: "hero" | "hero-photo" | "page" | "soft" | "ambient";
};

export function AnimatedBackground({ variant = "hero" }: AnimatedBackgroundProps) {
  const reduced = useReducedMotion();

  if (variant === "ambient") {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
        <div className="mesh-ambient absolute inset-0 opacity-80" />
        {!reduced && (
          <>
            <motion.div
              className="absolute -top-20 right-[10%] h-72 w-72 rounded-full bg-sage-light/20 blur-3xl"
              animate={{ x: [0, 25, 0], y: [0, 15, 0], scale: [1, 1.08, 1] }}
              transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute -bottom-24 left-[5%] h-80 w-80 rounded-full bg-honey-light/18 blur-3xl"
              animate={{ x: [0, -20, 0], y: [0, -15, 0], scale: [1, 1.06, 1] }}
              transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
            />
          </>
        )}
      </div>
    );
  }

  if (variant === "soft") {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
        <div className="mesh-soft absolute inset-0" />
        {!reduced && (
          <>
            <motion.div
              className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-honey-light/25 blur-3xl"
              animate={{ x: [0, 40, 0], y: [0, 30, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-sage-light/22 blur-3xl"
              animate={{ x: [0, -30, 0], y: [0, -20, 0], scale: [1, 1.08, 1] }}
              transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sand/30 blur-3xl"
              animate={{ opacity: [0.3, 0.55, 0.3], scale: [1, 1.12, 1] }}
              transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
            />
          </>
        )}
      </div>
    );
  }

  if (variant === "hero-photo") {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
        {!reduced && (
          <>
            <motion.div
              className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-honey/10 blur-3xl"
              animate={{ x: [0, 30, 0], y: [0, 20, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-sage/10 blur-3xl"
              animate={{ x: [0, -20, 0], y: [0, 15, 0], opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
            />
          </>
        )}
      </div>
    );
  }

  const isHero = variant === "hero";

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      <div
        className={`absolute inset-0 bg-gradient-to-br from-forest via-forest-mid to-forest-light ${
          isHero ? "" : "opacity-95"
        }`}
      />
      <div className="hero-gradient absolute inset-0 opacity-60" />
      <div className="mesh-dark absolute inset-0 opacity-40" />
      {!reduced && (
        <>
          <motion.div
            className={`absolute rounded-full blur-3xl ${
              isHero
                ? "-top-32 -right-32 h-96 w-96 bg-honey/20"
                : "top-0 right-0 h-64 w-64 bg-honey/15"
            }`}
            animate={{ x: [0, 35, 0], y: [0, -25, 0], scale: [1, 1.15, 1] }}
            transition={{ duration: isHero ? 14 : 11, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className={`absolute rounded-full blur-3xl ${
              isHero
                ? "-bottom-48 -left-32 h-[28rem] w-[28rem] bg-sage-light/18"
                : "bottom-0 left-1/4 h-48 w-48 bg-sage/15"
            }`}
            animate={{ x: [0, -30, 0], y: [0, 30, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: isHero ? 17 : 13, repeat: Infinity, ease: "easeInOut" }}
          />
          {isHero && (
            <motion.div
              className="absolute top-1/3 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-honey-light/10 blur-3xl"
              animate={{ opacity: [0.25, 0.5, 0.25], scale: [1, 1.2, 1] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
          )}
        </>
      )}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,transparent_0%,rgba(42,51,38,0.5)_70%)]" />
    </div>
  );
}
