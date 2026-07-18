import Link from "next/link";
import { notFound } from "next/navigation";
import { createDemoRepository } from "../../../data/demo-repository";
import { reviewProfessionalCredentials } from "../../../features/credentials/credential-review";

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
    <main>
      <header className="site-header">
        <Link className="brand" href="/">
          <span className="brand-mark" aria-hidden="true">J</span>
          <span>Joggo AI</span>
        </Link>
        <span className="demo-badge">Synthetic credential review</span>
      </header>

      <div className="profile-shell">
        <Link className="back-link" href={`/requests/${request.id}/matches`}>← Back to matches</Link>
        <section className="profile-hero">
          <div className="profile-monogram" aria-hidden="true">{initials}</div>
          <div>
            <p className="eyebrow">Candidate profile · Registered nurse</p>
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

        <section className="review-summary-card">
          <div>
            <p className="eyebrow">Credential review result</p>
            <h2>{reviewTitle}</h2>
            <p>Registration satisfies the hard requirement. Supporting ICU evidence still requires human review before invitation.</p>
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
                    <span>JOGGO AI · SYNTHETIC DOCUMENT</span>
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
              <p>Joggo AI organises evidence and flags gaps. It does not authenticate a government record or make the hiring decision.</p>
            </div>
            <button className="primary-action full-width" type="button" disabled>Send invitation · Phase 6</button>
          </aside>
        </div>
      </div>
    </main>
  );
}
