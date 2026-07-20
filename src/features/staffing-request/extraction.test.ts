import { describe, expect, it } from "vitest";
import { extractStaffingRequestFallback, normaliseExtractedSkills, validateStaffingRequestInput, validateStaffingRequirement } from "./extraction";

describe("staffing request extraction fallback", () => {
  it("extracts the scripted ICU-night request into reviewable requirements", () => {
    const result = extractStaffingRequestFallback(
      "Need a registered nurse in Dhanmondi tomorrow, ICU and BLS, up to BDT 350 per hour.",
    );

    expect(result.source).toBe("deterministic_fallback");
    expect(result.requirement.profession).toBe("registered_nurse");
    expect(result.requirement.requiredSkills).toEqual(["ICU", "BLS"]);
    expect(result.requirement.maxHourlyRateBdt).toBe(350);
    expect(validateStaffingRequirement(result.requirement)).toEqual([]);
  });

  it("surfaces review errors rather than accepting incomplete requirements", () => {
    const result = extractStaffingRequestFallback("Need help tomorrow");
    expect(validateStaffingRequirement(result.requirement)).toContain("Add at least one required skill.");
  });

  it.each([
    ["Need a doctor with general medicine and emergency assessment experience", "general_practitioner"],
    ["Need a medical technologist with phlebotomy and sample handling experience", "medical_technologist"],
    ["Need a physiotherapist with rehabilitation experience", "physiotherapist"],
    ["Need a caregiver with elder care and mobility assistance experience", "caregiver"],
  ])("recognises profession in: %s", (input, profession) => {
    expect(extractStaffingRequestFallback(input).requirement.profession).toBe(profession);
  });

  it("normalises model wording into the matching vocabulary", () => {
    expect(normaliseExtractedSkills(["ICU experience", "Basic Life Support experience", "blood collection"])).toEqual(["ICU", "BLS", "Phlebotomy"]);
  });

  it("rejects text that is not a usable staffing request", () => {
    expect(validateStaffingRequestInput("hi")).toMatch(/profession, location, shift/i);
    expect(validateStaffingRequestInput("Need coverage tomorrow in Dhanmondi with BLS")).toMatch(/healthcare profession/i);
    expect(validateStaffingRequestInput("Need a nurse tomorrow in Dhanmondi with BLS, BDT 350 per hour")).toBeNull();
  });
});
