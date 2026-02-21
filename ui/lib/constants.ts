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
  { id: "v1", title: "Highlight Reel", thumbnailColor: "#E8553D", label: "Generated Video 1" },
  { id: "v2", title: "Full Commentary", thumbnailColor: "#1A1A1A", label: "Generated Video 2" },
  { id: "v3", title: "Short Clip", thumbnailColor: "#4A6741", label: "Generated Video 3" },
];
