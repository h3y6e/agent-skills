---
name: repairing-argument-gaps
description: Use when revising Japanese book chapters or technical prose whose argument breaks across paragraphs, especially abrupt topic jumps, unsupported theory/citations, A-B-A interruptions, empty columns, or claims that examples do not prove.
license: MIT
metadata:
  author: h3y6e
  version: 2026.8.0
  ref: https://gist.github.com/k16shikano/fd287c3133457c4fd8f5601d34aa817d?permalink_comment_id=6201959#gistcomment-6201959
---

# Repairing Argument Gaps

Repair the argumentative chain, not surface fluency. Use this when a draft reads smoothly in places, but paragraph roles, evidence, or handoffs do not hold.

**REQUIRED SUB-SKILL:** Use `writing-japanese` first. It supplies Japanese prose norms; this skill adds paragraph-role diagnosis and structural repair.

## Red Flags

- **Abrupt topic jump:** a paragraph opens with a term, question, or abstraction not prepared by the previous paragraph.
- **Paraphrase-as-bridge:** similar wording disguises an unsupported step, such as moving from "見抜く" to "見分ける".
- **Display theory:** a citation, formula, or named theory appears, but removing it would not change the next judgment.
- **Evidence mismatch:** the example, research, or concept answers a different question than the claim.
- **A-B-A interruption:** a different topic interrupts an unfinished object, and the draft later returns to that object.
- **Premature term:** a technical term appears before the concrete relation it is supposed to name.
- **Empty column:** a sidebar shares knowledge but does not help the reader make the next decision.

## Diagnose

1. Split the passage into paragraphs, columns, or logical units.
2. For each unit, write one sentence each for what it receives, does, and hands to the next unit.
3. Mark any unit whose receive/role/handoff sentence is vague, circular, or impossible to write.
4. Classify each mark with the red flags, then choose the structural repair before line editing.
5. Ask what would be lost if the unit were removed. If the answer is only "context", "depth", or "nice theory", cut or demote it.

## Repair Moves

- Make paragraph openings pick up an exact prior question, term, or unresolved tension.
- Reorder before polishing: keep paragraphs about the same object contiguous; move outside evidence after that object closes.
- Keep theory or citations only when they change the next claim, scope, distinction, or reader action.
- Narrow the claim to what the example actually supports, or replace the evidence.
- Explain the concrete relation first; introduce terms only after they name an already visible relation.
- Turn columns into operational questions for the main argument, or remove them.
- Re-run the receive/role/handoff check. Smooth prose does not count unless handoffs are explicit.

## Output

- `Gap map`: affected units, red flag, and failed receive/role/handoff.
- `Structural edits`: move, merge, cut, demote to column, restore to main text, or bridge.
- `Rewrite`: revised passage only when asked.
- `Residual risk`: claims still wider than their evidence, unresolved forward references, or theory that may still be decorative.
