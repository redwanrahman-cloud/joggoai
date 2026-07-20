import { describe, expect, it } from "vitest";
import { createDemoRepository } from "../../data/demo-repository";
import { getCriteriaFitPercentage, isNearMatch, rankCandidates } from "./match-engine";

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

  it("surfaces only safe same-profession alternatives as near matches", () => {
    const matches = rankCandidates(request!, repository);
    const outpatientNurse = matches.find(({ professional }) => professional.id === "pro-farhana-islam");
    const criticalCareNurse = matches.find(({ professional }) => professional.id === "pro-lamia-sultana");
    const expiredNurse = matches.find(({ professional }) => professional.id === "pro-samira-rahman");
    const doctor = matches.find(({ professional }) => professional.id === "pro-dr-ayesha-karim");

    expect(outpatientNurse).toBeDefined();
    expect(getCriteriaFitPercentage(outpatientNurse!)).toBe(80);
    expect(isNearMatch(request!, outpatientNurse!)).toBe(true);
    expect(getCriteriaFitPercentage(criticalCareNurse!)).toBe(80);
    expect(isNearMatch(request!, criticalCareNurse!)).toBe(true);
    expect(isNearMatch(request!, expiredNurse!)).toBe(false);
    expect(isNearMatch(request!, doctor!)).toBe(false);
  });

  it.each([
    ["request-doctor-evening", "pro-dr-ayesha-karim"],
    ["request-lab-day", "pro-tahmid-hasan"],
    ["request-physio-day", "pro-sabiha-noor"],
    ["request-caregiver-night", "pro-rokeya-begum"],
  ])("provides a trusted match and transparent exclusion for %s", (requestId, expectedProfessionalId) => {
    const scenarioRequest = repository.getStaffingRequest(requestId);
    expect(scenarioRequest).toBeDefined();
    const matches = rankCandidates(scenarioRequest!, repository);
    expect(matches.find((match) => match.eligible)?.professional.id).toBe(expectedProfessionalId);
    expect(matches.some((match) => !match.eligible && match.hardConstraintFailures.length > 0)).toBe(true);
  });

  it("treats equivalent ISO timestamps as the same shift boundary", () => {
    const physioRequest = repository.getStaffingRequest("request-physio-day")!;
    const modelFormattedRequest = {
      ...physioRequest,
      requirement: {
        ...physioRequest.requirement,
        startsAt: "2026-07-20T04:00:00Z",
        endsAt: "2026-07-20T10:00:00Z",
      },
    };

    const sabiha = rankCandidates(modelFormattedRequest, repository).find(
      ({ professional }) => professional.id === "pro-sabiha-noor",
    );
    expect(sabiha?.eligible).toBe(true);
    expect(sabiha?.hardConstraintFailures).not.toContain("Availability does not cover the full confirmed shift.");
  });

  it.each([
    ["request-icu-night", "registered_nurse"],
    ["request-doctor-evening", "general_practitioner"],
    ["request-lab-day", "medical_technologist"],
    ["request-physio-day", "physiotherapist"],
    ["request-caregiver-night", "caregiver"],
  ] as const)("provides at least three safe, comparable near matches for %s", (requestId, profession) => {
    const scenarioRequest = repository.getStaffingRequest(requestId)!;
    const nearMatches = rankCandidates(scenarioRequest, repository).filter((match) => isNearMatch(scenarioRequest, match));

    expect(nearMatches.length).toBeGreaterThanOrEqual(3);
    expect(nearMatches.every((match) => match.professional.profession === profession)).toBe(true);
    expect(nearMatches.every((match) => match.registration?.status === "platform_verified")).toBe(true);
    expect(nearMatches.every((match) => match.hardConstraintFailures.length > 0)).toBe(true);
  });
});
