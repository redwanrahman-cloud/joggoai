import { describe, expect, it } from "vitest";
import { extractStaffingRequestFallback, validateStaffingRequirement } from "./extraction";

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
});

