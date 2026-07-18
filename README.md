# ShohojSheba

> Verified professionals. Explainable matching. Human decisions.

ShohojSheba is an OpenAI Build Week project for trustworthy temporary healthcare staffing in Bangladesh. It turns a clinic's plain-language shift request into reviewed requirements, an explainable shortlist, evidence-aware credential review, and a human-controlled invitation and assignment.

## The problem

Small clinics and diagnostic centres may need qualified temporary staff with little notice. Translating an urgent need into requirements, comparing availability and skills, reviewing credential evidence, and coordinating both sides is slow and inconsistent.

ShohojSheba demonstrates a safer alternative to a generic job board:

- hard requirements control eligibility;
- every recommendation shows its evidence and uncertainty;
- credential records disclose their source and review state;
- AI cannot override a failed hard constraint;
- the clinic and professional make separate final decisions.

## Multi-profession demo

The clinic dashboard presents five complete staffing journeys: doctor coverage, registered nursing, laboratory technology, physiotherapy, and caregiving. Each role has fictional professionals, credential evidence, availability, rates, eligible matches, and visible hard-rule exclusions.

## Golden demo journey

1. A clinic describes an overnight staffing need naturally.
2. The request is converted into editable structured requirements.
3. A human confirms the requirements before matching.
4. Deterministic rules exclude candidates who fail profession, registration, skill, availability, or budget requirements.
5. Eligible candidates receive a transparent score and evidence-based explanation.
6. The clinic reviews synthetic credential evidence and pending items.
7. The clinic confirms an invitation.
8. The professional independently accepts.
9. ShohojSheba creates a concise fictional staffing brief.

Start at `/dashboard`, choose any role, or run the full scripted journey from `/requests/new`. All people, organisations, credentials, and assignments are fictional.

## Safety and product boundaries

This prototype is not a medical service, licence authority, autonomous hiring system, or public marketplace. It contains no real patient or professional data. It does not claim that AI authenticated a government record. Final identity, credential, and employment checks remain the organisation's responsibility.

The competition scope intentionally excludes payments, real registration checks, authentication, contact exchange, attendance, disputes, and other profession verticals.

## GPT-5.6 design

The staffing-request workflow uses `gpt-5.6-sol` through the OpenAI Responses API with a strict JSON schema and domain validation. The server-only integration was validated against the live model on July 18, 2026. A visibly labelled deterministic fallback keeps the scripted journey runnable when `OPENAI_API_KEY`, quota, or network access is unavailable.

The model is allowed to parse intent and explain evidence. It is never allowed to change eligibility, fabricate credential evidence, send an invitation, or accept on behalf of a person.

## Built with Codex

The application was created in a fresh repository during OpenAI Build Week with Codex as the primary engineering workspace. The founder supplied the product vision, clinic-domain judgment, workflow decisions, and final review. Codex performed the repository setup, architecture, implementation, testing, browser QA, responsive review, documentation, and repair loops.

The dated commit history records each controlled phase:

- foundation and product boundaries;
- application scaffold and fictional domain data;
- reviewed staffing-request extraction;
- deterministic eligibility and explainable matching;
- credential evidence and candidate review;
- invitation, acceptance, and assignment journey;
- accessibility, recovery, and demo repeatability;
- deployment and submission preparation.

See [`docs/build-log.md`](docs/build-log.md) and [`docs/decisions.md`](docs/decisions.md) for the detailed evidence trail.

## Technical structure

- Next.js App Router, React, and strict TypeScript
- Typed repository boundary with deterministic in-memory demo data
- Pure domain services for matching, credential review, invitations, and assignments
- Vitest and Testing Library
- ESLint, strict TypeScript validation, and production builds
- Responsive and accessibility-focused interface

## Run locally

Requirements: Node.js 22 or newer and pnpm 11.

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000/dashboard` to review the clinic operations dashboard.

Optional server-side model configuration:

```bash
cp .env.example .env.local
```

Set `OPENAI_API_KEY` only in `.env.local` or the deployment environment. Never prefix it with `NEXT_PUBLIC_` and never commit it.

## Validate

```bash
pnpm check
```

The command runs linting, strict type checking, all tests, and the production build.

## Submission materials

- [`docs/submission.md`](docs/submission.md) — Devpost-ready project copy and checklist
- [`docs/demo-script.md`](docs/demo-script.md) — video storyboard under three minutes
- [`docs/deployment.md`](docs/deployment.md) — deployment and environment checklist
- [`docs/product-brief.md`](docs/product-brief.md) — scope and success criteria
- [`docs/architecture.md`](docs/architecture.md) — system and safety boundaries
- [`docs/implementation-plan.md`](docs/implementation-plan.md) — staged build plan

## Licence

MIT. See [`LICENSE`](LICENSE).
