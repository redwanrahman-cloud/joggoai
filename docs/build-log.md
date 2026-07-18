# Build log

## 2026-07-18 — Phase 0

Completed:

- Inspected the laptop workspace and available development runtimes.
- Confirmed Git is installed; a bundled Node.js and package-manager runtime is available through Codex.
- Defined the product boundary, golden journey, architecture baseline, safety rules, and staged plan.
- Added persistent repository guidance and Git hygiene.

Validation:

- Documentation reviewed for consistency.
- No application dependencies, generated code, secrets, or real personal data added.

Known limitations:

- Proposed stack has not yet been scaffolded or validated.
- OpenAI API credentials and live model access have not yet been configured.
- Official competition rules must be rechecked before preparing the final submission package.

## 2026-07-18 — Phase 1

Completed:

- Scaffolded a strict TypeScript and Next.js application foundation.
- Added a responsive landing experience and initial Joggo AI design language.
- Made the synthetic-data and human-decision boundaries visible in the interface.
- Added ESLint, TypeScript, Vitest, Testing Library, and production-build scripts.
- Pinned the package-manager version and generated the dependency lockfile.
- Explicitly approved build scripts only for `sharp` and `unrs-resolver`.

Validation:

- ESLint passed with zero warnings.
- TypeScript strict checking passed.
- One foundation UI test passed.
- Next.js 16.2.10 production build completed successfully.
- Static `/` and `/_not-found` routes were generated.

Known limitations:

- The primary staffing workflow is intentionally not implemented in this phase.
- Browser-level workflow testing will be added after interactive behavior exists.
- The OpenAI API is not connected yet; `.env.example` contains a server-only placeholder.

## 2026-07-18 — Phase 2

Completed:

- Defined organisations, professionals, credentials, availability, staffing requests, matches, invitations, assignments, and AI audit records.
- Added two fictional healthcare organisations and four fictional professionals in Dhaka.
- Added mixed credential evidence states, including verified-demo, pending-review, and expired examples.
- Added deterministic shift availability and one confirmed ICU-night staffing request.
- Added a typed repository boundary for workflow access.
- Added cross-entity, score, date-range, credential-evidence, and hard-constraint invariants.
- Recorded the decision to defer durable persistence until the workflow is proven.

Validation:

- ESLint passed with zero warnings.
- TypeScript strict checking passed.
- Four tests passed across the UI and domain invariant suites.
- Next.js production build completed successfully.
- Static `/` and `/_not-found` routes were generated.

Known limitations:

- Data resets with each application process by design during the competition prototype.
- Matching evaluations, invitations, assignments, and AI audit collections are initially empty.
- The dataset is fictional and does not represent live professional registration verification.

## 2026-07-18 — Phase 3

Completed:

- Added a clinic-facing natural-language staffing request form.
- Added a typed extraction result with source, confidence, and warnings.
- Added a deterministic fallback for the scripted ICU-night scenario.
- Added editable profession, area, hourly rate, and required-skill fields.
- Added review validation and prevented confirmation of invalid requirements.
- Added an explicit human confirmation state before matching.
- Added prominent patient-data and fictional-data safety notices.
- Confirmed the Responses API and structured-output path for future GPT-5.6 Sol activation.

Validation:

- ESLint passed with zero warnings.
- TypeScript strict checking passed.
- Six tests passed across extraction, domain invariant, and UI suites.
- Next.js production build completed successfully.
- Static `/`, `/requests/new`, and `/_not-found` routes were generated.
- Human visual testing confirmed extraction, editing, warning, and confirmation states at a desktop viewport.

Known limitations:

- Live GPT-5.6 Sol extraction is not active until an OpenAI API credential is configured.
- The fallback resolves relative dates only for the scripted Build Week scenario and discloses this limitation.
- The confirmed request remains client-side until the matching workflow is connected.
