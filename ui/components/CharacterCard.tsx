"use client";

import { useState } from "react";
import { Character } from "@/lib/types";

interface CharacterCardProps {
  character: Character;
  selected: boolean;
  generated: boolean;
  onClick: () => void;
  onDelete?: (id: string) => void;
}

export default function CharacterCard({ character, selected, generated, onClick, onDelete }: CharacterCardProps) {
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={onClick}
        className={`flex w-full flex-col items-center gap-4 rounded-[var(--radius)] p-8 text-center transition-all duration-200 hover:-translate-y-0.5 ${
          selected
            ? "bg-accent/10 ring-2 ring-accent"
            : "bg-card-bg hover:shadow-md"
        }`}
        style={{ boxShadow: selected ? undefined : "var(--card-shadow)" }}
      >
        <div className={`rounded-full p-[3px] ${generated ? "generated-ring" : ""}`}>
          <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-fg/10">
            {character.imageUrl ? (
              <img
                src={character.imageUrl}
                alt={character.nickname}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="font-display text-2xl font-bold text-muted">
                {character.nickname.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
        </div>
        <div>
          <p className="font-display text-base font-semibold">{character.nickname}</p>
          {generated ? (
            <p className="mt-0.5 text-xs font-medium text-accent">Video ready</p>
          ) : (
            <p className="mt-0.5 text-xs capitalize text-muted">{character.personality}</p>
          )}
        </div>
      </button>

      {onDelete && !confirmingDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setConfirmingDelete(true);
          }}
          className="absolute right-3 top-3 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-card-bg text-xs text-muted shadow-sm transition-colors hover:bg-red-500/20 hover:text-red-500"
          aria-label={`Delete ${character.nickname}`}
        >
          ✕
        </button>
      )}

      {confirmingDelete && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 rounded-[var(--radius)] bg-bg/95 backdrop-blur-sm">
          <p className="font-display text-sm font-semibold">
            Delete {character.nickname}?
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setConfirmingDelete(false)}
              className="rounded-lg border border-card-border px-4 py-1.5 font-display text-xs font-medium transition-colors hover:border-fg"
            >
              Cancel
            </button>
            <button
              onClick={() => onDelete!(character.id)}
              className="rounded-lg bg-red-500 px-4 py-1.5 font-display text-xs font-semibold text-white transition-colors hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
