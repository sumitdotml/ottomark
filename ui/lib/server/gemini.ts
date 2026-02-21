const GEMINI_API_BASE = "https://generativelanguage.googleapis.com";

export const DRAFT_MODEL = "gemini-3-flash-preview";
export const REFINER_MODEL_CANDIDATES = [
  "gemini-3.1-pro",
  "gemini-3-pro",
  "gemini-2.5-pro",
] as const;

interface GeneratePart {
  text?: string;
  file_data?: {
    mime_type: string;
    file_uri: string;
  };
}

interface GenerateContentResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>;
    };
  }>;
}

function getApiKey(): string {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    throw new Error("Missing GEMINI_API_KEY");
  }
  return key;
}

export async function uploadFileToGemini(file: File): Promise<{
  fileName: string;
  fileUri: string;
  mimeType: string;
}> {
  const apiKey = getApiKey();
  const startRes = await fetch(`${GEMINI_API_BASE}/upload/v1beta/files?key=${apiKey}`, {
    method: "POST",
    headers: {
      "X-Goog-Upload-Protocol": "resumable",
      "X-Goog-Upload-Command": "start",
      "X-Goog-Upload-Header-Content-Length": String(file.size),
      "X-Goog-Upload-Header-Content-Type": file.type || "application/octet-stream",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      file: {
        display_name: file.name,
      },
    }),
  });
  if (!startRes.ok) {
    throw new Error(`Gemini upload init failed (${startRes.status})`);
  }

  const uploadUrl = startRes.headers.get("x-goog-upload-url");
  if (!uploadUrl) {
    throw new Error("Gemini upload init missing upload URL");
  }

  const uploadRes = await fetch(uploadUrl, {
    method: "POST",
    headers: {
      "X-Goog-Upload-Offset": "0",
      "X-Goog-Upload-Command": "upload, finalize",
      "Content-Type": file.type || "application/octet-stream",
    },
    body: Buffer.from(await file.arrayBuffer()),
  });
  if (!uploadRes.ok) {
    throw new Error(`Gemini upload finalize failed (${uploadRes.status})`);
  }

  const payload = (await uploadRes.json()) as {
    file?: { name?: string; uri?: string; mimeType?: string; mime_type?: string };
  };
  const uploaded = payload.file;
  const fileName = uploaded?.name;
  const fileUri = uploaded?.uri;
  const mimeType = uploaded?.mimeType ?? uploaded?.mime_type;
  if (!fileName || !fileUri || !mimeType) {
    throw new Error("Gemini upload response missing file metadata");
  }

  return { fileName, fileUri, mimeType };
}

export async function generateTextWithModel(model: string, parts: GeneratePart[]): Promise<string> {
  const apiKey = getApiKey();
  const res = await fetch(
    `${GEMINI_API_BASE}/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts }],
      }),
    }
  );
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Gemini generateContent failed (${res.status}): ${text}`);
  }

  const data = (await res.json()) as GenerateContentResponse;
  const text = data.candidates?.[0]?.content?.parts?.map((p) => p.text ?? "").join("").trim();
  if (!text) {
    throw new Error("Gemini response contained no text output");
  }
  return text;
}

export async function generateWithFallback(
  modelCandidates: readonly string[],
  parts: GeneratePart[]
): Promise<{ modelUsed: string; text: string }> {
  const errors: string[] = [];
  for (const modelName of modelCandidates) {
    try {
      const text = await generateTextWithModel(modelName, parts);
      return { modelUsed: modelName, text };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      errors.push(`${modelName}: ${message}`);
    }
  }
  throw new Error(
    "Failed to generate output with any Pro model candidate:\n" + errors.join("\n")
  );
}

export function hasValidSrtBlock(text: string): boolean {
  const srtBlockPattern = new RegExp(
    String.raw`^\d+\n` +
      String.raw`\d{2}:\d{2}:\d{2},\d{3}\s-->\s\d{2}:\d{2}:\d{2},\d{3}\n` +
      String.raw`.+\n?(?:\n|$)`,
    "m"
  );
  return srtBlockPattern.test(text);
}
