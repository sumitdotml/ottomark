## Mock API Boundary

`ui/lib/api.ts` is the mock↔real API boundary. When a backend is ready, only this file needs to change — the `onStepChange` callback contract stays identical.

## PR Review Decisions (PR #1)

Codex flagged two P2s — both declined for this prototype:

1. **Try/catch around `JSON.parse` in `storage.ts`** — localStorage is only written by our own code. Defensive parsing is unnecessary for a hackathon demo. Revisit if this goes to production.
2. **Download button is a no-op in `VideoCard.tsx`** — intentional. Videos are mock placeholders per PLAN.md. When real generation exists, `VideoResult` gains a `url` field and the anchor uses it.

## Quality Guardrails

- Before any repository edit task, load `skills/mistake-memory-guardrails/SKILL.md`.
- Read `AGENT_MISTAKES.md` before proposing or applying edits.
- If a known pattern appears, revise until compliant before finalizing.
- Record every detected mistake occurrence in `AGENT_MISTAKES.md` using dedupe/update rules.
