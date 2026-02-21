import { Character, VoiceId } from "./types";

const STORAGE_KEY = "gamevoice-characters";

const VOICE_SAMPLE_MIGRATION: Record<string, VoiceId> = {
  deep: "gravelly",
  smooth: "smooth",
  energetic: "upbeat",
  "laid-back": "casual",
};

function migrateCharacter(c: Record<string, unknown>): Character {
  if ("voiceSample" in c && !("voice" in c)) {
    const oldId = c.voiceSample as string;
    const voice = VOICE_SAMPLE_MIGRATION[oldId] ?? "upbeat";
    const { voiceSample: _, voiceWeight: __, ...rest } = c as Record<string, unknown>;
    return { ...rest, voice } as Character;
  }
  return c as unknown as Character;
}

export function getCharacters(): Character[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  const parsed = JSON.parse(raw) as Record<string, unknown>[];
  const migrated = parsed.map(migrateCharacter);
  // persist migration so it only runs once
  localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
  return migrated;
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
