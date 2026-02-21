# AGENT_MISTAKES

Persistent repository memory for recurring agent/model mistakes.

Initialized on 2026-02-17.

## Usage Rules

- Read this file before any repository edit task.
- Record every detected mistake occurrence.
- Deduplicate by normalized `pattern` + `scope_tags` + `prevention_rule`.
- For repeated patterns, update existing entry fields instead of creating duplicates.

## Required Entry Fields

Every entry must include:

- `id`
- `status` (`active` or `resolved`)
- `severity` (`low`, `medium`, or `high`)
- `scope_tags` (list)
- `pattern`
- `prevention_rule`
- `validation_check`
- `first_seen` (YYYY-MM-DD)
- `last_seen` (YYYY-MM-DD)
- `occurrence_count` (integer >= 1)
- `evidence` (one or more file:line and/or commit refs)

## Entry Template

Use this exact shape for new entries.

```md
### MISTAKE-YYYYMMDD-001
- id: MISTAKE-YYYYMMDD-001
- status: active
- severity: medium
- scope_tags: [code, docs, tests, config, infra, planning]
- pattern: <normalized mistake pattern>
- prevention_rule: <specific action that prevents recurrence>
- validation_check: <deterministic pass/fail check>
- first_seen: YYYY-MM-DD
- last_seen: YYYY-MM-DD
- occurrence_count: 1
- evidence:
  - file:relative/path:line
  - commit:<hash>
```

## Entries

### MISTAKE-20260221-001
- id: MISTAKE-20260221-001
- status: resolved
- severity: high
- scope_tags: [code]
- pattern: storing raw base64 data URLs (from FileReader.readAsDataURL) in localStorage without size constraints
- prevention_rule: always resize/compress images before localStorage storage -- use canvas to downscale to max 128x128 and export as JPEG 0.7 quality
- validation_check: create 3+ characters with avatar images without QuotaExceededError
- first_seen: 2026-02-21
- last_seen: 2026-02-21
- occurrence_count: 1
- evidence:
  - file:ui/components/CharacterModal.tsx:28
  - file:ui/lib/storage.ts:19
