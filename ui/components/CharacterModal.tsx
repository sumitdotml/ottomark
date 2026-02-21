"use client";

import { useState, useRef } from "react";
import { Character } from "@/lib/types";
import VoiceSlider from "./VoiceSlider";
import PersonalityChips from "./PersonalityChips";
import VoiceSamplePicker from "./VoiceSamplePicker";

interface CharacterModalProps {
  onSave: (character: Character) => void;
  onClose: () => void;
}

export default function CharacterModal({ onSave, onClose }: CharacterModalProps) {
  const [nickname, setNickname] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [voiceWeight, setVoiceWeight] = useState(50);
  const [personality, setPersonality] = useState<Character["personality"]>("funny");
  const [voiceSample, setVoiceSample] = useState("smooth");
  const fileRef = useRef<HTMLInputElement>(null);

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImageUrl(reader.result as string);
    reader.readAsDataURL(file);
  }

  function handleSave() {
    if (!nickname.trim()) return;
    onSave({
      id: crypto.randomUUID(),
      nickname: nickname.trim(),
      imageUrl,
      voiceWeight,
      personality,
      voiceSample,
      createdAt: Date.now(),
    });
  }

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-fg/30 p-4 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="animate-slide-up w-full max-w-lg rounded-[20px] bg-bg p-8 shadow-2xl">
        <h2 className="font-display text-2xl font-bold">New Character</h2>

        <div className="mt-6 space-y-6">
          {/* nickname */}
          <div>
            <label className="mb-2 block font-display text-sm font-semibold">
              Nickname
            </label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="e.g. Captain Sarcasm"
              className="w-full rounded-xl border border-card-border bg-card-bg px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted/50 focus:border-accent"
            />
          </div>

          {/* image upload */}
          <div>
            <label className="mb-2 block font-display text-sm font-semibold">
              Avatar
            </label>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-card-border transition-colors hover:border-accent"
            >
              {imageUrl ? (
                <img src={imageUrl} alt="Avatar" className="h-full w-full object-cover" />
              ) : (
                <span className="text-2xl text-muted">+</span>
              )}
            </button>
          </div>

          <VoiceSlider value={voiceWeight} onChange={setVoiceWeight} />
          <PersonalityChips value={personality} onChange={setPersonality} />
          <VoiceSamplePicker value={voiceSample} onChange={setVoiceSample} />
        </div>

        <div className="mt-8 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-card-border py-3 font-display text-sm font-medium transition-colors hover:border-fg"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!nickname.trim()}
            className="flex-1 rounded-xl bg-accent py-3 font-display text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-accent-hover disabled:opacity-40 disabled:hover:translate-y-0"
          >
            Save Character
          </button>
        </div>
      </div>
    </div>
  );
}
