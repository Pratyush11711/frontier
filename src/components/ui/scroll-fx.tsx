"use client";

import { useRef, type ReactNode } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  type MotionStyle,
} from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Scroll-linked parallax. Moves children vertically as the element travels
 * through the viewport. `speed` > 0 drifts up (foreground), < 0 drifts down.
 */
export function Parallax({
  children,
  speed = 40,
  className,
}: {
  children: ReactNode;
  speed?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const raw = useTransform(scrollYProgress, [0, 1], [speed, -speed]);
  const y = useSpring(raw, { stiffness: 120, damping: 30, mass: 0.4 });

  return (
    <div ref={ref} className={cn("relative", className)}>
      <motion.div style={{ y }} className="h-full w-full">
        {children}
      </motion.div>
    </div>
  );
}

/**
 * Scroll-linked transform passthrough for fine-grained control. Exposes a
 * MotionStyle derived from the element's own scroll progress.
 */
export function useScrollFx(offset: [string, string] = ["start end", "end start"]) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    // @ts-expect-error framer accepts string offsets
    offset,
  });
  return { ref, scrollYProgress };
}

export function ParallaxImage({
  children,
  amount = 60,
  scale = 1.12,
  className,
}: {
  children: ReactNode;
  amount?: number;
  scale?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const yRaw = useTransform(scrollYProgress, [0, 1], [amount, -amount]);
  const y = useSpring(yRaw, { stiffness: 110, damping: 30, mass: 0.5 });

  const style: MotionStyle = { y, scale };

  return (
    <div ref={ref} className={cn("relative overflow-hidden", className)}>
      <motion.div style={style} className="absolute inset-0">
        {children}
      </motion.div>
    </div>
  );
}
