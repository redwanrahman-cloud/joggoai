# Architecture decision log

## ADR-001: Narrow the submission to healthcare staffing

Status: accepted on 2026-07-18.

The long-term vision may cover multiple regulated professions, but the competition build will demonstrate one coherent healthcare staffing workflow. This protects product quality and makes evaluation straightforward.

## ADR-002: Human-controlled, hybrid matching

Status: accepted on 2026-07-18.

Deterministic rules enforce hard eligibility constraints. AI extracts intent and generates evidence-grounded explanations. A human reviews requirements and makes the final invitation decision.

## ADR-003: Synthetic data only

Status: accepted on 2026-07-18.

The competition version will not store real patient or professional data. Fictional data avoids privacy risk and makes the demo repeatable.

## ADR-004: Modular monolith for the MVP

Status: accepted on 2026-07-18.

A single typed web application is faster to build, test, and deploy than separate services. Domain and AI boundaries remain explicit so future extraction is possible.

## ADR-005: Graceful AI fallback

Status: accepted on 2026-07-18.

The scripted demo must remain functional when credentials, quota, or network access fail. Fallback output is visibly identified and uses the same validation contract as live model output.

## ADR-006: Repository boundary before durable persistence

Status: accepted on 2026-07-18.

The competition build uses a typed repository backed by deterministic, fictional in-memory data. This avoids deployment-specific database behavior while the golden workflow is still changing. Domain services depend on the repository interface, so a durable adapter can be introduced later without rewriting the workflow.

## ADR-007: Extraction contract works without live model access

Status: accepted on 2026-07-18.

Request extraction returns one validated contract whether it comes from GPT-5.6 Sol or the deterministic competition fallback. The interface always identifies fallback output, surfaces warnings, and requires human review before confirmation. This keeps the demo reliable without disguising scripted output as AI-generated output.

## ADR-008: Eligibility precedes scoring

Status: accepted on 2026-07-18.

Profession, verified registration, required skills, full-shift availability, and budget are hard constraints. A candidate who fails any hard constraint receives no match score and cannot appear in the recommended shortlist. Transparent scoring uses reliability, experience, completed demo assignments, and area fit only after eligibility is established.

## ADR-009: Credential review reports evidence provenance, not authenticity

Status: accepted on 2026-07-18.

The candidate profile labels every credential by its evidence source and review state. ShohojSheba may organise evidence, identify expiry and missing support, and prepare a human checklist, but it must not claim that AI authenticated a government registration. The competition build uses visibly synthetic records and keeps invitation disabled until the next human-controlled workflow phase.

## ADR-010: Demo state transitions are deterministic and URL-addressable

Status: accepted on 2026-07-18.

The competition journey represents invitation and assignment stages as reproducible routes backed by typed transition functions. This makes the demo reliable without pretending that in-memory state is durable. Domain rules still prevent invitations to ineligible professionals and prevent assignment creation before professional acceptance. Durable persistence, authentication, notifications, and concurrency controls remain post-competition work.

## ADR-011: Guided journeys make decision boundaries visible

Status: accepted on 2026-07-20.

Clinic coordination is presented as one visible sequence: request, shortlist, compare, verify, and invite. Professional registration is presented as resume intake, profile review, and evidence completion. The shortlist places comparison beside the strongest recommendation and describes safe near matches immediately afterward. This improves discoverability without relaxing hard eligibility: near matches retain explicit gaps and remain impossible to invite until the confirmed requirements change.

## ADR-012: Conditional matches require separately recorded, mutually accepted terms

Status: accepted on 2026-07-20.

A near match may proceed only when every remaining gap is negotiable and an amended assignment makes the candidate eligible. The first supported negotiation is removal of an unsupported duty from the assignment scope. The original requirements remain preserved, the amended assignment explicitly records excluded duties, an authorised clinic user confirms the change, and the professional later accepts the amended invitation. Wrong profession, missing registration, availability, budget, and unresolved non-scope failures cannot use this path. This creates flexibility without a generic safety override.

## ADR-013: Confirmed demo requirements remain URL-addressable

Status: accepted on 2026-07-20.

The competition build carries the human-confirmed requirement as validated, URL-addressable demo state. Every downstream ranking, comparison, credential review, invitation, briefing, and assignment reconstructs the same requirement instead of silently returning to a seeded scenario. Malformed state is ignored in favour of the known fictional seed. Durable server-side persistence and signed state remain production work.

## ADR-014: User-facing language describes the staffing decision, not internal versioning

Status: accepted on 2026-07-20.

Internal audit metadata may retain a version number, but clinic and professional screens use “original confirmed requirements,” “proposed amended assignment,” and “amended assignment accepted.” This makes the workflow understandable without weakening the original-versus-amended audit trail.

## ADR-015: Route validation returns explicit domain results

Status: accepted on 2026-07-20.

Judge-facing invitation routes use non-throwing domain validation and render a helpful review state for invalid selections. This prevents hosting-runtime control-flow signals from being mistaken for a missing fictional record while preserving every eligibility and credential rule.
