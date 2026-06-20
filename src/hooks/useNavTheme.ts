"use client";

import { useEffect, useState } from "react";

export type NavTheme = "light" | "dark";

const NAV_PROBE_Y = 72;

export function useNavTheme() {
  const [theme, setTheme] = useState<NavTheme>("dark");

  useEffect(() => {
    let observer: IntersectionObserver | null = null;

    const setup = () => {
      observer?.disconnect();

      const sections = document.querySelectorAll<HTMLElement>("[data-nav-theme]");
      if (!sections.length) return;

      const bottomInset = Math.max(window.innerHeight - NAV_PROBE_Y - 1, 0);

      observer = new IntersectionObserver(
        (entries) => {
          const visible = entries
            .filter((entry) => entry.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

          if (!visible.length) return;

          const next = visible[0].target.getAttribute("data-nav-theme") as NavTheme | null;
          if (next) {
            setTheme((prev) => (prev === next ? prev : next));
          }
        },
        {
          root: null,
          rootMargin: `-${NAV_PROBE_Y}px 0px -${bottomInset}px 0px`,
          threshold: [0, 0.01, 0.1, 0.25, 0.5, 1],
        }
      );

      sections.forEach((section) => observer?.observe(section));
    };

    setup();
    window.addEventListener("resize", setup, { passive: true });

    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", setup);
    };
  }, []);

  return theme;
}
