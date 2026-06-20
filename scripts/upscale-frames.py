#!/usr/bin/env python3
"""Upscale the transparent cut-out frames 2x with high-quality Lanczos resampling.

Operates in place on public/hero-frames-cutout/*.png (RGBA preserved) and updates
that folder's manifest.json width/height. The original JPGs in
public/hero-frames/ are left untouched.

Usage:
    .venv-rembg/bin/python scripts/upscale-frames.py [SCALE]
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
DIR = ROOT / "public" / "hero-frames-cutout"
SCALE = float(sys.argv[1]) if len(sys.argv) > 1 else 2.0


def main() -> int:
    frames = sorted(DIR.glob("frame_*.png"))
    if not frames:
        print(f"No frames found in {DIR}", file=sys.stderr)
        return 1

    total = len(frames)
    new_w = new_h = None
    for i, frame in enumerate(frames, start=1):
        with Image.open(frame) as img:
            img = img.convert("RGBA")
            w, h = img.size
            new_w, new_h = round(w * SCALE), round(h * SCALE)
            up = img.resize((new_w, new_h), Image.LANCZOS)
            up.save(frame, "PNG", optimize=True)

        if i == 1 or i % 10 == 0 or i == total:
            print(f"  [{i:>3}/{total}] {frame.name} -> {new_w}x{new_h}", flush=True)

    manifest_path = DIR / "manifest.json"
    if manifest_path.exists() and new_w and new_h:
        manifest = json.loads(manifest_path.read_text())
        manifest["width"] = new_w
        manifest["height"] = new_h
        manifest_path.write_text(json.dumps(manifest, indent=2) + "\n")

    print(f"Done. Upscaled {total} frames {SCALE}x to {new_w}x{new_h}.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
