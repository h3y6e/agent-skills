---
name: receiving-code-review
description: Turns review feedback into per-item verdicts backed by evidence from the codebase, before any fix is written. Use when review comments are in hand — fetched from a pull request, pasted into the conversation, or left by an automated reviewer such as Copilot code review, CodeRabbit, or another agent — and before acting on any of them, including when asked to just apply them, and when a suggestion looks unclear, wrong, or larger than the problem it solves.
license: MIT
metadata:
  author: h3y6e
  version: 2026.10.3
  refs: https://github.com/obra/superpowers/tree/v6.2.0/skills/receiving-code-review
---

# Receiving Code Review

A review comment is a hypothesis about the code, not a fact about it. Settle every item against the codebase first; fixes come after.

## Verdicts

Assign one verdict per item before editing anything. The evidence column is what makes the verdict reportable — without it, the item is still unsettled.

| Verdict | Evidence required | Next action |
| --- | --- | --- |
| accept | The reported behavior reproduced, or the cited code read and confirmed | Fix, then verify the fix |
| clarify | — | Ask what the item means before touching the code |
| push back | Code, test, or constraint that contradicts the suggestion | Reply with that evidence and a question |
| drop | No caller or usage found for the code the suggestion would grow | Propose deleting it instead |
| unverifiable | — | Report what you checked, and what would settle it |

The item is clear but nothing in reach proves or disproves it — a production-only failure, an external system's behavior — so it is unverifiable, not a push back: absence of supporting code is not contradicting evidence. Never quietly accept one either.

A suggestion that contradicts a decision the user already made outranks the table: it goes back to the user, not into the code.

Confidence in a reviewer is not evidence. Bots and agent reviewers report findings about code paths they never read, and a human may be reading an older revision; check either, and accept what holds up. Judge an outdated thread against the current code, not the hunk it was left on.

AI reviewers such as Copilot code review never read replies and re-raise items already settled. A repeat keeps its earlier verdict unless the code it cites has changed; re-judging the same evidence only flips the verdict back and forth.

## Clarify All Items First

Assign verdicts across every item before implementing any of them, and ask about all the unclear ones in a single reply. Hold any item sharing an assumption with an unclear one — fixing item 3 under a wrong reading of item 5 produces work that must be undone. Independent accepted items can proceed while you wait.

When no user can answer mid-run, as in a review loop, do not wait: fix accepted items, and for every other verdict reply with your reading and evidence and leave the code unchanged. Resolved threads drop out of sight, so list each non-accepted item with its verdict in the final report.

## Implement and Verify

Order accepted items: breakage and security first, then mechanical fixes, then the ones that need design. Verify each fix on its own before starting the next, and re-run the wider tests once the batch is done.

## Replying

Report the verdict and what settled it — "Reproduced, fixed in `parser.ts`", "Checked: no caller reaches this branch". Accepting is silent work; pushing back needs the contradicting evidence quoted, plus a question only for a reviewer who reads replies. If you pushed back and were wrong, say what you checked, what it showed, and that you are fixing it.

On GitHub, reply inside the comment's own thread and resolve the thread once handled, so the next pass sees only new items.
