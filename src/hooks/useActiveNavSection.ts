"use client";

import { useEffect, useState } from "react";

const NAV_PROBE_Y = 72;
/** Offset so anchored sections (scroll-mt) and the footer still activate correctly */
const SECTION_ACTIVATE_OFFSET = 140;

export function useActiveNavSection(hrefs: readonly string[]) {
  const [activeHref, setActiveHref] = useState<string | null>(null);

  useEffect(() => {
    const sections = hrefs
      .map((href) => {
        const id = href.replace("#", "");
        const el = document.getElementById(id);
        return el ? { href, el } : null;
      })
      .filter((entry): entry is { href: string; el: HTMLElement } => entry !== null);

    if (!sections.length) return;

    const sectionTop = (el: HTMLElement) => {
      const rect = el.getBoundingClientRect();
      return rect.top + window.scrollY;
    };

    const update = () => {
      const scrollPosition = window.scrollY + NAV_PROBE_Y;
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;

      // At the bottom of the page, always activate the last link (Contact → footer)
      if (window.scrollY >= maxScroll - 4) {
        const last = sections[sections.length - 1];
        setActiveHref((prev) => (prev === last.href ? prev : last.href));
        return;
      }

      let next = sections[0].href;
      for (const section of sections) {
        if (scrollPosition >= sectionTop(section.el) - SECTION_ACTIVATE_OFFSET) {
          next = section.href;
        }
      }

      setActiveHref((prev) => (prev === next ? prev : next));
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [hrefs]);

  return activeHref;
}
