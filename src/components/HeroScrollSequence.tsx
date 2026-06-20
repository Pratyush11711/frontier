"use client";

import { useEffect, useMemo, useRef } from "react";
import { useMotionValueEvent, type MotionValue } from "framer-motion";
import { getHeroFramePaths, heroFrameSequence } from "@/lib/heroFrames";
import { getMobileFramePaths, mobileFrameSequence } from "@/lib/mobileFrames";
import { ScrollSequenceRenderer } from "@/lib/webgl/scrollSequence";
import { cn } from "@/lib/utils";

export type HeroFrameVariant = "desktop" | "mobile";

interface HeroScrollSequenceProps {
  scrollProgress: MotionValue<number>;
  className?: string;
  /** When false, frames autoplay only (used for the mobile panel below copy). */
  scrollLinked?: boolean;
  /** Desktop uses laptop frames; mobile uses mobile.mp4 cutouts only. */
  variant?: HeroFrameVariant;
}

function getFrameConfig(variant: HeroFrameVariant) {
  if (variant === "mobile") {
    return {
      sequence: mobileFrameSequence,
      paths: getMobileFramePaths(),
    };
  }
  return {
    sequence: heroFrameSequence,
    paths: getHeroFramePaths(),
  };
}

/** Frames per second for the autoplay loop before the user scrolls. */
const AUTOPLAY_FPS = 24;

/**
 * How quickly the displayed frame eases toward the scroll-mapped target,
 * per RAF tick. 1 = instant snap (old behavior), lower = smoother/laggier.
 */
const SCROLL_LERP_FACTOR = 0.18;

export function HeroScrollSequence({
  scrollProgress,
  className,
  scrollLinked = true,
  variant = "desktop",
}: HeroScrollSequenceProps) {
  const { sequence: frameSequence, paths: framePaths } = useMemo(
    () => getFrameConfig(variant),
    [variant],
  );
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<ScrollSequenceRenderer | null>(null);

  // Scroll-linked target frame (set via motion value event) and the
  // smoothed/eased frame actually displayed, which chases the target.
  const targetFrameRef = useRef(0);
  const smoothedFrameRef = useRef(0);
  const lastRenderedFrameRef = useRef(-1);
  const rafRef = useRef(0);

  // Autoplay state — disabled the moment the user begins scrolling.
  const autoplayActiveRef = useRef(true);
  // Fractional frame counter so autoplay advances smoothly between integers.
  const autoplayFrameRef = useRef(0);
  // Timestamp of the previous RAF tick, used to compute delta-time.
  const lastTimestampRef = useRef<number | null>(null);

  useMotionValueEvent(scrollProgress, "change", (value) => {
    if (!scrollLinked) return;

    const maxIndex = frameSequence.frameCount - 1;
    targetFrameRef.current = Math.max(0, Math.min(1, value)) * maxIndex;

    if (value > 0 && autoplayActiveRef.current) {
      autoplayActiveRef.current = false;
      // Start the smoothing chase from wherever autoplay currently is,
      // rather than snapping, so the handoff itself is seamless.
      smoothedFrameRef.current = autoplayFrameRef.current;
    }
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let disposed = false;

    try {
      rendererRef.current = new ScrollSequenceRenderer(canvas, {
        imageWidth: frameSequence.width,
        imageHeight: frameSequence.height,
        framePaths,
        fit: "cover",
        feather: false,
        zoom: 1.0,
        focusY: variant === "mobile" ? 0.5 : 1,
      });
    } catch {
      return;
    }

    const resize = () => {
      if (!rendererRef.current || !canvas) return;
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      rendererRef.current.resize(rect.width, rect.height, dpr);
    };

    const renderLoop = (timestamp: number) => {
      const renderer = rendererRef.current;

      if (!disposed && renderer?.ready) {
        let nextFrame: number;

        if (autoplayActiveRef.current) {
          // Delta-time advance so the loop is frame-rate independent.
          if (lastTimestampRef.current === null) lastTimestampRef.current = timestamp;
          const delta = timestamp - lastTimestampRef.current;
          lastTimestampRef.current = timestamp;

          const maxIndex = frameSequence.frameCount - 1;
          autoplayFrameRef.current += (delta / 1000) * AUTOPLAY_FPS;
          // Wrap around for a seamless loop.
          if (autoplayFrameRef.current > maxIndex) {
            autoplayFrameRef.current = autoplayFrameRef.current % (maxIndex + 1);
          }
          nextFrame = Math.floor(autoplayFrameRef.current);
        } else {
          // Scroll-linked: ease the displayed frame toward the scroll
          // target instead of snapping, so fast/jittery swipes feel smooth.
          smoothedFrameRef.current +=
            (targetFrameRef.current - smoothedFrameRef.current) * SCROLL_LERP_FACTOR;

          // Snap once close enough to avoid an infinite asymptotic crawl.
          if (Math.abs(targetFrameRef.current - smoothedFrameRef.current) < 0.05) {
            smoothedFrameRef.current = targetFrameRef.current;
          }

          nextFrame = Math.round(smoothedFrameRef.current);
        }

        if (nextFrame !== lastRenderedFrameRef.current) {
          if (renderer.setFrame(nextFrame)) {
            renderer.render();
            lastRenderedFrameRef.current = nextFrame;
          }
        }
      }

      rafRef.current = requestAnimationFrame(renderLoop);
    };

    resize();
    rafRef.current = requestAnimationFrame(renderLoop);

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    return () => {
      disposed = true;
      cancelAnimationFrame(rafRef.current);
      observer.disconnect();
      rendererRef.current?.destroy();
      rendererRef.current = null;
    };
  }, [scrollLinked, variant, frameSequence, framePaths]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      // Transparent so the hero gradient shows through cut-out frame pixels.
      style={{ backgroundColor: "transparent" }}
      className={cn("h-full w-full [image-rendering:auto]", className)}
    />
  );
}