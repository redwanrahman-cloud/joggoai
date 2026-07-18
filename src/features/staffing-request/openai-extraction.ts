import type { StaffingRequirement } from "../../domain/types";
import type { ExtractionResult } from "./extraction";
import { validateStaffingRequirement } from "./extraction";

type Fetcher = typeof fetch;

interface ResponsesPayload {
  output?: Array<{
    type?: string;
    content?: Array<{ type?: string; text?: string }>;
  }>;
}

const staffingRequirementSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    profession: { type: "string", enum: ["registered_nurse", "medical_technologist", "physiotherapist", "caregiver"] },
    area: { type: "string" },
    startsAt: { type: "string" },
    endsAt: { type: "string" },
    requiredSkills: { type: "array", items: { type: "string" } },
    requiredCredentialStatus: { type: "string", enum: ["platform_verified"] },
    maxHourlyRateBdt: { type: "number" },
    notes: { type: "string" },
    confidence: { type: "string", enum: ["high", "medium", "low"] },
    warnings: { type: "array", items: { type: "string" } },
  },
  required: ["profession", "area", "startsAt", "endsAt", "requiredSkills", "requiredCredentialStatus", "maxHourlyRateBdt", "notes", "confidence", "warnings"],
};

export async function extractStaffingRequestLive(input: string, apiKey: string, fetcher: Fetcher = fetch): Promise<ExtractionResult> {
  const response = await fetcher("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "gpt-5.6-sol",
      reasoning: { effort: "low" },
      text: {
        verbosity: "low",
        format: { type: "json_schema", name: "staffing_requirement", strict: true, schema: staffingRequirementSchema },
      },
      store: false,
      safety_identifier: "shohojsheba_demo_staffing_coordinator",
      instructions: [
        "Extract only healthcare staffing requirements from the user's text.",
        "The reference timezone is Asia/Dhaka and the scripted reference date is 2026-07-19.",
        "Never include patient information, invent credentials, or make a hiring decision.",
        "Use ISO 8601 UTC timestamps. Put any assumption or ambiguity in warnings.",
      ].join(" "),
      input,
    }),
  });

  if (!response.ok) throw new Error(`OpenAI request failed with status ${response.status}.`);
  const payload = await response.json() as ResponsesPayload;
  const outputText = payload.output
    ?.flatMap((item) => item.type === "message" ? (item.content ?? []) : [])
    .find((content) => content.type === "output_text")?.text;
  if (!outputText) throw new Error("OpenAI response did not contain structured output text.");

  const parsed = JSON.parse(outputText) as StaffingRequirement & { confidence: ExtractionResult["confidence"]; warnings: string[] };
  const requirement: StaffingRequirement = {
    profession: parsed.profession,
    area: parsed.area,
    startsAt: parsed.startsAt,
    endsAt: parsed.endsAt,
    requiredSkills: parsed.requiredSkills,
    requiredCredentialStatus: parsed.requiredCredentialStatus,
    maxHourlyRateBdt: parsed.maxHourlyRateBdt,
    notes: parsed.notes,
  };
  const errors = validateStaffingRequirement(requirement);
  if (errors.length > 0) throw new Error(`OpenAI output failed domain validation: ${errors.join(" ")}`);

  return { requirement, source: "live_model", confidence: parsed.confidence, warnings: parsed.warnings };
}
