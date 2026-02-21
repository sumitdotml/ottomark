import {
  Character,
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
  { id: "thumbnails", label: "Creating thumbnail art", duration: 3000 },
  { id: "voice", label: "Giving the character a voice", duration: 1800 },
  { id: "assemble", label: "Putting it all together", duration: 1200 },
] as const;

export const GENERATION_STEPS: GenerationStep[] = STEP_DEFINITIONS.map(
  ({ id, label }) => ({ id, label, status: "pending" })
);

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));
const UPLOADED_VIDEO_KEY = "gamevoice-uploaded-video";
const GAMEPLAY_BLOB_KEY = "gamevoice-gameplay-blob";

const THUMBNAIL_STYLES = ["cinematic", "comic", "neon"] as const;
const RESULTS_CACHE_PREFIX = "gamevoice-results-";

interface CachedResults {
  videos: VideoResult[];
  script: string;
}

export function getGenerationCache(characterId: string): CachedResults | null {
  const raw = sessionStorage.getItem(RESULTS_CACHE_PREFIX + characterId);
  if (!raw) return null;
  return JSON.parse(raw) as CachedResults;
}

function saveGenerationCache(characterId: string, videos: VideoResult[], script: string) {
  sessionStorage.setItem(
    RESULTS_CACHE_PREFIX + characterId,
    JSON.stringify({ videos, script })
  );
}

export function hasGeneratedResults(characterId: string): boolean {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(RESULTS_CACHE_PREFIX + characterId) !== null;
}

export function clearGenerationCache(characterId: string): void {
  sessionStorage.removeItem(RESULTS_CACHE_PREFIX + characterId);
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

function buildCharacterProfile(character: Character): string {
  const lines = [
    `Nickname: ${character.nickname}`,
    `Personality: ${character.personality}`,
    `Voice: ${character.voice}`,
  ];
  if (character.profileMarkdown?.trim()) {
    lines.push("");
    lines.push("Additional character notes (markdown):");
    lines.push(character.profileMarkdown.trim());
  }
  return lines.join("\n");
}

async function generateThumbnails(
  analysisText: string
): Promise<(string | null)[]> {
  const results = await Promise.allSettled(
    THUMBNAIL_STYLES.map((style) =>
      postJson<{ imageBase64: string; mimeType: string }>(
        "/api/gemini/thumbnail",
        { analysisText, style }
      )
    )
  );

  return results.map((r) => {
    if (r.status === "fulfilled") {
      return `data:${r.value.mimeType};base64,${r.value.imageBase64}`;
    }
    return null;
  });
}

export async function generateCommentary({
  characterId,
  character,
  onStepChange,
}: {
  characterId: string;
  character: Character;
  onStepChange: (stepId: string, status: "in_progress" | "completed") => void;
}): Promise<VideoResult[]> {
  const uploadedVideo = getUploadedVideo();
  const videoUrl = sessionStorage.getItem(GAMEPLAY_BLOB_KEY) || undefined;

  onStepChange("analyze", "in_progress");
  const analysis = await postJson<VideoDetailsResult>("/api/gemini/analyze", {
    fileUri: uploadedVideo.fileUri,
    mimeType: uploadedVideo.mimeType,
  });
  onStepChange("analyze", "completed");

  onStepChange("script", "in_progress");
  const scriptResult = await postJson<ScriptGenerationResult>("/api/gemini/script", {
    characterId,
    characterName: character.nickname,
    characterProfile: buildCharacterProfile(character),
    draftOutput: analysis.draftOutput,
  });
  onStepChange("script", "completed");
  sessionStorage.setItem("gamevoice-last-script", scriptResult.script);

  onStepChange("thumbnails", "in_progress");
  const thumbnails = await generateThumbnails(analysis.draftOutput);
  onStepChange("thumbnails", "completed");

  onStepChange("voice", "in_progress");
  await delay(STEP_DEFINITIONS[3].duration);
  onStepChange("voice", "completed");

  onStepChange("assemble", "in_progress");
  await delay(STEP_DEFINITIONS[4].duration);
  onStepChange("assemble", "completed");

  const videos = PLACEHOLDER_VIDEOS.map((placeholder, i) => ({
    ...placeholder,
    thumbnailUrl: thumbnails[i] ?? undefined,
    videoUrl,
  }));

  saveGenerationCache(characterId, videos, scriptResult.script);
  return videos;
}
