import { NextResponse } from "next/server";

export const runtime = "nodejs";

const GEMINI_API_BASE = "https://generativelanguage.googleapis.com";
const IMAGE_MODEL = "gemini-2.0-flash-preview-image-generation";

const STYLE_PROMPTS: Record<string, string> = {
  cinematic:
    "Create a dramatic cinematic thumbnail for a gaming commentary video. Dramatic lighting, deep shadows, cinematic render. Vertical 9:16 format.",
  comic:
    "Create a bold comic book illustration thumbnail for a gaming commentary video. Halftone textures, vibrant colors, dynamic action poses. Vertical 9:16 format.",
  neon:
    "Create a cyberpunk neon glow thumbnail for a gaming commentary video. Synthwave aesthetic, dark background, glowing neon outlines. Vertical 9:16 format.",
};

interface ImageGenerateResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
        inline_data?: { mime_type: string; data: string };
      }>;
    };
  }>;
}

export async function POST(req: Request) {
  try {
    const { analysisText, style } = (await req.json()) as {
      analysisText?: string;
      style?: string;
    };

    if (!style || !STYLE_PROMPTS[style]) {
      return NextResponse.json(
        { error: "Invalid style. Use: cinematic, comic, or neon" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Missing GEMINI_API_KEY" }, { status: 500 });
    }

    const context = analysisText ? analysisText.slice(0, 500) : "an exciting gameplay moment";
    const prompt = `${STYLE_PROMPTS[style]} Context from the gameplay: ${context}`;

    const res = await fetch(
      `${GEMINI_API_BASE}/v1beta/models/${IMAGE_MODEL}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseModalities: ["IMAGE", "TEXT"],
            imageDimension: "PORTRAIT_9_16",
          },
        }),
      }
    );

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Gemini image generation failed (${res.status}): ${text}`);
    }

    const data = (await res.json()) as ImageGenerateResponse;
    const parts = data.candidates?.[0]?.content?.parts;
    const imagePart = parts?.find((p) => p.inline_data);

    if (!imagePart?.inline_data) {
      throw new Error("Gemini response contained no image output");
    }

    return NextResponse.json({
      imageBase64: imagePart.inline_data.data,
      mimeType: imagePart.inline_data.mime_type,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Thumbnail generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
