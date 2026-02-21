import { NextResponse } from "next/server";
import {
  REFINER_MODEL_CANDIDATES,
  generateWithFallback,
  hasValidSrtBlock,
} from "@/lib/server/gemini";

export const runtime = "nodejs";

const REFINEMENT_PROMPT_TEMPLATE =
  "TODO: Add your script-refinement prompt here. character_name={{character_name}} character_profile={{character_profile}} draft_output={{draft_output}}";

function buildRefinementPrompt(input: {
  characterName: string;
  characterProfile: string;
  draftOutput: string;
}): string {
  return REFINEMENT_PROMPT_TEMPLATE.replace("{{character_name}}", input.characterName)
    .replace("{{character_profile}}", input.characterProfile)
    .replace("{{draft_output}}", input.draftOutput);
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

    const initial = await generateWithFallback(REFINER_MODEL_CANDIDATES, [
      {
        text: buildRefinementPrompt({
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
