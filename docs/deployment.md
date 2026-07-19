# Deployment checklist

## Required environment

- Node.js 22 or newer
- pnpm 11
- `OPENAI_API_KEY` optional and server-side only

The public scripted demo must work without `OPENAI_API_KEY`. If a live model key is configured, it must never be exposed to browser code, logs, screenshots, or source control.

## Pre-deployment

- [x] `pnpm check` passes.
- [x] `pnpm build:sites` produces `dist/server/index.js`, client assets, and copied hosting metadata.
- [x] `.env.local` is ignored.
- [x] No real patient, professional, clinic, or credential data exists.
- [x] No secret appears in `git diff` or tracked files.
- [x] Social preview image renders correctly.
- [x] The metadata origin matches the final Sites HTTPS URL.

`pnpm build:sites` is the Cloudflare-compatible production build used by OpenAI Sites. The standard `pnpm build` remains the local Next.js production check.

## Post-deployment smoke test

- [x] Landing page loads over HTTPS.
- [x] `/requests/new` completes the scripted extraction and review.
- [x] Matching shows one recommended candidate and transparent exclusions.
- [x] Candidate credential review loads.
- [x] Clinic invitation confirmation loads.
- [x] Professional acceptance loads.
- [x] Final assignment brief shows confirmed status.
- [x] Demo reset returns to a fresh staffing request.
- [x] Unknown demo record shows a recoverable 404.
- [x] Mobile viewport has no horizontal overflow.
- [x] Browser console has no errors or warnings.
