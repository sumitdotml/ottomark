import { readFile } from "node:fs/promises";
import path from "node:path";

function promptPath(fileName: string): string {
  return path.join(process.cwd(), "prompts", fileName);
}

export async function loadPromptFile(fileName: string): Promise<string> {
  const raw = await readFile(promptPath(fileName), "utf-8");
  return raw.trim();
}
