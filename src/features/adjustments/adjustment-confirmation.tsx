"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function AdjustmentConfirmation({ continueHref }: { continueHref: string }) {
  const router = useRouter();
  const [scopeConfirmed, setScopeConfirmed] = useState(false);
  const [authorityConfirmed, setAuthorityConfirmed] = useState(false);

  return (
    <section className="adjustment-confirmation" aria-labelledby="adjustment-confirmation-heading">
      <p className="eyebrow">Clinic confirmation</p>
      <h2 id="adjustment-confirmation-heading">Confirm the amended assignment scope.</h2>
      <label><input type="checkbox" checked={scopeConfirmed} onChange={(event) => setScopeConfirmed(event.target.checked)} /> The removed duties will not be assigned to this professional.</label>
      <label><input type="checkbox" checked={authorityConfirmed} onChange={(event) => setAuthorityConfirmed(event.target.checked)} /> I am authorised to propose this revised scope for professional acceptance.</label>
      <button className="primary-action" type="button" disabled={!scopeConfirmed || !authorityConfirmed} onClick={() => router.push(continueHref)}>
        Confirm v2 and continue
      </button>
      <p>The professional will review and accept or decline these amended terms in the invitation step.</p>
    </section>
  );
}
