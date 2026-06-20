"use client";

import { useEffect, useMemo, useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";
import { LogoMarquee } from "@/components/LogoMarquee";
import { trustStrip } from "@/lib/content";

function TrustRevealWord({
  word,
  className,
  index,
  total,
  progress,
}: {
  word: string;
  className: string;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const rangeStart = 0;
  const rangeEnd = 0.92;
  const segment = (rangeEnd - rangeStart) / total;
  const start = rangeStart + index * segment;
  const end = start + segment;

  const opacity = useTransform(progress, (value) => {
    if (value >= end) return 1;
    if (value <= start) return 0;
    return (value - start) / (end - start);
  });
  const y = useTransform(progress, [start, end, 1], ["12px", "0px", "0px"]);
  const filter = useTransform(progress, (value) => {
    if (value >= end) return "blur(0px)";
    if (value <= start) return "blur(4px)";
    const t = (value - start) / (end - start);
    return `blur(${4 * (1 - t)}px)`;
  });

  return (
    <motion.span
      style={{ opacity, y, filter }}
      className={`mr-[0.25em] inline-block ${className}`}
    >
      {word}
    </motion.span>
  );
}

function TrustVideo({ animate }: { animate: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !animate) return;
    void video.play().catch(() => {});
  }, [animate]);

  return (
    <video
      ref={videoRef}
      autoPlay={animate}
      loop
      muted
      playsInline
      preload="metadata"
      aria-hidden
      className="absolute inset-0 z-0 h-full w-full object-cover object-center"
      src="/trust.mp4"
    />
  );
}

export function TrustStrip() {
  const cardRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const animate = !prefersReducedMotion;

  const { scrollYProgress: textScrollProgress } = useScroll({
    target: cardRef,
    offset: ["start 85%", "start 25%"],
  });

  const wordsArray = useMemo(() => {
    const arr: { word: string; className: string }[] = [];
    const addWords = (text: string, className: string = "") => {
      if (!text) return;
      text.split(" ").filter(Boolean).forEach((word) => {
        arr.push({ word, className });
      });
    };

    addWords(trustStrip.claim.lead);
    addWords(trustStrip.claim.highlight, "text-aqua-300");
    addWords(trustStrip.claim.mid);
    addWords(trustStrip.claim.close);
    return arr;
  }, []);

  return (
    <section
      id="trust"
      data-nav-theme="dark"
      className="relative isolate bg-deep-teal px-3 sm:px-4 lg:px-5"
    >
      {/* Mobile — section label separating hero from trust card */}
      <div className="mx-auto w-full max-w-[1400px] border-t border-white/10 px-4 pt-8 pb-4 text-center sm:px-6 lg:hidden">
        <p className="font-editorial text-[clamp(1.25rem,4.5vw,1.75rem)] font-light leading-[1.2] tracking-[-0.02em] text-aqua-300">
          {trustStrip.eyebrow}
        </p>
      </div>

      <div className="flex w-full items-center justify-center py-8 sm:py-12 lg:py-16">
        <div className="relative mx-auto w-full max-w-container">
          <div
            ref={cardRef}
            className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/5 sm:rounded-[2rem] lg:rounded-[2.25rem]"
          >
            <div className="relative flex flex-col lg:flex-row">
              <div className="relative min-h-[220px] w-full overflow-hidden bg-deep-teal sm:min-h-[260px] lg:min-h-[380px] lg:w-[38%] lg:max-w-[460px] lg:shrink-0">
                <TrustVideo animate={animate} />
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-deep-teal/90 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-deep-teal/90"
                />
              </div>

              <div className="flex flex-1 flex-col justify-center px-6 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12 xl:px-12">
                <p className="type-mono-label hidden text-aqua-300 lg:block">{trustStrip.eyebrow}</p>

                <h2 className="type-editorial-40 max-w-xl text-pretty text-white sm:max-w-2xl lg:mt-4 lg:max-w-2xl">
                  {animate ? (
                    <>
                      {wordsArray.slice(0, 3).map((item, index) => (
                        <span
                          key={index}
                          className={`mr-[0.25em] inline-block ${item.className || "text-white"}`}
                        >
                          {item.word}
                        </span>
                      ))}
                      {wordsArray.slice(3).map((item, index) => (
                        <TrustRevealWord
                          key={index + 3}
                          word={item.word}
                          className={item.className || "text-white"}
                          index={index}
                          total={wordsArray.length - 3}
                          progress={textScrollProgress}
                        />
                      ))}
                    </>
                  ) : (
                    wordsArray.map((item, index) => (
                      <span
                        key={index}
                        className={`mr-[0.25em] inline-block ${item.className || "text-white"}`}
                      >
                        {item.word}
                      </span>
                    ))
                  )}
                </h2>

                <div className="mt-8 border-t border-white/10 pt-8 sm:mt-10 sm:pt-10">
                  <p className="type-mono-label mb-4 text-white/40 sm:mb-5">
                    Investor groups &amp; partner companies
                  </p>
                  <LogoMarquee items={trustStrip.logos} theme="dark" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
