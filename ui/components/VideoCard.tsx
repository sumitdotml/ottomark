"use client";

import { VideoResult } from "@/lib/types";

interface VideoCardProps {
  video: VideoResult;
  index: number;
}

export default function VideoCard({ video, index }: VideoCardProps) {
  return (
    <div
      className="animate-fade-up group overflow-hidden rounded-[var(--radius)] bg-card-bg transition-all duration-300 hover:-translate-y-1"
      style={{
        animationDelay: `${index * 0.12}s`,
        boxShadow: "var(--card-shadow)",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = "var(--card-shadow-hover)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = "var(--card-shadow)";
      }}
    >
      {/* thumbnail placeholder */}
      <div
        className="flex aspect-video items-center justify-center"
        style={{ backgroundColor: video.thumbnailColor }}
      >
        <span className="font-display text-sm font-medium tracking-wider text-white/80">
          {video.label}
        </span>
      </div>

      <div className="flex items-center justify-between p-5">
        <h3 className="font-display text-base font-semibold">{video.title}</h3>
        <a
          href="#"
          onClick={(e) => e.preventDefault()}
          className="rounded-lg border border-card-border px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:border-fg hover:text-fg"
        >
          Download
        </a>
      </div>
    </div>
  );
}
