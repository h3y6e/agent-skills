---
name: framing-problems
description: Use when a request starts from vague pain, a solution idea, product idea, or "what should I build?" and the real problem, priority, or success criteria are unclear.
license: MIT
metadata:
  author: h3y6e
  version: 2026.8.0
---

# Framing Problems

Find the problem before shaping the solution. Use this when the user has a pain, idea, or direction, but the underlying problem is still fuzzy.

## Ground Rules

- Do not evaluate or propose solutions yet.
- Treat solution ideas as clues to the pain behind them.
- Ask one question at a time.
- Prefer recent concrete episodes over abstract opinions.
- Keep the user's own words visible in the output.
- Do not lead the user toward your suspected cause.
- If the request bundles independent problems, stop and surface the decomposition choice before refining details.

## When Not To Use

Skip this when the problem, priority, and success criteria are already clear enough to write a spec, issue, or design; move directly to that next artifact.

## Interview Moves

Start with the trigger:

- "What happened that made this feel worth solving?"
- "When did you last feel this pain?"
- "What are you doing today instead?"

Then deepen one problem at a time:

- **Specific scene**: when, where, who, what was happening
- **Frequency**: how often it happens
- **Impact**: time, money, risk, frustration, opportunity cost
- **Current workaround**: what the user does today and why it is not enough
- **Spread**: whether others have the same problem
- **Urgency**: what gets worse if nothing changes

When the user jumps to a solution, acknowledge it, then return to the scene that made the solution feel necessary.

Do not judge the solution idea or propose alternatives. Use it only as evidence of what felt painful enough to solve.

## Stop Conditions

Move to the output when at least one problem has a concrete scene, current workaround, impact, and priority reason. If multiple independent problems appear, stop with a decomposition recommendation. If key facts are still unknown after three focused questions, summarize the uncertainty instead of continuing indefinitely.

## Output

End with a problem map:

```markdown
# Problem Map: <theme>

## Summary
<2-3 sentences>

## Problems

### 1. <problem>
- Scene: <concrete episode>
- Frequency: <known or unknown>
- Impact: <cost or risk>
- Current workaround: <today's behavior>
- Priority reason: <why this ranks here>

## Priority
| Rank | Problem | Frequency | Impact | Confidence |
| --- | --- | --- | --- | --- |

## Material Uncertainties
- <unknown that would change priority, scope, or success criteria>

## Next Step
<research, hypothesis, spec, prototype, or no action>
```

## Common Mistakes

- Letting a proposed app, tool, or feature define the problem.
- Asking leading questions that smuggle in your theory.
- Asking broad surveys instead of grounding in a recent episode.
- Turning the interview into advice.
- Prioritizing by excitement instead of frequency, impact, spread, and urgency.
