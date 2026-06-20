"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import Image from "next/image";
// CTASection ko wapis le aaya hoon taake tumhara design 100% same rahe
import { CTASection } from "@/components/ui/cta-with-rectangle";
import { useWaitlist } from "@/context/WaitlistContext";
import { assets } from "@/lib/assets";
import { finalCta } from "@/lib/content";

function ScrollWordReveal({
  text,
  progress,
  globalStart,
  globalEnd,
}: {
  text: string;
  progress: MotionValue<number>;
  globalStart: number;
  globalEnd: number;
}) {
  if (!text) return null;
  const words = text.split(" ").filter(Boolean);

  return (
    <>
      {words.map((word, i) => {
        const start = globalStart + (i / words.length) * (globalEnd - globalStart);
        const end = globalStart + ((i + 1) / words.length) * (globalEnd - globalStart);

        const opacity = useTransform(progress, [start, end], [0.2, 1]);
        const filter = useTransform(progress, [start, end], ["blur(2px)", "blur(0px)"]);

        return (
          <motion.span
            key={i}
            style={{ opacity, filter }}
            className="inline-block mr-[0.3em] text-xl sm:text-2xl lg:text-3xl"
          >
            {word}
          </motion.span>
        );
      })}
    </>
  );
}

export function FinalCTA() {
  const { openWaitlist } = useWaitlist();
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 80%", "center 50%"],
  });

  return (
    <section
      id="cta"
      ref={containerRef}
      data-nav-theme="dark"
      className="relative isolate bg-gradient-hero-section px-4 py-20 sm:px-6 sm:py-32 lg:px-7 lg:py-40"
    >
      <div className="relative mx-auto w-full max-w-container flex items-center justify-center">

        {/* FIX: Yahan glass class ke andar CTASection dala hai.
            Extra border issue resolve karne ke liye CTASection ki apni 
            internal styling/padding ko adjust kar lena agar zaroorat paray.
        */}
        <div className="glass glass-strong relative w-full overflow-hidden rounded-[2.25rem] sm:rounded-[2.5rem] lg:rounded-[2.75rem]">
          <Image
            src={assets.heroMolecule}
            alt=""
            fill
            sizes="(max-width: 1280px) 100vw, 1280px"
            className="pointer-events-none object-cover object-center opacity-40"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-deep-teal via-deep-teal/70 to-deep-teal/40"
          />

          <div className="relative">
            <CTASection
              badge={{ text: finalCta.badge }}
              title={finalCta.heading} // Title unchanged
              description={
                <ScrollWordReveal
                  text={finalCta.supporting}
                  progress={scrollYProgress}
                  globalStart={0.0}
                  globalEnd={1.0}
                />
              }
              action={{
                text: finalCta.cta,
                onClick: openWaitlist,
              }}
              className="text-white"
            />
          </div>
        </div>

      </div>
    </section>
  );
}