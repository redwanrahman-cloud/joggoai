import type { DemoRepository } from "../../data/demo-repository";
import type { ProfessionalProfile, StaffingRequest } from "../../domain/types";
import { evaluateCandidate } from "../matching/match-engine";

export const SCOPE_ADJUSTMENT_KEY = "scope-revised";

export interface ScopeAdjustmentProposal {
  originalRequest: StaffingRequest;
  revisedRequest: StaffingRequest;
  removedSkills: string[];
  version: 2;
  auditNote: string;
}

function normalise(value: string) {
  return value.trim().toLowerCase();
}

export function createScopeAdjustment(
  request: StaffingRequest,
  professional: ProfessionalProfile,
  repository: DemoRepository,
): ScopeAdjustmentProposal {
  const originalMatch = evaluateCandidate(request, professional, repository);
  const nonNegotiableFailures = originalMatch.hardConstraintFailures.filter(
    (failure) => !failure.startsWith("Missing required skills:"),
  );

  if (originalMatch.eligible || nonNegotiableFailures.length > 0) {
    throw new Error("This candidate does not qualify for a scope-only adjustment.");
  }

  const removedSkills = request.requirement.requiredSkills.filter(
    (required) => !professional.skills.some((skill) => normalise(skill) === normalise(required)),
  );
  if (removedSkills.length === 0) throw new Error("No missing skills are available to remove from scope.");

  const retainedSkills = request.requirement.requiredSkills.filter(
    (skill) => !removedSkills.some((removed) => normalise(removed) === normalise(skill)),
  );
  const auditNote = `The amended assignment removes ${removedSkills.join(", ")} from the confirmed scope. The professional must not perform the removed duties.`;
  const revisedRequest: StaffingRequest = {
    ...request,
    requirement: {
      ...request.requirement,
      requiredSkills: retainedSkills,
      notes: [request.requirement.notes, auditNote].filter(Boolean).join(" "),
    },
  };

  const revisedMatch = evaluateCandidate(revisedRequest, professional, repository);
  if (!revisedMatch.eligible) throw new Error("The revised scope does not resolve every eligibility gap.");

  return { originalRequest: request, revisedRequest, removedSkills, version: 2, auditNote };
}

export function resolveEffectiveRequest(
  request: StaffingRequest,
  professional: ProfessionalProfile,
  repository: DemoRepository,
  adjustment?: string,
) {
  return adjustment === SCOPE_ADJUSTMENT_KEY
    ? createScopeAdjustment(request, professional, repository).revisedRequest
    : request;
}
