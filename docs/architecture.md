# Architecture baseline

## Proposed stack

- Next.js with TypeScript for the web application and server routes
- Plain CSS with shared design tokens for a focused design system
- A typed repository boundary with deterministic in-memory demo data
- Typed validation contracts at domain and AI boundaries
- OpenAI Responses API for request extraction and explanation generation
- Vitest for unit and integration tests
- Codex browser regression checks for the golden journey

The repository boundary keeps the competition build portable and deterministic. A durable database adapter can replace the in-memory implementation after the core workflow is proven.

## System shape

The application is a single deployable web app for the competition demo:

- Presentation: clinic and professional dashboards
- Application services: requests, matching, credentials, and assignments
- Domain rules: eligibility, scoring inputs, status transitions, and audit events
- Data access: typed repository backed by deterministic fictional seed data
- AI gateway: one isolated OpenAI client with validated structured outputs

## Core entities

- Organisation
- User
- ProfessionalProfile
- Credential
- AvailabilityWindow
- StaffingRequest
- StaffingRequirement
- MatchEvaluation
- Invitation
- Assignment
- AiRunAudit

## Matching boundary

Hard constraints are evaluated deterministically: profession, required credential state, shift coverage, required skills, and location/service area. Soft factors can contribute to a transparent score: relevant experience, distance band, reliability, and compensation fit.

The model may parse a request and explain evidence. It must not override failed hard constraints or fabricate evidence. Stored match records retain the inputs and explanation used for the demo audit trail.

## AI reliability

- Validate every model response against a strict schema.
- Show extracted requirements to a human before matching.
- Use bounded enums and explicit unknown states.
- Store prompt/version metadata without secrets or sensitive content.
- Provide deterministic seeded extraction for the scripted demo when no API key or model response is available.
- Never place an API key in browser code or Git.

## Security and privacy baseline

- Synthetic data only during Build Week
- Server-side model calls
- Environment variables for secrets
- File type and size controls before any credential upload work
- Neutral, non-clinical language and no patient records
- Visible demo-data labels
