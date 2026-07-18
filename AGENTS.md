# Joggo AI repository guidance

## Mission

Build a polished Build Week demonstration of an AI-assisted healthcare staffing workflow for Bangladesh. Keep the demo narrow, trustworthy, and fully operable with synthetic data.

## Working method

- Implement in small vertical slices; do not attempt the entire product in one change.
- Before editing, inspect the current repository state and state the intended slice.
- Preserve existing user changes and avoid unrelated refactors.
- Use frequent, descriptive commits after verified milestones.
- Keep all demo identities, organisations, credentials, and documents fictional.
- Never claim that AI independently verified a professional licence unless an authoritative verification integration actually did so.
- Hiring decisions remain human decisions. AI may extract, rank, explain, and flag risks.

## Engineering quality gate

Before declaring an implementation milestone complete:

1. Run formatting, linting, type checking, relevant tests, and the production build.
2. Exercise the affected user journey, including an error case.
3. Review the complete diff for secrets, unrelated edits, and misleading claims.
4. Update documentation when behavior or architecture changes.
5. Report remaining limitations honestly.

## Build Week evidence

- Keep the main implementation in this Codex task.
- Commit each coherent, tested milestone with a clear message.
- Record major architecture decisions in `docs/decisions.md`.
- Maintain `docs/build-log.md` with dates, completed work, validation, and limitations.
- Never rewrite published history merely to make the timeline look cleaner.

