import Link from "next/link";

export default function NotFound() {
  return (
    <main className="state-shell" id="main-content">
      <span className="state-code" aria-hidden="true">404</span>
      <p className="eyebrow">Demo route not found</p>
      <h1>That fictional record is not available.</h1>
      <p>Return to the scripted journey to keep the Build Week demonstration in a known, repeatable state.</p>
      <div className="actions">
        <Link className="primary-action" href="/requests/new">Restart the demo</Link>
        <Link className="text-link" href="/">Go home</Link>
      </div>
    </main>
  );
}
