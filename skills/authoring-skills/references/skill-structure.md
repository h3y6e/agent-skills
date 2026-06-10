# Skill Structure

Use this when deciding what belongs in `SKILL.md`, `references/`, or `scripts/`.

## Start From Concrete Examples

Before structuring a skill, collect concrete usage examples from the user, current conversation, or realistic generated scenarios. For each example, ask:

- What task should trigger the skill?
- What output should it produce?
- What repeated work would the agent otherwise rediscover?
- What information is core workflow versus reference detail?
- What edge cases or dependencies change the workflow?

## Resource Placement

| Location | Put Here | Do Not Put Here |
| --- | --- | --- |
| `SKILL.md` | Core principle, trigger-sensitive workflow, decision rules, output contract, short examples | Long API docs, exhaustive variants, session history |
| `references/` | Heavy docs, detailed patterns, advanced cases, variant-specific guides | Instructions required on every invocation without a pointer |
| `scripts/` | Deterministic repeated operations, validators, generators, reusable helpers | One-off commands or code the agent will not rerun |

Only create directories that are actually used. Every referenced file must exist and the `SKILL.md` body must say when to read it.

## Structure Checks

- Progressive disclosure is clear: metadata -> `SKILL.md` -> references/scripts on demand.
- The body stays lean and self-contained for the common path.
- A repeated helper produced in multiple evaluations is promoted to `scripts/`.
- Large reference files include headings or search terms.
- Examples are complete enough to adapt and not spread across many shallow variants.
