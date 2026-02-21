import { VoiceId } from "./types";
import { VOICE_OPTIONS } from "./constants";

export function resolveGeminiVoice(voiceId: VoiceId): string {
  const option = VOICE_OPTIONS.find((v) => v.id === voiceId);
  return option?.geminiVoice ?? "Puck";
}
