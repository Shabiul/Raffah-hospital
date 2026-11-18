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
      const [
        { gsap },
        { ScrollTrigger },
        { SplitText },
        { default: Lenis },
        { default: initMotion },
        { default: initExtraMotion },
        { Draggable },
      ] =
        await Promise.all([
          import("gsap"),
          import("gsap/ScrollTrigger"),
          import("gsap/SplitText"),
          import("lenis"),
          import("@/lib/motion"),
          import("@/lib/extra-motion"),
          import("gsap/Draggable"),
        ]);
      gsap.registerPlugin(Draggable);
      Object.assign(window, { gsap, ScrollTrigger, SplitText, Lenis, Draggable });
      initMotion();
      // Extra effects need the template to have registered ScrollTrigger first.
      if (root.classList.contains("motion")) initExtraMotion();
    })().catch((err) => {
      console.error(err);
      root.classList.remove("motion");
    });
  }, []);

  return null;
}
