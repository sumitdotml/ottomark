"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Character } from "@/lib/types";
import { getCharacters, saveCharacter } from "@/lib/storage";
import CharacterCard from "@/components/CharacterCard";
import CharacterModal from "@/components/CharacterModal";

export default function CharacterPage() {
  const router = useRouter();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const saved = getCharacters();
    setCharacters(saved);
    if (saved.length === 0) setShowModal(true);
  }, []);

  function handleSaveCharacter(character: Character) {
    saveCharacter(character);
    setCharacters(getCharacters());
    setSelectedId(character.id);
    setShowModal(false);
  }

  function handleGenerate() {
    if (!selectedId) return;
    router.push(`/results?characterId=${selectedId}`);
  }

  return (
    <div className="flex min-h-screen flex-col items-center px-6 py-20">
      <div className="w-full max-w-3xl">
        <div className="animate-fade-up">
          <h1 className="font-display text-4xl font-800 tracking-tight lg:text-5xl">
            Choose a Character
          </h1>
          <p className="mt-3 text-lg text-muted">
            Pick a voice personality for your AI commentator.
          </p>
        </div>

        {characters.length > 0 && (
          <div
            className="animate-fade-up mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3"
            style={{ animationDelay: "0.1s" }}
          >
            {characters.map((c) => (
              <CharacterCard
                key={c.id}
                character={c}
                selected={selectedId === c.id}
                onClick={() => setSelectedId(c.id)}
              />
            ))}
          </div>
        )}

        <div
          className="animate-fade-up mt-8 flex flex-wrap gap-4"
          style={{ animationDelay: "0.2s" }}
        >
          <button
            onClick={() => setShowModal(true)}
            className="rounded-xl border border-card-border px-6 py-3 font-display text-sm font-medium transition-colors hover:border-fg hover:text-fg"
          >
            + Create New
          </button>
          {selectedId && (
            <button
              onClick={handleGenerate}
              className="rounded-xl bg-accent px-6 py-3 font-display text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-accent-hover"
            >
              Generate Videos →
            </button>
          )}
        </div>
      </div>

      {showModal && (
        <CharacterModal
          onSave={handleSaveCharacter}
          onClose={() => {
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
}
