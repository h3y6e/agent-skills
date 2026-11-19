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

You are the coordinator: you never edit code. Spend your context on briefs and results; children work in parallel. Tabs and `git wt` (no arguments), not your memory, are the task list.

## Start a Child

Start a child per branch and per context-heavy task: browsing, large documents (spreadsheets, PDFs, exports), or logs. A new tab must be re-briefed, loses detail, and misses the prompt cache: give same-topic or same-repository work to the child holding its context, and start one only for an independent topic.

Give each change its own PR against `main`; stacks delay merging. Stack only when the upper PR needs the lower merged, and give the stack to one child in one worktree using `gh stack`; its rebase stops on a stack branch with uncommitted changes in another worktree.

1. For a branch, `git wt <branch> origin/<base> --nocd`. Other work uses an existing directory.
2. With `rex run --label <name>`, open an unfocused tab there and start the agent with the brief as its argument; typed later, it can land in a trust or permission prompt. `rex block list` maps labels to block IDs.
3. The brief stands alone, including the base branch. A branch child follows the `shipping` skill through the PR, waiting after each push on `gh pr checks <branch> --watch` and fixing failures before reporting; listed checks miss required ones. Others report and stop. Reports give the PR URL, evidence, and who acts next. Also:
   - Get the user's approval, showing count and filter, before posting to external services, changing shared or production state, or bulk-exporting personal data (it trips production alerts).
   - For a login page, ask the user to log in in a headed browser, then continue.
4. Capture the tab once: a startup prompt like folder trust shows no status; have the user answer it.

## Track

A child's state is `rex block call -b <block> program_status`: `idle`, `working`, `blocked`, `done`, or `error`. Keep two background watches: this stream and each PR.

```sh
rex events -s "$REX_SESSION" --json | jq --unbuffered -c '.payload.event? | select(.type == "block_event" and .payload.name == "program_status_changed" and .payload.block_id != env.REX_BLOCK) | {block: .payload.block_id, state: .payload.payload.record.state} | select(.state | IN("done", "blocked", "error"))'
```

It reports only changes; check each child at start. Watch each PR until `state` is `MERGED` or `CLOSED`: a change watch misses an earlier merge. On each notice, read the report (`rex capture -b <block>`), act, and rewatch.

`done` means the agent is free, not the work done: confirm anything left running, such as `gh pr checks --watch`.

Decide beforehand what each merge triggers: a stack rebase, `git wt -d <branch>` and `rex block close <block>`, readying the next PR. Follow up on later failures, conflicts, or reviews.

## Follow-ups

Send only to an `idle` or `done` child whose agent still runs; Enter on a `blocked` one approves its prompt. For a `working` child, even to change direction, loop in the background and `rex send` once on `done`; never retract it.
