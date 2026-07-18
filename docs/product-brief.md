# Product brief

## Problem

Clinics and diagnostic centres may need qualified temporary staff on short notice. Manually translating a staffing need into requirements, checking availability and credentials, and comparing candidates is slow and inconsistent.

## Demo promise

ShohojSheba turns a clinic's plain-language staffing request into an explainable, human-controlled shortlist of suitable fictional professionals.

## Primary user

A staffing coordinator at a small or medium healthcare organisation in Dhaka.

## Golden demo journey

1. The clinic enters a staffing request in everyday language.
2. AI proposes structured requirements for human review.
3. The clinic corrects or confirms the requirements.
4. The system ranks eligible fictional professionals.
5. Each result explains evidence, uncertainties, and credential status.
6. The clinic reviews a candidate and confirms an invitation.
7. The professional sees the invitation.
8. The system produces a concise staffing brief.

## In scope

- Demo clinic and professional roles
- Synthetic profiles, availability, credentials, and assignments
- Natural-language request extraction
- Deterministic eligibility rules plus AI-assisted explanations
- Credential status and inconsistency flags
- Human confirmation before invitation or assignment
- Responsive, accessible web experience
- Auditable AI output and graceful demo fallback

## Out of scope for Build Week

- Real users or patient data
- Payments and escrow
- Live government licence verification
- Medical diagnosis or treatment
- Autonomous hiring decisions
- Lawyers or other profession verticals
- Public registration, production authentication, and complex disputes

## Success criteria

- A new viewer can understand and complete the golden journey without instruction.
- Structured extraction is editable and validated before saving.
- Rankings never hide hard eligibility failures.
- Credential claims clearly distinguish demo-verified, uploaded, expired, missing, and self-declared data.
- The full demo remains usable if the model request fails.
- The project passes its automated checks and production build.

