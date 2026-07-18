const milestones = [
  { label: "Request", detail: "Describe the shift in everyday language." },
  { label: "Review", detail: "Confirm structured requirements before matching." },
  { label: "Match", detail: "Compare eligible professionals with clear evidence." },
  { label: "Invite", detail: "A person makes the final staffing decision." },
];

export default function HomePage() {
  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Joggo AI home">
          <span className="brand-mark" aria-hidden="true">J</span>
          <span>Joggo AI</span>
        </a>
        <span className="demo-badge">Build Week demo</span>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow">Healthcare staffing · Bangladesh</p>
          <h1>Turn an urgent staffing need into a trusted shortlist.</h1>
          <p className="hero-text">
            Joggo AI helps clinics structure requests, check hard requirements,
            and understand candidate evidence—while people stay in control.
          </p>
          <div className="actions">
            <button className="primary-action" type="button" disabled>
              Start a staffing request
            </button>
            <span className="coming-soon">Workflow arrives in Phase 3</span>
          </div>
        </div>

        <aside className="trust-card" aria-label="Product trust principles">
          <p className="card-kicker">Designed for accountable decisions</p>
          <h2>Evidence before recommendation.</h2>
          <ul>
            <li>Hard eligibility rules cannot be bypassed by AI.</li>
            <li>Credential status and uncertainty remain visible.</li>
            <li>Every requirement is reviewed before matching.</li>
          </ul>
          <p className="synthetic-note">This competition prototype uses fictional data only.</p>
        </aside>
      </section>

      <section className="workflow" aria-labelledby="workflow-heading">
        <div>
          <p className="eyebrow">One focused journey</p>
          <h2 id="workflow-heading">From request to invitation</h2>
        </div>
        <ol className="milestone-grid">
          {milestones.map((milestone, index) => (
            <li key={milestone.label}>
              <span className="step-number">0{index + 1}</span>
              <h3>{milestone.label}</h3>
              <p>{milestone.detail}</p>
            </li>
          ))}
        </ol>
      </section>
    </main>
  );
}

