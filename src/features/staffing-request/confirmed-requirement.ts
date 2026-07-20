import type { StaffingRequest, StaffingRequirement } from "../../domain/types";
import { validateStaffingRequirement } from "./extraction";

export const CONFIRMED_REQUIREMENT_PARAM = "requirement";

export function encodeConfirmedRequirement(requirement: StaffingRequirement): string {
  return JSON.stringify(requirement);
}

export function decodeConfirmedRequirement(value?: string): StaffingRequirement | null {
  if (!value || value.length > 2_500) return null;
  try {
    const parsed = JSON.parse(value) as StaffingRequirement;
    if (
      typeof parsed !== "object" ||
      !parsed ||
      typeof parsed.profession !== "string" ||
      typeof parsed.area !== "string" ||
      typeof parsed.startsAt !== "string" ||
      typeof parsed.endsAt !== "string" ||
      !Array.isArray(parsed.requiredSkills) ||
      !parsed.requiredSkills.every((skill) => typeof skill === "string") ||
      parsed.requiredCredentialStatus !== "platform_verified" ||
      typeof parsed.maxHourlyRateBdt !== "number" ||
      validateStaffingRequirement(parsed).length > 0
    ) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function applyConfirmedRequirement(
  request: StaffingRequest,
  encodedRequirement?: string,
): StaffingRequest {
  const requirement = decodeConfirmedRequirement(encodedRequirement);
  return requirement
    ? { ...request, naturalLanguageRequest: "Custom requirement confirmed by the clinic coordinator.", requirement }
    : request;
}

export function withConfirmedRequirement(href: string, encodedRequirement?: string): string {
  if (!encodedRequirement) return href;
  const separator = href.includes("?") ? "&" : "?";
  return `${href}${separator}${CONFIRMED_REQUIREMENT_PARAM}=${encodeURIComponent(encodedRequirement)}`;
}
