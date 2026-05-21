---
name: adapting-skills
description: Use when evaluating, adopting, absorbing, or adapting specified existing agent skills into a local workflow-compatible skill set without skill sprawl.
license: MIT
metadata:
  author: h3y6e
  version: 2026.5.5
---

# Adapting Skills

Adapt specified source skill(s) into a smaller, local, workflow-compatible skill set. The default is to reduce skill count.

**REQUIRED SUB-SKILL:** Use `authoring-skills` before creating or editing any `SKILL.md`. This skill chooses adopt/adapt/absorb/reject; `authoring-skills` controls drafting, RED scenarios, description quality, and validation evidence. For external candidates, use `references/adoption-rubric.md`.

## Inputs

Read only needed inputs:

- source skill(s): local paths, installed skills, URLs, or pasted text
- target workflow constraints and existing project instructions
- already adopted skills and repo-local skills
- named validation expectations

## Decisions

Classify each source skill:

| Decision | Use When |
| --- | --- |
| `adopt as-is` | It is standalone, compatible, and does not conflict with target workflow. |
| `adapt` | The core workflow is valuable but source conventions, tool syntax, or scope must change. |
| `absorb` | Only a small idea is useful; add it to an existing skill instead of creating a new one. |
| `reject` | It is redundant, one-off, too broad, too tool-specific, or not worth the context cost. |

Prefer `adopt as-is` or `absorb` over `adapt`. Create a new skill only when it has standalone recurring value.

## Adaptation Rules

- Preserve the source skill's useful behavior, not its incidental naming, directory layout, or tool assumptions.
- Remove setup workflows, private conventions, and lifecycle state machines unless the target workflow already uses them.
- Merge overlapping triggers instead of keeping competing skills.
- Keep resulting `SKILL.md` files under 500 words when practical.
- Description must say when to use the skill, not summarize its workflow.
- Add output contracts, stop conditions, and validation scenarios for behavior-changing skills.
- Do not claim empirical validation unless a fresh evaluator actually ran the scenarios.

## Process

1. Read the source skill(s) and identify the recurring behavior they protect.
2. Compare against already adopted and repo-local skills.
3. Produce a decision table before editing.
4. Apply the smallest change: adopt, absorb, adapt, or reject.
5. Update README or catalogs only for skills that remain.
6. Record validation status: `untested`, `structurally reviewed`, or `scenario-tested`.

## Output

```markdown
## Decision Table
| Source skill | Decision | Reason | Destination |
| --- | --- | --- | --- |

## Changes
- <skill or file>: <what changed and why>

## Rejected
- <source skill>: <reason>

## Adoption Evidence
- Source snapshot:
- Rubric axes checked:
- Redundancy/compatibility evidence:
- License/provenance:

## Validation
- Structural checks:
- Scenario status:
- Empirical status:
```

## Common Mistakes

- Forking a whole skill when one paragraph should be absorbed.
- Keeping source-specific setup because it was in the original.
- Creating a router skill that duplicates descriptions.
- Saying a skill is validated after only static review.
