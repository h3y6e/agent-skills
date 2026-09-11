---
description: Apply when integrating a new requirement into an existing design. Redesign as if the requirement had been a foundational assumption from day one, instead of bolting it on.
disable-model-invocation: true
metadata:
    github-path: pstack/skills/principle-redesign-from-first-principles
    github-ref: refs/heads/main
    github-repo: https://github.com/cursor/plugins
    github-tree-sha: 7d6b29659ee81f3e4ce5475b868bf891a8041e7c
name: principle-redesign-from-first-principles
---
# Redesign From First Principles

When integrating a change, don't bolt it onto the existing design. Redesign as if the requirement had been there from the start.

- Read all affected files and understand the current design
- Ask: "if we were writing this from scratch with this new requirement, what would we build?"
- Propagate the change through every reference: types, docs, examples, rationale sections
- Think about the whole redesign, then deliver it incrementally

This is the method for preserving option value when integrating changes into an existing design.
