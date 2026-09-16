---
name: designing-with-artifacts
description: Stress-tests a plan or design against the repository's code, issues, specs, and ADRs, ending in decisions, open questions, and the next artifact. Use when sanity-checking a proposed plan, or choosing between plausible designs, before implementation starts.
license: MIT
metadata:
  author: h3y6e
  version: 2026.9.12
---

# Designing With Artifacts

This is an artifact-aware design conversation. It keeps the useful parts of grilling a plan against documentation and code, without requiring project-specific glossary files.

## Boundary

Use `framing-problems` first when the problem is unclear. Use `reviewing-architecture` when module boundaries, interfaces, or testability are the main question.

## Conversation Rules

- Ask one question at a time.
- For each question, include your recommended answer when you have one.
- If code or docs can answer the question, inspect them instead of asking.
- Do not recommend a direction without evidence; if evidence is missing, ask, research, or propose a small prototype.
- Challenge fuzzy or overloaded language.
- Surface contradictions between the user's description, existing docs, and code.
- Cite the artifact or code observation that supports each major challenge.
- Compare 2-3 plausible alternatives when there is a real trade-off, and name why rejected options lose.

## Process

1. State the design question being stress-tested.
2. Read only what answers it: `README.md` and `CONTRIBUTING.md` for conventions, `docs/adr/` for decisions already made, `docs/specs/` or `specs/` for intended behavior, linked GitHub or Linear issues for scope and history, and the code for what is true today.
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
