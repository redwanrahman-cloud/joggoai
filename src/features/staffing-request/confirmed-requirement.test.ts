import { describe, expect, it } from "vitest";
import { createDemoRepository } from "../../data/demo-repository";
import { applyConfirmedRequirement, decodeConfirmedRequirement, encodeConfirmedRequirement, withConfirmedRequirement } from "./confirmed-requirement";

describe("confirmed requirement continuity", () => {
  it("round-trips reviewed requirements and applies them to the seeded request shell", () => {
    const base = createDemoRepository().getStaffingRequest("request-icu-night")!;
    const changed = { ...base.requirement, area: "Mirpur", maxHourlyRateBdt: 425, requiredSkills: ["BLS"] };
    const encoded = encodeConfirmedRequirement(changed);

    expect(decodeConfirmedRequirement(encoded)).toEqual(changed);
    expect(applyConfirmedRequirement(base, encoded).requirement).toEqual(changed);
    expect(withConfirmedRequirement("/matches?view=top", encoded)).toContain("&requirement=");
  });

  it("ignores malformed or invalid requirement state", () => {
    const base = createDemoRepository().getStaffingRequest("request-icu-night")!;
    expect(decodeConfirmedRequirement("not-json")).toBeNull();
    expect(applyConfirmedRequirement(base, JSON.stringify({ ...base.requirement, requiredSkills: [] }))).toEqual(base);
  });
});
