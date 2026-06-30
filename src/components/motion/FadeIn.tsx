"use client";

import { motion, useReducedMotion } from "framer-motion";
import { type ReactNode } from "react";
import { useMotionProfile } from "@/hooks/useMotionProfile";
import { MOTION_DURATION, MOTION_EASE } from "@/lib/motion";

type FadeInProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  duration?: number;
};

const offsets = {
  up: { y: 24, x: 0 },
  down: { y: -24, x: 0 },
  left: { x: 24, y: 0 },
  right: { x: -24, y: 0 },
  none: { x: 0, y: 0 },
};

const liteOffsets = {
  up: { y: 14, x: 0 },
  down: { y: -14, x: 0 },
  left: { x: 14, y: 0 },
  right: { x: -14, y: 0 },
  none: { x: 0, y: 0 },
};

export function FadeIn({
  children,
  className = "",
  delay = 0,
  direction = "up",
  duration,
}: FadeInProps) {
  const reduced = useReducedMotion();
  const { lite } = useMotionProfile();
  const offsetMap = lite ? liteOffsets : offsets;
  const offset = offsetMap[direction];
  const motionDuration = duration ?? (lite ? MOTION_DURATION.fast : MOTION_DURATION.normal);

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, ...offset }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: lite ? "0px 0px -40px 0px" : "-80px 0px" }}
      transition={{ duration: motionDuration, delay, ease: MOTION_EASE }}
      className={`motion-layer ${className}`}
    >
      {children}
    </motion.div>
  );
}

type StaggerProps = {
  children: ReactNode;
  className?: string;
  stagger?: number;
};

export function Stagger({ children, className = "", stagger }: StaggerProps) {
  const reduced = useReducedMotion();
  const { lite } = useMotionProfile();
  const staggerDelay = stagger ?? (lite ? 0.06 : 0.1);

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: lite ? "0px 0px -32px 0px" : "-60px 0px" }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: staggerDelay } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const { lite } = useMotionProfile();

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: lite ? 12 : 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: lite ? MOTION_DURATION.fast : MOTION_DURATION.normal,
            ease: MOTION_EASE,
          },
        },
      }}
      className={`motion-layer ${className}`}
    >
      {children}
    </motion.div>
  );
}
