export default function HeroSection() {
  return (
    <div className="flex justify-center">
      {/* Phone frame */}
      <div
        className="relative overflow-hidden rounded-[40px]"
        style={{
          width: 280,
          aspectRatio: "9/16",
          background:
            "linear-gradient(160deg, #2A1F1A 0%, #1A1A1A 40%, #1A1510 100%)",
          boxShadow:
            "0 0 0 4px #2A2A2A, 0 0 0 5px rgba(255,255,255,0.05), 0 20px 60px rgba(0,0,0,0.3)",
        }}
      >
        {/* Notch */}
        <div className="absolute left-1/2 top-0 z-10 h-6 w-28 -translate-x-1/2 rounded-b-2xl bg-black" />

        {/* Subtle ambient glow — fakes "video playing" feel */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background:
              "radial-gradient(ellipse at 40% 35%, rgba(232,85,61,0.25) 0%, transparent 60%), radial-gradient(ellipse at 70% 65%, rgba(201,123,42,0.15) 0%, transparent 50%)",
          }}
        />

        {/* ── Right sidebar (TikTok icons) ── */}
        <div className="absolute bottom-28 right-3 flex flex-col items-center gap-5">
          {/* Heart */}
          <div className="flex flex-col items-center gap-1">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="#E8553D">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            <span className="text-[10px] font-medium text-white/80">
              4.2K
            </span>
          </div>
          {/* Comment */}
          <div className="flex flex-col items-center gap-1">
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="white"
              fillOpacity={0.8}
            >
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
            </svg>
            <span className="text-[10px] font-medium text-white/80">328</span>
          </div>
          {/* Share / forward arrow */}
          <div className="flex flex-col items-center gap-1">
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="white"
              fillOpacity={0.8}
            >
              <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81a3 3 0 100-6 3 3 0 00-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9a3 3 0 100 6c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65a2.92 2.92 0 105.84 0 2.92 2.92 0 00-2.92-2.92z" />
            </svg>
            <span className="text-[10px] font-medium text-white/80">
              Share
            </span>
          </div>
        </div>

        {/* ── Bottom content ── */}
        <div className="absolute bottom-8 left-4 right-14">
          {/* Collab avatars + handle */}
          <div className="mb-2 flex items-center gap-2">
            <div className="flex -space-x-2">
              <img
                src="/videos/puck.jpeg"
                alt="Puck"
                className="h-8 w-8 rounded-full object-cover"
                style={{ border: "2px solid rgba(232,85,61,0.6)" }}
              />
              <img
                src="/videos/algenib.jpeg"
                alt="Algenib"
                className="h-8 w-8 rounded-full object-cover"
                style={{ border: "2px solid rgba(255,255,255,0.25)" }}
              />
            </div>
            <span className="font-display text-[13px] font-bold text-white">
              puck &times; algenib
            </span>
          </div>

          {/* Fake caption lines */}
          <div className="space-y-1.5">
            <div className="h-2 w-3/4 rounded-full bg-white/25" />
            <div className="h-2 w-1/2 rounded-full bg-white/15" />
          </div>
        </div>

        {/* ── Progress bar ── */}
        <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-white/10">
          <div className="h-full w-2/3 rounded-r-full bg-accent" />
        </div>
      </div>
    </div>
  );
}
