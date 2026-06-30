"use client";

import { useEffect, useState } from "react";

export function ScrollHeader({ children }: { children: React.ReactNode }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let frame = 0;

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        setScrolled(window.scrollY > 20);
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-[background-color,box-shadow,border-color,backdrop-filter] duration-300 ${
        scrolled
          ? "border-border bg-background/90 shadow-soft backdrop-blur-md"
          : "border-border/60 bg-background/95 backdrop-blur-sm"
      }`}
    >
      {children}
    </header>
  );
}
