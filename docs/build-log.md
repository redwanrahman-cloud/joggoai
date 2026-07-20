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
- Added a responsive landing experience and initial ShohojSheba design language.
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
- Added an evidence provenance boundary stating that ShohojSheba does not authenticate government records.
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

## 2026-07-18 — Phase 8 preparation

Completed:

- Rechecked the current OpenAI Build Week requirements and selected Work & Productivity.
- Reworked the README into a judge-facing product, safety, technical, setup, and Codex evidence guide.
- Added Devpost-ready short and full descriptions, differentiation, impact, testing path, and checklist.
- Added a timed demo-video storyboard designed to remain below three minutes.
- Added a deployment and post-deployment smoke-test checklist.
- Added an MIT licence for public repository judging.
- Created and inspected a project-specific social preview card with exact ShohojSheba messaging.
- Registered the ShohojSheba Sites project and persisted its opaque project identifier.
- Updated social metadata and made the test runner reliable in constrained environments.

Validation:

- The generated social card was visually inspected and its exact 1672×941 dimensions were recorded in metadata.
- ESLint passed with zero warnings.
- TypeScript strict checking passed.
- Sixteen tests passed using one controlled worker.
- Next.js production build completed successfully for every route.

Remaining submission actions:

- Preserve the validated server-only GPT-5.6 Sol key locally and configure it in the deployment environment.
- Publish this exact commit before saving a Sites version.
- Complete the production deployment and run the documented smoke test.
- Record and upload the public YouTube video.
- Retrieve the main Codex `/feedback` session ID.
- Submit the completed public links and Codex feedback ID on Devpost.

## Phase 9 — Live GPT-5.6 Sol activation and ShohojSheba brand

Completed:

- Added a server-only Responses API gateway with strict structured output and domain validation.
- Added automated coverage for the live request contract and failure handling.
- Validated the live `gpt-5.6-sol` path with a fictional Dhanmondi ICU/BLS nurse request.
- Confirmed the model returned the expected profession, area, overnight shift, skills, rate, confidence, and an explicit credential assumption warning.
- Preserved the disclosed deterministic fallback for missing credentials, quota, or network access.
- Renamed the product from Joggo AI to ShohojSheba across the interface, metadata, documentation, and social preview asset.
- Revalidated ESLint, TypeScript, all eighteen tests, and the production build.

## Phase 10 — Sites deployment adaptation

Completed:

- Preserved the standard Next.js development and production-build commands.
- Added a separate vinext/Cloudflare Sites build target and worker entry.
- Added automatic hosting-metadata packaging without exposing local environment files.
- Updated the existing private Sites project title to ShohojSheba.
- Verified the owner-only access policy before deployment.
- Ran ESLint, TypeScript, all eighteen tests, and the complete Sites build successfully.
- Confirmed the artifact contains the required worker entry, client assets, and `.openai/hosting.json`.

## Phase 11 — Private production deployment

Completed:

- Pushed the exact validated commit to the Sites source repository using a short-lived credential.
- Stored `OPENAI_API_KEY` as a hosted secret rather than in source or the deployment archive.
- Saved Sites version 1 and deployed it with owner-only access.
- Smoke-tested the production landing page, staffing-request page, and live GPT-5.6 Sol extraction route.
- Recorded the final Sites origin directly in social metadata after the provider rejected a runtime public-origin variable.

## Phase 12 — Multi-profession operations dashboard

Completed:

- Expanded the complete demo from one nurse scenario to doctor, nurse, laboratory technologist, physiotherapist, and caregiver workflows.
- Added eleven fictional professionals with role-specific credentials, availability, rates, skills, and transparent exclusions.
- Added a clinic operations dashboard with staffing metrics, five active requests, credential-risk signals, and direct matching paths.
- Preserved GPT-5.6 Sol for structured request understanding while deterministic code continues to own eligibility.
- Updated judge-facing documentation to present the broader product coherently.

Validation:

- ESLint passed with zero warnings.
- TypeScript strict checking passed.
- All twenty-seven tests passed, including the five-role dashboard and matching scenarios.
- The full Next.js production build completed successfully with the new static dashboard route.

## Phase 13 — Product-freeze review and bounded AI briefing

Completed:

- Visually inspected the deployed landing page and retained its established competition-ready direction.
- Removed nurse-specific and ICU-specific copy from the doctor, laboratory, physiotherapy, and caregiver downstream journeys.
- Made profession names, skills, dates, shift duration, initials, credential cautions, and assignment terms derive from the selected request.
- Added a second bounded GPT-5.6 Sol workflow that turns deterministic match evidence into a concise verification plan.
- Prevented the model from changing eligibility, inventing evidence, or making the final staffing decision.
- Added a disclosed deterministic briefing fallback for quota or network failure.

Validation:

- ESLint and strict TypeScript checks passed.
- All twenty-nine tests passed, including strict model-contract and decision-boundary coverage.
- Both the Next.js production build and the Sites deployment build completed successfully.

## Phase 14 — Final submission-readiness audit

Completed:

- Re-ran the full desktop journey from natural-language request through matching, credential review, invitation, professional acceptance, and confirmed assignment.
- Confirmed live GPT-5.6 Sol extraction on the deployed staffing-request workflow.
- Tested all seven judge-facing routes at a phone-sized viewport with no horizontal overflow.
- Reviewed tracked files for secrets and confirmed the local environment file remains ignored.
- Excluded disposable Sites staging directories from linting and source control.
- Polished the confirmed-request summary so role-specific skill names read naturally.
- Verified the public site, public demo video, repository links, and Codex feedback ID are recorded in the submission brief.

Validation:

- ESLint passed with zero warnings.
- TypeScript strict checking passed.
- All twenty-nine tests passed.
- The Next.js production build completed successfully.
- The public browser journey completed without console errors.

## 2026-07-20 — Phase 15: Connected human decision journeys

Completed:

- Audited the clinic coordinator and professional registration journeys as end-to-end human workflows.
- Added a persistent coordinator trail across shortlist, comparison, credential review, and invitation.
- Reframed shortlist results around one recommended match and two safe near matches.
- Moved the three-person comparison action above the recommendation and placed near matches directly after it.
- Added a professional registration trail from resume intake through human profile review and evidence completion.
- Added a clear route between professional onboarding and the clinic coordinator dashboard.
- Preserved the rule that near matches cannot be invited and AI does not authenticate credentials.

Validation:

- ESLint passed with zero warnings and strict TypeScript checking passed.
- All thirty-four tests passed, including new journey hierarchy and navigation coverage.
- The Next.js production build completed successfully.
- Browser checks passed at 390px and 1280px widths with no horizontal overflow.
- The comparison displayed three professionals; a near-match profile exposed no invitation action.
- Professional onboarding retained its complete three-step journey at phone width.
- No browser console errors were observed.

## 2026-07-20 — Phase 16: Comparison selection handoff

Completed:

- Added an explicit human-selection section after the comparison table.
- Eligible professionals now offer a clear “Select and continue” action into credential review.
- Near matches offer only “Review profile gaps” and cannot bypass eligibility or proceed directly to invitation.
- Preserved the verify-before-invite sequence in the clinic coordinator journey.

Validation:

- ESLint, strict TypeScript checking, and the production build passed.
- All thirty-five tests passed, including selection and near-match boundary coverage.
- Desktop and 390px browser checks showed both decision actions with no horizontal overflow.
- The comparison page exposed no direct invitation action.

## 2026-07-20 — Phase 17: Conditional matches and amended contracts

Completed:

- Added a conditional-match workflow for negotiable assignment-scope gaps.
- Preserved request version 1 and generated an auditable version 2 with unsupported duties explicitly removed.
- Required clinic confirmation that removed duties will not be assigned and that the coordinator has authority to propose the change.
- Recalculated eligibility against the revised request before enabling credential review or invitation.
- Carried the amended scope through clinic invitation review, professional acceptance, and the final assignment brief.
- Kept wrong-profession, registration, and other unresolved failures outside the negotiation path.
- Added direct “Propose adjusted terms” actions from comparison and near-match profiles.

Validation:

- ESLint, strict TypeScript checking, and the production build passed.
- All thirty-seven tests passed, including negotiable-scope and non-negotiable-failure coverage.
- Browser-tested Mehnaz Akter from v2 proposal through credential review, invitation, professional acceptance, and confirmed assignment.
- The amended invitation contained only “Sample handling” and excluded “Phlebotomy.”
- The new journey passed at 390px without horizontal overflow or browser console errors.

## 2026-07-20 — Phase 18: End-to-end requirement continuity and completion polish

Completed:

- Connected every human-confirmed staffing field to deterministic ranking instead of routing only by profession.
- Preserved the confirmed requirement through comparison, profile review, scope adjustment, AI briefing, invitation, professional response, and assignment.
- Normalised common GPT skill wording into the matching vocabulary.
- Rejected underspecified or non-staffing input with actionable guidance.
- Added a deterministic invitation-decline outcome and a professional profile-submission confirmation.
- Added the active-step accessibility state, a mobile comparison hint, and a sticky comparison label column.

Validation:

- ESLint, strict TypeScript checking, and forty-one automated tests passed before the final production build.
- Custom requirement decoding rejects malformed and invalid state and safely retains the fictional seeded request.
- Final README, video, and submission copy remain intentionally deferred until the next full judge walkthrough.
