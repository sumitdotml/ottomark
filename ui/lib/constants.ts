import { VideoResult } from "./types";

export const PERSONALITY_OPTIONS = ["sarcastic", "funny", "rude", "chill"] as const;

export const VOICE_SAMPLES = [
  { id: "deep", label: "Deep & Gravelly" },
  { id: "smooth", label: "Smooth & Clean" },
  { id: "energetic", label: "High Energy" },
  { id: "laid-back", label: "Laid Back" },
];

export const PLACEHOLDER_VIDEOS: VideoResult[] = [
  { id: "v1", title: "Highlight Reel", thumbnailColor: "#E8553D", label: "Generated Video 1" },
  { id: "v2", title: "Full Commentary", thumbnailColor: "#1A1A1A", label: "Generated Video 2" },
  { id: "v3", title: "Short Clip", thumbnailColor: "#4A6741", label: "Generated Video 3" },
];
