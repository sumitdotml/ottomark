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
  { id: "voice", label: "Giving the character a voice", duration: 1800 },
  { id: "assemble", label: "Putting it all together", duration: 1200 },
] as const;

export const GENERATION_STEPS: GenerationStep[] = STEP_DEFINITIONS.map(
  ({ id, label }) => ({ id, label, status: "pending" })
);

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));
const UPLOADED_VIDEO_KEY = "gamevoice-uploaded-video";

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
    `Voice sample: ${character.voiceSample}`,
    `Voice weight: ${character.voiceWeight}`,
  ];
  if (character.profileMarkdown?.trim()) {
    lines.push("");
    lines.push("Additional character notes (markdown):");
    lines.push(character.profileMarkdown.trim());
  }
  return lines.join("\n");
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

  onStepChange("voice", "in_progress");
  await delay(STEP_DEFINITIONS[2].duration);
  onStepChange("voice", "completed");

  onStepChange("assemble", "in_progress");
  await delay(STEP_DEFINITIONS[3].duration);
  onStepChange("assemble", "completed");

  // Keep prototype placeholders while backend media generation is pending.
  return PLACEHOLDER_VIDEOS;
}
