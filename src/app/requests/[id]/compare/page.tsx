import Link from "next/link";
import { notFound } from "next/navigation";
import { createDemoRepository } from "../../../../data/demo-repository";
import { getCriteriaFitPercentage, isNearMatch, rankCandidates } from "../../../../features/matching/match-engine";
import { FlowTrail } from "../../../../components/flow-trail";
import { createScopeAdjustment } from "../../../../features/adjustments/scope-adjustment";

function requirementStatus(passed: boolean) {
  return passed ? "Meets requirement" : "Gap to resolve";
}

export default async function CompareProfessionalsPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ professionals?: string }>;
}) {
  const { id } = await params;
  const { professionals } = await searchParams;
  const repository = createDemoRepository();
  const request = repository.getStaffingRequest(id);
  if (!request) notFound();

  const matches = rankCandidates(request, repository);
  const safePool = matches.filter((match) => match.eligible || isNearMatch(request, match));
  const requestedIds = professionals?.split(",").filter(Boolean).slice(0, 3) ?? [];
  const selected = requestedIds.length > 0
    ? requestedIds.flatMap((professionalId) => {
        const match = safePool.find((candidate) => candidate.professional.id === professionalId);
        return match ? [match] : [];
      })
    : safePool.slice(0, 3);
  if (selected.length === 0) notFound();
  const adjustableIds = new Set(selected.flatMap((match) => {
    if (match.eligible) return [];
    try {
      createScopeAdjustment(request, match.professional, repository);
      return [match.professional.id];
    } catch {
      return [];
    }
  }));

  const rows = [
    { label: "Overall fit", render: (index: number) => selected[index].eligible ? `${selected[index].score}% recommended` : `${getCriteriaFitPercentage(selected[index])}% criteria fit` },
    { label: "Decision status", render: (index: number) => selected[index].eligible ? "Eligible to invite" : "Near match — review gaps" },
    { label: "Experience", render: (index: number) => `${selected[index].professional.yearsExperience} years` },
    { label: "Reliability", render: (index: number) => `${selected[index].professional.reliabilityScore}%` },
    { label: "Expected rate", render: (index: number) => `BDT ${selected[index].professional.expectedHourlyRateBdt}/hour` },
    { label: "Location", render: (index: number) => selected[index].professional.area },
    { label: "Languages", render: (index: number) => selected[index].professional.languages.join(", ") },
    { label: "Skills", render: (index: number) => selected[index].professional.skills.join(", ") },
    { label: "Registration", render: (index: number) => selected[index].registration?.status === "platform_verified" ? "Reviewed for demo" : "Not verified" },
    { label: "Profession", render: (index: number) => requirementStatus(!selected[index].hardConstraintFailures.some((item) => item.startsWith("Profession"))) },
    { label: "Required skills", render: (index: number) => requirementStatus(!selected[index].hardConstraintFailures.some((item) => item.startsWith("Missing required skills"))) },
    { label: "Full shift", render: (index: number) => requirementStatus(!selected[index].hardConstraintFailures.some((item) => item.startsWith("Availability"))) },
    { label: "Within budget", render: (index: number) => requirementStatus(!selected[index].hardConstraintFailures.some((item) => item.startsWith("Expected hourly rate"))) },
  ];

  return (
    <main id="main-content">
      <header className="site-header">
        <Link className="brand" href="/"><span className="brand-mark" aria-hidden="true">S</span><span>ShohojSheba</span></Link>
        <span className="demo-badge">Human decision support</span>
      </header>
      <div className="compare-shell">
        <FlowTrail
          current={3}
          label="Clinic coordinator journey"
          steps={[
            { label: "Request", href: "/requests/new" },
            { label: "Shortlist", href: `/requests/${request.id}/matches` },
            { label: "Compare" },
            { label: "Verify" },
            { label: "Invite" },
          ]}
        />
        <Link className="back-link" href={`/requests/${request.id}/matches`}>← Back to matches</Link>
        <section className="compare-heading">
          <p className="eyebrow">Side-by-side review · up to three professionals</p>
          <h1>Compare the evidence, not just the score.</h1>
          <p>Every column uses the same confirmed staffing requirements. Amber gaps remain visible and cannot be overridden by a higher reliability score.</p>
        </section>

        <div className="comparison-scroll" role="region" aria-label="Professional comparison" tabIndex={0}>
          <table className="comparison-table">
            <thead>
              <tr>
                <th scope="col">Comparison</th>
                {selected.map((match) => (
                  <th scope="col" key={match.professional.id}>
                    <span className={match.eligible ? "compare-status eligible" : "compare-status near"}>{match.eligible ? "Eligible" : "Near match"}</span>
                    <strong>{match.professional.displayName}</strong>
                    <small>{match.professional.headline}</small>
                    <Link href={`/professionals/${match.professional.id}?request=${request.id}`}>View full profile</Link>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.label}>
                  <th scope="row">{row.label}</th>
                  {selected.map((match, index) => {
                    const value = row.render(index);
                    const isGap = value === "Gap to resolve" || value.includes("Near match");
                    return <td className={isGap ? "comparison-gap" : undefined} key={match.professional.id}>{value}</td>;
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <section className="comparison-decision" aria-labelledby="comparison-decision-heading">
          <div className="section-title-row">
            <div>
              <p className="eyebrow">Human selection</p>
              <h2 id="comparison-decision-heading">Choose how to continue.</h2>
              <p>Select an eligible professional for credential review, or inspect the unresolved gaps on a near match.</p>
            </div>
          </div>
          <div className="comparison-decision-grid">
            {selected.map((match) => (
              <article className={match.eligible ? "eligible" : "near"} key={match.professional.id}>
                <span className={match.eligible ? "compare-status eligible" : "compare-status near"}>
                  {match.eligible ? "Ready for review" : "Gaps unresolved"}
                </span>
                <h3>{match.professional.displayName}</h3>
                <p>
                  {match.eligible
                    ? "All confirmed staffing requirements are met. Verify the credential evidence before inviting."
                    : match.hardConstraintFailures.join(" ")}
                </p>
                <Link
                  className={match.eligible ? "primary-action link-action" : "secondary-action"}
                  href={match.eligible || !adjustableIds.has(match.professional.id)
                    ? `/professionals/${match.professional.id}?request=${request.id}`
                    : `/requests/${request.id}/adjustments/${match.professional.id}`}
                >
                  {match.eligible ? "Select and continue" : adjustableIds.has(match.professional.id) ? "Propose adjusted terms" : "Review profile gaps"}
                </Link>
              </article>
            ))}
          </div>
        </section>
        <p className="compare-boundary"><strong>Human decision required.</strong> Comparison organises fictional evidence; it does not authenticate credentials or replace the clinic’s review.</p>
      </div>
    </main>
  );
}
