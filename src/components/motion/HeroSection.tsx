"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/Logo";
import { PhotoCredit } from "@/components/PhotoCredit";
import { AnimatedBackground } from "@/components/motion/AnimatedBackground";
import { useMotionProfile } from "@/hooks/useMotionProfile";
import { MOTION_DURATION, MOTION_EASE } from "@/lib/motion";
import { heroPhotoCredit } from "@/data/photoCredits";
import { sitePhotos } from "@/data/photos";
import { siteConfig } from "@/data/site";

export function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { lite, parallax } = useMotionProfile();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);
  const useParallax = parallax && !reduced;
  const enterDuration = lite ? MOTION_DURATION.fast : MOTION_DURATION.slow;

  return (
    <section
      ref={ref}
      className="relative flex min-h-[80vh] items-center overflow-hidden bg-forest text-background sm:min-h-[92vh]"
    >
      <div className="absolute inset-0">
        <Image
          src={sitePhotos.hero}
          alt="Waschbär zwischen grünem Laub"
          fill
          className="object-cover object-[center_35%] md:scale-105"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-forest/92 via-forest/60 to-forest/25" />
        <div className="absolute inset-0 bg-gradient-to-t from-forest/70 via-transparent to-forest/20" />
      </div>
      <AnimatedBackground variant="hero-photo" />

      <motion.div
        style={useParallax ? { y, opacity } : undefined}
        className="relative mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 sm:py-28 md:py-36 lg:px-8"
      >
        <div className="max-w-3xl">
          <motion.div
            initial={reduced ? false : { opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: enterDuration, ease: MOTION_EASE }}
          >
            <Logo
              surface="dark"
              size={80}
              className="mb-8 h-16 w-16 animate-float-slow md:h-20 md:w-20"
              priority
              alt=""
            />
          </motion.div>

          <motion.h1
            className="text-3xl font-light leading-[1.1] tracking-tight sm:text-4xl md:text-5xl lg:text-7xl"
            initial={reduced ? false : { opacity: 0, y: lite ? 20 : 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: enterDuration, delay: 0.1, ease: MOTION_EASE }}
          >
            {siteConfig.tagline}
          </motion.h1>

          <motion.p
            className="mt-4 text-base font-medium tracking-wide text-sage-light md:text-lg"
            initial={reduced ? false : { opacity: 0, y: lite ? 12 : 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: enterDuration, delay: 0.14, ease: MOTION_EASE }}
          >
            {siteConfig.seoHeadline}
          </motion.p>

          <motion.p
            className="mt-3 text-sm tracking-wide text-muted-light/90 md:text-base"
            initial={reduced ? false : { opacity: 0, y: lite ? 12 : 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: enterDuration, delay: 0.18, ease: MOTION_EASE }}
          >
            {siteConfig.subtitle}
          </motion.p>

          <motion.p
            className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-light md:text-xl"
            initial={reduced ? false : { opacity: 0, y: lite ? 14 : 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: enterDuration, delay: 0.26, ease: MOTION_EASE }}
          >
            {siteConfig.description}
          </motion.p>

          <motion.div
            className="mt-8 flex flex-col flex-wrap gap-3 sm:mt-10 sm:flex-row [&_a]:w-full sm:[&_a]:w-auto [&_a]:justify-center"
            initial={reduced ? false : { opacity: 0, y: lite ? 12 : 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: enterDuration, delay: 0.36, ease: MOTION_EASE }}
          >
            <Button href="/unterstuetzen" variant="secondary">
              Jetzt helfen
            </Button>
            <Button href="/patenschaften" variant="inverse">
              Patenschaft übernehmen
            </Button>
            <Button href="/hilfe" variant="inverse">
              Hilfe & Vermittlung
            </Button>
          </motion.div>
        </div>

        {!reduced && !lite ? (
          <motion.div
            className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 md:flex"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            <span className="text-xs uppercase tracking-widest text-muted-light/60">
              Entdecken
            </span>
            <div className="motion-scroll-hint h-10 w-0.5 rounded-full bg-muted-light/50" />
          </motion.div>
        ) : null}
      </motion.div>

      <div className="absolute bottom-4 right-4 z-10 sm:bottom-6 sm:right-6">
        <PhotoCredit credit={heroPhotoCredit} variant="hero" />
      </div>
    </section>
  );
}
