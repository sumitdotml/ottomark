export interface Character {
  id: string;
  nickname: string;
  imageUrl: string | null;
  voiceWeight: number;
  personality: "sarcastic" | "funny" | "rude" | "chill";
  voiceSample: string;
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
