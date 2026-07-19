import Link from "next/link";
import { notFound } from "next/navigation";
import { createDemoRepository } from "../../../../../data/demo-repository";
import { prepareInvitation } from "../../../../../features/assignments/assignment-workflow";
import { FlowTrail } from "../../../../../components/flow-trail";
import { resolveEffectiveRequest, SCOPE_ADJUSTMENT_KEY } from "../../../../../features/adjustments/scope-adjustment";

function formatShift(value: string) { return new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Dhaka", day: "numeric", month: "short", hour: "numeric", minute: "2-digit", hour12: true }).format(new Date(value)); }

export default async function NewInvitationPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ professional?: string; adjustment?: string }>;
}) {
  const { id } = await params;
  const { professional: professionalId = "pro-nusrat-jahan", adjustment } = await searchParams;
  const repository = createDemoRepository();
  const baseRequest = repository.getStaffingRequest(id);
  const professional = repository.getProfessional(professionalId);
  if (!baseRequest || !professional) notFound();
  let request;
  try {
    request = resolveEffectiveRequest(baseRequest, professional, repository, adjustment);
  } catch {
    notFound();
  }
  const hasAdjustment = adjustment === SCOPE_ADJUSTMENT_KEY;
  const organisation = repository.getOrganisation(request.organisationId);
  if (!organisation) notFound();

  let preview;
  try {
    preview = prepareInvitation(
      request,
      organisation,
      professional,
      repository,
    );
  } catch {
    notFound();
  }

  return (
    <main id="main-content">
      <header className="site-header">
        <Link className="brand" href="/"><span className="brand-mark" aria-hidden="true">S</span><span>ShohojSheba</span></Link>
        <span className="demo-badge">Clinic confirmation</span>
      </header>
      <div className="decision-shell">
        <FlowTrail
          current={5}
          label="Clinic coordinator journey"
          steps={[
            { label: "Request", href: "/requests/new" },
            { label: "Shortlist", href: `/requests/${request.id}/matches` },
            { label: "Compare", href: `/requests/${request.id}/compare` },
            { label: "Verify", href: `/professionals/${professional.id}?request=${request.id}` },
            { label: "Invite" },
          ]}
        />
        <Link className="back-link" href={`/professionals/${professional.id}?request=${request.id}${hasAdjustment ? `&adjustment=${SCOPE_ADJUSTMENT_KEY}` : ""}`}>← Back to candidate</Link>
        <div className="decision-grid">
          <section className="decision-main">
            <p className="eyebrow">Final human review</p>
            <h1>Confirm the invitation</h1>
            <p className="lead">Nothing is sent until the clinic coordinator confirms these terms.</p>
            {hasAdjustment && <div className="amended-contract-note"><strong>Amended contract · request v2</strong><span>Removed duties are excluded from this invitation and remain recorded in the audit trail.</span></div>}
            <div className="party-card">
              <span className="profile-monogram" aria-hidden="true">{professional.displayName.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase()}</span>
              <div><small>Inviting</small><h2>{professional.displayName}</h2><p>{professional.headline}</p></div>
            </div>
            <dl className="terms-list">
              <div><dt>Organisation</dt><dd>{organisation.name}</dd></div>
              <div><dt>Shift</dt><dd>{formatShift(request.requirement.startsAt)} → {formatShift(request.requirement.endsAt)}</dd></div>
              <div><dt>Location</dt><dd>{request.requirement.area}, Dhaka</dd></div>
              <div><dt>Required skills</dt><dd>{request.requirement.requiredSkills.join(", ")}</dd></div>
              <div><dt>Rate</dt><dd>BDT {professional.expectedHourlyRateBdt} per hour</dd></div>
              <div><dt>Estimated total</dt><dd>BDT {preview.estimatedTotalBdt.toLocaleString()} · {preview.totalHours} hours</dd></div>
            </dl>
          </section>
          <aside className="decision-aside">
            <p className="eyebrow">Before sending</p>
            <h2>Coordinator declaration</h2>
            <ul className="check-list">
              <li>Requirements and rate have been reviewed.</li>
              <li>Credential evidence and any cautions are understood.</li>
              <li>No patient information is included.</li>
              <li>The professional may accept or decline.</li>
            </ul>
            <div className="review-boundary"><strong>Human action</strong><p>This confirmation—not an AI score—creates the invitation.</p></div>
            <Link className="primary-action full-width" href={`/professionals/${professional.id}/invitations/${preview.invitation.id}?request=${request.id}${hasAdjustment ? `&adjustment=${SCOPE_ADJUSTMENT_KEY}` : ""}`}>
              Confirm and send invitation
            </Link>
          </aside>
        </div>
      </div>
    </main>
  );
}
