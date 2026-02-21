"use client";

import { useRouter } from "next/navigation";
import { PRESET_CHARACTERS } from "@/lib/constants";

export default function CharacterPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col items-center px-6 py-20">
      <div className="w-full max-w-3xl">
        <div className="animate-fade-up">
          <h1 className="font-display text-4xl font-800 tracking-tight lg:text-5xl">
            Meet the Voices
          </h1>
          <p className="mt-3 text-lg text-muted">
            Two AI commentators. One epic gameplay breakdown.
          </p>
        </div>

        <div
          className="animate-fade-up mt-10 grid grid-cols-2 gap-5"
          style={{ animationDelay: "0.1s" }}
        >
          {PRESET_CHARACTERS.map((char) => (
            <div
              key={char.id}
              className="flex flex-col items-center gap-4 rounded-[var(--radius)] p-8 text-center"
              style={{
                background: "var(--card-bg)",
                boxShadow: "var(--card-shadow)",
              }}
            >
              <img
                src={char.image}
                alt={char.name}
                className="h-24 w-24 rounded-full object-cover"
                style={{ boxShadow: `0 0 0 3px ${char.color}` }}
              />
              <div>
                <p className="font-display text-xl font-semibold">{char.name}</p>
                <p className="mt-1 text-sm text-fg/50">{char.voiceStyle} voice</p>
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                {char.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-fg/8 px-3 py-1 text-xs font-medium text-fg/60"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => router.push("/results")}
          className="animate-fade-up mt-8 w-full rounded-xl bg-accent py-4 font-display text-base font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-accent-hover"
          style={{ animationDelay: "0.2s" }}
        >
          Generate Videos
        </button>
      </div>
    </div>
  );
}
