# ShohojSheba

> Verified professionals. Explainable matching. Human decisions.

ShohojSheba is an OpenAI Build Week project for accountable temporary healthcare staffing in Bangladesh. It helps a clinic turn an urgent staffing need into reviewed requirements, an evidence-based shortlist, a human-approved invitation, and a two-sided assignment decision.

- **Live demo:** https://joggo-ai-bd.najdhotel1.chatgpt.site
- **Final video:** https://youtu.be/qmo_5rDfucg
- **Judge starting point:** https://joggo-ai-bd.najdhotel1.chatgpt.site/dashboard
- **Submission track:** Work & Productivity

All people, organisations, credentials, availability windows, invitations, and assignments in the demo are fictional.

## Why this problem matters

Small clinics and diagnostic centres may need qualified temporary staff with little notice. A coordinator must translate the need into exact requirements, find available professionals, compare credentials and skills, keep unresolved gaps visible, agree on safe terms, and obtain acceptance from both sides.

Ordinary job boards expose profiles. ShohojSheba demonstrates the accountable decision workflow around them.

## What the product demonstrates

The clinic dashboard contains complete scenarios for five healthcare roles: doctors, registered nurses, laboratory technologists, physiotherapists, and caregivers.

Across those scenarios, ShohojSheba can:

1. structure a plain-language staffing request with GPT-5.6 Sol;
2. require human review before any requirement is confirmed;
3. enforce profession, reviewed registration, skills, full-shift availability, and budget in deterministic code;
4. rank only professionals who passed every hard rule;
5. show safe near matches with every unresolved gap;
6. compare three professionals side by side;
7. negotiate a missing-duty gap through a separately confirmed amended assignment;
8. organise synthetic credential evidence without claiming government verification;
9. let the clinic send an invitation and the professional independently accept or decline;
10. produce a final fictional staffing brief only after acceptance; and
11. turn a doctor or nurse resume into an evidence-aware profile draft with GPT-5.6 Sol.

## Three bounded GPT-5.6 workflows

ShohojSheba uses `gpt-5.6-sol` through the OpenAI Responses API for three narrow tasks.

### 1. Staffing-request extraction

The model converts natural language into a strict JSON staffing requirement. Application validation checks the result, and the coordinator reviews every field before matching.

### 2. Evidence-grounded match briefing

The model receives deterministic match results and produces a concise review plan. It cannot alter eligibility, invent credentials, or choose a professional.

### 3. Professional profile intake

The model organises pasted doctor or nurse resume text into a draft profile, missing-evidence checklist, and ethical improvement advice. Extracted claims remain unverified until a person reviews the documents.

Every AI boundary uses a strict JSON schema, server-side credentials, explicit warnings, and a visibly disclosed deterministic fallback. The demo remains usable if model access, quota, or the network is unavailable.

## Safety and decision boundaries

- Eligibility rules are deterministic and cannot be overridden by AI.
- A score is assigned only after every hard requirement passes.
- Location differences are disclosed as uncertainty rather than silently treated as proof of travel feasibility.
- Near matches cannot be invited until a valid amended assignment resolves every negotiable gap.
- Profession, registration, availability, and budget failures cannot be negotiated away.
- The clinic confirms the invitation; the professional separately accepts or declines.
- ShohojSheba never claims that AI authenticated a government credential.
- No patient information or real professional data is used.

## Fast judge walkthrough

No account, payment method, API key, or test data setup is required.

### Primary journey

1. Open the [clinic dashboard](https://joggo-ai-bd.najdhotel1.chatgpt.site/dashboard).
2. Open any of the five active staffing scenarios.
3. Review the recommended match and the three near matches.
4. Compare three professionals side by side.
5. Open a candidate to inspect credential evidence and the human review checklist.
6. Continue through invitation review, professional acceptance, and the final staffing brief.

### Standout journey: amended assignment

1. Open the laboratory scenario.
2. Review Adnan Rahim, who lacks one requested duty but passes the non-negotiable requirements.
3. Select **Propose adjusted terms**.
4. Confirm that the removed duty will not be assigned.
5. Continue to invitation review and verify that only the amended duty remains.

### Professional-side AI journey

Open the [professional profile builder](https://joggo-ai-bd.najdhotel1.chatgpt.site/professionals/join), use the fictional resume, and review the structured draft, evidence checklist, and improvement advice.

## Technical structure

- Next.js App Router, React, and strict TypeScript
- Plain CSS with shared responsive design tokens
- Typed repository boundary backed by deterministic fictional data
- Pure domain services for matching, credential review, amended assignments, invitations, and assignments
- OpenAI Responses API with strict structured outputs
- Vitest and Testing Library
- ESLint, strict TypeScript checking, Next.js production builds, and Sites deployment builds

The competition build intentionally uses an in-memory repository so every judge receives the same repeatable state. The domain services depend on a repository interface, allowing durable persistence to replace the demo adapter later.

## Run locally

Requirements: Node.js 22 or newer and pnpm 11.

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000/dashboard`.

Live GPT-5.6 access is optional for local testing:

```bash
cp .env.example .env.local
```

Set `OPENAI_API_KEY` only in `.env.local` or the deployment environment. Never prefix it with `NEXT_PUBLIC_` and never commit it. Without a key, the application clearly labels its deterministic competition fallbacks.

## Validate

```bash
pnpm check
```

The command runs linting, strict type checking, all automated tests, and the Next.js production build. The final submission freeze passed 48 tests, the Next.js build, the Sites build, live checks of all three GPT-5.6 workflows, and responsive checks across eight judge-facing routes.

## How Codex accelerated the build

This project began in a fresh repository during Build Week. The founder supplied the product vision, Bangladesh healthcare context, workflow judgment, and final decisions. Codex was the primary engineering workspace and:

- turned the product brief into a typed architecture and staged implementation plan;
- implemented the end-to-end clinic and professional journeys;
- created deterministic eligibility and credential boundaries around GPT-5.6;
- wrote and repeatedly expanded automated regression coverage;
- ran browser-based desktop and mobile QA;
- diagnosed cross-route continuity, timestamp, caching, and deployment-runtime failures;
- preserved the dated commit and decision trail; and
- prepared the deployment and submission evidence.

Important human decisions are recorded in [`docs/decisions.md`](docs/decisions.md). The chronological evidence trail is in [`docs/build-log.md`](docs/build-log.md).

## Competition evidence

- [`docs/submission.md`](docs/submission.md) — Devpost-ready copy and compliance checklist
- [`docs/demo-script.md`](docs/demo-script.md) — final under-three-minute video plan
- [`docs/architecture.md`](docs/architecture.md) — system and AI decision boundaries
- [`docs/build-log.md`](docs/build-log.md) — dated Build Week implementation record
- [`docs/decisions.md`](docs/decisions.md) — product and engineering decisions
- Codex feedback session ID: `019f752b-aa0b-7943-9b37-495eab4ba506`

## Deliberate competition scope

This is a working competition prototype, not a production medical service, licence authority, autonomous hiring system, or public marketplace. Authentication, payments, real registry integrations, durable storage, contact exchange, attendance, disputes, and production notifications remain future work.

The longer-term platform can extend its evidence-first engine to legal, accounting, engineering, and education services, with profession-specific verification and ethical rules rather than one generic freelancing workflow.

## Licence

MIT. See [`LICENSE`](LICENSE).
