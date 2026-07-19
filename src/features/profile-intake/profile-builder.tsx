"use client";

import { useState } from "react";
import { analyseProfileFallback, demoResume, type ProfileIntakeResult } from "./profile-intake";

const statusLabels = { provided: "Provided", missing: "Missing", needs_review: "Needs review" } as const;

export function ProfileBuilder() {
  const [resume, setResume] = useState(demoResume);
  const [result, setResult] = useState<ProfileIntakeResult | null>(null);
  const [isAnalysing, setIsAnalysing] = useState(false);

  async function analyseResume() {
    setIsAnalysing(true);
    try {
      const response = await fetch("/api/profile-intake", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ input: resume }) });
      if (!response.ok) throw new Error("Profile analysis failed.");
      setResult(await response.json() as ProfileIntakeResult);
    } catch {
      const fallback = analyseProfileFallback(resume);
      fallback.warnings.unshift("The analysis service was unreachable; the local demo organiser was used.");
      setResult(fallback);
    } finally {
      setIsAnalysing(false);
    }
  }

  return (
    <div className="profile-builder-grid">
      <section className="intake-panel">
        <p className="eyebrow">Step 1 · Share your professional history</p>
        <h1>Turn your resume into a trusted profile draft.</h1>
        <p className="panel-intro">Paste resume text for this competition demo. GPT-5.6 Sol organises it, but never verifies or invents a qualification.</p>
        <label className="field-label" htmlFor="resume-text">Resume and qualification details</label>
        <textarea id="resume-text" value={resume} onChange={(event) => setResume(event.target.value)} rows={15} maxLength={8000} />
        <div className="resume-meta"><span>{resume.length.toLocaleString()} / 8,000 characters</span><button type="button" onClick={() => setResume(demoResume)}>Restore demo resume</button></div>
        <button className="primary-action" type="button" onClick={analyseResume} disabled={resume.trim().length < 40 || isAnalysing}>
          {isAnalysing ? "Building profile with GPT-5.6 Sol…" : "Build my profile draft"}
        </button>
        <p className="privacy-note">Demo only: do not paste NID numbers, patient information, home addresses, or real confidential records.</p>
      </section>

      <section className="intake-panel intake-results" aria-live="polite">
        <p className="eyebrow">Step 2 · Review every extracted claim</p>
        {!result ? (
          <div className="empty-intake"><span aria-hidden="true">AI</span><h2>Your profile draft will appear here.</h2><p>We will separate profile information, missing evidence, and practical improvements.</p></div>
        ) : (
          <>
            <div className={result.source === "live_model" ? "live-model-notice" : "fallback-notice"}>
              <strong>{result.source === "live_model" ? "Live GPT-5.6 Sol profile analysis" : "Deterministic demo fallback"}</strong>
              <span>All extracted information remains unverified until a person reviews the original evidence.</span>
            </div>
            <div className="profile-draft-card">
              <div><span className="draft-monogram" aria-hidden="true">{result.profile.displayName.split(" ").map((part) => part[0]).join("").slice(0, 2)}</span><p className="eyebrow">Draft profile</p><h2>{result.profile.displayName}</h2><p>{result.profile.headline}</p></div>
              <dl>
                <div><dt>Profession</dt><dd>{result.profile.profession === "general_practitioner" ? "Doctor" : "Registered nurse"}</dd></div>
                <div><dt>Experience</dt><dd>{result.profile.yearsExperience} years</dd></div>
                <div><dt>Area</dt><dd>{result.profile.area}</dd></div>
                <div><dt>Registration</dt><dd>{result.profile.registrationNumber || "Not found"}</dd></div>
              </dl>
              <div className="skill-row light-skills">{result.profile.skills.map((skill) => <span key={skill}>{skill}</span>)}</div>
            </div>
            <div className="intake-review-columns">
              <section><h3>Document readiness</h3><div className="evidence-checklist">{result.evidenceChecklist.map((item) => <article key={item.label}><span className={`evidence-status ${item.status}`}>{statusLabels[item.status]}</span><strong>{item.label}</strong><p>{item.guidance}</p></article>)}</div></section>
              <section><h3>Improve your profile</h3><ol className="advice-list">{result.profileAdvice.map((advice) => <li key={advice}>{advice}</li>)}</ol></section>
            </div>
            {result.warnings.map((warning) => <p className="review-warning" key={warning}>{warning}</p>)}
            <button className="primary-action" type="button" disabled>Save after human review</button>
          </>
        )}
      </section>
    </div>
  );
}
