---
description: Apply when integrating a new requirement into an existing design.
disable-model-invocation: true
metadata:
    github-path: pstack/skills/principle-redesign-from-first-principles
    github-ref: refs/heads/main
    github-repo: https://github.com/cursor/plugins
    github-tree-sha: 20822072ed14c75eed7f527f734c5d347c43845e
name: principle-redesign-from-first-principles
---
# Redesign From First Principles

When integrating a change, don't bolt it onto the existing design. Redesign as if the requirement had been a foundational assumption from the start.

- Read all affected files and understand the current design
- Ask: "if we were writing this from scratch with this new requirement, what would we build?"
- Propagate the change through every reference: types, docs, examples, rationale sections
- Think about the whole redesign, then deliver it incrementally

This is the method for preserving option value when integrating changes into an existing design.
