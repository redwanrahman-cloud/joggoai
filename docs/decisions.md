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

The candidate profile labels every credential by its evidence source and review state. Joggo AI may organise evidence, identify expiry and missing support, and prepare a human checklist, but it must not claim that AI authenticated a government registration. The competition build uses visibly synthetic records and keeps invitation disabled until the next human-controlled workflow phase.
