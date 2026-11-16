"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    __dentizzMotion?: boolean;
  }
}

// Loads GSAP + Lenis and runs the scroll animations that are driven by the
// data-* attributes and class names in the page markup (see lib/motion.js).
export default function Motion() {
  useEffect(() => {
    if (window.__dentizzMotion) return;
    window.__dentizzMotion = true;

    const root = document.documentElement;
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (!reduced) root.classList.add("motion");

    (async () => {
      const [{ gsap }, { ScrollTrigger }, { SplitText }, { default: Lenis }, { default: initMotion }] =
        await Promise.all([
          import("gsap"),
          import("gsap/ScrollTrigger"),
          import("gsap/SplitText"),
          import("lenis"),
          import("@/lib/motion"),
        ]);
      Object.assign(window, { gsap, ScrollTrigger, SplitText, Lenis });
      initMotion();
    })().catch((err) => {
      console.error(err);
      root.classList.remove("motion");
    });
  }, []);

  return null;
}
