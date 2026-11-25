---
description: Apply when concurrent actors might write to the same file, branch, key, or state object. Eliminate the sharing first; serialize structurally only when one shared writer is a real invariant.
disable-model-invocation: true
metadata:
    github-path: pstack/skills/principle-separate-before-serializing-shared-state
    github-ref: refs/heads/main
    github-repo: https://github.com/cursor/plugins
    github-tree-sha: 15bc5fb33e9b5848d3400857ebeac175044dc6c8
name: principle-separate-before-serializing-shared-state
---
# Separate Before Serializing Shared State

When concurrent actors might write the same file, branch, key, or object, first ask whether they need one shared object or are publishing independent facts. Default to giving each actor its own file, key, branch, or state directory, and merge only where the state is read. Two workers writing their own field into one `state.json` is still shared mutation.

Only when one shared write target is a real invariant, serialize access structurally (a lockfile, a single writer, sequential phases, compare-and-swap). Instructions are not concurrency control, and "we need a lock" is a smell to check first.
