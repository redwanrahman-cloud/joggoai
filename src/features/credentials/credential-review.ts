import type { Credential, ProfessionalProfile } from "../../domain/types";

export type FindingSeverity = "pass" | "caution" | "block";

export interface CredentialFinding {
  id: string;
  credentialId?: string;
  severity: FindingSeverity;
  title: string;
  detail: string;
}

export interface CredentialReview {
  status: "ready" | "ready_with_cautions" | "blocked";
  findings: CredentialFinding[];
  reviewedEvidenceCount: number;
  pendingEvidenceCount: number;
}

export function reviewProfessionalCredentials(
  professional: ProfessionalProfile,
  credentials: Credential[],
  referenceDate = "2026-07-19",
): CredentialReview {
  const findings: CredentialFinding[] = [];
  const registration = credentials.find(({ type }) => type === "professional_registration");

  if (!registration) {
    findings.push({
      id: "registration-missing",
      severity: "block",
      title: "Professional registration is missing",
      detail: "A reviewed professional registration is required before invitation.",
    });
  } else if (registration.status === "expired" || (registration.expiresOn && registration.expiresOn < referenceDate)) {
    findings.push({
      id: "registration-expired",
      credentialId: registration.id,
      severity: "block",
      title: "Professional registration is expired",
      detail: `The recorded expiry date is ${registration.expiresOn ?? "unknown"}.`,
    });
  } else if (registration.status !== "platform_verified") {
    findings.push({
      id: "registration-unreviewed",
      credentialId: registration.id,
      severity: "block",
      title: "Professional registration is not reviewed",
      detail: "An uploaded or self-declared registration cannot satisfy the verified-registration requirement.",
    });
  } else {
    findings.push({
      id: "registration-reviewed",
      credentialId: registration.id,
      severity: "pass",
      title: "Registration reviewed for the demo",
      detail: `${registration.issuingAuthority} record is marked valid through ${registration.expiresOn ?? "an unspecified date"}.`,
    });
  }

  for (const credential of credentials.filter(({ type }) => type !== "professional_registration")) {
    if (credential.status === "uploaded_pending_review") {
      findings.push({
        id: `${credential.id}-pending`,
        credentialId: credential.id,
        severity: "caution",
        title: `${credential.title} awaits review`,
        detail: "This uploaded document supports a profile claim but has not been manually reviewed.",
      });
    } else if (credential.status === "platform_verified") {
      findings.push({
        id: `${credential.id}-reviewed`,
        credentialId: credential.id,
        severity: "pass",
        title: `${credential.title} reviewed`,
        detail: `Reviewed evidence from ${credential.issuingAuthority}.`,
      });
    }
  }

  const hasCriticalCareClaim = professional.skills.some((skill) => skill.toLowerCase() === "icu");
  const hasCriticalCareEvidence = credentials.some(
    (credential) => credential.type === "employment_record" && credential.title.toLowerCase().includes("icu"),
  );
  if (hasCriticalCareClaim && !hasCriticalCareEvidence) {
    findings.push({
      id: "icu-evidence-missing",
      severity: "caution",
      title: "ICU claim lacks a supporting employment record",
      detail: "The profile lists ICU experience, but no matching employment record is attached.",
    });
  }

  const hasBlock = findings.some(({ severity }) => severity === "block");
  const hasCaution = findings.some(({ severity }) => severity === "caution");

  return {
    status: hasBlock ? "blocked" : hasCaution ? "ready_with_cautions" : "ready",
    findings,
    reviewedEvidenceCount: credentials.filter(({ status }) => status === "platform_verified").length,
    pendingEvidenceCount: credentials.filter(({ status }) => status === "uploaded_pending_review").length,
  };
}

