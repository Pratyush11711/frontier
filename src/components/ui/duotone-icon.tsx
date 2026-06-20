import { cn } from "@/lib/utils";

/**
 * §6.3 Iconography — duotone, fill-based. No strokes, no outlines.
 * Two layers only: an opaque base shape + a 30%-opacity tinted overlay.
 * Uses currentColor so dark icons sit on light fields and vice versa.
 * Drawn on a 24×24 grid with rounded, symbol-aligned corners.
 */

export type DuotoneIconName =
  | "verified"
  | "domestic"
  | "infrastructure"
  | "document"
  | "coldchain"
  | "molecule";

const paths: Record<
  DuotoneIconName,
  { base: React.ReactNode; overlay: React.ReactNode }
> = {
  verified: {
    overlay: <path d="M12 1.6 4 4.7v6.5c0 5 3.4 9.2 8 10.7V1.6Z" />,
    base: (
      <>
        <path d="M12 1.6v20.3c4.6-1.5 8-5.7 8-10.7V4.7L12 1.6Z" />
        <path d="M10.6 14.4 8 11.8a1 1 0 0 1 1.4-1.4l1.6 1.6 3.6-3.6a1 1 0 1 1 1.4 1.4l-4.3 4.3a1 1 0 0 1-1.7 0Z" />
      </>
    ),
  },
  domestic: {
    overlay: <path d="M3 21V9.6l9-6.6v18.6H3Z" />,
    base: (
      <>
        <path d="M12 3v18h9V9.6L12 3Z" />
        <rect x="14.5" y="12" width="4" height="4" rx="1" />
      </>
    ),
  },
  infrastructure: {
    overlay: (
      <path d="M12 13.1 2.7 8.3a1 1 0 0 1 0-1.8L11.5 2a1 1 0 0 1 1 0l8.8 4.5a1 1 0 0 1 0 1.8L12 13.1Z" />
    ),
    base: (
      <>
        <path d="m4.4 11 7.1 3.7a1 1 0 0 0 1 0L19.6 11l1.7.9a1 1 0 0 1 0 1.8L12.5 18a1 1 0 0 1-1 0l-8.8-4.4a1 1 0 0 1 0-1.8l1.7-.9Z" />
        <path d="m4.4 15.6 7.1 3.7a1 1 0 0 0 1 0l7.1-3.7 1.7.9a1 1 0 0 1 0 1.8l-8.8 4.4a1 1 0 0 1-1 0l-8.8-4.4a1 1 0 0 1 0-1.8l1.7-.9Z" />
      </>
    ),
  },
  document: {
    overlay: <path d="M5 2.8h7l1 1V21a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V3.8a1 1 0 0 1 1-1Z" />,
    base: (
      <>
        <path d="M13 2.8h6a1 1 0 0 1 1 1V21a1 1 0 0 1-1 1h-7V3.8l1-1Z" />
        <rect x="7" y="11" width="10" height="1.8" rx=".9" />
        <rect x="7" y="15" width="7" height="1.8" rx=".9" />
      </>
    ),
  },
  coldchain: {
    overlay: <circle cx="12" cy="12" r="9.5" />,
    base: (
      <path d="M12 3.5a1 1 0 0 1 1 1v2.3l1.6-1.6a1 1 0 1 1 1.4 1.4L13 9.6V11h1.4l2.9-3a1 1 0 1 1 1.4 1.5L18 11h2.5a1 1 0 1 1 0 2H18l.7.5a1 1 0 0 1-1.4 1.5l-2.9-3H13v1.4l3 3a1 1 0 0 1-1.4 1.4L13 17.2v2.3a1 1 0 1 1-2 0v-2.3l-1.6 1.6a1 1 0 0 1-1.4-1.4l3-3V13H9.6l-2.9 3a1 1 0 1 1-1.4-1.5L6 13H3.5a1 1 0 1 1 0-2H6l-.7-.5a1 1 0 0 1 1.4-1.5l2.9 3H11V9.6l-3-3a1 1 0 0 1 1.4-1.4L11 6.8V4.5a1 1 0 0 1 1-1Z" />
    ),
  },
  molecule: {
    overlay: <circle cx="12" cy="12" r="4.2" />,
    base: (
      <>
        <circle cx="5" cy="6" r="2.6" />
        <circle cx="19" cy="7" r="2.4" />
        <circle cx="18" cy="18.5" r="2.6" />
        <rect x="6.4" y="7.1" width="6.6" height="1.6" rx=".8" transform="rotate(28 6.4 7.1)" />
        <rect x="13.6" y="8.4" width="5" height="1.6" rx=".8" transform="rotate(-20 13.6 8.4)" />
        <rect x="13.4" y="13.8" width="5.2" height="1.6" rx=".8" transform="rotate(40 13.4 13.8)" />
      </>
    ),
  },
};

export function DuotoneIcon({
  name,
  className,
}: {
  name: DuotoneIconName;
  className?: string;
}) {
  const icon = paths[name];

  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={cn("h-6 w-6", className)}
    >
      <g fillOpacity={0.3}>{icon.overlay}</g>
      <g fillOpacity={1}>{icon.base}</g>
    </svg>
  );
}
