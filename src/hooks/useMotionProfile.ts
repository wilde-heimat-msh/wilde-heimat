"use client";

import { useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

type MotionProfile = {
  reduced: boolean;
  /** Touch / schmale Viewports – leichtere Animationen */
  lite: boolean;
  /** Parallax & schwere Scroll-Effekte */
  parallax: boolean;
};

function readMotionProfile(reduced: boolean | null): MotionProfile {
  if (typeof window === "undefined") {
    return { reduced: false, lite: true, parallax: false };
  }

  const isReduced = Boolean(reduced);
  const isNarrow = window.matchMedia("(max-width: 767px)").matches;
  const isCoarse = window.matchMedia("(pointer: coarse)").matches;
  const lite = isReduced || isNarrow || isCoarse;
  const parallax = !lite && window.matchMedia("(min-width: 768px)").matches;

  return { reduced: isReduced, lite, parallax };
}

export function useMotionProfile(): MotionProfile {
  const reducedMotion = useReducedMotion();
  const [profile, setProfile] = useState<MotionProfile>(() =>
    readMotionProfile(reducedMotion)
  );

  useEffect(() => {
    const update = () => setProfile(readMotionProfile(reducedMotion));

    update();

    const queries = [
      window.matchMedia("(max-width: 767px)"),
      window.matchMedia("(pointer: coarse)"),
      window.matchMedia("(min-width: 768px)"),
      window.matchMedia("(prefers-reduced-motion: reduce)"),
    ];

    for (const mq of queries) {
      mq.addEventListener("change", update);
    }

    return () => {
      for (const mq of queries) {
        mq.removeEventListener("change", update);
      }
    };
  }, [reducedMotion]);

  return profile;
}
