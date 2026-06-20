#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
FRAMES_DIR="$ROOT/public/mobile-frames"
SOURCE="$ROOT/public/mobile.mp4"

FPS="${FPS:-0}"
FORMAT="${FORMAT:-jpg}"
JPEG_QUALITY="${JPEG_QUALITY:-2}"
SCALE_WIDTH="${SCALE_WIDTH:-0}"

if [[ "$FORMAT" != "jpg" && "$FORMAT" != "png" ]]; then
  echo "FORMAT must be 'jpg' or 'png' (got '$FORMAT')." >&2
  exit 1
fi

if ! command -v ffmpeg >/dev/null 2>&1; then
  echo "ffmpeg is required to extract mobile frames." >&2
  exit 1
fi

if [[ ! -f "$SOURCE" ]]; then
  echo "Missing source video: $SOURCE" >&2
  exit 1
fi

mkdir -p "$FRAMES_DIR"
rm -f "$FRAMES_DIR"/frame_*.webp "$FRAMES_DIR"/frame_*.png "$FRAMES_DIR"/frame_*.jpg

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

ENC_ARGS=()
if [[ "$FORMAT" == "jpg" ]]; then
  ENC_ARGS=(-c:v mjpeg -q:v "$JPEG_QUALITY" -pix_fmt yuvj444p)
else
  ENC_ARGS=(-c:v png -compression_level 9 -pred mixed)
fi

ffmpeg -y -i "$SOURCE" \
  "${VF_ARGS[@]}" \
  -vsync passthrough \
  "${ENC_ARGS[@]}" \
  -start_number 1 \
  "$FRAMES_DIR/frame_%04d.${FORMAT}"

FRAME_COUNT="$(find "$FRAMES_DIR" -maxdepth 1 -name "frame_*.${FORMAT}" | wc -l | tr -d ' ')"
DIMS="$(ffprobe -v error -select_streams v:0 \
  -show_entries stream=width,height \
  -of csv=p=0:s=x "$FRAMES_DIR/frame_0001.${FORMAT}")"
FRAME_WIDTH="${DIMS%x*}"
FRAME_HEIGHT="${DIMS#*x}"

SOURCE_FPS_RAW="$(ffprobe -v error -select_streams v:0 \
  -show_entries stream=r_frame_rate -of csv=p=0 "$SOURCE")"
SOURCE_FPS="$(awk -F'/' '{ printf "%d", ($2 ? $1 / $2 : $1) }' <<<"$SOURCE_FPS_RAW")"
MANIFEST_FPS="${SOURCE_FPS:-24}"
if [[ "$FPS" != "0" ]]; then
  MANIFEST_FPS="$FPS"
fi

cat > "$FRAMES_DIR/manifest.json" <<EOF
{
  "frameCount": ${FRAME_COUNT},
  "prefix": "/mobile-frames/frame_",
  "extension": "${FORMAT}",
  "pad": 4,
  "width": ${FRAME_WIDTH},
  "height": ${FRAME_HEIGHT},
  "fps": ${MANIFEST_FPS},
  "source": "/mobile.mp4"
}
EOF

echo "Extracted ${FRAME_COUNT} HD ${FORMAT^^} mobile frames (${FRAME_WIDTH}x${FRAME_HEIGHT})."
