import { NextResponse } from "next/server";
import { extractStaffingRequestFallback } from "../../../../features/staffing-request/extraction";
import { extractStaffingRequestLive } from "../../../../features/staffing-request/openai-extraction";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as { input?: unknown } | null;
  const input = typeof body?.input === "string" ? body.input.trim() : "";
  if (!input || input.length > 2_000) {
    return NextResponse.json({ error: "Provide a staffing request between 1 and 2,000 characters." }, { status: 400 });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (apiKey) {
    try {
      return NextResponse.json(await extractStaffingRequestLive(input, apiKey));
    } catch (error) {
      console.error(
        "[staffing-request] Live GPT-5.6 Sol extraction failed:",
        error instanceof Error ? error.message : "Unknown OpenAI gateway error.",
      );
      const fallback = extractStaffingRequestFallback(input);
      return NextResponse.json({
        ...fallback,
        warnings: ["Live GPT-5.6 Sol was unavailable; the disclosed deterministic fallback was used.", ...fallback.warnings],
      });
    }
  }

  return NextResponse.json(extractStaffingRequestFallback(input));
}
