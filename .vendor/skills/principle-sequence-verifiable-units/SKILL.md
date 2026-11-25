---
description: Apply to multi-step work (sweeps, migrations, runs of similar edits) and to how you stack commits and PRs. Break work into small units that each end in a verifiable state, check each before the next, and order delivery so the sequence proves itself to a reviewer.
disable-model-invocation: true
metadata:
    github-path: pstack/skills/principle-sequence-verifiable-units
    github-ref: refs/heads/main
    github-repo: https://github.com/cursor/plugins
    github-tree-sha: af35037d5f04bacc0654b6e05732d7ca37ff3023
name: principle-sequence-verifiable-units
---
# Sequence work into verifiable units

Order work as small units that each end in a state you can check, and do not advance until the current one is green.

In a sweep, migration, or run of similar edits, each unit is a bracket: known-good state, one change, run the check, proceed. Run the per-unit check even when a tool does the edits.

Deliver in the order that proves the work: the failing test first, then the fix. The subtraction before the reshape. The baseline before the treatment. Each commit lands on its own.
