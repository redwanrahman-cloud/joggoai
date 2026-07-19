import { describe, expect, it } from "vitest";
import { analyseProfileFallback, demoResume } from "./profile-intake";

describe("professional profile intake", () => {
  it("organises a nurse resume without marking claims as verified", () => {
    const result = analyseProfileFallback(demoResume);
    expect(result.profile.profession).toBe("registered_nurse");
    expect(result.profile.skills).toContain("ICU");
    expect(result.evidenceChecklist.every((item) => item.status !== "provided")).toBe(true);
    expect(result.warnings.join(" ")).toMatch(/not verified/i);
  });

  it("asks for registration evidence when it is absent", () => {
    const result = analyseProfileFallback("Registered nurse with 4 years of hospital experience and a nursing degree.");
    expect(result.evidenceChecklist.find((item) => item.label === "Professional registration")?.status).toBe("missing");
  });
});
