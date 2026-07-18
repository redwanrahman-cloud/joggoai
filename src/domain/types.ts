export type EntityId = string;

export type Profession =
  | "general_practitioner"
  | "registered_nurse"
  | "medical_technologist"
  | "physiotherapist"
  | "caregiver";

export type CredentialStatus =
  | "platform_verified"
  | "uploaded_pending_review"
  | "self_declared"
  | "expired"
  | "missing";

export type VerificationSource =
  | "manual_demo_review"
  | "uploaded_document"
  | "profile_declaration"
  | "none";

export type StaffingRequestStatus =
  | "draft"
  | "requirements_confirmed"
  | "matching"
  | "shortlisted"
  | "invitation_sent"
  | "filled"
  | "cancelled";

export type InvitationStatus = "pending" | "accepted" | "declined" | "withdrawn";
export type AssignmentStatus = "confirmed" | "in_progress" | "completed" | "cancelled";

export interface Organisation {
  id: EntityId;
  name: string;
  type: "clinic" | "diagnostic_centre" | "hospital";
  area: string;
  city: "Dhaka";
  demoVerified: boolean;
}

export interface ProfessionalProfile {
  id: EntityId;
  displayName: string;
  profession: Profession;
  headline: string;
  area: string;
  city: "Dhaka";
  skills: string[];
  languages: string[];
  yearsExperience: number;
  expectedHourlyRateBdt: number;
  reliabilityScore: number;
  completedDemoAssignments: number;
}

export interface Credential {
  id: EntityId;
  professionalId: EntityId;
  type: "professional_registration" | "qualification" | "employment_record";
  title: string;
  issuingAuthority: string;
  referenceNumberMasked?: string;
  issuedOn?: string;
  expiresOn?: string;
  status: CredentialStatus;
  source: VerificationSource;
  reviewedOn?: string;
  notes?: string;
}

export interface AvailabilityWindow {
  id: EntityId;
  professionalId: EntityId;
  startsAt: string;
  endsAt: string;
  status: "available" | "held" | "booked";
}

export interface StaffingRequirement {
  profession: Profession;
  area: string;
  startsAt: string;
  endsAt: string;
  requiredSkills: string[];
  requiredCredentialStatus: "platform_verified";
  maxHourlyRateBdt: number;
  notes?: string;
}

export interface StaffingRequest {
  id: EntityId;
  organisationId: EntityId;
  createdByUserId: EntityId;
  naturalLanguageRequest: string;
  requirement: StaffingRequirement;
  status: StaffingRequestStatus;
  createdAt: string;
  confirmedAt?: string;
}

export interface MatchEvaluation {
  id: EntityId;
  staffingRequestId: EntityId;
  professionalId: EntityId;
  eligible: boolean;
  hardConstraintFailures: string[];
  score: number;
  evidence: string[];
  uncertainties: string[];
  evaluatedAt: string;
}

export interface Invitation {
  id: EntityId;
  staffingRequestId: EntityId;
  professionalId: EntityId;
  status: InvitationStatus;
  sentAt: string;
  respondedAt?: string;
}

export interface Assignment {
  id: EntityId;
  invitationId: EntityId;
  staffingRequestId: EntityId;
  organisationId: EntityId;
  professionalId: EntityId;
  startsAt: string;
  endsAt: string;
  hourlyRateBdt: number;
  status: AssignmentStatus;
}

export interface AiRunAudit {
  id: EntityId;
  purpose: "request_extraction" | "match_explanation" | "credential_review";
  model: string;
  promptVersion: string;
  outcome: "succeeded" | "fallback_used" | "failed";
  createdAt: string;
  warningCodes: string[];
}

export interface DemoDataSet {
  organisations: Organisation[];
  professionals: ProfessionalProfile[];
  credentials: Credential[];
  availability: AvailabilityWindow[];
  staffingRequests: StaffingRequest[];
  matchEvaluations: MatchEvaluation[];
  invitations: Invitation[];
  assignments: Assignment[];
  aiRunAudits: AiRunAudit[];
}
