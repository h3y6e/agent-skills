---
name: designing-with-artifacts
description: Use when stress-testing, sanity-checking, or choosing a plan/design against existing code, issues, specs, ADRs, README/CONTRIBUTING, or project instructions before implementation.
license: MIT
metadata:
  author: h3y6e
  version: 2026.9.0
---

# Designing With Artifacts

This is an artifact-aware design conversation. It keeps the useful parts of grilling a plan against documentation and code, without requiring project-specific glossary files.

## Read First

Read only relevant sources:

- `README.md`, `CONTRIBUTING.md`
- `docs/adr/` if present
- `docs/specs/` or `specs/` if present
- linked GitHub or Linear issues
- code that can answer the current design question

## Boundary

Use `framing-problems` first when the problem is unclear. Use `reviewing-architecture` when module boundaries, interfaces, or testability are the main question.

## Conversation Rules

- Ask one question at a time.
- For each question, include your recommended answer when you have one.
- If code or docs can answer the question, inspect them instead of asking.
- Do not recommend a direction without evidence; if evidence is missing, ask, research, or propose a small prototype.
- Challenge fuzzy or overloaded language.
- Use concrete scenarios to test boundaries and edge cases.
- Surface contradictions between the user's description, existing docs, and code.
- Cite the artifact or code observation that supports each major challenge.
- Compare 2-3 plausible alternatives when there is a real trade-off, and name why rejected options lose.
- Separate product decisions, technical decisions, and implementation details.

## Process

1. State the design question being stress-tested.
2. Inspect only artifacts needed for that question.
3. Test the design against 2-3 concrete scenarios: happy path, edge case, and failure or rollback.
4. Classify impact: product behavior, data/API contract, technical design, implementation detail, or artifact update.
5. Ask the smallest blocking question, or state the recommended decision if evidence is enough.
6. Stop when decisions, open questions, and the next artifact are clear.

## ADR Discipline

Offer an ADR only when all are true:

1. The decision is hard or costly to reverse.
2. Future readers would find it surprising without context.
3. There was a real trade-off between plausible alternatives.

If any condition is missing, keep the decision in a spec, issue, task note, or final summary instead.

## Output

End with this shape:

```markdown
## Decisions
- <decision and rationale>

## Open Questions
- <question, owner, and why it blocks or does not block>

## Alternatives
- <option considered, trade-off, and why accepted/rejected>

## Impact
- <what changes in product behavior, technical design, implementation, or artifacts>

## Risks
- <risk or trade-off>

## Evidence
- <artifact path, issue, ADR, or code observation>

## Next Artifact
<issue | spec | ADR | research | prototype | implementation | no action>
```
