/** Frame metadata for mobile hero scroll sequence (source: public/mobile.mp4). */
export const mobileFrameSequence = {
  frameCount: 121,
  prefix: "/mobile-frames-cutout/frame_",
  extension: "png",
  pad: 4,
  width: 1440,
  height: 1440,
  fps: 24,
  source: "/mobile.mp4",
} as const;

export function getMobileFramePath(index: number): string {
  const clamped = Math.max(0, Math.min(mobileFrameSequence.frameCount - 1, index));
  const num = String(clamped + 1).padStart(mobileFrameSequence.pad, "0");
  return `${mobileFrameSequence.prefix}${num}.${mobileFrameSequence.extension}`;
}

export function getMobileFramePaths(): string[] {
  return Array.from({ length: mobileFrameSequence.frameCount }, (_, i) => getMobileFramePath(i));
}
