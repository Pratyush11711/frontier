import manifest from "../../public/hero-frames-cutout/manifest.json";

export const heroFrameSequence = {
  frameCount: manifest.frameCount,
  prefix: manifest.prefix,
  extension: manifest.extension,
  pad: manifest.pad,
  width: manifest.width,
  height: manifest.height,
  fps: manifest.fps,
  source: manifest.source,
} as const;

export function getHeroFramePath(index: number): string {
  const clamped = Math.max(0, Math.min(heroFrameSequence.frameCount - 1, index));
  const num = String(clamped + 1).padStart(heroFrameSequence.pad, "0");
  return `${heroFrameSequence.prefix}${num}.${heroFrameSequence.extension}`;
}

export function getHeroFramePaths(): string[] {
  return Array.from({ length: heroFrameSequence.frameCount }, (_, i) => getHeroFramePath(i));
}
