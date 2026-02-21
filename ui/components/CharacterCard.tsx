"use client";

import { Character } from "@/lib/types";

interface CharacterCardProps {
  character: Character;
  selected: boolean;
  onClick: () => void;
}

export default function CharacterCard({ character, selected, onClick }: CharacterCardProps) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-3 rounded-[var(--radius)] p-6 text-center transition-all duration-200 hover:-translate-y-0.5 ${
        selected
          ? "bg-accent/10 ring-2 ring-accent"
          : "bg-card-bg hover:shadow-md"
      }`}
      style={{ boxShadow: selected ? undefined : "var(--card-shadow)" }}
    >
      {/* avatar */}
      <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-fg/10">
        {character.imageUrl ? (
          <img
            src={character.imageUrl}
            alt={character.nickname}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="font-display text-xl font-bold text-muted">
            {character.nickname.charAt(0).toUpperCase()}
          </span>
        )}
      </div>
      <div>
        <p className="font-display text-sm font-semibold">{character.nickname}</p>
        <p className="mt-0.5 text-xs capitalize text-muted">{character.personality}</p>
      </div>
    </button>
  );
}
