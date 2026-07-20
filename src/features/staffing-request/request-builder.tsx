"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Profession, StaffingRequirement } from "../../domain/types";
import type { ExtractionResult } from "./extraction";
import { extractStaffingRequestFallback, validateStaffingRequirement } from "./extraction";
import { encodeConfirmedRequirement, withConfirmedRequirement } from "./confirmed-requirement";

const scenarios: Array<{ profession: Profession; label: string; detail: string; requestId: string; request: string }> = [
  { profession: "general_practitioner", label: "Doctor coverage", detail: "Evening clinic locum", requestId: "request-doctor-evening", request: "We need a general practitioner in Dhanmondi tomorrow from 5 PM to 9 PM with general medicine and emergency assessment experience, up to BDT 1,200 per hour." },
  { profession: "registered_nurse", label: "Registered nurse", detail: "Overnight ICU coverage", requestId: "request-icu-night", request: "We need a registered nurse in Dhanmondi tomorrow from 8 PM to 8 AM with ICU and BLS experience, up to BDT 350 per hour." },
  { profession: "medical_technologist", label: "Lab technologist", detail: "Morning diagnostics shift", requestId: "request-lab-day", request: "We need a medical technologist in Mirpur tomorrow from 9 AM to 5 PM with phlebotomy and sample handling experience, up to BDT 300 per hour." },
  { profession: "physiotherapist", label: "Physiotherapist", detail: "Rehabilitation coverage", requestId: "request-physio-day", request: "We need a physiotherapist in Dhanmondi tomorrow from 10 AM to 4 PM with musculoskeletal rehabilitation and post-operative mobility experience, up to BDT 500 per hour." },
  { profession: "caregiver", label: "Caregiver", detail: "Supervised night support", requestId: "request-caregiver-night", request: "We need a caregiver in Dhanmondi tomorrow from 8 PM to 8 AM with elder care and mobility assistance experience, up to BDT 220 per hour." },
];

const defaultRequest = scenarios[1].request;

const professionLabels: Record<Profession, string> = {
  general_practitioner: "General practitioner",
  registered_nurse: "Registered nurse",
  medical_technologist: "Medical technologist",
  physiotherapist: "Physiotherapist",
  caregiver: "Caregiver",
};

export function RequestBuilder() {
  const [requestText, setRequestText] = useState(defaultRequest);
  const [requirement, setRequirement] = useState<StaffingRequirement | null>(null);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [source, setSource] = useState<ExtractionResult["source"] | null>(null);
  const [isAnalysing, setIsAnalysing] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [requestError, setRequestError] = useState("");
  const errors = useMemo(() => (requirement ? validateStaffingRequirement(requirement) : []), [requirement]);
  const matchingRequestId = requirement
    ? scenarios.find((scenario) => scenario.profession === requirement.profession)?.requestId ?? "request-icu-night"
    : "request-icu-night";

  function chooseScenario(request: string) {
    setRequestText(request);
    setRequirement(null);
    setWarnings([]);
    setSource(null);
    setConfirmed(false);
    setRequestError("");
  }

  function formatShift(value: string) {
    return new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Dhaka",
      day: "numeric",
      month: "short",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(new Date(value));
  }

  async function analyseRequest() {
    setIsAnalysing(true);
    let result: ExtractionResult;
    try {
      const response = await fetch("/api/staffing-request/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: requestText }),
      });
      if (!response.ok) {
        const body = await response.json().catch(() => null) as { error?: string } | null;
        if (response.status === 422) {
          setRequestError(body?.error ?? "Add more staffing details and try again.");
          return;
        }
        throw new Error("Extraction request failed.");
      }
      result = await response.json() as ExtractionResult;
    } catch {
      result = extractStaffingRequestFallback(requestText);
      result.warnings.unshift("The extraction service was unreachable; the local deterministic fallback was used.");
    } finally {
      setIsAnalysing(false);
    }
    setRequirement(result.requirement);
    setWarnings(result.warnings);
    setSource(result.source);
    setConfirmed(false);
    setRequestError("");
  }

  function updateRequirement<K extends keyof StaffingRequirement>(key: K, value: StaffingRequirement[K]) {
    setRequirement((current) => (current ? { ...current, [key]: value } : current));
    setConfirmed(false);
  }

  if (confirmed && requirement) {
    return (
      <section className="confirmation-card" aria-live="polite">
        <span className="confirmation-icon" aria-hidden="true">✓</span>
        <p className="eyebrow">Requirements confirmed</p>
        <h1>Your staffing request is ready for matching.</h1>
        <p>
          The confirmed request requires a {professionLabels[requirement.profession].toLowerCase()} in {requirement.area}, requiring {requirement.requiredSkills.join(" and ")}.
        </p>
        <div className="confirmation-actions">
          <Link className="primary-action link-action" href={withConfirmedRequirement(`/requests/${matchingRequestId}/matches`, encodeConfirmedRequirement(requirement))}>View eligible matches</Link>
          <button className="secondary-action" type="button" onClick={() => setConfirmed(false)}>Edit requirements</button>
        </div>
      </section>
    );
  }

  return (
    <div className="builder-grid">
      <section className="builder-panel">
        <p className="eyebrow">Step 1 · Describe the shift</p>
        <h1>What coverage do you need?</h1>
        <p className="panel-intro">Write naturally. You will review every extracted detail before anything is saved or matched.</p>
        <div className="scenario-picker" aria-label="Demo staffing scenarios">
          {scenarios.map((scenario) => (
            <button
              className={requestText === scenario.request ? "scenario-option active" : "scenario-option"}
              key={scenario.profession}
              type="button"
              onClick={() => chooseScenario(scenario.request)}
            >
              <strong>{scenario.label}</strong>
              <span>{scenario.detail}</span>
            </button>
          ))}
        </div>
        <label className="field-label" htmlFor="request-text">Staffing request</label>
        <textarea
          id="request-text"
          value={requestText}
          onChange={(event) => setRequestText(event.target.value)}
          rows={8}
        />
        <button className="primary-action" type="button" onClick={analyseRequest} disabled={!requestText.trim() || isAnalysing}>
          {isAnalysing ? "Structuring with GPT-5.6 Sol…" : "Structure this request"}
        </button>
        {requestError && <p className="validation-error" role="alert">{requestError}</p>}
        <p className="privacy-note">Use staffing details only. Never include patient names or medical records.</p>
      </section>

      <section className="builder-panel review-panel" aria-live="polite">
        <p className="eyebrow">Step 2 · Human review</p>
        <h2>Confirm the requirements</h2>
        {!requirement ? (
          <div className="empty-review">
            <span aria-hidden="true">↗</span>
            <p>Your structured requirements will appear here for review.</p>
          </div>
        ) : (
          <>
            <div className={source === "live_model" ? "live-model-notice" : "fallback-notice"}>
              <strong>{source === "live_model" ? "Live GPT-5.6 Sol extraction" : "Deterministic demo fallback"}</strong>
              <span>{source === "live_model" ? "Structured with the OpenAI Responses API. Human review is still required." : "Live model access was unavailable. Review all suggested fields."}</span>
            </div>
            <div className="field-grid">
              <label>
                Profession
                <select value={requirement.profession} onChange={(event) => updateRequirement("profession", event.target.value as Profession)}>
                  {Object.entries(professionLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                </select>
              </label>
              <label>
                Area
                <input value={requirement.area} onChange={(event) => updateRequirement("area", event.target.value)} />
              </label>
              <label>
                Maximum hourly rate (BDT)
                <input type="number" min="1" value={requirement.maxHourlyRateBdt} onChange={(event) => updateRequirement("maxHourlyRateBdt", Number(event.target.value))} />
              </label>
              <label>
                Required skills (comma separated)
                <input value={requirement.requiredSkills.join(", ")} onChange={(event) => updateRequirement("requiredSkills", event.target.value.split(",").map((skill) => skill.trim()).filter(Boolean))} />
              </label>
            </div>
            <div className="shift-summary">
              <span>Shift window</span>
              <strong>{formatShift(requirement.startsAt)} → {formatShift(requirement.endsAt)}</strong>
              <small>Asia/Dhaka · extracted from the selected staffing scenario</small>
            </div>
            {warnings.map((warning) => <p className="review-warning" key={warning}>{warning}</p>)}
            {errors.map((error) => <p className="validation-error" key={error}>{error}</p>)}
            <button className="primary-action" type="button" disabled={errors.length > 0} onClick={() => setConfirmed(true)}>
              Confirm requirements
            </button>
          </>
        )}
      </section>
    </div>
  );
}
