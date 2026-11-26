---
name: writing-skills
description: Creates and improves Agent Skills. Use when authoring, validating, or evaluating a skill.
compatibility: Requires Node.js for the bundled validator.
license: MIT
metadata:
  author: h3y6e
  version: 2026.11.8
---

# Writing Skills

## Contracts

Before writing, define observable **process invariants**: under identical conditions, required research, branches, artifacts, and verification meet consistent standards. Classify research as checked, not applicable, or unavailable; evaluate branches; require artifact fields; and stop when work or verification is incomplete. State how far work extends — whether a first working result ends it, or iteration continues.

Follow the [Agent Skills specification](https://agentskills.io/specification).

- Keep the body as short as possible, since compact skills beat comprehensive ones; aim for fewer than 500 words without dropping required instructions or references.
- Keep eval cases in `<skill>/evals/`; run results go in `<skill-name>-workspace/` beside the skill, kept out of git.

## Design

Use a skill for recurring conditional judgment with meaningful failure cost. Prefer hooks or automation for rules that must hold every time, project instructions for knowledge most tasks need, `references/` for extensive facts, and notes for temporary information. Extend rather than duplicate a skill.

Model-authored procedure without evidence from observed failures scores below no skill.

Skills regress agents in three ways:

- **Description osmosis**: the description changes behavior even unloaded; a workflow summary there replaces the body.
- **Grounding displacement**: a procedure overrides how the agent reads its inputs. Have steps read the actual inputs rather than presume them.
- **Verification displacement**: a procedure suppresses checks the agent would otherwise run. Add checks it would miss; never replace its own.

Treat loading tier and information role independently. Keep required procedures, decisions, gotchas, and output contracts in `SKILL.md`; conditional detail in `references/`, one level deep; fragile operations in `scripts/`; and artifact material in `assets/`. Reference pointers must say when to read and how to apply them. Invoke bundled scripts through their interpreter, never by bare path. For loading design and invocation choice, read [writing-for-agents](https://github.com/mattpocock/skills/blob/HEAD/skills/productivity/writing-for-agents/SKILL.md) and its [SKILL-MECHANICS.md](https://github.com/mattpocock/skills/blob/HEAD/skills/productivity/writing-for-agents/SKILL-MECHANICS.md); for freedom levels, read [anthropic-best-practices.md](https://github.com/obra/superpowers/blob/HEAD/skills/writing-skills/references/anthropic-best-practices.md).

## Workflow

1. Record capability, triggers, evaluated near-misses, artifacts, and the process invariants from Contracts. Connect requirements to examples.
2. Use consulted skills only as authoring evidence: the result stands alone and names no consulted skill or path.
3. Run the target tasks without the skill; write only what the agent lacks — gotchas, conventions, and corrections for failures this baseline shows. One occurrence is an anecdote: add a skill or rule once the same failure recurs.
4. Write the minimum skill. Format a model-invoked `description` as "capability. `Use when` triggers.", key use case first; an explicitly invoked skill states capability alone. Name triggers as the occasions calling for the skill, not the domains it touches: "adding or changing a migration", not "working with databases". Give important steps input, decisions, evidence, completion criteria, and incomplete transitions as needed.
5. Prune statements that do not change the current model's default behavior; those defaults move, so re-check surviving rules on every revision. Keep each rule once per loading tier. Prefer established terms over invented shorthand. Explain why a rule matters instead of stacking `MUST`, `ALWAYS`, or `NEVER`. Pick the form by the baseline failure: a contract or template for wrong shape, a required slot for omissions, a prohibition with its rationalizations only for rules skipped under pressure. Over-constraint costs as much as under-constraint: a prohibition aimed at one model's overreach reads to a stronger one as license to stop early.

## Evidence

Before completion, run [the validator](scripts/validate.mjs):

```bash
node scripts/validate.mjs <skill-directory>
```

Choose further verification by failure cost, frequency, blast radius, and activation conflicts:

- Run `rumdl check <path>` and structure review for every skill. When adding a check, prove it fails on a real past mistake.
- For behavioral rules or branches, run each execution case in a clean context with and without the skill (or with the previous version), graded on concrete evidence. Run candidates as fresh, non-fork subagents; without-skill baselines and discovery evals need an environment without the skill installed. Keep evaluation out of what candidates see: an organic prompt, project-shaped names, no eval vocabulary, no mention of other variants. Judge activation from the files a transcript shows were read, not from self-report. One judge scores all variants in one pass under neutral labels; read every output yourself, and suspect the rubric when you disagree. Report gains and regressions per case, not only the net pass rate.
- When a model-invoked skill's triggers change, run about 20 discovery queries, half near-miss should-not-trigger, 3 times each with a held-out split. Fix failures by category, not by adding their keywords.
- For high-risk, frequent, broad, or activation-conflicting skills, repeat runs or models and compare variance.

Record model/version, environment/tools, skill commit/hash, and prompts. For repeated evaluation, also record run count and activation, false-activation, and requirement-satisfaction rates. For discovery protocol, read [optimizing-descriptions](https://github.com/mizchi/skills/blob/HEAD/optimizing-descriptions/SKILL.md); for iterative execution tuning, [empirical-prompt-tuning](https://github.com/mizchi/skills/blob/HEAD/empirical-prompt-tuning/SKILL.md); for rules agents skip under pressure, [testing-skills-with-subagents.md](https://github.com/obra/superpowers/blob/HEAD/skills/writing-skills/references/testing-skills-with-subagents.md).

When codifying experience, record the initial failure, final solution, and connecting insight; then use [retrospective-codify](https://github.com/mizchi/skills/blob/HEAD/retrospective-codify/SKILL.md) to choose between automation, project instructions, extending a skill, creating a skill, or no persistence.

Before completion, confirm evidence for every process invariant and no claim beyond the evidence produced.
