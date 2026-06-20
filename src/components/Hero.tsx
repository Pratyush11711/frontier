"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useReducedMotion, type Variants } from "framer-motion";
import { hero } from "@/lib/content";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";
import { CTAButton } from "./CTAButton";
import { HeroScrollSequence } from "./HeroScrollSequence";

const HERO_DESKTOP_POSTER = "/hero-frames-cutout/frame_0001.png";
const HERO_MOBILE_POSTER = "/mobile-frames-cutout/frame_0001.png";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.2,
    },
  },
};

const wordVariants: Variants = {
  hidden: { opacity: 0, y: 20, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.6, ease: [0.2, 0.65, 0.3, 0.9] as [number, number, number, number] },
  },
};

function HeroVisual({
  animate,
  scrollLinked,
  scrollProgress,
  variant,
  className,
}: {
  animate: boolean;
  scrollLinked: boolean;
  scrollProgress: ReturnType<typeof useScroll>["scrollYProgress"];
  variant: "desktop" | "mobile";
  className?: string;
}) {
  const poster = variant === "mobile" ? HERO_MOBILE_POSTER : HERO_DESKTOP_POSTER;

  if (animate) {
    return (
      <HeroScrollSequence
        scrollProgress={scrollProgress}
        scrollLinked={scrollLinked}
        variant={variant}
        className={className}
      />
    );
  }

  return (
    <div className={className}>
      <Image
        src={poster}
        alt=""
        aria-hidden
        fill
        priority
        sizes="(max-width: 1024px) 100vw, 100vw"
        className={cn(
          "object-cover",
          variant === "mobile" ? "object-center" : "object-[78%_70%]",
        )}
      />
    </div>
  );
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const prefersReducedMotion = useReducedMotion();
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const animate = !prefersReducedMotion;

  return (
    <section
      id="hero"
      ref={ref}
      data-nav-theme="dark"
      aria-label="Frontier BioMed — one platform for clinics"
      className="relative h-[230vh] min-h-[100svh]"
    >
      <div className="bg-gradient-hero-section relative isolate sticky top-0 flex w-full min-h-0 flex-col overflow-hidden lg:h-dvh lg:min-h-[100svh]">
        {/* Copy — stacked above video on mobile, overlaid on desktop */}
        <div className="relative z-10 order-1 w-full pb-0 pt-[clamp(6.5rem,14vw,8rem)] lg:absolute lg:inset-0 lg:flex lg:items-center lg:justify-start lg:pb-0 lg:pt-28">
          <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8">
            <motion.div
              className="w-full max-w-md sm:max-w-xl lg:max-w-2xl"
            variants={containerVariants}
            initial={animate ? "hidden" : "visible"}
            animate="visible"
          >
            <h1 className="type-display-hero text-balance leading-[1.06] text-white [text-shadow:0_2px_32px_rgba(1,26,36,0.55)]">
              {hero.heading.split(" ").map((word, i) => (
                <motion.span key={i} variants={wordVariants} className="mr-[0.25em] inline-block">
                  {word}
                </motion.span>
              ))}
            </h1>

            <p className="type-body-l mt-[clamp(0.875rem,2.5vw,1.25rem)] max-w-lg text-pretty text-white/65 lg:mt-[clamp(0.875rem,2.5vw,1.5rem)]">
              {hero.descriptor.split(" ").map((word, i) => (
                <motion.span key={i} variants={wordVariants} className="mr-[0.25em] inline-block">
                  {word}
                </motion.span>
              ))}
            </p>

            <motion.div variants={wordVariants} className="mt-[clamp(0.5rem,2vw,2.5rem)] lg:mt-[clamp(1.5rem,4vw,2.5rem)]">
              <CTAButton variant="glass" className="min-h-11 w-full sm:w-auto">
                {hero.cta}
              </CTAButton>
            </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Frames — below copy on mobile, full-bleed behind on desktop */}
        <div className="relative order-2 -mt-5 h-[min(52svh,26rem)] w-full shrink-0 sm:-mt-6 sm:h-[min(48svh,28rem)] lg:absolute lg:inset-0 lg:-z-0 lg:order-none lg:mt-0 lg:h-full">
          {isDesktop ? (
            <HeroVisual
              animate={animate}
              scrollLinked
              scrollProgress={scrollYProgress}
              variant="desktop"
              className="absolute inset-0 z-0 h-full w-full"
            />
          ) : (
            <HeroVisual
              animate={animate}
              scrollLinked
              scrollProgress={scrollYProgress}
              variant="mobile"
              className="absolute inset-0 z-0 h-full w-full"
            />
          )}
        </div>

        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 z-[2] hidden w-[55%] bg-gradient-to-r from-deep-teal/85 via-deep-teal/40 to-transparent lg:block"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] hidden h-[clamp(8rem,20vh,14rem)] bg-gradient-to-t from-deep-teal via-deep-teal/60 to-transparent lg:block"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 z-[2] hidden w-[18%] bg-gradient-to-l from-deep-teal/70 to-transparent lg:block"
        />
      </div>
    </section>
  );
}