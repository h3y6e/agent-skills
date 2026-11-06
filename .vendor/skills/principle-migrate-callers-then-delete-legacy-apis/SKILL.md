---
description: Apply when introducing a new internal API while old callers still exist. Migrate callers and delete the old API in the same wave instead of preserving compatibility layers.
disable-model-invocation: true
metadata:
    github-path: pstack/skills/principle-migrate-callers-then-delete-legacy-apis
    github-ref: refs/heads/main
    github-repo: https://github.com/cursor/plugins
    github-tree-sha: cf45195158110569ac6a97d0e8dbed04531373ed
name: principle-migrate-callers-then-delete-legacy-apis
---
# Migrate Callers Then Delete Legacy APIs

- Update tests to assert the new contract, and delete tests that only protect pre-refactor implementation details

**When this applies:**
- No external users depend on backward compatibility
- The project can absorb coordinated breaking changes
- The new API is part of a simplification or refactor initiative
