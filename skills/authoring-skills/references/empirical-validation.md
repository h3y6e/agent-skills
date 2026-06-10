# Empirical Validation

Use this when a skill is high-importance, substantially revised, behaving unexpectedly, or the user asks for empirical evaluation. Skip it for small wording edits unless the trigger or behavior changed.

## Loop

1. **Static consistency**: compare frontmatter `description` with the body. If the description promises behavior the body does not cover, fix that before execution.
2. **Scenario setup**: define 2-3 realistic scenarios before evaluating. Use one median case and one or two edge cases.
3. **Requirements checklist**: for each scenario, define 3-7 judged items before execution. Include at least one `[critical]` item. Do not add, remove, or retag items after seeing results.
4. **Baseline**: for new skills, compare with no skill; for existing skills, snapshot the old version and compare old versus new.
5. **Fresh evaluator**: use a new evaluator/subagent for each round. Do not substitute self-rereading. If dispatch is unavailable, report `empirical validation skipped` or run static structural review only.
6. **Execution report**: evaluator runs the scenario with the target skill and reports requirement achievement, unclear points, discretionary fill-ins, retries, and phase weakness.
7. **Two-sided evaluation**: success is binary: any failed `[critical]` item means failure. Also record accuracy, unclear points, discretionary fill-ins, and optional step/duration/retry counts if available. For subjective outputs, collect user review before editing.
8. **Minimum fix**: before editing, state which checklist item or judgment wording the fix should satisfy. Apply one theme per iteration.
9. **Re-evaluate**: use a fresh evaluator again. Stop after two consecutive rounds with no new unclear points and no meaningful metric improvement. Use three rounds for high-importance skills.

If the same failure class recurs three or more times, stop patching wording and restructure the skill.

For trigger accuracy, use `description-tuning.md`.

## Evaluator Prompt

```markdown
You are a blank-slate evaluator for <skill name>.

## Target Skill
<path or full text>

## Scenario
<realistic task context>

## Requirements Checklist
1. [critical] <minimum bar>
2. <normal judged item>
3. <normal judged item>

## Task
Use the target skill to execute the scenario, then report:

- Deliverable:
- Requirement achievement: pass / fail / partial for each item
- Trace: Understanding / Planning / Execution / Formatting, with stuck or skipped phases
- Unclear points:
  - Issue:
  - Cause:
  - General Fix Rule:
- Discretionary fill-ins:
- Retries:
```

## Result Record

```markdown
## Iteration N

### Changes
- <minimum fix and checklist item it targets>

### Results
| Scenario | Success | Accuracy | Weak phase | New unclear points |
| --- | --- | --- | --- | --- |

### Ledger
- Added/Re-seen: <failure class> - <why the existing instruction did not prevent it>

### Next
- <next minimum fix or stop reason>
```
