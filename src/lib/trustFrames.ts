import manifest from "../../public/trust-frames-cutout/manifest.json";

export const trustFrameSequence = {
  frameCount: manifest.frameCount,
  prefix: manifest.prefix,
  extension: manifest.extension,
  pad: manifest.pad,
  width: manifest.width,
  height: manifest.height,
  fps: manifest.fps,
  source: manifest.source,
} as const;

export function getTrustFramePath(index: number): string {
  const clamped = Math.max(0, Math.min(trustFrameSequence.frameCount - 1, index));
  const num = String(clamped + 1).padStart(trustFrameSequence.pad, "0");
  return `${trustFrameSequence.prefix}${num}.${trustFrameSequence.extension}`;
}

export function getTrustFramePaths(): string[] {
  return Array.from({ length: trustFrameSequence.frameCount }, (_, i) => getTrustFramePath(i));
}
