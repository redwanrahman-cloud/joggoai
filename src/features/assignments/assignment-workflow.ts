import type {
  Assignment,
  Credential,
  Invitation,
  Organisation,
  ProfessionalProfile,
  StaffingRequest,
} from "../../domain/types";
import type { DemoRepository } from "../../data/demo-repository";
import { reviewProfessionalCredentials } from "../credentials/credential-review";
import { evaluateCandidate } from "../matching/match-engine";

export interface InvitationPreview {
  invitation: Invitation;
  organisation: Organisation;
  professional: ProfessionalProfile;
  request: StaffingRequest;
  totalHours: number;
  estimatedTotalBdt: number;
}

export interface AssignmentBrief extends InvitationPreview {
  assignment: Assignment;
  safetyNotes: string[];
}

export function prepareInvitation(
  request: StaffingRequest,
  organisation: Organisation,
  professional: ProfessionalProfile,
  repository: DemoRepository,
): InvitationPreview {
  const credentials: Credential[] = repository.listCredentials(professional.id);
  const match = evaluateCandidate(request, professional, repository);
  const credentialReview = reviewProfessionalCredentials(professional, credentials);

  if (!match.eligible) {
    throw new Error(`Cannot invite an ineligible professional: ${match.hardConstraintFailures.join(", ")}`);
  }
  if (credentialReview.status === "blocked") {
    throw new Error("Cannot invite a professional while credential review is blocked.");
  }

  const totalHours = (Date.parse(request.requirement.endsAt) - Date.parse(request.requirement.startsAt)) / 3_600_000;

  return {
    invitation: {
      id: `invitation-${request.id}-${professional.id}`,
      staffingRequestId: request.id,
      professionalId: professional.id,
      status: "pending",
      sentAt: "2026-07-19T09:15:00.000Z",
    },
    organisation,
    professional,
    request,
    totalHours,
    estimatedTotalBdt: totalHours * professional.expectedHourlyRateBdt,
  };
}

export function tryPrepareInvitation(
  request: StaffingRequest,
  organisation: Organisation,
  professional: ProfessionalProfile,
  repository: DemoRepository,
) {
  const credentials: Credential[] = repository.listCredentials(professional.id);
  const match = evaluateCandidate(request, professional, repository);
  const credentialReview = reviewProfessionalCredentials(professional, credentials);
  if (!match.eligible || credentialReview.status === "blocked") return null;

  const totalHours = (Date.parse(request.requirement.endsAt) - Date.parse(request.requirement.startsAt)) / 3_600_000;
  return {
    invitation: {
      id: `invitation-${request.id}-${professional.id}`,
      staffingRequestId: request.id,
      professionalId: professional.id,
      status: "pending" as const,
      sentAt: "2026-07-19T09:15:00.000Z",
    },
    organisation,
    professional,
    request,
    totalHours,
    estimatedTotalBdt: totalHours * professional.expectedHourlyRateBdt,
  };
}

export function acceptInvitation(preview: InvitationPreview): AssignmentBrief {
  const invitation: Invitation = {
    ...preview.invitation,
    status: "accepted",
    respondedAt: "2026-07-19T09:22:00.000Z",
  };

  return {
    ...preview,
    invitation,
    assignment: {
      id: `assignment-${preview.request.id}`,
      invitationId: invitation.id,
      staffingRequestId: preview.request.id,
      organisationId: preview.organisation.id,
      professionalId: preview.professional.id,
      startsAt: preview.request.requirement.startsAt,
      endsAt: preview.request.requirement.endsAt,
      hourlyRateBdt: preview.professional.expectedHourlyRateBdt,
      status: "confirmed",
    },
    safetyNotes: [
      "The clinic remains responsible for final identity and credential checks.",
      "No patient information is included in this staffing brief.",
      "Contact and attendance workflows are outside this competition prototype.",
    ],
  };
}
