import { describe, expect, it, vi } from "vitest";
import { createDemoRepository } from "../../data/demo-repository";
import { rankCandidates } from "./match-engine";
import { createFallbackBriefing, createLiveMatchBriefing } from "./match-briefing";

describe("evidence-grounded match briefing", () => {
  const repository = createDemoRepository();
  const request = repository.getStaffingRequest("request-physio-day")!;
  const matches = rankCandidates(request, repository);

  it("creates a safe deterministic briefing without changing eligibility", () => {
    const briefing = createFallbackBriefing(request, matches.filter((match) => match.eligible));
    expect(briefing.recommendationSummary).toContain("Sabiha Noor");
    expect(briefing.decisionBoundary).toMatch(/person.*final staffing decision/i);
    expect(briefing.source).toBe("deterministic_fallback");
  });

  it("sends only deterministic match evidence and accepts strict structured output", async () => {
    const fetcher = vi.fn().mockResolvedValue(new Response(JSON.stringify({ output: [{ type: "message", content: [{ type: "output_text", text: JSON.stringify({ recommendationSummary: "Sabiha passed every hard requirement.", verificationPriorities: ["Check original registration.", "Reconfirm shift terms."], decisionBoundary: "A person makes the final decision." }) }] }] }), { status: 200 }));
    const briefing = await createLiveMatchBriefing(request, matches, "sk-test", fetcher as typeof fetch);
    expect(briefing.source).toBe("live_model");
    expect(briefing.verificationPriorities).toHaveLength(2);
    const body = JSON.parse(fetcher.mock.calls[0][1].body as string);
    expect(body.model).toBe("gpt-5.6-sol");
    expect(body.instructions).toMatch(/Never change eligibility/i);
  });
});
