import Link from "next/link";
import Image from "next/image";
import { LogoMark, type LogoVariant } from "./LogoMark";
import { brandLogos } from "@/lib/assets";
import { cn } from "@/lib/utils";

interface LogoProps {
  showText?: boolean;
  /** Mark-only below sm; full lockup from sm up */
  compact?: boolean;
  size?: "sm" | "md" | "lg";
  /** @default primary — Deep Teal on light. Use on-dark for footer / deep teal backgrounds. */
  variant?: LogoVariant;
  className?: string;
}

const logotypeByVariant: Record<LogoVariant, string> = {
  primary: brandLogos.logotype.primary,
  "on-dark": brandLogos.logotype.secondary,
  mono: brandLogos.logotype.black,
  reversed: brandLogos.logotype.white,
};

const sizes = {
  sm: {
    markHeight: "h-[26px]",
    lockupHeight: "h-[26px]",
  },
  md: {
    markHeight: "h-[32px]",
    lockupHeight: "h-[32px]",
  },
  lg: {
    markHeight: "h-[44px]",
    lockupHeight: "h-[44px]",
  },
} as const;

export function Logo({
  showText = true,
  compact = false,
  size = "md",
  variant = "primary",
  className = "",
}: LogoProps) {
  const s = sizes[size];

  return (
    <Link
      href="/"
      aria-label="Frontier BioMed"
      className={cn("inline-flex items-center", className)}
    >
      {showText ? (
        <>
          <span
            className={cn(
              "relative inline-flex w-auto",
              s.lockupHeight,
              compact && "hidden sm:inline-flex",
            )}
          >
            <Image
              src={logotypeByVariant[variant]}
              alt="Frontier BIOMED"
              width={220}
              height={50}
              className="h-full w-auto object-contain object-left"
              priority
            />
          </span>
          {compact && (
            <span className={cn("relative inline-flex aspect-[762/539] sm:hidden", s.markHeight)}>
              <LogoMark variant={variant} className="h-full w-auto" />
            </span>
          )}
        </>
      ) : (
        <span className={cn("relative inline-flex aspect-[762/539]", s.markHeight)}>
          <LogoMark variant={variant} className="h-full w-auto" />
        </span>
      )}
    </Link>
  );
}

export type { LogoVariant };
