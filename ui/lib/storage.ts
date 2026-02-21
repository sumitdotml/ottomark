import { Character } from "./types";

const STORAGE_KEY = "gamevoice-characters";

export function getCharacters(): Character[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function saveCharacter(character: Character): void {
  const existing = getCharacters();
  const idx = existing.findIndex((c) => c.id === character.id);
  if (idx >= 0) {
    existing[idx] = character;
  } else {
    existing.push(character);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
}

export function getCharacterById(id: string): Character | undefined {
  return getCharacters().find((c) => c.id === id);
}

export function deleteCharacter(id: string): void {
  const remaining = getCharacters().filter((c) => c.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(remaining));
}
