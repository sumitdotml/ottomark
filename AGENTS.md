## Mock API Boundary

`ui/lib/api.ts` is the mock↔real API boundary. When a backend is ready, only this file needs to change — the `onStepChange` callback contract stays identical.

## Quality Guardrails

- Before any repository edit task, load `skills/mistake-memory-guardrails/SKILL.md`.
- Read `AGENT_MISTAKES.md` before proposing or applying edits.
- If a known pattern appears, revise until compliant before finalizing.
- Record every detected mistake occurrence in `AGENT_MISTAKES.md` using dedupe/update rules.
