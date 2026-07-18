import type { CandidateMatch } from "./match-engine";
import type { StaffingRequest } from "../../domain/types";

type Fetcher = typeof fetch;

export interface MatchBriefing {
  recommendationSummary: string;
  verificationPriorities: string[];
  decisionBoundary: string;
  source: "live_model" | "deterministic_fallback";
}

const schema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recommendationSummary: { type: "string" },
    verificationPriorities: { type: "array", minItems: 2, maxItems: 4, items: { type: "string" } },
    decisionBoundary: { type: "string" },
  },
  required: ["recommendationSummary", "verificationPriorities", "decisionBoundary"],
};

export function createFallbackBriefing(request: StaffingRequest, eligible: CandidateMatch[]): MatchBriefing {
  const top = eligible[0];
  return {
    recommendationSummary: top
      ? `${top.professional.displayName} passed every confirmed hard requirement and is the highest-ranked eligible professional at ${top.score}%.`
      : "No professional passed every confirmed hard requirement. The clinic should revise the request or expand sourcing.",
    verificationPriorities: ["Confirm identity and original credential records.", "Reconfirm availability, rate, and shift terms directly with the professional."],
    decisionBoundary: "This briefing organises existing evidence. A person must make the final staffing decision.",
    source: "deterministic_fallback",
  };
}

export async function createLiveMatchBriefing(request: StaffingRequest, matches: CandidateMatch[], apiKey: string, fetcher: Fetcher = fetch): Promise<MatchBriefing> {
  const evidence = {
    request: request.requirement,
    eligible: matches.filter((match) => match.eligible).map((match) => ({ name: match.professional.displayName, score: match.score, evidence: match.evidence, uncertainties: match.uncertainties })),
    excluded: matches.filter((match) => !match.eligible).map((match) => ({ name: match.professional.displayName, reasons: match.hardConstraintFailures })),
  };
  const response = await fetcher("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "gpt-5.6-sol",
      reasoning: { effort: "low" },
      text: { verbosity: "low", format: { type: "json_schema", name: "match_briefing", strict: true, schema } },
      store: false,
      safety_identifier: "shohojsheba_demo_staffing_coordinator",
      instructions: "Summarise only the supplied deterministic evidence. Never change eligibility, invent credentials, make a hiring decision, or mention protected traits. State clearly that a person decides. Keep the briefing concise.",
      input: JSON.stringify(evidence),
    }),
  });
  if (!response.ok) throw new Error(`OpenAI request failed with status ${response.status}.`);
  const payload = await response.json() as { output?: Array<{ type?: string; content?: Array<{ type?: string; text?: string }> }> };
  const text = payload.output?.flatMap((item) => item.type === "message" ? item.content ?? [] : []).find((item) => item.type === "output_text")?.text;
  if (!text) throw new Error("OpenAI response did not contain briefing text.");
  const parsed = JSON.parse(text) as Omit<MatchBriefing, "source">;
  if (!parsed.recommendationSummary || parsed.verificationPriorities.length < 2 || !parsed.decisionBoundary) throw new Error("OpenAI briefing failed validation.");
  return { ...parsed, source: "live_model" };
}
