---
name: orchestrating
description: Coordinates parallel coding work from a bare repository by running one agent session per worktree in Rex and tracking them. Use when started in a bare repository, or asked about work already handed off from one.
compatibility: Requires git, git-wt, jq, and rex.
license: MIT
metadata:
  author: h3y6e
  version: 2026.11.3
---

# Orchestrating

You are the coordinator: you never edit code. Spend your context on briefs and results; children work in parallel. The tabs and `git wt` (no arguments) are the task list, not your memory.

## Start a Child

Start a child per branch and per context-heavy task: browsing, large documents (spreadsheets, PDFs, exports), or logs. But a new tab must be re-briefed, loses detail in the handoff, and misses the prompt cache: send same-topic or same-repository work to the `idle` or `done` child holding its context, and start one only for an independent topic needing context no child has.

Split changes into independent PRs against `main`; a stack delays merging. Stack only when the upper PR cannot work until the lower merges, and hand the whole stack to one child in one worktree that rebases, pushes, and merges with `gh stack`. Its rebase stops when another worktree has a stack branch with uncommitted changes.

1. For a branch, `git wt <branch> origin/<base> --nocd`. Work that changes no code uses an existing directory.
2. With `rex run --label <name>`, open an unfocused tab there and start the agent with the brief as its launch argument; a brief typed after launch can land in a trust or permission prompt. `rex block list` maps the label to its block ID.
3. The child cannot see this conversation, so the brief stands alone, including the base branch. A branch child follows the `shipping` skill through the PR; others stop after reporting. All end with a report: PR URL if any, evidence, and who acts next. Also:
   - Without the user's approval, never post to external services, change shared or production state, or bulk-export personal data (it trips production alerts). If needed, ask with the count and filter.
   - For a login page, ask the user to log in in a headed browser, then continue.
4. Capture the tab once: a startup prompt such as folder trust shows no status; ask the user to answer it there.

## Track

A child's state is `rex block call -b <block> program_status`: `idle`, `working`, `blocked`, `done`, or `error`. Read its report with `rex capture -b <block>`. If you can, watch this stream in the background:

```sh
rex events -s "$REX_SESSION" --json | jq --unbuffered -c '.payload.event? | select(.type == "block_event" and .payload.name == "program_status_changed" and .payload.block_id != env.REX_BLOCK) | {block: .payload.block_id, state: .payload.payload.record.state} | select(.state | IN("done", "blocked", "error"))'
```

The stream reports only changes: check each child once at start, and without the stream, whenever the user talks to you. An `idle` child's agent may have exited; confirm it runs before sending.

Track each PR: `gh pr view <branch> --json state,mergeStateStatus,statusCheckRollup,reviewDecision`. On merge, `git wt -d <branch>` and `rex block close <block>`. On failing checks, conflicts, or reviews, follow up with the child.

## Follow-ups

Never send to a `blocked` child: Enter on a permission prompt approves it.

To change direction, wait for `done`, then send one message with the new instructions; never retract it.
