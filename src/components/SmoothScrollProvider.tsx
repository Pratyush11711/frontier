"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

const LenisContext = createContext<Lenis | null>(null);

export function useLenis() {
  return useContext(LenisContext);
}

function shouldUseSmoothScroll() {
  if (typeof window === "undefined") return false;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
  const narrowViewport = window.innerWidth < 768;

  return !reducedMotion && !(coarsePointer && narrowViewport);
}

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const lenisEnabled = pathname !== "/confirmation";

  useEffect(() => {
    if (!lenisEnabled) {
      setLenis(null);
      return;
    }

    if (!shouldUseSmoothScroll()) return;

    const instance = new Lenis({
      lerp: 0.085,
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.4,
      infinite: false,
      syncTouch: false,
    });

    setLenis(instance);

    let rafId = 0;
    const raf = (time: number) => {
      instance.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      instance.destroy();
      setLenis(null);
    };
  }, [lenisEnabled]);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
