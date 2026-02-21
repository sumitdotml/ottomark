import { VideoResult } from "./types";

export const PERSONALITY_OPTIONS = ["sarcastic", "funny", "rude", "chill"] as const;

export const VOICE_OPTIONS = [
  { id: "upbeat", label: "Upbeat", geminiVoice: "Puck" },
  { id: "gravelly", label: "Gravelly", geminiVoice: "Algenib" },
  { id: "smooth", label: "Smooth", geminiVoice: "Algieba" },
  { id: "casual", label: "Casual", geminiVoice: "Zubenelgenubi" },
  { id: "warm", label: "Warm", geminiVoice: "Sulafat" },
] as const;

export const PRESET_CHARACTERS = [
  {
    id: "puck",
    name: "Puck",
    voiceStyle: "Upbeat",
    geminiVoice: "Puck",
    tags: ["Energetic", "Hype", "Fast-paced"],
    video: "/videos/puck.mp4",
    image: "/videos/algenib.jpeg",
    color: "#E8553D",
  },
  {
    id: "algenib",
    name: "Algenib",
    voiceStyle: "Gravelly",
    geminiVoice: "Algenib",
    tags: ["Intense", "Deep", "Sarcastic"],
    video: "/videos/algenib.mp4",
    image: "/videos/puck.jpeg",
    color: "#1A1A1A",
  },
] as const;

export const PLACEHOLDER_VIDEOS: VideoResult[] = [
  { id: "v1", title: "Puck Cut", thumbnailColor: "#E8553D", label: "Puck Cut", videoUrl: "/videos/reel-1.mov" },
  { id: "v2", title: "Algenib Cut", thumbnailColor: "#1A1A1A", label: "Algenib Cut", videoUrl: "/videos/reel-2.mov" },
  { id: "v3", title: "Remix", thumbnailColor: "#4A6741", label: "Remix", videoUrl: "/videos/reel-1.mov" },
];
