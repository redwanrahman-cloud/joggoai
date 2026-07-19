import { NextResponse } from "next/server";
import { analyseProfileFallback } from "../../../features/profile-intake/profile-intake";
import { analyseProfileLive } from "../../../features/profile-intake/openai-profile-intake";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as { input?: unknown } | null;
  const input = typeof body?.input === "string" ? body.input.trim() : "";
  if (input.length < 40 || input.length > 8_000) {
    return NextResponse.json({ error: "Provide resume text between 40 and 8,000 characters." }, { status: 400 });
  }
  const apiKey = process.env.OPENAI_API_KEY;
  if (apiKey) {
    try {
      return NextResponse.json(await analyseProfileLive(input, apiKey));
    } catch (error) {
      console.error("[profile-intake] Live profile analysis failed:", error instanceof Error ? error.message : "Unknown gateway error.");
    }
  }
  const fallback = analyseProfileFallback(input);
  fallback.warnings.unshift("Live GPT-5.6 Sol was unavailable; the disclosed deterministic demo fallback was used.");
  return NextResponse.json(fallback);
}
