import Link from "next/link";

type FlowStep = {
  label: string;
  href?: string;
};

export function FlowTrail({
  current,
  label,
  steps,
}: {
  current: number;
  label: string;
  steps: FlowStep[];
}) {
  return (
    <nav className="flow-trail" aria-label={label}>
      <p>{label}</p>
      <ol>
        {steps.map((step, index) => {
          const number = index + 1;
          const state = number < current ? "complete" : number === current ? "current" : "upcoming";
          const content = <><span>{number}</span>{step.label}</>;

          return (
            <li className={state} key={step.label}>
              {step.href ? <Link href={step.href}>{content}</Link> : <span className="flow-step">{content}</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
