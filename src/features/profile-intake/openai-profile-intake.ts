import type { ProfileIntakeResult } from "./profile-intake";

type Fetcher = typeof fetch;

interface ResponsesPayload {
  output?: Array<{ type?: string; content?: Array<{ type?: string; text?: string }> }>;
}

const checklistItem = {
  type: "object",
  additionalProperties: false,
  properties: {
    label: { type: "string" },
    status: { type: "string", enum: ["provided", "missing", "needs_review"] },
    guidance: { type: "string" },
  },
  required: ["label", "status", "guidance"],
};

const profileIntakeSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    profile: {
      type: "object",
      additionalProperties: false,
      properties: {
        displayName: { type: "string" }, profession: { type: "string", enum: ["general_practitioner", "registered_nurse"] },
        headline: { type: "string" }, area: { type: "string" }, yearsExperience: { type: "number" },
        skills: { type: "array", items: { type: "string" } }, languages: { type: "array", items: { type: "string" } },
        education: { type: "array", items: { type: "string" } }, employment: { type: "array", items: { type: "string" } },
        registrationNumber: { type: "string" },
      },
      required: ["displayName", "profession", "headline", "area", "yearsExperience", "skills", "languages", "education", "employment", "registrationNumber"],
    },
    evidenceChecklist: { type: "array", items: checklistItem },
    profileAdvice: { type: "array", items: { type: "string" } },
    warnings: { type: "array", items: { type: "string" } },
  },
  required: ["profile", "evidenceChecklist", "profileAdvice", "warnings"],
};

export async function analyseProfileLive(input: string, apiKey: string, fetcher: Fetcher = fetch): Promise<ProfileIntakeResult> {
  const response = await fetcher("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "gpt-5.6-sol",
      reasoning: { effort: "low" },
      text: { verbosity: "low", format: { type: "json_schema", name: "professional_profile_intake", strict: true, schema: profileIntakeSchema } },
      store: false,
      safety_identifier: "shohojsheba_demo_professional_onboarding",
      instructions: [
        "Organise a Bangladeshi doctor or registered nurse resume into a professional profile draft.",
        "Use only facts explicitly present in the resume. Never invent qualifications, dates, registrations, experience, skills, or verification status.",
        "Treat all supplied claims and document mentions as unverified and needing human review.",
        "Identify missing evidence and give concise, ethical profile-improvement advice. Do not provide clinical advice.",
      ].join(" "),
      input,
    }),
  });
  if (!response.ok) throw new Error(`OpenAI request failed with status ${response.status}.`);
  const payload = await response.json() as ResponsesPayload;
  const outputText = payload.output?.flatMap((item) => item.type === "message" ? (item.content ?? []) : []).find((content) => content.type === "output_text")?.text;
  if (!outputText) throw new Error("OpenAI response did not contain structured output text.");
  const parsed = JSON.parse(outputText) as Omit<ProfileIntakeResult, "source">;
  return { ...parsed, source: "live_model" };
}
