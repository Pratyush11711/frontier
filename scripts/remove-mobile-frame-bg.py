#!/usr/bin/env python3
"""Remove the background from every mobile hero frame, writing transparent PNGs.

Reads JPGs from public/mobile-frames and writes alpha-cutout PNGs to
public/mobile-frames-cutout. Originals are left untouched.

Usage:
    .venv-rembg/bin/python scripts/remove-mobile-frame-bg.py
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

from PIL import Image
from rembg import new_session, remove

ROOT = Path(__file__).resolve().parent.parent
SRC_DIR = ROOT / "public" / "mobile-frames"
OUT_DIR = ROOT / "public" / "mobile-frames-cutout"

MODEL = "isnet-general-use"


def main() -> int:
    frames = sorted(SRC_DIR.glob("frame_*.jpg"))
    if not frames:
        print(f"No frames found in {SRC_DIR}", file=sys.stderr)
        return 1

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    session = new_session(MODEL)

    total = len(frames)
    width = height = None
    for i, frame in enumerate(frames, start=1):
        out_path = OUT_DIR / (frame.stem + ".png")

        with Image.open(frame) as img:
            img = img.convert("RGBA")
            if width is None:
                width, height = img.size
            cut = remove(img, session=session)
            cut.save(out_path, "PNG", optimize=True)

        if i == 1 or i % 10 == 0 or i == total:
            print(f"  [{i:>3}/{total}] {out_path.name}", flush=True)

    manifest_src = SRC_DIR / "manifest.json"
    manifest = {}
    if manifest_src.exists():
        manifest = json.loads(manifest_src.read_text())
    manifest.update(
        {
            "frameCount": total,
            "prefix": "/mobile-frames-cutout/frame_",
            "extension": "png",
            "pad": 4,
            "width": width,
            "height": height,
        }
    )
    (OUT_DIR / "manifest.json").write_text(json.dumps(manifest, indent=2) + "\n")

    ts_manifest = ROOT / "src" / "lib" / "mobileFrames.ts"
    ts_manifest.write_text(
        f"""/** Frame metadata for mobile hero scroll sequence (source: public/mobile.mp4). */
export const mobileFrameSequence = {{
  frameCount: {total},
  prefix: "/mobile-frames-cutout/frame_",
  extension: "png",
  pad: 4,
  width: {width},
  height: {height},
  fps: {manifest.get("fps", 24)},
  source: "/mobile.mp4",
}} as const;

export function getMobileFramePath(index: number): string {{
  const clamped = Math.max(0, Math.min(mobileFrameSequence.frameCount - 1, index));
  const num = String(clamped + 1).padStart(mobileFrameSequence.pad, "0");
  return `${{mobileFrameSequence.prefix}}${{num}}.${{mobileFrameSequence.extension}}`;
}}

export function getMobileFramePaths(): string[] {{
  return Array.from({{ length: mobileFrameSequence.frameCount }}, (_, i) => getMobileFramePath(i));
}}
"""
    )

    print(f"Done. {total} cutout PNGs in {OUT_DIR}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
