# Description Tuning

Use this when a skill under-triggers, over-triggers, or the user asks to tune trigger accuracy. Do not run it automatically after every edit.

## Core Rule

The `description` is the trigger contract. Silent failures happen when it is too narrow, too broad, or describes the workflow instead of the user's situation.

## Tracks

Choose the track before rewriting:

| Track | Use For | Shape |
| --- | --- | --- |
| Meta | Skill-authoring, selection, evaluation, retrospective, setup | `Use ONLY when...` or `Invoke ONLY when...`; include `Do NOT auto-invoke...` near-misses. |
| Project | Domain/task skills users expect to trigger proactively | `Use when...`; include symptoms, file names, commands, errors, and "even if the tool/domain is not named" when appropriate. |

## Checklist

- First clause states the trigger.
- Wording is user-intent focused, not implementation focused.
- Description does not summarize the workflow.
- Concrete surface keywords are included: symptoms, file shapes, commands, errors, tools.
- Near-miss cases are named when over-triggering is likely.
- Frontmatter remains under 1024 chars; prefer description under 500 chars.
- Body and description agree.

## Trigger Eval

For important description changes, define about 20 realistic queries:

- 8-10 should-trigger queries with varied phrasing and implicit need.
- 8-10 should-not-trigger queries, mostly near-misses sharing keywords but requiring a different skill.
- Avoid obviously irrelevant negative queries.
- Split train/validation if iterating; choose by validation performance, not train score.

Record misses, update one theme per iteration, and do not mix description-only tuning with body rewrites unless body/description mismatch is the cause.
