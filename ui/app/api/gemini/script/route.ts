import { NextResponse } from "next/server";
import {
  REFINER_MODEL_CANDIDATES,
  generateWithFallback,
  hasValidSrtBlock,
} from "@/lib/server/gemini";
import { loadPromptFile } from "@/lib/server/prompts";

export const runtime = "nodejs";

function buildRefinementPrompt(input: {
  template: string;
  characterName: string;
  characterProfile: string;
  draftOutput: string;
}): string {
  return input.template
    .replaceAll("{{character_name}}", input.characterName)
    .replaceAll("{character_name}", input.characterName)
    .replaceAll("{{character_profile}}", input.characterProfile)
    .replaceAll("{character_profile}", input.characterProfile)
    .replaceAll("{{draft_output}}", input.draftOutput)
    .replaceAll("{draft_output}", input.draftOutput);
}

function buildSrtRepairPrompt(currentScript: string): string {
  return [
    "The following output is missing valid SRT formatting.",
    "Return only corrected SRT subtitle blocks with valid timestamps.",
    currentScript,
  ].join("\n\n");
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      characterName?: string;
      characterProfile?: string;
      draftOutput?: string;
    };
    if (!body.characterName || !body.characterProfile || !body.draftOutput) {
      return NextResponse.json(
        { error: "Missing characterName, characterProfile, or draftOutput" },
        { status: 400 }
      );
    }
    const refinementPromptTemplate = await loadPromptFile(
      "script-refinement-prompt.md"
    );

    const initial = await generateWithFallback(REFINER_MODEL_CANDIDATES, [
      {
        text: buildRefinementPrompt({
          template: refinementPromptTemplate,
          characterName: body.characterName,
          characterProfile: body.characterProfile,
          draftOutput: body.draftOutput,
        }),
      },
    ]);

    let script = initial.text;
    let modelUsed = initial.modelUsed;
    let repaired = false;

    if (!hasValidSrtBlock(script)) {
      const repairedOutput = await generateWithFallback(REFINER_MODEL_CANDIDATES, [
        { text: buildSrtRepairPrompt(script) },
      ]);
      script = repairedOutput.text;
      modelUsed = `${modelUsed} -> ${repairedOutput.modelUsed} (SRT repair)`;
      repaired = true;
    }

    return NextResponse.json({ script, modelUsed, repaired });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Script generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
