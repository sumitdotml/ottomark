"use client";

export default function HeroSection() {
  return (
    <div className="relative aspect-video w-full max-w-2xl overflow-hidden rounded-[20px] bg-fg/5">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="mb-3 text-5xl">🎮</div>
          <p className="font-display text-sm font-medium tracking-wide text-muted">
            GAMEPLAY PREVIEW
          </p>
        </div>
      </div>
      {/* subtle gradient shimmer */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background:
            "linear-gradient(135deg, transparent 30%, rgba(232, 85, 61, 0.1) 50%, transparent 70%)",
        }}
      />
    </div>
  );
}
