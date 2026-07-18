# Architecture baseline

## Proposed stack

- Next.js with TypeScript for the web application and server routes
- Tailwind CSS for a focused design system
- Prisma with SQLite for a fast, portable local demo data store
- Zod schemas at every AI and server boundary
- OpenAI Responses API for request extraction and explanation generation
- Vitest for unit and integration tests
- Playwright for the golden browser journey

This stack is provisional until the foundation milestone confirms dependency availability and deployment compatibility.

## System shape

The application is a single deployable web app for the competition demo:

- Presentation: clinic and professional dashboards
- Application services: requests, matching, credentials, and assignments
- Domain rules: eligibility, scoring inputs, status transitions, and audit events
- Data access: Prisma repository over SQLite locally
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

