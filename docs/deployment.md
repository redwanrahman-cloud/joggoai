# Deployment checklist

## Required environment

- Node.js 22 or newer
- pnpm 11
- `NEXT_PUBLIC_SITE_URL` set to the final HTTPS origin for social metadata
- `OPENAI_API_KEY` optional and server-side only

The public scripted demo must work without `OPENAI_API_KEY`. If a live model key is configured, it must never be exposed to browser code, logs, screenshots, or source control.

## Pre-deployment

- [ ] `pnpm check` passes.
- [ ] `pnpm build:sites` produces `dist/server/index.js`, client assets, and copied hosting metadata.
- [ ] `.env.local` is ignored.
- [ ] No real patient, professional, clinic, or credential data exists.
- [ ] No secret appears in `git diff` or tracked files.
- [ ] Social preview image renders correctly.
- [ ] Final site origin is configured.

`pnpm build:sites` is the Cloudflare-compatible production build used by OpenAI Sites. The standard `pnpm build` remains the local Next.js production check.

## Post-deployment smoke test

- [ ] Landing page loads over HTTPS.
- [ ] `/requests/new` completes the scripted extraction and review.
- [ ] Matching shows one recommended candidate and transparent exclusions.
- [ ] Candidate credential review loads.
- [ ] Clinic invitation confirmation loads.
- [ ] Professional acceptance loads.
- [ ] Final assignment brief shows confirmed status.
- [ ] Demo reset returns to a fresh staffing request.
- [ ] Unknown demo record shows a recoverable 404.
- [ ] Mobile viewport has no horizontal overflow.
- [ ] Browser console has no errors or warnings.
