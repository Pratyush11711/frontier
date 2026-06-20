"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
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
  },
  {
    gradient: brandGradients.slateDeep,
    accent: "text-white/75",
    icon: "text-white/85",
  },
  {
    gradient: brandGradients.pacificDeep,
    accent: "text-aqua-200",
    icon: "text-aqua-200",
  },
] as const;

function StoryCardVideo({ src, isActive }: { src: string; isActive: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isActive && !prefersReducedMotion) {
      void video.play().catch(() => {});
      return;
    }

    video.pause();
  }, [isActive, prefersReducedMotion, src]);

  return (
    <video
      ref={videoRef}
      loop
      muted
      playsInline
      preload="metadata"
      aria-hidden
      className="absolute inset-0 h-full w-full object-cover object-center"
      src={src}
    />
  );
}

function PointItem({
  title,
  body,
  index,
  isActive,
}: {
  title: string;
  body: string;
  index: number;
  isActive: boolean;
}) {
  return (
    <motion.div
      initial={false}
      animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0.7, y: 6 }}
      transition={{ duration: 0.45, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="border-t border-white/10 pt-4 first:border-t-0 first:pt-0 sm:pt-5 lg:pt-6"
    >
      <span className="type-mono-data text-white/30">{String(index + 1).padStart(2, "0")}</span>
      <h3 className="type-h3 mt-1.5 text-balance text-white sm:mt-2">{title}</h3>
      <p className="type-body-s mt-1.5 text-pretty text-white/75 sm:mt-2 sm:type-body-l">{body}</p>
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
  const videoLeft = index % 2 === 1;

  return (
    <motion.div
      className="absolute inset-0 flex items-start justify-center px-2 pt-[4.75rem] sm:items-center sm:px-5 sm:pt-0 lg:px-8"
      style={{ y, scale, zIndex: index, transformOrigin: "top center" }}
    >
      <article
        className="relative flex h-auto max-h-[calc(100svh-5.5rem)] w-full max-w-[1480px] flex-col overflow-hidden rounded-[1.5rem] border border-white/12 shadow-2xl sm:max-h-[min(96vh,1040px)] sm:h-[min(96vh,1040px)] sm:rounded-[2.5rem] lg:rounded-[3rem]"
        style={{ background: theme.gradient }}
      >
        <div className="relative z-10 grid h-full min-h-0 w-full grid-cols-1 lg:grid-cols-2">
          <div
            className={cn(
              "relative w-full min-w-0 shrink-0 overflow-hidden",
              "aspect-[16/10] max-h-[32svh] sm:aspect-auto sm:max-h-none sm:min-h-[min(34vh,300px)] lg:min-h-0 lg:h-full",
              videoLeft ? "lg:order-2" : "lg:order-1",
            )}
          >
            <StoryCardVideo src={chapter.video} isActive={isActive} />
          </div>

          <div
            className={cn(
              "relative flex min-h-0 w-full min-w-0 flex-1 flex-col justify-start overflow-y-auto overscroll-contain px-4 py-4 sm:justify-center sm:overflow-visible sm:px-7 sm:py-8 lg:px-10 lg:py-10",
              videoLeft ? "lg:order-1" : "lg:order-2",
            )}
          >
            <header className="mb-4 shrink-0 sm:mb-6 lg:mb-8">
              <div className="flex items-start gap-2.5 sm:gap-4">
                <span
                  className={cn(
                    "glass-ios-icon mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl sm:mt-1 sm:h-11 sm:w-11 sm:rounded-2xl lg:h-12 lg:w-12",
                    theme.icon,
                  )}
                >
                  <DuotoneIcon name={chapter.icon} className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
                </span>
                <div className="min-w-0">
                  <p className={cn("type-mono-label text-[0.65rem] tracking-[0.14em] sm:text-[length:inherit] sm:tracking-[length:inherit]", theme.accent)}>
                    {String(index + 1).padStart(2, "0")} / 03
                  </p>
                  <h2 className="type-editorial-28 mt-1.5 max-w-xl text-balance text-white sm:type-editorial-40 sm:mt-2">
                    {chapter.title}
                  </h2>
                </div>
              </div>
            </header>

            <div className="flex flex-col gap-4 sm:gap-5 lg:gap-6">
              {chapter.points.map((point, pointIndex) => (
                <PointItem
                  key={point.title}
                  title={point.title}
                  body={point.body}
                  index={pointIndex}
                  isActive={isActive}
                />
              ))}
            </div>
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
      <div className="sticky top-0 left-0 flex h-[100svh] w-full items-start justify-center overflow-hidden sm:items-center">
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
