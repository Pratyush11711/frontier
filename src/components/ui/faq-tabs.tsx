"use client";

import { useState, type ComponentPropsWithoutRef } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export type FAQItem = {
  question: string;
  answer: string;
};

export type FAQProps = ComponentPropsWithoutRef<"section"> & {
  title?: string;
  headingLine1?: string;
  headingLine2?: string;
  subtitle?: string;
  badges?: readonly string[];
  items: FAQItem[];
  theme?: "light" | "dark";
  showSubtitle?: boolean;
  align?: "left" | "center";
};

export function FAQ({
  title = "FAQs",
  headingLine1,
  headingLine2,
  subtitle = "Frequently Asked Questions",
  badges,
  items,
  theme = "light",
  showSubtitle = true,
  align = "center",
  className,
  style,
  ...props
}: FAQProps) {
  const isDark = theme === "dark";
  const isLeft = align === "left";
  const useSplitHeading = Boolean(headingLine1 && headingLine2) && !isLeft;

  return (
    <section
      className={cn(
        "section-y relative isolate scroll-mt-28",
        isDark ? "text-white" : "bg-background text-foreground",
        className,
      )}
      style={style}
      {...props}
    >
      <div
        className={cn(
          "relative z-10 mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8",
          useSplitHeading
            ? "grid grid-cols-1 items-start gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-14 xl:gap-20"
            : isLeft
              ? "max-w-[1400px] text-left"
              : "max-w-3xl",
        )}
      >
        <FAQHeader
          title={title}
          headingLine1={headingLine1}
          headingLine2={headingLine2}
          subtitle={subtitle}
          isDark={isDark}
          showSubtitle={showSubtitle && !useSplitHeading && !isLeft}
          splitLayout={useSplitHeading}
          align={align}
        />
        <div className={cn(!useSplitHeading && !isLeft && "mt-12", isLeft && "mt-8")}>
          {badges && badges.length > 0 && (
            <p
              className={cn(
                "reveal-on-scroll type-mono-label mb-6 text-balance sm:mb-8",
                isLeft || useSplitHeading ? "text-left" : "mx-auto text-center",
                isDark ? "text-white/65" : "text-pacific/80",
              )}
            >
              {badges.join(" · ")}
            </p>
          )}
          <FAQList items={items} isDark={isDark} splitLayout={useSplitHeading} align={align} />
        </div>
      </div>
    </section>
  );
}

function FAQHeader({
  title,
  headingLine1,
  headingLine2,
  subtitle,
  isDark,
  showSubtitle,
  splitLayout,
  align = "center",
}: {
  title: string;
  headingLine1?: string;
  headingLine2?: string;
  subtitle: string;
  isDark: boolean;
  showSubtitle: boolean;
  splitLayout: boolean;
  align?: "left" | "center";
}) {
  const isLeft = align === "left";

  return (
    <div
      className={cn(
        "reveal-on-scroll relative z-10",
        splitLayout
          ? "text-left lg:sticky lg:top-28"
          : isLeft
            ? "text-left"
            : "flex flex-col items-center justify-center text-center",
      )}
    >
{showSubtitle && (
  <span
    className={cn(
      "type-mono-label mb-6 underline underline-offset-4",
      isDark ? "text-white/55" : "text-pacific",
    )}
  >
    {subtitle}
  </span>
)}
      {splitLayout ? (
         <h2
    className={cn(
      "type-editorial-60 max-w-md text-balance leading-[1.06] sm:max-w-xl lg:max-w-2xl",
      isDark ? "text-white [text-shadow:0_2px_32px_rgba(1,26,36,0.55)]" : "text-cloud",
    )}
  >
    <span className="block">{headingLine1}</span>
    <span className="relative inline-block w-full pb-2">
      {headingLine2}
      <span
        aria-hidden
        className={cn(
          "absolute inset-x-0 bottom-0 h-[1px]",
          isDark ? "bg-white" : "bg-cloud",
        )}
      />
    </span>
  </h2>
      ) : (
        <h2
          className={cn(
            isLeft
              ? "type-h3 max-w-none text-pretty sm:whitespace-nowrap"
              : "type-editorial-40 max-w-3xl text-balance",
            isDark ? "text-white" : "text-cloud",
          )}
        >
          {title}
        </h2>
      )}
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute -z-10 rounded-full blur-3xl",
          splitLayout
            ? "left-0 top-1/2 h-40 w-56 -translate-y-1/2 sm:h-52 sm:w-72"
            : "inset-x-8 top-1/2 h-40 -translate-y-1/2 sm:inset-x-16 sm:h-52",
          isDark
            ? "bg-gradient-to-r from-white/10 to-white/5"
            : "bg-gradient-to-r from-pacific/10 to-pacific/5",
        )}
      />
    </div>
  );
}

function FAQList({
  items,
  isDark,
  splitLayout,
  align = "center",
}: {
  items: FAQItem[];
  isDark: boolean;
  splitLayout: boolean;
  align?: "left" | "center";
}) {
  const isLeft = align === "left";

  return (
    <div
      className={cn(
        "relative z-10 space-y-3",
        !splitLayout && !isLeft && "mx-auto mt-12 max-w-3xl",
        isLeft && "max-w-3xl",
      )}
    >
      {items.map((faq) => (
        <FAQAccordionItem
          key={faq.question}
          question={faq.question}
          answer={faq.answer}
          isDark={isDark}
        />
      ))}
    </div>
  );
}

function FAQAccordionItem({
  question,
  answer,
  isDark,
}: FAQItem & { isDark: boolean }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      animate={isOpen ? "open" : "closed"}
      className={cn(
        "reveal-on-scroll rounded-2xl border backdrop-blur-xl transition-colors duration-500",
        isDark
          ? isOpen
            ? "border-white/25 bg-white/[0.12] shadow-[0_20px_50px_rgba(1,26,36,0.3)]"
            : "border-white/10 bg-white/[0.05] hover:border-white/20 hover:bg-white/[0.08]"
          : isOpen
            ? "border-border bg-muted/50"
            : "border-border bg-card",
      )}
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between gap-4 p-4 text-left sm:p-5"
        aria-expanded={isOpen}
      >
        <span
          className={cn(
            "type-body-l font-medium transition-colors",
            isDark
              ? isOpen
                ? "text-white"
                : "text-white/75"
              : isOpen
                ? "text-foreground"
                : "text-muted-foreground",
          )}
        >
          {question}
        </span>
        <motion.span
          variants={{
            open: { rotate: "45deg" },
            closed: { rotate: "0deg" },
          }}
          transition={{ duration: 0.2 }}
          className="shrink-0"
        >
          <Plus
            className={cn(
              "h-5 w-5 transition-colors",
              isOpen
                ? isDark
                  ? "text-white"
                  : "text-pacific"
                : isDark
                  ? "text-white/50"
                  : "text-muted-foreground",
            )}
            strokeWidth={1.75}
          />
        </motion.span>
      </button>
      <motion.div
        initial={false}
        animate={{
          height: isOpen ? "auto" : "0px",
          marginBottom: isOpen ? "16px" : "0px",
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="overflow-hidden px-4 sm:px-5"
      >
        <p className={cn("type-body-s pb-4", isDark ? "text-white/78" : "text-slate-teal-700")}>
          {answer}
        </p>
      </motion.div>
    </motion.div>
  );
}
