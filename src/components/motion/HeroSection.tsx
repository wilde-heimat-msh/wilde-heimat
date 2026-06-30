"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/Logo";
import { PhotoCredit } from "@/components/PhotoCredit";
import { AnimatedBackground } from "@/components/motion/AnimatedBackground";
import { heroPhotoCredit } from "@/data/photoCredits";
import { sitePhotos } from "@/data/photos";
import { siteConfig } from "@/data/site";

export function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative min-h-[80vh] sm:min-h-[92vh] flex items-center overflow-hidden bg-forest text-background"
    >
      <div className="absolute inset-0">
        <Image
          src={sitePhotos.hero}
          alt="Waschbär zwischen grünem Laub"
          fill
          className="object-cover object-[center_35%] scale-105"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-forest/92 via-forest/60 to-forest/25" />
        <div className="absolute inset-0 bg-gradient-to-t from-forest/70 via-transparent to-forest/20" />
      </div>
      <AnimatedBackground variant="hero-photo" />

      <motion.div
        style={reduced ? undefined : { y, opacity }}
        className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28 md:py-36 w-full"
      >
        <div className="max-w-3xl">
          <motion.div
            initial={reduced ? false : { opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <Logo
              surface="dark"
              size={80}
              className="h-16 w-16 md:h-20 md:w-20 mb-8 animate-float-slow"
              priority
              alt=""
            />
          </motion.div>

          <motion.h1
            className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-light tracking-tight leading-[1.1]"
            initial={reduced ? false : { opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            {siteConfig.tagline}
          </motion.h1>

          <motion.p
            className="mt-4 text-sm md:text-base text-muted-light/90 tracking-wide"
            initial={reduced ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            {siteConfig.subtitle}
          </motion.p>

          <motion.p
            className="mt-6 text-lg md:text-xl text-muted-light leading-relaxed max-w-2xl"
            initial={reduced ? false : { opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            {siteConfig.description}
          </motion.p>

          <motion.div
            className="mt-8 sm:mt-10 flex flex-col sm:flex-row flex-wrap gap-3 [&_a]:w-full sm:[&_a]:w-auto [&_a]:justify-center"
            initial={reduced ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
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

        {!reduced && (
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            <span className="text-xs uppercase tracking-widest text-muted-light/60">
              Entdecken
            </span>
            <motion.div
              className="h-10 w-0.5 rounded-full bg-muted-light/50"
              animate={{ scaleY: [1, 0.5, 1], opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{ originY: 0 }}
            />
          </motion.div>
        )}
      </motion.div>

      <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 z-10">
        <PhotoCredit credit={heroPhotoCredit} variant="hero" />
      </div>
    </section>
  );
}
