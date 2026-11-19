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

Start a child per branch and per context-heavy task: browser operation, reading large documents (spreadsheets, PDFs, exports), or log investigation.

1. For a branch, `git wt <branch> origin/<base> --nocd`. Work that changes no code needs no worktree; use an existing directory.
2. With `rex run --label <name>`, open a tab in that directory, without taking focus, and start the agent with the brief as its launch argument. A brief typed after launch can land in a trust or permission prompt. The label maps the name to its block ID in `rex block list`.
3. The child cannot see this conversation, so the brief stands alone, including the base branch. Ask a branch child to follow the `shipping` skill through the PR, and others to stop after reporting; all end with a report: PR URL if any, evidence, and who acts next. The brief also says:
   - Without the user's approval, never post to external services, change shared or production state, or bulk-export personal data (it trips production monitoring alerts). When needed, ask with the count and filter.
   - On a page needing login, open it in a headed browser and ask the user to log in there, then continue.
4. Capture the tab once. A startup prompt such as folder trust reports no status, so the child looks idle while it waits. If one shows, ask the user to answer it in that tab.

## Track

A child's state is its pane's program status: `rex block call -b <block> program_status` gives `idle`, `working`, `blocked`, `done`, or `error`. If you can watch a command in the background, watch this stream:

```sh
rex events -s "$REX_SESSION" --json | jq --unbuffered -c '.payload.event? | select(.type == "block_event" and .payload.name == "program_status_changed" and .payload.block_id != env.REX_BLOCK) | {block: .payload.block_id, state: .payload.payload.record.state} | select(.state | IN("done", "blocked", "error"))'
```

Read a child's report with `rex capture -b <block>`.

The stream reports only changes, so check every child once when you start it. Otherwise, check every child each time the user talks to you.

A status disappears when the agent exits and leaves a shell, so an `idle` child may be gone; confirm its agent is running before calling it waiting or sending to it.

Track each child's PR too: `gh pr view <branch> --json state,mergeStateStatus,statusCheckRollup,reviewDecision`, or `gh pr checks <branch> --watch` in the background. On merge, `git wt -d <branch>` and `rex block close <block>`. On failing checks, a conflict, or a new review, send the child a follow-up.

## Follow-ups

Send follow-ups only to an `idle` or `done` child. Never send to a `blocked` one: Enter on a permission prompt approves it.

To change direction, wait for `done` and send the new instructions in one message; never retract a sent one.

In a PR stack, when the lower child will push again, have the upper child wait for the lower branch's head to change, then `git rebase --onto <lower-branch> <old-head>`.
