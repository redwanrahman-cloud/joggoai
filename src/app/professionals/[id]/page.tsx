import Link from "next/link";
import { notFound } from "next/navigation";
import { createDemoRepository } from "../../../data/demo-repository";
import { reviewProfessionalCredentials } from "../../../features/credentials/credential-review";
import { evaluateCandidate, getCriteriaFitPercentage } from "../../../features/matching/match-engine";

const professionLabels = { general_practitioner: "Doctor", registered_nurse: "Registered nurse", medical_technologist: "Laboratory technologist", physiotherapist: "Physiotherapist", caregiver: "Caregiver" } as const;

const statusLabel = {
  platform_verified: "Reviewed for demo",
  uploaded_pending_review: "Uploaded · pending review",
  self_declared: "Self-declared",
  expired: "Expired",
  missing: "Missing",
};

export default async function ProfessionalProfilePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ request?: string }>;
}) {
  const { id } = await params;
  const { request: requestId = "request-icu-night" } = await searchParams;
  const repository = createDemoRepository();
  const professional = repository.getProfessional(id);
  const request = repository.getStaffingRequest(requestId);
  if (!professional || !request) notFound();

  const credentials = repository.listCredentials(id);
  const match = evaluateCandidate(request, professional, repository);
  const review = reviewProfessionalCredentials(professional, credentials);
  const initials = professional.displayName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const cautionCount = review.findings.filter(({ severity }) => severity === "caution").length;
  const expiredCount = credentials.filter(({ status }) => status === "expired").length;
  const reviewTitle = review.status === "blocked"
    ? "Blocked by credential evidence"
    : review.status === "ready"
      ? "Credential evidence ready"
      : `Eligible with ${cautionCount} caution${cautionCount === 1 ? "" : "s"}`;

  return (
    <main id="main-content">
      <header className="site-header">
        <Link className="brand" href="/">
          <span className="brand-mark" aria-hidden="true">S</span>
          <span>ShohojSheba</span>
        </Link>
        <span className="demo-badge">Synthetic credential review</span>
      </header>

      <div className="profile-shell">
        <Link className="back-link" href={`/requests/${request.id}/matches`}>← Back to matches</Link>
        <section className="profile-hero">
          <div className="profile-monogram" aria-hidden="true">{initials}</div>
          <div>
            <p className="eyebrow">Candidate profile · {professionLabels[professional.profession]}</p>
            <h1>{professional.displayName}</h1>
            <p>{professional.headline}</p>
            <div className="skill-row">{professional.skills.map((skill) => <span key={skill}>{skill}</span>)}</div>
          </div>
          <div className="profile-summary">
            <span><strong>{professional.reliabilityScore}%</strong> reliability</span>
            <span><strong>{professional.yearsExperience} years</strong> experience</span>
            <span><strong>{professional.completedDemoAssignments}</strong> demo assignments</span>
            <span><strong>BDT {professional.expectedHourlyRateBdt}</strong> per hour</span>
          </div>
        </section>

        {!match.eligible && (
          <section className="profile-gap-banner" aria-labelledby="profile-gap-heading">
            <div>
              <p className="eyebrow">Near match · {getCriteriaFitPercentage(match)}% criteria fit</p>
              <h2 id="profile-gap-heading">Requirements still need attention</h2>
            </div>
            <ul>{match.hardConstraintFailures.map((failure) => <li key={failure}>{failure}</li>)}</ul>
          </section>
        )}

        <section className="review-summary-card">
          <div>
            <p className="eyebrow">Credential review result</p>
            <h2>{reviewTitle}</h2>
            <p>{review.status === "ready" ? "Reviewed credential evidence satisfies the demo requirement. Original records must still be checked by the organisation." : "Registration satisfies the hard requirement. Supporting evidence and cautions still require human review before invitation."}</p>
          </div>
          <div className="evidence-counts">
            <span><strong>{review.reviewedEvidenceCount}</strong> reviewed</span>
            <span><strong>{review.pendingEvidenceCount}</strong> pending</span>
            <span><strong>{expiredCount}</strong> expired</span>
          </div>
        </section>

        <div className="profile-content-grid">
          <section aria-labelledby="documents-heading">
            <div className="section-title-row">
              <h2 id="documents-heading">Credential evidence</h2>
              <span>{credentials.length} fictional records</span>
            </div>
            <div className="credential-list">
              {credentials.map((credential) => (
                <article className="credential-card" key={credential.id}>
                  <div className={`credential-status ${credential.status}`}>{statusLabel[credential.status]}</div>
                  <div className="document-preview" aria-hidden="true">
                    <span>SHOHOJSHEBA · SYNTHETIC DOCUMENT</span>
                    <strong>{credential.type.replaceAll("_", " ")}</strong>
                    <small>Not a real credential</small>
                  </div>
                  <div className="credential-detail">
                    <h3>{credential.title}</h3>
                    <dl>
                      <div><dt>Issuer</dt><dd>{credential.issuingAuthority}</dd></div>
                      <div><dt>Reference</dt><dd>{credential.referenceNumberMasked ?? "Not supplied"}</dd></div>
                      <div><dt>Expiry</dt><dd>{credential.expiresOn ?? "Not applicable"}</dd></div>
                      <div><dt>Evidence source</dt><dd>{credential.source.replaceAll("_", " ")}</dd></div>
                    </dl>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <aside className="findings-panel" aria-labelledby="findings-heading">
            <p className="eyebrow">Human review checklist</p>
            <h2 id="findings-heading">What the evidence says</h2>
            <div className="finding-list">
              {review.findings.map((finding) => (
                <article className={`finding ${finding.severity}`} key={finding.id}>
                  <span aria-hidden="true">{finding.severity === "pass" ? "✓" : finding.severity === "block" ? "×" : "!"}</span>
                  <div><h3>{finding.title}</h3><p>{finding.detail}</p></div>
                </article>
              ))}
            </div>
            <div className="review-boundary">
              <strong>Human decision required</strong>
              <p>ShohojSheba organises evidence and flags gaps. It does not authenticate a government record or make the hiring decision.</p>
            </div>
            {match.eligible ? (
              <Link className="primary-action full-width" href={`/requests/${request.id}/invitations/new?professional=${professional.id}`}>
                Review invitation
              </Link>
            ) : (
              <>
                <Link className="primary-action full-width" href={`/requests/${request.id}/compare`}>
                  Compare with shortlist
                </Link>
                <p className="action-boundary">Invitation stays unavailable until the confirmed requirements are updated.</p>
              </>
            )}
          </aside>
        </div>
      </div>
    </main>
  );
}
