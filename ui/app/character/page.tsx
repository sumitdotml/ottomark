"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Character } from "@/lib/types";
import { getCharacters, saveCharacter, deleteCharacter } from "@/lib/storage";
import CharacterCard from "@/components/CharacterCard";
import CharacterModal from "@/components/CharacterModal";

export default function CharacterPage() {
  const router = useRouter();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingCharacter, setEditingCharacter] = useState<Character | null>(null);

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

  function handleDelete(id: string) {
    deleteCharacter(id);
    setCharacters(getCharacters());
    if (selectedId === id) setSelectedId(null);
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

        <div
          className="animate-fade-up mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3"
          style={{ animationDelay: "0.1s" }}
        >
          <button
            onClick={() => {
              setEditingCharacter(null);
              setShowModal(true);
            }}
            className="flex flex-col items-center justify-center gap-3 rounded-[var(--radius)] border-2 border-dashed border-accent/30 bg-accent/5 p-8 transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/60 hover:bg-accent/10"
          >
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-accent/10">
              <span className="text-3xl text-accent">+</span>
            </div>
            <p className="font-display text-base font-semibold text-accent">Create New</p>
          </button>
          {characters.map((c) => (
            <CharacterCard
              key={c.id}
              character={c}
              selected={selectedId === c.id}
              onClick={() => {
                if (selectedId === c.id) {
                  setEditingCharacter(c);
                  setShowModal(true);
                } else {
                  setSelectedId(c.id);
                }
              }}
              onDelete={handleDelete}
            />
          ))}
        </div>

        {selectedId && (
          <button
            onClick={handleGenerate}
            className="animate-fade-up mt-8 w-full rounded-xl bg-accent py-4 font-display text-base font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-accent-hover"
            style={{ animationDelay: "0.2s" }}
          >
            Generate Videos →
          </button>
        )}
      </div>

      {showModal && (
        <CharacterModal
          character={editingCharacter ?? undefined}
          onSave={handleSaveCharacter}
          onClose={() => {
            setShowModal(false);
            setEditingCharacter(null);
          }}
        />
      )}
    </div>
  );
}
