---
name: slicing-issues
description: Use when breaking a spec, plan, PRD, feature idea, or conversation into independently implementable GitHub/Linear issues or tickets with vertical slices, acceptance criteria, dependencies, and verification.
license: MIT
metadata:
  author: h3y6e
  version: 2026.5.4
---

# Slicing Issues

Break source material into thin vertical issues that can be implemented and verified independently. This skill produces tool-neutral issue drafts; publish only when the issue tracker is clear.

## Source Material

Use whichever exists:

- current conversation
- a referenced issue
- `docs/specs/*`, `specs/*`, or a PRD
- an implementation plan
- code exploration when needed to understand boundaries

If the problem or success criteria are still unclear, use `framing-problems` before slicing. If slices already exist and only execution is parallel, use `dispatching-parallel-agents`.

## Slice Rules

- Prefer vertical slices over layer-by-layer tasks.
- Each issue should deliver a narrow complete path through relevant layers.
- Each issue should be demoable or verifiable on its own.
- Prefer many thin slices over one large issue.
- Each slice must map to source requirements, user stories, risks, or decisions it covers.
- Each slice needs concrete acceptance criteria and verification with expected evidence.
- Front-load high-uncertainty discovery before irreversible implementation slices.
- Do not use placeholders like `TBD`, `TODO`, "handle errors", or "write tests" without concrete scope.
- Mark a slice `HITL` only when human judgment is required.
- Mark a slice `AFK` when an agent can implement it from the issue plus repo context.
- Publish approved issues in dependency order, blockers first.

Reject a slice if it cannot be verified independently or if it only creates infrastructure without observable behavior.

## Process

1. Gather the source and any parent issue context.
2. Explore the codebase only if needed to avoid bad boundaries.
3. Draft slices with title, mode, dependencies, covered requirements, acceptance criteria, and verification.
4. Ask the user to approve granularity and dependencies.
5. After approval, produce issue bodies or publish through the available GitHub/Linear workflow.
6. Do not close or modify parent/source issues unless explicitly requested.

## Issue Body

```markdown
## Parent or source

Reference to parent issue, PRD, spec, or conversation section.

## What to build

Describe the end-to-end behavior, not layer-by-layer implementation.

## Boundaries

Files, modules, systems, and explicitly out-of-scope work when known.

## Mode

AFK or HITL, with one sentence explaining why.

## Covered requirements

- Requirement or source section this issue satisfies.

## Acceptance criteria

- [ ] Specific, testable criterion
- [ ] Specific, testable criterion

## Verification

- Command, manual check, or review method, including expected evidence that proves completion.

## Blocked by

None, or references to blocking issues.

## Notes

Relevant decisions, source spec, or out-of-scope boundaries.
```
