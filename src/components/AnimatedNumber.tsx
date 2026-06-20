"use client";

import { useEffect, useRef, useState } from "react";
import { animate, motion, useInView } from "framer-motion";

function parseStatValue(value: string) {
  const suffix = value.endsWith("+") ? "+" : "";
  const useCommas = value.includes(",");
  const num = parseInt(value.replace(/[^0-9]/g, ""), 10);
  return { num, suffix, useCommas };
}

interface AnimatedNumberProps {
  value: string;
  className?: string;
}

export function AnimatedNumber({ value, className = "" }: AnimatedNumberProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const { num, suffix, useCommas } = parseStatValue(value);
  const [display, setDisplay] = useState("0" + suffix);

  useEffect(() => {
    if (!isInView) return;

    const controls = animate(0, num, {
      duration: 2,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (latest) => {
        const rounded = Math.round(latest);
        const formatted = useCommas ? rounded.toLocaleString("en-US") : String(rounded);
        setDisplay(formatted + suffix);
      },
    });

    return () => controls.stop();
  }, [isInView, num, suffix, useCommas]);

  return (
    <motion.span
      ref={ref}
      className={className}
      initial={{ opacity: 0, scale: 0.6 }}
      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.6 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      {display}
    </motion.span>
  );
}
