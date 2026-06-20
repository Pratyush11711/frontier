"use client";

import type { TrustLogo } from "@/lib/content";

interface LogoMarqueeProps {
  items: readonly TrustLogo[];
  reverse?: boolean;
  fadeFrom?: "white" | "slate" | "gradient" | "trust" | "slate-teal" | "deep-teal";
  theme?: "light" | "dark";
}

// Fade classes ki ab zaroorat nahi kyun ke humne shadow nikal diya hai, 
// lekin prop interface mein rakha hai taake aapki baqi app break na ho.
const fadeClasses = {
  white: "from-white",
  slate: "from-slate",
  gradient: "from-[#fdf9f7]",
  trust: "from-[#fcf1ed]",
  "slate-teal": "from-slate-teal-100",
  "deep-teal": "from-[#011A24]",
} as const;

function logoImageClass(logo: TrustLogo, theme: "light" | "dark") {
  const base = "h-7 w-auto max-w-[9rem] object-contain object-center sm:h-8 sm:max-w-[10rem]";

  if (theme === "light") {
    return `${base} opacity-90`;
  }

  if (logo.mono === "invert") {
    return `${base} brightness-0 invert opacity-85`;
  }

  return `${base} opacity-90`;
}

export function LogoMarquee({
  items,
  reverse = false,
  fadeFrom = "white", // Prop abhi bhi hai lekin effect remove kar diya hai
  theme = "light",
}: LogoMarqueeProps) {
  const doubled = [...items, ...items];

  return (
    <div className="relative overflow-hidden py-2">
      {/* Mene yahan se wo dono 'bg-gradient-to-r' aur 'bg-gradient-to-l' 
        wale divs hata diye hain jo left/right par bright shadow de rahe the. 
      */}
      
      <div
        className={`flex w-max items-center gap-10 sm:gap-14 ${reverse ? "marquee-track-reverse" : "marquee-track"}`}
      >
        {doubled.map((logo, i) => (
          <div
            key={`${logo.name}-${i}`}
            className="flex h-10 shrink-0 items-center sm:h-11"
            title={logo.name}
          >
            <img
              src={logo.src}
              alt={logo.name}
              width={logo.width}
              height={logo.height}
              className={logoImageClass(logo, theme)}
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </div>
  );
}