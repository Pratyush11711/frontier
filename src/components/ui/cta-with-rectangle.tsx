"use client";

import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { CTAButton } from "@/components/CTAButton";
import { cn } from "@/lib/utils";

interface CTAProps {
  badge?: {
    text: string;
  };
  title: ReactNode;
  description?: ReactNode;
  action: {
    text: string;
    onClick?: () => void;
  };
  withGlow?: boolean;
  className?: string;
  titleClassName?: string;
  align?: "center" | "left";
}

export function CTASection({
  badge,
  title,
  description,
  action,
  withGlow = true,
  className,
  titleClassName,
  align = "center",
}: CTAProps) {
  const isLeft = align === "left";

  return (
    <section className={cn("overflow-hidden pt-0 md:pt-0", className)}>
      <div
        className={cn(
          "relative mx-auto flex w-full flex-col gap-6 py-12 sm:gap-8 md:py-24",
          isLeft
            ? "max-w-[1400px] items-start px-4 text-left sm:px-6 lg:px-8"
            : "max-w-container items-center px-8 text-center",
        )}
      >
        {badge && (
          <Badge
            variant="outline"
            className="animate-fade-in-up border-white/25 delay-100 opacity-0"
          >
            <span className="text-white/70">{badge.text}</span>
          </Badge>
        )}

        <h2
          className={cn(
            "animate-fade-in-up text-balance opacity-0 delay-200",
            titleClassName ?? "type-editorial-40 max-w-3xl",
          )}
        >
          {title}
        </h2>

        {description && (
          <p className="type-body-l animate-fade-in-up max-w-2xl text-pretty text-white/78 opacity-0 delay-300">
            {description}
          </p>
        )}

        <div className="animate-fade-in-up opacity-0 delay-500">
          <CTAButton
            variant="primary"
            onClick={action.onClick}
          >
            {action.text}
          </CTAButton>
        </div>

        {withGlow && (
          <div className="fade-top-lg shadow-glow animate-scale-in pointer-events-none absolute inset-0 rounded-2xl opacity-0 delay-700" />
        )}
      </div>
    </section>
  );
}
