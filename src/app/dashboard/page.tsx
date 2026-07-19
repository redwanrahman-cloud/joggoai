import Link from "next/link";
import { demoData } from "../../data/demo-data";
import { createDemoRepository } from "../../data/demo-repository";
import type { Profession } from "../../domain/types";
import { rankCandidates } from "../../features/matching/match-engine";

const professionLabels: Record<Profession, string> = {
  general_practitioner: "Doctor",
  registered_nurse: "Registered nurse",
  medical_technologist: "Lab technologist",
  physiotherapist: "Physiotherapist",
  caregiver: "Caregiver",
};

function shiftLabel(startsAt: string, endsAt: string) {
  const formatter = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Dhaka", hour: "numeric", minute: "2-digit", hour12: true });
  return `${formatter.format(new Date(startsAt))}–${formatter.format(new Date(endsAt))}`;
}

export default function DashboardPage() {
  const repository = createDemoRepository();
  const requests = demoData.staffingRequests.map((request) => {
    const matches = rankCandidates(request, repository);
    return { request, eligible: matches.filter((match) => match.eligible), excluded: matches.filter((match) => !match.eligible) };
  });
  const verifiedCredentials = demoData.credentials.filter((credential) => credential.status === "platform_verified").length;
  const reviewNeeded = demoData.credentials.filter((credential) => credential.status !== "platform_verified").length;

  return (
    <main id="main-content" className="dashboard-shell">
      <header className="dashboard-header">
        <Link className="brand" href="/" aria-label="ShohojSheba home"><span className="brand-mark" aria-hidden="true">S</span><span>ShohojSheba</span></Link>
        <div className="dashboard-header-actions"><Link className="secondary-action link-action" href="/professionals/join">Professional profile builder</Link><Link className="primary-action link-action" href="/requests/new">+ New staffing request</Link></div>
      </header>

      <section className="dashboard-welcome">
        <div><p className="eyebrow">Clinic operations · Sunday, 19 July</p><h1>Coverage at a glance.</h1><p>Review urgent shifts, trusted matches, and credential risks from one accountable workspace.</p></div>
        <div className="readiness-card"><span>Demo readiness</span><strong>5 workflows ready</strong><small>All decisions remain human-controlled</small></div>
      </section>

      <section className="metric-grid" aria-label="Staffing summary">
        <article><span>Open requests</span><strong>{requests.length}</strong><small>Across five care roles</small></article>
        <article><span>Eligible matches</span><strong>{requests.reduce((total, item) => total + item.eligible.length, 0)}</strong><small>Passed every hard rule</small></article>
        <article><span>Verified credentials</span><strong>{verifiedCredentials}</strong><small>Fictional demo reviews</small></article>
        <article className="attention-metric"><span>Needs attention</span><strong>{reviewNeeded}</strong><small>Pending or expired evidence</small></article>
      </section>

      <section className="dashboard-content">
        <div>
          <div className="section-title-row"><div><p className="eyebrow">Live staffing board</p><h2>Requests awaiting a decision</h2></div><span>{requests.length} active</span></div>
          <div className="request-board">
            {requests.map(({ request, eligible, excluded }) => (
              <article className="request-row" key={request.id}>
                <div className={`profession-icon ${request.requirement.profession}`} aria-hidden="true">{professionLabels[request.requirement.profession].slice(0, 1)}</div>
                <div className="request-row-main">
                  <div><span className="status-pill">Ready to match</span><h3>{professionLabels[request.requirement.profession]}</h3><p>{request.requirement.area} · {shiftLabel(request.requirement.startsAt, request.requirement.endsAt)}</p></div>
                  <div className="request-skill-row">{request.requirement.requiredSkills.map((skill) => <span key={skill}>{skill}</span>)}</div>
                </div>
                <div className="match-snapshot"><strong>{eligible.length}</strong><span>eligible</span><small>{excluded.length} excluded by hard rules</small></div>
                <Link className="secondary-action dashboard-link" href={`/requests/${request.id}/matches`}>Review matches →</Link>
              </article>
            ))}
          </div>
        </div>

        <aside className="operations-aside">
          <article className="operations-card dark-card"><p className="eyebrow">AI with boundaries</p><h2>Fast reasoning. Deterministic decisions.</h2><p>GPT‑5.6 Sol structures the request. Application rules decide eligibility. A person approves every invitation.</p><Link href="/requests/new">Try a different profession →</Link></article>
          <article className="operations-card"><p className="eyebrow">Credential watch</p><h3>Evidence requiring review</h3><ul><li><strong>1 expired</strong><span>Registration blocks eligibility</span></li><li><strong>2 pending</strong><span>Supporting records remain visible</span></li><li><strong>0 hidden</strong><span>Uncertainty is never suppressed</span></li></ul></article>
        </aside>
      </section>
    </main>
  );
}
