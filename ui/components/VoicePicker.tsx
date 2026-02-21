"use client";

import { VOICE_OPTIONS } from "@/lib/constants";
import { VoiceId } from "@/lib/types";

interface VoicePickerProps {
  value: VoiceId;
  onChange: (value: VoiceId) => void;
}

export default function VoicePicker({ value, onChange }: VoicePickerProps) {
  return (
    <div>
      <label className="mb-3 block font-display text-sm font-semibold">
        Voice
      </label>
      <div className="flex flex-wrap gap-2">
        {VOICE_OPTIONS.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange(opt.id as VoiceId)}
            className={`rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
              value === opt.id
                ? "bg-accent/10 text-accent ring-1 ring-accent/30"
                : "bg-fg/5 text-fg hover:bg-fg/10"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
