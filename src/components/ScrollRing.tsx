import type { CSSProperties } from "react";

const RING_TEXT = "FRONTIER • VERIFIED • ";

export function ScrollRing() {
  const chars = [...RING_TEXT];

  return (
    <div
      aria-hidden
      className="scroll-ring hidden md:grid"
      style={{ "--char-count": chars.length } as CSSProperties}
    >
      <span className="scroll-ring__dot" />
      <span className="scroll-ring__text">
        {chars.map((char, index) => (
          <span
            key={index}
            className="scroll-ring__char"
            style={{ "--char-index": index } as CSSProperties}
          >
            {char}
          </span>
        ))}
      </span>
    </div>
  );
}
