---
name: reviewing-architecture
description: Use when reviewing code structure for architecture friction such as refactoring candidates, shallow modules, leaky interfaces, duplicated orchestration, hard-to-test behavior, or changes that spread across files.
license: MIT
metadata:
  author: h3y6e
  version: 2026.5.2
---

# Reviewing Architecture

Surface architectural friction and propose candidates before designing interfaces. The goal is better locality, leverage, and testability.

## Vocabulary

- **Module**: code with an interface and implementation.
- **Interface**: everything callers must know: types, invariants, errors, ordering, config, and behavior.
- **Implementation**: code hidden behind the interface.
- **Depth**: how much behavior sits behind a small interface.
- **Shallow module**: interface complexity is close to implementation complexity.
- **Seam**: a place behavior can vary without editing callers.
- **Adapter**: concrete implementation behind a seam.
- **Locality**: changes and bugs stay concentrated.
- **Leverage**: callers get more behavior from less knowledge.

## Explore

Read relevant artifacts first: `README.md`, `docs/adr/`, `docs/specs/`, `specs/`, and referenced issues. Use `designing-with-artifacts` instead when the main task is stress-testing a proposed plan.

Explore for friction:

- understanding one concept requires jumping across many small modules
- helpers exist only for testing but bugs occur at call sites
- interfaces expose too many implementation details
- multiple callers duplicate the same orchestration
- tests are hard to write through public behavior
- changes leak across boundaries
- high-uncertainty design work is mixed with irreversible implementation

If you cannot find real friction, say so. Do not invent refactors. No recommendation without evidence: cite code, tests, issues, specs, or a concrete change scenario for each candidate.

Apply the deletion test: if deleting a module removes complexity, it was probably shallow; if complexity reappears across callers, the module may be earning its keep.

## Present Candidates

Do not propose new interfaces first. Present candidates:

- files/modules involved
- problem
- why it hurts locality, leverage, or tests
- direction of improvement
- tests affected or protected by the change
- behavior or requirement coverage protected by the change
- ADR/spec conflicts, if any

Ask which candidate to explore before detailed design.

Use this shape:

```markdown
## Candidate <N>: <name>
- Files/modules:
- Friction:
- Why it matters:
- Improvement direction:
- Tests:
- Evidence:
```

## Design Follow-Up

When exploring a selected candidate:

- define the behavior callers need
- keep the interface smaller than the implementation
- compare 2-3 meaningfully different interface options before recommending one
- include at least a minimal option, a flexible option, and a common-case-optimized option when they are plausible
- require at least two plausible adapters before adding an abstraction seam
- identify tests that should survive internal refactors
- front-load high-uncertainty work as research or a spike before irreversible refactors
- offer an ADR only for hard-to-reverse, surprising, trade-off decisions

Compare interface options with:

| Option | Interface size | Hidden complexity | Caller impact | Test impact | Evidence/Risk |
| --- | --- | --- | --- | --- | --- |
