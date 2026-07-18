import { describe, expect, it, vi } from "vitest";
import { extractStaffingRequestLive } from "./openai-extraction";

describe("GPT-5.6 staffing request extraction", () => {
  it("uses the Responses API with a strict schema and validates the result", async () => {
    const fetcher = vi.fn(async (_input: string | URL | Request, init?: RequestInit) => {
      const request = JSON.parse(String(init?.body));
      expect(request.model).toBe("gpt-5.6-sol");
      expect(request.reasoning.effort).toBe("low");
      expect(request.text.format.type).toBe("json_schema");
      expect(request.text.format.strict).toBe(true);
      expect(request.store).toBe(false);
      return new Response(JSON.stringify({ output: [{ type: "message", content: [{ type: "output_text", text: JSON.stringify({
        profession: "registered_nurse",
        area: "Dhanmondi",
        startsAt: "2026-07-20T14:00:00.000Z",
        endsAt: "2026-07-21T02:00:00.000Z",
        requiredSkills: ["ICU", "BLS"],
        requiredCredentialStatus: "platform_verified",
        maxHourlyRateBdt: 350,
        notes: "Overnight clinic coverage.",
        confidence: "high",
        warnings: [],
      }) }] }] }), { status: 200, headers: { "Content-Type": "application/json" } });
    });

    const result = await extractStaffingRequestLive("Need an ICU nurse.", "sk-test", fetcher as typeof fetch);
    expect(result.source).toBe("live_model");
    expect(result.requirement.requiredSkills).toEqual(["ICU", "BLS"]);
  });

  it("rejects an API failure without weakening the domain contract", async () => {
    const fetcher = vi.fn(async () => new Response("unavailable", { status: 503 }));
    await expect(extractStaffingRequestLive("Need a nurse.", "sk-test", fetcher as typeof fetch)).rejects.toThrow("503");
  });
});
