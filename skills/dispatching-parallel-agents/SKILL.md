---
name: dispatching-parallel-agents
description: Use when splitting two or more independent tasks, failures, investigations, or research questions across parallel subagents is safe because files, state, dependencies, and verification can be isolated.
license: MIT
metadata:
  author: h3y6e
  version: 2026.5.0
---

# Dispatching Parallel Agents

Dispatch subagents only when independence is real. Parallelism helps when each agent can reason and edit without needing the others' context or touching the same state.

If work units are not defined yet, use `slicing-issues` before dispatching agents.

## Use When

- multiple failing test files have different likely causes
- separate subsystems are broken independently
- research questions can be answered independently
- each task has a clear owner and expected output
- agents can avoid editing the same files
- each task can be verified independently before integration

## Do Not Use When

- one root cause may explain all failures
- the system state must be understood as a whole
- tasks share files, migrations, generated output, or external state
- you do not yet know how the work decomposes
- results must be sequenced for correctness
- one agent's answer can change another agent's task definition

## Process

1. Group work into independent domains with expected verification.
2. Assign each agent one domain, explicit file ownership, and protected paths not to touch.
3. Tell each agent they are not alone in the codebase and must not revert others' edits.
4. Give each agent fresh, self-contained context: goal, constraints, relevant errors, commands, expected output, verification, owned files, and files not to touch. Do not rely on inherited session history.
5. Run agents in one parallel batch only after checking for likely conflicts.
6. Read every result, inspect diffs, and resolve overlaps.
7. Run the full relevant verification after integration.

## Independence Check

Before dispatch, each task must have:

- distinct files or read-only research scope
- no shared generated artifacts, migrations, or global state
- a clear result that can be reviewed independently
- no dependency on another agent's pending answer
- a verification method whose result proves that domain's completion

If any item fails, sequence the work instead.

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

If ownership cannot be stated clearly, do not parallelize yet.

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
