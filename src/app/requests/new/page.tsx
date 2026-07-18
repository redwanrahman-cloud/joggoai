import Link from "next/link";
import { RequestBuilder } from "../../../features/staffing-request/request-builder";

export default function NewStaffingRequestPage() {
  return (
    <main id="main-content">
      <header className="site-header">
        <Link className="brand" href="/">
          <span className="brand-mark" aria-hidden="true">S</span>
          <span>ShohojSheba</span>
        </Link>
        <span className="demo-badge">Fictional demo data</span>
      </header>
      <RequestBuilder />
    </main>
  );
}
