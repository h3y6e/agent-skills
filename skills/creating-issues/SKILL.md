---
name: creating-issues
description: Creates draft content for new issues as a single issue or dependency-aware issue set. Use when the user explicitly asks to turn a conversation or source material into a new issue/ticket draft or decompose work into multiple issue drafts. Do not use for implementing or reviewing existing issues, publishing an already-approved draft, or authoring issue templates.
license: MIT
metadata:
  author: h3y6e
---

# Creating Issues

Build an approvable issue graph from a conversation, existing issue, spec, plan, audit, research, or feedback.
A **node** is one issue; an **edge** is a dependency between nodes.
Treat a single issue as a one-node graph — never make the caller pick singular vs. plural up front.

## Boundaries

- Scope is creating new issues or improving existing ones, not implementation, triage, or status review.
- If you can't state the problem or an observable outcome, stop and ask the user to confirm it.
- Write issues for an implementer who lacks context but can investigate the repository itself.
- File paths and code snippets go stale as implementation proceeds; write abstractly enough for the implementer to look them up, unless a detail must be pinned down as a requirement.

## Process

### 1. Check sources and existing issues

Read the source material in full — including comments and links for an existing issue — plus any repository context needed.
Check the issue template, language, labels, and issue type.
Judge duplicates by whether they point at the same problem or decision, not by wording.

**Completion criteria:** Sources and duplicate candidates are enumerated, and the include/exclude/merge decision has a stated rationale.

### 2. Determine readiness

Each node's `readiness` is `ready` or `blocked`.
Extract requirements, decisions, constraints, and risks from the sources, and classify each as stated explicitly, filled in by inference or assumption, unknown, or contradicted within the sources.
Handle unknowns and contradictions by what they affect:

| What the unknown or contradiction affects | Next action |
| --- | --- |
| The problem or observable outcome itself | Stop issue creation and ask the user to confirm the problem or outcome |
| The answer or feasibility (the outcome itself is clear) | Mark it `ready` as a research issue |
| Implementation details only | Mark it `ready` as a normal issue |
| Scope, acceptance criteria, or an irreversible decision | Add a **decision gate** and mark dependent nodes `blocked` |

**Completion criteria:** No outcome-changing unknown or contradiction has been smuggled into an inference or assumption.

### 3. Decide the issue graph

Use one node when it completes in a single fresh context with no independently-landable intermediate result or rollback boundary.
When multiple outcomes can be approved, implemented, and verified independently, or the change is broad and mechanical, read [issue set rules](references/issue-sets.md).
When the work doesn't fit one fresh context and independent outcomes aren't identifiable yet, create only a research node that determines the boundary.

**Completion criteria:** Each node has one coherent outcome, and edges represent only real start conditions.

### 4. Write each node

Put the title, readiness, and dependency edges in the node's metadata; use the template below for the body.
Don't leave empty sections.
Keep the body to durable intent, constraints, acceptance criteria, and judgment criteria — write implementation steps discoverable from the repository only when the ordering itself is a contract.

```markdown
## Sources and rationale

- Facts stated explicitly in the sources, with their references
- Claims filled in by inference or assumption where not stated explicitly, with their rationale and how to confirm them
- Anything that remains unknown
- Any contradictions within the sources

## Problem

- The observable problem today (what is wrong, and why it matters)

## Outcome

- The observable state after completion (what changes, and how)

## Scope

- In scope:
- Preserve:
- Out of scope:

## Acceptance criteria

- [ ] Observable expected result
- [ ] Absence of a prohibited result

## Verification

- Verification method, judgment criteria, and expected evidence a third party can use to decide pass/fail

## Decision gate

- Open question that branches the outcome, and the evidence needed
```

For a bug, research, migration, or architecture-change node only, read [issue type rules](references/issue-types.md) and write what the applicable heading instructs.
For any claim beyond facts stated explicitly in the sources, keep its evidentiary status in the body, and don't mark a node `ready` if a contradiction affects it.
A research node can be `ready` with unknowns remaining, as long as its question, needed evidence, and stop condition are clear.
Don't write planned verification as if it were already-obtained evidence.

### 5. Inspect the whole graph

- Map each extracted requirement, decision, constraint, and risk to one node's acceptance criteria and verification, or to a justified out-of-scope item.
- Resolve scope overlap between nodes, missing requirements, cyclic edges, `TBD`, `TODO`, and unjudgeable acceptance criteria.
- Confirm each node can be started from its body and repository information alone, and its pass/fail can be judged independently.
- Confirm the graph has at least one node that isn't `blocked`.

### 6. Separate approval from publishing

Present the final draft, source coverage, duplicate candidates, and dependency edges, then get approval for the title, body, node granularity, and edges.
Only when publishing is requested, the target tracker is known, every node to publish is `ready`, and the graph is approved, read [publishing an issue](references/publishing.md).
Stop at the draft stage when the tracker is unknown or any node to publish is `blocked`.
