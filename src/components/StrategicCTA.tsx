"use client";

import { CTASection } from "@/components/ui/cta-with-rectangle";
import { useWaitlist } from "@/context/WaitlistContext";
import { strategicCta } from "@/lib/content";

export function StrategicCTA() {
  const { openWaitlist } = useWaitlist();

  return (
    <section
      id="story-cta"
      data-nav-theme="dark"
      className="relative isolate scroll-mt-28 bg-gradient-hero-section"
    >
      <CTASection
        badge={{ text: strategicCta.badge }}
        title={strategicCta.heading}
        description={strategicCta.supporting}
        action={{
          text: strategicCta.cta,
          onClick: openWaitlist,
        }}
        withGlow={false}
        titleClassName="type-editorial-60 max-w-4xl"
        className="text-white"
      />
    </section>
  );
}
