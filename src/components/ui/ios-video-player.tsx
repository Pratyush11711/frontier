"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Maximize2, Pause, Play, RotateCcw, RotateCw } from "lucide-react";
import { cn } from "@/lib/utils";

const SKIP_SECONDS = 10;

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function ControlBubble({
  children,
  label,
  onClick,
  className,
  large,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
  className?: string;
  large?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      aria-label={label}
      className={cn(
        "flex items-center justify-center rounded-full border border-white/35 bg-white/15 text-white shadow-[0_12px_40px_rgba(1,26,36,0.35)] backdrop-blur-xl transition-transform hover:scale-105",
        large ? "h-14 w-14 sm:h-16 sm:w-16" : "h-11 w-11 sm:h-12 sm:w-12",
        className,
      )}
    >
      {children}
    </button>
  );
}

function SkipButton({
  direction,
  onClick,
}: {
  direction: "back" | "forward";
  onClick: () => void;
}) {
  const Icon = direction === "back" ? RotateCcw : RotateCw;

  return (
    <ControlBubble
      label={`${direction === "back" ? "Rewind" : "Forward"} ${SKIP_SECONDS} seconds`}
      onClick={onClick}
    >
      <span className="relative flex items-center justify-center">
        <Icon className="h-5 w-5 sm:h-5 sm:w-5" strokeWidth={1.75} />
        <span className="absolute text-[9px] font-bold leading-none sm:text-[10px]">10</span>
      </span>
    </ControlBubble>
  );
}

export function IOSVideoPlayer({
  src,
  className,
}: {
  src: string;
  className?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hideTimerRef = useRef<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);

  const clearHideTimer = useCallback(() => {
    if (hideTimerRef.current !== null) {
      window.clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
  }, []);

  const scheduleHideControls = useCallback(() => {
    clearHideTimer();
    hideTimerRef.current = window.setTimeout(() => {
      setShowControls(false);
    }, 2400);
  }, [clearHideTimer]);

  const togglePlay = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      try {
        await video.play();
        setPlaying(true);
        scheduleHideControls();
      } catch {
        setPlaying(false);
      }
      return;
    }

    video.pause();
    setPlaying(false);
    setShowControls(true);
    clearHideTimer();
  }, [clearHideTimer, scheduleHideControls]);

  const skip = useCallback(
    (delta: number) => {
      const video = videoRef.current;
      if (!video) return;

      const next = Math.min(duration || video.duration || 0, Math.max(0, video.currentTime + delta));
      video.currentTime = next;
      setCurrentTime(next);
      setShowControls(true);
      if (playing) scheduleHideControls();
    },
    [duration, playing, scheduleHideControls],
  );

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onTimeUpdate = () => setCurrentTime(video.currentTime);
    const onLoaded = () => setDuration(video.duration);
    const onPlay = () => {
      setPlaying(true);
      scheduleHideControls();
    };
    const onPause = () => {
      setPlaying(false);
      setShowControls(true);
      clearHideTimer();
    };
    const onEnded = () => {
      setPlaying(false);
      setShowControls(true);
      clearHideTimer();
    };

    video.addEventListener("timeupdate", onTimeUpdate);
    video.addEventListener("loadedmetadata", onLoaded);
    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    video.addEventListener("ended", onEnded);

    return () => {
      video.removeEventListener("timeupdate", onTimeUpdate);
      video.removeEventListener("loadedmetadata", onLoaded);
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("ended", onEnded);
      clearHideTimer();
    };
  }, [clearHideTimer, scheduleHideControls]);

  const handleSeek = (value: number) => {
    const video = videoRef.current;
    if (!video || !duration) return;
    video.currentTime = value;
    setCurrentTime(value);
  };

  const handleFullscreen = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return;
    if (document.fullscreenElement) {
      await document.exitFullscreen();
      return;
    }
    await video.requestFullscreen?.();
  }, []);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const controlsVisible = showControls || !playing;

  return (
    <div
      className={cn("glass-ios-clear group relative w-full overflow-hidden", className)}
      onMouseMove={() => {
        setShowControls(true);
        if (playing) scheduleHideControls();
      }}
      onTouchStart={() => setShowControls(true)}
    >
      <video
        ref={videoRef}
        src={src}
        playsInline
        preload="metadata"
        className="aspect-video w-full bg-[#011a24] object-cover"
        onClick={togglePlay}
      >
        <track kind="captions" />
      </video>

      <div
        className={cn(
          "pointer-events-none absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-[#011a24]/95 via-[#011a24]/70 to-transparent px-4 pb-4 pt-10 transition-opacity duration-300 sm:px-5 sm:pb-5 sm:pt-12",
          controlsVisible ? "opacity-100" : "opacity-0",
        )}
      >
        <div className="pointer-events-auto">
          <input
            type="range"
            min={0}
            max={duration || 100}
            step={0.1}
            value={currentTime}
            onChange={(e) => handleSeek(Number(e.target.value))}
            onClick={(e) => e.stopPropagation()}
            aria-label="Video progress"
            className="ios-video-range h-1 w-full cursor-pointer appearance-none rounded-full bg-white/25 accent-white"
            style={{
              background: `linear-gradient(to right, #ffffff ${progress}%, rgba(255,255,255,0.25) ${progress}%)`,
            }}
          />

          <div className="relative mt-4 flex items-center justify-center gap-3 sm:mt-5 sm:gap-4">
            <span className="type-body-s absolute left-0 top-1/2 -translate-y-1/2 tabular-nums text-white/85">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>

            <SkipButton direction="back" onClick={() => skip(-SKIP_SECONDS)} />

            <ControlBubble
              label={playing ? "Pause video" : "Play video"}
              onClick={togglePlay}
              large
            >
              {playing ? (
                <Pause className="h-6 w-6 fill-white sm:h-7 sm:w-7" />
              ) : (
                <Play className="ml-0.5 h-6 w-6 fill-white sm:h-7 sm:w-7" />
              )}
            </ControlBubble>

            <SkipButton direction="forward" onClick={() => skip(SKIP_SECONDS)} />

            <ControlBubble
              label="Fullscreen"
              onClick={handleFullscreen}
              className="absolute right-0 top-1/2 -translate-y-1/2"
            >
              <Maximize2 className="h-5 w-5" strokeWidth={1.75} />
            </ControlBubble>
          </div>
        </div>
      </div>
    </div>
  );
}
