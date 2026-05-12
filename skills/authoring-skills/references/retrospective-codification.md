# Retrospective Codification

Use this when a task produced a reusable lesson through trial and error, or the user asks to codify a lesson. Do not run it automatically after every task.

## Core Rule

Codify only paired lessons:

- first failure: what was tried first and how it failed
- final solution: what worked
- bridging insight: what should have been known first

Write the insight as a future-facing instruction, not as session history.

## Loop

1. **Extract**: record first failure, final solution, bridging insight, and one imperative future instruction.
2. **Dedup**: search existing skills, project instructions, and rules with 2-3 keys from the insight. If fully covered, make no proposal. If partially covered, append/update instead of adding a new skill.
3. **Classify destination**:
   - mechanically detectable -> lint/static rule, not prose
   - short always-on instruction -> project or user agent instruction
   - multi-step procedure, judgment, or template -> append to an existing skill or create a skill
   - one-off or project-specific detail -> note, issue, PR, or no adoption
4. **Prefer smallest durable form**: lint over prose for detectable cases; append/absorb over new skill; new skill only for standalone recurring value.
5. **Write only requested scope**: if changing persistent agent behavior outside the user's explicit request, present the proposal and wait.

## Output

```markdown
## Retrospective
- First failure:
- Final solution:
- Insight:

## Proposals
- Adoption candidates:
- Duplicate detected:
- Not adopted:

## Validation
- Destination rationale:
- Dedup evidence:
- Write approval or explicit request:
```

## Red Flags

- final solution without the failure side
- "just in case" skill
- mechanically enforceable rule written only in prose
- skipped dedup check
- silent persistent behavior change
- thin insight written to save face
