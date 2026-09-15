---
name: dispatching-parallel-agents
description: Dispatches independent work across parallel subagents with explicit file ownership, then integrates and verifies the results. Use when two or more tasks, failures, investigations, or research questions can be isolated by files, state, dependencies, and verification.
license: MIT
metadata:
  author: h3y6e
  version: 2026.9.11
---

# Dispatching Parallel Agents

Dispatch subagents only when independence is real.

If work units must be recorded as issues and are not defined yet, use `creating-issues` before dispatching agents.

## Independence Check

Before dispatch, every task must have:

- distinct files, or a read-only research scope
- no shared generated artifacts, migrations, or global state
- a result reviewable on its own
- no dependency on another agent's pending answer
- a verification whose result proves that domain is done

Sequence the work instead when any item fails, when one root cause may explain all the failures, when the system state has to be understood as a whole, when results must be ordered for correctness, or when you do not yet know how the work decomposes.

## Process

1. Group work into independent domains with expected verification.
2. Give each agent one domain in the shape below — fresh and self-contained, never relying on inherited session history.
3. Tell each agent they are not alone in the codebase and must not revert others' edits.
4. Run agents in one parallel batch only after checking for likely conflicts.
5. Read every result, inspect diffs, and resolve overlaps.
6. Run the full relevant verification after integration.

A failed or partial result leaves that domain unfinished: finish it yourself or re-dispatch it, and never report a domain done on a claim you have not verified. Integration ends when every domain's verification passes, not when every agent has returned.

## Prompt Shape

```text
Task: <one problem domain>

Context:
- relevant failure or requirement
- files or modules owned by this agent
- constraints and files not to touch

Goal:
- what should be true when done

Return:
- root cause or finding
- changes made
- verification run
- requirement or task coverage proven
- remaining risk
```

## Integration Report

After agents return, summarize:

```markdown
## Results
- Agent/task: outcome and files changed

## Conflicts
- Overlap or contradiction, and resolution

## Verification
- Commands run after integration

## Remaining Risk
- What was not checked
```
