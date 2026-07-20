import Link from "next/link";
import { notFound } from "next/navigation";
import { createDemoRepository } from "../../../../../data/demo-repository";
import { prepareInvitation } from "../../../../../features/assignments/assignment-workflow";
import { resolveEffectiveRequest, SCOPE_ADJUSTMENT_KEY } from "../../../../../features/adjustments/scope-adjustment";
import { applyConfirmedRequirement, withConfirmedRequirement } from "../../../../../features/staffing-request/confirmed-requirement";

function formatShift(value: string) { return new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Dhaka", day: "numeric", month: "short", hour: "numeric", minute: "2-digit", hour12: true }).format(new Date(value)); }

export default async function ProfessionalInvitationPage({ params, searchParams }: {
  params: Promise<{ id: string; invitationId: string }>;
  searchParams: Promise<{ request?: string; adjustment?: string; requirement?: string; declined?: string }>;
}) {
  const { id, invitationId } = await params;
  const { request: requestId = "request-icu-night", adjustment, requirement: encodedRequirement, declined } = await searchParams;
  const repository = createDemoRepository();
  const professional = repository.getProfessional(id);
  const storedRequest = repository.getStaffingRequest(requestId);
  if (!professional || !storedRequest) notFound();
  const baseRequest = applyConfirmedRequirement(storedRequest, encodedRequirement);
  const requestHref = (href: string) => withConfirmedRequirement(href, encodedRequirement);
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

  if (declined === "1") return (
    <main className="invitation-view" id="main-content">
      <header className="site-header"><Link className="brand" href="/"><span className="brand-mark" aria-hidden="true">S</span><span>ShohojSheba</span></Link><span className="demo-badge">Professional demo view</span></header>
      <section className="invitation-card"><span className="status-pill declined-status">Invitation declined</span><p className="eyebrow">Response recorded</p><h1>You remain in control.</h1><p className="lead">This fictional invitation was declined. The clinic coordinator would be notified and the shift would return to the shortlist.</p><div className="invitation-actions"><Link className="primary-action" href={requestHref(`/requests/${request.id}/matches`)}>Return to shortlist</Link><Link className="secondary-action" href="/professionals/join">Professional profile demo</Link></div></section>
    </main>
  );

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
          <Link className="primary-action" href={requestHref(`/assignments/${request.id}?professional=${professional.id}${hasAdjustment ? `&adjustment=${SCOPE_ADJUSTMENT_KEY}` : ""}`)}>Accept invitation</Link>
          <Link className="secondary-action" href={requestHref(`/professionals/${professional.id}/invitations/${invitationId}?request=${request.id}${hasAdjustment ? `&adjustment=${SCOPE_ADJUSTMENT_KEY}` : ""}&declined=1`)}>Decline invitation</Link>
        </div>
        <p className="demo-footnote">Synthetic Build Week workflow · acceptance creates a fictional confirmed assignment.</p>
      </section>
    </main>
  );
}
