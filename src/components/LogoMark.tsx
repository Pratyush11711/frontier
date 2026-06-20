import Image from "next/image";
import { brandLogos } from "@/lib/assets";

export type LogoVariant = "primary" | "on-dark" | "mono" | "reversed";

const markByVariant: Record<LogoVariant, string> = {
  primary: brandLogos.mark.primary,
  "on-dark": brandLogos.mark.secondary,
  mono: brandLogos.mark.black,
  reversed: brandLogos.mark.white,
};

interface LogoMarkProps {
  variant?: LogoVariant;
  className?: string;
}

export function LogoMark({ variant = "primary", className = "" }: LogoMarkProps) {
  return (
    <Image
      src={markByVariant[variant]}
      alt=""
      width={38}
      height={27}
      className={`h-full w-auto shrink-0 ${className}`}
      aria-hidden
      priority
    />
  );
}

export { markByVariant };
