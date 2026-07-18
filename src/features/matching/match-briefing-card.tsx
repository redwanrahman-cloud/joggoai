"use client";

import { useState } from "react";
import type { MatchBriefing } from "./match-briefing";

export function MatchBriefingCard({ requestId }: { requestId: string }) {
  const [briefing, setBriefing] = useState<MatchBriefing | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  async function generate() {
    setLoading(true);
    setError(false);
    try {
      const response = await fetch("/api/match-briefing", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ requestId }) });
      if (!response.ok) throw new Error("Briefing request failed");
      setBriefing(await response.json() as MatchBriefing);
    } catch { setError(true); }
    finally { setLoading(false); }
  }

  return (
    <section className="ai-briefing" aria-live="polite">
      <div><p className="eyebrow">Evidence-grounded GPT-5.6 briefing</p><h2>Turn the shortlist into a review plan.</h2><p>The model can summarise deterministic evidence, but it cannot change eligibility or choose a professional.</p></div>
      {!briefing ? <button className="primary-action" type="button" onClick={generate} disabled={loading}>{loading ? "Preparing briefing…" : "Generate staffing briefing"}</button> : (
        <div className="briefing-result"><span className={briefing.source === "live_model" ? "live-source" : "fallback-source"}>{briefing.source === "live_model" ? "Live GPT-5.6 Sol" : "Safe fallback"}</span><strong>{briefing.recommendationSummary}</strong><ul>{briefing.verificationPriorities.map((item) => <li key={item}>{item}</li>)}</ul><p>{briefing.decisionBoundary}</p></div>
      )}
      {error ? <p className="validation-error">The briefing could not be generated. Deterministic matching remains available above.</p> : null}
    </section>
  );
}
