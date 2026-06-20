"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { navLinks, primaryCta } from "@/lib/content";
import { CTAButton } from "./CTAButton";
import { Logo } from "./Logo";
import { useNavTheme } from "@/hooks/useNavTheme";
import { useActiveNavSection } from "@/hooks/useActiveNavSection";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useNavTheme();
  const activeHref = useActiveNavSection(navLinks.map((link) => link.href));
  const isLight = theme === "light";

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const logoVariant = isLight ? "primary" : "on-dark";
  const menuButtonClass = isLight
    ? "bg-white/80 border border-black/10 text-black/80 hover:bg-black/5"
    : "glass-subtle text-white/90 hover:bg-white/20";
  const mobileMenuClass = isLight
    ? "bg-white/95 border border-black/10 shadow-lg"
    : "glass-subtle";

  return (
    <header className="fixed inset-x-0 top-0 z-50 pt-[max(0.75rem,env(safe-area-inset-top))]">
      <motion.nav
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-50 mx-auto flex h-14 w-full max-w-[1400px] items-center justify-between gap-3 px-4 sm:px-6 lg:h-16 lg:px-8"
      >
        <div className="flex shrink-0 items-center justify-start">
          <Logo size="lg" variant={logoVariant} />
        </div>

        <div
          className={cn(
            "nav-pill-track hidden md:inline-flex",
            isLight ? "nav-pill-track--light" : "nav-pill-track--dark",
          )}
        >
          {navLinks.map((link) => {
            const isActive = activeHref === link.href;

            return (
              <a
                key={link.href}
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "nav-pill-link type-body-l",
                  isLight
                    ? isActive
                      ? "text-cloud"
                      : "text-cloud/65 hover:text-cloud"
                    : isActive
                      ? "text-white"
                      : "text-white/70 hover:text-white/90",
                )}
              >
                {isActive && (
                  <motion.span
                    layoutId="nav-active-indicator"
                    className={cn(
                      "nav-pill-indicator",
                      isLight ? "nav-pill-indicator--light" : "nav-pill-indicator--dark",
                    )}
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  />
                )}
                <span className="relative z-10">{link.label}</span>
              </a>
            );
          })}
        </div>

        <div className="flex shrink-0 items-center justify-end">
          <div className="hidden shrink-0 md:block">
            <CTAButton variant={isLight ? "primary" : "glass"}>
              {primaryCta}
            </CTAButton>
          </div>

          <button
            type="button"
            className={cn(
              "relative z-[60] flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-colors md:hidden",
              menuButtonClass,
            )}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              "relative z-50 mx-4 mt-3 max-w-[1400px] overflow-hidden rounded-2xl px-3 py-3 sm:mx-6 sm:px-4 sm:py-4 md:hidden",
              mobileMenuClass,
            )}
          >
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => {
                const isActive = activeHref === link.href;

                return (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "type-body-l rounded-xl px-3 py-3.5 text-center transition-colors",
                      isLight
                        ? isActive
                          ? "bg-black/5 text-cloud"
                          : "text-cloud/65 hover:bg-black/5 hover:text-cloud"
                        : isActive
                          ? "bg-white/10 text-white"
                          : "text-white/70 hover:bg-white/10 hover:text-white",
                    )}
                  >
                    {link.label}
                  </a>
                );
              })}
            </div>

            <div className="mt-3 px-1">
              <CTAButton
                variant={isLight ? "primary" : "glass"}
                className="w-full"
              >
                {primaryCta}
              </CTAButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
