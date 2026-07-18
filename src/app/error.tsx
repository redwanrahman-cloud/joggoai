"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("ShohojSheba route error", error);
  }, [error]);

  return (
    <main className="state-shell" id="main-content">
      <span className="state-code" aria-hidden="true">!</span>
      <p className="eyebrow">Recoverable demo error</p>
      <h1>We could not prepare this step.</h1>
      <p>No invitation or assignment was created. Retry this screen or restart the deterministic demo journey.</p>
      <div className="actions">
        <button className="primary-action" type="button" onClick={reset}>Try again</button>
        <Link className="text-link" href="/requests/new">Restart the demo</Link>
      </div>
    </main>
  );
}
