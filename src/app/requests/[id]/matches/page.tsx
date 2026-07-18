import Link from "next/link";
import { notFound } from "next/navigation";
import { createDemoRepository } from "../../../../data/demo-repository";
import { rankCandidates } from "../../../../features/matching/match-engine";

export default async function MatchResultsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const repository = createDemoRepository();
  const request = repository.getStaffingRequest(id);
  if (!request) notFound();

  const organisation = repository.getOrganisation(request.organisationId);
  const matches = rankCandidates(request, repository);
  const eligible = matches.filter((match) => match.eligible);
  const excluded = matches.filter((match) => !match.eligible);

  return (
    <main id="main-content">
      <header className="site-header">
        <Link className="brand" href="/">
          <span className="brand-mark" aria-hidden="true">J</span>
          <span>Joggo AI</span>
        </Link>
        <span className="demo-badge">Explainable demo ranking</span>
      </header>

      <div className="matches-shell">
        <section className="matches-heading">
          <div>
            <p className="eyebrow">Dhanmondi Community Care · ICU night coverage</p>
            <h1>{eligible.length} eligible professional</h1>
            <p>
              Hard requirements were checked first. Scores only compare professionals who passed every requirement.
            </p>
          </div>
          <div className="request-facts" aria-label="Confirmed request summary">
            <span>20 Jul · 8 PM–8 AM</span>
            <span>ICU + BLS</span>
            <span>≤ BDT {request.requirement.maxHourlyRateBdt}/hour</span>
            <span>{organisation?.name}</span>
          </div>
        </section>

        <section aria-labelledby="eligible-heading">
          <div className="section-title-row">
            <h2 id="eligible-heading">Recommended shortlist</h2>
            <span>{eligible.length} passed all hard requirements</span>
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

        <section className="excluded-section" aria-labelledby="excluded-heading">
          <div className="section-title-row">
            <h2 id="excluded-heading">Excluded by hard requirements</h2>
            <span>{excluded.length} candidates</span>
          </div>
          <div className="excluded-grid">
            {excluded.map((match) => (
              <article className="excluded-card" key={match.professional.id}>
                <p className="excluded-label">Not eligible</p>
                <h3>{match.professional.displayName}</h3>
                <p>{match.professional.headline}</p>
                <ul>{match.hardConstraintFailures.map((failure) => <li key={failure}>{failure}</li>)}</ul>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
