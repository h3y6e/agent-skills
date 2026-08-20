---
name: writing-skills
description: Creates and improves Agent Skills for this repository. Use when authoring, editing, validating, or evaluating files under skills/.
compatibility: Requires Deno and git for the bundled validator.
metadata:
  author: h3y6e
---

# Writing Skills

Create skills that make execution reproducible. Under identical conditions, required research, branches, artifacts, and verification must meet consistent standards.

## Contracts

Before writing, define observable **process invariants**. Classify research as checked, not applicable, or unavailable; evaluate branches; require artifact fields; and stop when work or verification is incomplete.

Follow the [Agent Skills specification](https://agentskills.io/specification): require `name` and `description`; make `name` match its directory and contain at most 64 lowercase letters, digits, or single hyphens; keep `description` within 1-500 characters and state capability and triggers.

Repository rules:

- Put published skills at `skills/<skill-name>/SKILL.md`. Keep the body as short as possible; aim for fewer than 500 words without dropping required instructions or references.
- Never edit `metadata.version` manually.
- A skill with `disable-model-invocation: true` also needs `agents/openai.yaml` carrying `policy.allow_implicit_invocation: false`, so explicit invocation holds outside Claude Code.
- After adding, renaming, or removing a skill, make `.tagpr` `versionFile` match every existing `skills/*/SKILL.md`.
- Before completion, run [the validator](scripts/validate.ts):

```bash
.agents/skills/writing-skills/scripts/validate.ts <skill-directory>
```

## Design

Use a skill for recurring conditional judgment with meaningful failure cost. Prefer automation for mechanical checks, project instructions for universal rules, `references/` for extensive facts, and notes for temporary information. Extend rather than duplicate a skill.

Treat loading tier and information role independently. Keep required procedures, decisions, and output contracts in `SKILL.md`; conditional detail in `references/`; fragile operations in `scripts/`; and artifact material in `assets/`. Reference pointers must say when to read and how to apply them. Prefer principles for contextual choices, templates for bounded variation, and exact scripts where variation causes failure. For loading design, read `.vendor/skills/writing-great-skills/SKILL.md`; for anchor terms and failure modes, read `.vendor/skills/writing-great-skills/GLOSSARY.md`; and for freedom levels, read `.vendor/skills/writing-skills/anthropic-best-practices.md`.

## Workflow

1. Record capability, triggers, evaluated near-misses, artifacts, and process invariants. Connect requirements to examples.
2. Search `.vendor/skills/` for skills related to the target capability, domain, and triggers, then read relevant candidates before design. Treat them only as authoring evidence: incorporate applicable guidance so the new skill stands alone, without naming or linking any consulted skill, directory, or path in any resulting file.
3. Design evaluation first. Discovery cases cover direct triggers, paraphrases, near-misses, competing skills, and multi-skill use. Execution cases make required research, branches, artifacts, and verification scorable. Baseline behavior-constraining skills without the skill.
4. Write the minimum skill. Format a model-invoked `description` as "capability. `Use when` triggers."; an explicitly invoked skill states capability alone. Give important steps input, decisions, evidence, completion criteria, and incomplete transitions as needed.
5. Distribute information by loading design. Never hide universally required instructions in references.
6. Pass mechanical validation before evaluation.
7. Evaluate discovery and execution separately. Measure activation, misses, and false activations; then requirement satisfaction, validator success, premature completion, and unnecessary tools. Repeat important skills across intended models. Follow `.vendor/skills/writing-skills/testing-skills-with-subagents.md`.
8. Prune statements that do not change default behavior. Keep each rule once per loading tier. Prefer established terms over invented shorthand. State expected behavior positively; reserve prohibitions for dangerous boundaries or observed failures, with an alternative and reason.

Before applying TDD to skill authoring, read `.vendor/skills/writing-skills/SKILL.md`. When iterative comparison is needed, use `.vendor/skills/empirical-prompt-tuning/SKILL.md`.

## Evidence

Choose verification by failure cost, frequency, blast radius, and activation conflicts:

- Run the validator, `rumdl check <path>`, and structure and link review for every skill.
- For behavioral rules or branches, run an applicable baseline plus representative and failure scenarios, then record requirement results.
- For high-risk, frequent, broad, or activation-conflicting skills, repeat runs or models and compare variance and before/after results.

For scenario evaluation, record model/version, environment/tools, skill commit/hash, and prompts. For repeated evaluation, also record run count and activation, false-activation, and requirement-satisfaction rates.

When codifying experience, record the initial failure, final solution, and connecting insight; then use `.vendor/skills/retrospective-codify/SKILL.md` to choose between automation, project instructions, extending a skill, creating a skill, or no persistence.

Before completion, confirm validator and `rumdl` success, evidence for every process invariant, separate discovery and execution evaluation, and no claim beyond the evidence produced.
