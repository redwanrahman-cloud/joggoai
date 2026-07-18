# Joggo AI

Joggo AI is a Build Week project exploring a trustworthy, AI-assisted staffing workflow for healthcare organisations in Bangladesh.

## Competition demo scope

A clinic describes a temporary staffing need in natural language. The system converts it into structured requirements, ranks fictional professionals against those requirements, explains the matches and credential risks, and lets a human confirm an assignment.

The MVP is deliberately limited to one polished healthcare staffing journey. It is not a public job marketplace, medical service, licence authority, or autonomous hiring system.

## Current status

Phase 1 is complete. The repository now contains a responsive, typed Next.js application shell, the initial Joggo AI visual language, strict quality tooling, and a foundation test. Business workflows begin in Phase 2 with the domain model and synthetic demo data.

## Local development

Requirements: Node.js 22 or newer and pnpm 11.

```bash
pnpm install
pnpm dev
```

Run the complete quality gate with:

```bash
pnpm check
```

See:

- `docs/product-brief.md`
- `docs/architecture.md`
- `docs/implementation-plan.md`
- `docs/decisions.md`
- `docs/build-log.md`
