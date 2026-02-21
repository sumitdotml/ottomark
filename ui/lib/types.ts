export interface Character {
  id: string;
  nickname: string;
  imageUrl: string | null;
  voiceWeight: number;
  personality: "sarcastic" | "funny" | "rude" | "chill";
  voiceSample: string;
  profileMarkdown?: string;
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

export interface UploadedVideoRef {
  fileName: string;
  fileUri: string;
  mimeType: string;
  originalName: string;
}

export interface VideoDetailsResult {
  draftOutput: string;
  modelUsed: string;
}

export interface ScriptGenerationResult {
  script: string;
  modelUsed: string;
  repaired: boolean;
}
