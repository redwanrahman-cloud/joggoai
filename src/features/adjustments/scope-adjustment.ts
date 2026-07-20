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

export function getScopeAdjustmentProposal(
  request: StaffingRequest,
  professional: ProfessionalProfile,
  repository: DemoRepository,
): ScopeAdjustmentProposal | null {
  const originalMatch = evaluateCandidate(request, professional, repository);
  const nonNegotiableFailures = originalMatch.hardConstraintFailures.filter(
    (failure) => !failure.startsWith("Missing required skills:"),
  );

  if (originalMatch.eligible || nonNegotiableFailures.length > 0) {
    return null;
  }

  const removedSkills = request.requirement.requiredSkills.filter(
    (required) => !professional.skills.some((skill) => normalise(skill) === normalise(required)),
  );
  if (removedSkills.length === 0) return null;

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
  if (!revisedMatch.eligible) return null;

  return { originalRequest: request, revisedRequest, removedSkills, version: 2, auditNote };
}

export function createScopeAdjustment(
  request: StaffingRequest,
  professional: ProfessionalProfile,
  repository: DemoRepository,
): ScopeAdjustmentProposal {
  const proposal = getScopeAdjustmentProposal(request, professional, repository);
  if (!proposal) throw new Error("This candidate does not qualify for a scope-only adjustment.");
  return proposal;
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

export function tryResolveEffectiveRequest(
  request: StaffingRequest,
  professional: ProfessionalProfile,
  repository: DemoRepository,
  adjustment?: string,
) {
  if (adjustment !== SCOPE_ADJUSTMENT_KEY) return request;
  return getScopeAdjustmentProposal(request, professional, repository)?.revisedRequest ?? null;
}
