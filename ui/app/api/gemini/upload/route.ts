import { NextResponse } from "next/server";
import { uploadFileToGemini } from "@/lib/server/gemini";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Missing video file" }, { status: 400 });
    }

    const uploaded = await uploadFileToGemini(file);
    return NextResponse.json({
      ...uploaded,
      originalName: file.name,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
