"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Check, Copy, Mail } from "lucide-react";
import { confirmationPage } from "@/lib/content";
import { IOSVideoPlayer } from "@/components/ui/ios-video-player";
import { cn } from "@/lib/utils";

const REFERRAL_STORAGE_KEY = "frontier-referral-code";

const checkLoopTransition = {
  duration: 2.6,
  repeat: Infinity,
  ease: "easeInOut" as const,
  times: [0, 0.38, 0.72, 1] as number[],
};

function LoopingCheckmark({ className }: { className?: string }) {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return (
      <span
        aria-hidden
        className={cn(
          "inline-flex h-11 w-11 items-center justify-center rounded-full border border-aqua-300/35 bg-aqua-300/10 text-aqua-300 sm:h-14 sm:w-14",
          className,
        )}
      >
        <Check className="h-6 w-6 sm:h-8 sm:w-8" strokeWidth={2.5} />
      </span>
    );
  }

  return (
    <span
      aria-hidden
      className={cn(
        "inline-flex h-11 w-11 items-center justify-center rounded-full border border-aqua-300/35 bg-aqua-300/10 text-aqua-300 sm:h-14 sm:w-14",
        className,
      )}
    >
      <svg viewBox="0 0 24 24" className="h-6 w-6 sm:h-8 sm:w-8" fill="none" aria-hidden>
        <motion.path
          d="M5 12.5 9.5 17 19 7.5"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          animate={{ pathLength: [0, 1, 1, 0], opacity: [0, 1, 1, 0] }}
          transition={{ ...checkLoopTransition, delay: 0.12 }}
        />
      </svg>
    </span>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 114.127 0 2.063 2.063 0 01-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export function ConfirmationContent() {
  const [refCode, setRefCode] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem(REFERRAL_STORAGE_KEY);
    const code = stored ?? crypto.randomUUID().replace(/-/g, "").slice(0, 10);
    if (!stored) sessionStorage.setItem(REFERRAL_STORAGE_KEY, code);
    setRefCode(code);
  }, []);

  const referralLink = useMemo(() => {
    if (!refCode || typeof window === "undefined") return "";
    return `${window.location.origin}/?ref=${refCode}`;
  }, [refCode]);

  const shareText = `${confirmationPage.referral.shareMessage} ${referralLink}`;

  const shareLinks = useMemo(
    () => [
      {
        label: "Email",
        href: `mailto:?subject=${encodeURIComponent("Join Frontier BioMed")}&body=${encodeURIComponent(shareText)}`,
        icon: Mail,
      },
      {
        label: "LinkedIn",
        href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(referralLink)}`,
        icon: LinkedInIcon,
      },
      {
        label: "X",
        href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`,
        icon: XIcon,
      },
      {
        label: "WhatsApp",
        href: `https://wa.me/?text=${encodeURIComponent(shareText)}`,
        icon: WhatsAppIcon,
      },
    ],
    [referralLink, shareText],
  );

  const handleCopy = async () => {
    if (!referralLink) return;
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-6xl">
      <div className="text-center">
        <p className="type-mono-label text-aqua-300">Application received</p>
        <LoopingCheckmark className="mx-auto my-3 sm:my-4" />
        <h1 className="type-editorial-40 mx-auto max-w-full text-balance text-white sm:type-editorial-60">
          {confirmationPage.headline}
        </h1>
        <p className="type-body-l mx-auto mt-3 max-w-[min(100%,72rem)] text-pretty font-light text-white/65 sm:mt-4">
          {confirmationPage.bodyLine1}
          <br />
          {confirmationPage.bodyLine2}
        </p>
      </div>

      <div className="mx-auto mt-6 w-full max-w-6xl sm:mt-10">
        <IOSVideoPlayer
          src={confirmationPage.video}
          className="rounded-2xl shadow-2xl sm:rounded-[2.25rem]"
        />
      </div>

      <div className="mx-auto mt-6 max-w-3xl rounded-2xl border border-white/10 bg-white/[0.05] p-4 text-center sm:mt-10 sm:rounded-[1.75rem] sm:p-7">
        <p className="type-mono-label text-aqua-300">{confirmationPage.referral.eyebrow}</p>
        <h2 className="type-h3 mt-2 text-balance text-white">{confirmationPage.referral.heading}</h2>
        <p className="type-body-s mx-auto mt-2 max-w-xl text-pretty text-white/75 sm:type-body-l">
          {confirmationPage.referral.body}
        </p>

        <div className="mx-auto mt-4 flex max-w-2xl flex-col gap-2.5 sm:mt-5 sm:flex-row sm:gap-3">
          <div className="type-body-s min-w-0 flex-1 break-all rounded-xl border border-white/15 bg-white/10 px-3.5 py-3 text-left text-white/80 sm:truncate sm:px-4">
            {referralLink || "Generating your referral link…"}
          </div>
          <button
            type="button"
            onClick={handleCopy}
            disabled={!referralLink}
            className={cn(
              "inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-xl border border-pacific/50 bg-pacific px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-pacific/90 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto",
            )}
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? "Copied" : "Copy link"}
          </button>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 sm:mt-5 sm:flex sm:flex-wrap sm:items-center sm:justify-center sm:gap-2.5">
          {shareLinks.map(({ label, href, icon: Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="type-body-s inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/20 px-3 py-2.5 text-white/80 transition-colors hover:border-white/40 hover:text-white sm:min-h-10 sm:justify-start sm:px-4 sm:py-2"
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

export { REFERRAL_STORAGE_KEY };
