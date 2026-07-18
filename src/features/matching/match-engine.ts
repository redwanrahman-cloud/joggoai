import type { DemoRepository } from "../../data/demo-repository";
import type { Credential, ProfessionalProfile, StaffingRequest } from "../../domain/types";

export interface CandidateMatch {
  professional: ProfessionalProfile;
  registration?: Credential;
  eligible: boolean;
  score: number;
  hardConstraintFailures: string[];
  evidence: string[];
  uncertainties: string[];
}

function normalise(value: string): string {
  return value.trim().toLowerCase();
}

export function evaluateCandidate(
  request: StaffingRequest,
  professional: ProfessionalProfile,
  repository: DemoRepository,
): CandidateMatch {
  const failures: string[] = [];
  const evidence: string[] = [];
  const uncertainties: string[] = [];
  const credentials = repository.listCredentials(professional.id);
  const registration = credentials.find(({ type }) => type === "professional_registration");
  const availability = repository.listAvailability(professional.id);

  if (professional.profession !== request.requirement.profession) {
    failures.push("Profession does not match the request.");
  } else {
    evidence.push("Profession matches the confirmed requirement.");
  }

  if (!registration || registration.status !== request.requirement.requiredCredentialStatus) {
    failures.push("Required professional registration is not platform verified.");
  } else {
    evidence.push("Professional registration is marked platform verified for this fictional demo.");
  }

  const missingSkills = request.requirement.requiredSkills.filter(
    (required) => !professional.skills.some((skill) => normalise(skill) === normalise(required)),
  );
  if (missingSkills.length > 0) {
    failures.push(`Missing required skills: ${missingSkills.join(", ")}.`);
  } else {
    evidence.push(`Required skills covered: ${request.requirement.requiredSkills.join(", ")}.`);
  }

  const coversShift = availability.some(
    (window) =>
      window.status === "available" &&
      window.startsAt <= request.requirement.startsAt &&
      window.endsAt >= request.requirement.endsAt,
  );
  if (!coversShift) failures.push("Availability does not cover the full confirmed shift.");
  else evidence.push("Availability covers the full confirmed shift.");

  if (professional.expectedHourlyRateBdt > request.requirement.maxHourlyRateBdt) {
    failures.push("Expected hourly rate exceeds the confirmed budget.");
  } else {
    evidence.push(`Expected rate is within budget at BDT ${professional.expectedHourlyRateBdt}/hour.`);
  }

  if (normalise(professional.area) !== normalise(request.requirement.area)) {
    uncertainties.push(`Based in ${professional.area}; travel time to ${request.requirement.area} is not verified.`);
  }

  const eligible = failures.length === 0;
  const score = eligible
    ? Math.min(
        100,
        Math.round(
          50 +
            professional.reliabilityScore * 0.25 +
            Math.min(professional.yearsExperience * 2, 10) +
            Math.min(professional.completedDemoAssignments, 10) +
            (normalise(professional.area) === normalise(request.requirement.area) ? 6 : 0),
        ),
      )
    : 0;

  return { professional, registration, eligible, score, hardConstraintFailures: failures, evidence, uncertainties };
}

export function rankCandidates(request: StaffingRequest, repository: DemoRepository): CandidateMatch[] {
  return repository
    .listProfessionals()
    .map((professional) => evaluateCandidate(request, professional, repository))
    .sort((left, right) => Number(right.eligible) - Number(left.eligible) || right.score - left.score);
}

