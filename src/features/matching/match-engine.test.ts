import { describe, expect, it } from "vitest";
import { createDemoRepository } from "../../data/demo-repository";
import { rankCandidates } from "./match-engine";

describe("deterministic candidate matching", () => {
  const repository = createDemoRepository();
  const request = repository.getStaffingRequest("request-icu-night");

  it("ranks the eligible ICU nurse first with transparent evidence", () => {
    expect(request).toBeDefined();
    const matches = rankCandidates(request!, repository);

    expect(matches[0]?.professional.id).toBe("pro-nusrat-jahan");
    expect(matches[0]?.eligible).toBe(true);
    expect(matches[0]?.score).toBe(94);
    expect(matches[0]?.hardConstraintFailures).toEqual([]);
    expect(matches[0]?.evidence).toContain("Required skills covered: ICU, BLS.");
  });

  it("never allows scoring to override an expired registration", () => {
    const matches = rankCandidates(request!, repository);
    const expiredCandidate = matches.find(({ professional }) => professional.id === "pro-samira-rahman");

    expect(expiredCandidate?.eligible).toBe(false);
    expect(expiredCandidate?.score).toBe(0);
    expect(expiredCandidate?.hardConstraintFailures).toContain(
      "Required professional registration is not platform verified.",
    );
  });

  it("excludes a candidate who lacks any required skill", () => {
    const matches = rankCandidates(request!, repository);
    const outpatientNurse = matches.find(({ professional }) => professional.id === "pro-farhana-islam");

    expect(outpatientNurse?.eligible).toBe(false);
    expect(outpatientNurse?.hardConstraintFailures).toContain("Missing required skills: ICU.");
  });
});

