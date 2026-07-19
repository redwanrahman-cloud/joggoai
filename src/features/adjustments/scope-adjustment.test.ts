import { describe, expect, it } from "vitest";
import { createDemoRepository } from "../../data/demo-repository";
import { evaluateCandidate } from "../matching/match-engine";
import { createScopeAdjustment } from "./scope-adjustment";

describe("scope adjustment", () => {
  it("creates an eligible v2 request by explicitly removing unsupported duties", () => {
    const repository = createDemoRepository();
    const request = repository.getStaffingRequest("request-lab-day")!;
    const professional = repository.getProfessional("pro-mehnaz-akter")!;

    const proposal = createScopeAdjustment(request, professional, repository);

    expect(proposal.removedSkills).toEqual(["Phlebotomy"]);
    expect(proposal.originalRequest.requirement.requiredSkills).toContain("Phlebotomy");
    expect(proposal.revisedRequest.requirement.requiredSkills).toEqual(["Sample handling"]);
    expect(evaluateCandidate(proposal.revisedRequest, professional, repository).eligible).toBe(true);
  });

  it("does not negotiate profession or registration failures", () => {
    const repository = createDemoRepository();
    const request = repository.getStaffingRequest("request-lab-day")!;
    const professional = repository.getProfessional("pro-dr-ayesha-karim")!;

    expect(() => createScopeAdjustment(request, professional, repository)).toThrow(
      "does not qualify for a scope-only adjustment",
    );
  });
});
