"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { telemedicineSection } from "@/lib/content";
import { brandGradients } from "@/lib/brandGradients";
import { blurReveal, staggerSlow, defaultViewport } from "@/lib/motion";

const PANEL_COUNT = telemedicineSection.points.length;
const PANEL_WIDTH_VW = 44;
const PANEL_GAP_VW = 2;

const CARD_SHELL_BG = [
  "bg-[#1a4a54]",
  "bg-[#1d4550]",
  "bg-[#204a55]",
  "bg-[#234f5a]",
] as const;

function PanelVideo({ src, isActive }: { src: string; isActive: boolean }) {
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

export function TelemedicineSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [maxScrollPx, setMaxScrollPx] = useState(0);
  const [activeIndices, setActiveIndices] = useState<number[]>([0, 1]);

  useLayoutEffect(() => {
    const measure = () => {
      const track = trackRef.current;
      const viewport = viewportRef.current;
      if (!track || !viewport) return;

      setMaxScrollPx(Math.max(0, track.scrollWidth - viewport.clientWidth));
    };

    measure();

    const observer = new ResizeObserver(measure);
    if (trackRef.current) observer.observe(trackRef.current);
    if (viewportRef.current) observer.observe(viewportRef.current);

    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const x = useTransform(scrollYProgress, [0, 1], [0, -maxScrollPx]);

  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    const showLastPair = maxScrollPx > 0 ? progress >= 0.85 : false;
    const indices = showLastPair
      ? [PANEL_COUNT - 2, PANEL_COUNT - 1]
      : [0, 1];
    setActiveIndices((prev) =>
      prev.length === indices.length && prev.every((value, i) => value === indices[i])
        ? prev
        : indices,
    );
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

      <div
        ref={containerRef}
        className="relative"
        style={{ height: `calc(100vh + ${maxScrollPx}px)` }}
      >
        <div className="sticky top-0 left-0 z-10 flex h-screen w-full flex-col overflow-hidden">
          <div className="relative mx-auto w-full max-w-container shrink-0 px-3 pt-14 pb-5 sm:px-4 sm:pt-16 sm:pb-6 lg:px-5">
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

          <div
            ref={viewportRef}
            className="flex min-h-0 flex-1 items-center overflow-hidden pb-6 sm:pb-8"
          >
            <motion.div
              ref={trackRef}
              className="flex w-max items-stretch will-change-transform"
              style={{
                x,
                gap: `${PANEL_GAP_VW}vw`,
                paddingLeft: "3vw",
                paddingRight: "3vw",
              }}
            >
              {telemedicineSection.points.map((point, index) => (
                <article
                  key={point.title}
                  className={`flex max-w-[480px] shrink-0 flex-col rounded-[2.5rem] p-4 sm:rounded-[3rem] sm:p-5 ${CARD_SHELL_BG[index] ?? CARD_SHELL_BG[0]}`}
                  style={{ width: `${PANEL_WIDTH_VW}vw` }}
                >
                  <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden rounded-[1.5rem] bg-[#011a24] sm:rounded-[1.75rem]">
                    <PanelVideo
                      src={point.video}
                      isActive={activeIndices.includes(index)}
                    />
                  </div>

                  <div className="flex flex-1 flex-col items-center justify-center px-2 py-5 text-center sm:py-6">
                    <span className="type-mono-data text-aqua-300/60">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h3 className="type-h3 mt-2 text-balance text-white">{point.title}</h3>
                    <p className="type-body-s mt-2 text-pretty text-white/75">{point.text}</p>
                  </div>
                </article>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
