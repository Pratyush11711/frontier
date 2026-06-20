"use client";

import { motion, useReducedMotion, useTransform, type MotionValue } from "framer-motion";

/** Share of hero scroll (0–1) used to reveal all copy word by word. */
export const HERO_TEXT_REVEAL_END = 0.42;

interface HeroScrollRevealWordProps {
  word: string;
  index: number;
  total: number;
  scrollProgress: MotionValue<number>;
  className?: string;
  /** Render at full opacity immediately — no scroll animation. */
  alwaysVisible?: boolean;
}

export function HeroScrollRevealWord({
  word,
  index,
  total,
  scrollProgress,
  className = "",
  alwaysVisible = false,
}: HeroScrollRevealWordProps) {
  const reducedMotion = useReducedMotion();
  const step = HERO_TEXT_REVEAL_END / Math.max(total, 1);
  const start = index * step;
  const end = start + step;

  const opacity = useTransform(scrollProgress, [start, end], [0, 1]);
  const y = useTransform(scrollProgress, [start, end], [10, 0]);

  if (alwaysVisible || reducedMotion) {
    return <span className={`mr-[0.28em] inline-block ${className}`}>{word}</span>;
  }

  return (
    <motion.span
      style={{ opacity, y }}
      className={`inline-block mr-[0.28em] will-change-[opacity,transform] ${className}`}
    >
      {word}
    </motion.span>
  );
}
