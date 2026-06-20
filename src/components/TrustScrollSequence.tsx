"use client";

import { useEffect, useRef } from "react";
import { useMotionValueEvent, type MotionValue } from "framer-motion";
import { getTrustFramePaths, trustFrameSequence } from "@/lib/trustFrames";
import { ScrollSequenceRenderer } from "@/lib/webgl/scrollSequence";
import { cn } from "@/lib/utils";

interface TrustScrollSequenceProps {
  scrollProgress: MotionValue<number>;
  className?: string;
}

const AUTOPLAY_FPS = trustFrameSequence.fps;

export function TrustScrollSequence({ scrollProgress, className }: TrustScrollSequenceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<ScrollSequenceRenderer | null>(null);
  const frameIndexRef = useRef(0);
  const lastRenderedFrameRef = useRef(-1);
  const rafRef = useRef(0);
  const autoplayActiveRef = useRef(true);
  const autoplayFrameRef = useRef(0);
  const lastTimestampRef = useRef<number | null>(null);
  const hasScrolledRef = useRef(false);

  useMotionValueEvent(scrollProgress, "change", (value) => {
    const maxIndex = trustFrameSequence.frameCount - 1;
    frameIndexRef.current = Math.round(Math.max(0, Math.min(1, value)) * maxIndex);

    if (value > 0 && !hasScrolledRef.current) {
      hasScrolledRef.current = true;
      autoplayActiveRef.current = false;
    }
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let disposed = false;

    try {
      rendererRef.current = new ScrollSequenceRenderer(canvas, {
        imageWidth: trustFrameSequence.width,
        imageHeight: trustFrameSequence.height,
        framePaths: getTrustFramePaths(),
        fit: "cover",
        feather: false,
        zoom: 1.0,
        focusY: 0.5,
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
          if (lastTimestampRef.current === null) lastTimestampRef.current = timestamp;
          const delta = timestamp - lastTimestampRef.current;
          lastTimestampRef.current = timestamp;

          const maxIndex = trustFrameSequence.frameCount - 1;
          autoplayFrameRef.current += (delta / 1000) * AUTOPLAY_FPS;
          if (autoplayFrameRef.current > maxIndex) {
            autoplayFrameRef.current = autoplayFrameRef.current % (maxIndex + 1);
          }
          nextFrame = Math.floor(autoplayFrameRef.current);
        } else {
          nextFrame = frameIndexRef.current;
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
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      style={{ backgroundColor: "#011a24" }}
      className={cn("h-full w-full touch-none [image-rendering:auto]", className)}
    />
  );
}
