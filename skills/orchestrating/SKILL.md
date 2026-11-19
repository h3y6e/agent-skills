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

You are the coordinator: you never edit code. Spend your context on briefs and results; children work in parallel. Tabs and `git wt` (no arguments) are the task list, not memory.

## Start a Child

Start a child per branch and per context-heavy task: browsing, large documents, or logs. A new tab must be re-briefed, loses detail, and misses the prompt cache: give related work to the child holding its context; start one only for an independent topic.

Give a PR stack to one child and worktree: `gh stack rebase` stops on uncommitted changes in another worktree's stack branch.

1. For a branch, `git wt <branch> origin/<base> --nocd`. Other work uses an existing directory.
2. With `rex run --label <name>`, open an unfocused tab there and start the agent with the brief as its argument; typed later, it can land in a trust or permission prompt. A label works as `<block>`.
3. The brief stands alone, including the base branch. A branch child follows the `shipping` skill through the PR and its required checks; do not list checks, which misses required ones. Others report and stop. Reports give the PR URL, evidence, and who acts next. Also:
   - Get the user's approval, showing count and filter, before posting externally, changing shared or production state, or bulk-exporting personal data (it trips production alerts).
   - For a login page, ask the user to log in in a headed browser, then continue.
4. Capture the tab once: a startup prompt like folder trust shows no status; have the user answer it.

## Track

A child's state is `rex block call -b <block> program_status`: `idle`, `working`, `blocked`, `done`, or `error`. Watch in the background with a per-line streaming tool such as Claude Code's Monitor: `sh scripts/watch-children.sh` prints the label and state of each child that stops, and each PR whose merge gates your next step gets its own, even in other repositories or merged by the user, added as it opens. A one-event watch needs restarting after each; one miss hides a stopped child.

It reports only changes; check children at start. Watch a PR until `state` is `MERGED` or `CLOSED`; a change watch misses an earlier merge. On each notice, read `rex capture -b <label>` and act.

`done` means the agent is free, not the work done: confirm what still runs, like `gh pr checks --watch`. Check its commits' `decision` and `rejected` lines and PR diff against the agreed design and API; raise departures with the user first.

Decide beforehand what each merge triggers: stack rebase, `git wt -d <branch>` and `rex block close <block>`, readying the next PR. Follow up on later failures, conflicts, or reviews. Keep user-facing progress lists to open items and whose turn each is.

## Follow-ups

Send only to an `idle` or `done` child whose agent still runs; Enter on a `blocked` one approves its prompt. For a `working` child, even to change direction, `rex send` once from a background loop on `done`; never retract.
