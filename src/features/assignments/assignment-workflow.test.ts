import { describe, expect, it } from "vitest";
import { createDemoRepository } from "../../data/demo-repository";
import { resolveEffectiveRequest, SCOPE_ADJUSTMENT_KEY } from "../adjustments/scope-adjustment";
import { acceptInvitation, prepareInvitation, tryPrepareInvitation } from "./assignment-workflow";

const repository = createDemoRepository();
const request = repository.getStaffingRequest("request-icu-night")!;
const organisation = repository.getOrganisation(request.organisationId)!;

describe("assignment workflow", () => {
  it("creates a pending invitation only for the eligible candidate", () => {
    const professional = repository.getProfessional("pro-nusrat-jahan")!;
    const preview = prepareInvitation(
      request,
      organisation,
      professional,
      repository,
    );

    expect(preview.invitation.status).toBe("pending");
    expect(preview.totalHours).toBe(12);
    expect(preview.estimatedTotalBdt).toBe(3840);
  });

  it("refuses to invite a candidate who failed hard constraints", () => {
    const professional = repository.getProfessional("pro-samira-rahman")!;
    expect(() => prepareInvitation(
      request,
      organisation,
      professional,
      repository,
    )).toThrow(/Cannot invite an ineligible professional/);
    expect(tryPrepareInvitation(
      request,
      organisation,
      professional,
      repository,
    )).toBeNull();
  });

  it("creates a confirmed assignment only after acceptance", () => {
    const professional = repository.getProfessional("pro-nusrat-jahan")!;
    const preview = prepareInvitation(
      request,
      organisation,
      professional,
      repository,
    );
    const brief = acceptInvitation(preview);

    expect(brief.invitation.status).toBe("accepted");
    expect(brief.invitation.respondedAt).toBeTruthy();
    expect(brief.assignment.status).toBe("confirmed");
    expect(brief.assignment.invitationId).toBe(brief.invitation.id);
  });

  it("prepares an invitation for a lab near match after an amended assignment is confirmed", () => {
    const labRequest = repository.getStaffingRequest("request-lab-day")!;
    const labOrganisation = repository.getOrganisation(labRequest.organisationId)!;
    const professional = repository.getProfessional("pro-adnan-rahim")!;
    const amendedRequest = resolveEffectiveRequest(
      labRequest,
      professional,
      repository,
      SCOPE_ADJUSTMENT_KEY,
    );

    const preview = prepareInvitation(
      amendedRequest,
      labOrganisation,
      professional,
      repository,
    );

    expect(preview.invitation.status).toBe("pending");
    expect(preview.request.requirement.requiredSkills).toEqual(["Sample handling"]);
  });
});
