"use client";

export default function LoadingOverlay() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-bg">
      <div className="relative">
        {/* morphing blob */}
        <div
          className="animate-morph h-40 w-40 bg-accent/20"
          style={{ borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%" }}
        />
        {/* inner blob */}
        <div
          className="animate-morph absolute inset-6 bg-accent/40"
          style={{
            borderRadius: "40% 60% 70% 30% / 40% 70% 30% 60%",
            animationDelay: "-2s",
          }}
        />
        <div
          className="animate-morph absolute inset-12 bg-accent/70"
          style={{
            borderRadius: "50% 50% 40% 60% / 60% 40% 60% 40%",
            animationDelay: "-4s",
          }}
        />
      </div>
      <p className="mt-10 font-display text-lg font-medium tracking-wide text-muted">
        Generating commentary...
      </p>
    </div>
  );
}
