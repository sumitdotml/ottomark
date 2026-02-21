import { GenerationStep, VideoResult } from "./types";
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

export async function generateCommentary({
  onStepChange,
}: {
  characterId: string;
  onStepChange: (stepId: string, status: "in_progress" | "completed") => void;
}): Promise<VideoResult[]> {
  for (const step of STEP_DEFINITIONS) {
    onStepChange(step.id, "in_progress");
    await delay(step.duration);
    onStepChange(step.id, "completed");
  }
  return PLACEHOLDER_VIDEOS;
}
