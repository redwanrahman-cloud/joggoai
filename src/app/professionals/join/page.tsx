import Link from "next/link";
import { ProfileBuilder } from "../../../features/profile-intake/profile-builder";

export default function ProfessionalJoinPage() {
  return (
    <main id="main-content">
      <header className="site-header">
        <Link className="brand" href="/"><span className="brand-mark" aria-hidden="true">S</span><span>ShohojSheba</span></Link>
        <span className="demo-badge">Professional onboarding · fictional demo</span>
      </header>
      <ProfileBuilder />
    </main>
  );
}
