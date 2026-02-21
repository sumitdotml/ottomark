"use client";

import { GenerationStep } from "@/lib/types";

interface LoadingOverlayProps {
  steps?: GenerationStep[];
}

export default function LoadingOverlay({ steps }: LoadingOverlayProps) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-bg">
      <div className="relative">
        {/* morphing blob */}
        <div
          className="animate-morph h-56 w-56 bg-accent/20"
          style={{ borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%" }}
        />
        {/* inner blob */}
        <div
          className="animate-morph absolute inset-8 bg-accent/40"
          style={{
            borderRadius: "40% 60% 70% 30% / 40% 70% 30% 60%",
            animationDelay: "-2s",
          }}
        />
        <div
          className="animate-morph absolute inset-16 bg-accent/70"
          style={{
            borderRadius: "50% 50% 40% 60% / 60% 40% 60% 40%",
            animationDelay: "-4s",
          }}
        />
      </div>

      {steps ? (
        <div className="mt-14 flex flex-col gap-4">
          {steps.map((step) => (
            <div
              key={step.id}
              className={`flex items-center gap-4 font-display text-lg tracking-wide transition-all duration-500 ${
                step.status === "pending"
                  ? "translate-y-2 opacity-0"
                  : step.status === "in_progress"
                    ? "animate-fade-up text-fg"
                    : "text-muted"
              }`}
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center">
                {step.status === "in_progress" ? (
                  <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-accent" />
                ) : step.status === "completed" ? (
                  <span className="text-lg text-accent">✓</span>
                ) : null}
              </span>
              <span>{step.label}</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-14 font-display text-xl font-medium tracking-wide text-muted">
          Generating commentary...
        </p>
      )}
    </div>
  );
}
