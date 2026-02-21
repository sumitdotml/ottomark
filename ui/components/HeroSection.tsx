"use client";

import { useRef, useState } from "react";

const REELS = [
  { video: "/videos/reel-1.mov", avatar: "/videos/algenib.jpeg", name: "Puck", color: "#E8553D", rotate: -4 },
  { video: "/videos/reel-2.mov", avatar: "/videos/puck.jpeg", name: "Algenib", color: "#1A1A1A", rotate: 4 },
];

function ReelFrame({ reel, index }: { reel: typeof REELS[number]; index: number }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  function toggle() {
    const el = videoRef.current;
    if (!el) return;
    if (playing) {
      el.pause();
      setPlaying(false);
    } else {
      el.play();
      setPlaying(true);
    }
  }

  return (
    <div
      className="relative w-36 shrink-0 cursor-pointer sm:w-44"
      style={{
        transform: `rotate(${reel.rotate}deg)`,
        zIndex: index === 0 ? 2 : 1,
        marginRight: index === 0 ? "-24px" : 0,
      }}
      onClick={toggle}
    >
      <div
        className="overflow-hidden rounded-2xl"
        style={{
          aspectRatio: "9/16",
          boxShadow: `0 20px 60px rgba(0,0,0,0.15), 0 4px 12px rgba(0,0,0,0.08)`,
        }}
      >
        <video
          ref={videoRef}
          src={reel.video}
          muted
          loop
          playsInline
          className="h-full w-full object-cover"
        />
        <div
          className={`absolute inset-0 flex items-center justify-center rounded-2xl transition-opacity duration-300 ${
            playing ? "opacity-0 hover:opacity-100" : "opacity-100"
          }`}
          style={{ background: playing ? "rgba(0,0,0,0.1)" : "rgba(0,0,0,0.25)" }}
        >
          {playing ? (
            <svg width="28" height="28" viewBox="0 0 18 18" fill="none">
              <rect x="3" y="2" width="4" height="14" rx="1" fill="white" fillOpacity="0.9" />
              <rect x="11" y="2" width="4" height="14" rx="1" fill="white" fillOpacity="0.9" />
            </svg>
          ) : (
            <svg width="28" height="28" viewBox="0 0 18 18" fill="none">
              <path d="M4 2.5L15 9L4 15.5V2.5Z" fill="white" fillOpacity="0.9" />
            </svg>
          )}
        </div>
      </div>

      <div
        className="absolute -bottom-4 left-1/2 -translate-x-1/2"
        style={{ zIndex: 3 }}
      >
        <img
          src={reel.avatar}
          alt={reel.name}
          className="h-10 w-10 rounded-full object-cover"
          style={{ boxShadow: `0 0 0 2.5px ${reel.color}, 0 4px 12px rgba(0,0,0,0.15)` }}
        />
      </div>
    </div>
  );
}

export default function HeroSection() {
  return (
    <div className="relative flex w-full max-w-2xl items-center justify-center py-8">
      <div className="relative flex items-center justify-center">
        <div
          className="absolute -inset-10 rounded-full opacity-40 blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(232,85,61,0.2) 0%, transparent 70%)" }}
        />

        <div className="relative flex items-end justify-center">
          {REELS.map((reel, i) => (
            <ReelFrame key={reel.name} reel={reel} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
