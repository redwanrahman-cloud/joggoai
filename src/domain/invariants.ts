import type { DemoDataSet } from "./types";

const ISO_DATE_TIME = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/;

export function validateDemoData(data: DemoDataSet): string[] {
  const errors: string[] = [];
  const ids = new Set<string>();

  const collections = [
    data.organisations,
    data.professionals,
    data.credentials,
    data.availability,
    data.staffingRequests,
    data.matchEvaluations,
    data.invitations,
    data.assignments,
    data.aiRunAudits,
  ];

  for (const collection of collections) {
    for (const entity of collection) {
      if (ids.has(entity.id)) errors.push(`Duplicate entity id: ${entity.id}`);
      ids.add(entity.id);
    }
  }

  const professionalIds = new Set(data.professionals.map(({ id }) => id));
  const organisationIds = new Set(data.organisations.map(({ id }) => id));
  const requestIds = new Set(data.staffingRequests.map(({ id }) => id));
  const invitationIds = new Set(data.invitations.map(({ id }) => id));

  for (const professional of data.professionals) {
    if (professional.reliabilityScore < 0 || professional.reliabilityScore > 100) {
      errors.push(`Invalid reliability score: ${professional.id}`);
    }
    if (professional.expectedHourlyRateBdt <= 0) {
      errors.push(`Invalid hourly rate: ${professional.id}`);
    }
  }

  for (const credential of data.credentials) {
    if (!professionalIds.has(credential.professionalId)) {
      errors.push(`Credential references missing professional: ${credential.id}`);
    }
    if (credential.status === "platform_verified" && credential.source !== "manual_demo_review") {
      errors.push(`Verified credential lacks demo review evidence: ${credential.id}`);
    }
  }

  for (const window of data.availability) {
    if (!professionalIds.has(window.professionalId)) {
      errors.push(`Availability references missing professional: ${window.id}`);
    }
    if (!ISO_DATE_TIME.test(window.startsAt) || !ISO_DATE_TIME.test(window.endsAt)) {
      errors.push(`Availability is not UTC ISO format: ${window.id}`);
    }
    if (window.startsAt >= window.endsAt) errors.push(`Availability has invalid range: ${window.id}`);
  }

  for (const request of data.staffingRequests) {
    if (!organisationIds.has(request.organisationId)) {
      errors.push(`Request references missing organisation: ${request.id}`);
    }
    if (request.requirement.startsAt >= request.requirement.endsAt) {
      errors.push(`Request has invalid shift range: ${request.id}`);
    }
  }

  for (const evaluation of data.matchEvaluations) {
    if (!requestIds.has(evaluation.staffingRequestId) || !professionalIds.has(evaluation.professionalId)) {
      errors.push(`Match evaluation contains a missing reference: ${evaluation.id}`);
    }
    if (evaluation.eligible && evaluation.hardConstraintFailures.length > 0) {
      errors.push(`Eligible match contains hard failures: ${evaluation.id}`);
    }
    if (evaluation.score < 0 || evaluation.score > 100) {
      errors.push(`Match score is outside 0-100: ${evaluation.id}`);
    }
  }

  for (const invitation of data.invitations) {
    if (!requestIds.has(invitation.staffingRequestId) || !professionalIds.has(invitation.professionalId)) {
      errors.push(`Invitation contains a missing reference: ${invitation.id}`);
    }
  }

  for (const assignment of data.assignments) {
    if (
      !invitationIds.has(assignment.invitationId) ||
      !requestIds.has(assignment.staffingRequestId) ||
      !organisationIds.has(assignment.organisationId) ||
      !professionalIds.has(assignment.professionalId)
    ) {
      errors.push(`Assignment contains a missing reference: ${assignment.id}`);
    }
  }

  return errors;
}

