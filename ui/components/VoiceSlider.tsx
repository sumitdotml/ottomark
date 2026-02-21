"use client";

interface VoiceSliderProps {
  value: number;
  onChange: (value: number) => void;
}

export default function VoiceSlider({ value, onChange }: VoiceSliderProps) {
  return (
    <div>
      <label className="mb-3 block font-display text-sm font-semibold">
        Voice Weight
      </label>
      <div className="flex items-center gap-4">
        <span className="text-xs font-medium text-muted">Heavy</span>
        <input
          type="range"
          min={0}
          max={100}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="h-2 flex-1 cursor-pointer appearance-none rounded-full bg-fg/10 accent-accent"
        />
        <span className="text-xs font-medium text-muted">Light</span>
      </div>
    </div>
  );
}
