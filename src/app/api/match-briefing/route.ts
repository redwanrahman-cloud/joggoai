import { NextResponse } from "next/server";
import { createDemoRepository } from "../../../data/demo-repository";
import { rankCandidates } from "../../../features/matching/match-engine";
import { createFallbackBriefing, createLiveMatchBriefing } from "../../../features/matching/match-briefing";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as { requestId?: string } | null;
  if (!body?.requestId) return NextResponse.json({ error: "requestId is required" }, { status: 400 });
  const repository = createDemoRepository();
  const staffingRequest = repository.getStaffingRequest(body.requestId);
  if (!staffingRequest) return NextResponse.json({ error: "Staffing request not found" }, { status: 404 });
  const matches = rankCandidates(staffingRequest, repository);
  const apiKey = process.env.OPENAI_API_KEY;
  if (apiKey) {
    try { return NextResponse.json(await createLiveMatchBriefing(staffingRequest, matches, apiKey)); }
    catch (error) { console.warn(`[match-briefing] Live GPT-5.6 Sol briefing failed: ${error instanceof Error ? error.message : "Unknown error"}`); }
  }
  return NextResponse.json(createFallbackBriefing(staffingRequest, matches.filter((match) => match.eligible)));
}
