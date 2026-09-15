---
name: reviewing-architecture
description: Surfaces architectural friction as evidence-backed refactoring candidates, then compares interface options for the one selected. Use when reviewing code structure for shallow modules, leaky interfaces, duplicated orchestration, hard-to-test behavior, or changes that spread across files.
license: MIT
metadata:
  author: h3y6e
  version: 2026.9.12
---

# Reviewing Architecture

The goal is better locality, leverage, and testability.

## Vocabulary

- **Interface**: everything callers must know — types, invariants, errors, ordering, config, and behavior, not just the signatures.
- **Shallow module**: interface complexity is close to implementation complexity.
- **Seam**: a place behavior can vary without editing callers.
- **Locality**: changes and bugs stay concentrated.
- **Leverage**: callers get more behavior from less knowledge.

## Explore

Read what bears on the structure in question: `docs/adr/` for boundaries already decided, `docs/specs/` or `specs/` for intended behavior, and referenced issues for the change that prompted the review. Use `designing-with-artifacts` instead when the main task is stress-testing a proposed plan.

Explore for friction:

- understanding one concept requires jumping across many small modules
- helpers exist only for testing but bugs occur at call sites
- interfaces expose too many implementation details
- multiple callers duplicate the same orchestration
- tests are hard to write through public behavior

If you cannot find real friction, say so. There is no target number of candidates, so do not invent refactors to reach one: cite code, tests, issues, specs, or a concrete change scenario for every candidate, and stop when the code in scope yields no further friction you can back that way.

Apply the deletion test: if deleting a module removes complexity, it was probably shallow; if complexity reappears across callers, the module may be earning its keep.

## Present Candidates

Do not propose new interfaces first. Present each candidate in this shape:

```markdown
## Candidate <N>: <name>
- Files/modules:
- Friction:
- Why it matters: <locality, leverage, or tests>
- Improvement direction:
- Tests: <affected, and protected by the change>
- Coverage protected: <behavior or requirement>
- Conflicts: <ADR/spec, if any>
- Evidence:
```

Ask which candidate to explore before detailed design, then enter Design Follow-Up for the one chosen. With a single candidate and an unambiguous direction, say so and continue rather than stopping for a confirmation that adds nothing.

## Design Follow-Up

When exploring a selected candidate:

- define the behavior callers need
- keep the interface smaller than the implementation
- compare 2-3 meaningfully different interface options before recommending one: a minimal option, a flexible option, and a common-case-optimized option where each is plausible
- require at least two plausible adapters before adding an abstraction seam
- identify tests that should survive internal refactors
- front-load high-uncertainty work as research or a spike before irreversible refactors
- offer an ADR only for hard-to-reverse, surprising, trade-off decisions

Compare interface options with:

| Option | Interface size | Hidden complexity | Caller impact | Test impact | Evidence/Risk |
| --- | --- | --- | --- | --- | --- |
