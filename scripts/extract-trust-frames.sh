#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
FRAMES_DIR="$ROOT/public/trust-frames"
SOURCE="$ROOT/public/trust.mp4"

# 0 = native frame rate (no dropped frames).
FPS="${FPS:-0}"

# Optional max width. 0 keeps native resolution.
SCALE_WIDTH="${SCALE_WIDTH:-0}"

if ! command -v ffmpeg >/dev/null 2>&1; then
  echo "ffmpeg is required to extract trust frames." >&2
  exit 1
fi

if [[ ! -f "$SOURCE" ]]; then
  echo "Missing source video: $SOURCE" >&2
  exit 1
fi

mkdir -p "$FRAMES_DIR"
rm -f "$FRAMES_DIR"/frame_*.png

FILTERS=()
if [[ "$FPS" != "0" ]]; then
  FILTERS+=("fps=${FPS}")
fi
if [[ "$SCALE_WIDTH" != "0" ]]; then
  FILTERS+=("scale=${SCALE_WIDTH}:-2:flags=lanczos")
fi

VF_ARGS=()
if [[ "${#FILTERS[@]}" -gt 0 ]]; then
  VF=$(IFS=,; echo "${FILTERS[*]}")
  VF_ARGS=(-vf "$VF")
fi

ffmpeg -y -i "$SOURCE" \
  "${VF_ARGS[@]}" \
  -vsync passthrough \
  -c:v png -compression_level 9 -pred mixed \
  -start_number 1 \
  "$FRAMES_DIR/frame_%04d.png"

FRAME_COUNT="$(find "$FRAMES_DIR" -maxdepth 1 -name "frame_*.png" | wc -l | tr -d ' ')"
DIMS="$(ffprobe -v error -select_streams v:0 \
  -show_entries stream=width,height \
  -of csv=p=0:s=x "$FRAMES_DIR/frame_0001.png")"
FRAME_WIDTH="${DIMS%x*}"
FRAME_HEIGHT="${DIMS#*x}"

SOURCE_FPS_RAW="$(ffprobe -v error -select_streams v:0 \
  -show_entries stream=r_frame_rate -of csv=p=0 "$SOURCE")"
SOURCE_FPS="$(awk -F'/' '{ printf "%d", ($2 ? $1 / $2 : $1) }' <<<"$SOURCE_FPS_RAW")"

cat > "$FRAMES_DIR/manifest.json" <<EOF
{
  "frameCount": ${FRAME_COUNT},
  "prefix": "/trust-frames/frame_",
  "extension": "png",
  "pad": 4,
  "width": ${FRAME_WIDTH},
  "height": ${FRAME_HEIGHT},
  "fps": ${SOURCE_FPS:-24},
  "source": "/trust.mp4"
}
EOF

echo "Extracted ${FRAME_COUNT} PNG frames (${FRAME_WIDTH}x${FRAME_HEIGHT})."
