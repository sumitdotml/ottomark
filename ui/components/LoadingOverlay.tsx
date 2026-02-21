"use client";

import { useEffect, useState } from "react";
import { GenerationStep } from "@/lib/types";

const QUIPS = [
  "still on it... hold tight",
  "teaching the AI some new moves",
  "the AI is arguing about which play was best",
  "writing commentary so good it needs a second draft",
  "Puck and Algenib are warming up their vocal cords",
  "rewinding that highlight reel one more time",
  "consulting the instant replay booth",
  "calibrating hype levels to maximum",
  "Algenib is practicing his dramatic pauses",
  "Puck just spilled coffee on the script",
  "asking the AI to turn it up to eleven",
  "generating hot takes at an alarming rate",
  "the commentary booth is getting heated",
  "fact-checking that triple kill claim",
  "Puck wants more exclamation marks. Algenib disagrees.",
  "buffering charisma... almost there",
  "the AI saw that play and needed a moment",
  "drafting acceptance speech for best commentary",
  "running it back in slow-mo for dramatic effect",
  "Algenib just called that play \"mid.\" revising.",
];

interface LoadingOverlayProps {
  steps?: GenerationStep[];
  message?: string;
}

export default function LoadingOverlay({ steps, message }: LoadingOverlayProps) {
  const [quip, setQuip] = useState<string | null>(null);
  const activeStep = steps?.find((s) => s.status === "in_progress");

  useEffect(() => {
    setQuip(null);
    if (!activeStep) return;
    const timer = setTimeout(() => {
      setQuip(QUIPS[Math.floor(Math.random() * QUIPS.length)]);
    }, 5000);
    return () => clearTimeout(timer);
  }, [activeStep?.id]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-bg">
      <div className="relative">
        <div
          className="animate-morph h-56 w-56 bg-accent/20"
          style={{ borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%" }}
        />
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
                  <span className="text-lg text-accent">&#10003;</span>
                ) : null}
              </span>
              <span>{step.label}</span>
            </div>
          ))}

          <div className={`mt-2 flex items-center gap-2.5 pl-10 transition-opacity duration-500 ${quip ? "opacity-100" : "opacity-0"}`}>
            <span className="flex items-center gap-[3px]">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="inline-block h-1 w-1 rounded-full bg-accent/50"
                  style={{
                    animation: "quipBounce 1.2s ease-in-out infinite",
                    animationDelay: `${i * 0.15}s`,
                  }}
                />
              ))}
            </span>
            <span className="font-display text-sm italic tracking-wide text-muted/70">
              {quip || "\u00A0"}
            </span>
          </div>
        </div>
      ) : (
        <p className="mt-14 font-display text-xl font-medium tracking-wide text-muted">
          {message || "Generating commentary..."}
        </p>
      )}
    </div>
  );
}
