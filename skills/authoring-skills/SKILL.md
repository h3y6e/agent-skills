---
name: authoring-skills
description: Use when creating, editing, validating, or codifying reusable lessons into strict agent skills.
license: MIT
metadata:
  author: h3y6e
  version: 2026.5.0
---

# Authoring Skills

Skill authoring is TDD for process docs: scenario, failure, `SKILL.md`, verify, refactor. A skill is reusable technique, pattern, tool, or reference, not session history. Without observed/simulated failure, teaching is unproven.

## Create Or Skip

Create/edit from reusable guidance or paired failure/success lessons that are non-obvious, broad, judgment-based. Dedup first; skip one-offs/local conventions; automate enforceable rules.

## Structure

Use `skill-name/SKILL.md`; frontmatter needs matching `name`/`description`; keep under 1024 chars. Name chars: lowercase letters, numbers, hyphens only; no spaces, underscores, slashes, uppercase, punctuation. Name by action/core insight; gerunds (`-ing`) fit process skills. Use `scripts/` for reusable tools and `references/` for heavy reference.

## Description

Description: trigger, not workflow. Start with `Use when...`, name symptoms/situations, stay tech-agnostic unless needed, avoid first person, stay under 500 chars, include searchable keywords: symptoms, errors, tools, file types.

Good: `description: Use when tests have race conditions or pass/fail inconsistently.`
Bad: `description: Use for async tests by replacing sleeps with polling.`

## Strict Loop

Mapping: test case = pressure/application scenario; production code = `SKILL.md`; RED = baseline violation or rationalization; GREEN = compliant use; refactor = close loopholes.

Do not deploy or mark a behavior-changing skill valid without a failing scenario first.

1. **RED**: write pressure scenarios; for discipline skills, combine time, sunk cost, authority, and exhaustion. Run or simulate without the skill and record exact rationalizations.
2. **GREEN**: write the smallest `SKILL.md` that blocks those failures.
3. **VERIFY**: test the same scenarios with the skill, preferably using a fresh subagent with task-local context.
4. **REFACTOR**: plug new rationalizations, remove excess text, and re-test before moving to another skill.

Validate by type: discipline skills need pressure compliance; techniques need application and variation scenarios; patterns need recognition and counter-examples; references need retrieval, application, and gap tests.

References: use `empirical-validation.md` for empirical review or substantial behavior changes; `retrospective-codification.md` for reusable lessons; `description-tuning.md` for trigger misses; `skill-structure.md` for placement decisions.

## Quality Rules

- Keep frequently loaded skills very short; keep others under 500 words.
- Move heavy examples, APIs, syntax into references.
- Add scripts only for deterministic repeated operations.
- Prefer one excellent example; avoid multi-language dilution.
- Use flowcharts only for non-obvious decisions or loops.
- Cross-reference skills by name with explicit requirement markers; avoid path or `@` links.
- Add counters or red flags only for real rationalizations.
- Avoid narrative session history and hidden dependencies.
- When improving from feedback, fix the observed behavior and re-verify instead of rewriting unrelated sections.

## Evidence

Before claiming a skill works, record:

- scenarios used
- critical requirements
- baseline failure or reason baseline was skipped
- result: `untested`, `structurally reviewed`, or `scenario-tested`
- unclear points or discretionary fill-ins

If validation was skipped, say `untested`; do not imply it passed.

## Final Check

Trigger-only description; concise actionable body; necessary supporting files; RED scenario; recorded validation status.
