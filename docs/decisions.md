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

