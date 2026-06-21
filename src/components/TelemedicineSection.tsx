"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { telemedicineSection } from "@/lib/content";
import { brandGradients } from "@/lib/brandGradients";
import { blurReveal, staggerSlow, defaultViewport } from "@/lib/motion";
import { cn } from "@/lib/utils";

const STEP_COUNT = telemedicineSection.points.length;

/**
 * Vertical Y-position (in viewBox units, 0-100) each separate line sits at
 * before converging, and the shared Y-position they merge into.
 * NOTE: array length must stay in sync with telemedicineSection.points.
 */
const LINE_START_Y = [18, 39, 61, 82];
const MERGE_Y = 50;

function ConvergingLine({
  startY,
  mergeProgress,
}: {
  startY: number;
  mergeProgress: MotionValue<number>;
}) {
  const y = useTransform(mergeProgress, [0, 1], [startY, MERGE_Y]);
  const d = useTransform(y, (value) => {
    const startX = 0;
    const bendX = 58;
    const endX = 72;
    return `M ${startX} ${startY} L ${bendX} ${startY} Q ${endX} ${startY} ${endX} ${value} L ${endX} ${value}`;
  });

  return (
    <motion.path
      d={d}
      fill="none"
      stroke="rgba(127, 219, 218, 0.55)"
      strokeWidth={0.18}
      vectorEffect="non-scaling-stroke"
    />
  );
}

function ConvergingLines({ progress }: { progress: MotionValue<number> }) {
  // Phase A [0, 0.45]: lines sit still, apart, fully visible.
  // Phase B [0.45, 0.75]: lines sweep toward the shared merge line.
  // Phase C [0.75, 1]: a single solid line originates exactly at the merge
  // point (72, MERGE_Y) and travels rightward to the section's edge.
  const mergeProgress = useTransform(progress, [0.45, 0.75], [0, 1]);
  const travelProgress = useTransform(progress, [0.75, 1], [0, 1]);
  const mergeX = 72;
  const travelX2 = useTransform(travelProgress, [0, 1], [mergeX, 100]);
  const travelOpacity = useTransform(mergeProgress, [0.85, 1], [0, 1]);

  return (
    <svg
      aria-hidden
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className="absolute inset-0 h-full w-full"
    >
      {LINE_START_Y.map((startY, index) => (
        <ConvergingLine key={index} startY={startY} mergeProgress={mergeProgress} />
      ))}

      {/* Single continuous line, originating exactly at the merge point and
          travelling rightward. x1 is fixed at the merge point; only x2 grows,
          so the line is always solid (no dasharray involved) and its start
          never moves. */}
      <motion.line
        x1={mergeX}
        y1={MERGE_Y}
        x2={travelX2}
        y2={MERGE_Y}
        stroke="rgba(127, 219, 218, 0.85)"
        strokeWidth={0.22}
        vectorEffect="non-scaling-stroke"
        style={{ opacity: travelOpacity }}
      />
    </svg>
  );
}

function StepRow({
  index,
  title,
  text,
  progress,
}: {
  index: number;
  title: string;
  text: string;
  progress: MotionValue<number>;
}) {
  const start = (index / STEP_COUNT) * 0.4;
  const end = start + 0.4 / STEP_COUNT + 0.08;
  const opacity = useTransform(progress, [start, end], [0.25, 1]);
  const y = useTransform(progress, [start, end], [16, 0]);

  return (
    <motion.div
      style={{ opacity, y }}
      className={cn(
        "flex flex-col gap-1 text-left sm:flex-row sm:items-baseline sm:gap-5",
        index % 2 === 1 && "sm:flex-row-reverse sm:text-right",
      )}
    >
      <span className="type-mono-data shrink-0 text-aqua-300/70">
        {String(index + 1).padStart(2, "0")}
      </span>
      <div className="flex flex-col gap-1">
        <h3 className="type-h3 text-balance text-white">{title}</h3>
        <p className="type-body-s max-w-md text-pretty text-white/70">{text}</p>
      </div>
    </motion.div>
  );
}

export function TelemedicineSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <section
      id="telemedicine"
      data-nav-theme="dark"
      className="relative scroll-mt-28 bg-deep-teal"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{ background: brandGradients.pacificDeep }}
      />

      <div ref={containerRef} className="relative h-[320svh] sm:h-[280svh]">
        <div className="sticky top-0 left-0 flex h-screen w-full flex-col overflow-hidden">
          <div className="relative z-10 mx-auto w-full max-w-container shrink-0 px-3 pt-14 pb-5 sm:px-4 sm:pt-16 sm:pb-6 lg:px-5">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={defaultViewport}
              variants={staggerSlow}
              className="mx-auto max-w-3xl text-center"
            >
              <motion.p variants={blurReveal} className="type-mono-label text-aqua-300">
                {telemedicineSection.eyebrow}
              </motion.p>
              <motion.h2
                variants={blurReveal}
                className="type-editorial-40 mt-3 text-balance text-white sm:mt-4"
              >
                {telemedicineSection.heading}
              </motion.h2>
            </motion.div>
          </div>

          {/* Background convergence art */}
          <div className="absolute inset-x-0 bottom-0 top-[28%] sm:top-[24%]">
            <ConvergingLines progress={scrollYProgress} />
          </div>

          {/* Step list, revealed as part of the same scroll-pinned phase */}
          <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center gap-7 px-5 sm:gap-9 sm:px-8 lg:px-10">
            {telemedicineSection.points.map((point, index) => (
              <StepRow
                key={point.title}
                index={index}
                title={point.title}
                text={point.text}
                progress={scrollYProgress}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}