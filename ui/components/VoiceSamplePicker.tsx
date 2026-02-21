"use client";

import { VOICE_SAMPLES } from "@/lib/constants";

interface VoiceSamplePickerProps {
  value: string;
  onChange: (value: string) => void;
}

export default function VoiceSamplePicker({ value, onChange }: VoiceSamplePickerProps) {
  return (
    <div>
      <label className="mb-3 block font-display text-sm font-semibold">
        Voice Sample
      </label>
      <div className="grid grid-cols-2 gap-2">
        {VOICE_SAMPLES.map((sample) => (
          <button
            key={sample.id}
            type="button"
            onClick={() => {
              onChange(sample.id);
              console.log(`Playing voice sample: ${sample.label}`);
            }}
            className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
              value === sample.id
                ? "bg-accent/10 text-accent ring-1 ring-accent/30"
                : "bg-fg/5 text-fg hover:bg-fg/10"
            }`}
          >
            <span className="text-base">{value === sample.id ? "▶" : "♪"}</span>
            {sample.label}
          </button>
        ))}
      </div>
    </div>
  );
}
