---
name: git-shipping
description: Guides the git workflow for shipping code changes — branch, commit, push, PR. Use whenever asked to `commit`, `push`, `pr`/`ship`/`open a PR`/`merge this`, or manage branches, and whenever about to make code changes in a git repo, to confirm the branch is right before implementation starts — even if the user only described the change and never said the word "git".
compatibility: Requires git, gh, cxg, and git-wt.
license: MIT
metadata:
  author: h3y6e
  version: 2026.10.3
---

# Git Shipping

Code changes flow through: branch → commit → push → PR.

## Intent Expansion

Treat short git requests as workflow shorthand.

| User says | What it means |
|-----------|---------------|
| `commit` | Inspect, stage coherent chunks, commit |
| `push` | Inspect, create commits if needed, push |
| `pr` | Inspect, move off default branch if needed, commit, push, open PR |

Ask only when the intended change scope is unclear enough that you might include unrelated work.

## Language Rule

Check visibility with `gh repo view --json visibility -q '.visibility'`.

- **PUBLIC**: Use English for commit messages, PR titles, and PR bodies.
- **PRIVATE / INTERNAL**: Use the language the user is currently using.

## Branch

Start new feature work in a clean worktree from the remote default branch, not in the default-branch checkout.
Before creating it, check `git wt -h`, then use `git wt <branch> origin/<default-branch> --nocd`.
Use `git wt` rather than raw `git worktree` so worktrees follow the repository's configured layout.

New worktrees start clean; transfer in-progress changes only on request.

Do not move already-started work into a new worktree just to satisfy this workflow. If files are already being edited in the current checkout, keep working there and create or switch to the appropriate branch in place when safe.

## Commit

Use the `cxg` skill for the commit message format, and pipe the message through `cxg lint` before committing.

## Pull Request

- PR titles use Conventional Commit subject format: `type(scope): subject`.
- Prefer a repository PR template when one applies. Otherwise use only these sections, written so a reviewer grasps the change without reading the diff, and skip what they already know:
  - `## Summary`: 1–3 sentences: the outcome once merged, then why it is needed now. Link the issue.
  - `## Evidence`: before and after, above the level of the diff. Never copy diff lines or list changes by file. Omit when the diff reads at a glance.
    - Behavior: screenshots for UI; otherwise output or a test that fails before and passes after, pasted verbatim.
    - Structure: a `diff` or `text` block of a file tree, call tree, or pseudocode you write (`retry: caller → HTTP client`, not the code). Mermaid only for what text cannot show, such as sequences between parties; SVG (e.g. from D2) only when Mermaid lays it out badly.
    - Draw from `git diff` and the code, not memory, and check the rendered result, on the PR page if not locally.
  - `## Impact` (optional): one-way or two-way door, blast radius, and up to 3 things reviewers must know. Omit unchanged behavior and work not done.
- Create the PR with `gh pr create --draft --body-file <file>`, adding `--attach <image>` for each image the body references by that same path.
- Leave an existing PR's draft/ready state alone unless asked.
- After each push to a branch with an open PR, reread the title and body against the diff and `gh pr edit` what no longer matches.

## Review Loop

After opening a PR, get it reviewed by Copilot code review and settle the result without waiting for the user:

1. Request a review from `@copilot`. Each review costs AI credits, so request once per push.
2. Wait until `copilot-pull-request-reviewer[bot]` has reviewed the head commit; this usually takes a few minutes. After 10 minutes, stop and report.
3. Settle every unresolved thread with the `receiving-code-review` skill, running unattended. Read the review body too: Copilot lists findings on unchanged code there without opening a thread.
4. Commit and push accepted fixes. If there were any and fewer than three reviews have run, return to step 1; otherwise stop and report, naming fixes no review has seen.
