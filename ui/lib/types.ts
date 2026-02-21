export type VoiceId = "upbeat" | "gravelly" | "smooth" | "casual" | "warm";

export interface Character {
  id: string;
  nickname: string;
  imageUrl: string | null;
  personality: "sarcastic" | "funny" | "rude" | "chill";
  voice: VoiceId;
  createdAt: number;
}

export interface VideoResult {
  id: string;
  title: string;
  thumbnailColor: string;
  label: string;
}

export interface GenerationStep {
  id: string;
  label: string;
  status: "pending" | "in_progress" | "completed";
}
