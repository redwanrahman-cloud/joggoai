import Link from "next/link";
import { notFound } from "next/navigation";
import { FlowTrail } from "../../../../../components/flow-trail";
import { createDemoRepository } from "../../../../../data/demo-repository";
import { AdjustmentConfirmation } from "../../../../../features/adjustments/adjustment-confirmation";
import { createScopeAdjustment, SCOPE_ADJUSTMENT_KEY } from "../../../../../features/adjustments/scope-adjustment";

export default async function ScopeAdjustmentPage({ params }: {
  params: Promise<{ id: string; professionalId: string }>;
}) {
  const { id, professionalId } = await params;
  const repository = createDemoRepository();
  const request = repository.getStaffingRequest(id);
  const professional = repository.getProfessional(professionalId);
  if (!request || !professional) notFound();

  let proposal;
  try {
    proposal = createScopeAdjustment(request, professional, repository);
  } catch {
    notFound();
  }

  const continueHref = `/professionals/${professional.id}?request=${request.id}&adjustment=${SCOPE_ADJUSTMENT_KEY}`;

  return (
    <main id="main-content">
      <header className="site-header">
        <Link className="brand" href="/"><span className="brand-mark" aria-hidden="true">S</span><span>ShohojSheba</span></Link>
        <span className="demo-badge">Conditional match · amended terms</span>
      </header>
      <div className="decision-shell">
        <FlowTrail current={3} label="Conditional selection journey" steps={[
          { label: "Identify gap", href: `/professionals/${professional.id}?request=${request.id}` },
          { label: "Revise scope" },
          { label: "Clinic confirms" },
          { label: "Verify" },
          { label: "Professional accepts" },
        ]} />
        <Link className="back-link" href={`/professionals/${professional.id}?request=${request.id}`}>← Back to profile</Link>
        <section className="adjustment-heading">
          <p className="eyebrow">Conditional match · request version 2</p>
          <h1>Negotiate the scope, not the safety rules.</h1>
          <p>{professional.displayName} can move forward only if both sides agree that the removed duties are outside this assignment.</p>
        </section>
        <div className="scope-comparison">
          <article>
            <span>Original request · v1</span>
            <h2>Required duties</h2>
            <ul>{proposal.originalRequest.requirement.requiredSkills.map((skill) => <li key={skill}>{skill}</li>)}</ul>
          </article>
          <article className="revised">
            <span>Proposed contract · v2</span>
            <h2>Revised duties</h2>
            <ul>{proposal.revisedRequest.requirement.requiredSkills.map((skill) => <li key={skill}>{skill}</li>)}</ul>
            <div className="removed-scope"><strong>Explicitly excluded</strong>{proposal.removedSkills.map((skill) => <span key={skill}>{skill}</span>)}</div>
          </article>
        </div>
        <div className="adjustment-audit"><strong>Audit note</strong><p>{proposal.auditNote}</p><span>Original request remains preserved. This proposal creates version 2.</span></div>
        <AdjustmentConfirmation continueHref={continueHref} />
      </div>
    </main>
  );
}
