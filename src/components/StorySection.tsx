"use client";

import { useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useTransform,
  useScroll,
  type MotionValue,
} from "framer-motion";
import { storySections } from "@/lib/content";
import { brandGradients } from "@/lib/brandGradients";
import { DuotoneIcon } from "@/components/ui/duotone-icon";
import { cn } from "@/lib/utils";

const chapterThemes = [
  {
    gradient: brandGradients.tealDeep,
    accent: "text-aqua-200",
    icon: "text-aqua-200",
    boxTint: "from-aqua-200/14 via-aqua-200/5 to-transparent",
    boxBorder: "border-aqua-200/20",
  },
  {
    gradient: brandGradients.slateDeep,
    accent: "text-white/75",
    icon: "text-white/85",
    boxTint: "from-white/14 via-white/5 to-transparent",
    boxBorder: "border-white/20",
  },
  {
    gradient: brandGradients.pacificDeep,
    accent: "text-aqua-200",
    icon: "text-aqua-200",
    boxTint: "from-aqua-200/14 via-aqua-200/5 to-transparent",
    boxBorder: "border-aqua-200/20",
  },
] as const;

function FeatureBox({
  title,
  index,
  isActive,
  theme,
}: {
  title: string;
  index: number;
  isActive: boolean;
  theme: (typeof chapterThemes)[number];
}) {
  return (
    <motion.div
      initial={false}
      animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0.7, y: 10 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "glass relative flex aspect-[3/2] w-full flex-col overflow-hidden rounded-2xl border bg-gradient-to-b sm:aspect-[6/5] sm:rounded-[1.75rem]",
        theme.boxBorder,
        theme.boxTint,
      )}
    >
      {/* Stage reserved for a future per-feature animation */}
      <div className="relative flex-1" data-animation-stage={index} />

      <div className="relative shrink-0 border-t border-white/10 px-3 py-2.5 sm:px-6 sm:py-5">
        <h3 className="type-h3 text-balance text-[0.9rem] leading-snug text-white sm:text-[1.35rem] sm:leading-snug">
          {title}
        </h3>
      </div>
    </motion.div>
  );
}

interface ChapterCardProps {
  chapter: (typeof storySections)[number];
  index: number;
  totalChapters: number;
  scrollYProgress: MotionValue<number>;
  isActive: boolean;
}

function ChapterCard({ chapter, index, totalChapters, scrollYProgress, isActive }: ChapterCardProps) {
  const isFirst = index === 0;
  const isLast = index === totalChapters - 1;
  const step = 1 / Math.max(totalChapters - 1, 1);

  const startEnter = isFirst ? 0 : (index - 1) * step;
  const endEnter = isFirst ? 0.001 : index * step;
  const endExit = (index + 1) * step;

  const inputRange = isLast ? [startEnter, endEnter] : [startEnter, endEnter, endExit];

  const y = useTransform(
    scrollYProgress,
    inputRange,
    isLast
      ? [isFirst ? "0vh" : "100vh", "0vh"]
      : [isFirst ? "0vh" : "100vh", "0vh", "-8vh"],
  );

  const scale = useTransform(scrollYProgress, inputRange, isLast ? [1, 1] : [1, 1, 0.94]);

  const overlayOpacity = useTransform(
    scrollYProgress,
    isLast ? [0, 1] : [endEnter, endExit],
    isLast ? [0, 0] : [0, 0.75],
  );

  const theme = chapterThemes[index];

  return (
    <motion.div
      className="absolute inset-0 flex items-start justify-center px-2 py-3 sm:items-center sm:px-5 sm:py-0 lg:px-8"
      style={{ y, scale, zIndex: index, transformOrigin: "top center" }}
    >
      <article
        className="relative flex h-auto max-h-[calc(100svh+16rem)] w-full max-w-[1600px] flex-col overflow-y-auto overscroll-contain rounded-[1.5rem] border border-white/12 shadow-2xl sm:max-h-[min(96vh,1040px)] sm:h-[min(96vh,1040px)] sm:overflow-hidden sm:rounded-[2.5rem] lg:rounded-[3rem]"
        style={{ background: theme.gradient }}
      >
        <div className="relative z-10 flex h-full min-h-0 w-full flex-col items-center justify-center px-4 py-6 sm:px-10 sm:py-10 lg:px-16 lg:py-12">
          <header className="mb-5 w-full max-w-3xl shrink-0 text-center sm:mb-10">
            <div className="flex flex-col items-center gap-2 sm:gap-4">
              <span
                className={cn(
                  "glass-ios-icon flex h-9 w-9 shrink-0 items-center justify-center rounded-xl sm:h-12 sm:w-12 sm:rounded-2xl",
                  theme.icon,
                )}
              >
                <DuotoneIcon name={chapter.icon} className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
              </span>
              <h2 className="type-editorial-28 text-balance text-[1.4rem] leading-tight text-white sm:text-[2.75rem] sm:leading-[1.05] lg:text-[3.25rem]">
                {chapter.title}
              </h2>
            </div>
          </header>

          <div className="grid w-full max-w-6xl shrink-0 grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-6 lg:gap-8">
            {chapter.points.map((point, pointIndex) => (
              <FeatureBox
                key={point.title}
                title={point.title}
                index={pointIndex}
                isActive={isActive}
                theme={theme}
              />
            ))}
          </div>
        </div>

        <motion.div
          className="pointer-events-none absolute inset-0 z-20 bg-[#011a24]"
          style={{ opacity: overlayOpacity }}
        />
      </article>
    </motion.div>
  );
}

export function StorySection() {
  const containerRef = useRef<HTMLElement>(null);
  const totalChapters = storySections.length;
  const [activeIndex, setActiveIndex] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    const next =
      totalChapters <= 1
        ? 0
        : Math.min(totalChapters - 1, Math.max(0, Math.round(progress * (totalChapters - 1))));
    setActiveIndex((prev) => (prev === next ? prev : next));
  });

  return (
    <section
      id="why-frontier"
      ref={containerRef}
      data-nav-theme="dark"
      className="relative scroll-mt-28 bg-deep-teal"
      style={{ height: `${totalChapters * 100}svh` }}
    >
      <div className="sticky top-0 left-0 flex h-[100svh] w-full items-start justify-center overflow-y-auto overflow-x-hidden sm:items-center sm:overflow-hidden">
        {storySections.map((chapter, index) => (
          <ChapterCard
            key={chapter.id}
            chapter={chapter}
            index={index}
            totalChapters={totalChapters}
            scrollYProgress={scrollYProgress}
            isActive={activeIndex === index}
          />
        ))}
      </div>
    </section>
  );
}