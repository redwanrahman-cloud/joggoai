# OpenAI Build Week submission package

## Submission identity

- **Project:** ShohojSheba
- **Track:** Work & Productivity
- **Tagline:** Verified professionals. Explainable matching. Human decisions.
- **Repository:** https://github.com/redwanrahman-cloud/joggoai
- **Live demo:** https://joggo-ai-bd.najdhotel1.chatgpt.site
- **Final public video:** https://youtu.be/qmo_5rDfucg
- **Codex feedback session ID:** `019f752b-aa0b-7943-9b37-495eab4ba506`

## Short description

ShohojSheba helps healthcare organisations turn urgent staffing needs into reviewed requirements, explainable professional comparisons, and two-sided human decisions—with GPT-5.6 assisting inside deterministic safety boundaries.

## Devpost project story

### Inspiration

Small clinics and diagnostic centres in Bangladesh may need temporary professionals on short notice. Finding someone is only part of the problem: the coordinator must translate the need into exact requirements, compare registration, skills, availability, and cost, keep uncertainties visible, and obtain agreement from both sides.

Generic job boards expose profiles but do not make that decision process accountable. ShohojSheba explores what a verified-workforce workflow could look like when AI accelerates the work without becoming the decision-maker.

### What it does

ShohojSheba demonstrates end-to-end staffing journeys for doctors, registered nurses, laboratory technologists, physiotherapists, and caregivers.

A clinic can describe a shift naturally, review GPT-5.6-structured requirements, and receive a deterministic shortlist. Only professionals who pass profession, reviewed registration, skills, full-shift availability, and budget requirements receive a score. Near matches remain visible with their exact gaps and can be compared side by side.

When a near match fails only because of an assignment duty, an authorised coordinator may propose a separately recorded amended assignment that explicitly removes that duty. The original requirements remain visible, every non-negotiable rule must still pass, and the professional later accepts or declines the amended terms.

The clinic reviews synthetic credential evidence, confirms an invitation, and hands the decision to the professional. A staffing brief is created only after professional acceptance. A separate professional onboarding flow uses GPT-5.6 to organise a doctor or nurse resume into a draft profile, missing-evidence checklist, and ethical improvement advice.

### How we built it

ShohojSheba is a typed Next.js and React application with a deterministic in-memory repository of fictional data. Pure domain services own eligibility, scoring, credential review, amended assignments, invitations, and assignments. This makes the competition journey reproducible while keeping the persistence boundary replaceable.

GPT-5.6 Sol is integrated through the OpenAI Responses API for three bounded workflows:

1. natural-language staffing-request extraction;
2. an evidence-grounded shortlist briefing; and
3. professional resume-to-profile intake.

All three use strict JSON schemas, server-side credentials, validation, visible source labels, and disclosed deterministic fallbacks. GPT-5.6 cannot change eligibility, fabricate credentials, send an invitation, or accept work.

Codex was the primary engineering workspace. It translated the founder's product and healthcare-workflow decisions into the architecture, application routes, domain services, interface, tests, browser QA, deployment, and repair loops. The dated commit history, decision log, and build log preserve that collaboration.

### Challenges we ran into

- Separating eligibility from ranking so a high score could never hide a failed hard requirement.
- Keeping human-confirmed requirements consistent through comparison, credential review, invitation, acceptance, and assignment routes.
- Designing flexibility for near matches without creating a generic safety override.
- Preserving credential provenance without implying that AI verified a government record.
- Making the demo reliable when API access, quota, browser caching, or deployment-runtime behavior changed.

### Accomplishments we are proud of

- Five coherent healthcare staffing scenarios instead of a single scripted card.
- Three live GPT-5.6 workflows with strict structured outputs and honest fallbacks.
- Transparent comparison of one recommended match and at least three same-profession near matches per category.
- A negotiated amended-assignment workflow with separate clinic confirmation and professional acceptance.
- A complete no-login judge journey from request to final staffing brief.
- Forty-eight automated tests, two successful production build targets, live API checks, and mobile validation across eight judge-facing routes.

### What we learned

AI is most useful here when it organises messy information and explains evidence—not when it owns eligibility or the final decision. Deterministic rules, visible uncertainty, and explicit human transitions made the product both safer and easier to understand.

We also learned that the difficult part of an AI product is not only the model call. Continuity, recovery paths, clear labels, responsive comparison, and deployment behavior determine whether the result feels like a complete product.

### What's next

The competition prototype intentionally excludes authentication, payments, durable storage, real registry integrations, contact exchange, attendance, disputes, and production notifications.

The next healthcare phase would add verified organisation accounts, professional consent, durable audit records, availability management, secure document review, and registry integrations. The longer-term ShohojSheba engine could support legal, accounting, engineering, and education services, with profession-specific verification and ethical rules rather than one generic freelancing marketplace.

## How Codex and GPT-5.6 satisfy the challenge

### Codex

- Primary workspace for the majority of core implementation
- Architecture, staged delivery, and repository-wide changes
- Test generation and regression repair
- Browser-based desktop and mobile QA
- Deployment investigation and recovery
- Documentation and submission evidence

### GPT-5.6

- Strictly structured staffing-request extraction
- Evidence-grounded match briefing
- Strictly structured professional profile intake
- Visible model/fallback provenance in the product
- No authority over eligibility or human actions

## Judge testing path

No account, payment, secret, or setup is required.

1. Open the live demo and enter the clinic dashboard.
2. Open the laboratory staffing request.
3. Review the recommended candidate and three near matches.
4. Compare the top three professionals.
5. Open Adnan Rahim and propose adjusted terms.
6. Confirm the amended assignment and continue to invitation review.
7. Verify that only **Sample handling** remains in the invitation.
8. Confirm the invitation, accept from the professional view, and review the staffing brief.
9. Open the professional profile builder and run its fictional resume through GPT-5.6.
10. Optionally start a new staffing request to see live GPT-5.6 extraction and generate a shortlist briefing.

## Final compliance checklist

- [x] Working public demo with no authentication barrier
- [x] Public repository with MIT licence
- [x] README includes setup, sample-data explanation, test path, Codex contribution, and GPT-5.6 integration
- [x] All three GPT-5.6 endpoints returned `live_model` during the final audit
- [x] Forty-eight automated tests passed
- [x] Next.js and Sites production builds passed
- [x] Eight judge-facing routes passed 390px overflow checks
- [x] Codex feedback session ID recorded
- [x] Record the feature-complete real-screen demo
- [x] Verify the final cut is 3:00 or less with clear voiceover
- [x] Upload the final video publicly to YouTube and replace every video field
- [ ] Reconcile Devpost fields with this document
- [ ] Add or refresh the Devpost thumbnail
- [ ] Submit before July 21, 2026 at 5:00 PM Pacific Time
- [ ] Re-open the submitted entry and perform one final link check
