import {
  GenerationStep,
  ScriptGenerationResult,
  UploadedVideoRef,
  VideoDetailsResult,
  VideoResult,
} from "./types";
import { PLACEHOLDER_VIDEOS } from "./constants";

const STEP_DEFINITIONS = [
  { id: "analyze", label: "Analyzing video", duration: 1500 },
  { id: "script", label: "Generating reel script", duration: 2000 },
  { id: "thumbnails", label: "Creating thumbnail art", duration: 4000 },
  { id: "voice", label: "Giving the character a voice", duration: 5000 },
  { id: "assemble", label: "Putting it all together", duration: 3000 },
] as const;

export const GENERATION_STEPS: GenerationStep[] = STEP_DEFINITIONS.map(
  ({ id, label }) => ({ id, label, status: "pending" })
);

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));
const UPLOADED_VIDEO_KEY = "gamevoice-uploaded-video";
const GAMEPLAY_BLOB_KEY = "gamevoice-gameplay-blob";

const CACHE_KEY = "gamevoice-results-session";

interface CachedResults {
  videos: VideoResult[];
  script: string;
}

export function getGenerationCache(): CachedResults | null {
  const raw = sessionStorage.getItem(CACHE_KEY);
  if (!raw) return null;
  return JSON.parse(raw) as CachedResults;
}

function saveGenerationCache(videos: VideoResult[], script: string) {
  sessionStorage.setItem(CACHE_KEY, JSON.stringify({ videos, script }));
}

export function hasGeneratedResults(): boolean {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(CACHE_KEY) !== null;
}

export function clearGenerationCache(): void {
  sessionStorage.removeItem(CACHE_KEY);
}

async function postJson<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const message = await res.text();
    throw new Error(message || `Request failed: ${res.status}`);
  }
  return (await res.json()) as T;
}

export async function uploadGameplay(file: File): Promise<UploadedVideoRef> {
  const blobUrl = URL.createObjectURL(file);
  sessionStorage.setItem(GAMEPLAY_BLOB_KEY, blobUrl);

  const form = new FormData();
  form.append("file", file);

  const res = await fetch("/api/gemini/upload", {
    method: "POST",
    body: form,
  });
  if (!res.ok) {
    const message = await res.text();
    throw new Error(message || "Failed to upload gameplay video");
  }
  const uploaded = (await res.json()) as UploadedVideoRef;
  sessionStorage.setItem(UPLOADED_VIDEO_KEY, JSON.stringify(uploaded));
  return uploaded;
}

function getUploadedVideo(): UploadedVideoRef {
  const raw = sessionStorage.getItem(UPLOADED_VIDEO_KEY);
  if (!raw) throw new Error("No uploaded video found. Please upload again.");
  return JSON.parse(raw) as UploadedVideoRef;
}

export async function generateCommentary({
  onStepChange,
}: {
  onStepChange: (stepId: string, status: "in_progress" | "completed") => void;
}): Promise<VideoResult[]> {
  const uploadedVideo = getUploadedVideo();
  const TARGET_TOTAL_MS = 28000;
  const startTime = Date.now();

  const characterProfile = [
    "Two commentators providing gameplay commentary:",
    "- Puck: Upbeat, energetic, hype, fast-paced. Brings high energy and excitement.",
    "- Algenib: Gravelly, intense, deep, dramatic. Brings gravitas and analysis.",
  ].join("\n");

  onStepChange("analyze", "in_progress");
  const analysis = await postJson<VideoDetailsResult>("/api/gemini/analyze", {
    fileUri: uploadedVideo.fileUri,
    mimeType: uploadedVideo.mimeType,
  });
  onStepChange("analyze", "completed");

  onStepChange("script", "in_progress");
  const [scriptResult] = await Promise.all([
    postJson<ScriptGenerationResult>("/api/gemini/script", {
      characterName: "Puck & Algenib",
      characterProfile,
      draftOutput: analysis.draftOutput,
    }),
    delay(3000),
  ]);
  onStepChange("script", "completed");
  sessionStorage.setItem("gamevoice-last-script", scriptResult.script);

  const elapsed = Date.now() - startTime;
  const remaining = Math.max(TARGET_TOTAL_MS - elapsed, 9000);
  const fakeDurations = [
    Math.round(remaining * 0.40),
    Math.round(remaining * 0.35),
    Math.round(remaining * 0.25),
  ];

  onStepChange("thumbnails", "in_progress");
  await delay(fakeDurations[0]);
  onStepChange("thumbnails", "completed");

  onStepChange("voice", "in_progress");
  await delay(fakeDurations[1]);
  onStepChange("voice", "completed");

  onStepChange("assemble", "in_progress");
  await delay(fakeDurations[2]);
  onStepChange("assemble", "completed");

  const videos = PLACEHOLDER_VIDEOS.map((placeholder) => ({ ...placeholder }));

  saveGenerationCache(videos, scriptResult.script);
  return videos;
}
