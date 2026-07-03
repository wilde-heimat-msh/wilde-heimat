"use client";

import { useEffect } from "react";

export function PatenHashScroller() {
  useEffect(() => {
    if (window.location.hash !== "#zugang") return;
    const target = document.getElementById("zugang");
    if (!target) return;
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return null;
}
