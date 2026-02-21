"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { getCharacterById } from "@/lib/storage";
import { PLACEHOLDER_VIDEOS } from "@/lib/constants";
import LoadingOverlay from "@/components/LoadingOverlay";
import VideoCard from "@/components/VideoCard";

function ResultsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const characterId = searchParams.get("characterId");
  const [loading, setLoading] = useState(true);
  const [characterName, setCharacterName] = useState("");

  useEffect(() => {
    if (!characterId) {
      router.replace("/");
      return;
    }
    const character = getCharacterById(characterId);
    if (character) {
      setCharacterName(character.nickname);
    }
    const timer = setTimeout(() => setLoading(false), 3000);
    return () => clearTimeout(timer);
  }, [characterId, router]);

  if (loading) return <LoadingOverlay />;

  return (
    <div className="flex min-h-screen flex-col items-center px-6 py-20">
      <div className="w-full max-w-5xl">
        <div className="animate-fade-up mb-12">
          <h1 className="font-display text-4xl font-800 tracking-tight lg:text-5xl">
            {characterName ? `${characterName}'s` : "Your"} Commentary
          </h1>
          <p className="mt-3 text-lg text-muted">
            3 AI-generated commentary videos, ready to watch.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PLACEHOLDER_VIDEOS.map((video, i) => (
            <VideoCard key={video.id} video={video} index={i} />
          ))}
        </div>

        <div
          className="animate-fade-up mt-14 flex flex-wrap gap-4"
          style={{ animationDelay: "0.5s" }}
        >
          <button
            onClick={() => router.push("/")}
            className="rounded-xl border border-card-border px-6 py-3 font-display text-sm font-medium transition-colors hover:border-fg hover:text-fg"
          >
            Back to Home
          </button>
          <button
            onClick={() => router.push("/character")}
            className="rounded-xl bg-accent px-6 py-3 font-display text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-accent-hover"
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
