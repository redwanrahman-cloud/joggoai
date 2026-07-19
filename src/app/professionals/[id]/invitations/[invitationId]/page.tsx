import Link from "next/link";
import { notFound } from "next/navigation";
import { createDemoRepository } from "../../../../../data/demo-repository";
import { prepareInvitation } from "../../../../../features/assignments/assignment-workflow";
import { resolveEffectiveRequest, SCOPE_ADJUSTMENT_KEY } from "../../../../../features/adjustments/scope-adjustment";

function formatShift(value: string) { return new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Dhaka", day: "numeric", month: "short", hour: "numeric", minute: "2-digit", hour12: true }).format(new Date(value)); }

export default async function ProfessionalInvitationPage({ params, searchParams }: {
  params: Promise<{ id: string; invitationId: string }>;
  searchParams: Promise<{ request?: string; adjustment?: string }>;
}) {
  const { id, invitationId } = await params;
  const { request: requestId = "request-icu-night", adjustment } = await searchParams;
  const repository = createDemoRepository();
  const professional = repository.getProfessional(id);
  const baseRequest = repository.getStaffingRequest(requestId);
  if (!professional || !baseRequest) notFound();
  let request;
  try {
    request = resolveEffectiveRequest(baseRequest, professional, repository, adjustment);
  } catch {
    notFound();
  }
  const hasAdjustment = adjustment === SCOPE_ADJUSTMENT_KEY;
  const organisation = repository.getOrganisation(request.organisationId);
  if (!organisation) notFound();
  const preview = prepareInvitation(request, organisation, professional, repository);
  if (invitationId !== preview.invitation.id) notFound();

  return (
    <main className="invitation-view" id="main-content">
      <header className="site-header">
        <Link className="brand" href="/"><span className="brand-mark" aria-hidden="true">S</span><span>ShohojSheba</span></Link>
        <span className="demo-badge">Professional demo view</span>
      </header>
      <section className="invitation-card">
        <span className="status-pill">Invitation received</span>
        <p className="eyebrow">Hello, {professional.displayName}</p>
        <h1>{organisation.name} invited you to a shift.</h1>
        <p className="lead">Review the complete terms before choosing. The clinic cannot accept on your behalf.</p>
        {hasAdjustment && <div className="amended-contract-note"><strong>Amended assignment · request v2</strong><span>You are accepting the revised duties shown below. Removed duties are not part of this contract.</span></div>}
        <dl className="terms-list compact">
          <div><dt>Shift</dt><dd>{formatShift(request.requirement.startsAt)} → {formatShift(request.requirement.endsAt)}</dd></div>
          <div><dt>Location</dt><dd>{request.requirement.area}, Dhaka</dd></div>
          <div><dt>Skills requested</dt><dd>{request.requirement.requiredSkills.join(", ")}</dd></div>
          <div><dt>Payment</dt><dd>BDT {preview.estimatedTotalBdt.toLocaleString()} estimated</dd></div>
        </dl>
        <div className="invitation-actions">
          <Link className="primary-action" href={`/assignments/${request.id}?professional=${professional.id}${hasAdjustment ? `&adjustment=${SCOPE_ADJUSTMENT_KEY}` : ""}`}>Accept invitation</Link>
          <span className="secondary-action" aria-disabled="true">Decline · demo disabled</span>
        </div>
        <p className="demo-footnote">Synthetic Build Week workflow · acceptance creates a fictional confirmed assignment.</p>
      </section>
    </main>
  );
}
