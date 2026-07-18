import Link from "next/link";
import { notFound } from "next/navigation";
import { createDemoRepository } from "../../../data/demo-repository";
import { acceptInvitation, prepareInvitation } from "../../../features/assignments/assignment-workflow";

function formatShift(value: string) { return new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Dhaka", day: "numeric", month: "short", hour: "numeric", minute: "2-digit", hour12: true }).format(new Date(value)); }

export default async function AssignmentPage({ params, searchParams }: {
  params: Promise<{ requestId: string }>;
  searchParams: Promise<{ professional?: string }>;
}) {
  const { requestId } = await params;
  const { professional: professionalId = "pro-nusrat-jahan" } = await searchParams;
  const repository = createDemoRepository();
  const request = repository.getStaffingRequest(requestId);
  const professional = repository.getProfessional(professionalId);
  if (!request || !professional) notFound();
  const organisation = repository.getOrganisation(request.organisationId);
  if (!organisation) notFound();
  const brief = acceptInvitation(prepareInvitation(request, organisation, professional, repository));

  return (
    <main id="main-content">
      <header className="site-header">
        <Link className="brand" href="/"><span className="brand-mark" aria-hidden="true">S</span><span>ShohojSheba</span></Link>
        <span className="demo-badge">Fictional assignment</span>
      </header>
      <section className="success-shell">
        <span className="success-mark" aria-hidden="true">✓</span>
        <p className="eyebrow">Invitation accepted · assignment confirmed</p>
        <h1>The shift is covered.</h1>
        <p className="lead">Both sides reviewed the terms. Here is the final staffing brief.</p>
        <div className="brief-grid">
          <article><small>Professional</small><strong>{professional.displayName}</strong><span>{professional.headline}</span></article>
          <article><small>Organisation</small><strong>{organisation.name}</strong><span>{organisation.area}, Dhaka</span></article>
          <article><small>Shift</small><strong>{formatShift(brief.assignment.startsAt)}</strong><span>{brief.totalHours} hours · ends {formatShift(brief.assignment.endsAt)}</span></article>
          <article><small>Agreed rate</small><strong>BDT {brief.assignment.hourlyRateBdt}/hour</strong><span>BDT {brief.estimatedTotalBdt.toLocaleString()} estimated</span></article>
        </div>
        <div className="brief-footer">
          <div><h2>Handover notes</h2><ul>{brief.safetyNotes.map((note) => <li key={note}>{note}</li>)}</ul></div>
          <div className="assignment-id"><small>Demo assignment</small><strong>{brief.assignment.id}</strong><span>Status · confirmed</span></div>
        </div>
        <div className="completion-actions">
          <Link className="primary-action" href="/requests/new">Reset and run demo again</Link>
          <Link className="secondary-link" href="/">Return to ShohojSheba</Link>
        </div>
      </section>
    </main>
  );
}
