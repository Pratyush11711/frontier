"use client";

import { ArrowRight, X } from "lucide-react";
import { useWaitlist } from "@/context/WaitlistContext";
import { cn } from "@/lib/utils";

interface CTAButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "coral" | "glass";
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  form?: string;
  disabled?: boolean;
  icon?: "arrow" | "close";
}

const variantMap = {
  primary: {
    pill: "btn-icon-pill btn-icon-pill--primary",
    icon: "btn-icon-bubble btn-icon-bubble--primary",
  },
  secondary: {
    pill: "btn-icon-pill btn-icon-pill--secondary",
    icon: "btn-icon-bubble btn-icon-bubble--secondary",
  },
  coral: {
    pill: "btn-icon-pill btn-icon-pill--coral",
    icon: "btn-icon-bubble btn-icon-bubble--coral",
  },
  glass: {
    pill: "btn-icon-pill btn-icon-pill--glass",
    icon: "btn-icon-bubble btn-icon-bubble--glass",
  },
};

export function CTAButton({
  children,
  variant = "primary",
  className = "",
  onClick,
  type = "button",
  form,
  disabled,
  icon = "arrow",
}: CTAButtonProps) {
  const { openWaitlist } = useWaitlist();
  const styles = variantMap[variant];

  return (
    <button
      type={type}
      form={form}
      disabled={disabled}
      onClick={type === "submit" ? onClick : (onClick ?? openWaitlist)}
      className={cn(styles.pill, className)}
    >
      <span className="btn-icon-label">{children}</span>
      <span className={styles.icon} aria-hidden>
        {icon === "close" ? (
          <X className="btn-icon-close h-[1.1rem] w-[1.1rem]" strokeWidth={1.75} />
        ) : (
          <ArrowRight
            className="btn-icon-arrow h-[1.1rem] w-[1.1rem]"
            strokeWidth={2.4}
          />
        )}
      </span>
    </button>
  );
}
