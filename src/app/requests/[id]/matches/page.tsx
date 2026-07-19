import Link from "next/link";
import { notFound } from "next/navigation";
import { createDemoRepository } from "../../../../data/demo-repository";
import { getCriteriaFitPercentage, isNearMatch, rankCandidates } from "../../../../features/matching/match-engine";
import { MatchBriefingCard } from "../../../../features/matching/match-briefing-card";

const professionLabels = { general_practitioner: "doctor", registered_nurse: "registered nurse", medical_technologist: "laboratory technologist", physiotherapist: "physiotherapist", caregiver: "caregiver" } as const;
const professionPluralLabels = { general_practitioner: "doctors", registered_nurse: "registered nurses", medical_technologist: "laboratory technologists", physiotherapist: "physiotherapists", caregiver: "caregivers" } as const;

function formatShift(value: string) {
  return new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Dhaka", day: "numeric", month: "short", hour: "numeric", minute: "2-digit", hour12: true }).format(new Date(value));
}

export default async function MatchResultsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const repository = createDemoRepository();
  const request = repository.getStaffingRequest(id);
  if (!request) notFound();

  const organisation = repository.getOrganisation(request.organisationId);
  const matches = rankCandidates(request, repository);
  const eligible = matches.filter((match) => match.eligible);
  const nearMatches = matches.filter((match) => isNearMatch(request, match));
  const comparisonIds = [...eligible, ...nearMatches].slice(0, 3).map((match) => match.professional.id).join(",");

  return (
    <main id="main-content">
      <header className="site-header">
        <Link className="brand" href="/">
          <span className="brand-mark" aria-hidden="true">S</span>
          <span>ShohojSheba</span>
        </Link>
        <span className="demo-badge">Explainable demo ranking</span>
      </header>

      <div className="matches-shell">
        <section className="matches-heading">
          <div>
            <p className="eyebrow">{organisation?.name} · {professionLabels[request.requirement.profession]} coverage</p>
            <h1>
              {eligible.length === 1
                ? `Eligible ${professionLabels[request.requirement.profession]}`
                : `Eligible ${professionPluralLabels[request.requirement.profession]}`}
            </h1>
            <p>
              Hard requirements were checked first. Scores only compare professionals who passed every requirement.
            </p>
          </div>
          <div className="request-facts" aria-label="Confirmed request summary">
            <span>{formatShift(request.requirement.startsAt)}–{formatShift(request.requirement.endsAt)}</span>
            <span>{request.requirement.requiredSkills.join(" + ")}</span>
            <span>≤ BDT {request.requirement.maxHourlyRateBdt}/hour</span>
            <span>{organisation?.name}</span>
          </div>
        </section>

        <section aria-labelledby="eligible-heading">
          <div className="section-title-row">
            <h2 id="eligible-heading">Recommended shortlist</h2>
            <div className="section-title-actions">
              <span>{eligible.length === 1 ? "Hard requirements met" : `${eligible.length} qualified matches`}</span>
              <Link className="secondary-action compact-action" href={`/requests/${request.id}/compare?professionals=${comparisonIds}`}>
                Compare professionals
              </Link>
            </div>
          </div>
          <div className="candidate-list">
            {eligible.map((match, index) => (
              <article className="candidate-card recommended" key={match.professional.id}>
                <div className="candidate-rank">#{index + 1}</div>
                <div className="candidate-main">
                  <div className="candidate-heading">
                    <div>
                      <p className="match-label">Recommended · {match.score}% match</p>
                      <h3>{match.professional.displayName}</h3>
                      <p>{match.professional.headline}</p>
                    </div>
                    <div className="score-ring" aria-label={`${match.score} percent match`}>{match.score}</div>
                  </div>
                  <div className="candidate-metrics">
                    <span><strong>{match.professional.yearsExperience}</strong> years</span>
                    <span><strong>{match.professional.reliabilityScore}%</strong> reliability</span>
                    <span><strong>BDT {match.professional.expectedHourlyRateBdt}</strong> / hour</span>
                    <span><strong>{match.professional.area}</strong> base</span>
                  </div>
                  <div className="evidence-grid">
                    <div>
                      <h4>Why this candidate qualifies</h4>
                      <ul>{match.evidence.map((item) => <li key={item}>{item}</li>)}</ul>
                    </div>
                    <div>
                      <h4>Verify before inviting</h4>
                      <ul className="uncertainty-list">
                        {match.uncertainties.length > 0
                          ? match.uncertainties.map((item) => <li key={item}>{item}</li>)
                          : <li>No additional uncertainty flags in demo data.</li>}
                      </ul>
                    </div>
                  </div>
                  <div className="candidate-actions">
                    <span className="credential-chip">Demo registration reviewed</span>
                    <Link className="primary-action link-action" href={`/professionals/${match.professional.id}?request=${request.id}`}>Review candidate</Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <MatchBriefingCard requestId={request.id} />

        {nearMatches.length > 0 && (
          <section className="excluded-section" aria-labelledby="alternatives-heading">
            <div className="section-title-row">
              <div>
                <h2 id="alternatives-heading">Potential alternatives</h2>
                <p>Same profession and reviewed registration, with gaps to resolve before inviting.</p>
              </div>
              <span>{nearMatches.length} near {nearMatches.length === 1 ? "match" : "matches"}</span>
            </div>
            <div className="excluded-grid">
              {nearMatches.map((match) => (
              <article className="excluded-card near-match-card" key={match.professional.id}>
                <p className="excluded-label">{getCriteriaFitPercentage(match)}% criteria fit</p>
                <h3>{match.professional.displayName}</h3>
                <p>{match.professional.headline}</p>
                <h4>Requirement gaps</h4>
                <ul>{match.hardConstraintFailures.map((failure) => <li key={failure}>{failure}</li>)}</ul>
                <p className="near-match-note">Update the confirmed requirements before this professional can be invited.</p>
                <Link className="secondary-action full-width" href={`/professionals/${match.professional.id}?request=${request.id}`}>
                  View profile and evidence
                </Link>
              </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
