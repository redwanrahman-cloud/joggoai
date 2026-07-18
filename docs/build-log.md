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

## 2026-07-18 — Phase 4

Completed:

- Added deterministic eligibility checks for profession, registration, skills, full-shift availability, and budget.
- Guaranteed that scoring cannot override a failed hard requirement.
- Added transparent eligible-candidate scoring from reliability, experience, completed demo assignments, and area fit.
- Added a recommended shortlist with evidence, metrics, credential status, and uncertainty flags.
- Added an excluded-candidate section with exact hard-failure reasons.
- Connected the confirmed staffing request to its matching route.

Validation:

- ESLint passed with zero warnings.
- TypeScript strict checking passed.
- Nine tests passed across matching, extraction, domain invariant, and UI suites.
- Tests prove expired registration and missing skills force exclusion and a zero score.
- Next.js production build completed successfully.
- Dynamic `/requests/[id]/matches` and static request-entry routes built successfully.
- Browser review passed on desktop and a 390×844 mobile viewport with no console warnings or errors.

Known limitations:

- Distance and travel time are not calculated; area differences appear as explicit uncertainty flags.
- Match explanations are deterministic until the live GPT-5.6 explanation gateway is enabled.
- Candidate review and credential-document inspection begin in Phase 5.

## 2026-07-18 — Phase 5

Completed:

- Added a candidate profile connected directly from the recommended match.
- Added synthetic credential evidence cards with issuer, masked reference, expiry, source, and review state.
- Added deterministic credential review findings for reviewed, pending, missing, and expired evidence.
- Added blocking behavior for missing, expired, or unreviewed professional registration.
- Added an evidence provenance boundary stating that Joggo AI does not authenticate government records.
- Kept the invitation action visibly disabled for the Phase 6 human-controlled assignment workflow.

Validation:

- ESLint passed with zero warnings.
- TypeScript strict checking passed.
- Eleven tests passed across credential review, matching, extraction, domain invariants, and UI.
- Tests prove expired registration blocks a candidate and pending supporting evidence produces a caution.
- Next.js production build completed successfully with the dynamic candidate-profile route.
- Browser review passed at desktop and a 390×844 mobile viewport with no horizontal overflow or console warnings and errors.

Known limitations:

- Credential review is deterministic and uses fictional records; no government or external registry is connected.
- Uploaded document contents are represented by synthetic metadata rather than live file extraction.
- Invitation and assignment state begin in Phase 6.

## 2026-07-18 — Phase 6

Completed:

- Added typed invitation preparation and professional acceptance transitions.
- Prevented invitations when matching hard constraints fail or credential review is blocked.
- Added a clinic-side final invitation review with rate, shift, skills, and caution disclosure.
- Added a professional-side invitation inbox view with explicit acceptance control.
- Added confirmed assignment creation only after acceptance.
- Added a final staffing brief with both parties, shift, agreed rate, handover notes, and status.
- Completed the golden journey from staffing request through confirmed coverage.

Validation:

- ESLint passed with zero warnings.
- TypeScript strict checking passed.
- Fourteen tests passed across assignment transitions, credential review, matching, extraction, domain invariants, and UI.
- Tests prove ineligible candidates cannot be invited and assignment creation follows acceptance.
- Next.js production build completed with clinic invitation, professional invitation, and assignment routes.
- The full browser journey passed through all three new screens.
- The final brief passed at a 390×844 mobile viewport with four summary cards, confirmed status, and no horizontal overflow.

Known limitations:

- Demo transitions are reproducible route states rather than durable database writes.
- Authentication, notifications, decline handling, cancellation, attendance, and contact exchange are outside this competition scope.
- Dates and timestamps remain fixed to the fictional Build Week scenario.

## 2026-07-18 — Phase 7

Completed:

- Added a global skip link and consistent main-content targets across every route.
- Added visible keyboard focus treatment for links and buttons.
- Added an accessible route-loading state with polite status announcement.
- Added recoverable missing-record and runtime-error screens that preserve demo safety boundaries.
- Added a one-click reset from the confirmed assignment to a fresh staffing request.
- Added clear landing-page guidance that the repeatable demo needs no account, payment, or real data.
- Normalised primary action links so interaction styling is consistent across the journey.

Validation:

- ESLint passed with zero warnings.
- TypeScript strict checking passed.
- Sixteen tests passed across route states, assignment transitions, credential review, matching, extraction, domain invariants, and UI.
- Next.js production build completed successfully for every static and dynamic route.
- Browser regression confirmed the skip-link contract, missing-record recovery, final assignment status, and demo reset destination.
- The mobile 404 recovery state passed at 390×844 with no horizontal overflow or console warnings and errors.

Known limitations:

- Automated end-to-end testing is not yet part of the repository; the competition golden path is browser-validated through Codex sessions.
- Authentication, durable persistence, external registries, and production observability remain outside this prototype.
- Final deployment and submission artifacts begin in Phase 8.
