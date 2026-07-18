import { describe, expect, it } from "vitest";
import { createDemoRepository } from "../../data/demo-repository";
import { reviewProfessionalCredentials } from "./credential-review";

describe("credential review", () => {
  const repository = createDemoRepository();

  it("keeps a reviewed registration separate from pending ICU evidence", () => {
    const professional = repository.getProfessional("pro-nusrat-jahan")!;
    const review = reviewProfessionalCredentials(professional, repository.listCredentials(professional.id));

    expect(review.status).toBe("ready_with_cautions");
    expect(review.reviewedEvidenceCount).toBe(1);
    expect(review.pendingEvidenceCount).toBe(1);
    expect(review.findings).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ severity: "pass", title: "Registration reviewed for the demo" }),
        expect.objectContaining({ severity: "caution", title: "ICU employment letter (fictional) awaits review" }),
      ]),
    );
  });

  it("blocks an expired registration", () => {
    const professional = repository.getProfessional("pro-samira-rahman")!;
    const review = reviewProfessionalCredentials(professional, repository.listCredentials(professional.id));

    expect(review.status).toBe("blocked");
    expect(review.findings).toContainEqual(
      expect.objectContaining({ severity: "block", title: "Professional registration is expired" }),
    );
  });
});

