"use client";

import { useEffect, useRef, useState } from "react";
import { VideoResult } from "@/lib/types";

interface VideoCardProps {
  video: VideoResult;
  index: number;
}

export default function VideoCard({ video, index }: VideoCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [showPoster, setShowPoster] = useState(true);
  const [frameThumb, setFrameThumb] = useState<string | null>(null);

  useEffect(() => {
    if (!video.videoUrl || video.thumbnailUrl) return;
    const v = document.createElement("video");
    v.crossOrigin = "anonymous";
    v.preload = "auto";
    v.muted = true;
    v.src = video.videoUrl;
    v.currentTime = 0.5;
    v.oncanplay = () => {
      const c = document.createElement("canvas");
      c.width = v.videoWidth;
      c.height = v.videoHeight;
      c.getContext("2d")!.drawImage(v, 0, 0);
      setFrameThumb(c.toDataURL("image/jpeg", 0.8));
    };
  }, [video.videoUrl, video.thumbnailUrl]);

  function togglePlay() {
    const el = videoRef.current;
    if (!el) return;
    if (playing) {
      el.pause();
      setPlaying(false);
      setShowPoster(true);
    } else {
      el.play();
      setPlaying(true);
      setShowPoster(false);
    }
  }

  function handleDownload() {
    if (!video.videoUrl) return;
    const a = document.createElement("a");
    a.href = video.videoUrl;
    a.download = `${video.title.replace(/\s+/g, "-").toLowerCase()}.mp4`;
    a.click();
  }

  return (
    <div
      className="animate-fade-up group flex w-full min-w-0 flex-1 flex-col overflow-hidden rounded-2xl"
      style={{
        animationDelay: `${index * 0.12}s`,
        background: "var(--card-bg)",
        boxShadow: "0 4px 32px rgba(0,0,0,0.10), 0 1px 4px rgba(0,0,0,0.06)",
      }}
    >
      {/* 9:16 media area */}
      <div
        className="relative aspect-[9/16] cursor-pointer overflow-hidden"
        onClick={togglePlay}
      >
        {/* video element */}
        {video.videoUrl && (
          <video
            ref={videoRef}
            src={video.videoUrl}
            loop
            playsInline
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}

        {/* thumbnail / poster overlay */}
        {showPoster && (
          <div className="absolute inset-0 z-10">
            {video.thumbnailUrl || frameThumb ? (
              <img
                src={(video.thumbnailUrl || frameThumb)!}
                alt={video.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div
                className="flex h-full w-full items-center justify-center"
                style={{ backgroundColor: video.thumbnailColor }}
              >
                <span className="font-display text-sm font-medium tracking-wider text-white/70">
                  {video.label}
                </span>
              </div>
            )}
          </div>
        )}

        {/* play/pause icon overlay */}
        <div
          className={`absolute inset-0 z-20 flex items-center justify-center transition-opacity duration-200 ${
            playing ? "opacity-0 group-hover:opacity-100" : "opacity-100"
          }`}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm">
            {playing ? (
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <rect x="3" y="2" width="4" height="14" rx="1" fill="white" />
                <rect x="11" y="2" width="4" height="14" rx="1" fill="white" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M4 2.5L15 9L4 15.5V2.5Z" fill="white" />
              </svg>
            )}
          </div>
        </div>

        {/* style label badge */}
        <div className="absolute left-2.5 top-2.5 z-20">
          <span className="rounded-md bg-black/50 px-2 py-0.5 font-display text-[10px] font-semibold uppercase tracking-widest text-white/90 backdrop-blur-sm">
            {video.label}
          </span>
        </div>
      </div>

      {/* bottom bar */}
      <div className="flex items-center justify-between px-4 py-3">
        <h3 className="font-display text-sm font-semibold">{video.title}</h3>
        <button
          onClick={handleDownload}
          disabled={!video.videoUrl}
          className="rounded-lg border border-card-border px-2.5 py-1 text-[11px] font-medium text-muted transition-colors hover:border-fg hover:text-fg disabled:cursor-not-allowed disabled:opacity-40"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            className="inline-block"
            style={{ marginTop: "-1px", marginRight: "3px" }}
          >
            <path
              d="M7 1.5V9.5M7 9.5L4 6.5M7 9.5L10 6.5M2 11.5H12"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Save
        </button>
      </div>
    </div>
  );
}
