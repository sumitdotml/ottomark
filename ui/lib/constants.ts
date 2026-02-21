import { VideoResult } from "./types";

export const PERSONALITY_OPTIONS = ["sarcastic", "funny", "rude", "chill"] as const;

export const VOICE_OPTIONS = [
  { id: "upbeat", label: "Upbeat", geminiVoice: "Puck" },
  { id: "gravelly", label: "Gravelly", geminiVoice: "Algenib" },
  { id: "smooth", label: "Smooth", geminiVoice: "Algieba" },
  { id: "casual", label: "Casual", geminiVoice: "Zubenelgenubi" },
  { id: "warm", label: "Warm", geminiVoice: "Sulafat" },
] as const;

export const PLACEHOLDER_VIDEOS: VideoResult[] = [
  { id: "v1", title: "Sample 1", thumbnailColor: "#E8553D", label: "Sample 1" },
  { id: "v2", title: "Sample 2", thumbnailColor: "#1A1A1A", label: "Sample 2" },
  { id: "v3", title: "Sample 3", thumbnailColor: "#4A6741", label: "Sample 3" },
];
