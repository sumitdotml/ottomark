"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { getCharacterById } from "@/lib/storage";
import { GENERATION_STEPS, generateCommentary, getGenerationCache } from "@/lib/api";
import { GenerationStep, VideoResult } from "@/lib/types";
import LoadingOverlay from "@/components/LoadingOverlay";
import VideoCard from "@/components/VideoCard";

function ResultsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const characterId = searchParams.get("characterId");
  const [loading, setLoading] = useState(true);
  const [characterName, setCharacterName] = useState("");
  const [generatedScript, setGeneratedScript] = useState("");
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [steps, setSteps] = useState<GenerationStep[]>(
    () => GENERATION_STEPS.map((s) => ({ ...s }))
  );
  const [videos, setVideos] = useState<VideoResult[]>([]);

  const onStepChange = useCallback(
    (stepId: string, status: "in_progress" | "completed") => {
      setSteps((prev) =>
        prev.map((s) => (s.id === stepId ? { ...s, status } : s))
      );
    },
    []
  );

  useEffect(() => {
    if (!characterId) {
      router.replace("/");
      return;
    }
    const character = getCharacterById(characterId);
    if (!character) {
      router.replace("/character");
      return;
    }
    setCharacterName(character.nickname);

    const cached = getGenerationCache(characterId);
    if (cached) {
      setVideos(cached.videos);
      setGeneratedScript(cached.script);
      setLoading(false);
      return;
    }

    let cancelled = false;

    generateCommentary({ characterId, character, onStepChange })
      .then(async (result) => {
        if (cancelled) return;
        setVideos(result);
        setGeneratedScript(sessionStorage.getItem("gamevoice-last-script") ?? "");
        await new Promise((r) => setTimeout(r, 600));
        if (!cancelled) setLoading(false);
      })
      .catch((error: unknown) => {
        console.error("Commentary generation failed", error);
        if (!cancelled) {
          const message =
            error instanceof Error ? error.message : "Failed to generate commentary.";
          setGenerationError(message);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [characterId, router, onStepChange]);

  if (loading) return <LoadingOverlay steps={steps} />;
  if (generationError) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-6">
        <div className="w-full max-w-2xl rounded-2xl border border-card-border bg-card p-8">
          <h1 className="font-display text-3xl font-800 tracking-tight">Generation Failed</h1>
          <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-muted">
            {generationError}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button
              onClick={() => window.location.reload()}
              className="rounded-xl bg-accent px-6 py-3 font-display text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-accent-hover"
            >
              Retry
            </button>
            <button
              onClick={() => router.push("/character")}
              className="rounded-xl border border-card-border px-6 py-3 font-display text-sm font-medium transition-all hover:-translate-y-0.5 hover:border-fg hover:text-fg"
            >
              Back to Characters
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center px-6 py-20">
      <div className="w-full max-w-5xl">
        <div className="animate-fade-up mb-12">
          <h1 className="font-display text-4xl font-800 tracking-tight lg:text-5xl">
            {characterName ? `${characterName}'s` : "Your"} Commentary
          </h1>
          <p className="mt-3 text-lg text-muted">
            3 AI-generated commentary samples, ready to watch.
          </p>
        </div>

        <div className="flex flex-col gap-6 sm:flex-row">
          {videos.map((video, i) => (
            <VideoCard key={video.id} video={video} index={i} />
          ))}
        </div>

        {generatedScript ? (
          <div className="animate-fade-up mt-10 rounded-2xl border border-card-border bg-card p-6">
            <h2 className="font-display text-xl font-semibold tracking-tight">
              Generated Script (Temporary)
            </h2>
            <pre className="mt-4 max-h-80 overflow-auto whitespace-pre-wrap rounded-xl bg-bg p-4 text-xs leading-relaxed text-muted">
              {generatedScript}
            </pre>
          </div>
        ) : null}

        <div
          className="animate-fade-up mt-14 flex flex-wrap gap-4"
          style={{ animationDelay: "0.5s" }}
        >
          <button
            onClick={() => router.push("/")}
            className="rounded-xl border border-card-border px-8 py-3.5 font-display text-base font-medium transition-all hover:-translate-y-0.5 hover:border-fg hover:text-fg"
          >
            Back to Home
          </button>
          <button
            onClick={() => router.push("/character")}
            className="rounded-xl bg-accent px-8 py-3.5 font-display text-base font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-accent-hover"
          >
            Create Another Character
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={<LoadingOverlay />}>
      <ResultsContent />
    </Suspense>
  );
}
