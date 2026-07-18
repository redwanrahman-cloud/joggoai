import type { Profession, StaffingRequirement } from "../../domain/types";

export interface ExtractionResult {
  requirement: StaffingRequirement;
  source: "deterministic_fallback" | "live_model";
  confidence: "high" | "medium" | "low";
  warnings: string[];
}

const professionTerms: Array<[RegExp, Profession]> = [
  [/general practitioner|\bdoctor\b|\bphysician\b|\bgp\b/i, "general_practitioner"],
  [/medical technologist|lab(?:oratory)? technologist/i, "medical_technologist"],
  [/physiotherapist|physical therapist/i, "physiotherapist"],
  [/caregiver|care attendant/i, "caregiver"],
  [/nurse|nursing/i, "registered_nurse"],
];

const skillTerms = ["ICU", "BLS", "Phlebotomy", "Wound care", "Post-operative care"];
const areaTerms = ["Dhanmondi", "Mohammadpur", "Mirpur", "Uttara"];

export function extractStaffingRequestFallback(input: string): ExtractionResult {
  const profession = professionTerms.find(([pattern]) => pattern.test(input))?.[1] ?? "registered_nurse";
  const area = areaTerms.find((candidate) => input.toLowerCase().includes(candidate.toLowerCase())) ?? "Dhanmondi";
  const requiredSkills = skillTerms.filter((skill) => input.toLowerCase().includes(skill.toLowerCase()));
  const budgetMatch = input.match(/(?:BDT|৳)\s?([\d,]+)|([\d,]+)\s?(?:BDT|taka)/i);
  const parsedBudget = Number((budgetMatch?.[1] ?? budgetMatch?.[2] ?? "350").replaceAll(",", ""));
  const warnings = [
    "Demo fallback used: date and time were resolved against the scripted Build Week scenario.",
  ];

  if (!professionTerms.some(([pattern]) => pattern.test(input))) warnings.push("Profession was not explicit; registered nurse was assumed.");
  if (requiredSkills.length === 0) warnings.push("No supported skill term was detected; review required skills.");
  if (!budgetMatch) warnings.push("No hourly budget was detected; BDT 350 was suggested.");

  return {
    requirement: {
      profession,
      area,
      startsAt: "2026-07-20T14:00:00.000Z",
      endsAt: "2026-07-21T02:00:00.000Z",
      requiredSkills,
      requiredCredentialStatus: "platform_verified",
      maxHourlyRateBdt: parsedBudget,
      notes: "Overnight clinic coverage; extracted using the deterministic demo fallback.",
    },
    source: "deterministic_fallback",
    confidence: warnings.length === 1 ? "high" : "medium",
    warnings,
  };
}

export function validateStaffingRequirement(requirement: StaffingRequirement): string[] {
  const errors: string[] = [];
  if (!requirement.area.trim()) errors.push("Area is required.");
  if (requirement.startsAt >= requirement.endsAt) errors.push("Shift end must be after shift start.");
  if (requirement.maxHourlyRateBdt <= 0) errors.push("Hourly budget must be greater than zero.");
  if (requirement.requiredSkills.length === 0) errors.push("Add at least one required skill.");
  return errors;
}
