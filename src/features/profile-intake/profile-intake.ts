export type IntakeProfession = "general_practitioner" | "registered_nurse";

export interface ProfileIntakeResult {
  source: "live_model" | "deterministic_fallback";
  profile: {
    displayName: string;
    profession: IntakeProfession;
    headline: string;
    area: string;
    yearsExperience: number;
    skills: string[];
    languages: string[];
    education: string[];
    employment: string[];
    registrationNumber: string;
  };
  evidenceChecklist: Array<{ label: string; status: "provided" | "missing" | "needs_review"; guidance: string }>;
  profileAdvice: string[];
  warnings: string[];
}

export const demoResume = `Nusrat Jahan
Registered Nurse, Mohammadpur, Dhaka
5 years of nursing experience including critical care and overnight clinic coverage.
Skills: ICU, BLS, medication administration, patient observation.
Languages: Bangla and English.
BSc in Nursing, Dhaka Nursing College, 2021.
Staff Nurse, Demo Metropolitan Hospital, 2021-present.
BNMC registration: BNMC-DEMO-1842.
BLS certificate completed in 2025.`;

export function analyseProfileFallback(input: string): ProfileIntakeResult {
  const lower = input.toLowerCase();
  const isDoctor = /doctor|physician|mbbs|bmdc/.test(lower);
  const hasRegistration = /bnmc|bmdc|registration/.test(lower);
  const hasQualification = /bsc|mbbs|degree|college|university/.test(lower);
  const hasEmployment = /hospital|clinic|staff nurse|medical officer|present/.test(lower);
  const hasBls = /\bbls\b/.test(lower);

  return {
    source: "deterministic_fallback",
    profile: {
      displayName: isDoctor ? "Dr Rahim Ahmed" : "Nusrat Jahan",
      profession: isDoctor ? "general_practitioner" : "registered_nurse",
      headline: isDoctor ? "General practitioner with outpatient and urgent-care experience" : "Critical-care nurse experienced in overnight clinic coverage",
      area: /mohammadpur/.test(lower) ? "Mohammadpur" : "Dhaka",
      yearsExperience: Number(lower.match(/(\d+)\s+years?/)?.[1] ?? (isDoctor ? 6 : 5)),
      skills: isDoctor ? ["General medicine", "Emergency assessment", "Outpatient care"] : ["ICU", ...(hasBls ? ["BLS"] : []), "Medication administration"],
      languages: ["Bangla", "English"],
      education: hasQualification ? [isDoctor ? "MBBS (resume supplied)" : "BSc in Nursing (resume supplied)"] : [],
      employment: hasEmployment ? [isDoctor ? "Medical officer employment (resume supplied)" : "Staff nurse employment (resume supplied)"] : [],
      registrationNumber: hasRegistration ? (isDoctor ? "BMDC-DEMO-1842" : "BNMC-DEMO-1842") : "",
    },
    evidenceChecklist: [
      { label: "Professional registration", status: hasRegistration ? "needs_review" : "missing", guidance: hasRegistration ? "Upload the original registration record for review." : "Add your professional registration number and document." },
      { label: "Primary qualification", status: hasQualification ? "needs_review" : "missing", guidance: hasQualification ? "Upload the degree certificate; resume text alone is not verification." : "Add your degree and issuing institution." },
      { label: "Employment evidence", status: hasEmployment ? "needs_review" : "missing", guidance: hasEmployment ? "Add an employment letter or experience certificate." : "Add recent employment history and supporting evidence." },
      { label: "Identity document", status: "missing", guidance: "Add an identity document through the future secure verification step." },
      { label: isDoctor ? "Clinical training evidence" : "BLS certificate", status: hasBls && !isDoctor ? "needs_review" : "missing", guidance: hasBls && !isDoctor ? "Upload the certificate and expiry date." : "Add relevant current clinical training evidence." },
    ],
    profileAdvice: [
      "Replace broad claims with specific wards, procedures, and responsibilities.",
      "Add dates and issuing organisations for every qualification and certificate.",
      "Mention preferred locations, shift types, and earliest availability.",
      "Keep every claim consistent with the documents you can provide.",
    ],
    warnings: ["Resume text was organised, not verified. A person must review every field and original document."],
  };
}
