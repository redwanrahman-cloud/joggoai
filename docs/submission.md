# OpenAI Build Week submission package

## Submission identity

- **Project:** Joggo AI
- **Track:** Work & Productivity
- **Tagline:** Verified professionals. Explainable matching. Human decisions.
- **Repository:** https://github.com/redwanrahman-cloud/joggoai
- **Demo URL:** pending production deployment
- **Video URL:** pending public YouTube upload
- **Codex `/feedback` session ID:** pending founder retrieval from this main build thread

## Short description

Joggo AI helps healthcare organisations turn an urgent staffing request into a reviewed, explainable shortlist of qualified fictional professionals—then keeps both invitation and acceptance under human control.

## Full description

Clinics and diagnostic centres often need temporary staff quickly, but matching a shift against professional registration, skills, availability, location, and compensation can be slow and inconsistent. Ordinary job boards expose profiles; they do not organise evidence or make the decision process accountable.

Joggo AI demonstrates an end-to-end healthcare staffing workflow for Bangladesh. A clinic describes a shift in everyday language. The system proposes structured requirements for human review, enforces deterministic eligibility constraints, ranks only candidates who passed, and explains every recommendation. The clinic can inspect synthetic credential evidence, see pending or expired records, and confirm an invitation. The professional independently accepts before a confirmed staffing brief is produced.

AI assists with intent and explanation. It cannot override hard requirements, authenticate a government licence, fabricate evidence, send an invitation, or accept work for a person.

## How Codex and GPT-5.6 were used

The project was built from a fresh repository during Build Week with Codex as the primary development environment. The main Codex thread created the architecture, typed domain model, application routes, matching and credential services, UI, automated tests, browser validation, documentation, and iterative repairs. Dated commits and the build log separate each implementation phase.

The product boundary targets GPT-5.6 Sol through the Responses API for structured staffing-request extraction and evidence-grounded language. A disclosed deterministic fallback keeps the public demo repeatable when an API key or live model is unavailable. Deterministic application code—not the model—owns eligibility and state transitions.

## What makes it different

- It is a verified-workforce workflow, not a generic freelancing directory.
- Eligibility and ranking are separate, so a high score cannot hide a failed hard requirement.
- Credential provenance and uncertainty remain visible.
- Clinic confirmation and professional acceptance are independent human actions.
- The demo remains safe and repeatable with fictional data and an honest fallback.

## Potential impact

The initial audience is small and medium healthcare organisations in Bangladesh that need temporary or replacement coverage. The same evidence-first architecture can later support diagnostic centres, home-care agencies, hospitals, and other regulated professional categories without turning the first product into an unfocused marketplace.

## Judge testing path

1. Open the demo URL.
2. Select **Start a staffing request**.
3. Use the prefilled fictional ICU-night request and select **Structure this request**.
4. Review and confirm the extracted fields.
5. Open the recommended candidate.
6. Review the credential evidence and caution.
7. Confirm and send the invitation.
8. Accept from the professional demo view.
9. Review the final confirmed staffing brief.
10. Select **Reset and run demo again** to repeat.

No account, payment, real data, or secret is required.

## Final submission checklist

- [ ] Production demo URL works in a private browser window.
- [ ] Repository is public with MIT licence, or shared with both required judging accounts.
- [ ] README includes setup, fictional sample data, testing path, Codex contribution, and GPT-5.6 boundaries.
- [ ] Public YouTube demo is under three minutes and includes audio.
- [ ] Video visibly demonstrates the working product.
- [ ] Video explains how Codex and GPT-5.6 were used.
- [ ] Work & Productivity track selected.
- [ ] Main Codex `/feedback` session ID entered.
- [ ] Demo URL, video URL, and session ID replace every pending placeholder above.
- [ ] Submission completed before July 21, 2026 at 5:00 PM Pacific Time.
