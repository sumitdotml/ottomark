import { NextResponse } from "next/server";
import { DRAFT_MODEL, generateTextWithModel } from "@/lib/server/gemini";

export const runtime = "nodejs";

const VIDEO_DETAILS_PROMPT = "TODO: Add your video-details prompt here.";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { fileUri?: string; mimeType?: string };
    if (!body.fileUri || !body.mimeType) {
      return NextResponse.json(
        { error: "Missing fileUri or mimeType" },
        { status: 400 }
      );
    }

    const draftOutput = await generateTextWithModel(DRAFT_MODEL, [
      {
        file_data: {
          file_uri: body.fileUri,
          mime_type: body.mimeType,
        },
      },
      { text: VIDEO_DETAILS_PROMPT },
    ]);

    return NextResponse.json({
      draftOutput,
      modelUsed: DRAFT_MODEL,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Analysis failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
