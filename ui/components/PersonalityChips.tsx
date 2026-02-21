"use client";

import { PERSONALITY_OPTIONS } from "@/lib/constants";
import { Character } from "@/lib/types";

interface PersonalityChipsProps {
  value: Character["personality"];
  onChange: (value: Character["personality"]) => void;
}

export default function PersonalityChips({ value, onChange }: PersonalityChipsProps) {
  return (
    <div>
      <label className="mb-3 block font-display text-sm font-semibold">
        Personality
      </label>
      <div className="flex flex-wrap gap-2">
        {PERSONALITY_OPTIONS.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={`rounded-full px-5 py-2 text-sm font-medium capitalize transition-all duration-200 ${
              value === option
                ? "bg-fg text-bg scale-105"
                : "bg-fg/5 text-fg hover:bg-fg/10"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
